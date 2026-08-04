import { supabase } from "@/lib/supabase";

import type {
  ImagemGaleriaUpload,
} from "@/lib/produto/types";

type SalvarGaleriaParams = {
  produtoId: number;
  imagens: ImagemGaleriaUpload[];
};

export async function salvarGaleria({
  produtoId,
  imagens,
}: SalvarGaleriaParams) {
  if (
    !Number.isInteger(produtoId) ||
    produtoId <= 0
  ) {
    throw new Error(
      "Não foi possível identificar o produto da galeria.",
    );
  }

  if (imagens.length === 0) {
    return [];
  }

  const registros = imagens.map((imagem) => ({
    produto_id: produtoId,
    url: imagem.url,
    ordem: imagem.ordem,
  }));

  const { data, error } = await supabase
    .from("produto_imagens")
    .insert(registros)
    .select("*");

  if (error) {
    console.error(
      "Erro ao salvar imagens da galeria:",
      error,
    );

    throw new Error(
      "As imagens foram enviadas, mas não foi possível vinculá-las ao produto.",
    );
  }

  return data ?? [];
}