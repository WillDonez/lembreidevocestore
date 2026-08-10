"use client";

import Link from "next/link";
import {
  usePathname,
  useRouter,
} from "next/navigation";
import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [
    carregando,
    setCarregando,
  ] = useState(true);

  useEffect(() => {
    verificarLogin();
  }, []);

  async function verificarLogin() {
    const {
      data: { session },
    } =
      await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
      return;
    }

    const {
      data: cliente,
      error,
    } = await supabase
      .from("clientes")
      .select("role")
      .eq(
        "auth_user_id",
        session.user.id,
      )
      .single();

    if (error || !cliente) {
      router.push("/login");
      return;
    }

    if (
      cliente.role !== "admin"
    ) {
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
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-border border-t-primary" />

          <p className="mt-4 font-bold text-primary">
            Verificando acesso...
          </p>
        </div>
      </main>
    );
  }

  const menu = [
    {
      nome: "Dashboard",
      href: "/admin",
      icone: "🏠",
    },
    {
      nome: "Produtos",
      href: "/admin/produtos",
      icone: "📦",
    },
    {
      nome: "Categorias",
      href: "/admin/categorias",
      icone: "📂",
    },
    {
      nome: "Pedidos",
      href: "/admin/pedidos",
      icone: "🛒",
    },
    {
      nome: "Banners",
      href: "/admin/marketing/banners",
      icone: "🖼️",
    },
    {
      nome: "Aparência",
      href: "/admin/aparencia",
      icone: "🎨",
    },
  ];

  function itemEstaAtivo(
    href: string,
  ) {
    if (href === "/admin") {
      return (
        pathname === "/admin" ||
        pathname ===
          "/admin/dashboard"
      );
    }

    return (
      pathname === href ||
      pathname.startsWith(
        `${href}/`,
      )
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed left-0 top-0 z-40 h-screen w-80 border-r border-border bg-card p-6 shadow-lg">
        <div className="mb-10">
          <div className="mb-5 flex justify-center">
            <img
              src="/logo.png"
              alt="Lembrei de Você Store"
              className="h-24 w-24 object-contain"
            />
          </div>

          <h1 className="text-center text-2xl font-bold text-primary">
            Lembrei de Você Store
          </h1>
        </div>

        <nav className="space-y-3">
          {menu.map((item) => {
            const ativo =
              itemEstaAtivo(
                item.href,
              );

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-2xl px-5 py-4 font-bold transition ${
                  ativo
                    ? "bg-primary text-white shadow-md"
                    : "text-text hover:bg-[color-mix(in_srgb,var(--primary)_8%,white)] hover:text-primary"
                }`}
              >
                <span className="mr-2">
                  {item.icone}
                </span>

                {item.nome}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6 space-y-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-2xl border border-border bg-background px-5 py-4 text-center font-bold text-text transition hover:border-primary hover:text-primary"
          >
            🏠 Ver Loja
          </a>

          <button
            type="button"
            onClick={sair}
            className="w-full rounded-2xl bg-danger px-5 py-4 font-bold text-white transition hover:opacity-90"
          >
            🚪 Sair
          </button>
        </div>
      </aside>

      <main className="ml-80 min-h-screen flex-1">
        {children}
      </main>
    </div>
  );
}