"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PedidosPage() {

  const [pedidos, setPedidos] = useState<any[]>([]);

  useEffect(() => {
    buscarPedidos();
  }, []);

  async function buscarPedidos() {

    const { data, error } = await supabase
      .from("pedidos")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    if (data) {
      setPedidos(data);
    }
  }

  async function atualizarStatusPedido(
  pedidoId: number,
  novoStatus: string
) {
  const { error } = await supabase
    .from("pedidos")
    .update({
      status: novoStatus,
    })
    .eq("id", pedidoId);

  if (error) {
    console.log("Erro ao atualizar status:", error);
    alert("Não foi possível atualizar o status do pedido.");
    return;
  }

  setPedidos((pedidosAtuais) =>
    pedidosAtuais.map((pedido) =>
      pedido.id === pedidoId
        ? {
            ...pedido,
            status: novoStatus,
          }
        : pedido
    )
  );
}

  function obterEstiloStatus(status: string) {
  switch (status) {
    case "aprovado":
    case "pago":
      return {
        texto: "Aprovado",
        classe: "bg-green-500",
      };

    case "cancelado":
      return {
        texto: "Cancelado",
        classe: "bg-red-500",
      };

    case "em_producao":
      return {
        texto: "Em produção",
        classe: "bg-orange-500",
      };

    case "pronto":
      return {
        texto: "Pronto",
        classe: "bg-blue-500",
      };

    case "enviado":
      return {
        texto: "Enviado",
        classe: "bg-purple-500",
      };

    case "finalizado":
      return {
        texto: "Finalizado",
        classe: "bg-emerald-700",
      };

    default:
      return {
        texto: "Pendente",
        classe: "bg-yellow-500",
      };
  }
}

  return (

    <main className="min-h-screen bg-pink-50 p-10">

      <h1 className="text-5xl font-bold text-pink-500 mb-10">
        Painel de Pedidos
      </h1>

      <div className="space-y-6">

        {pedidos.map((pedido) => (

          <div
            key={pedido.id}
            className="bg-white rounded-3xl shadow-lg p-6"
          >

            <div className="flex justify-between items-center">

              <h2 className="text-2xl font-bold">
                Pedido #{pedido.id}
              </h2>

              <span
  className={`px-4 py-2 rounded-xl text-white font-bold ${
    obterEstiloStatus(pedido.status).classe
  }`}
>
  {obterEstiloStatus(pedido.status).texto}
</span>

<select
  value={pedido.status}
  onChange={(e) =>
    atualizarStatusPedido(pedido.id, e.target.value)
  }
  className="mt-3 border p-3 rounded-xl font-bold bg-white"
>
  <option value="pendente">Pendente</option>
  <option value="aprovado">Aprovado</option>
  <option value="em_producao">Em produção</option>
  <option value="pronto">Pronto</option>
  <option value="enviado">Enviado</option>
  <option value="finalizado">Finalizado</option>
  <option value="cancelado">Cancelado</option>
</select>

            </div>

            <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
  <div>
    <p className="font-bold text-xl">
      Cliente:
    </p>

    <p className="text-gray-600">
      {pedido.nome_cliente || pedido.cliente || "Cliente não informado"}
    </p>

    {pedido.email_cliente && (
      <p className="text-gray-500">
        {pedido.email_cliente}
      </p>
    )}

    {pedido.whatsapp_cliente && (
      <p className="text-gray-500">
        {pedido.whatsapp_cliente}
      </p>
    )}

    {pedido.cpf_cnpj && (
  <p className="text-gray-500">
    CPF/CNPJ: {pedido.cpf_cnpj}
  </p>
)}

{pedido.endereco && (
  <p className="text-gray-500">
    {pedido.endereco}, {pedido.numero}
    {pedido.complemento && ` - ${pedido.complemento}`}
  </p>
)}

{pedido.bairro && (
  <p className="text-gray-500">
    {pedido.bairro}
  </p>
)}

{pedido.cidade && (
  <p className="text-gray-500">
    {pedido.cidade} - {pedido.estado}
  </p>
)}

{pedido.cep && (
  <p className="text-gray-500">
    CEP: {pedido.cep}
  </p>
)}

  </div>

  <div>
    {pedido.dados_fiscais_completos ? (
      <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold">
        🟢 Dados fiscais completos
      </span>
    ) : (
      <span className="inline-block bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl font-bold">
        🟡 Dados fiscais incompletos
      </span>
    )}
  </div>
</div>

            <div className="mt-4">

              <p className="font-bold text-xl mb-2">
                Produtos:
              </p>

              <div className="space-y-2">

                {pedido.produtos.map((produto: any, index: number) => (

                  <div
  key={index}
  className="bg-pink-50 p-4 rounded-xl flex items-center gap-4"
>
  {produto.imagem && (
    <img
      src={produto.imagem}
      alt={produto.nome}
      className="w-16 h-16 object-cover rounded-xl"
    />
  )}

  <div>
    <p className="font-bold">
      {produto.nome}
    </p>

    <p className="text-pink-500 font-bold">
      R$ {produto.preco}
    </p>
  </div>
</div>

                ))}

              </div>

            </div>

            <div className="mt-6 flex justify-between items-center">

              <h3 className="text-3xl font-bold">
                Total: R$ {pedido.total}
              </h3>

              <p className="text-gray-500">
                {new Date(pedido.created_at).toLocaleString()}
              </p>

            </div>

          </div>

        ))}

      </div>

    </main>
  );
}