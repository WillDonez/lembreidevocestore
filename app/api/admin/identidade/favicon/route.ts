import {
  NextRequest,
  NextResponse,
} from "next/server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

const BUCKET =
  "loja-identidade";

const TAMANHO_MAXIMO =
  2 * 1024 * 1024;

const TIPOS_PERMITIDOS = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/x-icon",
  "image/vnd.microsoft.icon",
];

async function validarAdmin(
  request: NextRequest,
) {
  const authorization =
    request.headers.get(
      "authorization",
    );

  if (
    !authorization?.startsWith(
      "Bearer ",
    )
  ) {
    return {
      erro: NextResponse.json(
        {
          erro:
            "Usuário não autenticado.",
        },
        {
          status: 401,
        },
      ),
    };
  }

  const accessToken =
    authorization
      .replace(
        "Bearer ",
        "",
      )
      .trim();

  const {
    data: { user },
    error: usuarioErro,
  } =
    await supabaseAdmin.auth.getUser(
      accessToken,
    );

  if (
    usuarioErro ||
    !user
  ) {
    return {
      erro: NextResponse.json(
        {
          erro:
            "Sessão inválida ou expirada.",
        },
        {
          status: 401,
        },
      ),
    };
  }

  const {
    data: perfil,
    error: perfilErro,
  } = await supabaseAdmin
    .from("clientes")
    .select("role")
    .eq(
      "auth_user_id",
      user.id,
    )
    .maybeSingle();

  if (
    perfilErro ||
    !perfil ||
    perfil.role !== "admin"
  ) {
    return {
      erro: NextResponse.json(
        {
          erro:
            "Acesso permitido somente para administradores.",
        },
        {
          status: 403,
        },
      ),
    };
  }

  return {
    user,
  };
}

function obterExtensao(
  arquivo: File,
) {
  const nome =
    arquivo.name.toLowerCase();

  const extensaoNome =
    nome.includes(".")
      ? nome
          .split(".")
          .pop()
      : "";

  if (
    extensaoNome &&
    [
      "png",
      "jpg",
      "jpeg",
      "webp",
      "ico",
    ].includes(
      extensaoNome,
    )
  ) {
    return extensaoNome === "jpeg"
      ? "jpg"
      : extensaoNome;
  }

  switch (arquivo.type) {
    case "image/png":
      return "png";

    case "image/jpeg":
      return "jpg";

    case "image/webp":
      return "webp";

    case "image/x-icon":
    case "image/vnd.microsoft.icon":
      return "ico";

    default:
      return "";
  }
}

export async function POST(
  request: NextRequest,
) {
  try {
    const autenticacao =
      await validarAdmin(request);

    if ("erro" in autenticacao) {
      return autenticacao.erro;
    }

    const formData =
      await request.formData();

    const arquivo =
      formData.get("arquivo");

    if (!(arquivo instanceof File)) {
      return NextResponse.json(
        {
          erro:
            "Nenhum arquivo foi enviado.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !TIPOS_PERMITIDOS.includes(
        arquivo.type,
      )
    ) {
      return NextResponse.json(
        {
          erro:
            "Formato inválido. Envie PNG, JPG, WEBP ou ICO.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      arquivo.size >
      TAMANHO_MAXIMO
    ) {
      return NextResponse.json(
        {
          erro:
            "O favicon deve ter no máximo 2 MB.",
        },
        {
          status: 400,
        },
      );
    }

    const extensao =
      obterExtensao(arquivo);

    if (!extensao) {
      return NextResponse.json(
        {
          erro:
            "Não foi possível identificar o formato do arquivo.",
        },
        {
          status: 400,
        },
      );
    }

    const nomeArquivo =
      `favicon/favicon-${Date.now()}.${extensao}`;

    const buffer =
      Buffer.from(
        await arquivo.arrayBuffer(),
      );

    const {
      error: uploadErro,
    } =
      await supabaseAdmin.storage
        .from(BUCKET)
        .upload(
          nomeArquivo,
          buffer,
          {
            contentType:
              arquivo.type,
            upsert: false,
            cacheControl:
              "3600",
          },
        );

    if (uploadErro) {
      console.error(
        "Erro ao enviar favicon:",
        uploadErro,
      );

      return NextResponse.json(
        {
          erro:
            "Não foi possível enviar o favicon.",
        },
        {
          status: 500,
        },
      );
    }

    const {
      data: publicUrlData,
    } =
      supabaseAdmin.storage
        .from(BUCKET)
        .getPublicUrl(
          nomeArquivo,
        );

    const url =
      publicUrlData.publicUrl;

    if (!url) {
      return NextResponse.json(
        {
          erro:
            "Não foi possível gerar a URL pública do favicon.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      sucesso: true,
      url,
      caminho:
        nomeArquivo,
    });
  } catch (error) {
    console.error(
      "Erro interno no upload do favicon:",
      error,
    );

    return NextResponse.json(
      {
        erro:
          "Ocorreu um erro interno ao enviar o favicon.",
      },
      {
        status: 500,
      },
    );
  }
}