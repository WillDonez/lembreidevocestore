"use client";

type WatermarkOverlayProps = {
  texto?: string;
  opacidade?: number;
};

export default function WatermarkOverlay({
  texto = "Lembrei de Você Store",
  opacidade = 0.12,
}: WatermarkOverlayProps) {
  const marcas = Array.from(
    { length: 12 },
    (_, indice) => indice,
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
    >
      <div
        className="absolute -inset-[20%] grid rotate-[-24deg] grid-cols-3 gap-x-10 gap-y-12"
        style={{
          opacity: opacidade,
        }}
      >
        {marcas.map((indice) => (
          <span
            key={indice}
            className="select-none whitespace-nowrap text-center text-sm font-black uppercase tracking-[0.18em] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.75)] sm:text-base"
          >
            {texto}
          </span>
        ))}
      </div>
    </div>
  );
}