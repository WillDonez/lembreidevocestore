"use client";

import ProdutoCard from "@/components/ProdutoCard";

type ListaProdutosProps = {
  produtos: any[];
  adicionarCarrinho: (produto: any) => void;
};

export default function ListaProdutos({
  produtos,
  adicionarCarrinho,
}: ListaProdutosProps) {
  return (
    <div
      id="produtos"
      className="grid grid-cols-1 md:grid-cols-3 gap-8 p-10 bg-white"
    >
      {produtos.map((produto) => (
        <ProdutoCard
          key={produto.id}
          produto={produto}
          adicionarCarrinho={adicionarCarrinho}
        />
      ))}
    </div>
  );
}