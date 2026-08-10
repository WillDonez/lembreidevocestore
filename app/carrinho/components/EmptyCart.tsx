import Link from "next/link";

export default function EmptyCart() {
  return (
    <div className="rounded-3xl border border-border bg-background p-10 text-center">
      <div className="text-6xl">
        🛒
      </div>

      <p className="mt-4 text-xl font-bold text-text">
        Seu carrinho está vazio.
      </p>

      <p className="mt-2 text-text-light">
        Adicione produtos para continuar sua compra.
      </p>

      <Link
        href="/"
        className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 font-bold text-white transition hover:opacity-90"
      >
        Ver produtos
      </Link>
    </div>
  );
}