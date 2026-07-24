import { NextResponse } from "next/server";
import { z } from "zod";
import Category from "@/models/Category";
import Expense from "@/models/Expense";
import { requireUser } from "@/lib/session";

const patchSchema = z.object({
  name: z.string().min(1).max(40).optional(),
  icon: z.string().optional(),
  color: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
  budget: z.number().int().min(0).optional(),
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

  const cat = await Category.findOneAndUpdate(
    { _id: id, userId: user.id },
    parsed.data,
    { new: true }
  );

  if (!cat) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(cat);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const inUse = await Expense.countDocuments({ userId: user.id, categoryId: id });

  if (inUse > 0) {
    // archive rather than delete — keeps historical expenses intact
    await Category.findOneAndUpdate({ _id: id, userId: user.id }, { archived: true });
    return NextResponse.json({ ok: true, archived: true });
  }

  await Category.findOneAndDelete({ _id: id, userId: user.id });
  return NextResponse.json({ ok: true, deleted: true });
}