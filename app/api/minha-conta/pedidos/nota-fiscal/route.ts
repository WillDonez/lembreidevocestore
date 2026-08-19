import {
  NextRequest,
  NextResponse,
} from "next/server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

const BUCKET =
  "notas-fiscais";

const EXPIRACAO_URL_SEGUNDOS =
  5 * 60;

type TipoArquivoFiscal =
  | "pdf"
  | "xml";

type PedidoFiscal = {
  id: number;
  auth_user_id?: string | null;
  email_cliente?: string | null;
  nota_fiscal_chave?: string | null;
  nota_fiscal_pdf_path?: string | null;
  nota_fiscal_xml_path?: string | null;
};

function normalizarEmail(
  email?: string | null,
) {
  return String(
    email || "",
  )
    .trim()
    .toLowerCase();
}

function validarPedidoId(
  valor?: string | null,
) {
  const pedidoId =
    Number(
      valor,
    );

  if (
    !Number.isInteger(
      pedidoId,
    ) ||
    pedidoId <= 0
  ) {
    throw new Error(
      "Informe um pedido válido.",
    );
  }

  return pedidoId;
}

function validarTipoArquivo(
  valor?: string | null,
): TipoArquivoFiscal {
  const tipo =
    String(
      valor || "",
    )
      .trim()
      .toLowerCase();

  if (
    tipo !== "pdf" &&
    tipo !== "xml"
  ) {
    throw new Error(
      "Informe um tipo de arquivo válido.",
    );
  }

  return tipo;
}

async function obterUsuarioAutenticado(
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
      erro:
        NextResponse.json(
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
    data: {
      user,
    },
    error,
  } =
    await supabaseAdmin.auth.getUser(
      accessToken,
    );

  if (
    error ||
    !user
  ) {
    return {
      erro:
        NextResponse.json(
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

  return {
    user,
  };
}

function usuarioPodeAcessarPedido(
  pedido: PedidoFiscal,
  userId: string,
  userEmail?: string | null,
) {
  if (
    pedido.auth_user_id
  ) {
    return (
      pedido.auth_user_id ===
      userId
    );
  }

  const emailPedido =
    normalizarEmail(
      pedido.email_cliente,
    );

  const emailUsuario =
    normalizarEmail(
      userEmail,
    );

  return Boolean(
    emailPedido &&
    emailUsuario &&
    emailPedido ===
      emailUsuario,
  );
}

export async function GET(
  request: NextRequest,
) {
  try {
    const autenticacao =
      await obterUsuarioAutenticado(
        request,
      );

    if (
      "erro" in autenticacao
    ) {
      return autenticacao.erro;
    }

    const pedidoId =
      validarPedidoId(
        request.nextUrl.searchParams.get(
          "pedidoId",
        ),
      );

    const tipo =
      validarTipoArquivo(
        request.nextUrl.searchParams.get(
          "tipo",
        ),
      );

    const {
      data: pedidoData,
      error: pedidoErro,
    } =
      await supabaseAdmin
        .from("pedidos")
        .select(`
          id,
          auth_user_id,
          email_cliente,
          nota_fiscal_chave,
          nota_fiscal_pdf_path,
          nota_fiscal_xml_path
        `)
        .eq(
          "id",
          pedidoId,
        )
        .maybeSingle();

    if (
      pedidoErro
    ) {
      console.error(
        "Erro ao consultar pedido para download da NF-e:",
        pedidoErro,
      );

      return NextResponse.json(
        {
          erro:
            "Não foi possível consultar o pedido.",
        },
        {
          status: 500,
        },
      );
    }

    if (
      !pedidoData
    ) {
      return NextResponse.json(
        {
          erro:
            "Pedido não encontrado.",
        },
        {
          status: 404,
        },
      );
    }

    const pedido =
      pedidoData as PedidoFiscal;

    const podeAcessar =
      usuarioPodeAcessarPedido(
        pedido,
        autenticacao.user.id,
        autenticacao.user.email,
      );

    if (
      !podeAcessar
    ) {
      return NextResponse.json(
        {
          erro:
            "Você não possui acesso aos arquivos fiscais deste pedido.",
        },
        {
          status: 403,
        },
      );
    }

    const caminho =
      tipo === "pdf"
        ? pedido.nota_fiscal_pdf_path
        : pedido.nota_fiscal_xml_path;

    if (
      !caminho
    ) {
      return NextResponse.json(
        {
          erro:
            tipo === "pdf"
              ? "O DANFE deste pedido ainda não está disponível."
              : "O XML desta NF-e ainda não está disponível.",
        },
        {
          status: 404,
        },
      );
    }

    const {
      data: signedUrlData,
      error: signedUrlErro,
    } =
      await supabaseAdmin.storage
        .from(BUCKET)
        .createSignedUrl(
          caminho,
          EXPIRACAO_URL_SEGUNDOS,
          {
            download:
              true,
          },
        );

    if (
      signedUrlErro ||
      !signedUrlData?.signedUrl
    ) {
      console.error(
        "Erro ao gerar URL temporária da NF-e:",
        signedUrlErro,
      );

      return NextResponse.json(
        {
          erro:
            "Não foi possível liberar o download do arquivo fiscal.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      sucesso: true,
      pedidoId,
      tipo,
      url:
        signedUrlData.signedUrl,
      expiraEmSegundos:
        EXPIRACAO_URL_SEGUNDOS,
    });
  } catch (error) {
    console.error(
      "Erro interno no download da NF-e:",
      error,
    );

    const mensagem =
      error instanceof Error
        ? error.message
        : "Ocorreu um erro interno ao preparar o download da NF-e.";

    return NextResponse.json(
      {
        erro:
          mensagem,
      },
      {
        status:
          mensagem ===
            "Informe um pedido válido." ||
          mensagem ===
            "Informe um tipo de arquivo válido."
            ? 400
            : 500,
      },
    );
  }
}