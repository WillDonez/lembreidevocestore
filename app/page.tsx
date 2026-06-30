"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

export default function Home() {

const [produtos, setProdutos] = useState<any[]>([]);
const [busca, setBusca] = useState("");
const [categorias, setCategorias] = useState<any[]>([]);
const [carrinho, setCarrinho] = useState<any[]>([]);
const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");
const [abrirCarrinho, setAbrirCarrinho] = useState(false);
const [nomeCliente, setNomeCliente] = useState("");
const [whatsappCliente, setWhatsappCliente] = useState("");
useEffect(() => {
  buscarProdutos();
  buscarCategorias();
}, []);
 
async function buscarProdutos() {
  const { data, error } = await supabase
  .from("produtos")
  .select("*")
  .order("destaque", { ascending: false })
  .order("created_at", { ascending: false });

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

async function buscarCategorias() {
  const { data, error } = await supabase
  .from("categorias")
  .select("*")
  .order("ordem");

  if (error) {
    console.log(error);
    return;
  }

  if (data) {
    data.sort((a, b) => {
  if (a.nome === "Outros") return 1;
  if (b.nome === "Outros") return -1;
  return a.nome.localeCompare(b.nome);
});
    setCategorias(data);
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

  const produtosFiltrados = produtos.filter((produto) => {
  const combinaCategoria =
    categoriaSelecionada === "Todos" ||
    produto.categoria === categoriaSelecionada;

  const combinaBusca =
    produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
    produto.descricao?.toLowerCase().includes(busca.toLowerCase());

  return combinaCategoria && combinaBusca;
});

  return (
    <main className="min-h-screen bg-pink-50">

      <header className="bg-white shadow-md p-6 sticky top-0 z-40">

  <div className="max-w-7xl mx-auto flex justify-between items-center">

    <div className="flex items-center gap-3">
      <img
        src="/logo.png"
        alt="Lembrei de Você Store"
        className="h-16 w-auto"
      />

      <span className="text-3xl font-bold text-pink-500">
        Lembrei de Voce Store
      </span>
    </div>

    <nav className="hidden md:flex items-center gap-8 font-bold text-gray-700">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="hover:text-pink-500"
      >
        Início
      </button>

      <button
        onClick={() =>
          document
            .getElementById("produtos")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        className="hover:text-pink-500"
      >
        Produtos
      </button>

      <a
        href="/meu-pedido"
        className="hover:text-pink-500"
      >
        Meu Pedido
      </a>

      <a
        href="https://wa.me/5533999958593"
        target="_blank"
        className="hover:text-pink-500"
      >
        Contato
      </a>
    </nav>

    <button
      onClick={() => setAbrirCarrinho(true)}
      className="bg-pink-500 text-white px-6 py-3 rounded-xl font-bold"
    >
      Carrinho ({carrinho.length})
    </button>

  </div>

</header>

      <section className="w-full bg-pink-50">
  <img
    src="/banner-principal.png"
    alt="Presentes personalizados Lembrei de Você Store"
    className="w-full h-auto object-cover"
  />
</section>

     <section className="p-10 bg-white">
  <div className="max-w-7xl mx-auto text-center">
    <p className="text-pink-500 font-bold text-xl">
      ⭐ Produtos em Destaque
    </p>

    <h2 className="text-5xl font-bold text-gray-800 mt-2">
      Escolha o produto perfeito
    </h2>

    <p className="text-gray-500 text-xl mt-4">
  Produtos personalizados feitos com carinho para momentos especiais.
</p>

    <input
  type="text"
  placeholder="🔍 O que você procura hoje?"
  value={busca}
  onChange={(e) => setBusca(e.target.value)}
  className="w-full max-w-2xl mx-auto mt-8 border p-4 rounded-2xl text-lg shadow"
/>

<div className="flex flex-wrap justify-center gap-3 mt-8">
  {[
  { nome: "Todos", icone: "🏠" },
  ...categorias,
].map((categoria) => (
    <button
     key={categoria.nome}
      onClick={() => setCategoriaSelecionada(categoria.nome)}
      className={`px-5 py-3 rounded-full font-bold transition ${
        categoriaSelecionada === categoria.nome
          ? "bg-pink-500 text-white"
          : "bg-pink-100 text-pink-600 hover:bg-pink-200"
      }`}
    >
      {categoria.icone} {categoria.nome}
    </button>
  ))}
</div>

  </div>
</section>

<div
  id="produtos"
  className="grid grid-cols-1 md:grid-cols-3 gap-8 p-10 bg-white"
>

        {produtosFiltrados.map((produto) => (

          <div
  key={produto.id}
  className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition relative"
>

  <span className="absolute top-4 left-4 bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold z-10">
  Novo
</span>

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
  <h2 className="text-4xl font-bold text-gray-800 hover:text-pink-500 cursor-pointer">
    {produto.nome}
  </h2>
</Link>

              <p className="text-gray-500 mt-2">
  {produto.descricao}
</p>

              <p className="text-pink-500 text-3xl font-bold mt-4">
                R$ {produto.preco}
              </p>

              <button
  onClick={() => adicionarCarrinho(produto)}
  className="mt-6 bg-pink-500 text-white w-full py-4 rounded-2xl text-xl font-bold hover:bg-pink-600 transition"
>
  🛒 Adicionar ao Carrinho
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