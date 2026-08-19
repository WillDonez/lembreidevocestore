import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  criarEnvioMelhorEnvio,
  sincronizarEnvioMelhorEnvio,
} from "@/lib/melhorEnvioEnvio";

type Body = {
  pedidoId?: number | string;
};

function validarPedidoId(
  valor?: number | string | null,
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

export async function POST(
  request: NextRequest,
) {
  try {
    const body =
      (await request.json()) as Body;

    const pedidoId = validarPedidoId(
      body.pedidoId,
    );

    const resultado =
      await criarEnvioMelhorEnvio(
        pedidoId,
      );

    return NextResponse.json(
      resultado,
    );
  } catch (error) {
    console.error(
      "Erro ao criar envio administrativo no Melhor Envio:",
      error,
    );

    const mensagem =
      error instanceof Error
        ? error.message
        : "Não foi possível criar o envio.";

    return NextResponse.json(
      {
        sucesso: false,
        erro: mensagem,
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

export async function GET(
  request: NextRequest,
) {
  try {
    const pedidoId = validarPedidoId(
      request.nextUrl.searchParams.get(
        "pedidoId",
      ),
    );

    const resultado =
      await sincronizarEnvioMelhorEnvio(
        pedidoId,
      );

    return NextResponse.json(
      resultado,
    );
  } catch (error) {
    console.error(
      "Erro ao sincronizar envio administrativo do Melhor Envio:",
      error,
    );

    const mensagem =
      error instanceof Error
        ? error.message
        : "Não foi possível atualizar o envio.";

    return NextResponse.json(
      {
        sucesso: false,
        erro: mensagem,
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