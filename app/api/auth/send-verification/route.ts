import { NextResponse } from "next/server";
import User from "@/models/User";
import { requireUser } from "@/lib/session";
import { makeVerifyToken } from "@/lib/verify";
import { sendVerificationEmail } from "@/lib/email";
import { dbConnect } from "@/lib/db";

export async function POST() {
  const sessionUser = await requireUser();
  if (!sessionUser) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  await dbConnect();
  const user = await User.findById(sessionUser.id).select("name email emailVerified");
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (user.emailVerified) return NextResponse.json({ ok: true, already: true });

  const { raw, hash, expires } = makeVerifyToken();
  user.verifyTokenHash = hash;
  user.verifyTokenExpires = expires;
  await user.save();

  const link = `${process.env.NEXTAUTH_URL}/verify?token=${raw}`;
  await sendVerificationEmail(user.email, user.name, link);

  return NextResponse.json({ ok: true });
}