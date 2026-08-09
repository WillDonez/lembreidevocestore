"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/dashboard");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-pink-50">
      <div className="rounded-3xl bg-white p-8 text-center shadow">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-pink-100 border-t-pink-500" />

        <p className="mt-4 font-bold text-gray-600">
          Abrindo dashboard...
        </p>
      </div>
    </main>
  );
}