export type TipoMidiaProduto =
  | "imagem"
  | "video"
  | "360";

export type MidiaProduto = {
  id: string | number;
  tipo: TipoMidiaProduto;
  url: string;
  ordem: number;

  /**
   * Imagem exibida como miniatura.
   * É especialmente útil para vídeos e mídias 360°.
   */
  miniatura?: string;

  /**
   * Texto acessível utilizado nas imagens
   * e nos controles da galeria.
   */
  alt?: string;
};

export type ImagemMidiaProduto = MidiaProduto & {
  tipo: "imagem";
};

export type VideoMidiaProduto = MidiaProduto & {
  tipo: "video";

  /**
   * Capa exibida antes de o vídeo começar.
   */
  miniatura?: string;
};

export type Midia360Produto = MidiaProduto & {
  tipo: "360";

  /**
   * Sequência de imagens utilizada para
   * produzir a rotação do produto.
   */
  quadros?: string[];
};

export function ehImagemProduto(
  midia: MidiaProduto,
): midia is ImagemMidiaProduto {
  return midia.tipo === "imagem";
}

export function ehVideoProduto(
  midia: MidiaProduto,
): midia is VideoMidiaProduto {
  return midia.tipo === "video";
}

export function ehMidia360Produto(
  midia: MidiaProduto,
): midia is Midia360Produto {
  return midia.tipo === "360";
}