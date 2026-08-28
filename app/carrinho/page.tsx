"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useCarrinho } from "@/app/context/CarrinhoContext";

import { formatarMoeda } from "@/lib/formatadores";

import EmptyCart from "./components/EmptyCart";
import CartItem from "./components/CartItem";

type OpcaoFrete = {
  id: number;
  nome: string;
  transportadora: string;
  preco: number;
  prazo: number;
  moeda?: string;

  empresa?: {
    id?: number;
    nome?: string;
    imagem?: string;
  };
};

export default function CarrinhoPage() {
  const router = useRouter();

  const {
    carrinho,
    itens,
    removerItem,
    aumentarQuantidade,
    diminuirQuantidade,
    alternarSelecionado,
    total,
  } = useCarrinho();

  const [cep, setCep] =
    useState("");

  const [
    calculandoFrete,
    setCalculandoFrete,
  ] = useState(false);

  const [
    opcoesFrete,
    setOpcoesFrete,
  ] = useState<OpcaoFrete[]>(
    [],
  );

  const [
    freteSelecionado,
    setFreteSelecionado,
  ] = useState<OpcaoFrete | null>(
    null,
  );

  const [
    erroFrete,
    setErroFrete,
  ] = useState("");

  const [
    freteNecessario,
    setFreteNecessario,
  ] = useState(true);

  const possuiProdutoFisico =
    carrinho.some(
      (produto) =>
        !produto.tipo_produto ||
        produto.tipo_produto ===
          "fisico",
    );

  const totalComFrete =
    total +
    (freteSelecionado?.preco ||
      0);

  useEffect(() => {
    setOpcoesFrete([]);
    setFreteSelecionado(null);
    setErroFrete("");

    if (!possuiProdutoFisico) {
      setFreteNecessario(
        false,
      );

      sessionStorage.removeItem(
        "freteSelecionado",
      );
    } else {
      setFreteNecessario(
        true,
      );
    }
  }, [
    carrinho,
    possuiProdutoFisico,
  ]);

  function formatarCepDigitado(
    valor: string,
  ) {
    const numeros = valor
      .replace(/\D/g, "")
      .slice(0, 8);

    if (numeros.length > 5) {
      return `${numeros.slice(
        0,
        5,
      )}-${numeros.slice(5)}`;
    }

    return numeros;
  }

  async function calcularFrete() {
    setErroFrete("");
    setOpcoesFrete([]);
    setFreteSelecionado(null);

    const cepLimpo =
      cep.replace(/\D/g, "");

    if (
      cepLimpo.length !== 8
    ) {
      setErroFrete(
        "Informe um CEP válido com 8 números.",
      );

      return;
    }

    if (
      carrinho.length === 0
    ) {
      setErroFrete(
        "Seu carrinho está vazio.",
      );

      return;
    }

    setCalculandoFrete(true);

    try {
      const resposta =
        await fetch(
          "/api/frete/calcular",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                cepDestino:
                  cepLimpo,

                itens:
                  carrinho.map(
                    (
                      produto,
                    ) => ({
                      produtoId:
                        produto.id,

                      quantidade:
                        1,
                    }),
                  ),
              }),
          },
        );

      const resultado =
        await resposta.json();

      if (!resposta.ok) {
        console.error(
          "Erro ao calcular frete:",
          resultado,
        );

        setErroFrete(
          resultado.erro ||
            "Não foi possível calcular o frete.",
        );

        return;
      }

      if (
        resultado.freteNecessario ===
        false
      ) {
        setFreteNecessario(
          false,
        );

        setOpcoesFrete([]);

        sessionStorage.removeItem(
          "freteSelecionado",
        );

        return;
      }

      setFreteNecessario(
        true,
      );

      setOpcoesFrete(
        resultado.opcoes || [],
      );

      sessionStorage.setItem(
        "cepFrete",
        cepLimpo,
      );
    } catch (error) {
      console.error(
        "Erro interno ao calcular frete:",
        error,
      );

      setErroFrete(
        "Ocorreu um erro ao consultar as opções de frete.",
      );
    } finally {
      setCalculandoFrete(
        false,
      );
    }
  }

  function selecionarFrete(
    opcao: OpcaoFrete,
  ) {
    setFreteSelecionado(
      opcao,
    );

    sessionStorage.setItem(
      "freteSelecionado",

      JSON.stringify({
        ...opcao,

        cepDestino:
          cep.replace(
            /\D/g,
            "",
          ),
      }),
    );
  }

  function finalizarCompra() {
    if (
      possuiProdutoFisico &&
      !freteSelecionado
    ) {
      setErroFrete(
        "Calcule e selecione uma opção de frete antes de continuar.",
      );

      return;
    }

    if (
      !possuiProdutoFisico
    ) {
      sessionStorage.removeItem(
        "freteSelecionado",
      );
    }

    router.push(
      "/checkout",
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-5 md:px-6 md:py-7">
      <div className="cart-desktop-scale mx-auto max-w-7xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-secondary">
              Seu pedido
            </p>

            <h1 className="mt-1 text-3xl font-black text-primary md:text-4xl">
              Meu Carrinho
            </h1>
          </div>

          <Link
            href="/"

            className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-bold text-primary shadow-sm transition hover:bg-[color-mix(in_srgb,var(--primary)_8%,white)]"
          >
            ← Continuar comprando
          </Link>
        </div>

        {itens.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card p-6 shadow-lg">
            <EmptyCart />
          </div>
        ) : (
          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.7fr)]">
            {/* CONTEÚDO PRINCIPAL */}
            <div className="space-y-5">
              <section className="rounded-3xl border border-border bg-card p-4 shadow-sm md:p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.13em] text-secondary">
                      Produtos
                    </p>

                    <h2 className="mt-1 text-xl font-black text-text">
                      Itens do carrinho
                    </h2>
                  </div>

                  <span className="rounded-full bg-[color-mix(in_srgb,var(--primary)_10%,white)] px-3 py-1.5 text-xs font-black text-primary">
                    {itens.length} item(ns)
                  </span>
                </div>

                <div className="grid gap-3 xl:grid-cols-2">
                  {itens.map((item) => (
                    <CartItem
                      key={item.idCarrinho}
                      item={item}
                      onAlternarSelecionado={alternarSelecionado}
                      onAumentarQuantidade={aumentarQuantidade}
                      onDiminuirQuantidade={diminuirQuantidade}
                      onRemover={removerItem}
                    />
                  ))}
                </div>
              </section>

              {possuiProdutoFisico ? (
                <section className="rounded-3xl border border-border bg-card p-4 shadow-sm md:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.13em] text-secondary">
                        Entrega
                      </p>

                      <h2 className="mt-1 text-xl font-black text-text">
                        🚚 Calcular frete
                      </h2>

                      <p className="mt-1 text-sm text-text-light">
                        Digite o CEP para ver as opções de entrega.
                      </p>
                    </div>
                  </div>

                  <div
                    className={`mt-4 grid gap-4 ${
                      opcoesFrete.length > 0
                        ? "md:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.2fr)] md:items-start"
                        : ""
                    }`}
                  >
                    <div>
                      <div className="flex flex-col gap-2 sm:flex-row md:flex-col xl:flex-row">
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="00000-000"
                          value={cep}
                          onChange={(e) =>
                            setCep(
                              formatarCepDigitado(
                                e.target.value,
                              ),
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              void calcularFrete();
                            }
                          }}
                          className="min-h-10 min-w-0 flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-base text-text outline-none transition focus:border-primary"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            void calcularFrete()
                          }
                          disabled={calculandoFrete}
                          className="min-h-10 shrink-0 rounded-xl bg-primary px-5 py-2.5 text-sm font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-300"
                        >
                          {calculandoFrete
                            ? "Calculando..."
                            : "Calcular frete"}
                        </button>
                      </div>

                      {erroFrete && (
                        <div className="mt-3 rounded-xl border border-danger/30 bg-[color-mix(in_srgb,var(--danger)_8%,white)] px-4 py-3 text-sm font-bold text-danger">
                          ⚠️ {erroFrete}
                        </div>
                      )}

                      {opcoesFrete.length > 0 && (
                        <div className="mt-2 rounded-xl border border-primary/15 bg-[color-mix(in_srgb,var(--primary)_4%,white)] px-3 py-2">
                          <p className="text-xs font-bold text-text">
                            ✓ Opções encontradas
                          </p>

                          <p className="mt-0.5 text-xs text-text-light">
                            Escolha a entrega ao lado para atualizar o total.
                          </p>
                        </div>
                      )}
                    </div>

                    {opcoesFrete.length > 0 && (
                      <div>
                        <h3 className="mb-1.5 text-sm font-bold text-text">
                          Escolha uma opção de entrega:
                        </h3>

                        <div className="grid gap-1.5">
                          {opcoesFrete.map((opcao) => {
                            const selecionada =
                              freteSelecionado?.id ===
                              opcao.id;

                            return (
                              <label
                                key={opcao.id}
                                className={`flex cursor-pointer items-center justify-between gap-2.5 rounded-xl border-2 px-3 py-2 transition ${
                                  selecionada
                                    ? "border-primary bg-[color-mix(in_srgb,var(--primary)_5%,white)] shadow-sm"
                                    : "border-border bg-background hover:border-primary/60"
                                }`}
                              >
                                <div className="flex min-w-0 items-center gap-2.5">
                                  <input
                                    type="radio"
                                    name="frete"
                                    checked={selecionada}
                                    onChange={() =>
                                      selecionarFrete(opcao)
                                    }
                                    className="h-4 w-4 shrink-0 accent-[var(--primary)]"
                                  />

                                  {opcao.empresa?.imagem && (
                                    <img
                                      src={opcao.empresa.imagem}
                                      alt={opcao.transportadora}
                                      className="h-6 w-9 shrink-0 object-contain"
                                    />
                                  )}

                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-black text-text">
                                      {opcao.transportadora} — {opcao.nome}
                                    </p>

                                    <p className="mt-0.5 text-[11px] leading-tight text-text-light">
                                      Até {opcao.prazo} dia
                                      {opcao.prazo !== 1
                                        ? "s"
                                        : ""} útil
                                      {opcao.prazo !== 1
                                        ? "eis"
                                        : ""}
                                    </p>
                                  </div>
                                </div>

                                <strong className="shrink-0 text-sm text-primary">
                                  {formatarMoeda(opcao.preco)}
                                </strong>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              ) : (
                <div className="rounded-2xl border border-success/30 bg-[color-mix(in_srgb,var(--success)_8%,white)] p-4 text-sm font-bold text-success">
                  ✅ Este carrinho possui apenas produtos digitais. Não há cobrança de frete.
                </div>
              )}
            </div>

            {/* RESUMO LATERAL */}
            <aside className="lg:sticky lg:top-24">
              <section className="rounded-3xl border border-border bg-card p-5 shadow-lg md:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.13em] text-secondary">
                  Resumo da compra
                </p>

                <h2 className="mt-1 text-2xl font-black text-text">
                  Total do pedido
                </h2>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-text-light">
                      Subtotal
                    </span>

                    <strong className="text-text">
                      {formatarMoeda(total)}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-text-light">
                      Frete
                    </span>

                    <strong className="text-text">
                      {!possuiProdutoFisico
                        ? "Grátis"
                        : freteSelecionado
                          ? formatarMoeda(
                              freteSelecionado.preco,
                            )
                          : "A calcular"}
                    </strong>
                  </div>

                  {freteSelecionado && (
                    <div className="rounded-xl bg-[color-mix(in_srgb,var(--primary)_7%,white)] px-3 py-2.5">
                      <p className="text-xs font-bold text-primary">
                        🚚 {freteSelecionado.transportadora} — {freteSelecionado.nome}
                      </p>

                      <p className="mt-0.5 text-xs text-text-light">
                        Prazo estimado: até {freteSelecionado.prazo} dia(s) útil(eis)
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-5 border-t border-border pt-4">
                  <div className="flex items-end justify-between gap-4">
                    <span className="text-lg font-black text-text">
                      Total
                    </span>

                    <strong className="text-3xl font-black text-primary">
                      {formatarMoeda(totalComFrete)}
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={finalizarCompra}
                  className="mt-5 flex w-full items-center justify-center rounded-2xl bg-success px-4 py-3.5 text-base font-black text-white shadow-md transition hover:-translate-y-0.5 hover:opacity-95 hover:shadow-lg active:scale-[0.99]"
                >
                  Finalizar compra
                </button>

                <div className="mt-4 grid gap-2 text-xs text-text-light">
                  <p>🔒 Pagamento seguro</p>
                  <p>⚡ Processamento automático</p>
                </div>
              </section>
            </aside>
          </div>
        )}
      </div>
      <style jsx global>{`
        @media (min-width: 1280px) {
          .cart-desktop-scale {
            transform: scale(0.82);
            transform-origin: top center;
          }
        }
      `}</style>
    </main>
  );
}