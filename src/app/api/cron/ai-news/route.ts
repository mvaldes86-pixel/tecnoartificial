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

// Esquema de la herramienta: la API entrega `tool_use.input` YA parseado como
// objeto, así que el Markdown largo del `content` (con comillas y saltos de
// línea) nunca rompe el parseo — a diferencia de pedir un JSON en texto libre,
// que fallaba de forma intermitente con "SyntaxError ... in JSON".
const ARTICLE_TOOL = {
  name: "publicar_articulo",
  description: "Registra el artículo de blog SEO generado.",
  input_schema: {
    type: "object" as const,
    properties: {
      title: { type: "string", description: "Título con la keyword al inicio (máx 65 caracteres)." },
      slug: { type: "string", description: "Slug en kebab-case sin acentos." },
      excerpt: { type: "string", description: "Meta descripción con la keyword (máx 155 caracteres)." },
      content: { type: "string", description: "Artículo completo en Markdown (650-900 palabras, subtítulos ##)." },
      category: { type: "string", description: "Una de: Marketing IA, Automatización, Agentes IA, Ciberseguridad, SEO, Tendencias IA." },
      keyword: { type: "string", description: "Keyword principal objetivo." },
    },
    required: ["title", "slug", "excerpt", "content", "category"],
  },
};

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

  // Candado idempotente: publica como máximo 1 artículo por día (UTC), sin
  // importar cuántos disparadores lo llamen (cron de Vercel + GitHub Action).
  // Si ya hay un post de hoy, no genera otro y devuelve ese último (para que
  // el GitHub Action registre el post correcto en el repo).
  const newest = existing[0];
  const today = new Date().toISOString().slice(0, 10);
  if (newest && newest.publishedAt && newest.publishedAt.slice(0, 10) === today) {
    const url = `https://tecnoartificial.com/blog/${newest.slug}`;
    return NextResponse.json({
      ok: true,
      created: [],
      skipped: [newest.slug],
      slug: newest.slug,
      title: newest.title,
      url,
      note: "ya se publicó hoy",
    });
  }

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

Entrega el artículo llamando a la herramienta "publicar_articulo" con todos sus campos.`;

  let post: GeneratedPost;
  try {
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4000,
      tools: [ARTICLE_TOOL],
      tool_choice: { type: "tool", name: ARTICLE_TOOL.name },
      messages: [{ role: "user", content: prompt }],
    });
    const toolBlock = message.content.find((b) => b.type === "tool_use");
    if (!toolBlock || toolBlock.type !== "tool_use") {
      throw new Error("La respuesta no incluyó tool_use");
    }
    // La API entrega `input` ya parseado como objeto — sin JSON.parse frágil.
    post = toolBlock.input as GeneratedPost;
  } catch (error) {
    console.error("[ai-seo] Claude falló:", error);
    return NextResponse.json({ error: "Error generando contenido", detail: String(error) }, { status: 500 });
  }

  const slug = slugify(post.slug || post.title);
  if (!slug || !post.title || !post.content) {
    return NextResponse.json({ error: "Contenido inválido" }, { status: 500 });
  }
  const url = `https://tecnoartificial.com/blog/${slug}`;
  if (await slugExists(slug)) {
    return NextResponse.json({ ok: true, created: [], skipped: [slug], slug, title: post.title, url, note: "slug ya existía" });
  }

  await createPost({
    slug,
    title: post.title,
    excerpt: post.excerpt || "",
    content: post.content,
    category: post.category || "Tendencias IA",
    author: "TecnoArtificial",
  });

  // Devolvemos slug/title/url para que el GitHub Action registre el último
  // post en el repo (lo lee la routine de redes, que no puede leer el sitio).
  return NextResponse.json({ ok: true, created: [slug], slug, title: post.title, url, pilar });
}
