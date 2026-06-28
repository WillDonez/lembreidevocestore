"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="bg-white shadow p-6 mb-8">
        <div className="max-w-7xl mx-auto flex gap-4 flex-wrap items-center">
          <Link
            href="/admin"
            className={`px-5 py-3 rounded-xl font-bold transition ${
              pathname === "/admin"
                ? "bg-pink-500 text-white"
                : "bg-white text-pink-500 border border-pink-500"
            }`}
          >
            📦 Produtos
          </Link>

          <Link
            href="/admin/categorias"
            className={`px-5 py-3 rounded-xl font-bold transition ${
              pathname === "/admin/categorias"
                ? "bg-pink-500 text-white"
                : "bg-white text-pink-500 border border-pink-500"
            }`}
          >
            📂 Categorias
          </Link>

          <Link
            href="/admin/pedidos"
            className={`px-5 py-3 rounded-xl font-bold transition ${
              pathname === "/admin/pedidos"
                ? "bg-pink-500 text-white"
                : "bg-white text-pink-500 border border-pink-500"
            }`}
          >
            🛒 Pedidos
          </Link>
        </div>
      </div>

      {children}
    </div>
  );
}