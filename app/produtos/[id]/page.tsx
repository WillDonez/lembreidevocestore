"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useCarrinho } from "@/app/context/CarrinhoContext";
import { useRouter } from "next/navigation";

export default function ProdutoDetalhe() {
  const params = useParams();
  const id = params.id;

  const [produto, setProduto] = useState<any>(null);
  const [relacionados, setRelacionados] = useState<any[]>([]);
const { limparCarrinho, adicionarCarrinho } = useCarrinho();
const router = useRouter();

  useEffect(() => {
    buscarProduto();
  }, [id]);

  async function buscarProduto() {
    const { data, error } = await supabase
      .from("produtos")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.log(error);
      return;
    }

    setProduto(data);

    if (data?.categoria) {
      const { data: relacionadosData } = await supabase
        .from("produtos")
        .select("*")
        .eq("categoria", data.categoria)
        .neq("id", data.id)
        .limit(4);

      setRelacionados(relacionadosData || []);
    }
  }

  function comprarAgora() {
  if (!produto) return;

  limparCarrinho();
  adicionarCarrinho(produto);

  router.push("/checkout");
}

  if (!produto) {
    return (
      <main className="min-h-screen bg-pink-50 flex items-center justify-center">
        <p className="text-2xl font-bold text-pink-500">
          Carregando produto...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-pink-50">
      <header className="bg-white shadow-md p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Lembrei de Você Store"
              className="h-16 w-auto"
            />

            <span className="text-3xl font-bold text-pink-500">
              Lembrei de Voce Store
            </span>
          </Link>

          <Link
            href="/"
            className="bg-pink-500 text-white px-6 py-3 rounded-xl font-bold"
          >
            Voltar para loja
          </Link>
        </div>
      </header>

      <section className="max-w-7xl mx-auto p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white rounded-3xl shadow-xl p-6">
          {produto.imagem && (
            <img
              src={produto.imagem}
              alt={produto.nome}
              className="w-full rounded-3xl object-contain max-h-[600px]"
            />
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-10">
          {produto.destaque && (
            <p className="text-yellow-500 font-bold text-xl mb-4">
              ⭐ Produto em Destaque
            </p>
          )}

          <h1 className="text-5xl font-bold text-gray-800">
            {produto.nome}
          </h1>

          <p className="text-pink-500 text-5xl font-bold mt-6">
            R$ {Number(produto.preco).toFixed(2)}
          </p>

          <p className="text-gray-600 text-xl mt-6 leading-relaxed">
            {produto.descricao}
          </p>

          <div className="mt-8 space-y-4">
            
            <button
              onClick={comprarAgora}
              className="bg-pink-500 text-white w-full py-4 rounded-2xl text-xl font-bold hover:bg-pink-600 transition"
            >
              🛒 Comprar Agora
            </button>

          </div>
        </div>
      </section>

      {relacionados.length > 0 && (
        <section className="max-w-7xl mx-auto p-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">
            Produtos relacionados
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {relacionados.map((item) => (
              <Link
                key={item.id}
                href={`/produtos/${item.id}`}
                className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition"
              >
                {item.imagem && (
                  <img
                    src={item.imagem}
                    alt={item.nome}
                    className="w-full h-56 object-cover"
                  />
                )}

                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800">
                    {item.nome}
                  </h3>

                  <p className="text-pink-500 text-2xl font-bold mt-2">
                    R$ {Number(item.preco).toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}