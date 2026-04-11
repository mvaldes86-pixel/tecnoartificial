import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import Script from "next/script";
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
  generator: "TecnoArtificial Build 2026.04.11.02",
  openGraph: {
    title: "TecnoArtificial | Evoluciona tu Negocio con IA",
    description: "Optimizamos tus procesos y escalamos tus ventas con tecnología de IA de última generación.",
    type: "website",
    locale: "es_CL",
    url: "https://tecnoartificial.com",
    siteName: "TecnoArtificial",
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
      className={`${outfit.variable} ${inter.variable}`}
      style={{ backgroundColor: '#0A0A1F', color: '#FFFFFF', margin: 0, padding: 0 }}
    >
      <head>
        <Script id="facebook-pixel" strategy="lazyOnload">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1428411498841708');
            fbq('track', 'PageView');
          `}
        </Script>
        <style dangerouslySetInnerHTML={{ __html: `
          html, body { background-color: #0A0A1F !important; color: white !important; min-height: 100%; margin: 0; }
          * { box-sizing: border-box; }
          a { color: #6366F1; }
          svg { max-width: 50px !important; height: auto !important; }
        `}} />
      </head>
      <body style={{ backgroundColor: '#0A0A1F', color: '#FFFFFF' }} className="antialiased">
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1428411498841708&ev=PageView&noscript=1"
          />
        </noscript>
        {children}

      </body>
    </html>
  );
}
