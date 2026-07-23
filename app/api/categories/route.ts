import { NextResponse } from "next/server";
import { z } from "zod";
import Category from "@/models/Category";
import { requireUser } from "@/lib/session";
import { limitsFor } from "@/lib/limits";

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const items = await Category.find({ userId: user.id, archived: false })
    .sort({ type: 1, name: 1 })
    .lean();

  return NextResponse.json({ items });
}

const createSchema = z.object({
  name: z.string().min(1).max(40),
  icon: z.string().default("Wallet"),
  color: z.string().regex(/^#[0-9a-f]{6}$/i).default("#14b8a6"),
  type: z.enum(["expense", "savings"]).default("expense"),
});

export async function POST(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const limits = limitsFor(user.plan);
  const customCount = await Category.countDocuments({
    userId: user.id,
    isDefault: false,
  });

  if (customCount >= limits.customCategories) {
    return NextResponse.json({ error: "PREMIUM_REQUIRED" }, { status: 403 });
  }

  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  try {
    const cat = await Category.create({ ...parsed.data, userId: user.id });
    return NextResponse.json(cat, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Category already exists" }, { status: 409 });
  }
}