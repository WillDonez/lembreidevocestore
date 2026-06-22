export async function enviarWhatsapp(
  telefone: string,
  mensagem: string
) {

  const apikey = "7504975";

  const numero = telefone.replace(/\D/g, "");

  await fetch(
    `https://api.callmebot.com/whatsapp.php?phone=55${numero}&text=${encodeURIComponent(mensagem)}&apikey=${apikey}`
  );
}