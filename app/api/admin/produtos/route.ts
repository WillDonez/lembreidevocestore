import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type DadosLogistica = {
  peso?: number;
  largura?: number;
  altura?: number;
  comprimento?: number;
  valor_declarado?: number;
  frete_ativo?: boolean;
  estoque_fisico?: number;
  embalagem?: string;
};

type DadosProduto = {
  id?: number;
  nome?: string;
  preco?: number;
  imagem?: string;
  descricao?: string;
  categoria?: string;
  tipo_produto?: string;
  arquivo_digital?: string;
  formato_arquivo?: string;
  destaque?: boolean;
  logistica?: DadosLogistica;
};

async function obterAdministrador(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return {
      usuario: null,
      erro: NextResponse.json(
        { erro: "Usuário não autenticado." },
        { status: 401 }
      ),
    };
  }

  const accessToken = authorization.replace("Bearer ", "").trim();

  const {
    data: { user },
    error: usuarioErro,
  } = await supabaseAdmin.auth.getUser(accessToken);

  if (usuarioErro || !user) {
    return {
      usuario: null,
      erro: NextResponse.json(
        { erro: "Sessão inválida ou expirada." },
        { status: 401 }
      ),
    };
  }

  const { data: perfil, error: perfilErro } = await supabaseAdmin
    .from("clientes")
    .select("role")
    .eq("auth_user_id", user.id)
    .single();

  if (perfilErro || !perfil || perfil.role !== "admin") {
    return {
      usuario: null,
      erro: NextResponse.json(
        { erro: "Acesso permitido somente para administradores." },
        { status: 403 }
      ),
    };
  }

  return {
    usuario: user,
    erro: null,
  };
}

function montarLogistica(
  produtoId: number,
  tipoProduto: string,
  logistica?: DadosLogistica
) {
  const produtoFisico = tipoProduto === "fisico";

  return {
    produto_id: produtoId,

    peso: produtoFisico
      ? Number(logistica?.peso || 0)
      : 0,

    largura: produtoFisico
      ? Number(logistica?.largura || 0)
      : 0,

    altura: produtoFisico
      ? Number(logistica?.altura || 0)
      : 0,

    comprimento: produtoFisico
      ? Number(logistica?.comprimento || 0)
      : 0,

    valor_declarado: produtoFisico
      ? Number(logistica?.valor_declarado || 0)
      : 0,

    frete_ativo: produtoFisico
      ? Boolean(logistica?.frete_ativo)
      : false,

    estoque_fisico: produtoFisico
      ? Number(logistica?.estoque_fisico || 0)
      : 0,

    embalagem: produtoFisico
      ? logistica?.embalagem?.trim() || null
      : null,

    updated_at: new Date().toISOString(),
  };
}

