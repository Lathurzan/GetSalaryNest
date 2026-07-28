import { NextResponse } from "next/server";
import Review from "@/models/Review";
import { requireUser } from "@/lib/session";

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const review = await Review.findOne({ userId: user.id })
    .select("rating comment status")
    .lean();

  return NextResponse.json({ review: review ?? null });
}