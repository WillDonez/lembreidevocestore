"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

export default function Home() {

const [produtos, setProdutos] = useState<any[]>([]);

const [carrinho, setCarrinho] = useState<any[]>([]);
const [abrirCarrinho, setAbrirCarrinho] = useState(false);
const [nomeCliente, setNomeCliente] = useState("");
const [whatsappCliente, setWhatsappCliente] = useState("");
useEffect(() => {
  buscarProdutos();
}, []);
 
async function buscarProdutos() {
  const { data, error } = await supabase
    .from("produtos")
    .select("*");

  if (error) {
    alert("ERRO SUPABASE");
    console.log(error);
    return;
  }

  alert("Produtos carregados!");

  console.log(data);

  if (data) {
    setProdutos(data);
  }
}

  function adicionarCarrinho(produto: any) {

  setCarrinho([...carrinho, produto]);
  setAbrirCarrinho(true);

}

function removerCarrinho(index: number) {

  const novoCarrinho = [...carrinho];

  novoCarrinho.splice(index, 1);

  setCarrinho(novoCarrinho);

}

  const total = carrinho.reduce(
    (acc, item) => acc + item.preco,
    0
  );

  return (
    <main className="min-h-screen bg-pink-50">

      <header className="bg-white shadow-md p-6 flex justify-between items-center">

        <h1 className="text-5xl font-bold text-pink-500">
          Lembrei de Voce Store
        </h1>

        <button
  onClick={() => setAbrirCarrinho(true)}
  className="bg-pink-500 text-white px-6 py-3 rounded-xl font-bold"
>
  Carrinho ({carrinho.length})
</button>

      </header>
      <section className="bg-gradient-to-r from-pink-500 to-rose-400 text-white py-20 px-10">

  <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">

    <div>

      <h2 className="text-6xl font-bold leading-tight">
        Presentes Personalizados
        para Momentos Especiais 💖
      </h2>

      <p className="mt-6 text-2xl text-pink-100">
        Canecas, lembrancinhas, topos de bolo,
        presentes criativos e muito mais.
      </p>

      <button className="mt-8 bg-white text-pink-500 px-8 py-4 rounded-2xl font-bold text-xl hover:scale-105 transition">
        Comprar Agora
      </button>

    </div>

    <div>

      <img
        src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=1200&auto=format&fit=crop"
        alt="Banner"
        className="rounded-3xl shadow-2xl"
      />

    </div>

  </div>

</section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-10">

        {produtos.map((produto) => (

          <div
            key={produto.id}
            className="bg-white rounded-3xl shadow-lg overflow-hidden"
          >

            {produto.imagem && (
  <img
    src={produto.imagem}
    alt={produto.nome}
    className="w-full h-72 object-cover"
  />
)}


            <div className="p-6">

              <h2 className="text-4xl font-bold text-gray-800">
                {produto.nome}
              </h2>

              <p className="text-gray-500 mt-2">
  {produto.descricao}
</p>

              <p className="text-pink-500 text-3xl font-bold mt-4">
                R$ {produto.preco}
              </p>

              <button
                onClick={() => adicionarCarrinho(produto)}
                className="mt-6 bg-pink-500 text-white w-full py-4 rounded-2xl text-2xl font-bold"
              >
                Adicionar ao Carrinho
              </button>

            </div>

          </div>

        ))}

      </div>

      {abrirCarrinho && (

        <div className="fixed right-0 top-0 h-full w-[420px] bg-white shadow-2xl p-6 overflow-y-auto z-50">

   <div className="flex justify-between items-center mb-6">

  <h2 className="text-3xl font-bold">
    Seu Carrinho
  </h2>

  <button
    onClick={() => setAbrirCarrinho(false)}
    className="bg-red-500 text-white px-4 py-2 rounded-xl"
  >
    Fechar
  </button>

</div>

<div className="mt-6 space-y-4">

  {carrinho.map((item, index) => (

    <div
      key={index}
      className="bg-pink-50 p-4 rounded-xl"
    >

      <h3 className="font-bold text-xl">
        {item.nome}
      </h3>

      <p className="text-pink-500 font-bold mt-2">
        R$ {item.preco}
      </p>

      <button
        onClick={() => removerCarrinho(index)}
        className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg"
      >
        Remover
      </button>

    </div>

  ))}

</div>

<div className="mt-10">

  <h3 className="text-4xl font-bold">
    Total: R$ {total.toFixed(2)}
  </h3>

  <input
    type="text"
    placeholder="Seu nome completo"
    value={nomeCliente}
    onChange={(e) => setNomeCliente(e.target.value)}
    className="w-full border p-4 rounded-xl mt-6"
  />

  <input
    type="text"
    placeholder="Seu WhatsApp"
    value={whatsappCliente}
    onChange={(e) => setWhatsappCliente(e.target.value)}
    className="w-full border p-4 rounded-xl mt-4"
  />

  <button
    onClick={async () => {
      if (!nomeCliente || !whatsappCliente) {
        alert("Preencha seu nome e WhatsApp antes de finalizar.");
        return;
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          produtos: carrinho,
          nomeCliente,
          whatsappCliente,
        }),
      });

      const data = await response.json();

      window.open(
        `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${data.id}`,
        "_blank"
      );
    }}
    className="bg-green-500 text-white px-6 py-4 rounded-2xl font-bold text-2xl hover:bg-green-600 transition w-full mt-6"
  >
    Finalizar Pedido
  </button>

</div>

        </div>

      )}

    </main>
  );
}