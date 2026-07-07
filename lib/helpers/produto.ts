export function obterFormatoArquivo(tipoProduto: string) {
  switch (tipoProduto) {
    case "pdf":
      return "pdf";

    case "kit":
      return "zip";

    default:
      return null;
  }
}