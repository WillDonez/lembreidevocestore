import { supabase } from "@/lib/supabase";

const TIPOS_PERMITIDOS = [
  "video/mp4",
  "video/webm",
];

const TAMANHO_MAXIMO =
  50 * 1024 * 1024;

export type ResultadoUploadVideo = {
  url: string;
  caminho: string;
};

function gerarNomeSeguro(
  nomeArquivo: string,
) {
  const nomeNormalizado = nomeArquivo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.]/g, "-");

  return `${Date.now()}-${crypto.randomUUID()}-${nomeNormalizado}`;
}

export function validarVideo(
  video: File,
) {
  if (
    !TIPOS_PERMITIDOS.includes(
      video.type,
    )
  ) {
    throw new Error(
      "Apenas vídeos MP4 ou WEBM são permitidos.",
    );
  }

  if (
    video.size > TAMANHO_MAXIMO
  ) {
    throw new Error(
      "O vídeo deve ter no máximo 50 MB.",
    );
  }
}

export async function uploadVideo(
  video: File,
): Promise<ResultadoUploadVideo> {
  validarVideo(video);

  const caminho =
    gerarNomeSeguro(video.name);

  const { error: uploadErro } =
    await supabase.storage
      .from("produto-videos")
      .upload(caminho, video);

  if (uploadErro) {
    console.error(
      "Erro ao enviar vídeo do produto:",
      uploadErro,
    );

    throw new Error(
      "Não foi possível enviar o vídeo do produto.",
    );
  }

  const { data } = supabase.storage
    .from("produto-videos")
    .getPublicUrl(caminho);

  return {
    url: data.publicUrl,
    caminho,
  };
}

export async function removerUploadVideo(
  caminho: string,
) {
  if (!caminho) {
    return;
  }

  const { error } = await supabase.storage
    .from("produto-videos")
    .remove([caminho]);

  if (error) {
    console.error(
      "Erro ao remover vídeo do produto:",
      error,
    );
  }
}

export function obterCaminhoVideoDaUrl(
  url: string,
) {
  const marcador =
    "/storage/v1/object/public/produto-videos/";

  const indice = url.indexOf(marcador);

  if (indice === -1) {
    return "";
  }

  const caminhoCodificado = url.slice(
    indice + marcador.length,
  );

  try {
    return decodeURIComponent(
      caminhoCodificado,
    );
  } catch {
    return caminhoCodificado;
  }
}