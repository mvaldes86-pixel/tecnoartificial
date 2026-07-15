import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle, Building2, Bot, User } from "lucide-react";
import {
  getLead,
  getConversation,
  formatPhone,
  type CrmMessage,
} from "@/lib/crm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ficha de lead — TecnoArtificial",
  robots: { index: false, follow: false },
};

type Params = { phone: string };

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="text-foreground mt-1 font-medium break-words">{value || "—"}</div>
    </div>
  );
}

export default async function LeadDetailPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<{ key?: string }>;
}) {
  const { phone } = await params;
  const { key } = await searchParams;
  const expected = process.env.CRM_ACCESS_KEY;

  // Mismo candado que el listado: si hay clave configurada, debe coincidir.
  if (expected && key !== expected) {
    notFound();
  }

  const keyQuery = key ? `?key=${encodeURIComponent(key)}` : "";
  const [lead, messages] = await Promise.all([
    getLead(phone),
    getConversation(phone),
  ]);

  if (!lead) notFound();

  const clientWaLink = `https://wa.me/${phone.replace(/\D/g, "")}`;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Link
          href={`/dashboard${keyQuery}`}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-foreground text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al CRM
        </Link>

        <header className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">{lead.nombre || "Sin nombre"}</h1>
            <div className="flex items-center gap-2 text-slate-400 mt-1">
              <Building2 className="w-4 h-4" />
              {lead.empresa || "Empresa desconocida"}
            </div>
            <div className="text-slate-400 mt-1">{formatPhone(lead.telefono)}</div>
          </div>
          <a
            href={clientWaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 transition-colors rounded-lg px-4 py-2.5 font-semibold"
          >
            <MessageCircle className="w-4 h-4" /> Abrir chat con el cliente
          </a>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          <Field label="Industria / Rubro" value={lead.industria} />
          <Field label="Presupuesto" value={lead.presupuesto} />
          <Field label="Urgencia" value={lead.urgencia} />
          <Field
            label="Score"
            value={`${lead.score}/100${lead.derivado ? " · Derivado" : ""}`}
          />
          <div className="col-span-2 md:col-span-4">
            <Field label="Desafío / Necesidad" value={lead.desafio} />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-indigo-300" />
            Conversación de WhatsApp
          </h2>

          {messages.length === 0 ? (
            <p className="text-slate-500 text-sm">Sin mensajes registrados.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {messages.map((m: CrmMessage, i: number) => {
                const isBot = m.role === "assistant";
                return (
                  <div
                    key={i}
                    className={`flex ${isBot ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                        isBot
                          ? "bg-primary/20 border border-primary/30 rounded-br-sm"
                          : "bg-white/5 border border-white/10 rounded-bl-sm"
                      }`}
                    >
                      <div
                        className={`flex items-center gap-1.5 text-xs mb-1 ${
                          isBot ? "text-indigo-300" : "text-slate-400"
                        }`}
                      >
                        {isBot ? (
                          <>
                            <Bot className="w-3.5 h-3.5" /> Agente IA
                          </>
                        ) : (
                          <>
                            <User className="w-3.5 h-3.5" /> Cliente
                          </>
                        )}
                      </div>
                      {m.content}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
