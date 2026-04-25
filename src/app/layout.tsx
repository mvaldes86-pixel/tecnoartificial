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
  title: "TecnoArtificial | Marketing, Eficiencia y Seguridad con IA",
  description: "Potenciamos tu negocio con marketing de alta conversión, eficiencia operacional mediante agentes autónomos y seguridad inteligente con visión artificial.",
  keywords: ["IA", "Inteligencia Artificial", "Marketing IA", "Eficiencia Operacional", "Seguridad Inteligente", "Visión Artificial", "Automatización", "Agentes Autónomos"],
  generator: "TecnoArtificial Build 2026.04.11.03",

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
    <html lang="es" className={`${outfit.variable} ${inter.variable}`}>
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
      </head>
      <body className="antialiased">
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1428411498841708&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {children}

        {/* Botón WhatsApp Flotante */}
        <a 
          id="whatsapp-trigger"
          href="https://wa.me/56929510388" 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-8 right-8 z-[999] bg-[#25D366] p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all group opacity-100 visible"
          style={{ zIndex: 9999, display: 'flex' }}
          aria-label="Contactar por WhatsApp"
        >
          <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.483 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.308 1.656zm17.51-17.75c-1.637-1.638-3.812-2.54-6.124-2.541-4.782 0-8.674 3.891-8.676 8.673-.001 1.748.52 3.418 1.499 4.864l-.161-.274-1.076 3.931 4.026-1.056-.252.149c1.378.816 2.949 1.244 4.558 1.245 4.783 0 8.675-3.891 8.677-8.674.001-2.316-.902-4.492-2.541-6.118z"/>
          </svg>
          <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-black px-4 py-2 rounded-xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
            ¡Hablemos por WhatsApp!
          </span>
        </a>

      </body>

    </html>
  );
}
