import { supabaseAdmin } from "@/lib/supabaseAdmin";

type MelhorEnvioToken = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  expires_at: string;
  ambiente: string;
};

const MARGEM_RENOVACAO_MINUTOS = 10;

function obterVariaveisMelhorEnvio() {
  const clientId = process.env.MELHOR_ENVIO_CLIENT_ID;
  const clientSecret = process.env.MELHOR_ENVIO_CLIENT_SECRET;
  const baseUrl = process.env.MELHOR_ENVIO_BASE_URL;
  const userAgent = process.env.MELHOR_ENVIO_USER_AGENT;

  if (!clientId || !clientSecret || !baseUrl || !userAgent) {
    throw new Error(
      "As variáveis de ambiente do Melhor Envio não estão completas."
    );
  }

  return {
    clientId,
    clientSecret,
    baseUrl,
    userAgent,
  };
}

async function buscarTokenSalvo(): Promise<MelhorEnvioToken> {
  const { data, error } = await supabaseAdmin
    .from("melhor_envio_tokens")
    .select(
      "access_token, refresh_token, token_type, expires_in, expires_at, ambiente"
    )
    .eq("integracao", "principal")
    .single();

  if (error || !data) {
    console.error("Erro ao buscar token do Melhor Envio:", error);

    throw new Error(
      "A integração com o Melhor Envio ainda não possui um token salvo."
    );
  }

  return data as MelhorEnvioToken;
}

function tokenAindaValido(expiresAt: string): boolean {
  const vencimento = new Date(expiresAt).getTime();

  if (!Number.isFinite(vencimento)) {
    return false;
  }

  const margem =
    MARGEM_RENOVACAO_MINUTOS * 60 * 1000;

  return vencimento > Date.now() + margem;
}

async function renovarToken(
  refreshToken: string
): Promise<MelhorEnvioToken> {
  const {
    clientId,
    clientSecret,
    baseUrl,
    userAgent,
  } = obterVariaveisMelhorEnvio();

  const response = await fetch(`${baseUrl}/oauth/token`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": userAgent,
    },
    body: JSON.stringify({
      grant_type: "refresh_token",
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });

  const tokenData = await response.json();

  if (!response.ok) {
    console.error(
      "Erro ao renovar token do Melhor Envio:",
      tokenData
    );

    throw new Error(
      "Não foi possível renovar o token do Melhor Envio."
    );
  }

  if (!tokenData.access_token || !tokenData.refresh_token) {
    throw new Error(
      "O Melhor Envio não retornou os tokens esperados na renovação."
    );
  }

  const expiresIn = Number(tokenData.expires_in);

  if (!Number.isFinite(expiresIn)) {
    throw new Error(
      "O Melhor Envio retornou uma validade de token inválida."
    );
  }

  const expiresAt = new Date(
    Date.now() + expiresIn * 1000
  ).toISOString();

  const novoToken: MelhorEnvioToken = {
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token,
    token_type: tokenData.token_type || "Bearer",
    expires_in: expiresIn,
    expires_at: expiresAt,
    ambiente:
      process.env.MELHOR_ENVIO_SANDBOX === "true"
        ? "sandbox"
        : "producao",
  };

  const { error } = await supabaseAdmin
    .from("melhor_envio_tokens")
    .update({
      access_token: novoToken.access_token,
      refresh_token: novoToken.refresh_token,
      token_type: novoToken.token_type,
      expires_in: novoToken.expires_in,
      expires_at: novoToken.expires_at,
      ambiente: novoToken.ambiente,
      updated_at: new Date().toISOString(),
    })
    .eq("integracao", "principal");

  if (error) {
    console.error(
      "Erro ao salvar token renovado no Supabase:",
      error
    );

    throw new Error(
      "O token foi renovado, mas não pôde ser salvo."
    );
  }

  return novoToken;
}

export async function obterAccessTokenMelhorEnvio(): Promise<string> {
  const token = await buscarTokenSalvo();

  if (tokenAindaValido(token.expires_at)) {
    return token.access_token;
  }

  const tokenRenovado = await renovarToken(
    token.refresh_token
  );

  return tokenRenovado.access_token;
}

export function obterConfiguracaoMelhorEnvio() {
  const { baseUrl, userAgent } =
    obterVariaveisMelhorEnvio();

  return {
    baseUrl,
    userAgent,
  };
}