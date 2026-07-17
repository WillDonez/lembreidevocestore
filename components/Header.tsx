"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface HeaderProps {
  quantidadeCarrinho: number;
  abrirCarrinho: () => void;
}

export default function Header({
  quantidadeCarrinho,
  abrirCarrinho,
}: HeaderProps) {
  const router = useRouter();
  const menuContaRef = useRef<HTMLDivElement>(null);

  const [menuContaAberto, setMenuContaAberto] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState("");

  useEffect(() => {
    verificarUsuario();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_evento, session) => {
      if (session?.user) {
        setUsuarioLogado(true);

        const nome =
          session.user.user_metadata?.nome ||
          session.user.email?.split("@")[0] ||
          "Minha Conta";

        setNomeUsuario(nome);
      } else {
        setUsuarioLogado(false);
        setNomeUsuario("");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    function fecharMenuAoClicarFora(event: MouseEvent) {
      if (
        menuContaRef.current &&
        !menuContaRef.current.contains(event.target as Node)
      ) {
        setMenuContaAberto(false);
      }
    }

    document.addEventListener("mousedown", fecharMenuAoClicarFora);

    return () => {
      document.removeEventListener("mousedown", fecharMenuAoClicarFora);
    };
  }, []);

  async function verificarUsuario() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      setUsuarioLogado(false);
      setNomeUsuario("");
      return;
    }

    setUsuarioLogado(true);

    const nome =
      session.user.user_metadata?.nome ||
      session.user.email?.split("@")[0] ||
      "Minha Conta";

    setNomeUsuario(nome);
  }

  async function sair() {
    await supabase.auth.signOut();

    setMenuContaAberto(false);
    setUsuarioLogado(false);
    setNomeUsuario("");

    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 bg-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-6 py-4">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Lembrei de Você Store"
            className="h-16 w-auto"
          />

          <span className="hidden text-3xl font-bold text-pink-500 lg:block">
            Lembrei de Você Store
          </span>
        </Link>

        {/* MENU PRINCIPAL */}
        <nav className="hidden items-center gap-8 font-bold text-gray-700 md:flex">
          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="transition hover:text-pink-500"
          >
            Início
          </button>

          <button
            type="button"
            onClick={() =>
              document
                .getElementById("produtos")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="transition hover:text-pink-500"
          >
            Produtos
          </button>

          <Link
            href="/meu-pedido"
            className="transition hover:text-pink-500"
          >
            Meu Pedido
          </Link>

          <a
            href="https://wa.me/5533999958593"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-pink-500"
          >
            Contato
          </a>
        </nav>

        {/* CONTA E CARRINHO */}
        <div className="flex items-center gap-3">
          <div ref={menuContaRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuContaAberto((aberto) => !aberto)}
              className="flex items-center gap-2 rounded-xl px-3 py-3 font-bold text-purple-500 transition hover:bg-purple-50"
              aria-expanded={menuContaAberto}
              aria-label="Abrir menu da conta"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-500 text-white">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21a8 8 0 0 1 16 0" />
                </svg>
              </span>

              <span className="hidden max-w-32 truncate sm:block">
                {usuarioLogado ? nomeUsuario : "Entrar"}
              </span>

              <span
                className={`transition-transform ${
                  menuContaAberto ? "rotate-180" : ""
                }`}
              >
                ▾
              </span>
            </button>

            {menuContaAberto && (
              <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                {usuarioLogado ? (
                  <>
                    <div className="border-b bg-purple-50 px-5 py-4">
                      <p className="text-xs text-gray-500">Olá,</p>

                      <p className="truncate font-bold text-purple-600">
                        {nomeUsuario}
                      </p>
                    </div>

                    <Link
                      href="/minha-conta"
                      onClick={() => setMenuContaAberto(false)}
                      className="block px-5 py-4 text-gray-700 transition hover:bg-purple-50 hover:text-purple-600"
                    >
                      Minha Conta
                    </Link>

                    <button
                      type="button"
                      onClick={sair}
                      className="w-full border-t px-5 py-4 text-left font-bold text-red-500 transition hover:bg-red-50"
                    >
                      Sair
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMenuContaAberto(false)}
                      className="block px-5 py-4 text-gray-700 transition hover:bg-purple-50 hover:text-purple-600"
                    >
                      Iniciar sessão
                    </Link>

                    <Link
                      href="/login?modo=cadastro"
                      onClick={() => setMenuContaAberto(false)}
                      className="block border-t px-5 py-4 text-gray-700 transition hover:bg-purple-50 hover:text-purple-600"
                    >
                      Criar uma conta
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={abrirCarrinho}
            className="flex items-center gap-2 rounded-xl bg-pink-500 px-4 py-3 font-bold text-white transition hover:bg-pink-600 sm:px-6"
          >
            <span className="hidden sm:inline">Carrinho</span>

            <span>({quantidadeCarrinho})</span>
          </button>
        </div>
      </div>
    </header>
  );
}