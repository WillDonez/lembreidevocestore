import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  try {
    const clientId =
      process.env.MELHOR_ENVIO_CLIENT_ID;

    const redirectUri =
      process.env.MELHOR_ENVIO_REDIRECT_URI;

    const baseUrl =
      process.env.MELHOR_ENVIO_BASE_URL;

    if (!clientId || !redirectUri || !baseUrl) {
      return NextResponse.json(
        {
          erro:
            "Variáveis do Melhor Envio não configuradas.",
          clientIdConfigurado:
            Boolean(clientId),
          redirectUriConfigurado:
            Boolean(redirectUri),
          baseUrlConfigurada:
            Boolean(baseUrl),
        },
        {
          status: 500,
        }
      );
    }

    /*
     * =========================================================
     * 1. GERAR STATE DE SEGURANÇA DO OAUTH
     * =========================================================
     */

    const state = crypto
      .randomBytes(24)
      .toString("hex");

    /*
     * =========================================================
     * 2. PERMISSÕES SOLICITADAS AO MELHOR ENVIO
     * =========================================================
     */

    const scopes = [
      "shipping-calculate",
      "shipping-companies",
      "cart-read",
      "cart-write",
      "orders-read",
      "shipping-checkout",
      "shipping-generate",
      "shipping-preview",
      "shipping-print",
      "shipping-tracking",
      "users-read",
    ].join(" ");

    /*
     * =========================================================
     * 3. MONTAR URL DE AUTORIZAÇÃO
     * =========================================================
     */

    const authorizationUrl =
      new URL(
        "/oauth/authorize",
        baseUrl
      );

    authorizationUrl.searchParams.set(
      "client_id",
      clientId
    );

    authorizationUrl.searchParams.set(
      "redirect_uri",
      redirectUri
    );

    authorizationUrl.searchParams.set(
      "response_type",
      "code"
    );

    authorizationUrl.searchParams.set(
      "scope",
      scopes
    );

    authorizationUrl.searchParams.set(
      "state",
      state
    );

    /*
     * =========================================================
     * 4. REDIRECIONAR E SALVAR STATE EM COOKIE
     * =========================================================
     */

    const response =
      NextResponse.redirect(
        authorizationUrl
      );

    const ehProducao =
      process.env.VERCEL_ENV ===
      "production";

    response.cookies.set(
      "melhor_envio_oauth_state",
      state,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          "production",
        sameSite: "lax",
        maxAge: 10 * 60,
        path: "/",

        /*
         * Em produção o OAuth pode iniciar em:
         *
         * www.lembreidevocestore.com.br
         *
         * e retornar para:
         *
         * lembreidevocestore.com.br
         *
         * O domínio compartilhado permite que o cookie
         * de segurança seja enviado nos dois endereços.
         *
         * Preview e desenvolvimento continuam usando
         * cookie restrito ao próprio host.
         */
        ...(ehProducao
          ? {
              domain:
                ".lembreidevocestore.com.br",
            }
          : {}),
      }
    );

    return response;
  } catch (error) {
    console.error(
      "Erro ao iniciar OAuth do Melhor Envio:",
      error
    );

    return NextResponse.json(
      {
        erro:
          "Não foi possível iniciar a autorização do Melhor Envio.",
      },
      {
        status: 500,
      }
    );
  }
}