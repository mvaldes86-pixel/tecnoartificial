'use client';

import React from 'react';

const steps = [
  {
    num: "01",
    title: "Diagnóstico Inicial",
    desc: "Mapeamos tus procesos actuales y detectamos dónde la IA generará el mayor ROI inmediato."
  },
  {
    num: "02",
    title: "Diseño de Arquitectura",
    desc: "Personalizamos los agentes y flujos de trabajo específicos para tu industria y objetivos."
  },
  {
    num: "03",
    title: "Despliegue y Pruebas",
    desc: "Integramos la solución en tu ecosistema existente sin interrumpir tu operación diaria."
  },
  {
    num: "04",
    title: "Escalamiento",
    desc: "Monitoreamos resultados y expandimos la automatización a otros departamentos de tu empresa."
  }
];

export default function Process() {
  return (
    <section id="proceso" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Nuestro Proceso</h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Metodología probada para llevar a tu empresa de la curiosidad a la ejecución real en semanas, no meses.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative p-8 glass-card">
              <span className="block text-5xl font-black text-primary/20 mb-6 font-display">{step.num}</span>
              <h3 className="text-xl font-bold mb-4">{step.title}</h3>
              <p className="text-white/40 leading-relaxed text-sm">{step.desc}</p>
              
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-white/10 z-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
