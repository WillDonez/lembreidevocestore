import type {
  MidiaProduto,
} from "@/components/product/media/MediaTypes";

type Produto = {
  imagem?: string | null;
  video_produto?: string | null;
  capa_video?: string | null;
};

type ImagemGaleria = {
  id: number | string;
  url: string;
  ordem: number;
};

export function montarMidiasProduto(
  produto: Produto,
  imagensGaleria: ImagemGaleria[],
): MidiaProduto[] {
  const midias: MidiaProduto[] = [];

  /*
   * Imagem principal
   */
  if (produto.imagem) {
    midias.push({
      id: "principal",
      tipo: "imagem",
      url: produto.imagem,
      ordem: 0,
      alt: "Imagem principal",
    });
  }

  /*
   * Galeria
   */
  imagensGaleria
    .filter((imagem) => Boolean(imagem.url))
    .sort((a, b) => a.ordem - b.ordem)
    .forEach((imagem) => {
      const existe = midias.some(
        (item) => item.url === imagem.url,
      );

      if (!existe) {
        midias.push({
          id: imagem.id,
          tipo: "imagem",
          url: imagem.url,
          ordem: imagem.ordem,
          alt: `Imagem ${imagem.ordem}`,
        });
      }
    });

  /*
   * Vídeo
   */
  if (produto.video_produto) {
    midias.push({
      id: "video",
      tipo: "video",
      url: produto.video_produto,
      miniatura:
        produto.capa_video ||
        produto.imagem ||
        undefined,
      ordem: 999,
      alt: "Vídeo do produto",
    });
  }

  return midias.sort(
    (a, b) => a.ordem - b.ordem,
  );
}