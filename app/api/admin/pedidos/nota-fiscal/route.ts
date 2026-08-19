import {
  NextRequest,
  NextResponse,
} from "next/server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

const BUCKET = "notas-fiscais";

const TAMANHO_MAXIMO_PDF =
  10 * 1024 * 1024;

const TAMANHO_MAXIMO_XML =
  5 * 1024 * 1024;

type PedidoFiscalBanco = {
  id: number;
  nota_fiscal_pdf_path?: string | null;
  nota_fiscal_xml_path?: string | null;
};

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

function limparSomenteNumeros(
  valor?: string | null,
) {
  return String(valor || "")
    .replace(/\D/g, "");
}

function validarPedidoId(
  valor: FormDataEntryValue | null,
) {
  const pedidoId =
    Number(
      String(valor || ""),
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

function extensaoDoArquivo(
  arquivo: File,
) {
  const nome =
    arquivo.name
      .trim()
      .toLowerCase();

  if (!nome.includes(".")) {
    return "";
  }

  return (
    nome
      .split(".")
      .pop() ||
    ""
  );
}

function validarPdf(
  arquivo: File,
) {
  const extensao =
    extensaoDoArquivo(
      arquivo,
    );

  const tipoValido =
    arquivo.type ===
      "application/pdf" ||
    extensao === "pdf";

  if (!tipoValido) {
    throw new Error(
      "O DANFE deve ser enviado em formato PDF.",
    );
  }

  if (
    arquivo.size >
    TAMANHO_MAXIMO_PDF
  ) {
    throw new Error(
      "O DANFE deve ter no máximo 10 MB.",
    );
  }
}

function validarXml(
  arquivo: File,
) {
  const extensao =
    extensaoDoArquivo(
      arquivo,
    );

  const tiposPermitidos = [
    "application/xml",
    "text/xml",
    "application/octet-stream",
    "",
  ];

  const tipoValido =
    extensao === "xml" &&
    tiposPermitidos.includes(
      arquivo.type,
    );

  if (!tipoValido) {
    throw new Error(
      "O arquivo da NF-e deve ser enviado em formato XML.",
    );
  }

  if (
    arquivo.size >
    TAMANHO_MAXIMO_XML
  ) {
    throw new Error(
      "O XML da NF-e deve ter no máximo 5 MB.",
    );
  }
}

async function enviarArquivo(
  caminho: string,
  arquivo: File,
) {
  const buffer =
    Buffer.from(
      await arquivo.arrayBuffer(),
    );

  const {
    error,
  } =
    await supabaseAdmin.storage
      .from(BUCKET)
      .upload(
        caminho,
        buffer,
        {
          contentType:
            arquivo.type ||
            undefined,
          upsert: false,
          cacheControl:
            "3600",
        },
      );

  if (error) {
    console.error(
      `Erro ao enviar arquivo fiscal ${caminho}:`,
      error,
    );

    throw new Error(
      "Não foi possível enviar um dos arquivos da NF-e.",
    );
  }
}

async function removerArquivos(
  caminhos: string[],
) {
  const caminhosValidos =
    caminhos.filter(
      Boolean,
    );

  if (
    caminhosValidos.length ===
    0
  ) {
    return;
  }

  const {
    error,
  } =
    await supabaseAdmin.storage
      .from(BUCKET)
      .remove(
        caminhosValidos,
      );

  if (error) {
    console.warn(
      "Não foi possível remover arquivos fiscais antigos:",
      error,
    );
  }
}

export async function POST(
  request: NextRequest,
) {
  const novosArquivos:
    string[] = [];

  try {
    const autenticacao =
      await validarAdmin(
        request,
      );

    if (
      "erro" in autenticacao
    ) {
      return autenticacao.erro;
    }

    const formData =
      await request.formData();

    const pedidoId =
      validarPedidoId(
        formData.get(
          "pedidoId",
        ),
      );

    const chaveNFe =
      limparSomenteNumeros(
        String(
          formData.get(
            "chaveNFe",
          ) || "",
        ),
      );

    if (
      chaveNFe.length !==
      44
    ) {
      return NextResponse.json(
        {
          erro:
            "A chave da NF-e deve possuir exatamente 44 números.",
        },
        {
          status: 400,
        },
      );
    }

    const arquivoPdf =
      formData.get(
        "pdf",
      );

    const arquivoXml =
      formData.get(
        "xml",
      );

    if (
      arquivoPdf !== null &&
      !(arquivoPdf instanceof File)
    ) {
      return NextResponse.json(
        {
          erro:
            "O arquivo PDF enviado é inválido.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      arquivoXml !== null &&
      !(arquivoXml instanceof File)
    ) {
      return NextResponse.json(
        {
          erro:
            "O arquivo XML enviado é inválido.",
        },
        {
          status: 400,
        },
      );
    }

    const pdf =
      arquivoPdf instanceof File &&
      arquivoPdf.size > 0
        ? arquivoPdf
        : null;

    const xml =
      arquivoXml instanceof File &&
      arquivoXml.size > 0
        ? arquivoXml
        : null;

    if (pdf) {
      validarPdf(pdf);
    }

    if (xml) {
      validarXml(xml);
    }

    const {
      data: pedidoData,
      error: pedidoErro,
    } = await supabaseAdmin
      .from("pedidos")
      .select(`
        id,
        nota_fiscal_pdf_path,
        nota_fiscal_xml_path
      `)
      .eq(
        "id",
        pedidoId,
      )
      .maybeSingle();

    if (
      pedidoErro ||
      !pedidoData
    ) {
      console.error(
        "Erro ao consultar pedido para salvar NF-e:",
        pedidoErro,
      );

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
      pedidoData as PedidoFiscalBanco;

    const agora =
      Date.now();

    let novoPdfPath:
      string | null =
      pedido.nota_fiscal_pdf_path ||
      null;

    let novoXmlPath:
      string | null =
      pedido.nota_fiscal_xml_path ||
      null;

    if (pdf) {
      novoPdfPath =
        `pedido-${pedidoId}/danfe-${agora}.pdf`;

      await enviarArquivo(
        novoPdfPath,
        pdf,
      );

      novosArquivos.push(
        novoPdfPath,
      );
    }

    if (xml) {
      novoXmlPath =
        `pedido-${pedidoId}/nfe-${agora}.xml`;

      await enviarArquivo(
        novoXmlPath,
        xml,
      );

      novosArquivos.push(
        novoXmlPath,
      );
    }

    const {
      error: atualizacaoErro,
    } = await supabaseAdmin
      .from("pedidos")
      .update({
        nota_fiscal_chave:
          chaveNFe,
        nota_fiscal_status:
          "emitida",
        nota_fiscal_pdf_path:
          novoPdfPath,
        nota_fiscal_xml_path:
          novoXmlPath,
      })
      .eq(
        "id",
        pedidoId,
      );

    if (
      atualizacaoErro
    ) {
      console.error(
        "Erro ao atualizar NF-e no pedido:",
        atualizacaoErro,
      );

      await removerArquivos(
        novosArquivos,
      );

      return NextResponse.json(
        {
          erro:
            "Os arquivos foram recebidos, mas não foi possível salvar os dados da NF-e no pedido.",
        },
        {
          status: 500,
        },
      );
    }

    const arquivosAntigos:
      string[] = [];

    if (
      pdf &&
      pedido.nota_fiscal_pdf_path &&
      pedido.nota_fiscal_pdf_path !==
        novoPdfPath
    ) {
      arquivosAntigos.push(
        pedido.nota_fiscal_pdf_path,
      );
    }

    if (
      xml &&
      pedido.nota_fiscal_xml_path &&
      pedido.nota_fiscal_xml_path !==
        novoXmlPath
    ) {
      arquivosAntigos.push(
        pedido.nota_fiscal_xml_path,
      );
    }

    await removerArquivos(
      arquivosAntigos,
    );

    return NextResponse.json({
      sucesso: true,
      pedidoId,
      notaFiscalChave:
        chaveNFe,
      notaFiscalStatus:
        "emitida",
      notaFiscalPdfPath:
        novoPdfPath,
      notaFiscalXmlPath:
        novoXmlPath,
      mensagem:
        pdf || xml
          ? "NF-e e arquivos fiscais salvos com sucesso."
          : "NF-e registrada com sucesso.",
    });
  } catch (error) {
    console.error(
      "Erro interno ao salvar NF-e:",
      error,
    );

    if (
      novosArquivos.length >
      0
    ) {
      await removerArquivos(
        novosArquivos,
      );
    }

    const mensagem =
      error instanceof Error
        ? error.message
        : "Ocorreu um erro interno ao salvar a NF-e.";

    return NextResponse.json(
      {
        erro:
          mensagem,
      },
      {
        status:
          mensagem ===
            "Informe um pedido válido." ||
          mensagem.includes(
            "deve",
          )
            ? 400
            : 500,
      },
    );
  }
}