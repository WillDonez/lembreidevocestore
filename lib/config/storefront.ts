export type HeroSlide = {
  id: string;
  ativo: boolean;
  etiqueta?: string;
  titulo: string;
  destaque?: string;
  descricao: string;
  botaoTexto: string;
  botaoLink: string;
  imagem?: string;
  alinhamento?: "esquerda" | "centro";
  tema: "rosa" | "roxo" | "dourado";
};

export type StorefrontBenefit = {
  id: string;
  ativo: boolean;
  titulo: string;
  descricao: string;
  icone: "entrega" | "digital" | "pagamento" | "atendimento";
};

export type StorefrontConfig = {
  hero: {
    enabled: boolean;
    autoplay: boolean;
    interval: number;
    showArrows: boolean;
    showIndicators: boolean;
    slides: HeroSlide[];
  };

  benefits: {
    enabled: boolean;
    items: StorefrontBenefit[];
  };
};

export const storefrontConfig: StorefrontConfig = {
  hero: {
    enabled: true,
    autoplay: true,

    // Tempo de permanência de cada slide, em milissegundos.
    interval: 6000,

    showArrows: true,
    showIndicators: true,

    slides: [
      {
        id: "presentes-personalizados",
        ativo: true,
        etiqueta: "Feito especialmente para você",
        titulo: "Presentes que transformam",
        destaque: "momentos em memórias",
        descricao:
          "Encontre produtos personalizados e criações especiais para presentear quem você ama.",
        botaoTexto: "Conhecer produtos",
        botaoLink: "#produtos",
        imagem: "/banner-principal.png",
        alinhamento: "esquerda",
        tema: "rosa",
      },
      {
        id: "produtos-digitais",
        ativo: true,
        etiqueta: "Praticidade e rapidez",
        titulo: "Produtos digitais",
        destaque: "prontos para baixar",
        descricao:
          "Arquivos digitais cuidadosamente preparados para você imprimir, personalizar e utilizar.",
        botaoTexto: "Ver produtos digitais",
        botaoLink: "#produtos",
        alinhamento: "esquerda",
        tema: "roxo",
      },
      {
        id: "momentos-especiais",
        ativo: true,
        etiqueta: "Criações exclusivas",
        titulo: "Cada detalhe conta",
        destaque: "uma história especial",
        descricao:
          "Marcadores, lembranças, artes digitais e personalizados feitos com carinho.",
        botaoTexto: "Explorar novidades",
        botaoLink: "#produtos",
        alinhamento: "esquerda",
        tema: "dourado",
      },
    ],
  },

  benefits: {
    enabled: true,

    items: [
      {
        id: "entrega",
        ativo: true,
        titulo: "Enviamos para todo o Brasil",
        descricao: "Receba seus produtos com segurança.",
        icone: "entrega",
      },
      {
        id: "digital",
        ativo: true,
        titulo: "Arquivos digitais",
        descricao: "Acesso rápido após a confirmação.",
        icone: "digital",
      },
      {
        id: "pagamento",
        ativo: true,
        titulo: "Pagamento seguro",
        descricao: "Pix e cartão pelo Mercado Pago.",
        icone: "pagamento",
      },
      {
        id: "atendimento",
        ativo: true,
        titulo: "Atendimento próximo",
        descricao: "Suporte direto pelo WhatsApp.",
        icone: "atendimento",
      },
    ],
  },
};