import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TecnoArtificial | Optimización de Procesos con IA y Automatización",
  description: "Lideramos la transformación digital con agentes de inteligencia artificial. Optimizamos procesos y creamos campañas de venta automatizadas para escalar tu negocio.",
  keywords: ["IA", "Inteligencia Artificial", "Optimización de Procesos", "Ventas IA", "Automatización", "Agentes Autónomos"],
  authors: [{ name: "TecnoArtificial" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${outfit.variable} ${inter.variable}`}
      style={{ backgroundColor: '#0A0A1F', color: '#FFFFFF', margin: 0, padding: 0 }}
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          html, body { background-color: #0A0A1F !important; color: white !important; min-height: 100%; margin: 0; }
          * { box-sizing: border-box; }
          a { color: #6366F1; }
          svg { max-width: 50px !important; height: auto !important; }
        `}} />
      </head>
      <body style={{ backgroundColor: '#0A0A1F', color: '#FFFFFF' }} className="antialiased">
        {children}
      </body>
    </html>
  );
}
