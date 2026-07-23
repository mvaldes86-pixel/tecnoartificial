import { NextRequest, NextResponse } from "next/server";
import { createPost, slugExists } from "@/lib/blog";

export const dynamic = "force-dynamic";

// Publicación MANUAL de un artículo del blog (para posts propios, no de RSS).
// Protegido con CRON_SECRET. Body JSON: { slug, title, excerpt, content,
// category, sourceName?, sourceUrl?, author? }. Usa el Admin SDK vía createPost.
export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: Record<string, string> | null = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { slug, title, excerpt, content, category, sourceName, sourceUrl, author } =
    body ?? {};

  if (!slug || !title || !content) {
    return NextResponse.json(
      { error: "Faltan campos: slug, title y content son obligatorios." },
      { status: 400 },
    );
  }

  if (await slugExists(slug)) {
    return NextResponse.json({ ok: true, skipped: slug });
  }

  await createPost({
    slug,
    title,
    excerpt: excerpt ?? "",
    content,
    category: category ?? "Novedades",
    sourceName,
    sourceUrl,
    author: author ?? "TecnoArtificial",
  });

  return NextResponse.json({ ok: true, created: slug });
}
