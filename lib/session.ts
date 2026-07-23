import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";

export async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  await dbConnect();
  return {
    id: new mongoose.Types.ObjectId(session.user.id),
    plan: session.user.plan ?? "free",
    isPremium: session.user.isPremium ?? false,
    currency: session.user.currency ?? "GBP",
  };
}