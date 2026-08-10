"use client";

import { useEffect } from "react";

import {
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import MediaThumbnail from "@/components/product/media/MediaThumbnail";
import MediaViewer from "@/components/product/media/MediaViewer";

import type {
  MidiaProduto,
} from "@/components/product/media/MediaTypes";

type FullscreenMediaViewerProps = {
  aberto: boolean;
  nomeProduto: string;
  midias: MidiaProduto[];
  indiceAtivo: number;
  onFechar: () => void;
  onSelecionar: (indice: number) => void;
  onAnterior: () => void;
  onProxima: () => void;
};

export default function FullscreenMediaViewer({
  aberto,
  nomeProduto,
  midias,
  indiceAtivo,
  onFechar,
  onSelecionar,
  onAnterior,
  onProxima,
}: FullscreenMediaViewerProps) {
  const midiaAtiva =
    midias[indiceAtivo] ?? null;

  const possuiVariasMidias =
    midias.length > 1;

  useEffect(() => {
    if (!aberto) {
      return;
    }

    function tratarTeclado(
      evento: KeyboardEvent,
    ) {
      if (evento.key === "Escape") {
        onFechar();
        return;
      }

      if (
        evento.key === "ArrowLeft" &&
        possuiVariasMidias
      ) {
        onAnterior();
        return;
      }

      if (
        evento.key === "ArrowRight" &&
        possuiVariasMidias
      ) {
        onProxima();
      }
    }

    const overflowAnterior =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    window.addEventListener(
      "keydown",
      tratarTeclado,
    );

    return () => {
      document.body.style.overflow =
        overflowAnterior;

      window.removeEventListener(
        "keydown",
        tratarTeclado,
      );
    };
  }, [
    aberto,
    possuiVariasMidias,
    onFechar,
    onAnterior,
    onProxima,
  ]);

  if (!aberto) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Visualização ampliada de ${nomeProduto}`}
      className="fixed inset-0 z-[9999] flex flex-col bg-gray-950/95 backdrop-blur-md"
    >
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-6">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-light">
            Conheça cada detalhe
          </p>

          <h2 className="mt-1 line-clamp-1 text-base font-black text-white sm:text-lg">
            {nomeProduto}
          </h2>
        </div>

        <button
          type="button"
          onClick={onFechar}
          aria-label="Fechar visualização em tela cheia"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:scale-105 hover:bg-white/20 hover:text-primary-light"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-3 py-4 sm:px-16 sm:py-5">
        <div className="w-full max-w-5xl">
          <MediaViewer
            midia={midiaAtiva}
            nomeProduto={nomeProduto}
          />
        </div>

        {possuiVariasMidias && (
          <>
            <button
              type="button"
              onClick={onAnterior}
              aria-label="Mostrar mídia anterior"
              className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white shadow-xl backdrop-blur transition hover:scale-105 hover:bg-white/20 hover:text-primary-light sm:left-6 sm:h-12 sm:w-12"
            >
              <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" />
            </button>

            <button
              type="button"
              onClick={onProxima}
              aria-label="Mostrar próxima mídia"
              className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white shadow-xl backdrop-blur transition hover:scale-105 hover:bg-white/20 hover:text-primary-light sm:right-6 sm:h-12 sm:w-12"
            >
              <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" />
            </button>
          </>
        )}
      </div>

      <div className="border-t border-white/10 bg-black/20 px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-bold text-white/60">
              Selecione uma miniatura ou use as setas para navegar.
            </p>

            <span className="shrink-0 rounded-full bg-white/10 px-3 py-1.5 text-xs font-black text-white">
              {indiceAtivo + 1} de {midias.length}
            </span>
          </div>

          {possuiVariasMidias && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {midias.map(
                (midia, indice) => (
                  <MediaThumbnail
                    key={`fullscreen-${midia.tipo}-${midia.id}-${indice}`}
                    midia={midia}
                    selecionada={
                      indice === indiceAtivo
                    }
                    indice={indice}
                    nomeProduto={nomeProduto}
                    onSelecionar={() =>
                      onSelecionar(indice)
                    }
                  />
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}