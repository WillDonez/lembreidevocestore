"use client";

interface BuscaProdutosProps {
  busca: string;
  setBusca: (valor: string) => void;
}

export default function BuscaProdutos({
  busca,
  setBusca,
}: BuscaProdutosProps) {
  return (
    <input
      type="text"
      placeholder="🔍 O que você procura hoje?"
      value={busca}
      onChange={(e) => setBusca(e.target.value)}
      className="w-full max-w-2xl mx-auto mt-8 border p-4 rounded-2xl text-lg shadow"
    />
  );
}