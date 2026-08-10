"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  Expand,
  Sparkles,
} from "lucide-react";

import FullscreenMediaViewer from "@/components/product/media/FullscreenMediaViewer";
import MediaHints from "@/components/product/media/MediaHints";
import MediaThumbnail from "@/components/product/media/MediaThumbnail";
import MediaViewer from "@/components/product/media/MediaViewer";
import PremiumButton from "@/components/ui/button/PremiumButton";

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
        .filter((midia) =>
          Boolean(midia.url),
        )
        .sort(
          (midiaA, midiaB) =>
            midiaA.ordem -
            midiaB.ordem,
        ),
    [midias],
  );

  const [
    indiceAtivo,
    setIndiceAtivo,
  ] = useState(0);

  const [
    fullscreenAberto,
    setFullscreenAberto,
  ] = useState(false);

  useEffect(() => {
    setIndiceAtivo(0);
    setFullscreenAberto(false);
  }, [
    midiasOrdenadas.length,
    nomeProduto,
  ]);

  const midiaAtiva =
    midiasOrdenadas[indiceAtivo] ??
    null;

  const possuiVariasMidias =
    midiasOrdenadas.length > 1;

  const possuiMidias =
    midiasOrdenadas.length > 0;

  const possuiVideo =
    midiasOrdenadas.some(
      (midia) =>
        midia.tipo === "video",
    );

  function selecionarMidia(
    indice: number,
  ) {
    setIndiceAtivo(indice);
  }

  const mostrarMidiaAnterior =
    useCallback(() => {
      if (!possuiVariasMidias) {
        return;
      }

      setIndiceAtivo(
        (indiceAtual) =>
          indiceAtual === 0
            ? midiasOrdenadas.length -
              1
            : indiceAtual - 1,
      );
    }, [
      possuiVariasMidias,
      midiasOrdenadas.length,
    ]);

  const mostrarProximaMidia =
    useCallback(() => {
      if (!possuiVariasMidias) {
        return;
      }

      setIndiceAtivo(
        (indiceAtual) =>
          indiceAtual ===
          midiasOrdenadas.length -
            1
            ? 0
            : indiceAtual + 1,
      );
    }, [
      possuiVariasMidias,
      midiasOrdenadas.length,
    ]);

  const abrirFullscreen =
    useCallback(() => {
      if (!possuiMidias) {
        return;
      }

      setFullscreenAberto(true);
    }, [possuiMidias]);

  const fecharFullscreen =
    useCallback(() => {
      setFullscreenAberto(false);
    }, []);

  return (
    <>
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-4 w-4" />

              <p className="text-xs font-black uppercase tracking-[0.18em]">
                Conheça cada detalhe
              </p>
            </div>

            <p className="mt-1 text-sm font-medium text-text-light">
              Fotos, zoom, demonstração e tela cheia para
              você explorar melhor o produto.
            </p>
          </div>

          {possuiMidias && (
            <PremiumButton
              type="button"
              variant="outline"
              size="sm"
              onClick={abrirFullscreen}
              className="self-start shadow-sm sm:self-auto"
            >
              <Expand className="h-4 w-4" />
              Explorar detalhes
            </PremiumButton>
          )}
        </div>

        <div className="relative mt-5 overflow-hidden rounded-[1.5rem]">
          <MediaViewer
            midia={midiaAtiva}
            nomeProduto={nomeProduto}
          />

          <MediaHints
            possuiVideo={possuiVideo}
            possuiFullscreen={
              possuiMidias
            }
          />

          {possuiMidias && (
            <button
              type="button"
              onClick={abrirFullscreen}
              aria-label="Explorar o produto em tela cheia"
              title="Explorar detalhes"
              className="absolute right-3 top-3 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/90 text-gray-700 shadow-lg backdrop-blur transition hover:scale-105 hover:text-primary"
            >
              <Expand className="h-4 w-4" />
            </button>
          )}

          {possuiVariasMidias && (
            <>
              <button
                type="button"
                onClick={
                  mostrarMidiaAnterior
                }
                aria-label="Mostrar mídia anterior"
                className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/90 text-gray-700 shadow-lg backdrop-blur transition hover:scale-105 hover:text-primary"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                type="button"
                onClick={
                  mostrarProximaMidia
                }
                aria-label="Mostrar próxima mídia"
                className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/90 text-gray-700 shadow-lg backdrop-blur transition hover:scale-105 hover:text-primary"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              <div className="absolute bottom-3 right-3 z-20 rounded-full bg-gray-950/70 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                {indiceAtivo + 1} de{" "}
                {
                  midiasOrdenadas.length
                }
              </div>
            </>
          )}
        </div>

        {possuiVariasMidias && (
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {midiasOrdenadas.map(
              (
                midia,
                indice,
              ) => (
                <MediaThumbnail
                  key={`${midia.tipo}-${midia.id}-${indice}`}
                  midia={midia}
                  selecionada={
                    indice ===
                    indiceAtivo
                  }
                  indice={
                    indice
                  }
                  nomeProduto={
                    nomeProduto
                  }
                  onSelecionar={() =>
                    selecionarMidia(
                      indice,
                    )
                  }
                />
              ),
            )}
          </div>
        )}

        <p className="mt-3 text-center text-xs font-medium text-text-light">
          Selecione uma miniatura, veja a demonstração ou
          explore o produto em tela cheia.
        </p>
      </section>

      <FullscreenMediaViewer
        aberto={
          fullscreenAberto
        }
        nomeProduto={
          nomeProduto
        }
        midias={
          midiasOrdenadas
        }
        indiceAtivo={
          indiceAtivo
        }
        onFechar={
          fecharFullscreen
        }
        onSelecionar={
          selecionarMidia
        }
        onAnterior={
          mostrarMidiaAnterior
        }
        onProxima={
          mostrarProximaMidia
        }
      />
    </>
  );
}