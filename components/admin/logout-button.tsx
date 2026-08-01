"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
      }}
      className="text-sm font-semibold text-neutral-400 hover:text-[#f2a93b]"
    >
      Log out
    </button>
  );
}
