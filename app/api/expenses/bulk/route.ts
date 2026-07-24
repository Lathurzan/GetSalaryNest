import { NextResponse } from "next/server";
import { z } from "zod";
import Expense from "@/models/Expense";
import Category from "@/models/Category";
import { requireUser } from "@/lib/session";
import { monthKey } from "@/lib/dates";

const schema = z.object({
  rows: z.array(
    z.object({
      categoryId: z.string().length(24),
      amount: z.number().int().min(1),
      note: z.string().max(200).optional(),
      date: z.string(),
    })
  ).min(1).max(200),
});

export async function POST(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const owned = await Category.find({ userId: user.id }).select("_id").lean();
  const ownedIds = new Set(owned.map((c: any) => String(c._id)));

  const docs = parsed.data.rows
    .filter((r) => ownedIds.has(r.categoryId))
    .map((r) => ({
      userId: user.id,
      categoryId: r.categoryId,
      amount: r.amount,
      note: r.note,
      date: new Date(r.date),
      month: monthKey(r.date),
      source: "pdf-import",
    }));

  if (!docs.length) {
    return NextResponse.json({ error: "No valid rows" }, { status: 400 });
  }

  await Expense.insertMany(docs);
  return NextResponse.json({ imported: docs.length }, { status: 201 });
}