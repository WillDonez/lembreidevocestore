import { supabase } from "@/lib/supabase";

import type {
  ImagemGaleriaUpload,
} from "@/lib/produto/types";

export async function removerUploadsGaleria(
  imagens: ImagemGaleriaUpload[],
) {
  const caminhos = imagens
    .map((imagem) => imagem.caminho)
    .filter(Boolean);

  if (caminhos.length === 0) {
    return;
  }

  const { error } = await supabase.storage
    .from("produto-imagens")
    .remove(caminhos);

  if (error) {
    console.error(
      "Erro ao remover arquivos da galeria:",
      error,
    );
  }
}