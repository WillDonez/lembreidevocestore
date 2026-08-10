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
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-7 w-7"
        aria-hidden="true"
      >
        <path d="M3 6h11v11H3z" />
        <path d="M14 9h4l3 4v4h-7z" />

        <circle
          cx="7"
          cy="18"
          r="2"
        />

        <circle
          cx="18"
          cy="18"
          r="2"
        />
      </svg>
    ),

    digital: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-7 w-7"
        aria-hidden="true"
      >
        <rect
          x="4"
          y="3"
          width="16"
          height="18"
          rx="2"
        />

        <path d="M8 8h8" />
        <path d="M8 12h8" />
        <path d="M8 16h5" />
      </svg>
    ),

    pagamento: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-7 w-7"
        aria-hidden="true"
      >
        <rect
          x="3"
          y="5"
          width="18"
          height="14"
          rx="2"
        />

        <path d="M3 10h18" />
        <path d="M7 15h4" />
      </svg>
    ),

    atendimento: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-7 w-7"
        aria-hidden="true"
      >
        <path d="M4 13a8 8 0 0 1 16 0" />

        <path d="M4 13v4a2 2 0 0 0 2 2h2v-7H6a2 2 0 0 0-2 2Z" />

        <path d="M20 13v4a2 2 0 0 1-2 2h-2v-7h2a2 2 0 0 1 2 2Z" />

        <path d="M16 19c0 1.1-.9 2-2 2h-2" />
      </svg>
    ),
  };

  return (
    icones[tipo] ??
    icones.atendimento
  );
}

export default function BenefitsBar() {
  const config =
    storefrontConfig.benefits;

  const items =
    config.items.filter(
      (item) =>
        item.ativo,
    );

  if (
    !config.enabled ||
    items.length === 0
  ) {
    return null;
  }

  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-border px-6 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
        {items.map(
          (
            item,
            indice,
          ) => (
            <div
              key={`${item.titulo}-${indice}`}
              className="group flex items-center gap-4 px-4 py-6 sm:px-6"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--primary)_10%,white)] text-primary transition duration-200 group-hover:-translate-y-0.5 group-hover:bg-primary group-hover:text-white">
                <BenefitIcon
                  tipo={
                    item.icone
                  }
                />
              </div>

              <div className="min-w-0">
                <h3 className="font-black text-text">
                  {
                    item.titulo
                  }
                </h3>

                <p className="mt-1 text-sm leading-relaxed text-text-light">
                  {
                    item.descricao
                  }
                </p>
              </div>
            </div>
          ),
        )}
      </div>
    </section>
  );
}