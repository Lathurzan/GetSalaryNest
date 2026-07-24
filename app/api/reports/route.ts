import { NextResponse } from "next/server";
import Expense from "@/models/Expense";
import Income from "@/models/Income";
import { requireUser } from "@/lib/session";
import { monthKey } from "@/lib/dates";
import { limitsFor } from "@/lib/limits";

export async function GET(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month") ?? monthKey(new Date());
  const limits = limitsFor(user.plan);

  // build the trailing window, capped by plan
  const span = Math.min(6, limits.historyMonths === Infinity ? 6 : limits.historyMonths);
  const [y, m] = month.split("-").map(Number);
  const months: string[] = [];
  for (let i = span - 1; i >= 0; i--) {
    months.push(monthKey(new Date(y, m - 1 - i, 1)));
  }

  const [expenseAgg] = await Expense.aggregate([
    { $match: { userId: user.id, month: { $in: months } } },
    {
      $facet: {
        byMonth: [
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
            $group: {
              _id: "$month",
              spent: {
                $sum: { $cond: [{ $eq: ["$cat.type", "savings"] }, 0, "$amount"] },
              },
              saved: {
                $sum: { $cond: [{ $eq: ["$cat.type", "savings"] }, "$amount", 0] },
              },
            },
          },
        ],
        byCategory: [
          { $match: { month } },
          { $group: { _id: "$categoryId", spent: { $sum: "$amount" }, count: { $sum: 1 } } },
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
              count: 1,
              name: "$cat.name",
              icon: "$cat.icon",
              color: "$cat.color",
              type: "$cat.type",
              budget: "$cat.budget",
            },
          },
          { $sort: { spent: -1 } },
        ],
        byDay: [
          { $match: { month } },
          {
            $group: {
              _id: { $dayOfMonth: "$date" },
              spent: { $sum: "$amount" },
            },
          },
          { $sort: { _id: 1 } },
        ],
      },
    },
  ]);

  const incomeByMonth = await Income.aggregate([
    { $match: { userId: user.id, month: { $in: months } } },
    { $group: { _id: "$month", total: { $sum: "$amount" } } },
  ]);

  const spentMap = new Map(expenseAgg.byMonth.map((r: any) => [r._id, r]));
  const incomeMap = new Map(incomeByMonth.map((r: any) => [r._id, r.total]));

  const trend = months.map((key) => {
    const row: any = spentMap.get(key) ?? { spent: 0, saved: 0 };
    return {
      month: key,
      label: new Date(Number(key.slice(0, 4)), Number(key.slice(5)) - 1)
        .toLocaleString("en-GB", { month: "short" }),
      spent: row.spent,
      saved: row.saved,
      income: incomeMap.get(key) ?? 0,
    };
  });

  return NextResponse.json({
    month,
    trend,
    categories: expenseAgg.byCategory,
    daily: expenseAgg.byDay.map((d: any) => ({ day: d._id, spent: d.spent })),
    limitedHistory: limits.historyMonths !== Infinity,
  });
}