import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

// Colección de Firestore donde viven los artículos del blog.
export const BLOG_COLLECTION = "blog_posts";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown
  category: string;
  sourceName?: string; // Medio de origen (para noticias del agente)
  sourceUrl?: string; // Link a la fuente original
  author: string;
  publishedAt: string; // ISO string (serializable para el cliente)
};

type BlogPostDoc = Omit<BlogPost, "publishedAt"> & {
  publishedAt?: Timestamp | null;
  status?: string;
};

function toPost(data: BlogPostDoc): BlogPost {
  const published =
    data.publishedAt instanceof Timestamp
      ? data.publishedAt.toDate().toISOString()
      : new Date().toISOString();
  return {
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    category: data.category,
    sourceName: data.sourceName,
    sourceUrl: data.sourceUrl,
    author: data.author,
    publishedAt: published,
  };
}

// Devuelve todos los artículos publicados, del más nuevo al más antiguo.
// Envuelto en try/catch para que un fallo/ausencia de credenciales nunca
// rompa el build (devuelve lista vacía).
export async function getAllPosts(): Promise<BlogPost[]> {
  const db = getAdminDb();
  if (!db) return [];
  try {
    const snap = await db
      .collection(BLOG_COLLECTION)
      .where("status", "==", "published")
      .orderBy("publishedAt", "desc")
      .get();
    return snap.docs.map((d) => toPost(d.data() as BlogPostDoc));
  } catch (error) {
    console.error("[blog] getAllPosts falló:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const db = getAdminDb();
  if (!db) return null;
  try {
    const snap = await db
      .collection(BLOG_COLLECTION)
      .where("slug", "==", slug)
      .limit(1)
      .get();
    if (snap.empty) return null;
    return toPost(snap.docs[0].data() as BlogPostDoc);
  } catch (error) {
    console.error(`[blog] getPostBySlug(${slug}) falló:`, error);
    return null;
  }
}

export async function slugExists(slug: string): Promise<boolean> {
  const db = getAdminDb();
  if (!db) return false;
  const snap = await db
    .collection(BLOG_COLLECTION)
    .where("slug", "==", slug)
    .limit(1)
    .get();
  return !snap.empty;
}

// Crea un artículo. La usa el agente de noticias (cron). Lanza si no hay credenciales.
export async function createPost(
  post: Omit<BlogPost, "publishedAt"> & { status?: string },
): Promise<void> {
  const db = getAdminDb();
  if (!db) throw new Error("Firestore Admin no inicializado (falta FIREBASE_SERVICE_ACCOUNT_KEY)");
  await db.collection(BLOG_COLLECTION).add({
    ...post,
    status: post.status ?? "published",
    publishedAt: FieldValue.serverTimestamp(),
  });
}
