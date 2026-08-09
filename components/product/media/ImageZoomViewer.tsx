"use client";

import {
  MouseEvent,
  useState,
} from "react";

import WatermarkOverlay from "@/components/product/media/WatermarkOverlay";

type ImageZoomViewerProps = {
  src: string;
  alt: string;
};

export default function ImageZoomViewer({
  src,
  alt,
}: ImageZoomViewerProps) {
  const [zoomAtivo, setZoomAtivo] =
    useState(false);

  const [
    posicaoZoom,
    setPosicaoZoom,
  ] = useState({
    x: 50,
    y: 50,
  });

  function atualizarPosicaoZoom(
    evento: MouseEvent<HTMLDivElement>,
  ) {
    const area =
      evento.currentTarget.getBoundingClientRect();

    const x =
      ((evento.clientX - area.left) /
        area.width) *
      100;

    const y =
      ((evento.clientY - area.top) /
        area.height) *
      100;

    setPosicaoZoom({
      x: Math.min(
        100,
        Math.max(0, x),
      ),

      y: Math.min(
        100,
        Math.max(0, y),
      ),
    });
  }

  return (
    <div
      onMouseEnter={() =>
        setZoomAtivo(true)
      }
      onMouseLeave={() =>
        setZoomAtivo(false)
      }
      onMouseMove={
        atualizarPosicaoZoom
      }
      className="relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-[1.5rem] bg-gray-50"
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="h-full w-full select-none object-contain"
        style={{
          transform: zoomAtivo
            ? "scale(2)"
            : "scale(1)",

          transformOrigin: `${posicaoZoom.x}% ${posicaoZoom.y}%`,

          transition: zoomAtivo
            ? "transform 120ms ease-out"
            : "transform 250ms ease-out",
        }}
      />

      <WatermarkOverlay
        texto="Lembrei de Você Store"
        opacidade={0.12}
      />

      <div
        className={`pointer-events-none absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full bg-gray-950/70 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur transition ${
          zoomAtivo
            ? "translate-y-2 opacity-0"
            : "opacity-100"
        }`}
      >
        Passe o cursor para ampliar
      </div>
    </div>
  );
}