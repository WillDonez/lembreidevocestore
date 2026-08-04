"use client";

import { X, ChevronLeft, ChevronRight } from "lucide-react";

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
      className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center"
      onClick={onFechar}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onFechar();
        }}
        className="absolute top-6 right-6 text-white hover:text-pink-400 transition"
      >
        <X size={34} />
      </button>

      {imagens.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAnterior();
            }}
            className="absolute left-6 text-white hover:text-pink-400 transition"
          >
            <ChevronLeft size={42} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onProxima();
            }}
            className="absolute right-6 text-white hover:text-pink-400 transition"
          >
            <ChevronRight size={42} />
          </button>
        </>
      )}

      <img
        src={imagens[indice]}
        alt=""
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] max-w-[92vw] object-contain rounded-2xl shadow-2xl"
      />

      <div className="absolute bottom-6 text-white font-bold">
        {indice + 1} de {imagens.length}
      </div>
    </div>
  );
}