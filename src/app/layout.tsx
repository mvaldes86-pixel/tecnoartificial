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
  openGraph: {
    title: "TecnoArtificial | Evoluciona tu Negocio con IA",
    description: "Optimizamos tus procesos y escalamos tus ventas con tecnología de IA de última generación.",
    type: "website",
    locale: "es_CL",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0A0A1F] text-white">
        {children}
      </body>
    </html>
  );
}

