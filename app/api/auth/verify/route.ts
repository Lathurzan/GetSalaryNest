import { NextResponse } from "next/server";
import User from "@/models/User";
import { hashToken } from "@/lib/verify";
import { dbConnect } from "@/lib/db";

export async function POST(req: Request) {
  const { token } = await req.json();
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  await dbConnect();
  const hash = hashToken(token);

  const user = await User.findOne({
    verifyTokenHash: hash,
    verifyTokenExpires: { $gt: new Date() },
  }).select("+verifyTokenHash +verifyTokenExpires pendingEmail email emailVerified");

  if (!user) {
    return NextResponse.json({ error: "Link is invalid or expired" }, { status: 400 });
  }

  // if this was an email-change verification, swap the email in now
  if (user.pendingEmail) {
    user.email = user.pendingEmail;
    user.pendingEmail = undefined;
  }

  user.emailVerified = true;
  user.verifyTokenHash = undefined;
  user.verifyTokenExpires = undefined;
  await user.save();

  return NextResponse.json({ ok: true });
}