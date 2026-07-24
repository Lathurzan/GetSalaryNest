import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { requireUser } from "@/lib/session";
import { limitsFor } from "@/lib/limits";

export async function POST() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  if (!limitsFor(user.plan).receipts) {
    return NextResponse.json({ error: "PREMIUM_REQUIRED" }, { status: 403 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = `salarynest/${user.id.toString()}`;

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET!
  );

  return NextResponse.json({
    signature,
    timestamp,
    folder,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  });
}

export async function DELETE(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { publicId } = await req.json();

  // only allow deleting from this user's own folder
  if (!publicId?.startsWith(`salarynest/${user.id.toString()}/`)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await cloudinary.uploader.destroy(publicId);
  return NextResponse.json({ ok: true });
}