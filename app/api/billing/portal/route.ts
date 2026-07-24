import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import User from "@/models/User";
import { requireUser } from "@/lib/session";

export async function POST() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const dbUser = await User.findById(user.id);
  if (!dbUser?.customerId) {
    return NextResponse.json({ error: "No subscription" }, { status: 400 });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: dbUser.customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
  });

  return NextResponse.json({ url: session.url });
}