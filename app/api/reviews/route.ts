import { NextResponse } from "next/server";
import { z } from "zod";
import Review from "@/models/Review";
import User from "@/models/User";
import { requireUser } from "@/lib/session";
import { dbConnect } from "@/lib/db";

// ── public: approved reviews for the marketing wall ──
export async function GET() {
  await dbConnect();

  const reviews = await Review.find({ status: "approved" })
    .select("userName rating comment createdAt")
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  const [agg] = await Review.aggregate([
    { $match: { status: "approved" } },
    { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  return NextResponse.json({
    reviews,
    average: agg ? Math.round(agg.avg * 10) / 10 : 0,
    count: agg?.count ?? 0,
  });
}

// ── authenticated: submit or update your review ──
const schema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
});

export async function POST(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const dbUser = await User.findById(user.id).select("name").lean();
  const userName = (dbUser as any)?.name ?? "SalaryNest user";

  // upsert — new submissions and edits both go back to pending
  const review = await Review.findOneAndUpdate(
    { userId: user.id },
    {
      userId: user.id,
      userName,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
      status: "pending",
      moderatedAt: null,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return NextResponse.json({ id: review._id, status: review.status }, { status: 201 });
}