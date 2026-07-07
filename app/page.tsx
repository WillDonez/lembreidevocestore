"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import ProdutoCard from "@/components/ProdutoCard";
import Header from "@/components/Header";
import BannerPrincipal from "@/components/BannerPrincipal";
import BuscaProdutos from "@/components/BuscaProdutos";
import CheckoutCliente from "@/components/CheckoutCliente";

export default function Home() {

const [produtos, setProdutos] = useState<any[]>([]);
const [busca, setBusca] = useState("");
const [categorias, setCategorias] = useState<any[]>([]);
const [carrinho, setCarrinho] = useState<any[]>([]);
const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");
const [abrirCarrinho, setAbrirCarrinho] = useState(false);
const [nomeCliente, setNomeCliente] = useState("");
const [whatsappCliente, setWhatsappCliente] = useState("");
const [emailCliente, setEmailCliente] = useState("");
const [cpfCnpj, setCpfCnpj] = useState("");
const [cep, setCep] = useState("");
const [endereco, setEndereco] = useState("");
const [numero, setNumero] = useState("");
const [complemento, setComplemento] = useState("");
const [bairro, setBairro] = useState("");
const [cidade, setCidade] = useState("");
const [estado, setEstado] = useState("");
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

const produtosDestaque = produtos.filter(
  (produto: any) => produto.destaque === true
);

const novidades = [...produtos]
  .sort(
    (a: any, b: any) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  )
  .slice(0, 4);

  return (
    <main className="min-h-screen bg-pink-50">

      <Header
  quantidadeCarrinho={carrinho.length}
  abrirCarrinho={() => setAbrirCarrinho(true)}
/>

      <BannerPrincipal />

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

{produtosDestaque.length > 0 && (
  <section className="bg-white px-10 pb-10">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-gray-800 mb-6">
        ⭐ Produtos em Destaque
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {produtosDestaque.slice(0, 4).map((produto) => (
          <div
            key={produto.id}
            className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition relative"
          >
            <span className="absolute top-4 left-4 bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold z-10">
              Destaque
            </span>

            <Link href={`/produtos/${produto.id}`}>
              {produto.imagem && (
                <img
                  src={produto.imagem}
                  alt={produto.nome}
                  className="w-full h-56 object-cover cursor-pointer"
                />
              )}
            </Link>

            <div className="p-5">
              <Link href={`/produtos/${produto.id}`}>
                <h3 className="text-2xl font-bold text-gray-800 hover:text-pink-500 cursor-pointer">
                  {produto.nome}
                </h3>
              </Link>

              <p className="text-pink-500 text-2xl font-bold mt-3">
                R$ {produto.preco}
              </p>

              <button
                onClick={() => adicionarCarrinho(produto)}
                className="mt-5 bg-pink-500 text-white w-full py-3 rounded-2xl text-lg font-bold hover:bg-pink-600 transition"
              >
                🛒 Adicionar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)}

{novidades.length > 0 && (
  <section className="bg-pink-50 px-10 py-10">
    <div className="max-w-7xl mx-auto">

      <h2 className="text-4xl font-bold text-gray-800 mb-6">
        🆕 Novidades
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {novidades.map((produto: any) => (

          <div
            key={produto.id}
            className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition"
          >

            <Link href={`/produtos/${produto.id}`}>

              {produto.imagem && (

                <img
                  src={produto.imagem}
                  alt={produto.nome}
                  className="w-full h-56 object-cover cursor-pointer"
                />

              )}

            </Link>

            <div className="p-5">

              <Link href={`/produtos/${produto.id}`}>

                <h3 className="text-2xl font-bold hover:text-pink-500">
                  {produto.nome}
                </h3>

              </Link>

              <p className="text-pink-500 text-2xl font-bold mt-3">
                R$ {produto.preco}
              </p>

              <button
                onClick={() => adicionarCarrinho(produto)}
                className="mt-5 bg-pink-500 text-white w-full py-3 rounded-2xl font-bold hover:bg-pink-600"
              >
                🛒 Adicionar
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  </section>
)}

<div
  id="produtos"
  className="grid grid-cols-1 md:grid-cols-3 gap-8 p-10 bg-white"
>

        {produtosFiltrados.map((produto) => (
  <ProdutoCard
    key={produto.id}
    produto={produto}
    adicionarCarrinho={adicionarCarrinho}
  />
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

  <CheckoutCliente
  nomeCliente={nomeCliente}
  setNomeCliente={setNomeCliente}
  whatsappCliente={whatsappCliente}
  setWhatsappCliente={setWhatsappCliente}
  emailCliente={emailCliente}
  setEmailCliente={setEmailCliente}
  cpfCnpj={cpfCnpj}
  setCpfCnpj={setCpfCnpj}
  cep={cep}
  setCep={setCep}
  endereco={endereco}
  setEndereco={setEndereco}
  numero={numero}
  setNumero={setNumero}
  complemento={complemento}
  setComplemento={setComplemento}
  bairro={bairro}
  setBairro={setBairro}
  cidade={cidade}
  setCidade={setCidade}
  estado={estado}
  setEstado={setEstado}
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