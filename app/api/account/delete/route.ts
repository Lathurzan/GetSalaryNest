import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { requireUser } from "@/lib/session";
import User from "@/models/User";
import Expense from "@/models/Expense";
import Income from "@/models/Income";
import Category from "@/models/Category";
import SavingsGoal from "@/models/SavingsGoal";

export const runtime = "nodejs";

export async function DELETE() {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const userId = user.id; // ObjectId of the *authenticated* user only

  try {
    // try a transaction (requires a replica set — Atlas provides one)
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        await Expense.deleteMany({ userId }, { session });
        await Income.deleteMany({ userId }, { session });
        await Category.deleteMany({ userId }, { session });
        await SavingsGoal.deleteMany({ userId }, { session });
        await User.deleteOne({ _id: userId }, { session });
      });
    } finally {
      await session.endSession();
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    // fallback for standalone MongoDB (no transaction support)
    if (
      e?.code === 20 ||
      /Transaction numbers|replica set|not supported/i.test(e?.message ?? "")
    ) {
      try {
        await Promise.all([
          Expense.deleteMany({ userId }),
          Income.deleteMany({ userId }),
          Category.deleteMany({ userId }),
          SavingsGoal.deleteMany({ userId }),
        ]);
        await User.deleteOne({ _id: userId });
        return NextResponse.json({ success: true });
      } catch (inner: any) {
        console.error("ACCOUNT DELETE (fallback) ERROR:", inner);
        return NextResponse.json(
          { error: "Failed to delete account" },
          { status: 500 }
        );
      }
    }

    console.error("ACCOUNT DELETE ERROR:", e);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}