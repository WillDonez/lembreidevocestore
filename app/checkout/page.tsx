"use client";

import { useEffect, useState } from "react";
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

  const [freteSelecionado, setFreteSelecionado] =
    useState<FreteSelecionado | null>(null);

  const [carregandoFrete, setCarregandoFrete] =
    useState(true);

  const [finalizando, setFinalizando] = useState(false);

  const {
    carrinho,
    total,
  } = useCarrinho();

  const possuiProdutoFisico = carrinho.some(
    (produto) =>
      !produto.tipo_produto ||
      produto.tipo_produto === "fisico"
  );

  const valorFrete =
    possuiProdutoFisico && freteSelecionado
      ? Number(freteSelecionado.preco)
      : 0;

  const totalComFrete = total + valorFrete;

  useEffect(() => {
    try {
      const freteSalvo =
        sessionStorage.getItem("freteSelecionado");

      if (freteSalvo) {
        const freteConvertido =
          JSON.parse(freteSalvo) as FreteSelecionado;

        setFreteSelecionado(freteConvertido);

      }
    } catch (error) {
      console.error(
        "Não foi possível carregar o frete selecionado:",
        error
      );

      sessionStorage.removeItem("freteSelecionado");
    } finally {
      setCarregandoFrete(false);
    }
  }, []);

  async function finalizarPedido() {
    if (carrinho.length === 0) {
      alert("Seu carrinho está vazio.");
      return;
    }

    if (
      !nomeCliente ||
      !emailCliente ||
      !whatsappCliente ||
      !cpfCnpj
    ) {
      alert(
        "Preencha os dados do cliente antes de finalizar."
      );
      return;
    }

    if (possuiProdutoFisico && !freteSelecionado) {
      alert(
        "Selecione uma opção de frete antes de finalizar."
      );

      router.push("/carrinho");
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
        "Preencha o endereço completo para receber o pedido."
      );
      return;
    }

    setFinalizando(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          produtos: carrinho.map((produto) => ({
            id: produto.id,
            quantidade: 1,
          })),

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

          frete: freteSelecionado
            ? {
                servicoId: freteSelecionado.id,
                cepDestino:
                  freteSelecionado.cepDestino ||
                  cep.replace(/\D/g, ""),
              }
            : null,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.id) {
        console.error(
          "Erro ao iniciar pagamento:",
          data
        );

        alert(
          data.error ||
            data.erro ||
            "Não foi possível iniciar o pagamento."
        );

        return;
      }

      sessionStorage.setItem(
  "ultimoPedido",
  JSON.stringify({
    pedidoId: data.pedidoId,
    email: emailCliente.trim().toLowerCase(),
    nome: nomeCliente.trim(),
  })
);

      const urlPagamento =
  data.initPoint ||
  `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${data.id}`;

const abaPagamento = window.open(
  urlPagamento,
  "_blank",
  "noopener,noreferrer"
);

