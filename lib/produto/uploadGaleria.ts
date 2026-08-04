import { supabase } from "@/lib/supabase";
import type {
  ImagemGaleria,
  ImagemGaleriaUpload,
} from "@/lib/produto/types";

function gerarNomeSeguro(nomeArquivo: string) {
  const nomeNormalizado = nomeArquivo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.]/g, "-");

  return `${Date.now()}-${crypto.randomUUID()}-${nomeNormalizado}`;
}

export async function uploadGaleria(
  imagens: ImagemGaleria[],
): Promise<ImagemGaleriaUpload[]> {
  const imagensTemporarias = imagens
    .filter(
      (imagem) =>
        imagem.temporaria &&
        imagem.arquivo,
    )
    .sort((a, b) => a.ordem - b.ordem);

  if (imagensTemporarias.length === 0) {
    return [];
  }

  const uploadsConcluidos: ImagemGaleriaUpload[] = [];

  try {
    for (const imagem of imagensTemporarias) {
      if (!imagem.arquivo) {
        continue;
      }

      const caminho = gerarNomeSeguro(
        imagem.arquivo.name,
      );

      const { error: uploadErro } =
        await supabase.storage
          .from("produto-imagens")
          .upload(caminho, imagem.arquivo);

      if (uploadErro) {
        console.error(
          "Erro ao enviar imagem da galeria:",
          uploadErro,
        );

        throw new Error(
          `Não foi possível enviar a imagem da posição ${imagem.ordem}.`,
        );
      }

      const { data } = supabase.storage
        .from("produto-imagens")
        .getPublicUrl(caminho);

      uploadsConcluidos.push({
        url: data.publicUrl,
        caminho,
        ordem: imagem.ordem,
      });
    }

    return uploadsConcluidos;
  } catch (error) {
    const caminhosEnviados =
      uploadsConcluidos.map(
        (imagem) => imagem.caminho,
      );

    if (caminhosEnviados.length > 0) {
      const { error: remocaoErro } =
        await supabase.storage
          .from("produto-imagens")
          .remove(caminhosEnviados);

      if (remocaoErro) {
        console.error(
          "Erro ao remover uploads incompletos da galeria:",
          remocaoErro,
        );
      }
    }

    throw error;
  }
}