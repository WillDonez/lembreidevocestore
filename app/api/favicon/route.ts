import {
  NextRequest,
  NextResponse,
} from "next/server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: NextRequest,
) {
  try {
    const {
      data,
      error,
    } = await supabaseAdmin
      .from("configuracoes_loja")
      .select(
        `
          favicon_url,
          updated_at
        `,
      )
      .eq("ativo", true)
      .order("id", {
        ascending: true,
      })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(
        "Erro ao carregar favicon da loja:",
        error,
      );
    }

    const faviconUrl =
      data?.favicon_url?.trim();

    if (faviconUrl) {
      const destino =
        new URL(faviconUrl);

      if (data?.updated_at) {
        destino.searchParams.set(
          "v",
          String(
            new Date(
              data.updated_at,
            ).getTime(),
          ),
        );
      }

      const resposta =
        NextResponse.redirect(
          destino,
          307,
        );

      resposta.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, max-age=0",
      );

      resposta.headers.set(
        "Pragma",
        "no-cache",
      );

      resposta.headers.set(
        "Expires",
        "0",
      );

      return resposta;
    }

    const fallback =
      new URL(
        "/logo.png",
        request.nextUrl.origin,
      );

    const resposta =
      NextResponse.redirect(
        fallback,
        307,
      );

    resposta.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, max-age=0",
    );

    resposta.headers.set(
      "Pragma",
      "no-cache",
    );

    resposta.headers.set(
      "Expires",
      "0",
    );

    return resposta;
  } catch (error) {
    console.error(
      "Erro interno ao carregar favicon da loja:",
      error,
    );

    const fallback =
      new URL(
        "/logo.png",
        request.nextUrl.origin,
      );

    return NextResponse.redirect(
      fallback,
      307,
    );
  }
}