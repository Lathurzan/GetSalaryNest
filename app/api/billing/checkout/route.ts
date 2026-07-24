import { NextResponse } from "next/server";
import { z } from "zod";
import { stripe, PRICES } from "@/lib/stripe";
import User from "@/models/User";
import { requireUser } from "@/lib/session";

const schema = z.object({ interval: z.enum(["monthly", "yearly"]) });

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const dbUser = await User.findById(user.id);
    if (!dbUser) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // reuse or create the Stripe customer
    let customerId = dbUser.customerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: dbUser.email,
        name: dbUser.name ?? undefined,
        metadata: { userId: String(dbUser._id) },
      });
      customerId = customer.id;
      dbUser.customerId = customerId;
      dbUser.billingProvider = "stripe";
      await dbUser.save();
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: PRICES[parsed.data.interval], quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      client_reference_id: String(dbUser._id),
      metadata: { userId: String(dbUser._id) },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    console.error("CHECKOUT ERROR:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}