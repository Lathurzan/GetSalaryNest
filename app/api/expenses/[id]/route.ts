import { NextResponse } from "next/server";
import { z } from "zod";
import Expense from "@/models/Expense";
import { requireUser } from "@/lib/session";
import { monthKey } from "@/lib/dates";

const patchSchema = z.object({
  categoryId: z.string().length(24).optional(),
  amount: z.number().int().min(1).optional(),
  note: z.string().max(200).optional(),
  date: z.string().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const parsed = patchSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const update: any = { ...parsed.data };
  if (update.date) {
    update.date = new Date(update.date);
    update.month = monthKey(update.date);
  }

  const expense = await Expense.findOneAndUpdate(
    { _id: id, userId: user.id },
    update,
    { new: true }
  );

  if (!expense) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const expense = await Expense.findOneAndDelete({ _id: id, userId: user.id });
  if (!expense) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}