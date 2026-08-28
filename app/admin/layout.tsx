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

const NOME_LOJA_PADRAO =
  "Lembrei de Você Store";

const LOGO_LOJA_PADRAO =
  "/logo.png";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname =
    usePathname();

  const router =
    useRouter();

  const [
    carregando,
    setCarregando,
  ] = useState(true);

  const [
    nomeLoja,
    setNomeLoja,
  ] = useState(
    NOME_LOJA_PADRAO,
  );

  const [
    logoUrl,
    setLogoUrl,
  ] = useState(
    LOGO_LOJA_PADRAO,
  );

  useEffect(() => {
    void verificarLogin();
  }, []);

  async function carregarIdentidadeLoja() {
    try {
      const {
        data,
        error,
      } = await supabase
        .from(
          "configuracoes_loja",
        )
        .select(
          `
            nome_loja,
            logo_url
          `,
        )
        .eq(
          "ativo",
          true,
        )
        .order(
          "id",
          {
            ascending: true,
          },
        )
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error(
          "Erro ao carregar identidade da loja no admin:",
          error,
        );

        return;
      }

      const nome =
        data?.nome_loja?.trim();

      const logo =
        data?.logo_url?.trim();

      if (nome) {
        setNomeLoja(
          nome,
        );
      } else {
        setNomeLoja(
          NOME_LOJA_PADRAO,
        );
      }

      if (logo) {
        setLogoUrl(
          logo,
        );
      } else {
        setLogoUrl(
          LOGO_LOJA_PADRAO,
        );
      }
    } catch (error) {
      console.error(
        "Erro interno ao carregar identidade da loja no admin:",
        error,
      );
    }
  }

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

    if (
      error ||
      !cliente
    ) {
      router.push("/login");

      return;
    }

    if (
      cliente.role !== "admin"
    ) {
      router.push(
        "/minha-conta",
      );

      return;
    }

    await carregarIdentidadeLoja();

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
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-border border-t-primary" />

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
      href:
        "/admin/marketing/banners",
      icone: "🖼️",
    },
    {
      nome: "Aparência",
      href:
        "/admin/aparencia",
      icone: "🎨",
    },
  ];

  function itemEstaAtivo(
    href: string,
  ) {
    if (
      href === "/admin"
    ) {
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
    <div className="admin-viewport bg-background">
      <div className="admin-scale-root flex min-h-screen bg-background">
        <aside className="fixed left-0 top-0 z-50 h-screen w-80 border-r border-border bg-card p-6 shadow-sm">
          <div className="mb-10">
            <div className="flex justify-center">
              <img
                src={logoUrl}
                alt={nomeLoja}
                className="h-24 w-24 rounded-full object-contain"
              />
            </div>

            <h1 className="mt-5 text-center text-2xl font-bold text-primary">
              {nomeLoja}
            </h1>
          </div>

          <nav className="space-y-3">
            {menu.map(
              (item) => {
                const ativo =
                  itemEstaAtivo(
                    item.href,
                  );

                return (
                  <Link
                    key={
                      item.href
                    }
                    href={
                      item.href
                    }
                    className={`block rounded-2xl px-5 py-4 font-bold transition ${
                      ativo
                        ? "bg-primary text-white shadow-md"
                        : "text-text hover:bg-[color-mix(in_srgb,var(--primary)_8%,white)] hover:text-primary"
                    }`}
                  >
                    <span className="mr-2">
                      {
                        item.icone
                      }
                    </span>

                    {
                      item.nome
                    }
                  </Link>
                );
              },
            )}
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

      <style jsx global>{`
        /*
          No desktop, reproduz visualmente o painel com aproximadamente
          80% de zoom enquanto o navegador permanece em 100%.

          A largura de 125% compensa a escala de 0.8, mantendo toda a
          largura útil da janela e evitando que o conteúdo fique espremido.
        */
        @media (min-width: 1024px) {
          .admin-viewport {
            width: 100%;
            min-height: 100vh;
            overflow-x: hidden;
          }

          .admin-scale-root {
            width: 125%;
            min-height: 125vh;
            transform: scale(0.8);
            transform-origin: top left;
          }
        }

        /*
          Em telas menores não aplicamos a escala global.
          Assim o comportamento responsivo original é preservado.
        */
        @media (max-width: 1023px) {
          .admin-scale-root {
            width: 100%;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}