"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { ...form, redirect: false });
    setLoading(false);

    if (res?.error) setError("Invalid email or password");
    else router.push("/dashboard");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-5 p-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-neutral-500">Sign in to SalaryNest</p>
      </div>

      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-teal-500"
      />
      <input
        type="password"
        placeholder="Password"
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
        {loading ? "Signing in…" : "Sign in"}
      </button>

      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="rounded-xl border border-neutral-200 py-3 text-sm font-medium"
      >
        Continue with Google
      </button>

      <p className="text-center text-sm text-neutral-500">
        No account?{" "}
        <Link href="/register" className="font-medium text-teal-600">Sign up</Link>
      </p>
    </div>
  );
}