import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  ShieldCheck,
  Search,
  Bug,
  Activity,
  Lock,
  FileCheck2,
  Check,
  Stethoscope,
  ShoppingCart,
  Building2,
  ArrowRight,
  MessageCircle,
  Scale,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Ciberseguridad Escudo | TecnoArtificial",
  description:
    "Auditamos, blindamos y certificamos tu presencia digital. Pentesting, monitoreo continuo y el sello 'Sitio auditado por Escudo'. Ciberseguridad para empresas que se digitalizan en Chile.",
  alternates: { canonical: "/servicios/ciberseguridad" },
  openGraph: {
    title: "Escudo · Ciberseguridad para tu negocio | TecnoArtificial",
    description:
      "Encontramos las brechas, las resolvemos y te mantenemos protegido. Diagnóstico gratis para empezar.",
    url: "https://tecnoartificial.com/servicios/ciberseguridad",
    type: "website",
  },
};

const posiciones = [
  {
    lbl: "Nuestra promesa",
    icon: ShieldCheck,
    h: "No vendemos un PDF. Vendemos tranquilidad.",
    p: "El diagnóstico es el inicio. El valor está en dejarlo resuelto, certificado y monitoreado en el tiempo.",
  },
  {
    lbl: "Cómo trabajamos",
    icon: Bug,
    h: "Verificamos antes de reportar.",
    p: "Cada hallazgo se confirma con prueba de concepto — nada de falsas alarmas de escáner automático. Y emitimos un sello independiente.",
  },
  {
    lbl: "Nuestro lenguaje",
    icon: Scale,
    h: "Riesgo en pesos, no en jerga.",
    p: "Traducimos cada falla a su impacto real: dinero, datos, reputación y cumplimiento legal (Ley 21.719 y 21.663).",
  },
  {
    lbl: "Por qué nosotros",
    icon: Lock,
    h: "La seguridad de la era de la IA.",
    p: "Quien adopta inteligencia artificial y digitaliza sus procesos necesita protegerlos. Es la continuidad natural de tu transformación digital.",
  },
];

const planes = [
  {
    nombre: "Escudo Diagnóstico",
    rol: "Para empezar sin riesgo",
    precio: "Gratis",
    precioSmall: "o $49.000",
    feat: false,
    puntos: [
      "Análisis externo no intrusivo de tu sitio",
      "Informe ejecutivo para el dueño (sin jerga)",
      "Semáforo de riesgo + hallazgos principales",
      "Reunión de resultados (30 min)",
    ],
    cta: "Solicitar diagnóstico gratis",
    ctaHref: "/consultoria",
    ctaPri: false,
  },
  {
    nombre: "Escudo PRO",
    rol: "Auditoría completa · puntual",
    precio: "$490.000",
    precioSmall: "/ sitio",
    feat: true,
    puntos: [
      "Todo lo del Diagnóstico, y además:",
      "Pentest activo (metodología OWASP) autorizado",
      "Informe técnico con severidad CVSS y evidencia",
      "Pruebas de correo, APIs y formularios",
      "Plan de remediación priorizado",
    ],
    cta: "Cotizar auditoría PRO",
    ctaHref: "/consultoria",
    ctaPri: true,
    nota: "E-commerce o WordPress complejo: desde $890.000.",
  },
  {
    nombre: "Escudo Continuo",
    rol: "Protección permanente",
    precio: "$120.000",
    precioSmall: "/ mes",
    feat: false,
    puntos: [
      "Monitoreo y escaneo continuo",
      "Informe mensual + remediación de lo crítico",
      "Actualizaciones y respaldos",
      'Sello "Sitio auditado por Escudo" (anual)',
      "Soporte prioritario",
    ],
    cta: "Suscribir protección",
    ctaHref: "/consultoria",
    ctaPri: true,
    nota: "Planes Pro $250.000/mes · Empresa $450.000/mes.",
  },
];

