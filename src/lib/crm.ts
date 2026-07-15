import { getAdminDb } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

// Colecciones que escribe el bot de WhatsApp (ver src/app/api/whatsapp/webhook/route.ts)
export const LEADS_COLLECTION = "whatsapp_leads";
export const CONVERSATIONS_COLLECTION = "whatsapp_conversations";

export type CrmLead = {
  telefono: string;
  nombre: string;
  empresa: string;
  industria: string;
  desafio: string;
  presupuesto: string;
  urgencia: string;
  score: number;
  fase: string;
  derivado: boolean;
  updatedAt: string | null; // ISO string, serializable
};

export type CrmMessage = {
  role: "user" | "assistant";
  content: string;
};

export type CrmStats = {
  total: number;
  derivados: number;
  calificados: number; // score >= 50
  scorePromedio: number;
  leadsHoy: number;
};

function toIso(value: unknown): string | null {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toLead(id: string, data: any): CrmLead {
  return {
    telefono: data.telefono || id,
    nombre: data.nombre || "",
    empresa: data.empresa || "",
    industria: data.industria || "",
    desafio: data.desafio || "",
    presupuesto: data.presupuesto || "",
    urgencia: data.urgencia || "",
    score: typeof data.score === "number" ? data.score : 0,
    fase: data.fase || "inicio",
    derivado: data.derivado === true,
    updatedAt: toIso(data.updatedAt),
  };
}

// Devuelve todos los leads ordenados por última actividad (más reciente primero).
// Ordena en memoria para no depender de que todos los documentos tengan el campo
// updatedAt indexado, y envuelve en try/catch para no romper el build sin credenciales.
export async function getLeads(): Promise<CrmLead[]> {
  const db = getAdminDb();
  if (!db) return [];
  try {
    const snap = await db.collection(LEADS_COLLECTION).get();
    const leads = snap.docs.map((d) => toLead(d.id, d.data()));
    leads.sort((a, b) => {
      const ta = a.updatedAt ? Date.parse(a.updatedAt) : 0;
      const tb = b.updatedAt ? Date.parse(b.updatedAt) : 0;
      return tb - ta;
    });
    return leads;
  } catch (error) {
    console.error("[crm] getLeads falló:", error);
    return [];
  }
}

export async function getLead(phone: string): Promise<CrmLead | null> {
  const db = getAdminDb();
  if (!db) return null;
  try {
    const snap = await db.collection(LEADS_COLLECTION).doc(phone).get();
    if (!snap.exists) return null;
    return toLead(snap.id, snap.data());
  } catch (error) {
    console.error("[crm] getLead falló:", error);
    return null;
  }
}

export async function getConversation(phone: string): Promise<CrmMessage[]> {
  const db = getAdminDb();
  if (!db) return [];
  try {
    const snap = await db.collection(CONVERSATIONS_COLLECTION).doc(phone).get();
    if (!snap.exists) return [];
    const messages = snap.data()?.messages;
    return Array.isArray(messages) ? (messages as CrmMessage[]) : [];
  } catch (error) {
    console.error("[crm] getConversation falló:", error);
    return [];
  }
}

export function computeStats(leads: CrmLead[]): CrmStats {
  const total = leads.length;
  const derivados = leads.filter((l) => l.derivado).length;
  const calificados = leads.filter((l) => l.score >= 50).length;
  const scoreSum = leads.reduce((acc, l) => acc + l.score, 0);
  const scorePromedio = total ? Math.round(scoreSum / total) : 0;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const leadsHoy = leads.filter(
    (l) => l.updatedAt && Date.parse(l.updatedAt) >= startOfDay.getTime()
  ).length;

  return { total, derivados, calificados, scorePromedio, leadsHoy };
}

// Formatea un teléfono E.164 chileno (56912345678) a +56 9 1234 5678.
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("56") && digits.length === 11) {
    const n = digits.slice(2);
    return `+56 ${n[0]} ${n.slice(1, 5)} ${n.slice(5)}`;
  }
  return "+" + digits;
}
