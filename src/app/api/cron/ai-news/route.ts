import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createPost, slugExists } from "@/lib/blog";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

// ─────────────────────────────────────────────────────────────
// FUENTES DE NOTICIAS (editables): feeds RSS de medios creíbles.
// Agrega o quita URLs aquí. El agente lee estos feeds como material
// de origen; Claude escribe un resumen ORIGINAL en español (no copia).
// ─────────────────────────────────────────────────────────────
const RSS_FEEDS: string[] = [
  "https://www.technologyreview.com/topic/artificial-intelligence/feed/",
  "https://venturebeat.com/category/ai/feed/",
  "https://techcrunch.com/tag/artificial-intelligence/feed/",
];

const POSTS_PER_RUN = 3;
const MODEL = "claude-sonnet-4-6";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // quita acentos
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

async function fetchFeed(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; TecnoArtificialBot/1.0; +https://tecnoartificial.com)",
      },
      cache: "no-store",
    });
    if (!res.ok) return "";
    const text = await res.text();
    return text.slice(0, 9000); // recorta cada feed para no inflar el prompt
  } catch (error) {
    console.error(`[ai-news] feed falló ${url}:`, error);
    return "";
  }
}

type GeneratedPost = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  sourceName: string;
  sourceUrl: string;
};

function extractJsonArray(text: string): GeneratedPost[] {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end === -1) throw new Error("Respuesta sin JSON válido");
  return JSON.parse(text.slice(start, end + 1));
}

export async function GET(req: NextRequest) {
  // Seguridad: solo se ejecuta con el secreto correcto.
  // Vercel Cron envía automáticamente "Authorization: Bearer <CRON_SECRET>".
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Falta ANTHROPIC_API_KEY" },
      { status: 500 },
    );
  }

  // 1. Traer material de origen desde los feeds.
  const feeds = await Promise.all(RSS_FEEDS.map(fetchFeed));
  const material = feeds.filter(Boolean).join("\n\n---\n\n");
  if (!material) {
    return NextResponse.json(
      { error: "No se pudo leer ningún feed" },
      { status: 502 },
    );
  }

  // 2. Claude selecciona y redacta resúmenes originales en español.
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const prompt = `Eres el editor del blog de TecnoArtificial, una empresa chilena de inteligencia artificial que ayuda a negocios con marketing, automatización y agentes de IA.

A continuación tienes contenido crudo de feeds RSS de noticias de IA:

${material}

Tarea: elige las ${POSTS_PER_RUN} noticias MÁS relevantes e interesantes para dueños de negocios y pymes en Chile/Latinoamérica. Para cada una, escribe un artículo ORIGINAL en español (NO copies el texto original; resume y aporta el ángulo de negocio de TecnoArtificial).

Devuelve ÚNICAMENTE un array JSON válido (sin texto extra, sin markdown de código) con exactamente ${POSTS_PER_RUN} objetos con esta forma:
[
  {
    "title": "Título atractivo y claro en español (max 70 caracteres)",
    "slug": "titulo-en-kebab-case-sin-acentos",
    "excerpt": "Resumen de 1-2 frases (max 160 caracteres).",
    "content": "Artículo en Markdown de 250-350 palabras. Usa 1-2 subtítulos con ##. Explica la noticia y POR QUÉ le importa a una empresa, con un cierre que conecte con servicios de IA. No inventes datos.",
    "category": "Una de: Marketing IA, Automatización, Agentes IA, Tendencias IA",
    "sourceName": "Nombre del medio de origen",
    "sourceUrl": "URL del artículo original"
  }
]`;

  let generated: GeneratedPost[];
  try {
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    });
    const textBlock = message.content.find((b) => b.type === "text");
    const raw = textBlock && "text" in textBlock ? textBlock.text : "";
    generated = extractJsonArray(raw);
  } catch (error) {
    console.error("[ai-news] Claude falló:", error);
    return NextResponse.json(
      { error: "Error generando contenido", detail: String(error) },
      { status: 500 },
    );
  }

  // 3. Guardar en Firestore (omitiendo slugs que ya existen).
  const created: string[] = [];
  const skipped: string[] = [];
  for (const post of generated) {
    const slug = slugify(post.slug || post.title);
    if (!slug || !post.title || !post.content) continue;
    if (await slugExists(slug)) {
      skipped.push(slug);
      continue;
    }
    await createPost({
      slug,
      title: post.title,
      excerpt: post.excerpt || "",
      content: post.content,
      category: post.category || "Tendencias IA",
      sourceName: post.sourceName,
      sourceUrl: post.sourceUrl,
      author: "TecnoArtificial",
    });
    created.push(slug);
  }

  return NextResponse.json({ ok: true, created, skipped });
}
