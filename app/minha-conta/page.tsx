"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PedidoCard from "@/components/PedidoCard";
import { useRouter } from "next/navigation";

type Aba =
  | "inicio"
  | "pedidos"
  | "downloads"
  | "dados"
  | "favoritos";

export default function MinhaContaPage() {

  const router = useRouter();
  const [abaAtiva, setAbaAtiva] = useState<Aba>("inicio");
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [nomeCliente, setNomeCliente] = useState("");

  useEffect(() => {
  buscarPedidos();
  buscarClienteLogado();
}, []);

async function buscarPedidos() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    router.push("/login");
    return;
  }

  const emailUsuario = user.email?.trim().toLowerCase();

  if (!emailUsuario) {
    setPedidos([]);
    return;
  }

  const { data, error } = await supabase
    .from("pedidos")
    .select("*")
    .eq("email_cliente", emailUsuario)
    .order("created_at", { ascending: false });

  if (error) {
    console.log("Erro ao buscar pedidos do cliente:", error);
    setPedidos([]);
    return;
  }

  setPedidos(data || []);
}

const downloadsLiberados = pedidos.flatMap((pedido) => {
  if (!pedido.download_liberado) {
    return [];
  }

  return (pedido.produtos || [])
    .filter((produto: any) => produto.arquivo_digital)
    .map((produto: any) => ({
      ...produto,
      pedidoId: pedido.id,
      dataPedido: pedido.created_at,
    }));
});

async function buscarClienteLogado() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    router.push("/login");
    return;
  }

  const { data, error } = await supabase
    .from("clientes")
    .select("nome")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (error) {
    console.log("Erro ao buscar cliente:", error);
    return;
  }

  if (data?.nome) {
    setNomeCliente(data.nome);
  }
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

      <p className="mt-2 text-gray-500">
        Acesse os arquivos digitais liberados das suas compras.
      </p>

      {downloadsLiberados.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-pink-50 p-8 text-center text-gray-500">
          Nenhum arquivo disponível para download.
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {downloadsLiberados.map((produto: any, index: number) => (
            <div
              key={`${produto.pedidoId}-${index}`}
              className="flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center"
            >
              {produto.imagem && (
                <img
                  src={produto.imagem}
                  alt={produto.nome}
                  className="h-20 w-20 rounded-xl border object-cover"
                />
              )}

              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-bold text-gray-800">
                  {produto.nome}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Pedido LVS-
                  {String(produto.pedidoId).padStart(6, "0")}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Compra realizada em{" "}
                  {new Date(produto.dataPedido).toLocaleDateString(
                    "pt-BR"
                  )}
                </p>
              </div>

              <a
                href={produto.arquivo_digital}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-green-500 px-5 py-3 text-center font-bold text-white transition hover:bg-green-600"
              >
                ⬇ Baixar Arquivo
              </a>
            </div>
          ))}
        </div>
      )}
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
  😄 Seja bem-vindo(a),
</p>

<h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2">
  {nomeCliente || "Cliente"}! 👋
</h2>

<p className="text-gray-500 mt-10 text-xl">
  Estamos felizes em ter você novamente na{" "}
  <strong className="text-pink-500">
    Lembrei de Você Store
  </strong>.
</p>

<p className="text-green-500 mt-2 text-lg">
  Acompanhe seus pedidos, acesse seus downloads e gerencie sua conta.
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
                onClick={() => router.push("/minha-conta/meus-dados")}
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
  type="button"
  onClick={() => router.push("/minha-conta/meus-dados")}
  className={`${itemMenu} mt-2 hover:bg-pink-50`}
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
  onClick={async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }}
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