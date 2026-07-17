import { NextRequest, NextResponse } from "next/server";
import {
  obterAccessTokenMelhorEnvio,
  obterConfiguracaoMelhorEnvio,
} from "@/lib/melhorEnvio";

type ProdutoFrete = {
  id?: string | number;
  width: number;
  height: number;
  length: number;
  weight: number;
  insurance_value: number;
  quantity: number;
};

type CalcularFreteBody = {
  cepDestino?: string;
  produtos?: ProdutoFrete[];
};

function limparCep(cep: string): string {
  return cep.replace(/\D/g, "");
}

function produtoValido(produto: ProdutoFrete): boolean {
  return (
    Number.isFinite(produto.width) &&
    produto.width > 0 &&
    Number.isFinite(produto.height) &&
    produto.height > 0 &&
    Number.isFinite(produto.length) &&
    produto.length > 0 &&
    Number.isFinite(produto.weight) &&
    produto.weight > 0 &&
    Number.isFinite(produto.insurance_value) &&
    produto.insurance_value >= 0 &&
    Number.isInteger(produto.quantity) &&
    produto.quantity > 0
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CalcularFreteBody;

    const cepOrigem = limparCep(
      process.env.MELHOR_ENVIO_CEP_ORIGEM || ""
    );

    const cepDestino = limparCep(body.cepDestino || "");
    const produtos = body.produtos || [];

    if (cepOrigem.length !== 8) {
      return NextResponse.json(
        {
          erro: "O CEP de origem não está configurado corretamente.",
        },
        { status: 500 }
      );
    }

    if (cepDestino.length !== 8) {
      return NextResponse.json(
        {
          erro: "Informe um CEP de destino válido com 8 números.",
        },
        { status: 400 }
      );
    }

    if (produtos.length === 0 || !produtos.every(produtoValido)) {
      return NextResponse.json(
        {
          erro: "Os dados dos produtos para o cálculo de frete são inválidos.",
        },
        { status: 400 }
      );
    }

    const accessToken = await obterAccessTokenMelhorEnvio();

    const { baseUrl, userAgent } =
      obterConfiguracaoMelhorEnvio();

    const resposta = await fetch(
      `${baseUrl}/api/v2/me/shipment/calculate`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": userAgent,
        },
        body: JSON.stringify({
          from: {
            postal_code: cepOrigem,
          },
          to: {
            postal_code: cepDestino,
          },
          products: produtos.map((produto, indice) => ({
            id: String(produto.id ?? indice + 1),
            width: Number(produto.width),
            height: Number(produto.height),
            length: Number(produto.length),
            weight: Number(produto.weight),
            insurance_value: Number(produto.insurance_value),
            quantity: Number(produto.quantity),
          })),
          options: {
            receipt: false,
            own_hand: false,
          },
        }),
        cache: "no-store",
      }
    );

    const dados = await resposta.json();

    if (!resposta.ok) {
      console.error(
        "Erro retornado pelo cálculo do Melhor Envio:",
        dados
      );

      return NextResponse.json(
        {
          erro: "Não foi possível calcular o frete.",
          detalhes: dados,
        },
        { status: resposta.status }
      );
    }

    const opcoes = Array.isArray(dados)
      ? dados
          .filter(
            (servico) =>
              !servico.error &&
              (servico.custom_price || servico.price)
          )
          .map((servico) => ({
            id: servico.id,
            nome: servico.name,
            transportadora:
              servico.company?.name || "Transportadora",
            preco: Number(
              servico.custom_price || servico.price
            ),
            prazo: Number(
              servico.custom_delivery_time ||
                servico.delivery_time
            ),
            moeda: servico.currency || "R$",
          }))
      : [];

    if (opcoes.length === 0) {
      return NextResponse.json(
        {
          erro: "Nenhuma opção de frete foi encontrada para esse CEP.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      sucesso: true,
      cepDestino,
      opcoes,
    });
  } catch (error) {
    console.error("Erro interno ao calcular frete:", error);

    return NextResponse.json(
      {
        erro: "Ocorreu um erro interno ao calcular o frete.",
      },
      { status: 500 }
    );
  }
}