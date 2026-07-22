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

// Cabeceras de seguridad aplicadas a todas las rutas. NO se incluye una CSP
// estricta a propósito: rompería el Meta Pixel (connect.facebook.net), las
// fuentes de Google y los scripts inline (JSON-LD). El resto es seguro y no
// altera el render.
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  staticPageGenerationTimeout: 180,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
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
