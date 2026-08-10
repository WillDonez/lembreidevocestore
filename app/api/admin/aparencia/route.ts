import {
  NextRequest,
  NextResponse,
} from "next/server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

const CAMPOS_TEMA = [
  "primary_color",
  "primary_light_color",
  "secondary_color",
  "accent_color",
  "success_color",
  "warning_color",
  "danger_color",
  "background_color",
  "card_color",
  "text_color",
  "text_light_color",
  "border_color",
] as const;

function corHexValida(valor: unknown) {
  return (
    typeof valor === "string" &&
    /^#[0-9A-Fa-f]{6}$/.test(valor)
  );
}

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
      .from(
        "configuracoes_tema",
      )
      .select("*")
      .eq("ativo", true)
      .order("id", {
        ascending: true,
      })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(
        "Erro ao carregar tema:",
        error,
      );

      return NextResponse.json(
        {
          erro:
            "Não foi possível carregar o tema.",
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
            "Nenhum tema ativo foi encontrado.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      tema: data,
    });
  } catch (error) {
    console.error(
      "Erro interno ao carregar tema:",
      error,
    );

    return NextResponse.json(
      {
        erro:
          "Ocorreu um erro interno.",
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
            "Tema inválido.",
        },
        {
          status: 400,
        },
      );
    }

    for (
      const campo of CAMPOS_TEMA
    ) {
      if (
        !corHexValida(
          body[campo],
        )
      ) {
        return NextResponse.json(
          {
            erro:
              `Cor inválida em ${campo}.`,
          },
          {
            status: 400,
          },
        );
      }
    }

    const atualizacao = {
      nome:
        String(
          body.nome ||
            "Tema principal",
        ).trim(),

      primary_color:
        body.primary_color,

      primary_light_color:
        body.primary_light_color,

      secondary_color:
        body.secondary_color,

      accent_color:
        body.accent_color,

      success_color:
        body.success_color,

      warning_color:
        body.warning_color,

      danger_color:
        body.danger_color,

      background_color:
        body.background_color,

      card_color:
        body.card_color,

      text_color:
        body.text_color,

      text_light_color:
        body.text_light_color,

      border_color:
        body.border_color,

      updated_at:
        new Date().toISOString(),
    };

    const {
      data,
      error,
    } = await supabaseAdmin
      .from(
        "configuracoes_tema",
      )
      .update(atualizacao)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error(
        "Erro ao salvar tema:",
        error,
      );

      return NextResponse.json(
        {
          erro:
            "Não foi possível salvar o tema.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      sucesso: true,
      tema: data,
    });
  } catch (error) {
    console.error(
      "Erro interno ao salvar tema:",
      error,
    );

    return NextResponse.json(
      {
        erro:
          "Ocorreu um erro interno ao salvar o tema.",
      },
      {
        status: 500,
      },
    );
  }
}