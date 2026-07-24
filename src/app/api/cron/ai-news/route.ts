import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createPost, slugExists, getAllPosts } from "@/lib/blog";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

// ─────────────────────────────────────────────────────────────
// Agente SEO del blog. Publica 1 artículo evergreen por ejecución.
// El cron corre martes y jueves (ver vercel.json) → 2 artículos/semana.
// Enfoque: posicionar en Google con contenido útil para pymes chilenas
// que buscan IA, automatización, marketing y ciberseguridad.
// ─────────────────────────────────────────────────────────────

// Pilares/keywords sobre los que rota el agente. Ampliar libremente.
const PILARES: string[] = [
  "Agentes de IA y chatbots de WhatsApp para atención y agendamiento de clientes",
  "Automatización de procesos y tareas repetitivas con IA en pymes",
  "Marketing digital con IA: campañas en Meta (Facebook e Instagram) y generación de leads",
  "SEO e inteligencia artificial: cómo posicionar un negocio en Google",
  "Ciberseguridad para pymes: auditorías, pentesting y protección de datos (Ley 21.719 y 21.663)",
  "IA aplicada por rubro: clínicas y salud, e-commerce, inmobiliarias, servicios profesionales",
  "Desarrollo de software y apps a medida potenciadas con IA",
  "Casos de uso y ROI de la inteligencia artificial para dueños de negocio",
];

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

type GeneratedPost = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  keyword?: string;
};

function extractJsonObject(text: string): GeneratedPost {
  // Acepta un objeto suelto o el primer objeto de un array.
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Respuesta sin JSON válido");
  return JSON.parse(text.slice(start, end + 1));
}

export async function GET(req: NextRequest) {
  // Seguridad: Vercel Cron envía "Authorization: Bearer <CRON_SECRET>".
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "Falta ANTHROPIC_API_KEY" }, { status: 500 });
  }

  // Títulos ya publicados: para no repetir temas y elegir un ángulo fresco.
  const existing = await getAllPosts();
  const recentTitles = existing.slice(0, 30).map((p) => `- ${p.title}`).join("\n") || "(ninguno todavía)";
  const pilar = PILARES[Math.floor(Math.random() * PILARES.length)];

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const prompt = `Eres el editor SEO del blog de TecnoArtificial (tecnoartificial.com), una empresa chilena que ayuda a negocios y pymes con inteligencia artificial, automatización, agentes de WhatsApp, marketing digital y ciberseguridad.

OBJETIVO: escribir UN artículo evergreen optimizado para SEO que posicione en Google Chile y atraiga a dueños de negocio. No es una noticia: es contenido útil y duradero que responde a lo que la gente busca.

Ángulo/pilar sugerido para hoy (puedes afinar el enfoque, pero mantente en este tema): "${pilar}".

Artículos YA publicados (NO repitas estos temas ni títulos; elige un enfoque o keyword distinto):
${recentTitles}

REQUISITOS SEO:
- Título con la keyword principal al inicio, atractivo y claro (máx 65 caracteres).
- Empieza el artículo respondiendo la intención de búsqueda en las primeras 2 frases.
- 650-900 palabras en Markdown, con 3-4 subtítulos "##" que incluyan variantes de la keyword.
- Lenguaje simple orientado a dueños de pyme en Chile; ejemplos concretos y accionables.
- Cierra con un llamado a la acción hacia los servicios de TecnoArtificial (consultoría/diagnóstico gratis).
- No inventes estadísticas ni cifras falsas. Nada de relleno.

Devuelve ÚNICAMENTE un objeto JSON válido (sin texto extra, sin bloques de código markdown) con esta forma exacta:
{
  "title": "Título con keyword (máx 65 caracteres)",
  "slug": "titulo-en-kebab-case-sin-acentos",
  "excerpt": "Meta descripción atractiva con la keyword (máx 155 caracteres).",
  "content": "Artículo completo en Markdown (650-900 palabras, subtítulos ##).",
  "category": "Una de: Marketing IA, Automatización, Agentes IA, Ciberseguridad, SEO, Tendencias IA",
  "keyword": "keyword principal objetivo"
}`;

  let post: GeneratedPost;
  try {
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    });
    const textBlock = message.content.find((b) => b.type === "text");
    const raw = textBlock && "text" in textBlock ? textBlock.text : "";
    post = extractJsonObject(raw);
  } catch (error) {
    console.error("[ai-seo] Claude falló:", error);
    return NextResponse.json({ error: "Error generando contenido", detail: String(error) }, { status: 500 });
  }

  const slug = slugify(post.slug || post.title);
  if (!slug || !post.title || !post.content) {
    return NextResponse.json({ error: "Contenido inválido" }, { status: 500 });
  }
  if (await slugExists(slug)) {
    return NextResponse.json({ ok: true, created: [], skipped: [slug], note: "slug ya existía" });
  }

  await createPost({
    slug,
    title: post.title,
    excerpt: post.excerpt || "",
    content: post.content,
    category: post.category || "Tendencias IA",
    author: "TecnoArtificial",
  });

  return NextResponse.json({ ok: true, created: [slug], pilar });
}
