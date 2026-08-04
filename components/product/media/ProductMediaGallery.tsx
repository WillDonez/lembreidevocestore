"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import MediaThumbnail from "@/components/product/media/MediaThumbnail";
import MediaViewer from "@/components/product/media/MediaViewer";

import type {
  MidiaProduto,
} from "@/components/product/media/MediaTypes";

type ProductMediaGalleryProps = {
  nomeProduto: string;
  midias: MidiaProduto[];
};

export default function ProductMediaGallery({
  nomeProduto,
  midias,
}: ProductMediaGalleryProps) {
  const midiasOrdenadas = useMemo(
    () =>
      [...midias]
        .filter((midia) => Boolean(midia.url))
        .sort(
          (midiaA, midiaB) =>
            midiaA.ordem - midiaB.ordem,
        ),
    [midias],
  );

  const [
    indiceAtivo,
    setIndiceAtivo,
  ] = useState(0);

  useEffect(() => {
    setIndiceAtivo(0);
  }, [midiasOrdenadas.length]);

  const midiaAtiva =
    midiasOrdenadas[indiceAtivo] ?? null;

  const possuiVariasMidias =
    midiasOrdenadas.length > 1;

  function selecionarMidia(indice: number) {
    setIndiceAtivo(indice);
  }

  function mostrarMidiaAnterior() {
    if (!possuiVariasMidias) {
      return;
    }

    setIndiceAtivo((indiceAtual) =>
      indiceAtual === 0
        ? midiasOrdenadas.length - 1
        : indiceAtual - 1,
    );
  }

  function mostrarProximaMidia() {
    if (!possuiVariasMidias) {
      return;
    }

    setIndiceAtivo((indiceAtual) =>
      indiceAtual ===
      midiasOrdenadas.length - 1
        ? 0
        : indiceAtual + 1,
    );
  }

  return (
    <div>
      <div className="relative">
        <MediaViewer
          midia={midiaAtiva}
          nomeProduto={nomeProduto}
        />

        {possuiVariasMidias && (
          <>
            <button
              type="button"
              onClick={mostrarMidiaAnterior}
              aria-label="Mostrar mídia anterior"
              className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/90 text-gray-700 shadow-lg backdrop-blur transition hover:scale-105 hover:text-pink-500"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              type="button"
              onClick={mostrarProximaMidia}
              aria-label="Mostrar próxima mídia"
              className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/90 text-gray-700 shadow-lg backdrop-blur transition hover:scale-105 hover:text-pink-500"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <div className="absolute bottom-3 right-3 z-20 rounded-full bg-gray-950/70 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
              {indiceAtivo + 1} de{" "}
              {midiasOrdenadas.length}
            </div>
          </>
        )}
      </div>

      {possuiVariasMidias && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {midiasOrdenadas.map(
            (midia, indice) => (
              <MediaThumbnail
                key={`${midia.tipo}-${midia.id}-${indice}`}
                midia={midia}
                selecionada={
                  indice === indiceAtivo
                }
                indice={indice}
                nomeProduto={nomeProduto}
                onSelecionar={() =>
                  selecionarMidia(indice)
                }
              />
            ),
          )}
        </div>
      )}

      <p className="mt-3 text-center text-xs font-medium text-gray-400">
        Use as miniaturas ou as setas para navegar entre
        fotos, vídeos e outras mídias do produto.
      </p>
    </div>
  );
}