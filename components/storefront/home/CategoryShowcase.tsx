"use client";

import {
  CakeSlice,
  Coffee,
  FileText,
  Gift,
  Grid2X2,
  Tags,
} from "lucide-react";

import SectionHeader from "@/components/storefront/SectionHeader";

type CategoryShowcaseProps = {
  categorias: string[];
  categoriaSelecionada: string;
  aoSelecionarCategoria: (categoria: string) => void;
  quantidadePorCategoria?: Record<string, number>;
};

function obterIconeCategoria(categoria: string) {
  const nome = categoria.toLowerCase();

  if (nome.includes("bolo") || nome.includes("topo")) {
    return CakeSlice;
  }

  if (nome.includes("caneca")) {
    return Coffee;
  }

  if (
    nome.includes("pdf") ||
    nome.includes("digital") ||
    nome.includes("arquivo")
  ) {
    return FileText;
  }

  if (
    nome.includes("presente") ||
    nome.includes("lembrança") ||
    nome.includes("personalizado")
  ) {
    return Gift;
  }

  if (nome === "todos") {
    return Grid2X2;
  }

  return Tags;
}

export default function CategoryShowcase({
  categorias,
  categoriaSelecionada,
  aoSelecionarCategoria,
  quantidadePorCategoria = {},
}: CategoryShowcaseProps) {
  if (categorias.length === 0) {
    return null;
  }

  return (
    <section className="bg-gradient-to-b from-white to-pink-50/40 py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <SectionHeader
          etiqueta="Explore a loja"
          titulo="Navegue por categoria"
          descricao="Encontre rapidamente o tipo de produto ideal para cada momento especial."
          alinhamento="centro"
        />

        <div className="-mx-6 overflow-x-auto px-6 pb-3 sm:mx-0 sm:px-0">
          <div className="flex min-w-max gap-4 sm:grid sm:min-w-0 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {categorias.map((categoria) => {
              const Icone = obterIconeCategoria(categoria);
              const selecionada =
                categoriaSelecionada === categoria;

              const quantidade =
                categoria === "Todos"
                  ? Object.values(quantidadePorCategoria).reduce(
                      (total, atual) => total + atual,
                      0
                    )
                  : quantidadePorCategoria[categoria] ?? 0;

              return (
                <button
                  key={categoria}
                  type="button"
                  onClick={() => aoSelecionarCategoria(categoria)}
                  aria-pressed={selecionada}
                  className={`group w-52 shrink-0 rounded-3xl border p-5 text-left transition duration-200 sm:w-auto ${
                    selecionada
                      ? "border-pink-500 bg-pink-500 text-white shadow-xl shadow-pink-200/60"
                      : "border-pink-100 bg-white text-gray-800 shadow-sm hover:-translate-y-1 hover:border-pink-300 hover:shadow-xl"
                  }`}
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl transition ${
                      selecionada
                        ? "bg-white/20 text-white"
                        : "bg-pink-100 text-pink-600 group-hover:bg-pink-500 group-hover:text-white"
                    }`}
                  >
                    <Icone className="h-7 w-7" strokeWidth={1.8} />
                  </div>

                  <h3 className="mt-5 text-lg font-black leading-tight">
                    {categoria}
                  </h3>

                  <p
                    className={`mt-2 text-sm ${
                      selecionada
                        ? "text-pink-50"
                        : "text-gray-500"
                    }`}
                  >
                    {quantidade === 1
                      ? "1 produto"
                      : `${quantidade} produtos`}
                  </p>

                  <div
                    className={`mt-5 h-1 w-10 rounded-full transition-all group-hover:w-16 ${
                      selecionada
                        ? "bg-white"
                        : "bg-pink-400"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}