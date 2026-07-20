import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

async function vincularPedidosDoCliente(
  email: string,
  authUserId: string
) {
  const { data, error } = await supabaseAdmin
    .from("pedidos")
    .update({
      auth_user_id: authUserId,
    })
    .ilike("email_cliente", email)
    .is("auth_user_id", null)
    .select("id");

  if (error) {
    throw error;
  }

  return data?.length || 0;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const nome = String(body.nome || "").trim();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();

    const authUserId = String(
      body.authUserId || ""
    ).trim();

    if (!nome || !email || !authUserId) {
      return NextResponse.json(
        {
          error:
            "Nome, e-mail e usuário autenticado são obrigatórios.",
        },
        {
          status: 400,
        }
      );
    }

    /*
      Confirma no Supabase Authentication que o usuário
      realmente existe e pertence ao e-mail informado.
    */
    const {
      data: dadosUsuario,
      error: erroUsuario,
    } =
      await supabaseAdmin.auth.admin.getUserById(
        authUserId
      );

    if (
      erroUsuario ||
      !dadosUsuario.user ||
      !dadosUsuario.user.email
    ) {
      console.error(
        "Usuário não localizado no Authentication:",
        erroUsuario
      );

      return NextResponse.json(
        {
          error:
            "Não foi possível confirmar a conta criada.",
        },
        {
          status: 400,
        }
      );
    }

    const emailAuthentication =
      dadosUsuario.user.email
        .trim()
        .toLowerCase();

    if (emailAuthentication !== email) {
      return NextResponse.json(
        {
          error:
            "O e-mail informado não pertence à conta criada.",
        },
        {
          status: 403,
        }
      );
    }

    /*
      Procura o cadastro comercial do cliente.
      O order + limit protege contra registros antigos duplicados.
    */
    const {
      data: clientesEncontrados,
      error: erroBusca,
    } = await supabaseAdmin
      .from("clientes")
      .select("id, auth_user_id")
      .eq("email", email)
      .order("id", { ascending: false })
      .limit(1);

    if (erroBusca) {
      console.error(
        "Erro ao localizar cliente:",
        erroBusca
      );

      return NextResponse.json(
        {
          error:
            "Não foi possível localizar o cadastro do cliente.",
        },
        {
          status: 500,
        }
      );
    }

    const clienteExistente =
      clientesEncontrados?.[0] || null;

    if (clienteExistente) {
      /*
        Impede que uma conta já vinculada a outro usuário
        seja sobrescrita.
      */
      if (
        clienteExistente.auth_user_id &&
        clienteExistente.auth_user_id !== authUserId
      ) {
        return NextResponse.json(
          {
            error:
              "Este cadastro já está vinculado a outra conta.",
          },
          {
            status: 409,
          }
        );
      }

      const {
        data: clienteAtualizado,
        error: erroAtualizacao,
      } = await supabaseAdmin
        .from("clientes")
        .update({
          nome,
          email,
          auth_user_id: authUserId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", clienteExistente.id)
        .select("id, nome, email, auth_user_id")
        .single();

      if (erroAtualizacao) {
        console.error(
          "Erro ao vincular cliente:",
          erroAtualizacao
        );

        return NextResponse.json(
          {
            error:
              "Não foi possível vincular o cadastro do cliente.",
          },
          {
            status: 500,
          }
        );
      }

      let pedidosVinculados = 0;

try {
  pedidosVinculados =
    await vincularPedidosDoCliente(
      email,
      authUserId
    );
} catch (error) {
  console.error(
    "Cliente vinculado, mas os pedidos falharam:",
    error
  );

  return NextResponse.json(
    {
      error:
        "A conta foi vinculada, mas não foi possível vincular os pedidos.",
    },
    {
      status: 500,
    }
  );
}

let pedidosVinculadosNovoCliente = 0;

try {
  pedidosVinculadosNovoCliente =
  await vincularPedidosDoCliente(
    email,
    authUserId
  );
} catch (error) {
  console.error(
    "Cliente vinculado, mas os pedidos falharam:",
    error
  );

  return NextResponse.json(
    {
      error:
        "A conta foi vinculada, mas não foi possível vincular os pedidos.",
    },
    {
      status: 500,
    }
  );
}

      return NextResponse.json({
  success: true,
  clienteCriado: false,
  pedidosVinculados,
  cliente: clienteAtualizado,
});
    }

    /*
      Só cria uma nova linha quando realmente não existe
      cadastro comercial com esse e-mail.
    */
    const {
      data: clienteCriado,
      error: erroCriacao,
    } = await supabaseAdmin
      .from("clientes")
      .insert({
        nome,
        email,
        auth_user_id: authUserId,
      })
      .select("id, nome, email, auth_user_id")
      .single();

    if (erroCriacao) {
      console.error(
        "Erro ao criar cliente:",
        erroCriacao
      );

      return NextResponse.json(
        {
          error:
            "Não foi possível criar o cadastro do cliente.",
        },
        {
          status: 500,
        }
      );
    }

    let pedidosVinculadosNovoCliente = 0;

try {
  pedidosVinculadosNovoCliente =
    await vincularPedidosDoCliente(
      email,
      authUserId
    );
} catch (error) {
  console.error(
    "Cliente criado, mas os pedidos falharam:",
    error
  );

  return NextResponse.json(
    {
      error:
        "A conta foi criada, mas não foi possível vincular os pedidos.",
    },
    {
      status: 500,
    }
  );
}

return NextResponse.json({
  success: true,
  clienteCriado: true,
  pedidosVinculados:
    pedidosVinculadosNovoCliente,
  cliente: clienteCriado,
});
  } catch (error) {
    console.error(
      "Erro na API de vinculação:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Erro interno ao vincular o cliente.",
      },
      {
        status: 500,
      }
    );
  }
}