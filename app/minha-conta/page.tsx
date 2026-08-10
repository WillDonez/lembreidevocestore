"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PedidoCard from "@/components/PedidoCard";
import { useRouter } from "next/navigation";

type Aba =
  | "inicio"
  | "pedidos"
  | "downloads"
  | "dados"
  | "favoritos";

export default function MinhaContaPage() {
  const router = useRouter();

  const [abaAtiva, setAbaAtiva] =
    useState<Aba>("inicio");

  const [pedidos, setPedidos] =
    useState<any[]>([]);

  const [nomeCliente, setNomeCliente] =
    useState("");

  useEffect(() => {
    buscarPedidos();
    buscarClienteLogado();
  }, []);

  async function buscarPedidos() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const emailUsuario = user.email
      ?.trim()
      .toLowerCase();

    if (!emailUsuario) {
      setPedidos([]);
      return;
    }

    const { data, error } =
      await supabase
        .from("pedidos")
        .select("*")
        .eq(
          "email_cliente",
          emailUsuario,
        )
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      console.log(
        "Erro ao buscar pedidos do cliente:",
        error,
      );

      setPedidos([]);
      return;
    }

    setPedidos(data || []);
  }

  const downloadsLiberados =
    pedidos.flatMap((pedido) => {
      if (!pedido.download_liberado) {
        return [];
      }

      return (pedido.produtos || [])
        .filter(
          (produto: any) =>
            produto.arquivo_digital,
        )
        .map((produto: any) => ({
          ...produto,
          pedidoId: pedido.id,
          dataPedido: pedido.created_at,
        }));
    });

  async function buscarClienteLogado() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data, error } =
      await supabase
        .from("clientes")
        .select("nome")
        .eq(
          "auth_user_id",
          user.id,
        )
        .maybeSingle();

    if (error) {
      console.log(
        "Erro ao buscar cliente:",
        error,
      );

      return;
    }

    if (data?.nome) {
      setNomeCliente(data.nome);
    }
  }

  function renderizarConteudo() {
    switch (abaAtiva) {
      case "pedidos":
        return (
          <div>
            <h2 className="mb-8 text-4xl font-bold text-text">
              📦 Meus Pedidos
            </h2>

            {pedidos.length === 0 ? (
              <div className="rounded-2xl border border-border bg-background p-8 text-center text-text-light">
                Nenhum pedido encontrado.
              </div>
            ) : (
              <div className="space-y-6">
                {pedidos.map(
                  (pedido) => (
                    <PedidoCard
                      key={pedido.id}
                      pedido={pedido}
                    />
                  ),
                )}
              </div>
            )}
          </div>
        );

      case "downloads":
        return (
          <div>
            <h2 className="text-4xl font-bold text-text">
              ⬇ Downloads
            </h2>

            <p className="mt-2 text-text-light">
              Acesse os arquivos digitais
              liberados das suas compras.
            </p>

            {downloadsLiberados.length ===
            0 ? (
              <div className="mt-8 rounded-2xl border border-border bg-background p-8 text-center text-text-light">
                Nenhum arquivo disponível
                para download.
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                {downloadsLiberados.map(
                  (
                    produto: any,
                    index: number,
                  ) => (
                    <div
                      key={`${produto.pedidoId}-${index}`}
                      className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 transition hover:shadow-md sm:flex-row sm:items-center"
                    >
                      {produto.imagem && (
                        <img
                          src={
                            produto.imagem
                          }
                          alt={
                            produto.nome
                          }
                          className="h-20 w-20 rounded-xl border border-border object-cover"
                        />
                      )}

                      <div className="min-w-0 flex-1">
                        <h3 className="text-xl font-bold text-text">
                          {
                            produto.nome
                          }
                        </h3>

                        <p className="mt-1 text-sm text-text-light">
                          Pedido LVS-
                          {String(
                            produto.pedidoId,
                          ).padStart(
                            6,
                            "0",
                          )}
                        </p>

                        <p className="mt-1 text-sm text-text-light">
                          Compra realizada em{" "}
                          {new Date(
                            produto.dataPedido,
                          ).toLocaleDateString(
                            "pt-BR",
                          )}
                        </p>
                      </div>

                      <a
                        href={
                          produto.arquivo_digital
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl bg-success px-5 py-3 text-center font-bold text-white transition hover:opacity-90"
                      >
                        ⬇ Baixar Arquivo
                      </a>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        );

      case "dados":
        return (
          <div>
            <h2 className="text-4xl font-bold text-text">
              👤 Meus Dados
            </h2>

            <p className="mt-4 text-lg text-text-light">
              Consulte e atualize seus
              dados cadastrais.
            </p>
          </div>
        );

      case "favoritos":
        return (
          <div>
            <h2 className="text-4xl font-bold text-text">
              ❤️ Favoritos
            </h2>

            <p className="mt-4 text-lg text-text-light">
              Seus produtos favoritos
              aparecerão aqui.
            </p>
          </div>
        );

      default:
        return (
          <div>
            <p className="text-xl font-bold text-primary">
              😄 Seja bem-vindo(a),
            </p>

            <h2 className="mt-2 text-4xl font-bold text-text md:text-5xl">
              {nomeCliente || "Cliente"}! 👋
            </h2>

            <p className="mt-10 text-xl text-text-light">
              Estamos felizes em ter você
              novamente na{" "}
              <strong className="text-primary">
                Lembrei de Você Store
              </strong>
              .
            </p>

            <p className="mt-2 text-lg text-success">
              Acompanhe seus pedidos, acesse
              seus downloads e gerencie sua
              conta.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  setAbaAtiva("pedidos")
                }
                className="group rounded-2xl border border-border bg-background p-6 text-left transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--primary)_10%,white)] text-2xl transition group-hover:bg-primary">
                  📦
                </div>

                <h3 className="mt-4 text-2xl font-bold text-text transition group-hover:text-primary">
                  Meus Pedidos
                </h3>

                <p className="mt-2 text-text-light">
                  Acompanhe suas compras.
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  setAbaAtiva(
                    "downloads",
                  )
                }
                className="group rounded-2xl border border-border bg-background p-6 text-left transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--primary)_10%,white)] text-2xl transition group-hover:bg-primary">
                  ⬇
                </div>

                <h3 className="mt-4 text-2xl font-bold text-text transition group-hover:text-primary">
                  Downloads
                </h3>

                <p className="mt-2 text-text-light">
                  Acesse seus arquivos
                  digitais.
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/minha-conta/meus-dados",
                  )
                }
                className="group rounded-2xl border border-border bg-background p-6 text-left transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--primary)_10%,white)] text-2xl transition group-hover:bg-primary">
                  👤
                </div>

                <h3 className="mt-4 text-2xl font-bold text-text transition group-hover:text-primary">
                  Meus Dados
                </h3>

                <p className="mt-2 text-text-light">
                  Consulte seu cadastro.
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  setAbaAtiva(
                    "favoritos",
                  )
                }
                className="group rounded-2xl border border-border bg-background p-6 text-left transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--primary)_10%,white)] text-2xl transition group-hover:bg-primary">
                  ❤️
                </div>

                <h3 className="mt-4 text-2xl font-bold text-text transition group-hover:text-primary">
                  Favoritos
                </h3>

                <p className="mt-2 text-text-light">
                  Veja os produtos salvos.
                </p>
              </button>
            </div>
          </div>
        );
    }
  }

  const itemMenu =
    "w-full rounded-2xl px-5 py-4 text-left font-bold transition";

  const itemMenuAtivo =
    "bg-primary text-white shadow-md";

  const itemMenuInativo =
    "text-text hover:bg-[color-mix(in_srgb,var(--primary)_8%,white)] hover:text-primary";

  return (
    <main className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-10 text-5xl font-bold text-primary">
          👤 Minha Conta
        </h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-3xl border border-border bg-card p-6 shadow-xl">
            <button
              type="button"
              onClick={() =>
                setAbaAtiva("inicio")
              }
              className={`${itemMenu} ${
                abaAtiva === "inicio"
                  ? itemMenuAtivo
                  : itemMenuInativo
              }`}
            >
              🏠 Início
            </button>

            <button
              type="button"
              onClick={() =>
                setAbaAtiva("pedidos")
              }
              className={`${itemMenu} mt-2 ${
                abaAtiva === "pedidos"
                  ? itemMenuAtivo
                  : itemMenuInativo
              }`}
            >
              📦 Meus Pedidos
            </button>

            <button
              type="button"
              onClick={() =>
                setAbaAtiva(
                  "downloads",
                )
              }
              className={`${itemMenu} mt-2 ${
                abaAtiva ===
                "downloads"
                  ? itemMenuAtivo
                  : itemMenuInativo
              }`}
            >
              ⬇ Downloads
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/minha-conta/meus-dados",
                )
              }
              className={`${itemMenu} mt-2 ${itemMenuInativo}`}
            >
              👤 Meus Dados
            </button>

            <button
              type="button"
              onClick={() =>
                setAbaAtiva(
                  "favoritos",
                )
              }
              className={`${itemMenu} mt-2 ${
                abaAtiva ===
                "favoritos"
                  ? itemMenuAtivo
                  : itemMenuInativo
              }`}
            >
              ❤️ Favoritos
            </button>

            <div className="my-6 border-t border-border" />

            <button
              type="button"
              onClick={async () => {
                await supabase.auth.signOut();

                window.location.href =
                  "/login";
              }}
              className={`${itemMenu} text-danger hover:bg-[color-mix(in_srgb,var(--danger)_8%,white)]`}
            >
              🚪 Sair
            </button>
          </aside>

          <section className="min-h-[520px] rounded-3xl border border-border bg-card p-8 shadow-xl md:p-10">
            {renderizarConteudo()}
          </section>
        </div>
      </div>
    </main>
  );
}