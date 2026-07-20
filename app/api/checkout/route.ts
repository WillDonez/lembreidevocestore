import { enviarWhatsapp } from "@/lib/whatsapp";
import {
  MercadoPagoConfig,
  Preference,
} from "mercadopago";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { salvarOuAtualizarCliente } from "@/lib/clientes";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type ItemRecebido = {
  id?: number | string;
  quantidade?: number;
};

type FreteRecebido = {
  servicoId?: number | string;
  cepDestino?: string;
};

function limparCep(cep: string) {
  return cep.replace(/\D/g, "");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const itensRecebidos =
      (body.produtos || []) as ItemRecebido[];

    if (itensRecebidos.length === 0) {
      return NextResponse.json(
        {
          error: "O carrinho está vazio.",
        },
        {
          status: 400,
        }
      );
    }

    const itensNormalizados = itensRecebidos
      .map((item) => ({
        id: Number(item.id),
        quantidade: Number(item.quantidade || 1),
      }))
      .filter(
        (item) =>
          Number.isInteger(item.id) &&
          item.id > 0 &&
          Number.isInteger(item.quantidade) &&
          item.quantidade > 0
      );

    if (
      itensNormalizados.length !==
      itensRecebidos.length
    ) {
      return NextResponse.json(
        {
          error:
            "Um ou mais produtos enviados são inválidos.",
        },
        {
          status: 400,
        }
      );
    }

    const idsProdutos = itensNormalizados.map(
      (item) => item.id
    );

    const { data: produtosBanco, error: erroProdutos } =
      await supabase
        .from("produtos")
        .select(
          `
            id,
            nome,
            preco,
            imagem,
            descricao,
            tipo_produto,
            arquivo_digital,
            formato_arquivo
          `
        )
        .in("id", idsProdutos);

    if (erroProdutos) {
      console.error(
        "Erro ao consultar produtos:",
        erroProdutos
      );

      return NextResponse.json(
        {
          error:
            "Não foi possível consultar os produtos.",
        },
        {
          status: 500,
        }
      );
    }

    if (
      !produtosBanco ||
      produtosBanco.length !==
        new Set(idsProdutos).size
    ) {
      return NextResponse.json(
        {
          error:
            "Um ou mais produtos não foram encontrados.",
        },
        {
          status: 400,
        }
      );
    }

    const produtosPedido = produtosBanco.map(
      (produto: any) => {
        const item = itensNormalizados.find(
          (item) => item.id === produto.id
        );

        return {
          id: produto.id,
          nome: produto.nome,
          preco: Number(produto.preco),
          quantidade: item?.quantidade || 1,
          imagem: produto.imagem || "",
          descricao: produto.descricao || "",
          tipo_produto:
            produto.tipo_produto || "fisico",
          arquivo_digital:
            produto.arquivo_digital || "",
          formato_arquivo:
            produto.formato_arquivo || "",
        };
      }
    );

    const possuiProdutoFisico =
      produtosPedido.some(
        (produto: any) =>
          produto.tipo_produto === "fisico"
      );

    let freteValidado: {
      id: number;
      nome: string;
      transportadora: string;
      preco: number;
      prazo: number;
      cepDestino: string;
    } | null = null;

    if (possuiProdutoFisico) {
      const freteRecebido =
        body.frete as FreteRecebido | null;

      const servicoId = Number(
        freteRecebido?.servicoId
      );

      const cepDestino = limparCep(
        freteRecebido?.cepDestino || body.cep || ""
      );

      if (
        !Number.isFinite(servicoId) ||
        cepDestino.length !== 8
      ) {
        return NextResponse.json(
          {
            error:
              "Selecione uma opção de frete válida.",
          },
          {
            status: 400,
          }
        );
      }

      /*
        Recalcula o frete no servidor.
        O preço salvo no navegador não é utilizado.
      */
      const urlCalculo = new URL(
        "/api/frete/calcular",
        req.url
      );

      const respostaFrete = await fetch(
        urlCalculo,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cepDestino,
            itens: itensNormalizados.map((item) => ({
              produtoId: item.id,
              quantidade: item.quantidade,
            })),
          }),
          cache: "no-store",
        }
      );

      const resultadoFrete =
        await respostaFrete.json();

      if (!respostaFrete.ok) {
        console.error(
          "Erro ao validar frete:",
          resultadoFrete
        );

        return NextResponse.json(
          {
            error:
              resultadoFrete.erro ||
              "Não foi possível validar o frete.",
          },
          {
            status: respostaFrete.status,
          }
        );
      }

      const opcaoEncontrada =
        resultadoFrete.opcoes?.find(
          (opcao: any) =>
            Number(opcao.id) === servicoId
        );

      if (!opcaoEncontrada) {
        return NextResponse.json(
          {
            error:
              "A opção de frete selecionada não está mais disponível.",
          },
          {
            status: 400,
          }
        );
      }

      freteValidado = {
        id: Number(opcaoEncontrada.id),
        nome: opcaoEncontrada.nome,
        transportadora:
          opcaoEncontrada.transportadora,
        preco: Number(opcaoEncontrada.preco),
        prazo: Number(opcaoEncontrada.prazo),
        cepDestino,
      };
    }

    const subtotal = produtosPedido.reduce(
      (acc: number, produto: any) =>
        acc +
        Number(produto.preco) *
          Number(produto.quantidade),
      0
    );

    const freteValor =
      freteValidado?.preco || 0;

    const total = subtotal + freteValor;

    const nomeCliente = body.nomeCliente;
    const whatsappCliente = body.whatsappCliente;
    const emailCliente = body.emailCliente;
    const cpfCnpj = body.cpfCnpj;
    const cep = body.cep;
    const endereco = body.endereco;
    const numero = body.numero;
    const complemento = body.complemento;
    const bairro = body.bairro;
    const cidade = body.cidade;
    const estado = body.estado;

    if (
      !nomeCliente ||
      !whatsappCliente ||
      !emailCliente ||
      !cpfCnpj
    ) {
      return NextResponse.json(
        {
          error:
            "Os dados obrigatórios do cliente estão incompletos.",
        },
        {
          status: 400,
        }
      );
    }

    await salvarOuAtualizarCliente({
      nome: nomeCliente,
      email: emailCliente,
      whatsapp: whatsappCliente,
      cpf_cnpj: cpfCnpj,
      cep,
      endereco,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
    });

    const { data: pedidoCriado, error: erroPedido } =
      await supabase
        .from("pedidos")
        .insert([
          {
            cliente: nomeCliente,
            nome_cliente: nomeCliente,
            whatsapp_cliente:
              whatsappCliente,
            email_cliente: emailCliente,
            cpf_cnpj: cpfCnpj,
            cep,
            endereco,
            numero,
            complemento,
            bairro,
            cidade,
            estado,

            dados_fiscais_completos: Boolean(
              nomeCliente &&
                whatsappCliente &&
                emailCliente &&
                cpfCnpj &&
                cep &&
                endereco &&
                numero &&
                bairro &&
                cidade &&
                estado
            ),

            produtos: produtosPedido,

            subtotal,
            frete_valor: freteValor,
            frete_servico_id: freteValidado
              ? String(freteValidado.id)
              : null,
            frete_servico:
              freteValidado?.nome || null,
            frete_transportadora:
              freteValidado?.transportadora || null,
            frete_prazo:
              freteValidado?.prazo || null,
            frete_cep_destino:
              freteValidado?.cepDestino || null,

            total,
            status: "pendente",
          },
        ])
        .select()
        .single();

    if (erroPedido || !pedidoCriado) {
      console.error(
        "Erro ao criar pedido:",
        erroPedido
      );

      return NextResponse.json(
        {
          error: "Erro ao criar pedido.",
        },
        {
          status: 500,
        }
      );
    }

    const nomesProdutos = produtosPedido
      .map(
        (produto: any) =>
          `• ${produto.nome} (${produto.quantidade}x) - ${formatarValor(
            produto.preco * produto.quantidade
          )}`
      )
      .join("\n");

    const informacaoFrete = freteValidado
      ? `

🚚 Frete:
${freteValidado.transportadora} — ${freteValidado.nome}
Prazo: até ${freteValidado.prazo} dia(s) útil(eis)
Valor: ${formatarValor(freteValidado.preco)}`
      : `

📄 Pedido somente com produtos digitais
Frete: Grátis`;

    await enviarWhatsapp(
      "3399958593",
      `🛍️ NOVO PEDIDO NA LOJA

👤 Cliente: ${nomeCliente}
📱 WhatsApp: ${whatsappCliente}

📦 Produtos:
${nomesProdutos}
${informacaoFrete}

💰 Subtotal: ${formatarValor(subtotal)}
💰 Total: ${formatarValor(total)}

✅ Pedido recebido com sucesso!`
    );

    const itemsMercadoPago = produtosPedido.map(
      (produto: any) => ({
        id: String(produto.id),
        title: produto.nome,
        quantity: Number(produto.quantidade),
        currency_id: "BRL",
        unit_price: Number(produto.preco),
      })
    );

    if (freteValidado) {
      itemsMercadoPago.push({
        id: `frete-${freteValidado.id}`,
        title: `Frete - ${freteValidado.transportadora} ${freteValidado.nome}`,
        quantity: 1,
        currency_id: "BRL",
        unit_price: Number(freteValidado.preco),
      });
    }

    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: itemsMercadoPago,

        external_reference: String(
          pedidoCriado.id
        ),

        payer: {
          name: nomeCliente,
          email: emailCliente,
        },

        back_urls: {
          success:
            "https://www.lembreidevocestore.com.br/sucesso",
          failure:
            "https://www.lembreidevocestore.com.br/erro",
          pending:
            "https://www.lembreidevocestore.com.br/pendente",
        },

        auto_return: "approved",
      },
    });

    return NextResponse.json({
      id: response.id,
      initPoint: response.init_point,
      pedidoId: pedidoCriado.id,
      subtotal,
      frete: freteValor,
      total,
    });
  } catch (error) {
    console.error(
      "Erro interno no checkout:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Ocorreu um erro interno ao iniciar o pagamento.",
      },
      {
        status: 500,
      }
    );
  }
}

function formatarValor(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(valor || 0));
}