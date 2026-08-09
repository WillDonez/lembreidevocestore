"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

type BannerHome = {
  id: number;
  titulo: string | null;
  destaque: string | null;
  descricao: string | null;
  imagem: string | null;
  botao_texto: string | null;
  botao_link: string | null;
  tema: string | null;
  ordem: number;
  ativo: boolean;
};

const temas = {
  primary: {
    fundo: "from-[#FDF2F8] via-[#FCE7F3] to-[#FBCFE8]",
    etiqueta:
      "bg-white/85 text-[#DB2777] ring-[#F9A8D4]",
    destaque: "text-[#DB2777]",
    botao:
      "bg-[#DB2777] text-white hover:bg-[#BE185D] focus:ring-[#F9A8D4]",
    decoracao: "bg-[#F9A8D4]/35",
  },

  secondary: {
    fundo: "from-[#EFF6FF] via-[#DBEAFE] to-[#BFDBFE]",
    etiqueta:
      "bg-white/85 text-[#1E3A5F] ring-[#93C5FD]",
    destaque: "text-[#1E3A5F]",
    botao:
      "bg-[#1E3A5F] text-white hover:bg-[#172F4D] focus:ring-[#93C5FD]",
    decoracao: "bg-[#93C5FD]/30",
  },

  accent: {
    fundo: "from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A]",
    etiqueta:
      "bg-white/85 text-[#B7791F] ring-[#FCD34D]",
    destaque: "text-[#B7791F]",
    botao:
      "bg-[#D4A72C] text-white hover:bg-[#B88D1E] focus:ring-[#FCD34D]",
    decoracao: "bg-[#FCD34D]/30",
  },
};

type TemaKey = keyof typeof temas;

function normalizarTema(tema: string | null): TemaKey {
  const valor = String(tema ?? "")
    .trim()
    .toLowerCase();

  if (
    valor === "secondary" ||
    valor === "azul" ||
    valor === "azul petróleo" ||
    valor === "azul petroleo"
  ) {
    return "secondary";
  }

  if (
    valor === "accent" ||
    valor === "dourado" ||
    valor === "gold"
  ) {
    return "accent";
  }

  return "primary";
}

