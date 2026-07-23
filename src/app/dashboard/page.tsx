import Link from "next/link";
import type { Metadata } from "next";
import {
  Users,
  Flame,
  CheckCircle2,
  Gauge,
  CalendarClock,
  Lock,
  MessageSquare,
  ArrowRight,
  DollarSign,
  Eye,
  MousePointerClick,
  BarChart3,
} from "lucide-react";
import {
  getLeads,
  computeStats,
  formatPhone,
  type CrmLead,
} from "@/lib/crm";
import { getAdsMetrics } from "@/lib/ads";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "CRM — TecnoArtificial",
  robots: { index: false, follow: false },
};

function scoreClasses(score: number): string {
  if (score >= 75) return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  if (score >= 50) return "bg-amber-500/15 text-amber-400 border-amber-500/30";
  return "bg-slate-500/15 text-slate-400 border-slate-500/30";
}

function faseLabel(fase: string): { text: string; classes: string } {
  const map: Record<string, { text: string; classes: string }> = {
    inicio: { text: "Nuevo", classes: "bg-slate-500/15 text-slate-300 border-slate-500/30" },
    derivado: { text: "Derivado", classes: "bg-primary/20 text-indigo-300 border-primary/40" },
  };
  return map[fase] || { text: fase, classes: "bg-slate-500/15 text-slate-300 border-slate-500/30" };
}

function relativeTime(iso: string | null): string {
  if (!iso) return "—";
  const diff = Date.now() - Date.parse(iso);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return `hace ${days} d`;
}

