"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ProdutoCard from "@/components/ProdutoCard";
import Header from "@/components/Header";
import { useCarrinho } from "@/app/context/CarrinhoContext";
import ListaProdutos from "@/components/ListaProdutos";
import HeroCarousel from "@/components/storefront/HeroCarousel";
import BenefitsBar from "@/components/storefront/BenefitsBar";
import CategoryShowcase from "@/components/storefront/home/CategoryShowcase";

export default function Home() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  const [tipoSelecionado, setTipoSelecionado] = useState("todos");
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

  const { carrinho, adicionarCarrinho } = useCarrinho();

  const quantidadePorCategoria = produtos.reduce<Record<string, number>>(
    (acumulador, produto) => {
      const categoria = produto.categoria || "Sem categoria";

      acumulador[categoria] = (acumulador[categoria] || 0) + 1;

      return acumulador;
    },
    {}
  );

  const nomesCategorias = [
    "Todos",
    ...categorias.map((categoria) => categoria.nome),
  ];

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
      tipoSelecionado === "todos" ||
      (tipoSelecionado === "fisico" &&
        produto.tipo_produto === "fisico") ||
      (tipoSelecionado === "digital" && produto.tipo_produto === "pdf");

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

      <HeroCarousel />

      <BenefitsBar />

      <section className="bg-white p-10">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-xl font-bold text-pink-500">
            ⭐ Produtos em Destaque
          </p>

          <h2 className="mt-2 text-5xl font-bold text-gray-800">
            Escolha o produto perfeito
          </h2>

          <p className="mt-4 text-xl text-gray-500">
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
              <option value="todos">Todos os Produtos</option>
              <option value="fisico">Produtos Físicos</option>
              <option value="digital">Produtos Digitais</option>
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
        </div>
      </section>

      <CategoryShowcase
        categorias={nomesCategorias}
        categoriaSelecionada={categoriaSelecionada}
        aoSelecionarCategoria={setCategoriaSelecionada}
        quantidadePorCategoria={quantidadePorCategoria}
      />

      {produtosDestaque.length > 0 && (
        <section className="bg-white px-10 pb-10">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-6 text-4xl font-bold text-gray-800">
              ⭐ Produtos em Destaque
            </h2>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-6 text-4xl font-bold text-gray-800">
              🆕 Novidades
            </h2>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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