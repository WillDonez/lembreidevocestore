import { supabaseAdmin } from "@/lib/supabaseAdmin";

import {
  obterAccessTokenMelhorEnvio,
  obterConfiguracaoMelhorEnvio,
} from "@/lib/melhorEnvio";

type ProdutoPedido = {
  id?: number | string;
  nome?: string;
  preco?: number | string;
  quantidade?: number;
  tipo_produto?: string;
};

type LogisticaProduto = {
  peso?: number | string;
  largura?: number | string;
  altura?: number | string;
  comprimento?: number | string;
  valor_declarado?: number | string;
  frete_ativo?: boolean;
};

type ProdutoBanco = {
  id: number;
  nome?: string;
  preco?: number | string;

  produto_logistica?:
    | LogisticaProduto
    | LogisticaProduto[]
    | null;
};

type PedidoBanco = {
  id: number;

  status?: string | null;

  produtos?: ProdutoPedido[] | null;

  nome_cliente?: string | null;
  email_cliente?: string | null;
  whatsapp_cliente?: string | null;
  cpf_cnpj?: string | null;

  cep?: string | null;
  endereco?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;

  frete_servico_id?: string | null;
  frete_valor?: number | string | null;

  nota_fiscal_chave?: string | null;
  nota_fiscal_status?: string | null;

  melhor_envio_order_id?: string | null;
  melhor_envio_status?: string | null;
};

type ResultadoCriacaoEnvio = {
  sucesso: boolean;
  pedidoId: number;
  melhorEnvioOrderId?: string;
  mensagem: string;
};

function limparSomenteNumeros(
  valor?: string | null,
) {
  return String(valor || "")
    .replace(/\D/g, "");
}

function normalizarTipoProduto(
  tipo?: string,
) {
  return String(tipo || "")
    .trim()
    .toLowerCase();
}

function obterLogistica(
  produto: ProdutoBanco,
): LogisticaProduto | null {
  if (
    Array.isArray(
      produto.produto_logistica,
    )
  ) {
    return (
      produto.produto_logistica[0] ||
      null
    );
  }

  return (
    produto.produto_logistica ||
    null
  );
}

function obterVariaveisRemetente() {
  const nome =
    process.env
      .MELHOR_ENVIO_REMETENTE_NOME;

  const documento =
    process.env
      .MELHOR_ENVIO_REMETENTE_DOCUMENTO;

  const telefone =
    process.env
      .MELHOR_ENVIO_REMETENTE_TELEFONE;

  const email =
    process.env
      .MELHOR_ENVIO_REMETENTE_EMAIL;

  const endereco =
    process.env
      .MELHOR_ENVIO_REMETENTE_ENDERECO;

  const numero =
    process.env
      .MELHOR_ENVIO_REMETENTE_NUMERO;

  const complemento =
    process.env
      .MELHOR_ENVIO_REMETENTE_COMPLEMENTO ||
    "";

  const bairro =
    process.env
      .MELHOR_ENVIO_REMETENTE_BAIRRO;

  const cidade =
    process.env
      .MELHOR_ENVIO_REMETENTE_CIDADE;

  const estado =
    process.env
      .MELHOR_ENVIO_REMETENTE_ESTADO;

  const cep =
    process.env
      .MELHOR_ENVIO_CEP_ORIGEM;

  const inscricaoEstadual =
    process.env
      .MELHOR_ENVIO_REMETENTE_INSCRICAO_ESTADUAL;

  if (
    !nome ||
    !documento ||
    !telefone ||
    !email ||
    !endereco ||
    !numero ||
    !bairro ||
    !cidade ||
    !estado ||
    !cep ||
    !inscricaoEstadual
  ) {
    throw new Error(
      "Os dados do remetente do Melhor Envio estão incompletos.",
    );
  }

  const cnpj =
    limparSomenteNumeros(
      documento,
    );

  if (cnpj.length !== 14) {
    throw new Error(
      "O CNPJ do remetente deve possuir 14 números.",
    );
  }

  const cepLimpo =
    limparSomenteNumeros(
      cep,
    );

  if (cepLimpo.length !== 8) {
    throw new Error(
      "O CEP do remetente está inválido.",
    );
  }

  return {
    nome,
    cnpj,
    telefone:
      limparSomenteNumeros(
        telefone,
      ),
    email,
    endereco,
    numero,
    complemento,
    bairro,
    cidade,
    estado:
      estado
        .trim()
        .toUpperCase(),
    cep: cepLimpo,
    inscricaoEstadual,
  };
}

