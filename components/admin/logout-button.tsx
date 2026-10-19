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
      className="text-sm font-semibold text-neutral-600 hover:text-[#2f6a37]"
    >
      Log out
    </button>
  );
}
