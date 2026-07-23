"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    router.push("/dashboard");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-5 p-6">
      <div>
        <h1 className="text-2xl font-bold">Create account</h1>
        <p className="mt-1 text-sm text-neutral-500">Start tracking in 30 seconds</p>
      </div>

      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-teal-500"
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-teal-500"
      />
      <input
        type="password"
        placeholder="Password (min 8 characters)"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        className="rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-teal-500"
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        onClick={submit}
        disabled={loading}
        className="rounded-xl bg-[#0f2b2b] py-3 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? "Creating…" : "Create account"}
      </button>

      <p className="text-center text-sm text-neutral-500">
        Have an account?{" "}
        <Link href="/login" className="font-medium text-teal-600">Sign in</Link>
      </p>
    </div>
  );
}