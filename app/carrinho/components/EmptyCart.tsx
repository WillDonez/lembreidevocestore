import Link from "next/link";

export default function EmptyCart() {
  return (
    <div className="rounded-2xl border-2 border-dashed p-12 text-center text-gray-500">
      <p className="text-5xl">🛒</p>

      <p className="mt-4 text-xl font-bold">
        Seu carrinho está vazio.
      </p>

      <p className="mt-2">
        Adicione produtos para continuar sua compra.
      </p>

      <Link
        href="/"
        className="mt-6 inline-block rounded-xl bg-pink-500 px-6 py-3 font-bold text-white transition hover:bg-pink-600"
      >
        Ver produtos
      </Link>
    </div>
  );
}