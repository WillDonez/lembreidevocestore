"use client";

import {
  ReactNode,
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

type TemaLoja = {
  primary_color: string;
  primary_light_color: string;
  secondary_color: string;
  accent_color: string;
  success_color: string;
  warning_color: string;
  danger_color: string;
  background_color: string;
  card_color: string;
  text_color: string;
  text_light_color: string;
  border_color: string;
};

type ThemeProviderProps = {
  children: ReactNode;
};

const temaPadrao: TemaLoja = {
  primary_color: "#1E3A5F",
  primary_light_color: "#2D527F",
  secondary_color: "#D4AF37",
  accent_color: "#FF6B6B",
  success_color: "#22C55E",
  warning_color: "#F59E0B",
  danger_color: "#EF4444",
  background_color: "#FAFAFA",
  card_color: "#FFFFFF",
  text_color: "#1F2937",
  text_light_color: "#6B7280",
  border_color: "#E5E7EB",
};

function aplicarTema(
  tema: TemaLoja,
) {
  const raiz =
    document.documentElement;

  raiz.style.setProperty(
    "--primary",
    tema.primary_color,
  );

  raiz.style.setProperty(
    "--primary-light",
    tema.primary_light_color,
  );

  raiz.style.setProperty(
    "--secondary",
    tema.secondary_color,
  );

  raiz.style.setProperty(
    "--accent",
    tema.accent_color,
  );

  raiz.style.setProperty(
    "--success",
    tema.success_color,
  );

  raiz.style.setProperty(
    "--warning",
    tema.warning_color,
  );

  raiz.style.setProperty(
    "--danger",
    tema.danger_color,
  );

  raiz.style.setProperty(
    "--background",
    tema.background_color,
  );

  raiz.style.setProperty(
    "--foreground",
    tema.text_color,
  );

  raiz.style.setProperty(
    "--card",
    tema.card_color,
  );

  raiz.style.setProperty(
    "--text",
    tema.text_color,
  );

  raiz.style.setProperty(
    "--text-light",
    tema.text_light_color,
  );

  raiz.style.setProperty(
    "--border",
    tema.border_color,
  );
}

export default function ThemeProvider({
  children,
}: ThemeProviderProps) {
  const [
    temaCarregado,
    setTemaCarregado,
  ] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function carregarTema() {
      try {
        const {
          data,
          error,
        } = await supabase
          .from(
            "configuracoes_tema",
          )
          .select(
            `
              primary_color,
              primary_light_color,
              secondary_color,
              accent_color,
              success_color,
              warning_color,
              danger_color,
              background_color,
              card_color,
              text_color,
              text_light_color,
              border_color
            `,
          )
          .eq("ativo", true)
          .order("id", {
            ascending: true,
          })
          .limit(1)
          .maybeSingle();

        if (error) {
          throw error;
        }

        const tema =
          data
            ? {
                ...temaPadrao,
                ...data,
              }
            : temaPadrao;

        aplicarTema(tema);
      } catch (error) {
        console.error(
          "Erro ao carregar tema da loja:",
          error,
        );

        aplicarTema(
          temaPadrao,
        );
      } finally {
        if (ativo) {
          setTemaCarregado(true);
        }
      }
    }

    void carregarTema();

    return () => {
      ativo = false;
    };
  }, []);

  return (
    <>
      {children}

      {!temaCarregado && (
        <span
          aria-hidden="true"
          className="hidden"
        />
      )}
    </>
  );
}