export default function HeroCarousel() {
  const [slides, setSlides] = useState<BannerHome[]>([]);
  const [slideAtual, setSlideAtual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarBanners() {
      const { data, error } = await supabase
        .from("banners_home")
        .select("*")
        .eq("ativo", true)
        .order("ordem", {
          ascending: true,
        });

      if (error) {
        console.error(
          "Erro ao carregar banners da Home:",
          error,
        );

        setSlides([]);
        setCarregando(false);
        return;
      }

      setSlides((data ?? []) as BannerHome[]);
      setCarregando(false);
    }

    buscarBanners();
  }, []);

  useEffect(() => {
    if (
      pausado ||
      slides.length <= 1
    ) {
      return;
    }

    const temporizador = window.setInterval(() => {
      setSlideAtual((indiceAtual) =>
        indiceAtual === slides.length - 1
          ? 0
          : indiceAtual + 1,
      );
    }, 6000);

    return () => {
      window.clearInterval(temporizador);
    };
  }, [
    pausado,
    slides.length,
  ]);

  useEffect(() => {
    if (
      slides.length > 0 &&
      slideAtual >= slides.length
    ) {
      setSlideAtual(0);
    }
  }, [
    slideAtual,
    slides.length,
  ]);

  function mostrarAnterior() {
    if (slides.length <= 1) {
      return;
    }

    setSlideAtual((indiceAtual) =>
      indiceAtual === 0
        ? slides.length - 1
        : indiceAtual - 1,
    );
  }

  function mostrarProximo() {
    if (slides.length <= 1) {
      return;
    }

    setSlideAtual((indiceAtual) =>
      indiceAtual === slides.length - 1
        ? 0
        : indiceAtual + 1,
    );
  }

  if (carregando) {
    return (
      <section
        className="min-h-[430px] w-full animate-pulse bg-gray-100 sm:min-h-[480px] lg:min-h-[520px]"
        aria-label="Carregando destaques da loja"
      />
    );
  }

  if (slides.length === 0) {
    return null;
  }

  return (
    <section
      className="relative w-full overflow-hidden bg-white"
      aria-roledescription="carrossel"
      aria-label="Destaques da loja"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
    >
      <div className="relative min-h-[430px] sm:min-h-[480px] lg:min-h-[520px]">
        {slides.map((slide, indice) => {
          const ativo =
            indice === slideAtual;

          const tema =
            temas[normalizarTema(slide.tema)];

          return (
            <article
              key={slide.id}
              aria-hidden={!ativo}
              className={`absolute inset-0 overflow-hidden bg-gradient-to-br transition-all duration-700 ease-in-out ${
                tema.fundo
              } ${
                ativo
                  ? "visible translate-x-0 opacity-100"
                  : "invisible translate-x-5 opacity-0"
              }`}
            >
              {slide.imagem && (
                <>
                  <img
                    src={slide.imagem}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />

                  <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/15" />

                  <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent" />
                </>
              )}

              {!slide.imagem && (
                <>
                  <div
                    className={`absolute -right-24 -top-32 h-96 w-96 rounded-full blur-3xl ${tema.decoracao}`}
                  />

                  <div
                    className={`absolute -bottom-40 left-1/2 h-96 w-96 rounded-full blur-3xl ${tema.decoracao}`}
                  />

                  <div className="absolute right-[10%] top-1/2 hidden -translate-y-1/2 lg:block">
                    <div className="relative flex h-72 w-72 items-center justify-center rounded-full border border-white/70 bg-white/45 shadow-2xl backdrop-blur-md">
                      <div className="absolute inset-5 rounded-full border border-white/80" />

                      <span
                        className={`text-center text-7xl font-bold ${tema.destaque}`}
                        aria-hidden="true"
                      >
                        ♥
                      </span>
                    </div>
                  </div>
                </>
              )}

              <div className="relative z-10 mx-auto flex min-h-[430px] max-w-7xl items-center px-6 py-16 sm:min-h-[480px] sm:px-10 lg:min-h-[520px] lg:px-12">
                <div className="max-w-2xl text-left">
                  <span
                    className={`inline-flex rounded-full px-4 py-2 text-sm font-bold shadow-sm ring-1 backdrop-blur-sm ${tema.etiqueta}`}
                  >
                    Lembrei de Você Store
                  </span>

                  <h1 className="mt-6 text-4xl font-black leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
                    {slide.titulo}

                    {slide.destaque && (
                      <span
                        className={`mt-1 block ${tema.destaque}`}
                      >
                        {slide.destaque}
                      </span>
                    )}
                  </h1>

                  {slide.descricao && (
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600 sm:text-xl">
                      {slide.descricao}
                    </p>
                  )}

                  {slide.botao_texto && (
                    <div className="mt-8 flex flex-wrap gap-4">
                      <Link
                        href={
                          slide.botao_link || "/"
                        }
                        className={`inline-flex min-h-12 items-center justify-center rounded-xl px-7 py-3 font-bold shadow-lg transition duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-4 ${tema.botao}`}
                      >
                        {slide.botao_texto}

                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="ml-2 h-5 w-5"
                          aria-hidden="true"
                        >
                          <path d="M5 12h14" />
                          <path d="m13 6 6 6-6 6" />
                        </svg>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={mostrarAnterior}
            aria-label="Mostrar banner anterior"
            className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/80 text-gray-700 shadow-lg backdrop-blur transition hover:scale-105 hover:bg-white sm:left-6"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <button
            type="button"
            onClick={mostrarProximo}
            aria-label="Mostrar próximo banner"
            className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/80 text-gray-700 shadow-lg backdrop-blur transition hover:scale-105 hover:bg-white sm:right-6"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </>
      )}

      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/75 px-4 py-2 shadow-lg backdrop-blur">
          {slides.map((slide, indice) => (
            <button
              key={slide.id}
              type="button"
              onClick={() =>
                setSlideAtual(indice)
              }
              aria-label={`Mostrar banner ${
                indice + 1
              }`}
              aria-current={
                indice === slideAtual
                  ? "true"
                  : undefined
              }
              className={`h-2.5 rounded-full transition-all duration-300 ${
                indice === slideAtual
                  ? "w-8 bg-[#DB2777]"
                  : "w-2.5 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}