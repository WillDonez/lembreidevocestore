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
      className="grid grid-cols-1 gap-5 bg-background px-6 py-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
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