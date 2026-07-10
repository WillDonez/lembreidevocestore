"use client";

import { useCarrinho } from "@/app/context/CarrinhoContext";
import Link from "next/link";

export default function CarrinhoPage() {

    const {
  carrinho,
  removerCarrinho,
  total,
} = useCarrinho();

  return (
    <main className="min-h-screen bg-pink-50 p-10">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-10">

        <h1 className="text-5xl font-bold text-pink-500 mb-8">
          Meu Carrinho
        </h1>

        <div className="space-y-6">

  {carrinho.length === 0 ? (

    <div className="border-2 border-dashed rounded-2xl p-12 text-center text-gray-500">
      Seu carrinho está vazio.
    </div>

  ) : (

    <>
      {carrinho.map((produto, index) => (

        <div
          key={index}
          className="flex gap-6 items-center border rounded-2xl p-5"
        >

          {produto.imagem && (
            <img
              src={produto.imagem}
              alt={produto.nome}
              className="w-28 h-28 rounded-xl object-cover"
            />
          )}

          <div className="flex-1">

            <h2 className="text-2xl font-bold">
              {produto.nome}
            </h2>

            <p className="text-gray-500 mt-2">
              {produto.descricao}
            </p>

            <p className="text-pink-500 font-bold text-xl mt-4">
              R$ {Number(produto.preco).toFixed(2)}
            </p>

          </div>

          <button
            onClick={() => removerCarrinho(index)}
            className="bg-red-500 text-white px-5 py-3 rounded-xl hover:bg-red-600"
          >
            Remover
          </button>

        </div>

      ))}

      <div className="border-t pt-8">

        <h2 className="text-4xl font-bold text-pink-500">

          Total: R$ {total.toFixed(2)}

        </h2>

        <Link
  href="/checkout"
  className="block mt-8 bg-green-500 hover:bg-green-600 text-white text-center py-4 rounded-2xl text-2xl font-bold transition"
>
  Finalizar Compra
</Link>

      </div>

    </>

  )}

</div>

      </div>
    </main>
  );
}