if (!abaPagamento) {
  window.location.href = urlPagamento;
}
    } catch (error) {
      console.error(
        "Erro ao finalizar o pedido:",
        error
      );

      alert(
        "Ocorreu um erro ao iniciar o pagamento."
      );
    } finally {
      setFinalizando(false);
    }
  }

  if (carregandoFrete) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-pink-50">
        <p className="text-xl font-bold text-pink-500">
          Preparando checkout...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-pink-50 px-4 py-5 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="rounded-xl bg-white px-5 py-3 text-center font-bold text-pink-600 shadow transition hover:bg-pink-50"
          >
            ← Continuar comprando
          </Link>

          <Link
            href="/carrinho"
            className="rounded-xl bg-pink-500 px-5 py-3 text-center font-bold text-white shadow transition hover:bg-pink-600"
          >
            🛒 Voltar ao carrinho
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="h-fit rounded-3xl bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-pink-500">
                  Resumo da compra
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-800">
                  Produtos do pedido
                </h2>
              </div>

              <span className="rounded-full bg-pink-100 px-4 py-2 text-sm font-bold text-pink-600">
                {carrinho.length} item(ns)
              </span>
            </div>

            <div className="mt-5 max-h-[430px] space-y-3 overflow-y-auto pr-1">
              {carrinho.length === 0 && (
                <div className="rounded-2xl border-2 border-dashed p-8 text-center text-gray-500">
                  Nenhum produto no pedido.
                </div>
              )}

              {carrinho.map((produto, index) => (
                <div
                  key={`${produto.id}-${index}`}
                  className="flex items-center gap-3 rounded-2xl bg-pink-50 p-3"
                >
                  {produto.imagem && (
                    <img
                      src={produto.imagem}
                      alt={produto.nome}
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                  )}

                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 font-bold text-gray-800">
                      {produto.nome}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Quantidade: 1
                    </p>

                    <p className="mt-1 font-bold text-pink-500">
                      {formatarMoeda(produto.preco)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {possuiProdutoFisico &&
              freteSelecionado && (
                <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4">
                  <p className="text-sm font-bold uppercase text-blue-500">
                    Entrega selecionada
                  </p>

                  <p className="mt-2 font-bold text-gray-800">
                    🚚 {freteSelecionado.transportadora} —{" "}
                    {freteSelecionado.nome}
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    Prazo estimado: até{" "}
                    {freteSelecionado.prazo} dia(s) útil(eis)
                  </p>

                  <p className="mt-2 font-bold text-blue-600">
                    {formatarMoeda(
                      freteSelecionado.preco
                    )}
                  </p>

                  <button
                    type="button"
                    onClick={() => router.push("/carrinho")}
                    className="mt-3 text-sm font-bold text-blue-600 underline"
                  >
                    Alterar opção de entrega
                  </button>
                </div>
              )}

            {carrinho.length > 0 && (
              <div className="mt-5 border-t pt-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-600">
                      Subtotal
                    </span>

                    <strong>
                      {formatarMoeda(total)}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-600">
                      Frete
                    </span>

                    <strong>
                      {!possuiProdutoFisico
                        ? "Grátis"
                        : freteSelecionado
                          ? formatarMoeda(valorFrete)
                          : "Não selecionado"}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t pt-4">
                    <span className="text-lg font-bold text-gray-700">
                      Total
                    </span>

                    <strong className="text-3xl text-pink-500">
                      {formatarMoeda(totalComFrete)}
                    </strong>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-gray-600 sm:grid-cols-2">
                  <p>🔒 Pagamento seguro</p>
                  <p>⚡ Processamento automático</p>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-3xl bg-white p-4 shadow-xl md:p-5">
            <CheckoutCliente
              nomeCliente={nomeCliente}
              setNomeCliente={setNomeCliente}
              emailCliente={emailCliente}
              setEmailCliente={setEmailCliente}
              whatsappCliente={whatsappCliente}
              setWhatsappCliente={setWhatsappCliente}
              cpfCnpj={cpfCnpj}
              setCpfCnpj={setCpfCnpj}
              cep={cep}
              setCep={setCep}
              endereco={endereco}
              setEndereco={setEndereco}
              numero={numero}
              setNumero={setNumero}
              complemento={complemento}
              setComplemento={setComplemento}
              bairro={bairro}
              setBairro={setBairro}
              cidade={cidade}
              setCidade={setCidade}
              estado={estado}
              setEstado={setEstado}
            />

            <button
              type="button"
              onClick={finalizarPedido}
              disabled={
                carrinho.length === 0 || finalizando
              }
              className="mt-4 w-full rounded-2xl bg-green-500 py-3.5 text-xl font-bold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {finalizando
                ? "Preparando pagamento..."
                : `💳 Pagar ${formatarMoeda(
                    totalComFrete
                  )}`}
            </button>

            <p className="mt-3 text-center text-sm text-gray-500">
              Você será direcionado ao Mercado Pago para
              concluir o pagamento.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}