"use client";

import { Suspense } from "react";
import LoginContent from "./components/LoginContent";

function CarregandoPagina() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-pink-50 px-4">
      <div className="rounded-2xl bg-white px-8 py-6 text-center shadow-lg">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-500" />
        <p className="mt-4 font-medium text-gray-600">Carregando...</p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<CarregandoPagina />}>
      <LoginContent />
    </Suspense>
  );
}
