export type ConfiguracaoImagem = {
  largura: number;
  altura: number;
  proporcao: string;
  formatos: string;
  tamanhoMaximo: string;
};

export const CONFIGURACOES_IMAGENS = {
  logo: {
    largura: 800,
    altura: 800,
    proporcao: "1:1",
    formatos: "PNG, JPG, WEBP ou SVG",
    tamanhoMaximo: "5 MB",
  },

  favicon: {
    largura: 512,
    altura: 512,
    proporcao: "1:1",
    formatos: "PNG, JPG, WEBP ou ICO",
    tamanhoMaximo: "2 MB",
  },

  produto: {
    largura: 1200,
    altura: 1200,
    proporcao: "1:1",
    formatos: "PNG, JPG ou WEBP",
    tamanhoMaximo: "5 MB",
  },

  bannerHome: {
    largura: 1920,
    altura: 700,
    proporcao: "1920:700",
    formatos: "PNG, JPG ou WEBP",
    tamanhoMaximo: "5 MB",
  },
} satisfies Record<
  string,
  ConfiguracaoImagem
>;

export function legendaImagem(
  configuracao: ConfiguracaoImagem,
) {
  return `Recomendado: ${configuracao.largura} × ${configuracao.altura} px • Proporção ${configuracao.proporcao} • ${configuracao.formatos} • Máx. ${configuracao.tamanhoMaximo}`;
}