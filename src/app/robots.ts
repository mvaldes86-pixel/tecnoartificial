import type { MetadataRoute } from "next";

const BASE_URL = "https://tecnoartificial.com";

// Le indica a los buscadores qué pueden rastrear y dónde está el sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
