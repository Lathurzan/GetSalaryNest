import { NextResponse } from "next/server";
import Expense from "@/models/Expense";
import Income from "@/models/Income";
import Category from "@/models/Category";
import SavingsGoal from "@/models/SavingsGoal";
import { requireUser } from "@/lib/session";
import { monthKey } from "@/lib/dates";
import { resolveTarget } from "@/lib/savings";

// touch the model so $lookup can resolve the categories collection
void Category;

export async function GET(req: Request) {
  try {
    const user = await requireUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month") ?? monthKey(new Date());
    const userId = user.id;

    const [y, m] = month.split("-").map(Number);
    const prev = monthKey(new Date(y, m - 2, 1));

    const [aggRaw] = await Expense.aggregate([
      { $match: { userId, month: { $in: [month, prev] } } },
      {
        $facet: {
          totals: [
            { $match: { month } },
            { $group: { _id: null, spent: { $sum: "$amount" } } },
          ],
          prevTotals: [
            { $match: { month: prev } },
            { $group: { _id: null, spent: { $sum: "$amount" } } },
          ],
          byCategory: [
            { $match: { month } },
            { $group: { _id: "$categoryId", spent: { $sum: "$amount" } } },
            {
              $lookup: {
                from: "categories",
                localField: "_id",
                foreignField: "_id",
                as: "cat",
              },
            },
            { $unwind: "$cat" },
            {
              $project: {
                _id: 1,
                spent: 1,
                name: "$cat.name",
                icon: "$cat.icon",
                color: "$cat.color",
                type: "$cat.type",
              },
            },
            { $sort: { spent: -1 } },
          ],
          recent: [
            { $match: { month } },
            { $sort: { date: -1 } },
            { $limit: 6 },
            {
              $lookup: {
                from: "categories",
                localField: "categoryId",
                foreignField: "_id",
                as: "cat",
              },
            },
            { $unwind: "$cat" },
            {
              $project: {
                _id: 1,
                amount: 1,
                note: 1,
                date: 1,
                type: "$cat.type",
                category: {
                  name: "$cat.name",
                  icon: "$cat.icon",
                  color: "$cat.color",
                },
              },
            },
          ],
        },
      },
    ]);

    const agg = aggRaw ?? {
      totals: [],
      prevTotals: [],
      byCategory: [],
      recent: [],
    };

    const [incomeAgg] = await Income.aggregate([
      { $match: { userId, month } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const income = incomeAgg?.total ?? 0;
    const spent = agg.totals[0]?.spent ?? 0;
    const lastMonthSpent = agg.prevTotals[0]?.spent ?? 0;

    const saved = agg.byCategory
      .filter((c: any) => c.type === "savings")
      .reduce((sum: number, c: any) => sum + c.spent, 0);

    const goal = await SavingsGoal.findOneAndUpdate(
      { userId, month },
      {
        $setOnInsert: {
          userId,
          month,
          mode: "percent",
          percentTarget: 20,
          fixedTarget: 0,
          label: "Monthly savings",
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const target = resolveTarget(
      goal.mode,
      goal.percentTarget,
      goal.fixedTarget,
      income
    );

    if (goal.resolvedTarget !== target || goal.savedAmount !== saved) {
      goal.resolvedTarget = target;
      goal.savedAmount = saved;
      await goal.save();
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
  } catch (e: any) {
    console.error("DASHBOARD ERROR:", e);
    return NextResponse.json(
      { error: e.message, name: e.name },
      { status: 500 }
    );
  }
}