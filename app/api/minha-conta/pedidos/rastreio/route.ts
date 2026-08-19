import {
  NextRequest,
  NextResponse,
} from "next/server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

import {
  sincronizarEnvioMelhorEnvio,
} from "@/lib/melhorEnvioEnvio";

type PedidoRastreio = {
  id: number;
  auth_user_id?: string | null;
  email_cliente?: string | null;
  melhor_envio_order_id?: string | null;
  melhor_envio_status?: string | null;
  codigo_rastreio?: string | null;
  etiqueta_gerada?: boolean | null;
};

function normalizarEmail(
  email?: string | null,
) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

function validarPedidoId(
  valor?: string | null,
) {
  const pedidoId = Number(valor);

  if (
    !Number.isInteger(pedidoId) ||
    pedidoId <= 0
  ) {
    throw new Error(
      "Informe um pedido válido.",
    );
  }

  return pedidoId;
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

  return {
    user,
  };
}

function usuarioPodeAcessarPedido(
  pedido: PedidoRastreio,
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
    /*
     * =========================================================
     * 1. VALIDAR USUÁRIO
     * =========================================================
     */

    const autenticacao =
      await obterUsuarioAutenticado(
        request,
      );

    if (
      "erro" in autenticacao
    ) {
      return autenticacao.erro;
    }

    /*
     * =========================================================
     * 2. VALIDAR PEDIDO
     * =========================================================
     */

    const pedidoId =
      validarPedidoId(
        request.nextUrl.searchParams.get(
          "pedidoId",
        ),
      );

    /*
     * =========================================================
     * 3. CONSULTAR PEDIDO
     * =========================================================
     */

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
          melhor_envio_order_id,
          melhor_envio_status,
          codigo_rastreio,
          etiqueta_gerada
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
        "Erro ao consultar pedido para rastreamento:",
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
      pedidoData as PedidoRastreio;

    /*
     * =========================================================
     * 4. GARANTIR QUE O PEDIDO PERTENCE AO CLIENTE
     * =========================================================
     */

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
            "Você não possui acesso ao rastreamento deste pedido.",
        },
        {
          status: 403,
        },
      );
    }

    /*
     * =========================================================
     * 5. VERIFICAR SE EXISTE ENVIO
     * =========================================================
     */

    if (
      !pedido.melhor_envio_order_id
    ) {
      return NextResponse.json(
        {
          erro:
            "Este pedido ainda não possui envio no Melhor Envio.",
        },
        {
          status: 404,
        },
      );
    }

    /*
     * =========================================================
     * 6. SINCRONIZAR COM O MELHOR ENVIO
     * =========================================================
     */

    const resultado =
      await sincronizarEnvioMelhorEnvio(
        pedidoId,
      );

    /*
     * =========================================================
     * 7. DEVOLVER SOMENTE DADOS NECESSÁRIOS AO CLIENTE
     * =========================================================
     */

    return NextResponse.json({
      sucesso: true,

      pedidoId:
        resultado.pedidoId,

      status:
        resultado.status,

      codigoRastreio:
        resultado.codigoRastreio,

      etiquetaGerada:
        resultado.etiquetaGerada,

      mensagem:
        resultado.mensagem,
    });
  } catch (error) {
    console.error(
      "Erro interno ao atualizar rastreamento:",
      error,
    );

    const mensagem =
      error instanceof Error
        ? error.message
        : "Ocorreu um erro interno ao atualizar o rastreamento.";

    return NextResponse.json(
      {
        erro:
          mensagem,
      },
      {
        status:
          mensagem ===
          "Informe um pedido válido."
            ? 400
            : 500,
      },
    );
  }
}