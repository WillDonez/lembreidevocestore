export async function enviarWhatsapp(
  mensagem: string
) {

  const telefone = "553399958593";
  const apikey = "7504975";

  await fetch(
    `https://api.callmebot.com/whatsapp.php?phone=${telefone}&text=${encodeURIComponent(mensagem)}&apikey=${apikey}`
  );
}