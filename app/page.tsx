"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useCarrinho } from "@/app/context/CarrinhoContext";
import Header from "@/components/Header";
import ListaProdutos from "@/components/ListaProdutos";
import ProdutoCard from "@/components/ProdutoCard";
import BenefitsBar from "@/components/storefront/BenefitsBar";
import Footer from "@/components/storefront/Footer";
import HeroCarousel from "@/components/storefront/HeroCarousel";
import SectionHeader from "@/components/storefront/SectionHeader";
import CategoryShowcase from "@/components/storefront/home/CategoryShowcase";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  const [tipoSelecionado, setTipoSelecionado] =
    useState("todos");
  const [categorias, setCategorias] = useState<any[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState("Todos");

  const router = useRouter();

  const { carrinho, adicionarCarrinho } = useCarrinho();

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
      console.error("Erro ao buscar produtos:", error);
      return;
    }

    setProdutos(data ?? []);
  }

  async function buscarCategorias() {
    const { data, error } = await supabase
      .from("categorias")
      .select("*")
      .order("ordem");

    if (error) {
      console.error("Erro ao buscar categorias:", error);
      return;
    }

    const categoriasOrdenadas = [...(data ?? [])].sort(
      (a, b) => {
        if (a.nome === "Outros") return 1;
        if (b.nome === "Outros") return -1;

        return a.nome.localeCompare(b.nome);
      },
    );

    setCategorias(categoriasOrdenadas);
  }

  const quantidadePorCategoria = useMemo(() => {
    return produtos.reduce<Record<string, number>>(
      (acumulador, produto) => {
        const categoria =
          produto.categoria || "Sem categoria";

        acumulador[categoria] =
          (acumulador[categoria] || 0) + 1;

        return acumulador;
      },
      {},
    );
  }, [produtos]);

  const nomesCategorias = useMemo(
    () => [
      "Todos",
      ...categorias.map((categoria) => categoria.nome),
    ],
    [categorias],
  );

  const produtosFiltrados = useMemo(() => {
    const textoBusca = busca.trim().toLowerCase();

    return produtos.filter((produto) => {
      const combinaCategoria =
        categoriaSelecionada === "Todos" ||
        produto.categoria === categoriaSelecionada;

      const nomeProduto = String(
        produto.nome ?? "",
      ).toLowerCase();

      const descricaoProduto = String(
        produto.descricao ?? "",
      ).toLowerCase();

      const combinaBusca =
        textoBusca.length === 0 ||
        nomeProduto.includes(textoBusca) ||
        descricaoProduto.includes(textoBusca);

      const produtoDigital =
        produto.tipo_produto === "pdf" ||
        produto.tipo_produto === "digital" ||
        produto.tipo_produto === "kit" ||
        Boolean(produto.arquivo_digital);

      const combinaTipo =
        tipoSelecionado === "todos" ||
        (tipoSelecionado === "fisico" &&
          !produtoDigital) ||
        (tipoSelecionado === "digital" &&
          produtoDigital);

      return (
        combinaCategoria &&
        combinaBusca &&
        combinaTipo
      );
    });
  }, [
    busca,
    categoriaSelecionada,
    produtos,
    tipoSelecionado,
  ]);

  const produtosDestaque = useMemo(
    () =>
      produtos
        .filter(
          (produto: any) => produto.destaque === true,
        )
        .slice(0, 5),
    [produtos],
  );

  const novidades = useMemo(
    () =>
      [...produtos]
        .sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime(),
        )
        .slice(0, 5),
    [produtos],
  );

  return (
    <main className="min-h-screen bg-background text-text">
      <Header
        quantidadeCarrinho={carrinho.length}
        abrirCarrinho={() => {
          router.push("/carrinho");
        }}
      />

      <HeroCarousel />

      <BenefitsBar />

      <section className="bg-card px-6 py-12 sm:px-10 sm:py-14">
        <div className="mx-auto max-w-7xl text-center">
          <SectionHeader
            etiqueta="Encontre seu presente"
            titulo="Escolha o produto perfeito"
            descricao="Produtos personalizados e digitais feitos com carinho para transformar momentos especiais em lembranças inesquecíveis."
            alinhamento="centro"
          />

          <div className="mx-auto mt-8 flex w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-card shadow-md">
            <select
              value={tipoSelecionado}
              onChange={(evento) => {
                setTipoSelecionado(evento.target.value);
                setCategoriaSelecionada("Todos");
              }}
              className="cursor-pointer border-r border-border bg-background px-4 py-4 text-sm font-bold text-text outline-none transition hover:bg-[color-mix(in_srgb,var(--primary)_8%,white)] sm:px-5 sm:text-base"
              aria-label="Tipo de produto"
            >
              <option value="todos">
                Todos os produtos
              </option>

              <option value="fisico">
                Produtos físicos
              </option>

              <option value="digital">
                Produtos digitais
              </option>
            </select>

            <input
              type="search"
              placeholder="O que você procura hoje?"
              value={busca}
              onChange={(evento) =>
                setBusca(evento.target.value)
              }
              className="min-w-0 flex-1 bg-card px-4 py-4 text-sm text-text outline-none placeholder:text-text-light sm:px-5 sm:text-base"
            />

            <button
              type="button"
              aria-label="Pesquisar produtos"
              className="flex items-center justify-center border-l border-border bg-background px-4 text-text transition hover:bg-[color-mix(in_srgb,var(--primary)_8%,white)] hover:text-primary sm:px-5"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-6 w-6"
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
        <section className="bg-card px-6 py-14 sm:px-10 sm:py-16">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              etiqueta="Seleção especial"
              titulo="Produtos em destaque"
              descricao="Uma seleção de produtos especiais escolhidos para surpreender, presentear e tornar cada ocasião ainda mais marcante."
              alinhamento="centro"
            />

            <div className="mt-10 grid grid-cols-1 justify-center gap-5 sm:grid-cols-[repeat(auto-fit,minmax(220px,260px))]">
              {produtosDestaque.map((produto) => (
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
        <section
          className="px-6 py-14 sm:px-10 sm:py-16"
          style={{
            background:
              "linear-gradient(to bottom, color-mix(in srgb, var(--primary) 6%, white), var(--background))",
          }}
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              etiqueta="Acabaram de chegar"
              titulo="Novidades da loja"
              descricao="Conheça os produtos adicionados recentemente e encontre novas ideias para presentear e celebrar."
              alinhamento="centro"
            />

            <div className="mt-10 grid grid-cols-1 justify-center gap-5 sm:grid-cols-[repeat(auto-fit,minmax(220px,260px))]">
              {novidades.map((produto: any) => (
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

      <Footer />
    </main>
  );
}