const segmentos = [
  {
    icon: Stethoscope,
    h: "Salud y clínicas",
    p: "Manejan datos de pacientes con protección reforzada por ley. Alto valor, alta urgencia.",
  },
  {
    icon: ShoppingCart,
    h: "E-commerce y retail",
    p: "Tiendas con datos de clientes y pagos. Una brecha significa pérdida de ventas y de la pasarela.",
  },
  {
    icon: Building2,
    h: "PYME profesional",
    p: "Estudios, inmobiliarias y educación. Cada vez se los exigen los seguros y las licitaciones.",
  },
];

const proceso = [
  { k: "01", icon: Search, h: "Diagnosticamos", p: "Analizamos tu sitio desde afuera y detectamos por dónde estás expuesto." },
  { k: "02", icon: FileCheck2, h: "Te lo explicamos", p: "Informe ejecutivo con el riesgo en pesos y las prioridades claras." },
  { k: "03", icon: ShieldCheck, h: "Blindamos", p: "Corregimos las vulnerabilidades y cerramos las brechas confirmadas." },
  { k: "04", icon: Activity, h: "Monitoreamos", p: "Vigilancia continua y sello de sitio auditado para mantenerte protegido." },
];

const WA = "https://wa.me/56920293667?text=" +
  encodeURIComponent("Hola 👋 Quiero información sobre Escudo (ciberseguridad) de TecnoArtificial.");

