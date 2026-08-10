import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import "./globals.css";

import { CarrinhoProvider } from "@/app/context/CarrinhoContext";
import ThemeProvider from "@/components/theme/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lembrei de Você Store",
  description:
    "Presentes personalizados, produtos físicos e arquivos digitais para tornar momentos especiais ainda mais inesquecíveis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning={true}
        className="flex min-h-full flex-col"
      >
        <ThemeProvider>
          <CarrinhoProvider>
            {children}
          </CarrinhoProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}