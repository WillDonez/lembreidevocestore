"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function MeuPedido() {
  const [busca, setBusca] = useState("");
  const [pedidos, setPedidos] = useState<any[]>([]);

  async function buscarPedido() {
    const { data, error } = await supabase
      .from("pedidos")
      .select("*")
      .or(`id.eq.${busca},whatsapp_cliente.eq.${busca}`);

    if (error) {
      alert("Pedido não encontrado");
      console.log(error);
      return;
    }

    if (data) {
      setPedidos(data);
    }
  }

  return (
    <main className="min-h-screen bg-pink-50 p-10">
      <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl shadow-xl">
        <h1 className="text-4xl font-bold text-pink-500 mb-6">
          Acompanhar Pedido
        </h1>

        <p className="text-gray-600 mb-6">
          Digite o número do pedido ou WhatsApp usado na compra.
        </p>

        <input
          type="text"
          placeholder="Ex: 20 ou 33984292167"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full border p-4 rounded-xl mb-4"
        />

        <button
          onClick={buscarPedido}
          className="bg-pink-500 text-white px-6 py-4 rounded-2xl font-bold w-full"
        >
          Buscar Pedido
        </button>
      </div>

      <div className="max-w-3xl mx-auto mt-10 space-y-6">
        {pedidos.map((pedido) => (
          <div key={pedido.id} className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-3xl font-bold">Pedido #{pedido.id}</h2>

            <p className="text-gray-500 mt-2">
              Cliente: {pedido.nome_cliente || pedido.cliente}
            </p>

            <p className="text-gray-500">
              Total: R$ {Number(pedido.total).toFixed(2)}
            </p>

            <p className="text-gray-500">
              Data: {new Date(pedido.created_at).toLocaleString("pt-BR")}
            </p>

            <div className="mt-8">

  <h3 className="text-2xl font-bold mb-4">
    Produtos do Pedido
  </h3>

  <div className="space-y-4">

    {pedido.produtos?.map((produto: any, index: number) => (

      <div
        key={index}
        className="flex items-center gap-4 bg-pink-50 p-4 rounded-2xl"
      >

        {produto.imagem && (
          <img
            src={produto.imagem}
            alt={produto.nome}
            className="w-24 h-24 object-cover rounded-xl border"
          />
        )}

        <div className="flex-1">

          <h4 className="text-xl font-bold">
            {produto.nome}
          </h4>

          <p className="text-gray-500">
            Quantidade: 1
          </p>

          <p className="text-pink-500 font-bold text-lg">
            R$ {Number(produto.preco).toFixed(2)}
          </p>

        </div>

      </div>

    ))}

  </div>

</div>

            <div className="mt-8">
              <p className="font-bold text-xl mb-6">
                Acompanhamento:
              </p>

              <div className="flex items-center justify-between">
                {[
                  {
                    nome: "Recebido",
                    icone: "📦",
                    ativo: true,
                  },
                  {
                    nome: "Aprovado",
                    icone: "💳",
                    ativo: ["aprovado", "enviado"].includes(pedido.status),
                  },
                  {
                    nome: "Produção",
                    icone: "🎨",
                    ativo: ["aprovado", "enviado"].includes(pedido.status),
                  },
                  {
                    nome: "Enviado",
                    icone: "🚚",
                    ativo: pedido.status === "enviado",
                  },
                ].map((etapa, index, array) => (
                  <div
                    key={etapa.nome}
                    className="flex items-center flex-1"
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold ${
                          etapa.ativo
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {etapa.icone}
                      </div>

                      <p className="mt-2 text-sm font-bold text-center">
                        {etapa.nome}
                      </p>
                    </div>

                    {index < array.length - 1 && (
                      <div
                        className={`h-1 flex-1 mx-2 ${
                          etapa.ativo
                            ? "bg-green-500"
                            : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}