function validarChaveNFe(
  chave?: string | null,
) {
  const chaveLimpa =
    limparSomenteNumeros(
      chave,
    );

  if (chaveLimpa.length !== 44) {
    throw new Error(
      "A chave da NF-e deve possuir 44 números.",
    );
  }

  return chaveLimpa;
}

export async function criarEnvioMelhorEnvio(
  pedidoId: number,
): Promise<ResultadoCriacaoEnvio> {
  /*
   * =========================================================
   * 1. CONSULTAR PEDIDO
   * =========================================================
   */

  const {
    data: pedidoData,
    error: erroPedido,
  } = await supabaseAdmin
    .from("pedidos")
    .select(`
      id,
      status,
      produtos,
      nome_cliente,
      email_cliente,
      whatsapp_cliente,
      cpf_cnpj,
      cep,
      endereco,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      frete_servico_id,
      frete_valor,
      nota_fiscal_chave,
      nota_fiscal_status,
      melhor_envio_order_id,
      melhor_envio_status
    `)
    .eq(
      "id",
      pedidoId,
    )
    .maybeSingle();

  if (
    erroPedido ||
    !pedidoData
  ) {
    console.error(
      "Erro ao consultar pedido para Melhor Envio:",
      erroPedido,
    );

    throw new Error(
      "Pedido não encontrado.",
    );
  }

  const pedido =
    pedidoData as PedidoBanco;

  /*
   * =========================================================
   * 2. EVITAR ENVIO DUPLICADO
   * =========================================================
   */

  if (
    pedido.melhor_envio_order_id
  ) {
    return {
      sucesso: true,
      pedidoId,
      melhorEnvioOrderId:
        pedido.melhor_envio_order_id,
      mensagem:
        "O pedido já possui um envio criado no Melhor Envio.",
    };
  }

  /*
   * =========================================================
   * 3. PAGAMENTO PRECISA ESTAR APROVADO
   * =========================================================
   */

  const status =
    String(
      pedido.status || "",
    )
      .trim()
      .toLowerCase();

  if (
    status !== "aprovado" &&
    status !== "pago"
  ) {
    throw new Error(
      "O pedido ainda não possui pagamento aprovado.",
    );
  }

  /*
   * =========================================================
   * 4. PEDIDO PRECISA TER PRODUTO FÍSICO
   * =========================================================
   */

  const produtosFisicos =
    (
      pedido.produtos || []
    ).filter(
      (produto) =>
        normalizarTipoProduto(
          produto.tipo_produto,
        ) === "fisico",
    );

  if (
    produtosFisicos.length === 0
  ) {
    throw new Error(
      "O pedido não possui produtos físicos.",
    );
  }

  /*
   * =========================================================
   * 5. VALIDAR NOTA FISCAL
   * =========================================================
   */

  const chaveNFe =
    validarChaveNFe(
      pedido.nota_fiscal_chave,
    );

  /*
   * =========================================================
   * 6. VALIDAR SERVIÇO DE FRETE
   * =========================================================
   */

  const servicoId =
    Number(
      pedido.frete_servico_id,
    );

  if (
    !Number.isInteger(
      servicoId,
    ) ||
    servicoId <= 0
  ) {
    throw new Error(
      "O pedido não possui um serviço de frete válido.",
    );
  }

  /*
   * =========================================================
   * 7. CONSULTAR LOGÍSTICA DOS PRODUTOS
   * =========================================================
   */

  const idsProdutos =
    produtosFisicos.map(
      (produto) =>
        Number(
          produto.id,
        ),
    );

  const {
    data: produtosBancoData,
    error: erroProdutos,
  } = await supabaseAdmin
    .from("produtos")
    .select(`
      id,
      nome,
      preco,
      produto_logistica (
        peso,
        largura,
        altura,
        comprimento,
        valor_declarado,
        frete_ativo
      )
    `)
    .in(
      "id",
      idsProdutos,
    );

  if (erroProdutos) {
    console.error(
      "Erro ao consultar logística para etiqueta:",
      erroProdutos,
    );

    throw new Error(
      "Não foi possível consultar a logística dos produtos.",
    );
  }

  const produtosBanco =
    (
      produtosBancoData || []
    ) as ProdutoBanco[];

  if (
    produtosBanco.length !==
    idsProdutos.length
  ) {
    throw new Error(
      "Um ou mais produtos físicos não foram encontrados.",
    );
  }

  /*
   * =========================================================
   * 8. MONTAR PRODUTOS E VOLUME
   * =========================================================
   */

  const produtosMelhorEnvio =
    [];

  let pesoTotal = 0;

  let maiorLargura = 0;
  let maiorAltura = 0;
  let maiorComprimento = 0;

  let valorSeguro = 0;

  for (
    const produtoPedido
    of produtosFisicos
  ) {
    const produtoId =
      Number(
        produtoPedido.id,
      );

    const produtoBanco =
      produtosBanco.find(
        (produto) =>
          produto.id ===
          produtoId,
      );

    if (!produtoBanco) {
      throw new Error(
        `Produto ${produtoId} não encontrado.`,
      );
    }

    const logistica =
      obterLogistica(
        produtoBanco,
      );

    if (!logistica) {
      throw new Error(
        `O produto "${produtoPedido.nome || produtoId}" não possui logística cadastrada.`,
      );
    }

    if (
      !logistica.frete_ativo
    ) {
      throw new Error(
        `O frete está desativado para o produto "${produtoPedido.nome || produtoId}".`,
      );
    }

    const quantidade =
      Number(
        produtoPedido.quantidade ||
        1,
      );

    const peso =
      Number(
        logistica.peso,
      );

    const largura =
      Number(
        logistica.largura,
      );

    const altura =
      Number(
        logistica.altura,
      );

    const comprimento =
      Number(
        logistica.comprimento,
      );

    const valorUnitario =
      Number(
        produtoPedido.preco ||
        produtoBanco.preco ||
        0,
      );

    if (
      !Number.isFinite(peso) ||
      peso <= 0 ||
      !Number.isFinite(largura) ||
      largura <= 0 ||
      !Number.isFinite(altura) ||
      altura <= 0 ||
      !Number.isFinite(comprimento) ||
      comprimento <= 0
    ) {
      throw new Error(
        `As medidas do produto "${produtoPedido.nome || produtoId}" estão incompletas.`,
      );
    }

    produtosMelhorEnvio.push({
      name:
        produtoPedido.nome ||
        produtoBanco.nome ||
        `Produto ${produtoId}`,
      quantity:
        quantidade,
      unitary_value:
        valorUnitario,
    });

    pesoTotal +=
      peso * quantidade;

    maiorLargura =
      Math.max(
        maiorLargura,
        largura,
      );

    maiorAltura =
      Math.max(
        maiorAltura,
        altura,
      );

    maiorComprimento =
      Math.max(
        maiorComprimento,
        comprimento,
      );

    valorSeguro +=
      valorUnitario *
      quantidade;
  }

  /*
   * Nesta primeira versão trabalhamos com
   * um único volume consolidado.
   *
   * Posteriormente podemos evoluir para
   * múltiplos volumes quando necessário.
   */

  const volumes = [
    {
      height:
        maiorAltura,
      width:
        maiorLargura,
      length:
        maiorComprimento,
      weight:
        pesoTotal,
    },
  ];

  /*
   * =========================================================
   * 9. VALIDAR DESTINATÁRIO
   * =========================================================
   */

  const cepDestino =
    limparSomenteNumeros(
      pedido.cep,
    );

  const documentoDestino =
    limparSomenteNumeros(
      pedido.cpf_cnpj,
    );

  const telefoneDestino =
    limparSomenteNumeros(
      pedido.whatsapp_cliente,
    );

  if (
    !pedido.nome_cliente ||
    !pedido.email_cliente ||
    !pedido.endereco ||
    !pedido.numero ||
    !pedido.bairro ||
    !pedido.cidade ||
    !pedido.estado ||
    cepDestino.length !== 8 ||
    !telefoneDestino
  ) {
    throw new Error(
      "Os dados do destinatário estão incompletos.",
    );
  }

  /*
   * =========================================================
   * 10. DADOS DO REMETENTE
   * =========================================================
   */

  const remetente =
    obterVariaveisRemetente();

  /*
   * =========================================================
   * 11. AUTENTICAÇÃO MELHOR ENVIO
   * =========================================================
   */

  const accessToken =
    await obterAccessTokenMelhorEnvio();

  const {
    baseUrl,
    userAgent,
  } =
    obterConfiguracaoMelhorEnvio();

  /*
   * =========================================================
   * 12. MONTAR PAYLOAD
   * =========================================================
   */

  const remetentePayload = {
    name:
      remetente.nome,
    email:
      remetente.email,
    phone:
      remetente.telefone,

    document:
      "",

    company_document:
      remetente.cnpj,

    state_register:
      remetente.inscricaoEstadual,

    address:
      remetente.endereco,
    complement:
      remetente.complemento,
    number:
      remetente.numero,
    district:
      remetente.bairro,
    city:
      remetente.cidade,
    postal_code:
      remetente.cep,
    state_abbr:
      remetente.estado,
  };

  /*
   * Destinatário pessoa física:
   * CPF -> document
   *
   * Destinatário pessoa jurídica:
   * CNPJ -> company_document
   */

  const destinatarioDocumento =
    documentoDestino.length === 14
      ? {
          company_document:
            documentoDestino,
        }
      : {
          document:
            documentoDestino,
        };

  const destinatarioPayload = {
    name:
      pedido.nome_cliente,
    email:
      pedido.email_cliente,
    phone:
      telefoneDestino,

    ...destinatarioDocumento,

    address:
      pedido.endereco,
    complement:
      pedido.complemento ||
      "",
    number:
      pedido.numero,
    district:
      pedido.bairro,
    city:
      pedido.cidade,
    postal_code:
      cepDestino,
    country_id:
      "BR",
    state_abbr:
      String(
        pedido.estado,
      )
        .trim()
        .toUpperCase(),
  };

  const payload = {
    service:
      servicoId,

    from:
      remetentePayload,

    to:
      destinatarioPayload,

    products:
      produtosMelhorEnvio,

    volumes,

    options: {
      platform:
        "Lembrei de Você Store",

      reminder:
        `Pedido #${pedido.id}`,

      insurance_value:
        valorSeguro,

      receipt:
        false,

      own_hand:
        false,

      reverse:
        false,

      invoice: {
        key:
          chaveNFe,
      },

      tags: [
        {
          tag:
            `Pedido ${pedido.id}`,
          url:
            null,
        },
      ],
    },
  };

  /*
   * =========================================================
   * 13. INSERIR ENVIO NO CARRINHO
   * =========================================================
   */

  const resposta =
    await fetch(
      `${baseUrl}/api/v2/me/cart`,
      {
        method: "POST",

        headers: {
          Accept:
            "application/json",

          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${accessToken}`,

          "User-Agent":
            userAgent,
        },

        body:
          JSON.stringify(
            payload,
          ),

        cache:
          "no-store",
      },
    );

  const respostaTexto =
    await resposta.text();

  let dados: any;

  try {
    dados =
      respostaTexto
        ? JSON.parse(
            respostaTexto,
          )
        : {};
  } catch {
    dados = {
      resposta:
        respostaTexto,
    };
  }

  if (
    !resposta.ok
  ) {
    console.error(
      "Erro ao inserir envio no carrinho do Melhor Envio:",
      {
        status:
          resposta.status,
        dados,
      },
    );

    throw new Error(
      "Não foi possível inserir o envio no carrinho do Melhor Envio.",
    );
  }

  const melhorEnvioOrderId =
    String(
      dados?.id ||
      "",
    );

  if (
    !melhorEnvioOrderId
  ) {
    console.error(
      "Melhor Envio não retornou o ID esperado:",
      dados,
    );

    throw new Error(
      "O Melhor Envio não retornou o identificador do envio.",
    );
  }

  /*
   * =========================================================
   * 14. SALVAR ID NO PEDIDO
   * =========================================================
   */

  const {
    error: erroAtualizacao,
  } = await supabaseAdmin
    .from("pedidos")
    .update({
      melhor_envio_order_id:
        melhorEnvioOrderId,

      melhor_envio_status:
        "carrinho",
    })
    .eq(
      "id",
      pedido.id,
    );

  if (erroAtualizacao) {
    console.error(
      "Envio criado, mas não foi possível salvar o ID no pedido:",
      erroAtualizacao,
    );

    throw new Error(
      "O envio foi criado no Melhor Envio, mas não pôde ser salvo no pedido.",
    );
  }

  console.log(
    `✅ Pedido ${pedido.id} inserido no carrinho do Melhor Envio.`,
    {
      melhorEnvioOrderId,
    },
  );

  return {
    sucesso:
      true,

    pedidoId:
      pedido.id,

    melhorEnvioOrderId,

    mensagem:
      "Envio inserido no carrinho do Melhor Envio com sucesso.",
  };
}