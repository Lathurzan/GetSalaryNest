import { NextResponse } from "next/server";
import { z } from "zod";
import BugReport from "@/models/BugReport";
import User from "@/models/User";
import { requireUser } from "@/lib/session";

const schema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(2000),
  area: z.enum(["expenses", "income", "reports", "billing", "import", "other"]).default("other"),
  pageUrl: z.string().optional(),
  userAgent: z.string().optional(),
});

export async function POST(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const dbUser = await User.findById(user.id).select("name email").lean();

  const bug = await BugReport.create({
    userId: user.id,
    userName: (dbUser as any)?.name ?? "Unknown",
    userEmail: (dbUser as any)?.email ?? "",
    ...parsed.data,
  });

  return NextResponse.json({ id: bug._id }, { status: 201 });
}