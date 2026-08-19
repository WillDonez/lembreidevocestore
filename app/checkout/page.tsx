"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import CheckoutCliente from "@/components/CheckoutCliente";
import { useCarrinho } from "@/app/context/CarrinhoContext";
import { formatarMoeda } from "@/lib/formatadores";

type FreteSelecionado = {
  id: number;
  nome: string;
  transportadora: string;
  preco: number;
  prazo: number;
  cepDestino: string;
};

export default function CheckoutPage() {
  const router = useRouter();

  const [nomeCliente, setNomeCliente] = useState("");
  const [emailCliente, setEmailCliente] = useState("");
  const [whatsappCliente, setWhatsappCliente] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  const [
    freteSelecionado,
    setFreteSelecionado,
  ] = useState<FreteSelecionado | null>(null);

  const [
    carregandoFrete,
    setCarregandoFrete,
  ] = useState(true);

  const [finalizando, setFinalizando] =
    useState(false);

  const finalizandoRef = useRef(false);

  const {
    itens,
    total,
    quantidadeTotal,
  } = useCarrinho();

  const possuiProdutoFisico = itens.some(
    (item) =>
      !item.produto.tipo_produto ||
      item.produto.tipo_produto === "fisico",
  );

  const valorFrete =
    possuiProdutoFisico && freteSelecionado
      ? Number(freteSelecionado.preco)
      : 0;

  const totalComFrete =
    total + valorFrete;

  useEffect(() => {
    try {
      const freteSalvo =
        sessionStorage.getItem(
          "freteSelecionado",
        );

      if (freteSalvo) {
        const freteConvertido =
          JSON.parse(
            freteSalvo,
          ) as FreteSelecionado;

        setFreteSelecionado(
          freteConvertido,
        );
      }
    } catch (error) {
      console.error(
        "Não foi possível carregar o frete selecionado:",
        error,
      );

      sessionStorage.removeItem(
        "freteSelecionado",
      );
    } finally {
      setCarregandoFrete(false);
    }
  }, []);

  async function finalizarPedido() {
    if (finalizandoRef.current) {
      return;
    }

    if (itens.length === 0) {
      alert(
        "Seu carrinho está vazio.",
      );
      return;
    }

    if (
      !nomeCliente ||
      !emailCliente ||
      !whatsappCliente ||
      !cpfCnpj
    ) {
      alert(
        "Preencha os dados do cliente antes de finalizar.",
      );

      return;
    }

    if (
      possuiProdutoFisico &&
      !freteSelecionado
    ) {
      alert(
        "Selecione uma opção de frete antes de finalizar.",
      );

      router.push(
        "/carrinho",
      );

      return;
    }

    if (
      possuiProdutoFisico &&
      (!cep ||
        !endereco ||
        !numero ||
        !bairro ||
        !cidade ||
        !estado)
    ) {
      alert(
        "Preencha o endereço completo para receber o pedido.",
      );

      return;
    }

    finalizandoRef.current = true;
    setFinalizando(true);

    try {
      const response =
        await fetch(
          "/api/checkout",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              produtos:
                itens.map(
                  (item) => ({
                    id:
                      item.produto.id,

                    quantidade:
                      item.quantidade,
                  }),
                ),

              nomeCliente,
              whatsappCliente,
              emailCliente,
              cpfCnpj,
              cep,
              endereco,
              numero,
              complemento,
              bairro,
              cidade,
              estado,

              frete:
                freteSelecionado
                  ? {
                      servicoId:
                        freteSelecionado.id,

                      cepDestino:
                        freteSelecionado
                          .cepDestino ||
                        cep.replace(
                          /\D/g,
                          "",
                        ),
                    }
                  : null,
            }),
          },
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.id
      ) {
        console.error(
          "Erro ao iniciar pagamento:",
          data,
        );

        alert(
          data.error ||
            data.erro ||
            "Não foi possível iniciar o pagamento.",
        );

        return;
      }

      sessionStorage.setItem(
        "ultimoPedido",

        JSON.stringify({
          pedidoId:
            data.pedidoId,

          email:
            emailCliente
              .trim()
              .toLowerCase(),

          nome:
            nomeCliente.trim(),
        }),
      );

      const urlPagamento =
        data.initPoint ||
        `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${data.id}`;

      window.location.assign(
        urlPagamento,
      );
    } catch (error) {
      console.error(
        "Erro ao finalizar o pedido:",
        error,
      );

      alert(
        "Ocorreu um erro ao iniciar o pagamento.",
      );
    } finally {
      finalizandoRef.current = false;
      setFinalizando(false);
    }
  }

  if (carregandoFrete) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-xl font-bold text-primary">
          Preparando checkout...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-5 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="rounded-xl border border-border bg-card px-5 py-3 text-center font-bold text-primary shadow transition hover:bg-[color-mix(in_srgb,var(--primary)_8%,white)]"
          >
            ← Continuar comprando
          </Link>

          <Link
            href="/carrinho"
            className="rounded-xl bg-primary px-5 py-3 text-center font-bold text-white shadow transition hover:opacity-90"
          >
            🛒 Voltar ao carrinho
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="h-fit rounded-3xl border border-border bg-card p-5 shadow-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-secondary">
                  Resumo da compra
                </p>

                <h2 className="mt-1 text-2xl font-bold text-text">
                  Produtos do pedido
                </h2>
              </div>

              <span className="rounded-full bg-[color-mix(in_srgb,var(--primary)_10%,white)] px-4 py-2 text-sm font-bold text-primary">
                {quantidadeTotal} item(ns)
              </span>
            </div>

            <div className="mt-5 max-h-[430px] space-y-3 overflow-y-auto pr-1">
              {itens.length === 0 && (
                <div className="rounded-2xl border-2 border-dashed border-border p-8 text-center text-text-light">
                  Nenhum produto no pedido.
                </div>
              )}

              {itens.map((item) => {
                const produto =
                  item.produto;

                return (
                  <div
                    key={
                      item.idCarrinho
                    }
                    className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3"
                  >
                    {produto.imagem && (
                      <img
                        src={
                          produto.imagem
                        }
                        alt={
                          produto.nome
                        }
                        className="h-20 w-20 rounded-xl object-cover"
                      />
                    )}

                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 font-bold text-text">
                        {
                          produto.nome
                        }
                      </h3>

                      <p className="mt-1 text-sm text-text-light">
                        Quantidade:{" "}
                        {
                          item.quantidade
                        }
                      </p>

                      <p className="mt-1 font-bold text-primary">
                        {formatarMoeda(
                          Number(
                            produto.preco ||
                              0,
                          ) *
                            item.quantidade,
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {possuiProdutoFisico &&
              freteSelecionado && (
                <div className="mt-5 rounded-2xl border border-border bg-[color-mix(in_srgb,var(--primary)_8%,white)] p-4">
                  <p className="text-sm font-bold uppercase text-primary">
                    Entrega selecionada
                  </p>

                  <p className="mt-2 font-bold text-text">
                    🚚{" "}
                    {
                      freteSelecionado.transportadora
                    }{" "}
                    —{" "}
                    {
                      freteSelecionado.nome
                    }
                  </p>

                  <p className="mt-1 text-sm text-text-light">
                    Prazo estimado: até{" "}
                    {
                      freteSelecionado.prazo
                    }{" "}
                    dia(s) útil(eis)
                  </p>

                  <p className="mt-2 font-bold text-primary">
                    {formatarMoeda(
                      freteSelecionado.preco,
                    )}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        "/carrinho",
                      )
                    }
                    className="mt-3 text-sm font-bold text-primary underline transition hover:text-primary-light"
                  >
                    Alterar opção de entrega
                  </button>
                </div>
              )}

            {itens.length >
              0 && (
              <div className="mt-5 border-t border-border pt-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-text-light">
                      Subtotal
                    </span>

                    <strong className="text-text">
                      {formatarMoeda(
                        total,
                      )}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-text-light">
                      Frete
                    </span>

                    <strong className="text-text">
                      {!possuiProdutoFisico
                        ? "Grátis"
                        : freteSelecionado
                          ? formatarMoeda(
                              valorFrete,
                            )
                          : "Não selecionado"}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
                    <span className="text-lg font-bold text-text">
                      Total
                    </span>

                    <strong className="text-3xl text-primary">
                      {formatarMoeda(
                        totalComFrete,
                      )}
                    </strong>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-text-light sm:grid-cols-2">
                  <p>
                    🔒 Pagamento seguro
                  </p>

                  <p>
                    ⚡ Processamento automático
                  </p>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-border bg-card p-4 shadow-xl md:p-5">
            <CheckoutCliente
              nomeCliente={
                nomeCliente
              }
              setNomeCliente={
                setNomeCliente
              }
              emailCliente={
                emailCliente
              }
              setEmailCliente={
                setEmailCliente
              }
              whatsappCliente={
                whatsappCliente
              }
              setWhatsappCliente={
                setWhatsappCliente
              }
              cpfCnpj={
                cpfCnpj
              }
              setCpfCnpj={
                setCpfCnpj
              }
              cep={cep}
              setCep={setCep}
              endereco={
                endereco
              }
              setEndereco={
                setEndereco
              }
              numero={numero}
              setNumero={
                setNumero
              }
              complemento={
                complemento
              }
              setComplemento={
                setComplemento
              }
              bairro={bairro}
              setBairro={setBairro}
              cidade={cidade}
              setCidade={setCidade}
              estado={estado}
              setEstado={setEstado}
            />

            <button
              type="button"
              onClick={
                finalizarPedido
              }
              disabled={
                itens.length === 0 ||
                finalizando
              }
              className="mt-4 w-full rounded-2xl bg-success py-3.5 text-xl font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {finalizando
                ? "Preparando pagamento..."
                : `💳 Pagar ${formatarMoeda(
                    totalComFrete,
                  )}`}
            </button>

            <p className="mt-3 text-center text-sm text-text-light">
              Você será direcionado ao Mercado Pago para concluir o pagamento.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}