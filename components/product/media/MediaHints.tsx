"use client";

import {
  Expand,
  Play,
  Search,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

type MediaHintsProps = {
  possuiVideo?: boolean;
  possuiFullscreen?: boolean;
};

type DicaMidia = {
  id: string;
  texto: string;
  icone: "zoom" | "video" | "fullscreen";
};

const TEMPO_POR_DICA = 3200;

export default function MediaHints({
  possuiVideo = false,
  possuiFullscreen = true,
}: MediaHintsProps) {
  const dicas = useMemo<DicaMidia[]>(() => {
    const lista: DicaMidia[] = [
      {
        id: "zoom",
        texto: "Passe o cursor para ampliar",
        icone: "zoom",
      },
    ];

    if (possuiVideo) {
      lista.push({
        id: "video",
        texto: "Veja a demonstração do produto",
        icone: "video",
      });
    }

    if (possuiFullscreen) {
      lista.push({
        id: "fullscreen",
        texto: "Explore os detalhes em tela cheia",
        icone: "fullscreen",
      });
    }

    return lista;
  }, [possuiVideo, possuiFullscreen]);

  const [indiceDica, setIndiceDica] =
    useState(0);

  const [visivel, setVisivel] =
    useState(true);

  const [animando, setAnimando] =
    useState(false);

  useEffect(() => {
    setIndiceDica(0);
    setVisivel(true);
    setAnimando(false);
  }, [dicas.length]);

  useEffect(() => {
    if (!visivel || dicas.length === 0) {
      return;
    }

    const temporizador = window.setTimeout(() => {
      const ultimaDica =
        indiceDica === dicas.length - 1;

      if (ultimaDica) {
        setAnimando(true);

        window.setTimeout(() => {
          setVisivel(false);
        }, 300);

        return;
      }

      setAnimando(true);

      window.setTimeout(() => {
        setIndiceDica(
          (indiceAtual) => indiceAtual + 1,
        );

        setAnimando(false);
      }, 300);
    }, TEMPO_POR_DICA);

    return () => {
      window.clearTimeout(temporizador);
    };
  }, [
    dicas.length,
    indiceDica,
    visivel,
  ]);

  if (!visivel || dicas.length === 0) {
    return null;
  }

  const dicaAtual = dicas[indiceDica];

  function renderizarIcone() {
    if (dicaAtual.icone === "video") {
      return (
        <Play className="h-4 w-4 fill-current text-pink-300" />
      );
    }

    if (dicaAtual.icone === "fullscreen") {
      return (
        <Expand className="h-4 w-4 text-pink-300" />
      );
    }

    return (
      <Search className="h-4 w-4 text-pink-300" />
    );
  }

  function fecharDicas() {
    setAnimando(true);

    window.setTimeout(() => {
      setVisivel(false);
    }, 300);
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-5 z-30 flex justify-center px-4">
      <div
        className={`pointer-events-auto flex max-w-full items-center gap-3 rounded-full border border-white/70 bg-gray-950/80 px-4 py-2.5 text-white shadow-xl backdrop-blur-md transition-all duration-300 ${
          animando
            ? "translate-y-2 opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0">
            {renderizarIcone()}
          </span>

          <span className="truncate text-[11px] font-bold sm:text-xs">
            {dicaAtual.texto}
          </span>
        </div>

        {dicas.length > 1 && (
          <div className="flex shrink-0 items-center gap-1">
            {dicas.map((dica, indice) => (
              <span
                key={dica.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  indice === indiceDica
                    ? "w-4 bg-pink-300"
                    : "w-1.5 bg-white/35"
                }`}
              />
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={fecharDicas}
          aria-label="Fechar orientações da galeria"
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}