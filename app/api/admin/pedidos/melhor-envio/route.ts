import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  criarEnvioMelhorEnvio,
} from "@/lib/melhorEnvioEnvio";

type Body = {
  pedidoId?: number | string;
};

export async function POST(
  request: NextRequest,
) {
  try {
    const body =
      (await request.json()) as Body;

    const pedidoId =
      Number(
        body.pedidoId,
      );

    if (
      !Number.isInteger(
        pedidoId,
      ) ||
      pedidoId <= 0
    ) {
      return NextResponse.json(
        {
          erro:
            "Informe um pedido válido.",
        },
        {
          status: 400,
        },
      );
    }

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
        status: 500,
      },
    );
  }
}