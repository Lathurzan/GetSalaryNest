import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import Expense from "@/models/Expense";
import Income from "@/models/Income";
import Category from "@/models/Category";
import User from "@/models/User";
import SavingsGoal from "@/models/SavingsGoal";
import { requireUser } from "@/lib/session";
import { monthKey, monthLabel } from "@/lib/dates";
import { limitsFor } from "@/lib/limits";
import MonthlyReport from "@/lib/pdf/MonthlyReport";

void Category;

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const user = await requireUser();
    if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

    if (!limitsFor(user.plan).pdfExport) {
      return NextResponse.json({ error: "PREMIUM_REQUIRED" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month") ?? monthKey(new Date());

    const [dbUser, expenses, incomeAgg, goal] = await Promise.all([
      User.findById(user.id).select("name email").lean(),
      Expense.find({ userId: user.id, month })
        .populate("categoryId", "name color type")
        .sort({ date: -1 })
        .lean(),
      Income.aggregate([
        { $match: { userId: user.id, month } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      SavingsGoal.findOne({ userId: user.id, month }).lean(),
    ]);

    const income = incomeAgg[0]?.total ?? 0;

    const rows = expenses.map((e: any) => ({
      _id: String(e._id),
      amount: e.amount,
      note: e.note,
      date: e.date.toISOString(),
      type: e.categoryId?.type ?? "expense",
      color: e.categoryId?.color ?? "#999",
      category: { name: e.categoryId?.name ?? "Uncategorised" },
    }));

    const spendRows = rows.filter((r) => r.type !== "savings");
    const saved = rows
      .filter((r) => r.type === "savings")
      .reduce((s, r) => s + r.amount, 0);
    const spent = spendRows.reduce((s, r) => s + r.amount, 0);

    const catMap = new Map<string, any>();
    for (const r of spendRows) {
      const key = r.category.name;
      const existing = catMap.get(key);
      if (existing) {
        existing.spent += r.amount;
        existing.count += 1;
      } else {
        catMap.set(key, { _id: key, name: key, color: r.color, spent: r.amount, count: 1 });
      }
    }

    const categories = [...catMap.values()].sort((a, b) => b.spent - a.spent);

    const buffer = await renderToBuffer(
      React.createElement(MonthlyReport, {
        monthLabel: monthLabel(month),
        userName: (dbUser as any)?.name ?? (dbUser as any)?.email ?? "",
        income,
        spent,
        saved,
        savingsTarget: (goal as any)?.resolvedTarget ?? 0,
        categories,
        expenses: spendRows,
      }) as any
    );

    return new NextResponse(buffer as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="salarynest-${month}.pdf"`,
      },
    });
  } catch (e: any) {
    console.error("PDF EXPORT ERROR:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}