import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { erro: "Usuário não autenticado." },
        { status: 401 }
      );
    }

    const accessToken = authorization.replace("Bearer ", "").trim();

    const {
      data: { user },
      error: usuarioErro,
    } = await supabaseAdmin.auth.getUser(accessToken);

    if (usuarioErro || !user) {
      return NextResponse.json(
        { erro: "Sessão inválida ou expirada." },
        { status: 401 }
      );
    }

    const { data: perfil, error: perfilErro } = await supabaseAdmin
      .from("clientes")
      .select("role")
      .eq("auth_user_id", user.id)
      .single();

    if (perfilErro || !perfil || perfil.role !== "admin") {
      return NextResponse.json(
        { erro: "Acesso permitido somente para administradores." },
        { status: 403 }
      );
    }

    const [
      produtosResultado,
      categoriasResultado,
      pedidosResultado,
      clientesResultado,
    ] = await Promise.all([
      supabaseAdmin.from("produtos").select("*"),
      supabaseAdmin.from("categorias").select("*"),
      supabaseAdmin.from("pedidos").select("*"),
      supabaseAdmin
        .from("clientes")
        .select(
          "id, nome, email, whatsapp, cidade, estado, created_at, role"
        ),
    ]);

    const erro =
      produtosResultado.error ||
      categoriasResultado.error ||
      pedidosResultado.error ||
      clientesResultado.error;

    if (erro) {
      console.error("Erro ao carregar dashboard administrativo:", erro);

      return NextResponse.json(
        { erro: "Não foi possível carregar os dados do painel." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      produtos: produtosResultado.data || [],
      categorias: categoriasResultado.data || [],
      pedidos: pedidosResultado.data || [],
      clientes: clientesResultado.data || [],
    });
  } catch (error) {
    console.error("Erro interno no dashboard administrativo:", error);

    return NextResponse.json(
      { erro: "Ocorreu um erro interno no painel administrativo." },
      { status: 500 }
    );
  }
}