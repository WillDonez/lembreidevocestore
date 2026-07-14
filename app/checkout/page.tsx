"use client";

import { useState } from "react";
import CheckoutCliente from "@/components/CheckoutCliente";
import { useCarrinho } from "@/app/context/CarrinhoContext";
import { formatarMoeda } from "@/lib/formatadores";

export default function CheckoutPage() {
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

  const {
    carrinho,
    total,
    limparCarrinho,
  } = useCarrinho();

  async function finalizarPedido() {
    if (carrinho.length === 0) {
      alert("Seu carrinho está vazio.");
      return;
    }

    if (!nomeCliente || !emailCliente || !whatsappCliente || !cpfCnpj) {
      alert("Preencha os dados do cliente antes de finalizar.");
      return;
    }

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        produtos: carrinho,
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
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.id) {
      console.log(data);
      alert("Não foi possível iniciar o pagamento.");
      return;
    }

    window.open(
      `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${data.id}`,
      "_blank"
    );

    limparCarrinho();

    setNomeCliente("");
    setEmailCliente("");
    setWhatsappCliente("");
    setCpfCnpj("");
    setCep("");
    setEndereco("");
    setNumero("");
    setComplemento("");
    setBairro("");
    setCidade("");
    setEstado("");
  }

  return (
    <main className="min-h-screen bg-pink-50 px-4 py-5 md:px-6">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="h-fit rounded-3xl bg-white p-5 shadow-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-pink-500">
                Resumo da compra
              </p>

              <h2 className="mt-1 text-2xl font-bold text-gray-800">
                Produtos do Pedido
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
                key={index}
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

          {carrinho.length > 0 && (
            <div className="mt-5 border-t pt-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-lg font-bold text-gray-700">
                  Total
                </span>

                <strong className="text-3xl text-pink-500">
                  {formatarMoeda(total)}
                </strong>
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
            disabled={carrinho.length === 0}
            className="mt-4 w-full rounded-2xl bg-green-500 py-3.5 text-xl font-bold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            💳 Finalizar Pedido
          </button>

          <p className="mt-3 text-center text-sm text-gray-500">
            Você será direcionado ao Mercado Pago para concluir o pagamento.
          </p>
        </section>
      </div>
    </main>
  );
}