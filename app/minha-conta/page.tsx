"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PedidoCard from "@/components/PedidoCard";

type Aba =
  | "inicio"
  | "pedidos"
  | "downloads"
  | "dados"
  | "favoritos";

export default function MinhaContaPage() {

  const [abaAtiva, setAbaAtiva] = useState<Aba>("inicio");
  const [pedidos, setPedidos] = useState<any[]>([]);

  useEffect(() => {
  buscarPedidos();
}, []);

async function buscarPedidos() {
  const { data, error } = await supabase
    .from("pedidos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
    return;
  }

  setPedidos(data || []);
}

  function renderizarConteudo() {
    switch (abaAtiva) {
     case "pedidos":
  return (
    <div>
      <h2 className="text-4xl font-bold text-gray-800 mb-8">
        📦 Meus Pedidos
      </h2>

      {pedidos.length === 0 ? (
        <div className="bg-pink-50 rounded-2xl p-8 text-center text-gray-500">
          Nenhum pedido encontrado.
        </div>
      ) : (
        <div className="space-y-6">
          {pedidos.map((pedido) => (
            <PedidoCard
              key={pedido.id}
              pedido={pedido}
            />
          ))}
        </div>
      )}
    </div>
  );

case "downloads":
        return (
          <div>
            <h2 className="text-4xl font-bold text-gray-800">
              ⬇ Downloads
            </h2>

            <p className="text-gray-500 mt-4 text-lg">
              Seus arquivos digitais liberados aparecerão aqui.
            </p>
          </div>
        );

      case "dados":
        return (
          <div>
            <h2 className="text-4xl font-bold text-gray-800">
              👤 Meus Dados
            </h2>

            <p className="text-gray-500 mt-4 text-lg">
              Consulte e atualize seus dados cadastrais.
            </p>
          </div>
        );

      case "favoritos":
        return (
          <div>
            <h2 className="text-4xl font-bold text-gray-800">
              ❤️ Favoritos
            </h2>

            <p className="text-gray-500 mt-4 text-lg">
              Seus produtos favoritos aparecerão aqui.
            </p>
          </div>
        );

      default:
        return (
          <div>
            <p className="text-pink-500 font-bold text-xl">
              Bem-vindo à sua área exclusiva
            </p>

            <h2 className="text-5xl font-bold text-gray-800 mt-2">
              Olá! 👋
            </h2>

            <p className="text-gray-500 mt-5 text-xl">
              Use o menu ao lado para acompanhar pedidos, acessar downloads
              e consultar seus dados.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              <button
                onClick={() => setAbaAtiva("pedidos")}
                className="text-left bg-pink-50 hover:bg-pink-100 p-6 rounded-2xl transition"
              >
                <h3 className="text-2xl font-bold">
                  📦 Meus Pedidos
                </h3>

                <p className="text-gray-500 mt-2">
                  Acompanhe suas compras.
                </p>
              </button>

              <button
                onClick={() => setAbaAtiva("downloads")}
                className="text-left bg-pink-50 hover:bg-pink-100 p-6 rounded-2xl transition"
              >
                <h3 className="text-2xl font-bold">
                  ⬇ Downloads
                </h3>

                <p className="text-gray-500 mt-2">
                  Acesse seus arquivos digitais.
                </p>
              </button>

              <button
                onClick={() => setAbaAtiva("dados")}
                className="text-left bg-pink-50 hover:bg-pink-100 p-6 rounded-2xl transition"
              >
                <h3 className="text-2xl font-bold">
                  👤 Meus Dados
                </h3>

                <p className="text-gray-500 mt-2">
                  Consulte seu cadastro.
                </p>
              </button>

              <button
                onClick={() => setAbaAtiva("favoritos")}
                className="text-left bg-pink-50 hover:bg-pink-100 p-6 rounded-2xl transition"
              >
                <h3 className="text-2xl font-bold">
                  ❤️ Favoritos
                </h3>

                <p className="text-gray-500 mt-2">
                  Veja os produtos salvos.
                </p>
              </button>
            </div>
          </div>
        );
    }
  }

  const itemMenu =
    "w-full text-left px-5 py-4 rounded-2xl font-bold transition";

  return (
    <main className="min-h-screen bg-pink-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-pink-500 mb-10">
          👤 Minha Conta
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          <aside className="bg-white rounded-3xl shadow-xl p-6 h-fit">
            <button
              onClick={() => setAbaAtiva("inicio")}
              className={`${itemMenu} ${
                abaAtiva === "inicio"
                  ? "bg-pink-500 text-white"
                  : "hover:bg-pink-50"
              }`}
            >
              🏠 Início
            </button>

            <button
              onClick={() => setAbaAtiva("pedidos")}
              className={`${itemMenu} mt-2 ${
                abaAtiva === "pedidos"
                  ? "bg-pink-500 text-white"
                  : "hover:bg-pink-50"
              }`}
            >
              📦 Meus Pedidos
            </button>

            <button
              onClick={() => setAbaAtiva("downloads")}
              className={`${itemMenu} mt-2 ${
                abaAtiva === "downloads"
                  ? "bg-pink-500 text-white"
                  : "hover:bg-pink-50"
              }`}
            >
              ⬇ Downloads
            </button>

            <button
              onClick={() => setAbaAtiva("dados")}
              className={`${itemMenu} mt-2 ${
                abaAtiva === "dados"
                  ? "bg-pink-500 text-white"
                  : "hover:bg-pink-50"
              }`}
            >
              👤 Meus Dados
            </button>

            <button
              onClick={() => setAbaAtiva("favoritos")}
              className={`${itemMenu} mt-2 ${
                abaAtiva === "favoritos"
                  ? "bg-pink-500 text-white"
                  : "hover:bg-pink-50"
              }`}
            >
              ❤️ Favoritos
            </button>

            <button
              type="button"
              className={`${itemMenu} mt-8 text-red-500 hover:bg-red-50`}
            >
              🚪 Sair
            </button>
          </aside>

          <section className="bg-white rounded-3xl shadow-xl p-8 md:p-10 min-h-[520px]">
            {renderizarConteudo()}
          </section>
        </div>
      </div>
    </main>
  );
}