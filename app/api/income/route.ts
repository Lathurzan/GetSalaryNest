import { NextResponse } from "next/server";
import { z } from "zod";
import Income from "@/models/Income";
import { requireUser } from "@/lib/session";
import { monthKey } from "@/lib/dates";

export async function GET(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month") ?? monthKey(new Date());

  const items = await Income.find({ userId: user.id, month }).sort({ date: -1 }).lean();
  const total = items.reduce((s, i: any) => s + i.amount, 0);

  return NextResponse.json({ items, total });
}

const schema = z.object({
  amount: z.number().int().min(0),
  source: z.string().max(60).default("Salary"),
  date: z.string(),
  note: z.string().max(200).optional(),
});

export async function POST(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { amount, source, date, note } = parsed.data;
  const month = monthKey(date);

  // one primary income per source per month — upsert
  const income = await Income.findOneAndUpdate(
    { userId: user.id, month, source },
    { amount, date: new Date(date), note, userId: user.id, month, source },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return NextResponse.json({ _id: income._id }, { status: 201 });
}