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
        className="w-full rounded-lg border border-black/15 bg-white px-4 py-3 text-sm text-[#0f1d18] placeholder:text-neutral-500 focus:border-[#2f6a37]/60"
      />
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-[#2f6a37] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
      >
        {submitting ? "Checking…" : "Enter"}
      </button>
    </form>
  );
}
