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
    <main className="min-h-screen bg-background p-5 md:p-10">
      <div className="mx-auto max-w-6xl rounded-3xl border border-border bg-card p-6 shadow-xl md:p-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-4xl font-bold text-primary md:text-5xl">
            Meu Carrinho
          </h1>

          <Link
            href="/"
            className="rounded-xl border border-border bg-background px-5 py-3 font-bold text-primary transition hover:bg-[color-mix(in_srgb,var(--primary)_8%,white)]"
          >
            ← Continuar
            comprando
          </Link>
        </div>

        <div className="space-y-6">
          {itens.length ===
          0 ? (
            <EmptyCart />
          ) : (
            <>
              {itens.map(
                (item) => (
                  <CartItem
                    key={
                      item.idCarrinho
                    }
                    item={
                      item
                    }
                    onAlternarSelecionado={
                      alternarSelecionado
                    }
                    onAumentarQuantidade={
                      aumentarQuantidade
                    }
                    onDiminuirQuantidade={
                      diminuirQuantidade
                    }
                    onRemover={
                      removerItem
                    }
                  />
                ),
              )}

              {possuiProdutoFisico ? (
                <section className="mt-8 rounded-3xl border border-border bg-background p-6">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-secondary">
                      Entrega
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-text">
                      🚚 Calcular
                      frete
                    </h2>

                    <p className="mt-2 text-text-light">
                      Digite o CEP onde o pedido será entregue.
                    </p>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="00000-000"
                      value={cep}
                      onChange={(
                        e,
                      ) =>
                        setCep(
                          formatarCepDigitado(
                            e.target
                              .value,
                          ),
                        )
                      }
                      onKeyDown={(
                        e,
                      ) => {
                        if (
                          e.key ===
                          "Enter"
                        ) {
                          void calcularFrete();
                        }
                      }}
                      className="flex-1 rounded-xl border border-border bg-card p-4 text-lg text-text outline-none transition focus:border-primary"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        void calcularFrete()
                      }
                      disabled={
                        calculandoFrete
                      }
                      className="rounded-xl bg-primary px-7 py-4 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                      {calculandoFrete
                        ? "Calculando..."
                        : "Calcular frete"}
                    </button>
                  </div>

                  {erroFrete && (
                    <div className="mt-5 rounded-xl border border-danger/30 bg-[color-mix(in_srgb,var(--danger)_8%,white)] p-4 font-bold text-danger">
                      ⚠️{" "}
                      {erroFrete}
                    </div>
                  )}

                  {opcoesFrete.length >
                    0 && (
                    <div className="mt-6 space-y-3">
                      <h3 className="font-bold text-text">
                        Escolha uma
                        opção de
                        entrega:
                      </h3>

                      {opcoesFrete.map(
                        (
                          opcao,
                        ) => {
                          const selecionada =
                            freteSelecionado?.id ===
                            opcao.id;

                          return (
                            <label
                              key={
                                opcao.id
                              }
                              className={`flex cursor-pointer flex-col justify-between gap-4 rounded-2xl border-2 bg-card p-5 transition sm:flex-row sm:items-center ${
                                selecionada
                                  ? "border-primary shadow"
                                  : "border-border hover:border-primary"
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <input
                                  type="radio"
                                  name="frete"
                                  checked={
                                    selecionada
                                  }
                                  onChange={() =>
                                    selecionarFrete(
                                      opcao,
                                    )
                                  }
                                  className="h-5 w-5 accent-[var(--primary)]"
                                />

                                {opcao
                                  .empresa
                                  ?.imagem && (
                                  <img
                                    src={
                                      opcao
                                        .empresa
                                        .imagem
                                    }
                                    alt={
                                      opcao.transportadora
                                    }
                                    className="h-10 w-16 object-contain"
                                  />
                                )}

                                <div>
                                  <p className="font-bold text-text">
                                    {
                                      opcao.transportadora
                                    }{" "}
                                    —{" "}
                                    {
                                      opcao.nome
                                    }
                                  </p>

                                  <p className="mt-1 text-sm text-text-light">
                                    Entrega
                                    estimada
                                    em até{" "}
                                    <strong>
                                      {
                                        opcao.prazo
                                      }{" "}
                                      dia
                                      {opcao.prazo !==
                                      1
                                        ? "s"
                                        : ""}{" "}
                                      útil
                                      {opcao.prazo !==
                                      1
                                        ? "eis"
                                        : ""}
                                    </strong>
                                  </p>
                                </div>
                              </div>

                              <p className="text-xl font-bold text-primary">
                                {formatarMoeda(
                                  opcao.preco,
                                )}
                              </p>
                            </label>
                          );
                        },
                      )}
                    </div>
                  )}
                </section>
              ) : (
                <div className="rounded-2xl border border-success/30 bg-[color-mix(in_srgb,var(--success)_8%,white)] p-5 font-bold text-success">
                  ✅ Este
                  carrinho possui
                  apenas produtos
                  digitais. Não há
                  cobrança de frete.
                </div>
              )}

              <section className="mt-8 border-t border-border pt-8">
                <div className="ml-auto max-w-md space-y-4 rounded-3xl border border-border bg-background p-6">
                  <div className="flex items-center justify-between text-lg">
                    <span className="text-text-light">
                      Subtotal
                    </span>

                    <strong className="text-text">
                      {formatarMoeda(
                        total,
                      )}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-lg">
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

                  <div className="border-t border-border pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-text">
                        Total
                      </span>

                      <strong className="text-3xl text-primary">
                        {formatarMoeda(
                          totalComFrete,
                        )}
                      </strong>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    finalizarCompra
                  }
                  className="mt-8 block w-full rounded-2xl bg-success py-4 text-center text-2xl font-bold text-white transition hover:opacity-90"
                >
                  Finalizar compra
                </button>
              </section>
            </>
          )}
        </div>
      </div>
    </main>
  );
}