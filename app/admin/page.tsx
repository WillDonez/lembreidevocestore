"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Admin() {

  const router = useRouter();

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [arquivo, setArquivo] = useState<any>(null);
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("Canecas");
  const [destaque, setDestaque] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<any>(null);

  const [produtos, setProdutos] = useState<any[]>([]);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [buscaPedido, setBuscaPedido] = useState("");

 useEffect(() => {

  verificarUsuario();
  buscarProdutos();
  buscarPedidos();

  const intervalo = setInterval(() => {
    buscarPedidos();
  }, 10000);

  return () => clearInterval(intervalo);

}, []);

async function sair() {

  await supabase.auth.signOut();

  router.push("/login");
}

async function verificarUsuario() {

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    router.push("/login");
  }
}

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

  async function buscarPedidos() {

    const { data, error } = await supabase
      .from("pedidos")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.log(error);
      return;
    }

    if (data) {
      setPedidos(data);
    }
  }

async function atualizarStatus(
  id: number,
  status: string
) {
  const pedido = pedidos.find((p) => p.id === id);

  await supabase
    .from("pedidos")
    .update({ status })
    .eq("id", id);

  let mensagem = "";

  if (status === "aprovado") {
    mensagem = `✅ Olá, ${pedido?.nome_cliente || "cliente"}!

Seu pedido foi aprovado e já está sendo preparado pela Lembrei de Voce Store. 💖`;
  }

  if (status === "enviado") {
    mensagem = `🚚 Olá, ${pedido?.nome_cliente || "cliente"}!

Seu pedido foi enviado e em breve chegará até você.`;
  }

  if (status === "cancelado") {
    mensagem = `❌ Olá, ${pedido?.nome_cliente || "cliente"}!

Seu pedido foi cancelado. Entre em contato conosco para mais informações.`;
  }

  if (pedido?.whatsapp_cliente) {
    const telefone = pedido.whatsapp_cliente.replace(/\D/g, "");

    window.open(
      `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`,
      "_blank"
    );
  }

  buscarPedidos();
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
  alert(JSON.stringify(error));
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

  setProdutoEditando(null);
  setNome("");
  setPreco("");
  setDescricao("");
  setCategoria("Canecas");
  setDestaque(false);
  setArquivo(null);

  buscarProdutos();
  return;
}

    const { error } = await supabase
      .from("produtos")
      .insert([
        {
  nome,
  preco: Number(preco),
  imagem: imagemUrl,
  descricao,
  categoria,
  destaque,
}
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
    setCategoria("Canecas");
    setDestaque(false);

    buscarProdutos();
  }

  function editarProduto(produto: any) {
  setProdutoEditando(produto);

  setNome(produto.nome);
  setPreco(String(produto.preco));
  setDescricao(produto.descricao || "");
  setCategoria(produto.categoria || "Canecas");
  setDestaque(produto.destaque || false);
  setArquivo(null);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
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

const pedidosFiltrados = pedidos.filter((pedido) => {
  const combinaStatus =
    filtroStatus === "todos" || pedido.status === filtroStatus;

  const textoBusca = buscaPedido.toLowerCase();

  const combinaBusca =
    String(pedido.id).includes(textoBusca) ||
    String(pedido.nome_cliente || "").toLowerCase().includes(textoBusca) ||
    String(pedido.whatsapp_cliente || "").includes(textoBusca);

  return combinaStatus && combinaBusca;
});

  return (
  <main className="min-h-screen bg-pink-50 p-10">

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

      <div className="bg-white p-6 rounded-2xl shadow">
        <p className="text-gray-500">Total de Pedidos</p>
        <h2 className="text-3xl font-bold">
          {pedidos.length}
        </h2>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
        <p className="text-gray-500">Pendentes</p>
        <h2 className="text-3xl font-bold text-yellow-500">
          {pedidos.filter((p) => p.status === "pendente").length}
        </h2>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
        <p className="text-gray-500">Aprovados</p>
        <h2 className="text-3xl font-bold text-green-500">
          {pedidos.filter((p) => p.status === "aprovado").length}
        </h2>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
        <p className="text-gray-500">Faturamento</p>
        <h2 className="text-3xl font-bold text-pink-500">
          R$ {pedidos
            .reduce((acc, pedido) => acc + Number(pedido.total), 0)
            .toFixed(2)}
        </h2>
      </div>

    </div>

    <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl shadow-xl">

      <div className="flex justify-between items-center mb-10">

        <h1 className="text-4xl font-bold text-pink-500">
          Painel Admin
          {produtoEditando && (
  <p className="text-blue-500 font-bold">
    Editando produto: {produtoEditando.nome}
  </p>
)}
        </h1>

        <button
          onClick={sair}
          className="bg-red-500 text-white px-5 py-3 rounded-2xl font-bold"
        >
          Sair
        </button>

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
    onClick={() => {
      const confirmar = confirm(
        `Deseja realmente excluir "${produto.nome}"?`
      );

      if (confirmar) {
        excluirProduto(produto.id);
      }
    }}
    className="bg-red-500 text-white px-4 py-2 rounded-xl"
  >
    Excluir
  </button>
</div>

          </div>

        ))}

      </div>

    </div>

    <div className="max-w-5xl mx-auto mt-20">

      <h2 className="text-4xl font-bold mb-8">
        Pedidos da Loja
      </h2>
      <input
  type="text"
  placeholder="Buscar por pedido, nome ou WhatsApp..."
  value={buscaPedido}
  onChange={(e) => setBuscaPedido(e.target.value)}
  className="w-full border p-4 rounded-xl mb-6"
