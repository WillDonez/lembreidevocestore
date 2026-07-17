"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ProdutoForm from "./components/ProdutoForm";
import ListaProdutos from "./components/ListaProdutos";
import type { ProdutoAdministrativo } from "./hooks/useProdutoForm";

export default function AdminProdutosPage() {
  const [produtos, setProdutos] = useState<
    ProdutoAdministrativo[]
  >([]);

  const [produtoEditando, setProdutoEditando] =
    useState<ProdutoAdministrativo | null>(null);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const buscarProdutos = useCallback(async () => {
    setErro("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setErro(
          "Sessão administrativa não encontrada. Entre novamente."
        );
        setProdutos([]);
        return;
      }

      const resposta = await fetch("/api/admin/produtos", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        cache: "no-store",
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        console.error(
          "Erro ao carregar produtos:",
          resultado
        );

        setErro(
          resultado.erro ||
            "Não foi possível carregar os produtos."
        );

        setProdutos([]);
        return;
      }

      setProdutos(resultado.produtos || []);
    } catch (error) {
      console.error(
        "Erro interno ao carregar produtos:",
        error
      );

      setErro(
        "Ocorreu um erro ao carregar os produtos."
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    buscarProdutos();

    function atualizarListaProdutos() {
      buscarProdutos();
    }

    window.addEventListener(
      "produto-salvo",
      atualizarListaProdutos
    );

    window.addEventListener(
      "produto-cadastrado",
      atualizarListaProdutos
    );

    return () => {
      window.removeEventListener(
        "produto-salvo",
        atualizarListaProdutos
      );

      window.removeEventListener(
        "produto-cadastrado",
        atualizarListaProdutos
      );
    };
  }, [buscarProdutos]);

  function editarProduto(
    produto: ProdutoAdministrativo
  ) {
    setProdutoEditando(produto);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelarEdicao() {
    setProdutoEditando(null);
  }

  async function excluirProduto(
    id: number,
    nomeProduto: string
  ) {
    const confirmar = window.confirm(
      `Deseja realmente excluir "${nomeProduto}"?`
    );

    if (!confirmar) {
      return;
    }

    setErro("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setErro(
          "Sua sessão expirou. Entre novamente no painel."
        );
        return;
      }

      const resposta = await fetch(
        `/api/admin/produtos?id=${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const resultado = await resposta.json();

      if (!resposta.ok) {
        console.error(
          "Erro ao excluir produto:",
          resultado
        );

        setErro(
          resultado.erro ||
            "Não foi possível excluir o produto."
        );

        return;
      }

      if (produtoEditando?.id === id) {
        setProdutoEditando(null);
      }

      await buscarProdutos();
    } catch (error) {
      console.error(
        "Erro interno ao excluir produto:",
        error
      );

      setErro(
        "Ocorreu um erro ao excluir o produto."
      );
    }
  }

  return (
    <main className="min-h-screen bg-pink-50 p-5 md:p-10">
      <div className="mx-auto max-w-7xl">
        <ProdutoForm
          produtoEditando={produtoEditando}
          onConcluido={() => {
            setProdutoEditando(null);
            buscarProdutos();
          }}
          onCancelarEdicao={cancelarEdicao}
        />

        {erro && (
          <div className="mt-8 rounded-2xl border border-red-300 bg-red-50 p-5 font-bold text-red-700">
            ⚠️ {erro}
          </div>
        )}

        {carregando ? (
          <div className="mt-10 rounded-3xl bg-white p-10 text-center shadow">
            <p className="text-xl font-bold text-pink-500">
              Carregando produtos...
            </p>
          </div>
        ) : (
          <ListaProdutos
            produtos={produtos}
            onEditar={editarProduto}
            onExcluir={excluirProduto}
          />
        )}
      </div>
    </main>
  );
}