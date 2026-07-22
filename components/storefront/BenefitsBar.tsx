import {
  StorefrontBenefit,
  storefrontConfig,
} from "@/lib/config/storefront";

function BenefitIcon({
  tipo,
}: {
  tipo: StorefrontBenefit["icone"];
}) {
  const icones = {
    entrega: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
        <path d="M3 6h11v10H3z" />
        <path d="M14 9h4l3 3v4h-7z" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="18" cy="18" r="2" />
      </svg>
    ),

    digital: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8" />
        <path d="M8 12h8" />
        <path d="M8 16h5" />
      </svg>
    ),

    pagamento: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18" />
        <path d="M7 15h4" />
      </svg>
    ),

    atendimento: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
        <path d="M4 13a8 8 0 0 1 16 0" />
        <path d="M4 13v4a2 2 0 0 0 2 2h2v-7H6a2 2 0 0 0-2 2Z" />
        <path d="M20 13v4a2 2 0 0 1-2 2h-2v-7h2a2 2 0 0 1 2 2Z" />
        <path d="M16 19c0 1.1-.9 2-2 2h-2" />
      </svg>
    ),
  };

  return icones[tipo];
}

export default function BenefitsBar() {
  const config = storefrontConfig.benefits;

  const items = config.items.filter((item) => item.ativo);

  if (!config.enabled) return null;

  return (
    <section className="border-y border-pink-100 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-6 transition hover:bg-pink-50"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
              <BenefitIcon tipo={item.icone} />
            </div>

            <div>
              <h3 className="font-bold text-gray-800">
                {item.titulo}
              </h3>

              <p className="text-sm text-gray-500">
                {item.descricao}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}