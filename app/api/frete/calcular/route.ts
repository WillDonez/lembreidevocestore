import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  calcularFrete,
  type CalcularFreteBody,
} from "@/lib/calcularFrete";

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      (await request.json()) as CalcularFreteBody;

    const resultado =
      await calcularFrete(body);

    return NextResponse.json(
      resultado.dados,
      {
        status: resultado.status,
      }
    );
  } catch (error) {
    console.error(
      "Erro na rota de cálculo de frete:",
      error
    );

    return NextResponse.json(
      {
        erro:
          "Ocorreu um erro interno ao calcular o frete.",
      },
      {
        status: 500,
      }
    );
  }
}