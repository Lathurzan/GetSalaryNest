import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export const runtime = "nodejs";

function periodEnd(sub: any): Date | undefined {
  const ts = sub?.items?.data?.[0]?.current_period_end ?? sub?.current_period_end;
  return ts ? new Date(ts * 1000) : undefined;
}

export async function POST(req: Request) {
  const body = await req.text(); // raw body, not JSON
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (e: any) {
    console.error("Webhook signature failed:", e.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  await dbConnect();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId ?? session.client_reference_id;
        if (!userId || !session.subscription) break;

        const sub = (await stripe.subscriptions.retrieve(
          session.subscription as string
        )) as unknown as Stripe.Subscription;

        await User.findByIdAndUpdate(userId, {
          plan: "premium",
          subscriptionId: sub.id,
          subscriptionStatus: sub.status,
          customerId: session.customer as string,
          billingProvider: "stripe",
          planExpiresAt: periodEnd(sub),
        });
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const active = ["active", "trialing"].includes(sub.status);

        await User.findOneAndUpdate(
          { customerId: sub.customer as string },
          {
            plan: active ? "premium" : "free",
            subscriptionStatus: sub.status,
            planExpiresAt: periodEnd(sub),
          }
        );
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await User.findOneAndUpdate(
          { customerId: sub.customer as string },
          {
            plan: "free",
            subscriptionStatus: "cancelled",
            subscriptionId: null,
          }
        );
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await User.findOneAndUpdate(
          { customerId: invoice.customer as string },
          { subscriptionStatus: "past_due" }
        );
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (e: any) {
    console.error("WEBHOOK HANDLER ERROR:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}