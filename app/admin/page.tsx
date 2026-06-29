"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Admin() {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [arquivo, setArquivo] = useState<any>(null);
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("Canecas");
  const [destaque, setDestaque] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<any>(null);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [mostrarBotaoLoja, setMostrarBotaoLoja] = useState(false);

  useEffect(() => {
    buscarProdutos();
  }, []);

  async function buscarProdutos() {
    const { data, error } = await supabase
      .from("produtos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    if (data) {
      setProdutos(data);
    }
  }

  async function uploadImagem() {
    if (!arquivo) return "";

    const nomeArquivo = `${Date.now()}-${arquivo.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9.]/g, "-")}`;

    const { error } = await supabase.storage
      .from("produtos")
      .upload(nomeArquivo, arquivo);

    if (error) {
      console.error("UPLOAD ERROR:", error);
      alert("Erro ao enviar imagem");
      return "";
    }

    const { data } = supabase.storage
      .from("produtos")
      .getPublicUrl(nomeArquivo);

    return data.publicUrl;
  }

  async function cadastrarProduto() {
    const imagemUrl = await uploadImagem();

    if (produtoEditando) {
      const { error } = await supabase
        .from("produtos")
        .update({
          nome,
          preco: Number(preco),
          imagem: imagemUrl || produtoEditando.imagem,
          descricao,
          categoria,
          destaque,
        })
        .eq("id", produtoEditando.id);

      if (error) {
        alert("Erro ao editar produto");
        console.log(error);
        return;
      }

      alert("Produto atualizado!");
      setMostrarBotaoLoja(true);
      limparFormulario();
      buscarProdutos();
      return;
    }

    const { error } = await supabase.from("produtos").insert([
      {
        nome,
        preco: Number(preco),
        imagem: imagemUrl,
        descricao,
        categoria,
        destaque,
      },
    ]);

    if (error) {
      alert("Erro ao cadastrar produto");
      console.log(error);
      return;
    }

    alert("Produto cadastrado!");
    setMostrarBotaoLoja(true);
    limparFormulario();
    buscarProdutos();
  }

  function limparFormulario() {
    setProdutoEditando(null);
    setNome("");
    setPreco("");
    setArquivo(null);
    setDescricao("");
    setCategoria("Canecas");
    setDestaque(false);
  }

  function editarProduto(produto: any) {
    setProdutoEditando(produto);
    setNome(produto.nome || "");
    setPreco(String(produto.preco || ""));
    setDescricao(produto.descricao || "");
    setCategoria(produto.categoria || "Canecas");
    setDestaque(produto.destaque || false);
    setArquivo(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function excluirProduto(id: number, nomeProduto: string) {
    const confirmar = confirm(
      `Deseja realmente excluir "${nomeProduto}"?`
    );

    if (!confirmar) return;

    const { error } = await supabase
      .from("produtos")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Erro ao excluir produto");
      console.log(error);
      return;
    }

    buscarProdutos();
  }

  return (
    <main className="min-h-screen bg-pink-50 p-10">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-xl">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-pink-500">
              Produtos
            </h1>

            {produtoEditando && (
              <p className="text-blue-500 font-bold mt-2">
                Editando produto: {produtoEditando.nome}
              </p>
            )}
          </div>

          {produtoEditando && (
            <button
              onClick={limparFormulario}
              className="bg-gray-200 text-gray-700 px-5 py-3 rounded-2xl font-bold"
            >
              Cancelar edição
            </button>
          )}
        </div>

        <div className="space-y-6">
          <input
            type="text"
            placeholder="Nome do produto"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full border p-4 rounded-xl"
          />

          <input
            type="number"
            placeholder="Preço"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            className="w-full border p-4 rounded-xl"
          />

          <input
            type="file"
            onChange={(e) => {
              if (e.target.files) {
                setArquivo(e.target.files[0]);
              }
            }}
            className="w-full border p-4 rounded-xl"
          />

          {produtoEditando?.imagem && (
            <div>
              <p className="font-bold mb-2">Imagem atual:</p>
              <img
                src={produtoEditando.imagem}
                alt={produtoEditando.nome}
                className="w-28 h-28 object-cover rounded-xl border"
              />
            </div>
          )}

          <textarea
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full border p-4 rounded-xl h-40"
          />

          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full border p-4 rounded-xl"
          >
            <option>Canecas</option>
            <option>Topos de Bolo</option>
            <option>Lembrancinhas</option>
            <option>Marcadores</option>
            <option>Papelaria</option>
            <option>Festas</option>
            <option>Outros</option>
          </select>

          <label className="flex items-center gap-3 text-lg font-semibold">
            <input
              type="checkbox"
              checked={destaque}
              onChange={(e) => setDestaque(e.target.checked)}
              className="w-5 h-5"
            />
            ⭐ Produto em Destaque
          </label>

          <button
            onClick={cadastrarProduto}
            className="bg-pink-500 text-white px-6 py-4 rounded-2xl font-bold w-full"
          >
            {produtoEditando ? "Salvar Alterações" : "Cadastrar Produto"}
          </button>

          {mostrarBotaoLoja && (
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-green-500 text-white px-6 py-4 rounded-2xl font-bold w-full hover:bg-green-600 transition"
            >
              👁️ Visualizar na Loja
            </a>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-10">
        <h2 className="text-3xl font-bold mb-6">
          Produtos Cadastrados
        </h2>

        <div className="space-y-4">
          {produtos.map((produto) => (
            <div
              key={produto.id}
              className="bg-white p-6 rounded-2xl shadow flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                {produto.imagem && (
                  <img
                    src={produto.imagem}
                    alt={produto.nome}
                    className="w-20 h-20 object-cover rounded-xl"
                  />
                )}

                <div>
                  <h3 className="text-2xl font-bold">
                    {produto.nome}
                  </h3>

                  <p className="text-pink-500 font-bold">
                    R$ {produto.preco}
                  </p>

                  <p className="text-gray-500">
                    Categoria: {produto.categoria || "Sem categoria"}
                  </p>

                  {produto.destaque && (
                    <p className="text-yellow-500 font-bold">
                      ⭐ Destaque
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => editarProduto(produto)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-xl"
                >
                  Editar
                </button>

                <button
                  onClick={() =>
                    excluirProduto(produto.id, produto.nome)
                  }
                  className="bg-red-500 text-white px-4 py-2 rounded-xl"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}