function LockScreen() {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <form
        method="GET"
        className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col gap-4"
      >
        <div className="flex items-center gap-3 text-indigo-300">
          <Lock className="w-6 h-6" />
          <h1 className="text-xl font-bold">CRM TecnoArtificial</h1>
        </div>
        <p className="text-sm text-slate-400">
          Ingresa la clave de acceso para ver el panel.
        </p>
        <input
          type="password"
          name="key"
          placeholder="Clave de acceso"
          autoFocus
          className="bg-background border border-white/15 rounded-lg px-4 py-3 text-foreground outline-none focus:border-primary"
        />
        <button
          type="submit"
          className="bg-primary hover:bg-indigo-500 transition-colors rounded-lg px-4 py-3 font-semibold"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accent}`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold leading-none">{value}</div>
        <div className="text-xs text-slate-400 mt-1">{label}</div>
      </div>
    </div>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;
  const expected = process.env.CRM_ACCESS_KEY;

  // Si hay clave configurada en el entorno y no coincide, muestra el candado.
  if (expected && key !== expected) {
    return <LockScreen />;
  }

  const keyQuery = key ? `?key=${encodeURIComponent(key)}` : "";
  const [leads, ads] = await Promise.all([getLeads(), getAdsMetrics()]);
  const stats = computeStats(leads);
  const intFmt = (n: number) => n.toLocaleString("es-CL");

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-2 text-indigo-300 text-sm font-semibold">
            <MessageSquare className="w-4 h-4" />
            TecnoArtificial · CRM WhatsApp
          </div>
          <h1 className="text-3xl font-bold mt-1">Seguimiento de leads</h1>
          <p className="text-slate-400 text-sm mt-1">
            Clientes que conversaron con el Agente IA por WhatsApp.
          </p>
        </header>

        {/* Métricas de anuncios en vivo (Meta Ads) */}
        <section className="mb-8">
          <div className="flex items-center gap-2 text-emerald-300 text-sm font-semibold mb-3">
            <BarChart3 className="w-4 h-4" /> Anuncios · Meta Ads (en vivo)
          </div>
          {ads.ok ? (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard icon={<DollarSign className="w-5 h-5 text-emerald-300" />} label="Gastado" value={`$${ads.spend.toFixed(2)}`} accent="bg-emerald-500/20" />
                <StatCard icon={<Eye className="w-5 h-5 text-sky-300" />} label="Personas alcanzadas" value={intFmt(ads.reach)} accent="bg-sky-500/20" />
                <StatCard icon={<BarChart3 className="w-5 h-5 text-indigo-300" />} label="Impresiones" value={intFmt(ads.impressions)} accent="bg-primary/20" />
                <StatCard icon={<MousePointerClick className="w-5 h-5 text-orange-300" />} label="Clics" value={intFmt(ads.clicks)} accent="bg-orange-500/20" />
                <StatCard icon={<MessageSquare className="w-5 h-5 text-emerald-300" />} label="Conversaciones WhatsApp" value={intFmt(ads.messages)} accent="bg-emerald-500/20" />
              </div>
              {ads.campaigns.length > 0 && (
                <div className="mt-4 bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-slate-400 border-b border-white/10">
                          <th className="px-5 py-3 font-medium">Campaña</th>
                          <th className="px-5 py-3 font-medium">Estado</th>
                          <th className="px-5 py-3 font-medium">Gastado</th>
                          <th className="px-5 py-3 font-medium">Alcance</th>
                          <th className="px-5 py-3 font-medium">Clics</th>
                          <th className="px-5 py-3 font-medium">Conversaciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ads.campaigns.map((c) => (
                          <tr key={c.name} className="border-b border-white/5">
                            <td className="px-5 py-3 text-slate-200">{c.name}</td>
                            <td className="px-5 py-3 text-slate-300 whitespace-nowrap">{c.status}</td>
                            <td className="px-5 py-3 text-slate-300 whitespace-nowrap">${c.spend.toFixed(2)}</td>
                            <td className="px-5 py-3 text-slate-300 whitespace-nowrap">{intFmt(c.reach)}</td>
                            <td className="px-5 py-3 text-slate-300 whitespace-nowrap">{intFmt(c.clicks)}</td>
                            <td className="px-5 py-3 text-slate-300 whitespace-nowrap">{intFmt(c.messages)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-2xl px-5 py-4 text-sm">
              No se pudieron cargar las métricas de Meta Ads: {ads.error}
              <span className="text-amber-400/70"> — probablemente el token de Ads expiró; hay que generar uno nuevo.</span>
            </div>
          )}
        </section>

        <div className="flex items-center gap-2 text-indigo-300 text-sm font-semibold mb-3">
          <MessageSquare className="w-4 h-4" /> Bot de WhatsApp · leads
        </div>
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard icon={<Users className="w-5 h-5 text-indigo-300" />} label="Leads totales" value={stats.total} accent="bg-primary/20" />
          <StatCard icon={<Flame className="w-5 h-5 text-orange-300" />} label="Derivados" value={stats.derivados} accent="bg-orange-500/20" />
          <StatCard icon={<CheckCircle2 className="w-5 h-5 text-emerald-300" />} label="Calificados" value={stats.calificados} accent="bg-emerald-500/20" />
          <StatCard icon={<Gauge className="w-5 h-5 text-purple-300" />} label="Score promedio" value={stats.scorePromedio} accent="bg-secondary/20" />
          <StatCard icon={<CalendarClock className="w-5 h-5 text-sky-300" />} label="Leads hoy" value={stats.leadsHoy} accent="bg-sky-500/20" />
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-white/10">
                  <th className="px-5 py-3 font-medium">Cliente</th>
                  <th className="px-5 py-3 font-medium">Contacto</th>
                  <th className="px-5 py-3 font-medium">Interés / Desafío</th>
                  <th className="px-5 py-3 font-medium">Presupuesto</th>
                  <th className="px-5 py-3 font-medium">Score</th>
                  <th className="px-5 py-3 font-medium">Estado</th>
                  <th className="px-5 py-3 font-medium">Actividad</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-16 text-center text-slate-500">
                      Aún no hay leads. Cuando un cliente escriba al bot, aparecerá aquí.
                    </td>
                  </tr>
                )}
                {leads.map((l: CrmLead) => {
                  const fase = faseLabel(l.fase);
                  return (
                    <tr
                      key={l.telefono}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="font-semibold">{l.nombre || "Sin nombre"}</div>
                        <div className="text-slate-400 text-xs">{l.empresa || "—"}</div>
                      </td>
                      <td className="px-5 py-4 text-slate-300 whitespace-nowrap">
                        {formatPhone(l.telefono)}
                      </td>
                      <td className="px-5 py-4 max-w-xs">
                        <div className="text-slate-200">{l.industria || "—"}</div>
                        <div className="text-slate-500 text-xs truncate">{l.desafio || ""}</div>
                      </td>
                      <td className="px-5 py-4 text-slate-300 whitespace-nowrap">
                        {l.presupuesto || "—"}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-block border rounded-full px-2.5 py-1 text-xs font-semibold ${scoreClasses(l.score)}`}>
                          {l.score}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-block border rounded-full px-2.5 py-1 text-xs font-semibold ${fase.classes}`}>
                          {fase.text}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                        {relativeTime(l.updatedAt)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/dashboard/${l.telefono}${keyQuery}`}
                          className="inline-flex items-center gap-1 text-indigo-300 hover:text-indigo-200 font-medium"
                        >
                          Ver <ArrowRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
