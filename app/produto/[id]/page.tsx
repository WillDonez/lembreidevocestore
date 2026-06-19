export default function ProdutoPage() {
  return (
    <main className="min-h-screen bg-pink-50 p-10">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        <div>
          <img
            src="https://images.pexels.com/photos/851555/pexels-photo-851555.jpeg"
            alt="Produto"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-10 flex flex-col justify-center">

          <h1 className="text-5xl font-bold text-gray-800">
            Caneca Personalizada
          </h1>

          <p className="text-pink-500 text-4xl font-bold mt-6">
            R$ 39,90
          </p>

          <p className="text-gray-600 mt-8 text-lg leading-relaxed">
            Caneca personalizada feita com alta qualidade.
          </p>

          <button className="mt-10 bg-pink-500 text-white py-4 rounded-2xl text-xl font-bold">
            Adicionar ao Carrinho
          </button>

        </div>
      </div>
    </main>
  );
}