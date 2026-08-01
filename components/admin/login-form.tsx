"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.status === 503) {
        setError("Admin area isn't configured yet / set ADMIN_ACCESS_KEY.");
      } else if (res.status === 401) {
        setError("Incorrect password.");
      } else if (res.ok) {
        router.push("/admin/orders");
        router.refresh();
        return;
      } else {
        setError("Something went wrong. Try again.");
      }
    } catch {
      setError("Network error. Try again.");
    }
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Admin password"
        autoFocus
        className="w-full rounded-lg border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-[#eceae4] placeholder:text-neutral-500 focus:border-[#f2a93b]/60"
      />
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-[#f2a93b] px-6 py-3 text-sm font-semibold text-black transition hover:brightness-110 disabled:opacity-60"
      >
        {submitting ? "Checking…" : "Enter"}
      </button>
    </form>
  );
}
