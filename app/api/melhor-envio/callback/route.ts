import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get("code");
    const stateRecebido = request.nextUrl.searchParams.get("state");
    const stateSalvo = request.cookies.get(
      "melhor_envio_oauth_state"
    )?.value;

    if (!code) {
      return NextResponse.json(
        {
          erro: "O Melhor Envio não retornou o código de autorização.",
        },
        { status: 400 }
      );
    }

    if (!stateRecebido || !stateSalvo || stateRecebido !== stateSalvo) {
      return NextResponse.json(
        {
          erro: "Falha na validação de segurança do OAuth.",
        },
        { status: 400 }
      );
    }

    const clientId = process.env.MELHOR_ENVIO_CLIENT_ID;
    const clientSecret = process.env.MELHOR_ENVIO_CLIENT_SECRET;
    const redirectUri = process.env.MELHOR_ENVIO_REDIRECT_URI;
    const baseUrl = process.env.MELHOR_ENVIO_BASE_URL;
    const userAgent = process.env.MELHOR_ENVIO_USER_AGENT;

    if (
      !clientId ||
      !clientSecret ||
      !redirectUri ||
      !baseUrl ||
      !userAgent
    ) {
      return NextResponse.json(
        {
          erro: "As variáveis do Melhor Envio não estão completas.",
        },
        { status: 500 }
      );
    }

    const tokenResponse = await fetch(`${baseUrl}/oauth/token`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": userAgent,
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code,
      }),
      cache: "no-store",
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Erro ao gerar token do Melhor Envio:", tokenData);

      return NextResponse.json(
        {
          erro: "Não foi possível gerar o token do Melhor Envio.",
          detalhes: tokenData,
        },
        { status: tokenResponse.status }
      );
    }

    if (!tokenData.access_token || !tokenData.refresh_token) {
      return NextResponse.json(
        {
          erro: "O Melhor Envio não retornou os tokens esperados.",
        },
        { status: 500 }
      );
    }

    const expiresIn = Number(tokenData.expires_in);

    if (!Number.isFinite(expiresIn)) {
      return NextResponse.json(
        {
          erro: "O tempo de validade do token é inválido.",
        },
        { status: 500 }
      );
    }

    const expiresAt = new Date(
      Date.now() + expiresIn * 1000
    ).toISOString();

    const ambiente =
      process.env.MELHOR_ENVIO_SANDBOX === "true"
        ? "sandbox"
        : "producao";

    const { error: salvarErro } = await supabaseAdmin
      .from("melhor_envio_tokens")
      .upsert(
        {
          integracao: "principal",
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          token_type: tokenData.token_type || "Bearer",
          expires_in: expiresIn,
          expires_at: expiresAt,
          ambiente,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "integracao",
        }
      );

    if (salvarErro) {
      console.error(
        "Erro ao salvar tokens no Supabase:",
        salvarErro
      );

      return NextResponse.json(
        {
          erro: "O token foi gerado, mas não pôde ser salvo.",
        },
        { status: 500 }
      );
    }

    const response = NextResponse.redirect(
      new URL("/minha-conta?melhorEnvio=sucesso", request.url)
    );

    response.cookies.delete("melhor_envio_oauth_state");

    return response;
  } catch (error) {
    console.error("Erro no callback do Melhor Envio:", error);

    return NextResponse.json(
      {
        erro: "Ocorreu um erro interno no callback do Melhor Envio.",
      },
      { status: 500 }
    );
  }
}