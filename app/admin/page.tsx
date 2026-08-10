"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(
      "/admin/dashboard",
    );
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-border border-t-primary" />

        <p className="mt-4 font-bold text-text-light">
          Abrindo dashboard...
        </p>
      </div>
    </main>
  );
}