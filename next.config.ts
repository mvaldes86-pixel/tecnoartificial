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

// Content-Security-Policy pragmática. Mantiene 'unsafe-inline' en script/style
// porque el sitio usa JSON-LD y estilos inline (una CSP con nonces exigiría
// reescribir bastante en un sitio casi estático); a cambio SÍ bloquea cargar
// scripts desde orígenes no autorizados, y cierra object/base/frame-ancestors.
// Allowlist del Meta Pixel: connect.facebook.net (script) + www.facebook.com
// (pixel img/tr y conexiones). Las fuentes las auto-hospeda Next (next/font) → 'self'.
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' https://connect.facebook.net",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://www.facebook.com https://connect.facebook.net",
  "frame-src 'self' https://www.facebook.com",
  "upgrade-insecure-requests",
].join('; ');

// Cabeceras de seguridad aplicadas a todas las rutas.
const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
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
