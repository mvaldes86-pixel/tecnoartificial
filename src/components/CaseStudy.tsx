'use client';

import React from 'react';
import { Users, MessageCircle, Moon, Home, ArrowRight } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '1.587',
    label: 'Personas atendidas por el agente en WhatsApp, sin intervención humana',
  },
  {
    icon: MessageCircle,
    value: '237',
    label: 'Leads calificados y derivados a un asesor humano para cerrar la visita (14,9%)',
  },
  {
    icon: Moon,
    value: '55%',
    label: 'Llegaron fuera de horario de oficina (noches y fines de semana) y fueron atendidos al instante',
  },
  {
    icon: Home,
    value: '23',
    label: 'Propiedades distintas promocionadas en simultáneo por el mismo agente',
  },
];

export default function CaseStudy() {
  return (
    <section id="casos-exito" className="py-32 px-6 relative overflow-hidden">
      <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-accent/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-bold mb-6 uppercase tracking-wide">
            Caso de Éxito Real
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-black mb-6">
            El agente de WhatsApp que <span className="text-accent italic">nunca duerme</span>
          </h2>
          <p className="text-white/60 text-xl max-w-2xl mx-auto">
            Diseñamos y operamos el agente autónomo de ventas de <strong className="text-white">IBI</strong>, corredora de propiedades con 17 años en Santiago. Responde cada contacto de WhatsApp al instante, califica al cliente y deriva a un asesor solo cuando el lead está listo para visitar.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="glass-card text-center flex flex-col items-center gap-3">
              <stat.icon className="w-7 h-7 text-accent" />
              <span className="text-4xl md:text-5xl font-display font-black">{stat.value}</span>
              <p className="text-white/50 text-sm leading-relaxed">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="glass-card !p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <img src="/logos/ibi.jpeg" alt="IBI" className="h-14 w-auto object-contain rounded-lg flex-shrink-0" />
            <p className="text-white/70 max-w-md text-sm md:text-base">
              Datos reales medidos entre el 24 de abril y el 25 de junio de 2026, sobre WhatsApp Business + IA, sin intervención humana hasta que el lead está listo para visitar.
            </p>
          </div>
          <a
            href="https://calendar.app.google/Ag4TCcUv2KxATUAe9"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-3 bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-2xl font-black whitespace-nowrap transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-accent/20"
          >
            Quiero este agente en mi negocio
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
