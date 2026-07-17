"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    verificarLogin();
  }, []);

 async function verificarLogin() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    router.push("/login");
    return;
  }

  const { data: cliente, error } = await supabase
    .from("clientes")
    .select("role")
    .eq("auth_user_id", session.user.id)
    .single();

  if (error || !cliente) {
    router.push("/login");
    return;
  }

  if (cliente.role !== "admin") {
    router.push("/minha-conta");
    return;
  }

  setCarregando(false);
}

  async function sair() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (carregando) {
    return (
      <main className="min-h-screen bg-pink-50 flex items-center justify-center">
        <p className="text-2xl font-bold text-pink-500">
          Verificando acesso...
        </p>
      </main>
    );
  }

  const menu = [
  { nome: "Dashboard", href: "/admin", icone: "🏠" },
  { nome: "Produtos", href: "/admin/produtos", icone: "📦" },
  { nome: "Categorias", href: "/admin/categorias", icone: "📂" },
  { nome: "Pedidos", href: "/admin/pedidos", icone: "🛒" },
];

  return (
    <div className="min-h-screen bg-pink-50 flex">
      <aside className="w-80 bg-white shadow-xl p-6 fixed left-0 top-0 h-full">
        <div className="flex flex-col items-center mb-10">
          <img
            src="/logo.png"
            alt="Lembrei de Você Store"
            className="w-28 h-28 object-contain mb-4"
          />

          <h1 className="text-2xl font-bold text-pink-500 text-center">
            Lembrei de Você Store
          </h1>
        </div>

        <nav className="space-y-3">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-5 py-4 rounded-2xl font-bold transition ${
                pathname === item.href
                  ? "bg-pink-500 text-white"
                  : "text-pink-500 hover:bg-pink-100"
              }`}
            >
              {item.icone} {item.nome}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6 space-y-3">
          <a
  href="/"
  target="_blank"
  rel="noopener noreferrer"
  className="block text-center bg-gray-100 text-gray-600 px-5 py-4 rounded-2xl font-bold hover:bg-gray-200 transition"
>
  🏠 Ver Loja
</a>

          <button
            onClick={sair}
            className="w-full bg-red-500 text-white px-5 py-4 rounded-2xl font-bold hover:bg-red-600"
          >
            🚪 Sair
          </button>
        </div>
      </aside>

      <main className="ml-80 flex-1">{children}</main>
    </div>
  );
}