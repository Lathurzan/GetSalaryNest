"use client";

import { useState, useRef } from "react";
import { Camera, X, Loader2, Lock } from "lucide-react";

interface Props {
  value?: string;
  publicId?: string;
  onChange: (url?: string, publicId?: string) => void;
  isPremium: boolean;
  onUpgrade: () => void;
}

export default function ReceiptUpload({
  value, publicId, onChange, isPremium, onUpgrade,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const pick = () => {
    if (!isPremium) return onUpgrade();
    inputRef.current?.click();
  };

  const upload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      return setError("Image must be under 5MB");
    }

    setUploading(true);
    setError("");

    try {
      const sigRes = await fetch("/api/upload", { method: "POST" });
      if (!sigRes.ok) throw new Error("Upload not available on your plan");
      const sig = await sigRes.json();

      const form = new FormData();
      form.append("file", file);
      form.append("api_key", sig.apiKey);
      form.append("timestamp", sig.timestamp);
      form.append("signature", sig.signature);
      form.append("folder", sig.folder);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
        { method: "POST", body: form }
      );

      const data = await res.json();
      if (data.error) throw new Error(data.error.message);

      onChange(data.secure_url, data.public_id);
    } catch (e: any) {
      setError(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const remove = async () => {
    if (publicId) {
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId }),
      });
    }
    onChange(undefined, undefined);
  };

  if (value) {
    return (
      <div className="relative">
        <img
          src={value}
          alt="Receipt"
          className="h-28 w-full rounded-xl object-cover"
        />
        <button
          type="button"
          onClick={remove}
          className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
      />

      <button
        type="button"
        onClick={pick}
        disabled={uploading}
        className="flex h-20 w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-neutral-200 text-neutral-400 transition hover:border-neutral-300 dark:border-white/10"
      >
        {uploading ? (
          <Loader2 size={20} className="animate-spin" />
        ) : isPremium ? (
          <Camera size={20} />
        ) : (
          <Lock size={18} />
        )}
        <span className="text-xs">
          {uploading
            ? "Uploading…"
            : isPremium
            ? "Attach receipt"
            : "Receipts are Premium"}
        </span>
      </button>

      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </>
  );
}