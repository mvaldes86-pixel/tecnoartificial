import Link from "next/link";
import type { Metadata } from "next";
import { Cpu, ArrowRight, Newspaper } from "lucide-react";
import { getAllPosts } from "@/lib/blog";

// Revalidación incremental: la página se regenera cada 10 min, así aparecen
// los artículos nuevos que publica el agente sin necesidad de re-desplegar.
export const revalidate = 600;

export const metadata: Metadata = {
  title: "Blog de IA para Empresas | TecnoArtificial",
  description:
    "Noticias, guías y análisis sobre inteligencia artificial aplicada a negocios: marketing con IA, agentes autónomos, automatización y más. Actualizado cada semana.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog de IA para Empresas | TecnoArtificial",
    description:
      "Noticias, guías y análisis sobre IA aplicada a negocios. Actualizado cada semana.",
    type: "website",
    url: "https://tecnoartificial.com/blog",
    siteName: "TecnoArtificial",
    locale: "es_CL",
  },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <main className="min-h-screen bg-[#0A0A1F] text-white">
      <header className="border-b border-white/5 px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <Cpu className="w-5 h-5 text-primary" />
            <span className="font-display font-bold">TecnoArtificial</span>
          </Link>
          <Link
            href="/#servicios"
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            Servicios
          </Link>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 pt-16 pb-10">
        <div className="inline-flex items-center gap-2 text-primary text-sm font-bold mb-4">
          <Newspaper className="w-4 h-4" />
          BLOG
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-black mb-4">
          Inteligencia Artificial para tu negocio
        </h1>
        <p className="text-white/60 text-lg max-w-2xl">
          Noticias, guías y análisis sobre IA aplicada: marketing de alta
          conversión, agentes autónomos, automatización y seguridad inteligente.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24">
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center text-white/50">
            <p className="text-lg">Pronto publicaremos nuestros primeros artículos. 🚀</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-7 hover:border-primary/40 hover:bg-white/[0.04] transition-all"
              >
                <div className="flex items-center gap-3 text-xs mb-4">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                    {post.category}
                  </span>
                  <span className="text-white/30">{formatDate(post.publishedAt)}</span>
                </div>
                <h2 className="font-display text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-white/60 text-sm leading-relaxed flex-1">
                  {post.excerpt}
                </p>
                <span className="inline-flex items-center gap-2 text-primary text-sm font-bold mt-5">
                  Leer artículo
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-white/5 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-white/30 text-sm">
          <p>© 2026 TecnoArtificial SpA.</p>
          <Link href="/" className="hover:text-white/60 transition-colors">
            Volver al inicio
          </Link>
        </div>
      </footer>
    </main>
  );
}
