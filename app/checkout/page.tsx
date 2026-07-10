"use client";

import { useState } from "react";
import CheckoutCliente from "@/components/CheckoutCliente";
import { useCarrinho } from "@/app/context/CarrinhoContext";

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
    <main className="min-h-screen bg-pink-50 p-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-pink-500 mb-6">
            Produtos do Pedido
          </h2>

          <div className="space-y-4">
  {carrinho.length === 0 && (
    <div className="border-2 border-dashed rounded-2xl p-10 text-center text-gray-500">
      Nenhum produto no pedido.
    </div>
  )}

  {carrinho.map((produto, index) => (
    <div
      key={index}
      className="flex gap-4 bg-pink-50 p-4 rounded-2xl"
    >
      {produto.imagem && (
        <img
          src={produto.imagem}
          alt={produto.nome}
          className="w-24 h-24 object-cover rounded-xl"
        />
      )}

      <div>
        <h3 className="text-xl font-bold text-gray-800">
          {produto.nome}
        </h3>

        <p className="text-gray-500">
          {produto.descricao}
        </p>

        <p className="text-pink-500 font-bold mt-2">
          R$ {Number(produto.preco).toFixed(2)}
        </p>
      </div>
    </div>
  ))}

  {carrinho.length > 0 && (
    <div className="border-t pt-6 mt-6">
      <h3 className="text-3xl font-bold text-pink-500">
        Total: R$ {total.toFixed(2)}
      </h3>
    </div>
  )}
</div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
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
  onClick={finalizarPedido}
  className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl text-2xl font-bold transition"
>
  Finalizar Pedido
</button>

        </div>
      </div>
    </main>
  );
}