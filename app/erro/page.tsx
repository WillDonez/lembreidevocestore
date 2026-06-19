export default function Erro() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-red-50">

      <div className="bg-white p-10 rounded-3xl shadow-xl text-center">

        <h1 className="text-5xl font-bold text-red-600">
          Pagamento Não Aprovado
        </h1>

        <p className="text-gray-600 mt-4 text-xl">
          Houve um problema no pagamento.
        </p>

        <a
          href="/"
          className="inline-block mt-8 bg-red-500 text-white px-8 py-4 rounded-2xl font-bold"
        >
          Tentar Novamente
        </a>

      </div>

    </main>
  );
}