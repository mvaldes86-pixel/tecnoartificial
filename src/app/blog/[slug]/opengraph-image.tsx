import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/blog";

// Tarjeta social dinámica por artículo (estilo editorial): protagonismo del
// título real, badge de categoría y CTA "Leer artículo →". Sustituye a la
// imagen genérica "nuevo-articulo.png". Se usa como preview de link
// (WhatsApp/Facebook/LinkedIn) y como imagen del auto-post en redes.
// URL estable: https://tecnoartificial.com/blog/<slug>/opengraph-image
//
// Las fuentes (Outfit display + Inter) se cargan explícitamente con el patrón
// oficial `new URL(..., import.meta.url)`: da el bold real de la marca y evita
// el bug de la fuente por defecto de @vercel/og en Windows.

export const runtime = "nodejs"; // getPostBySlug usa firebase-admin (Node)
export const alt = "Artículo del blog de TecnoArtificial";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#0A0A1F";
const INDIGO = "#6366F1";

// Las fuentes viven en assets/fonts (incluidas en el trace vía next.config.ts).
const FONT_DIR = join(process.cwd(), "assets", "fonts");
const outfit800 = readFileSync(join(FONT_DIR, "Outfit-800.ttf"));
const outfit600 = readFileSync(join(FONT_DIR, "Outfit-600.ttf"));
const inter500 = readFileSync(join(FONT_DIR, "Inter-500.ttf"));

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  const title = post?.title ?? "Nuevo artículo";
  const category = (post?.category ?? "Blog").toUpperCase();

  // Ajusta el tamaño del título según su largo para que nunca se desborde.
  const titleSize = title.length > 90 ? 52 : title.length > 60 ? 62 : 74;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          backgroundImage: `radial-gradient(circle at 88% 8%, rgba(99,102,241,0.22), transparent 45%)`,
          padding: "68px 76px",
          fontFamily: "Inter",
        }}
      >
        {/* Cabecera: monograma + marca */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 60,
              height: 60,
              borderRadius: 16,
              background: INDIGO,
              color: "#fff",
              fontSize: 30,
              fontFamily: "Outfit",
              fontWeight: 800,
            }}
          >
            TA
          </div>
          <div style={{ display: "flex", color: "#fff", fontSize: 34, fontFamily: "Outfit", fontWeight: 600 }}>
            TecnoArtificial
          </div>
        </div>

        {/* Cuerpo: categoría + título */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              alignItems: "center",
              gap: 12,
              background: "rgba(99,102,241,0.15)",
              color: INDIGO,
              fontSize: 24,
              fontFamily: "Outfit",
              fontWeight: 600,
              padding: "10px 24px",
              borderRadius: 999,
              marginBottom: 30,
            }}
          >
            {/* Punto dibujado (no un glifo) para no depender de la fuente. */}
            <div style={{ display: "flex", width: 11, height: 11, borderRadius: 999, background: INDIGO }} />
            {category}
          </div>
          <div
            style={{
              display: "flex",
              color: "#fff",
              fontSize: titleSize,
              fontFamily: "Outfit",
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: -1.5,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          <div style={{ display: "flex", width: 140, height: 6, background: INDIGO, borderRadius: 3, marginTop: 34 }} />
        </div>

        {/* Pie: dominio + CTA */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", color: "rgba(255,255,255,0.45)", fontSize: 26, fontFamily: "Inter", fontWeight: 500 }}>
            tecnoartificial.com/blog
          </div>
          <div style={{ display: "flex", alignItems: "center", color: INDIGO, fontSize: 32, fontFamily: "Outfit", fontWeight: 800 }}>
            Leer artículo →
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Outfit", data: outfit800, weight: 800, style: "normal" },
        { name: "Outfit", data: outfit600, weight: 600, style: "normal" },
        { name: "Inter", data: inter500, weight: 500, style: "normal" },
      ],
    },
  );
}
