"use client";

import { X } from "lucide-react";

export default function ReceiptViewer({
  url, onClose,
}: { url: string | null; onClose: () => void }) {
  if (!url) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4"
    >
      <button className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white">
        <X size={20} />
      </button>
      <img
        src={url}
        alt="Receipt"
        onClick={(e) => e.stopPropagation()}
        className="max-h-full max-w-full rounded-xl object-contain"
      />
    </div>
  );
}