/*
  LISTAR PRODUTOS
*/
export async function GET(request: NextRequest) {
  try {
    const autenticacao = await obterAdministrador(request);

    if (autenticacao.erro) {
      return autenticacao.erro;
    }

    const { data, error } = await supabaseAdmin
      .from("produtos")
      .select(`
        *,
        produto_logistica (
          peso,
          largura,
          altura,
          comprimento,
          valor_declarado,
          frete_ativo,
          estoque_fisico,
          embalagem
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao listar produtos:", error);

      return NextResponse.json(
        { erro: "Não foi possível carregar os produtos." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      produtos: data || [],
    });
  } catch (error) {
    console.error("Erro interno ao listar produtos:", error);

    return NextResponse.json(
      { erro: "Ocorreu um erro interno ao carregar os produtos." },
      { status: 500 }
    );
  }
}

/*
  CADASTRAR PRODUTO
*/
export async function POST(request: NextRequest) {
  try {
    const autenticacao = await obterAdministrador(request);

    if (autenticacao.erro) {
      return autenticacao.erro;
    }

    const body = (await request.json()) as DadosProduto;

    if (!body.nome?.trim()) {
      return NextResponse.json(
        { erro: "Informe o nome do produto." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(Number(body.preco))) {
      return NextResponse.json(
        { erro: "Informe um preço válido." },
        { status: 400 }
      );
    }

    const tipoProduto = body.tipo_produto || "fisico";

    const { data: produto, error: produtoErro } = await supabaseAdmin
      .from("produtos")
      .insert({
        nome: body.nome.trim(),
        preco: Number(body.preco),
        imagem: body.imagem || "",
        descricao: body.descricao || "",
        categoria: body.categoria || "Outros",
        tipo_produto: tipoProduto,
        arquivo_digital: body.arquivo_digital || "",
        formato_arquivo: body.formato_arquivo || null,
        destaque: Boolean(body.destaque),
      })
      .select("*")
      .single();

    if (produtoErro || !produto) {
      console.error("Erro ao cadastrar produto:", produtoErro);

      return NextResponse.json(
        { erro: "Não foi possível cadastrar o produto." },
        { status: 500 }
      );
    }

    const dadosLogistica = montarLogistica(
      produto.id,
      tipoProduto,
      body.logistica
    );

    const { error: logisticaErro } = await supabaseAdmin
      .from("produto_logistica")
      .upsert(dadosLogistica, {
        onConflict: "produto_id",
      });

    if (logisticaErro) {
      console.error(
        "Produto criado, mas ocorreu erro na logística:",
        logisticaErro
      );

      await supabaseAdmin
        .from("produtos")
        .delete()
        .eq("id", produto.id);

      return NextResponse.json(
        {
          erro: "Não foi possível salvar a logística do produto.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        sucesso: true,
        mensagem: "Produto cadastrado com sucesso.",
        produto,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro interno ao cadastrar produto:", error);

    return NextResponse.json(
      { erro: "Ocorreu um erro interno ao cadastrar o produto." },
      { status: 500 }
    );
  }
}

/*
  EDITAR PRODUTO
*/
export async function PUT(request: NextRequest) {
  try {
    const autenticacao = await obterAdministrador(request);

    if (autenticacao.erro) {
      return autenticacao.erro;
    }

    const body = (await request.json()) as DadosProduto;
    const produtoId = Number(body.id);

    if (!Number.isInteger(produtoId) || produtoId <= 0) {
      return NextResponse.json(
        { erro: "Produto inválido." },
        { status: 400 }
      );
    }

    if (!body.nome?.trim()) {
      return NextResponse.json(
        { erro: "Informe o nome do produto." },
        { status: 400 }
      );
    }

    const tipoProduto = body.tipo_produto || "fisico";

    const { error: produtoErro } = await supabaseAdmin
      .from("produtos")
      .update({
        nome: body.nome.trim(),
        preco: Number(body.preco),
        imagem: body.imagem || "",
        descricao: body.descricao || "",
        categoria: body.categoria || "Outros",
        tipo_produto: tipoProduto,
        arquivo_digital: body.arquivo_digital || "",
        formato_arquivo: body.formato_arquivo || null,
        destaque: Boolean(body.destaque),
      })
      .eq("id", produtoId);

    if (produtoErro) {
      console.error("Erro ao editar produto:", produtoErro);

      return NextResponse.json(
        { erro: "Não foi possível editar o produto." },
        { status: 500 }
      );
    }

    const dadosLogistica = montarLogistica(
      produtoId,
      tipoProduto,
      body.logistica
    );

    const { error: logisticaErro } = await supabaseAdmin
      .from("produto_logistica")
      .upsert(dadosLogistica, {
        onConflict: "produto_id",
      });

    if (logisticaErro) {
      console.error("Erro ao atualizar logística:", logisticaErro);

      return NextResponse.json(
        {
          erro: "O produto foi editado, mas a logística não foi atualizada.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      sucesso: true,
      mensagem: "Produto atualizado com sucesso.",
    });
  } catch (error) {
    console.error("Erro interno ao editar produto:", error);

    return NextResponse.json(
      { erro: "Ocorreu um erro interno ao editar o produto." },
      { status: 500 }
    );
  }
}

/*
  EXCLUIR PRODUTO
*/
export async function DELETE(request: NextRequest) {
  try {
    const autenticacao = await obterAdministrador(request);

    if (autenticacao.erro) {
      return autenticacao.erro;
    }

    const produtoId = Number(
      request.nextUrl.searchParams.get("id")
    );

    if (!Number.isInteger(produtoId) || produtoId <= 0) {
      return NextResponse.json(
        { erro: "Produto inválido." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("produtos")
      .delete()
      .eq("id", produtoId);

    if (error) {
      console.error("Erro ao excluir produto:", error);

      return NextResponse.json(
        { erro: "Não foi possível excluir o produto." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      sucesso: true,
      mensagem: "Produto excluído com sucesso.",
    });
  } catch (error) {
    console.error("Erro interno ao excluir produto:", error);

    return NextResponse.json(
      { erro: "Ocorreu um erro interno ao excluir o produto." },
      { status: 500 }
    );
  }
}