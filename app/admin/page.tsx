"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Admin() {

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [imagem, setImagem] = useState("");
  const [arquivo, setArquivo] = useState<any>(null);
  const [descricao, setDescricao] = useState("");
  const [produtos, setProdutos] = useState<any[]>([]);

  useEffect(() => {
    buscarProdutos();
  }, []);

  async function buscarProdutos() {

    const { data, error } = await supabase
      .from("produtos")
      .select("*");

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

  const nomeArquivo = `${Date.now()}-${arquivo.name}`;

  const { error } = await supabase.storage
    .from("produtos")
    .upload(nomeArquivo, arquivo);

  if (error) {
    console.log(error);
    alert("Erro upload imagem");
    return "";
  }

  const { data } = supabase.storage
    .from("produtos")
    .getPublicUrl(nomeArquivo);

  return data.publicUrl;
}

  async function cadastrarProduto() {

  const imagemUrl = await uploadImagem();

  const { error } = await supabase
    .from("produtos")
    .insert([
      {
        nome,
        preco: Number(preco),
        imagem: imagemUrl,
        descricao,
      },
    ]);

  if (error) {
    alert("Erro ao cadastrar");
    console.log(error);
    return;
  }

  alert("Produto cadastrado!");

  setNome("");
  setPreco("");
  setDescricao("");
}

  async function excluirProduto(id: number) {

    const { error } = await supabase
      .from("produtos")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Erro ao excluir");
      return;
    }

    buscarProdutos();
  }

  return (
    <main className="min-h-screen bg-pink-50 p-10">

      <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl shadow-xl">

        <h1 className="text-4xl font-bold text-pink-500 mb-10">
          Painel Admin
        </h1>

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

<textarea
  placeholder="Descrição"
  value={descricao}
  onChange={(e) => setDescricao(e.target.value)}
  className="w-full border p-4 rounded-xl h-40"
/>

          <button
            onClick={cadastrarProduto}
            className="bg-pink-500 text-white px-6 py-4 rounded-2xl font-bold w-full"
          >
            Cadastrar Produto
          </button>

        </div>

      </div>

      <div className="max-w-4xl mx-auto mt-10">

        <h2 className="text-3xl font-bold mb-6">
          Produtos Cadastrados
        </h2>

        <div className="space-y-4">

          {produtos.map((produto) => (

            <div
              key={produto.id}
              className="bg-white p-6 rounded-2xl shadow flex justify-between items-center"
            >

              <div>

                <h3 className="text-2xl font-bold">
                  {produto.nome}
                </h3>

                <p className="text-pink-500 font-bold">
                  R$ {produto.preco}
                </p>

              </div>

              <button
                onClick={() => excluirProduto(produto.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-xl"
              >
                Excluir
              </button>

            </div>

          ))}

        </div>

      </div>

    </main>
  );
}