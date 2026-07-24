import React from 'react';
import Link from 'next/link';
import { Megaphone, Workflow, ShieldCheck, ArrowRight } from 'lucide-react';

const services = [
  {
    title: "Marketing de Alta Conversión",
    description: "Dominamos el ecosistema digital mediante la automatización inteligente de campañas en Meta y la generación de leads calificados. Optimizamos tu presencia orgánica con diagnósticos SEO de precisión.",
    icon: Megaphone,
    color: "text-purple-400"
  },
  {
    title: "Eficiencia Operacional 360°",
    description: "Transformamos la productividad de tu empresa. Implementamos agentes autónomos y APIs personalizadas que orquestan tus procesos internos, eliminando fricciones y escalando tu capacidad operativa.",
    icon: Workflow,
    color: "text-blue-400"
  }
];


export default function Services() {
  return (
    <section id="servicios" className="py-14 md:py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Nuestros Servicios de Vanguardia</h2>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          Soluciones integrales diseñadas para empresas que no solo quieren sobrevivir, sino dominar la era de la inteligencia artificial.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {services.map((service, index) => (
          <div key={index} className="glass-card group flex flex-col items-start gap-4 transition duration-300 hover:-translate-y-1 hover:border-white/20">
            <div className={`p-4 rounded-xl bg-white/5 ${service.color} group-hover:scale-110 transition-transform`}>
              <service.icon className="w-8 h-8" />
            </div>
            <h3 className="font-display text-2xl font-bold mt-4">{service.title}</h3>
            <div className="text-white/50 leading-relaxed">{service.description}</div>
          </div>
        ))}
      </div>

      {/* Nueva línea: Ciberseguridad Escudo */}
      <Link
        href="/servicios/ciberseguridad"
        className="group mt-8 max-w-4xl mx-auto flex flex-col md:flex-row md:items-center gap-6 rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-emerald-950/40 to-white/[0.03] p-8 hover:border-emerald-400/50 transition-all"
      >
        <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform shrink-0 w-fit">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-display text-2xl font-bold">Ciberseguridad · Escudo</h3>
            <span className="text-[10px] font-black tracking-wider uppercase bg-emerald-500 text-[#04140f] px-2 py-0.5 rounded-full">Nuevo</span>
          </div>
          <div className="text-white/50 leading-relaxed">
            Auditamos, blindamos y certificamos tu presencia digital. Diagnóstico gratis para saber qué tan expuesto estás.
          </div>
        </div>
        <span className="inline-flex items-center gap-2 text-emerald-300 font-bold whitespace-nowrap group-hover:gap-3 transition-all">
          Ver más <ArrowRight className="w-5 h-5" />
        </span>
      </Link>
    </section>
  );
}
