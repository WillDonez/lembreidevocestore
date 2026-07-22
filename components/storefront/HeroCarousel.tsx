"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  HeroSlide,
  storefrontConfig,
} from "@/lib/config/storefront";

const temas = {
  rosa: {
    fundo:
      "from-rose-50 via-pink-50 to-fuchsia-100",
    etiqueta:
      "bg-white/80 text-pink-600 ring-pink-200",
    destaque: "text-pink-600",
    botao:
      "bg-pink-500 text-white hover:bg-pink-600 focus:ring-pink-300",
    decoracao:
      "bg-pink-300/30",
  },

  roxo: {
    fundo:
      "from-purple-50 via-fuchsia-50 to-pink-100",
    etiqueta:
      "bg-white/80 text-purple-600 ring-purple-200",
    destaque: "text-purple-600",
    botao:
      "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-300",
    decoracao:
      "bg-purple-300/30",
  },

  dourado: {
    fundo:
      "from-amber-50 via-orange-50 to-rose-100",
    etiqueta:
      "bg-white/80 text-amber-700 ring-amber-200",
    destaque: "text-amber-700",
    botao:
      "bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-300",
    decoracao:
      "bg-amber-300/30",
  },
};

export default function HeroCarousel() {
  const configuracao = storefrontConfig.hero;

  const slides = useMemo(
    () => configuracao.slides.filter((slide) => slide.ativo),
    [configuracao.slides]
  );

  const [slideAtual, setSlideAtual] = useState(0);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    if (
      !configuracao.autoplay ||
      pausado ||
      slides.length <= 1
    ) {
      return;
    }

    const temporizador = window.setInterval(() => {
      setSlideAtual((indiceAtual) =>
        indiceAtual === slides.length - 1
          ? 0
          : indiceAtual + 1
      );
    }, configuracao.interval);

    return () => {
      window.clearInterval(temporizador);
    };
  }, [
    configuracao.autoplay,
    configuracao.interval,
    pausado,
    slides.length,
  ]);

  useEffect(() => {
    if (slideAtual >= slides.length) {
      setSlideAtual(0);
    }
  }, [slideAtual, slides.length]);

  function mostrarAnterior() {
    setSlideAtual((indiceAtual) =>
      indiceAtual === 0
        ? slides.length - 1
        : indiceAtual - 1
    );
  }

  function mostrarProximo() {
    setSlideAtual((indiceAtual) =>
      indiceAtual === slides.length - 1
        ? 0
        : indiceAtual + 1
    );
  }

  function temaDoSlide(slide: HeroSlide) {
    return temas[slide.tema];
  }

  if (!configuracao.enabled || slides.length === 0) {
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
          const ativo = indice === slideAtual;
          const tema = temaDoSlide(slide);

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
                <div
                  className={`max-w-2xl ${
                    slide.alinhamento === "centro"
                      ? "mx-auto text-center"
                      : "text-left"
                  }`}
                >
                  {slide.etiqueta && (
                    <span
                      className={`inline-flex rounded-full px-4 py-2 text-sm font-bold shadow-sm ring-1 backdrop-blur-sm ${tema.etiqueta}`}
                    >
                      {slide.etiqueta}
                    </span>
                  )}

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

                  <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600 sm:text-xl">
                    {slide.descricao}
                  </p>

                  <div
                    className={`mt-8 flex flex-wrap gap-4 ${
                      slide.alinhamento === "centro"
                        ? "justify-center"
                        : ""
                    }`}
                  >
                    <Link
                      href={slide.botaoLink}
                      className={`inline-flex min-h-12 items-center justify-center rounded-xl px-7 py-3 font-bold shadow-lg transition duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-4 ${tema.botao}`}
                    >
                      {slide.botaoTexto}

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
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {configuracao.showArrows && slides.length > 1 && (
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

      {configuracao.showIndicators && slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/75 px-4 py-2 shadow-lg backdrop-blur">
          {slides.map((slide, indice) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setSlideAtual(indice)}
              aria-label={`Mostrar banner ${indice + 1}`}
              aria-current={
                indice === slideAtual ? "true" : undefined
              }
              className={`h-2.5 rounded-full transition-all duration-300 ${
                indice === slideAtual
                  ? "w-8 bg-pink-500"
                  : "w-2.5 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}