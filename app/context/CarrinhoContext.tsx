"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type Produto = {
  id: number;
  nome: string;
  preco: number;
  imagem?: string;
  descricao?: string;
};

type CarrinhoContextType = {
  carrinho: Produto[];
  adicionarCarrinho: (produto: Produto) => void;
  removerCarrinho: (index: number) => void;
  limparCarrinho: () => void;
  total: number;
};

const CarrinhoContext = createContext<CarrinhoContextType | null>(null);

export function CarrinhoProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [carrinho, setCarrinho] = useState<Produto[]>([]);
  const [carrinhoCarregado, setCarrinhoCarregado] = useState(false);

  useEffect(() => {
  const carrinhoSalvo = localStorage.getItem("carrinho");

  if (carrinhoSalvo) {
    setCarrinho(JSON.parse(carrinhoSalvo));
  }

setCarrinhoCarregado(true);

}, []);

useEffect(() => {
  if (!carrinhoCarregado) return;

  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}, [carrinho, carrinhoCarregado]);

  function adicionarCarrinho(produto: Produto) {
    setCarrinho((atual) => [...atual, produto]);
  }

  function removerCarrinho(index: number) {
    setCarrinho((atual) => atual.filter((_, i) => i !== index));
  }

  function limparCarrinho() {
    setCarrinho([]);
  }

  const total = carrinho.reduce(
    (acc, produto) => acc + Number(produto.preco),
    0
  );

  return (
    <CarrinhoContext.Provider
      value={{
        carrinho,
        adicionarCarrinho,
        removerCarrinho,
        limparCarrinho,
        total,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const context = useContext(CarrinhoContext);

  if (!context) {
    throw new Error("useCarrinho deve ser usado dentro de CarrinhoProvider");
  }

  return context;
}