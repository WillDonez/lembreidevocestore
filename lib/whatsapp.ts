export async function enviarWhatsapp(
  telefone: string,
  mensagem: string,
) {
  const apiKey =
    process.env.CALLMEBOT_API_KEY;

  if (!apiKey) {
    throw new Error(
      "CALLMEBOT_API_KEY não está configurada.",
    );
  }

  const numeroLimpo =
    telefone.replace(/\D/g, "");

  if (!numeroLimpo) {
    throw new Error(
      "Telefone do WhatsApp inválido.",
    );
  }

  const numeroComPais =
    numeroLimpo.startsWith("55")
      ? numeroLimpo
      : `55${numeroLimpo}`;

  const url =
    "https://api.callmebot.com/whatsapp.php";

  const params =
    new URLSearchParams({
      phone: numeroComPais,
      text: mensagem,
      apikey: apiKey,
    });

  const resposta =
    await fetch(
      `${url}?${params.toString()}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

  const respostaTexto =
    await resposta.text();

  if (!resposta.ok) {
    console.error(
      "Erro ao enviar WhatsApp pelo CallMeBot:",
      {
        status: resposta.status,
        resposta:
          respostaTexto,
      },
    );

    throw new Error(
      "Não foi possível enviar a mensagem pelo WhatsApp.",
    );
  }

  const respostaNormalizada =
    respostaTexto
      .trim()
      .toLowerCase();

  if (
    respostaNormalizada.includes("error") ||
    respostaNormalizada.includes("invalid")
  ) {
    console.error(
      "CallMeBot rejeitou a mensagem:",
      respostaTexto,
    );

    throw new Error(
      "O CallMeBot não aceitou a mensagem.",
    );
  }

  return {
    sucesso: true,
    telefone:
      numeroComPais,
  };
}