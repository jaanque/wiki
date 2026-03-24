import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import "./globals.css";
import SearchHeader from "@/components/SearchHeader";
import Sidebar from "@/components/Sidebar";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "AI_Wiki DB | Base de datos técnica de Modelos IA",
  description: "Directorio técnico enciclopédico de Modelos de Inteligencia Artificial, Hardware y conceptos clave.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className="h-full">
        {/* TOP HEADER (Suspense needed for useSearchParams) */}
        <Suspense fallback={<div className="top-header h-[50px]">Cargando buscador...</div>}>
          <SearchHeader />
        </Suspense>

        <div className="main-wrapper">
          {/* SIDEBAR */}
          <Sidebar />

          {/* MAIN CONTENT AREA */}
          <main className="content-right flex-1 overflow-y-auto">
            <div className="content-inner">
              <Breadcrumbs />
              {children}
              
              <div className="adsense-horizontal">
                [ ADSENSE - BOTTOM BANNER (728x90) ]
              </div>
            </div>
            
            <footer className="wiki-footer">
              <div className="content-inner">
                <div className="footer-content">
                  <p>AI_Wiki DB - {new Date().getFullYear()} | Directorio técnico de código abierto para desarrolladores e investigadores.</p>
                  <div className="footer-links">
                    <Link href="/legal">Aviso Legal</Link>
                    <Link href="/privacidad">Política de Privacidad</Link>
                    <Link href="/cookies">Configuración de Cookies</Link>
                    <Link href="/donar">Donar al Proyecto</Link>
                  </div>
                </div>
              </div>
            </footer>
          </main>
        </div>
      </body>
    </html>
  );
}
