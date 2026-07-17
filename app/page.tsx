"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import ProdutoCard from "@/components/ProdutoCard";
import Header from "@/components/Header";
import BannerPrincipal from "@/components/BannerPrincipal";
import BuscaProdutos from "@/components/BuscaProdutos";
import { useCarrinho } from "@/app/context/CarrinhoContext";
import ListaProdutos from "@/components/ListaProdutos";
import { useRouter } from "next/navigation";
import { formatarMoeda } from "@/lib/formatadores";

export default function Home() {

const [produtos, setProdutos] = useState<any[]>([]);
const [busca, setBusca] = useState("");
const [tipoSelecionado, setTipoSelecionado] = useState("fisico");
const [categorias, setCategorias] = useState<any[]>([]);
const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");
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
const router = useRouter();

const {
  carrinho,
  adicionarCarrinho,
  removerCarrinho,
  total,
} = useCarrinho();

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

  const produtosFiltrados = produtos.filter((produto) => {
  const combinaCategoria =
    categoriaSelecionada === "Todos" ||
    produto.categoria === categoriaSelecionada;

  const textoBusca = busca.trim().toLowerCase();

  const combinaBusca =
    produto.nome?.toLowerCase().includes(textoBusca) ||
    produto.descricao?.toLowerCase().includes(textoBusca);

  const combinaTipo =
    tipoSelecionado === "fisico"
      ? produto.tipo_produto === "fisico"
      : produto.tipo_produto === "pdf";

  return combinaCategoria && combinaBusca && combinaTipo;
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
  abrirCarrinho={() => {
    router.push("/carrinho");
  }}
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

    <div className="mx-auto mt-8 flex w-full max-w-3xl overflow-hidden rounded-2xl border border-gray-300 bg-white shadow">
  <select
    value={tipoSelecionado}
    onChange={(e) => {
      setTipoSelecionado(e.target.value);
      setCategoriaSelecionada("Todos");
    }}
    className="cursor-pointer border-r border-gray-300 bg-gray-50 px-5 py-4 text-lg font-medium text-gray-700 outline-none"
    aria-label="Tipo de produto"
  >
    <option value="fisico">Físico</option>
    <option value="digital">Digital</option>
  </select>

  <input
    type="text"
    placeholder="O que você procura hoje?"
    value={busca}
    onChange={(e) => setBusca(e.target.value)}
    className="min-w-0 flex-1 px-5 py-4 text-lg text-gray-700 outline-none"
  />

  <button
    type="button"
    aria-label="Pesquisar produtos"
    className="flex items-center justify-center border-l border-gray-300 bg-gray-50 px-5 text-gray-800 transition hover:bg-pink-50 hover:text-pink-500"
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-7 w-7"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  </button>
</div>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
  {produtosDestaque.slice(0, 5).map((produto) => (
    <ProdutoCard
      key={produto.id}
      produto={produto}
      adicionarCarrinho={adicionarCarrinho}
    />
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
  {novidades.slice(0, 5).map((produto: any) => (
    <ProdutoCard
      key={produto.id}
      produto={produto}
      adicionarCarrinho={adicionarCarrinho}
    />
  ))}
</div>

    </div>
  </section>
)}

<ListaProdutos
  produtos={produtosFiltrados}
  adicionarCarrinho={adicionarCarrinho}
/>

    </main>
  );
}