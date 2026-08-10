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
  aoSelecionarCategoria: (
    categoria: string,
  ) => void;
  quantidadePorCategoria?: Record<
    string,
    number
  >;
};

function obterIconeCategoria(
  categoria: string,
) {
  const nome =
    categoria.toLowerCase();

  if (
    nome.includes("bolo") ||
    nome.includes("topo")
  ) {
    return CakeSlice;
  }

  if (
    nome.includes("caneca")
  ) {
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

  if (
    nome === "todos"
  ) {
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
  if (
    categorias.length === 0
  ) {
    return null;
  }

  const totalProdutos =
    Object.values(
      quantidadePorCategoria,
    ).reduce(
      (
        total,
        atual,
      ) =>
        total + atual,
      0,
    );

  return (
    <section className="bg-background px-6 py-12 sm:px-10 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          etiqueta="Explore por categoria"
          titulo="Encontre do seu jeito"
          descricao="Escolha uma categoria para descobrir produtos físicos e digitais preparados para diferentes ocasiões."
          alinhamento="centro"
        />

        <div className="-mx-6 overflow-x-auto px-6 pb-3 sm:mx-0 sm:px-0">
          <div className="flex min-w-max gap-3 sm:grid sm:min-w-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {categorias.map(
              (categoria) => {
                const Icone =
                  obterIconeCategoria(
                    categoria,
                  );

                const selecionada =
                  categoriaSelecionada ===
                  categoria;

                const quantidade =
                  categoria === "Todos"
                    ? totalProdutos
                    : quantidadePorCategoria[
                        categoria
                      ] ?? 0;

                return (
                  <button
                    key={categoria}
                    type="button"
                    onClick={() =>
                      aoSelecionarCategoria(
                        categoria,
                      )
                    }
                    aria-pressed={
                      selecionada
                    }
                    className={`group relative w-44 shrink-0 overflow-hidden rounded-2xl border px-4 py-4 text-left transition-all duration-200 sm:w-auto ${
                      selecionada
                        ? "border-primary bg-primary text-white shadow-lg"
                        : "border-border bg-card text-text shadow-sm hover:-translate-y-1 hover:border-primary hover:shadow-lg"
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
                        selecionada
                          ? "bg-white/20 text-white"
                          : "bg-[color-mix(in_srgb,var(--primary)_10%,white)] text-primary group-hover:bg-primary group-hover:text-white"
                      }`}
                    >
                      <Icone
                        className="h-5 w-5"
                        strokeWidth={
                          1.9
                        }
                      />
                    </div>

                    <h3 className="mt-4 text-base font-black leading-tight">
                      {
                        categoria
                      }
                    </h3>

                    <p
                      className={`mt-1.5 text-sm ${
                        selecionada
                          ? "text-white/80"
                          : "text-text-light"
                      }`}
                    >
                      {quantidade ===
                      1
                        ? "1 produto"
                        : `${quantidade} produtos`}
                    </p>

                    <div
                      className={`mt-4 h-1 w-8 rounded-full transition-all duration-200 group-hover:w-12 ${
                        selecionada
                          ? "bg-secondary"
                          : "bg-secondary"
                      }`}
                    />
                  </button>
                );
              },
            )}
          </div>
        </div>
      </div>
    </section>
  );
}