/>
      <div className="flex gap-3 mb-8 flex-wrap">

  {["todos", "pendente", "aprovado", "enviado", "cancelado"].map((status) => (
    <button
      key={status}
      onClick={() => setFiltroStatus(status)}
      className={`px-4 py-2 rounded-xl font-bold ${
        filtroStatus === status
          ? "bg-pink-500 text-white"
          : "bg-white text-gray-700"
      }`}
    >
      {status}
    </button>
  ))}

</div>

      <div className="space-y-6">

        {pedidosFiltrados.map((pedido) => (

          <div
            key={pedido.id}
            className="bg-white p-6 rounded-2xl shadow"
          >

            <div className="flex justify-between items-center">

              <div>

                <h3 className="text-2xl font-bold">
                  Pedido #{pedido.id}
                </h3>

                <p className="text-gray-500 mt-2">
                  Cliente: {pedido.nome_cliente || pedido.cliente}
                </p>

                <p className="text-gray-500">
                  WhatsApp: {pedido.whatsapp_cliente}
                </p>

                <p className="text-gray-500">
                  Total: R$ {Number(pedido.total).toFixed(2)}
                </p>

                <p className="text-gray-500">
  Data: {new Date(pedido.created_at).toLocaleString("pt-BR")}
</p>

                <div className="mt-4">
                  <p className="font-bold">
                    Produtos:
                  </p>

                  {pedido.produtos?.map((produto: any, index: number) => (
  <div
    key={index}
    className="flex items-center gap-3 mt-2"
  >
    {produto.imagem && (
      <img
        src={produto.imagem}
        alt={produto.nome}
        className="w-14 h-14 object-cover rounded-lg"
      />
    )}

    <p className="text-gray-600">
      {produto.nome} - R$ {Number(produto.preco).toFixed(2)}
    </p>
  </div>
))}
                </div>

                <p className="mt-3 flex items-center gap-2">
  Status:

  <span
    className={`px-3 py-1 rounded-full text-white font-bold text-sm ${
      pedido.status === "pendente"
        ? "bg-yellow-500"
        : pedido.status === "aprovado"
        ? "bg-green-500"
        : pedido.status === "enviado"
        ? "bg-blue-500"
        : pedido.status === "cancelado"
        ? "bg-red-500"
        : "bg-gray-500"
    }`}
  >
    {pedido.status}
  </span>
</p>

              </div>

              <div className="flex gap-3">

                <button
                  onClick={() =>
                    atualizarStatus(
                      pedido.id,
                      "aprovado"
                    )
                  }
                  className="bg-green-500 text-white px-4 py-2 rounded-xl"
                >
                  Aprovar
                </button>

                <button
                  onClick={() =>
                    atualizarStatus(
                      pedido.id,
                      "enviado"
                    )
                  }
                  className="bg-blue-500 text-white px-4 py-2 rounded-xl"
                >
                  Enviado
                </button>

                <button
                  onClick={() =>
                    atualizarStatus(
                      pedido.id,
                      "cancelado"
                    )
                  }
                  className="bg-red-500 text-white px-4 py-2 rounded-xl"
                >
                  Cancelar
                </button>

                <button
                  onClick={() =>
                    window.open(
                      `https://wa.me/55${pedido.whatsapp_cliente}`,
                      "_blank"
                    )
                  }
                  className="bg-green-700 text-white px-4 py-2 rounded-xl"
                >
                  WhatsApp
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  </main>
);
}