import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import Category from "@/models/Category";
import { DEFAULT_CATEGORIES } from "@/lib/seed";

const schema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;
    await dbConnect();

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
    });

    await Category.insertMany(
      DEFAULT_CATEGORIES.map((c) => ({ ...c, userId: user._id, isDefault: true }))
    );

    return NextResponse.json({ id: user._id.toString() }, { status: 201 });
  } catch (e) {
    console.error("register error", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}