import { Resend } from "resend";

type ProdutoDigitalEmail = {
  nome?: string;
  arquivo_digital?: string | null;
  formato_arquivo?: string | null;
};

type EnviarEmailDownloadParams = {
  emailCliente: string;
  nomeCliente?: string | null;
  pedidoId: number;
  produtos: ProdutoDigitalEmail[];
};

function escaparHtml(valor: string) {
  return valor
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function obterProdutosDigitais(produtos: ProdutoDigitalEmail[]) {
  return produtos.filter((produto) => {
    return Boolean(
      produto?.arquivo_digital &&
        String(produto.arquivo_digital).trim()
    );
  });
}

export async function enviarEmailDownload({
  emailCliente,
  nomeCliente,
  pedidoId,
  produtos,
}: EnviarEmailDownloadParams) {
  const apiKey = process.env.RESEND_API_KEY;
  const remetente = process.env.RESEND_FROM_EMAIL;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY não está configurada.");
  }

  if (!remetente) {
    throw new Error("RESEND_FROM_EMAIL não está configurado.");
  }

  const emailDestino = String(emailCliente || "").trim();

  if (!emailDestino) {
    throw new Error("E-mail do cliente não informado.");
  }

  const produtosDigitais = obterProdutosDigitais(produtos);

  if (produtosDigitais.length === 0) {
    throw new Error(
      "O pedido não possui arquivo digital disponível para envio."
    );
  }

  const resend = new Resend(apiKey);

  const numeroPedido = `LVS-${String(pedidoId).padStart(6, "0")}`;

  const primeiroNome =
    String(nomeCliente || "")
      .trim()
      .split(/\s+/)[0] || "cliente";

  const botoesDownload = produtosDigitais
    .map((produto, index) => {
      const nomeProduto =
        String(produto.nome || "").trim() ||
        `Arquivo digital ${index + 1}`;

      const arquivo = String(produto.arquivo_digital).trim();

      const formato = String(
        produto.formato_arquivo || ""
      ).trim();

      return `
        <div
          style="
            margin: 0 0 18px;
            padding: 20px;
            background: #FAFAFA;
            border: 1px solid #E5E7EB;
            border-radius: 14px;
          "
        >
          <div
            style="
              margin-bottom: 12px;
              font-size: 16px;
              line-height: 24px;
              font-weight: 700;
              color: #1F2937;
            "
          >
            ${escaparHtml(nomeProduto)}
          </div>

          ${
            formato
              ? `
                <div
                  style="
                    margin-bottom: 14px;
                    font-size: 13px;
                    color: #6B7280;
                  "
                >
                  Formato: ${escaparHtml(formato)}
                </div>
              `
              : ""
          }

          <a
            href="${escaparHtml(arquivo)}"
            target="_blank"
            style="
              display: inline-block;
              padding: 13px 22px;
              background: #D90042;
              color: #FFFFFF;
              text-decoration: none;
              font-size: 15px;
              font-weight: 700;
              border-radius: 10px;
            "
          >
            Baixar arquivo
          </a>
        </div>
      `;
    })
    .join("");

  const { data, error } = await resend.emails.send({
    from: remetente,
    to: [emailDestino],
    subject: `Seu arquivo digital está disponível 🎁 | ${numeroPedido}`,
    html: `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>Seu arquivo digital está disponível</title>
        </head>

        <body
          style="
            margin: 0;
            padding: 0;
            background: #F5F5F5;
            font-family: Arial, Helvetica, sans-serif;
          "
        >
          <table
            role="presentation"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="background: #F5F5F5; padding: 30px 12px;"
          >
            <tr>
              <td align="center">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="
                    max-width: 620px;
                    background: #FFFFFF;
                    border-radius: 18px;
                    overflow: hidden;
                    border: 1px solid #E5E7EB;
                  "
                >
                  <tr>
                    <td
                      style="
                        padding: 28px 32px;
                        background: #E50046;
                        text-align: center;
                      "
                    >
                      <div
                        style="
                          color: #FFFFFF;
                          font-size: 24px;
                          line-height: 32px;
                          font-weight: 700;
                        "
                      >
                        Lembrei de Você Store
                      </div>

                      <div
                        style="
                          margin-top: 5px;
                          color: #FFFFFF;
                          font-size: 14px;
                          opacity: 0.92;
                        "
                      >
                        Seu pedido digital chegou 💝
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 32px;">
                      <div
                        style="
                          margin-bottom: 16px;
                          font-size: 20px;
                          line-height: 28px;
                          font-weight: 700;
                          color: #1F2937;
                        "
                      >
                        Olá, ${escaparHtml(primeiroNome)}!
                      </div>

                      <div
                        style="
                          margin-bottom: 14px;
                          font-size: 15px;
                          line-height: 24px;
                          color: #6B7280;
                        "
                      >
                        Seu pagamento foi aprovado e o seu
                        arquivo digital já está disponível.
                      </div>

                      <div
                        style="
                          margin-bottom: 26px;
                          padding: 12px 16px;
                          background: #FFF1F5;
                          border-radius: 10px;
                          font-size: 14px;
                          color: #1F2937;
                        "
                      >
                        Pedido:
                        <strong>${numeroPedido}</strong>
                      </div>

                      ${botoesDownload}

                      <div
                        style="
                          margin-top: 26px;
                          padding-top: 22px;
                          border-top: 1px solid #E5E7EB;
                          font-size: 13px;
                          line-height: 21px;
                          color: #6B7280;
                        "
                      >
                        Recomendamos que você faça o download
                        e guarde o arquivo em um local seguro
                        no seu dispositivo.
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td
                      style="
                        padding: 22px 32px;
                        background: #FAFAFA;
                        text-align: center;
                        font-size: 12px;
                        line-height: 19px;
                        color: #6B7280;
                      "
                    >
                      Lembrei de Você Store<br />
                      Um presente especial para cada momento.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });

  if (error) {
    console.error(
      `Erro do Resend ao enviar o pedido ${pedidoId}:`,
      error
    );

    throw new Error(
      "Não foi possível enviar o e-mail de download."
    );
  }

  console.log(
    `E-mail de download enviado para o pedido ${pedidoId}.`,
    {
      resendEmailId: data?.id,
      destino: emailDestino,
    }
  );

  return data;
}