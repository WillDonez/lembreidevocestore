"use client";

import {
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type ImageLightboxProps = {
  aberto: boolean;
  imagens: string[];
  indice: number;
  onFechar: () => void;
  onAnterior: () => void;
  onProxima: () => void;
};

export default function ImageLightbox({
  aberto,
  imagens,
  indice,
  onFechar,
  onAnterior,
  onProxima,
}: ImageLightboxProps) {
  if (!aberto) return null;

  return (
    <div
      onClick={onFechar}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onFechar();
        }}
        aria-label="Fechar visualização"
        className="absolute right-6 top-6 text-white transition hover:text-primary"
      >
        <X size={34} />
      </button>

      {imagens.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAnterior();
            }}
            aria-label="Imagem anterior"
            className="absolute left-6 text-white transition hover:text-primary"
          >
            <ChevronLeft size={42} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onProxima();
            }}
            aria-label="Próxima imagem"
            className="absolute right-6 text-white transition hover:text-primary"
          >
            <ChevronRight size={42} />
          </button>
        </>
      )}

      <img
        src={imagens[indice]}
        alt={`Imagem ${indice + 1} de ${imagens.length}`}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl"
      />

      <div className="absolute bottom-6 font-bold text-white">
        {indice + 1} de {imagens.length}
      </div>
    </div>
  );
}