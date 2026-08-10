"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

export default function CategoriasAdmin() {
  const [nome, setNome] =
    useState("");

  const [icone, setIcone] =
    useState("");

  const [ordem, setOrdem] =
    useState("");

  const [arquivo, setArquivo] =
    useState<File | null>(null);

  const [
    categorias,
    setCategorias,
  ] = useState<any[]>([]);

  const [
    categoriaEditando,
    setCategoriaEditando,
  ] = useState<any | null>(
    null,
  );

  useEffect(() => {
    buscarCategorias();
  }, []);

  async function buscarCategorias() {
    const {
      data,
      error,
    } = await supabase
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
    if (!arquivo) {
      return "";
    }

    const nomeArquivo = `${Date.now()}-${arquivo.name
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        "",
      )
      .replace(
        /[^a-zA-Z0-9.]/g,
        "-",
      )}`;

    const {
      error,
    } =
      await supabase.storage
        .from("produtos")
        .upload(
          nomeArquivo,
          arquivo,
        );

    if (error) {
      alert(
        "Erro ao enviar imagem da categoria",
      );

      console.log(error);

      return "";
    }

    const {
      data,
    } =
      supabase.storage
        .from("produtos")
        .getPublicUrl(
          nomeArquivo,
        );

    return data.publicUrl;
  }

  async function cadastrarCategoria() {
    const imagemUrl =
      await uploadImagemCategoria();

    if (categoriaEditando) {
      const {
        error,
      } = await supabase
        .from("categorias")
        .update({
          nome,
          icone,
          ordem:
            Number(ordem),
          imagem:
            imagemUrl ||
            categoriaEditando.imagem,
        })
        .eq(
          "id",
          categoriaEditando.id,
        );

      if (error) {
        alert(
          "Erro ao editar categoria",
        );

        console.log(error);

        return;
      }

      alert(
        "Categoria atualizada!",
      );

      setCategoriaEditando(
        null,
      );

      setNome("");
      setIcone("");
      setOrdem("");
      setArquivo(null);

      buscarCategorias();

      return;
    }

    const {
      error,
    } =
      await supabase
        .from("categorias")
        .insert([
          {
            nome,
            icone,
            ordem:
              Number(ordem),
            imagem:
              imagemUrl,
          },
        ]);

    if (error) {
      alert(
        "Erro ao cadastrar categoria",
      );

      console.log(error);

      return;
    }

    alert(
      "Categoria cadastrada!",
    );

    setNome("");
    setIcone("");
    setOrdem("");
    setArquivo(null);

    buscarCategorias();
  }

  function editarCategoria(
    categoria: any,
  ) {
    setCategoriaEditando(
      categoria,
    );

    setNome(
      categoria.nome,
    );

    setIcone(
      categoria.icone ||
        "",
    );

    setOrdem(
      String(
        categoria.ordem,
      ),
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function excluirCategoria(
    id: number,
  ) {
    const confirmar =
      confirm(
        "Deseja realmente excluir esta categoria?",
      );

    if (!confirmar) {
      return;
    }

    const {
      error,
    } = await supabase
      .from("categorias")
      .delete()
      .eq(
        "id",
        id,
      );

    if (error) {
      alert(
        "Erro ao excluir categoria",
      );

      console.log(error);

      return;
    }

    buscarCategorias();
  }

  const inputClass =
    "w-full rounded-xl border border-border bg-card p-4 text-text outline-none transition placeholder:text-text-light focus:border-primary focus:ring-2 focus:ring-[color-mix(in_srgb,var(--primary)_15%,transparent)]";

  return (
    <main className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-secondary">
            Administração
          </p>

          <h1 className="mt-2 text-4xl font-black text-primary md:text-5xl">
            📂 Gerenciar Categorias
          </h1>

          <p className="mt-2 text-text-light">
            Cadastre, organize e edite as categorias exibidas na loja.
          </p>
        </div>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-xl md:p-8">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nome da categoria"
              value={nome}
              onChange={(e) =>
                setNome(
                  e.target.value,
                )
              }
              className={inputClass}
            />

            <input
              type="text"
              placeholder="Ícone. Ex: ☕"
              value={icone}
              onChange={(e) =>
                setIcone(
                  e.target.value,
                )
              }
              className={inputClass}
            />

            <input
              type="number"
              placeholder="Ordem. Ex: 1"
              value={ordem}
              onChange={(e) =>
                setOrdem(
                  e.target.value,
                )
              }
              className={inputClass}
            />

            <input
              type="file"
              onChange={(e) => {
                if (
                  e.target
                    .files?.[0]
                ) {
                  setArquivo(
                    e.target
                      .files[0],
                  );
                }
              }}
              className="w-full rounded-xl border border-border bg-background p-4 text-text file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:font-bold file:text-white"
            />

            <button
              type="button"
              onClick={
                cadastrarCategoria
              }
              className="w-full rounded-2xl bg-primary px-6 py-4 font-bold text-white transition hover:opacity-90"
            >
              {categoriaEditando
                ? "Salvar Alterações"
                : "Cadastrar Categoria"}
            </button>

            {categoriaEditando && (
              <button
                type="button"
                onClick={() => {
                  setCategoriaEditando(
                    null,
                  );

                  setNome("");
                  setIcone("");
                  setOrdem("");
                  setArquivo(
                    null,
                  );
                }}
                className="w-full rounded-2xl border border-border bg-background px-6 py-4 font-bold text-text transition hover:border-primary hover:text-primary"
              >
                Cancelar edição
              </button>
            )}
          </div>
        </section>

        <section className="mt-10 space-y-4">
          {categorias.length ===
            0 && (
            <div className="rounded-3xl border border-border bg-card p-8 text-center text-text-light shadow-sm">
              Nenhuma categoria cadastrada.
            </div>
          )}

          {categorias.map(
            (categoria) => (
              <div
                key={
                  categoria.id
                }
                className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-5">
                  {categoria.imagem && (
                    <img
                      src={
                        categoria.imagem
                      }
                      alt={
                        categoria.nome
                      }
                      className="h-20 w-20 rounded-2xl border border-border object-cover"
                    />
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      {categoria.icone && (
                        <span className="text-2xl">
                          {
                            categoria.icone
                          }
                        </span>
                      )}

                      <h2 className="text-xl font-bold text-text">
                        {
                          categoria.nome
                        }
                      </h2>
                    </div>

                    <p className="mt-1 text-text-light">
                      Ordem:{" "}
                      {
                        categoria.ordem
                      }
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      editarCategoria(
                        categoria,
                      )
                    }
                    className="rounded-xl bg-primary px-4 py-2 font-bold text-white transition hover:opacity-90"
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      excluirCategoria(
                        categoria.id,
                      )
                    }
                    className="rounded-xl bg-danger px-4 py-2 font-bold text-white transition hover:opacity-90"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ),
          )}
        </section>
      </div>
    </main>
  );
}