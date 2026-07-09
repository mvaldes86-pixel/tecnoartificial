import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Cpu, ArrowLeft, ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

export const revalidate = 600;
export const dynamicParams = true;

type Params = { slug: string };

// Prerenderiza los artículos existentes; los nuevos (del agente) se generan
// on-demand gracias a dynamicParams = true.
export async function generateStaticParams(): Promise<Params[]> {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Artículo no encontrado — TecnoArtificial" };

  return {
    title: `${post.title} | TecnoArtificial`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `https://tecnoartificial.com/blog/${post.slug}`,
      siteName: "TecnoArtificial",
      locale: "es_CL",
      publishedTime: post.publishedAt,
    },
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  // Datos estructurados: ayuda a Google a mostrar el artículo como resultado enriquecido.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    inLanguage: "es-CL",
    author: { "@type": "Organization", name: post.author || "TecnoArtificial" },
    publisher: {
      "@type": "Organization",
      name: "TecnoArtificial",
      url: "https://tecnoartificial.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://tecnoartificial.com/blog/${post.slug}`,
    },
  };

  return (
    <main className="min-h-screen bg-[#0A0A1F] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="border-b border-white/5 px-6 py-5">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <Cpu className="w-5 h-5 text-primary" />
            <span className="font-display font-bold">TecnoArtificial</span>
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al blog
          </Link>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-14">
        <div className="flex items-center gap-3 text-sm mb-5">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">
            {post.category}
          </span>
          <span className="text-white/30">{formatDate(post.publishedAt)}</span>
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-black leading-tight mb-8">
          {post.title}
        </h1>

        <div className="space-y-5 text-white/75 leading-relaxed text-[17px]">
          <ReactMarkdown
            components={{
              h2: (props) => (
                <h2
                  className="font-display text-2xl font-bold text-white mt-10 mb-4"
                  {...props}
                />
              ),
              h3: (props) => (
                <h3
                  className="font-display text-xl font-bold text-white mt-8 mb-3"
                  {...props}
                />
              ),
              p: (props) => <p className="mb-5" {...props} />,
              ul: (props) => (
                <ul className="mb-5 space-y-2 list-disc list-inside" {...props} />
              ),
              ol: (props) => (
                <ol className="mb-5 space-y-2 list-decimal list-inside" {...props} />
              ),
              strong: (props) => (
                <strong className="text-white font-semibold" {...props} />
              ),
              a: (props) => (
                <a
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              ),
              blockquote: (props) => (
                <blockquote
                  className="border-l-4 border-primary/50 pl-4 italic text-white/60 my-6"
                  {...props}
                />
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {post.sourceUrl && (
          <div className="mt-10 rounded-xl border border-white/10 bg-white/[0.02] p-5 text-sm text-white/50">
            Fuente:{" "}
            <a
              href={post.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              {post.sourceName || post.sourceUrl}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        <div className="mt-14 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
          <h3 className="font-display text-xl font-bold mb-2">
            ¿Quieres aplicar IA en tu empresa?
          </h3>
          <p className="text-white/60 mb-5">
            Agenda una consultoría gratuita con nuestro equipo.
          </p>
          <a
            href="https://wa.me/56920293667"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary hover:bg-primary/80 text-white px-7 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
          >
            Hablar por WhatsApp
          </a>
        </div>
      </article>
    </main>
  );
}
