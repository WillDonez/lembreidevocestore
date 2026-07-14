"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatarMoeda } from "@/lib/formatadores";

export default function DashboardAdmin() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [pedidos, setPedidos] = useState<any[]>([]);

  useEffect(() => {
    buscarDados();
  }, []);

  async function buscarDados() {
    const { data: produtosData } = await supabase
      .from("produtos")
      .select("*");

    const { data: categoriasData } = await supabase
      .from("categorias")
      .select("*");

    const { data: pedidosData } = await supabase
      .from("pedidos")
      .select("*");

    setProdutos(produtosData || []);
    setCategorias(categoriasData || []);
    setPedidos(pedidosData || []);
  }

  const faturamento = pedidos.reduce(
    (acc, pedido) => acc + Number(pedido.total),
    0
  );

  return (
    <main className="min-h-screen bg-pink-50 p-10">
      <h1 className="text-5xl font-bold text-pink-500 mb-10">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow">
          <p className="text-gray-500">Produtos</p>
          <h2 className="text-4xl font-bold">{produtos.length}</h2>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow">
          <p className="text-gray-500">Categorias</p>
          <h2 className="text-4xl font-bold">{categorias.length}</h2>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow">
          <p className="text-gray-500">Pedidos</p>
          <h2 className="text-4xl font-bold">{pedidos.length}</h2>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow">
          <p className="text-gray-500">Faturamento</p>
          <p className="text-3xl font-bold">
  {formatarMoeda(faturamento)}
</p>
        </div>
      </div>
    </main>
  );
}