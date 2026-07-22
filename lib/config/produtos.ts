export const TIPOS_PRODUTO = [
  {
    value: "fisico",
    label: "🛍 Produto Físico",
  },
  {
    value: "digital",
    label: "💻 Produto Digital",
  },
] as const;

export const FORMATOS_ARQUIVO = [
  {
    value: "pdf",
    label: "PDF",
    accept: ".pdf",
    icone: "📄",
  },
  {
    value: "zip",
    label: "ZIP",
    accept: ".zip",
    icone: "📦",
  },
  {
    value: "png",
    label: "PNG",
    accept: ".png",
    icone: "🖼️",
  },
  {
    value: "svg",
    label: "SVG",
    accept: ".svg",
    icone: "🎨",
  },
  {
    value: "dxf",
    label: "DXF",
    accept: ".dxf",
    icone: "📐",
  },
  {
    value: "eps",
    label: "EPS",
    accept: ".eps",
    icone: "📚",
  },
  {
    value: "ai",
    label: "Adobe Illustrator",
    accept: ".ai",
    icone: "🟧",
  },
  {
    value: "psd",
    label: "Photoshop",
    accept: ".psd",
    icone: "🟦",
  },
  {
    value: "canva",
    label: "Canva",
    accept: ".pdf,.zip",
    icone: "🌐",
  },
  {
    value: "coreldraw",
    label: "CorelDRAW",
    accept: ".cdr",
    icone: "🟢",
  },
  {
    value: "studio",
    label: "Silhouette Studio",
    accept: ".studio,.studio3",
    icone: "✂️",
  },
] as const;

export function obterFormato(value: string) {
  return FORMATOS_ARQUIVO.find(
    (item) => item.value === value
  );
}

export function obterAcceptDoFormato(value: string) {
  return obterFormato(value)?.accept || "*";
}

export function obterLabelFormato(value: string) {
  return obterFormato(value)?.label || value;
}

export function ehProdutoDigital(tipo: string) {
  return tipo === "digital";
}

export function ehProdutoFisico(tipo: string) {
  return tipo === "fisico";
}