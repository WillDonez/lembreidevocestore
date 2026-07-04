"use client";

interface HeaderProps {
  quantidadeCarrinho: number;
  abrirCarrinho: () => void;
}

export default function Header({
  quantidadeCarrinho,
  abrirCarrinho,
}: HeaderProps) {
  return (
    <header className="bg-white shadow-md p-6 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Lembrei de Você Store"
            className="h-16 w-auto"
          />

          <span className="text-3xl font-bold text-pink-500">
            Lembrei de Voce Store
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 font-bold text-gray-700">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="hover:text-pink-500"
          >
            Início
          </button>

          <button
            onClick={() =>
              document
                .getElementById("produtos")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="hover:text-pink-500"
          >
            Produtos
          </button>

          <a href="/meu-pedido" className="hover:text-pink-500">
            Meu Pedido
          </a>

          <a
            href="https://wa.me/5533999958593"
            target="_blank"
            className="hover:text-pink-500"
          >
            Contato
          </a>
        </nav>

        <button
          onClick={abrirCarrinho}
          className="bg-pink-500 text-white px-6 py-3 rounded-xl font-bold"
        >
          Carrinho ({quantidadeCarrinho})
        </button>
      </div>
    </header>
  );
}