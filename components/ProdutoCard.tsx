"use client";

import Link from "next/link";

interface ProdutoCardProps {
  produto: any;
  adicionarCarrinho: (produto: any) => void;
}

export default function ProdutoCard({
  produto,
  adicionarCarrinho,
}: ProdutoCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition relative">

      {produto.destaque && (
        <span className="absolute top-4 left-4 bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold z-10">
          ⭐ Destaque
        </span>
      )}

      <Link href={`/produtos/${produto.id}`}>
        {produto.imagem && (
          <img
            src={produto.imagem}
            alt={produto.nome}
            className="w-full h-72 object-cover cursor-pointer"
          />
        )}
      </Link>

      <div className="p-6">

        <Link href={`/produtos/${produto.id}`}>
          <h2 className="text-3xl font-bold text-gray-800 hover:text-pink-500 cursor-pointer">
            {produto.nome}
          </h2>
        </Link>

        <p className="text-gray-500 mt-2 line-clamp-2">
          {produto.descricao}
        </p>

        <p className="text-pink-500 text-3xl font-bold mt-4">
          R$ {Number(produto.preco).toFixed(2)}
        </p>

        <button
          onClick={() => adicionarCarrinho(produto)}
          className="mt-6 bg-pink-500 text-white w-full py-4 rounded-2xl text-xl font-bold hover:bg-pink-600 transition"
        >
          🛒 Adicionar ao Carrinho
        </button>

      </div>

    </div>
  );
}