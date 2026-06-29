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
                  pedido.status === "pago"
                    ? "bg-green-500"
                    : "bg-yellow-500"
                }`}
              >
                {pedido.status}
              </span>

            </div>

            <div className="mt-4">

              <p className="font-bold text-xl">
                Cliente:
              </p>

              <p className="text-gray-600">
                {pedido.cliente}
              </p>

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