export default function CiberseguridadPage() {
  return (
    <main className="min-h-screen bg-[#0A0A1F] text-white">
      <Navbar />

      {/* HERO */}
      <section className="pt-36 pb-16 px-6 max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-[2rem] border border-emerald-500/20 bg-gradient-to-br from-emerald-950/60 to-[#0A0A1F] p-10 md:p-14">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/25 grid place-items-center">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <div className="font-display font-bold text-xl leading-none">
                Escudo <span className="text-white/40">·</span> TecnoArtificial
              </div>
              <div className="text-[11px] tracking-[0.18em] uppercase text-emerald-400/80 mt-1">
                Nueva línea · Ciberseguridad
              </div>
            </div>
          </div>
          <p className="text-emerald-400 font-semibold text-xs tracking-[0.16em] uppercase mb-3">
            Auditoría · Blindaje · Certificación
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-black leading-[1.05] mb-5 max-w-3xl text-balance">
            Auditamos, blindamos y certificamos tu presencia digital
          </h1>
          <p className="text-lg text-white/60 max-w-2xl leading-relaxed mb-8">
            Ciberseguridad para empresas que se digitalizan. Encontramos las brechas, las
            resolvemos y te mantenemos protegido — con informes que entiende tanto el gerente
            como el equipo técnico.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/consultoria"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-[#04140f] font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
            >
              Solicitar diagnóstico gratis <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-7 py-3.5 rounded-xl transition-all"
            >
              <MessageCircle className="w-4 h-4" /> Hablar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* POSICIONAMIENTO */}
      <section className="px-6 max-w-6xl mx-auto py-8">
        <div className="grid md:grid-cols-2 gap-5">
          {posiciones.map((c) => (
            <div key={c.h} className="bg-white/5 border border-white/10 rounded-2xl p-7">
              <div className="flex items-center gap-3 mb-3">
                <c.icon className="w-6 h-6 text-emerald-400 shrink-0" />
                <span className="text-[11px] tracking-[0.12em] uppercase text-emerald-400/80 font-bold">
                  {c.lbl}
                </span>
              </div>
              <h3 className="font-display text-xl font-bold mb-2">{c.h}</h3>
              <p className="text-white/55 leading-relaxed text-[15px]">{c.p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PLANES */}
      <section className="px-6 max-w-6xl mx-auto py-16">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Planes y precios</h2>
          <p className="text-white/55 max-w-2xl mx-auto">
            Del diagnóstico gratis al blindaje completo y la protección permanente. Valores de
            referencia en pesos chilenos, netos.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {planes.map((p) => (
            <div
              key={p.nombre}
              className={`relative rounded-2xl p-7 flex flex-col h-full ${
                p.feat
                  ? "border-2 border-emerald-500 bg-gradient-to-b from-emerald-950/50 to-white/[0.03]"
                  : "border border-white/10 bg-white/5"
              }`}
            >
              {p.feat && (
                <span className="absolute -top-3 left-7 bg-emerald-500 text-[#04140f] text-[10.5px] font-black tracking-wider uppercase px-3 py-1 rounded-full">
                  Más solicitado
                </span>
              )}
              <div className="font-display text-xl font-bold">{p.nombre}</div>
              <div className="text-sm text-white/50 mt-1">{p.rol}</div>
              <div className="mt-5 mb-1">
                <span className="font-display text-4xl font-bold tabular-nums">{p.precio}</span>{" "}
                <span className="text-sm text-white/50">{p.precioSmall}</span>
              </div>
              <ul className="flex flex-col gap-2.5 mt-5 mb-6 flex-1">
                {p.puntos.map((pt) => (
                  <li key={pt} className="flex gap-2.5 items-start text-[14px] text-white/80">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={p.ctaHref}
                className={`text-center font-bold text-sm py-3 rounded-xl transition-all ${
                  p.ctaPri
                    ? "bg-emerald-500 hover:bg-emerald-400 text-[#04140f]"
                    : "bg-white/5 hover:bg-white/10 border border-emerald-500/30 text-emerald-300"
                }`}
              >
                {p.cta}
              </Link>
              {p.nota && <p className="text-[12px] text-white/40 mt-3">{p.nota}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* PARA QUIÉN */}
      <section className="px-6 max-w-6xl mx-auto py-8">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">¿Para quién es?</h2>
          <p className="text-white/55 max-w-2xl mx-auto">
            Negocios con datos sensibles y sin un equipo de seguridad propio — donde más se
            necesita y menos se puede resolver solo.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {segmentos.map((s) => (
            <div key={s.h} className="bg-white/5 border border-white/10 rounded-2xl p-7">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 grid place-items-center mb-4">
                <s.icon className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-display text-lg font-bold mb-2">{s.h}</h3>
              <p className="text-white/55 text-[14px] leading-relaxed">{s.p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESO */}
      <section className="px-6 max-w-6xl mx-auto py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Cómo trabajamos</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {proceso.map((f) => (
            <div key={f.k} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <f.icon className="w-6 h-6 text-emerald-400" />
                <span className="font-mono text-sm text-emerald-400/50 font-bold">{f.k}</span>
              </div>
              <h3 className="font-display text-lg font-bold mb-1.5">{f.h}</h3>
              <p className="text-white/55 text-[13.5px] leading-relaxed">{f.p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="px-6 max-w-6xl mx-auto pb-24">
        <div className="rounded-[2rem] border border-emerald-500/20 bg-gradient-to-br from-emerald-950/50 to-[#0A0A1F] p-10 md:p-14 text-center">
          <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-5" />
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-balance">
            Empieza sabiendo qué tan expuesto estás
          </h2>
          <p className="text-white/60 max-w-xl mx-auto mb-8">
            El diagnóstico es gratis y no intrusivo. Te decimos dónde estás en riesgo — sin
            compromiso.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/consultoria"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-[#04140f] font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
            >
              Solicitar diagnóstico gratis <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-3.5 rounded-xl transition-all"
            >
              <MessageCircle className="w-4 h-4" /> Hablar por WhatsApp
            </a>
          </div>
        </div>
        <p className="text-center text-white/30 text-xs mt-8">
          Escudo es una línea de servicio de TecnoArtificial SpA · Providencia, Santiago ·
          Auditorías realizadas siempre con autorización del titular del sitio.
        </p>
      </section>
    </main>
  );
}
