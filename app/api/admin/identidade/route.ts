import {
  NextRequest,
  NextResponse,
} from "next/server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

async function validarAdmin(
  request: NextRequest,
) {
  const authorization =
    request.headers.get("authorization");

  if (
    !authorization?.startsWith("Bearer ")
  ) {
    return {
      erro: NextResponse.json(
        {
          erro: "Usuário não autenticado.",
        },
        {
          status: 401,
        },
      ),
    };
  }

  const accessToken = authorization
    .replace("Bearer ", "")
    .trim();

  const {
    data: { user },
    error: usuarioErro,
  } = await supabaseAdmin.auth.getUser(
    accessToken,
  );

  if (
    usuarioErro ||
    !user
  ) {
    return {
      erro: NextResponse.json(
        {
          erro: "Sessão inválida ou expirada.",
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

export async function GET(
  request: NextRequest,
) {
  try {
    const autenticacao =
      await validarAdmin(request);

    if ("erro" in autenticacao) {
      return autenticacao.erro;
    }

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("configuracoes_loja")
      .select(
        `
          id,
          nome_loja,
          logo_url,
          favicon_url,
          ativo,
          created_at,
          updated_at
        `,
      )
      .eq("ativo", true)
      .order("id", {
        ascending: true,
      })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(
        "Erro ao carregar identidade da loja:",
        error,
      );

      return NextResponse.json(
        {
          erro:
            "Não foi possível carregar a identidade da loja.",
        },
        {
          status: 500,
        },
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          erro:
            "Nenhuma configuração ativa da loja foi encontrada.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      identidade: data,
    });
  } catch (error) {
    console.error(
      "Erro interno ao carregar identidade da loja:",
      error,
    );

    return NextResponse.json(
      {
        erro: "Ocorreu um erro interno.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(
  request: NextRequest,
) {
  try {
    const autenticacao =
      await validarAdmin(request);

    if ("erro" in autenticacao) {
      return autenticacao.erro;
    }

    const body =
      await request.json();

    const id =
      Number(body.id);

    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      return NextResponse.json(
        {
          erro:
            "Configuração da loja inválida.",
        },
        {
          status: 400,
        },
      );
    }

    const nomeLoja =
      typeof body.nome_loja === "string"
        ? body.nome_loja.trim()
        : "";

    if (!nomeLoja) {
      return NextResponse.json(
        {
          erro:
            "Informe o nome da loja.",
        },
        {
          status: 400,
        },
      );
    }

    if (nomeLoja.length > 120) {
      return NextResponse.json(
        {
          erro:
            "O nome da loja deve ter no máximo 120 caracteres.",
        },
        {
          status: 400,
        },
      );
    }

    const logoUrl =
      typeof body.logo_url === "string"
        ? body.logo_url.trim() || null
        : null;

    const faviconUrl =
      typeof body.favicon_url === "string"
        ? body.favicon_url.trim() || null
        : null;

    const atualizacao = {
      nome_loja: nomeLoja,
      logo_url: logoUrl,
      favicon_url: faviconUrl,
      updated_at:
        new Date().toISOString(),
    };

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("configuracoes_loja")
      .update(atualizacao)
      .eq("id", id)
      .eq("ativo", true)
      .select("*")
      .maybeSingle();

    if (error) {
      console.error(
        "Erro ao salvar identidade da loja:",
        error,
      );

      return NextResponse.json(
        {
          erro:
            "Não foi possível salvar a identidade da loja.",
        },
        {
          status: 500,
        },
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          erro:
            "Configuração ativa da loja não encontrada.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      sucesso: true,
      identidade: data,
    });
  } catch (error) {
    console.error(
      "Erro interno ao salvar identidade da loja:",
      error,
    );

    return NextResponse.json(
      {
        erro:
          "Ocorreu um erro interno ao salvar a identidade da loja.",
      },
      {
        status: 500,
      },
    );
  }
}