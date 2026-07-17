"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatarMoeda } from "@/lib/formatadores";
import StatusBadge from "@/components/StatusBadge";

export default function DashboardAdmin() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);

  useEffect(() => {
    buscarDados();
  }, []);

  async function buscarDados() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return;
  }

  const response = await fetch("/api/admin/dashboard", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    cache: "no-store",
  });

  const resultado = await response.json();

  if (!response.ok) {
    console.error("Erro ao carregar dashboard:", resultado);
    return;
  }

  setProdutos(resultado.produtos || []);
  setCategorias(resultado.categorias || []);
  setPedidos(resultado.pedidos || []);
  setClientes(resultado.clientes || []);
}

  const faturamento = pedidos.reduce(
  (acc, pedido) => acc + Number(pedido.total),
  0
);

const ultimosPedidos = [...pedidos]
  .sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  )
  .slice(0, 5);

  return (
    <main className="min-h-screen bg-pink-50 p-10">
      <h1 className="text-5xl font-bold text-pink-500 mb-10">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
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
          <p className="text-gray-500">Clientes</p>
          <h2 className="text-4xl font-bold">{clientes.length}</h2>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow">
          <p className="text-gray-500">Faturamento</p>
          <h2 className="text-4xl font-bold text-pink-500">
          {formatarMoeda(faturamento)}
          </h2>
        </div>
      </div>

      <section className="mt-10 rounded-3xl bg-white p-6 shadow">
  <div className="flex items-center justify-between gap-4">
    <div>
      <p className="text-sm font-bold uppercase tracking-wide text-pink-500">
        Visão rápida
      </p>

      <h2 className="mt-1 text-3xl font-bold text-gray-800">
        📦 Últimos Pedidos
      </h2>
    </div>

    <span className="rounded-full bg-pink-100 px-4 py-2 text-sm font-bold text-pink-600">
      {ultimosPedidos.length} pedido(s)
    </span>
  </div>

  {ultimosPedidos.length === 0 ? (
    <div className="mt-6 rounded-2xl border-2 border-dashed p-8 text-center text-gray-500">
      Nenhum pedido encontrado.
    </div>
  ) : (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full min-w-[760px]">
        <thead>
          <tr className="border-b text-left text-sm text-gray-500">
            <th className="px-4 py-3">Pedido</th>
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3">Data</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Total</th>
          </tr>
        </thead>

        <tbody>
          {ultimosPedidos.map((pedido) => (
            <tr
              key={pedido.id}
              className="border-b last:border-b-0 hover:bg-pink-50"
            >
              <td className="px-4 py-4 font-bold text-gray-800">
                LVS-{String(pedido.id).padStart(6, "0")}
              </td>

              <td className="px-4 py-4 text-gray-600">
                {pedido.nome_cliente ||
                  pedido.cliente ||
                  "Cliente não informado"}
              </td>

              <td className="px-4 py-4 text-gray-600">
                {new Date(pedido.created_at).toLocaleDateString("pt-BR")}
              </td>

              <td className="px-4 py-4">
                <StatusBadge status={pedido.status} />
              </td>

              <td className="px-4 py-4 text-right font-bold text-pink-500">
                {formatarMoeda(pedido.total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</section>

    </main>
  );
}