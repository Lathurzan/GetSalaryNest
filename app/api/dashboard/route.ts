import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import Expense from "@/models/Expense";
import Income from "@/models/Income";
import SavingsGoal from "@/models/SavingsGoal";
import { monthKey } from "@/lib/dates";
import { resolveTarget } from "@/lib/savings";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  await dbConnect();

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month") ?? monthKey(new Date());
  const userId = new mongoose.Types.ObjectId(session.user.id);

  // previous month key
  const [y, m] = month.split("-").map(Number);
  const prev = monthKey(new Date(y, m - 2, 1));

  const [agg] = await Expense.aggregate([
    { $match: { userId, month: { $in: [month, prev] } } },
    {
      $facet: {
        totals: [
          { $match: { month } },
          { $group: { _id: null, spent: { $sum: "$amount" }, count: { $sum: 1 } } },
        ],
        prevTotals: [
          { $match: { month: prev } },
          { $group: { _id: null, spent: { $sum: "$amount" } } },
        ],
        byCategory: [
          { $match: { month } },
          { $group: { _id: "$categoryId", spent: { $sum: "$amount" } } },
          { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "cat" } },
          { $unwind: "$cat" },
          {
            $project: {
              _id: 1, spent: 1,
              name: "$cat.name", icon: "$cat.icon",
              color: "$cat.color", type: "$cat.type",
            },
          },
          { $sort: { spent: -1 } },
        ],
        recent: [
          { $match: { month } },
          { $sort: { date: -1 } },
          { $limit: 6 },
          { $lookup: { from: "categories", localField: "categoryId", foreignField: "_id", as: "cat" } },
          { $unwind: "$cat" },
          {
            $project: {
              _id: 1, amount: 1, note: 1, date: 1,
              type: "$cat.type",
              category: { name: "$cat.name", icon: "$cat.icon", color: "$cat.color" },
            },
          },
        ],
      },
    },
  ]);

  const [incomeAgg] = await Income.aggregate([
    { $match: { userId, month } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const income = incomeAgg?.total ?? 0;
  const spent = agg.totals[0]?.spent ?? 0;
  const lastMonthSpent = agg.prevTotals[0]?.spent ?? 0;

  // savings = expenses filed under a savings-type category
  const saved = agg.byCategory
    .filter((c: any) => c.type === "savings")
    .reduce((sum: number, c: any) => sum + c.spent, 0);

  let goal = await SavingsGoal.findOne({ userId, month });
  if (!goal) {
    goal = await SavingsGoal.create({
      userId, month, mode: "percent", percentTarget: 20,
      resolvedTarget: resolveTarget("percent", 20, 0, income),
      savedAmount: saved,
    });
  } else {
    const target = resolveTarget(goal.mode, goal.percentTarget, goal.fixedTarget, income);
    if (goal.resolvedTarget !== target || goal.savedAmount !== saved) {
      goal.resolvedTarget = target;
      goal.savedAmount = saved;
      await goal.save();
    }
  }

  return NextResponse.json({
    month,
    income,
    spent,
    saved,
    lastMonthSpent,
    remaining: income - spent,
    savingsGoal: {
      mode: goal.mode,
      percentTarget: goal.percentTarget,
      target: goal.resolvedTarget,
      saved: goal.savedAmount,
      progress: goal.resolvedTarget
        ? Math.min(100, Math.round((goal.savedAmount / goal.resolvedTarget) * 100))
        : 0,
      label: goal.label,
    },
    categories: agg.byCategory.filter((c: any) => c.type !== "savings"),
    recent: agg.recent,
  });
}