import type { NextConfig } from "next";

// Rutas HTML que NO deben quedar cacheadas a largo plazo en el CDN.
// (Por defecto Next marca las páginas estáticas con s-maxage=31536000 asumiendo
//  que la plataforma purga el CDN en cada deploy. Hostinger NO lo purga, así que
//  los edges servían HTML viejo apuntando a hashes de CSS ya borrados -> 404 ->
//  página sin estilo. Forzamos revalidación para que el HTML siempre sea el actual.)
const htmlPages = ["/", "/nosotros", "/consultoria", "/privacidad", "/terminos"];

const freshHtmlHeaders = [
  { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
];

const nextConfig: NextConfig = {
  staticPageGenerationTimeout: 180,
  async headers() {
    return [
      ...htmlPages.map((source) => ({ source, headers: freshHtmlHeaders })),
      {
        // Los assets con hash de contenido sí se cachean para siempre (es seguro).
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
