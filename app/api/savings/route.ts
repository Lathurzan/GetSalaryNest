import { NextResponse } from "next/server";
import { z } from "zod";
import SavingsGoal from "@/models/SavingsGoal";
import Income from "@/models/Income";
import { requireUser } from "@/lib/session";
import { monthKey } from "@/lib/dates";
import { resolveTarget } from "@/lib/savings";

export async function GET(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month") ?? monthKey(new Date());

  const goal = await SavingsGoal.findOne({ userId: user.id, month }).lean();

  return NextResponse.json(
    goal ?? { mode: "percent", percentTarget: 20, fixedTarget: 0, resolvedTarget: 0, savedAmount: 0 }
  );
}

const schema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/),
  mode: z.enum(["percent", "fixed"]),
  percentTarget: z.number().min(0).max(100).optional(),
  fixedTarget: z.number().int().min(0).optional(),
  label: z.string().max(60).optional(),
});

export async function PUT(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { month, mode, percentTarget = 20, fixedTarget = 0, label } = parsed.data;

  const [inc] = await Income.aggregate([
    { $match: { userId: user.id, month } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const income = inc?.total ?? 0;

  const goal = await SavingsGoal.findOneAndUpdate(
    { userId: user.id, month },
    {
      userId: user.id,
      month,
      mode,
      percentTarget,
      fixedTarget,
      resolvedTarget: resolveTarget(mode, percentTarget, fixedTarget, income),
      ...(label ? { label } : {}),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return NextResponse.json(goal);
}