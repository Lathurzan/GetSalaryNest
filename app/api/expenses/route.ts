import { NextResponse } from "next/server";
import { z } from "zod";
import Expense from "@/models/Expense";
import Category from "@/models/Category";
import { requireUser } from "@/lib/session";
import { monthKey } from "@/lib/dates";
import { limitsFor } from "@/lib/limits";

const createSchema = z.object({
  categoryId: z.string().length(24),
  amount: z.number().int().min(1),        // pence
  note: z.string().max(200).optional(),
  date: z.string(),                        // ISO
  receiptUrl: z.string().url().optional(),
  receiptPublicId: z.string().optional(),
});

export async function GET(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month") ?? monthKey(new Date());
  const categoryId = searchParams.get("categoryId");
  const page = Number(searchParams.get("page") ?? 1);
  const limit = 30;

  const filter: any = { userId: user.id, month };
  if (categoryId) filter.categoryId = categoryId;

  const [items, total] = await Promise.all([
    Expense.find(filter)
      .populate("categoryId", "name icon color type")
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Expense.countDocuments(filter),
  ]);

  return NextResponse.json({
    items: items.map((e: any) => ({
      _id: e._id,
      amount: e.amount,
      note: e.note,
      date: e.date,
      receiptUrl: e.receiptUrl,
      type: e.categoryId?.type ?? "expense",
      category: {
        _id: e.categoryId?._id,
        name: e.categoryId?.name ?? "Uncategorised",
        icon: e.categoryId?.icon ?? "Wallet",
        color: e.categoryId?.color ?? "#999",
      },
    })),
    total,
    page,
    hasMore: page * limit < total,
  });
}

export async function POST(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { categoryId, amount, note, date, receiptUrl, receiptPublicId } = parsed.data;
  const month = monthKey(date);
  const limits = limitsFor(user.plan);

  // free-tier expense cap
  const count = await Expense.countDocuments({ userId: user.id, month });
  if (count >= limits.expensesPerMonth) {
    return NextResponse.json(
      { error: "LIMIT_REACHED", limit: limits.expensesPerMonth },
      { status: 403 }
    );
  }

  // receipts are premium-only
  if (receiptUrl && !limits.receipts) {
    return NextResponse.json({ error: "PREMIUM_REQUIRED" }, { status: 403 });
  }

  // category must belong to this user
  const cat = await Category.findOne({ _id: categoryId, userId: user.id });
  if (!cat) return NextResponse.json({ error: "Invalid category" }, { status: 400 });

  const expense = await Expense.create({
    userId: user.id,
    categoryId,
    amount,
    note,
    date: new Date(date),
    month,
    receiptUrl,
    receiptPublicId,
  });

  return NextResponse.json({ _id: expense._id }, { status: 201 });
}