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

            <p className="mt-4">
              Status:
              <span className="font-bold ml-2 text-pink-500">
                {pedido.status}
              </span>
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}