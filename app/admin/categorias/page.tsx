"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CategoriasAdmin() {
  const [nome, setNome] = useState("");
  const [icone, setIcone] = useState("");
  const [ordem, setOrdem] = useState("");
  const [arquivo, setArquivo] = useState<any>(null);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [categoriaEditando, setCategoriaEditando] = useState<any>(null);

  useEffect(() => {
    buscarCategorias();
  }, []);

  async function buscarCategorias() {
    const { data, error } = await supabase
      .from("categorias")
      .select("*")
      .order("ordem");

    if (error) {
      console.log(error);
      return;
    }

    if (data) {
      setCategorias(data);
    }
  }

  async function uploadImagemCategoria() {
  if (!arquivo) return "";

  const nomeArquivo = `${Date.now()}-${arquivo.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.]/g, "-")}`;

  const { error } = await supabase.storage
    .from("produtos")
    .upload(nomeArquivo, arquivo);

  if (error) {
    alert("Erro ao enviar imagem da categoria");
    console.log(error);
    return "";
  }

  const { data } = supabase.storage
    .from("produtos")
    .getPublicUrl(nomeArquivo);

  return data.publicUrl;
}

  async function cadastrarCategoria() {
    const imagemUrl = await uploadImagemCategoria();
    if (categoriaEditando) {
  const { error } = await supabase
    .from("categorias")
    .update({
  nome,
  icone,
  ordem: Number(ordem),
  imagem: imagemUrl || categoriaEditando.imagem,
})
    .eq("id", categoriaEditando.id);

  if (error) {
    alert("Erro ao editar categoria");
    console.log(error);
    return;
  }

  alert("Categoria atualizada!");

  setCategoriaEditando(null);
  setNome("");
setIcone("");
setOrdem("");
setArquivo(null);

  buscarCategorias();
  return;
}
    const { error } = await supabase.from("categorias").insert([
      {
  nome,
  icone,
  ordem: Number(ordem),
  imagem: imagemUrl,
}
    ]);

    if (error) {
      alert("Erro ao cadastrar categoria");
      console.log(error);
      return;
    }

    alert("Categoria cadastrada!");

    setNome("");
    setIcone("");
    setOrdem("");
    setArquivo(null);

    buscarCategorias();
  }

  function editarCategoria(categoria: any) {
  setCategoriaEditando(categoria);
  setNome(categoria.nome);
  setIcone(categoria.icone || "");
  setOrdem(String(categoria.ordem));

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

  async function excluirCategoria(id: number) {
    const confirmar = confirm("Deseja realmente excluir esta categoria?");

    if (!confirmar) return;

    const { error } = await supabase
      .from("categorias")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Erro ao excluir categoria");
      console.log(error);
      return;
    }

    buscarCategorias();
  }

  return (
    <main className="min-h-screen bg-pink-50 p-10">
      <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl shadow-xl">
        <h1 className="text-4xl font-bold text-pink-500 mb-8">
          Gerenciar Categorias
          
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nome da categoria"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full border p-4 rounded-xl"
          />

          <input
            type="text"
            placeholder="Ícone. Ex: ☕"
            value={icone}
            onChange={(e) => setIcone(e.target.value)}
            className="w-full border p-4 rounded-xl"
          />

          <input
            type="number"
            placeholder="Ordem. Ex: 1"
            value={ordem}
            onChange={(e) => setOrdem(e.target.value)}
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

          <button
            onClick={cadastrarCategoria}
            className="bg-pink-500 text-white px-6 py-4 rounded-2xl font-bold w-full"
          >
            {categoriaEditando ? "Salvar Alterações" : "Cadastrar Categoria"}
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-10 space-y-4">
        {categorias.map((categoria) => (
          <div
            key={categoria.id}
            className="bg-white p-6 rounded-2xl shadow flex justify-between items-center"
          >
            <div className="flex items-center gap-5">
  {categoria.imagem && (
    <img
      src={categoria.imagem}
      alt={categoria.nome}
      className="w-20 h-20 rounded-xl object-cover border"
    />
  )}

  <div>
    <h2 className="text-2xl font-bold">
      {categoria.icone} {categoria.nome}
    </h2>

    <p className="text-gray-500">
      Ordem: {categoria.ordem}
    </p>
  </div>
  
</div>

            <div className="flex gap-3">
  <button
    onClick={() => editarCategoria(categoria)}
    className="bg-blue-500 text-white px-4 py-2 rounded-xl"
  >
    Editar
  </button>

  <button
    onClick={() => excluirCategoria(categoria.id)}
    className="bg-red-500 text-white px-4 py-2 rounded-xl"
  >
    Excluir
  </button>
</div>
          </div>
        ))}
      </div>
    </main>
  );
}