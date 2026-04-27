'use client';

import React from 'react';
import { ShoppingCart, Workflow, Video, ArrowUpRight } from 'lucide-react';

const agents = [
  {
    title: "Cierre de Ventas Autónomo",
    description: "Tu fuerza comercial incansable. Captura leads de alto valor, califica prospectos y concreta ventas las 24 horas del día.",
    icon: <ShoppingCart className="w-8 h-8 text-primary" />,
    features: ["Cierres en tiempo real", "Cualificación avanzada", "Multicanal (WhatsApp/Web)"]
  },
  {
    title: "Orquestador de Procesos IA",
    description: "El cerebro operativo de tu empresa. Automatiza tareas complejas y elimina la carga administrativa manual mediante APIs personalizadas.",
    icon: <Workflow className="w-8 h-8 text-accent" />,
    features: ["Integración de sistemas", "Flujos autónomos", "Cero fricción operativa"]
  },
  {
    title: "Analista de Visión Predictiva",
    description: "Vigilancia activa con IA. Transforma tus cámaras en un sistema de detección avanzada capaz de prevenir incidentes en tiempo real.",
    icon: <Video className="w-8 h-8 text-secondary" />,
    features: ["Detección de anomalías", "Análisis KVM/NVR", "Alertas preventivas"]
  }
];

export default function Portfolio() {
  return (
    <section id="agentes" className="py-32 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-display font-black mb-6">Fuerza de Trabajo <span className="text-primary italic">Digital</span></h2>
          <p className="text-white/60 text-xl max-w-2xl mx-auto">
            Nuestros agentes autónomos están diseñados para integrarse en tu operación y escalar cada departamento.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {agents.map((agent, i) => (
            <div key={i} className="glass p-10 rounded-[2.5rem] group hover:bg-white/5 transition-all duration-500 relative overflow-hidden border border-white/5 hover:border-primary/30">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 blur-[50px] group-hover:bg-primary/10 transition-colors" />
              
              <div className="mb-8 p-4 bg-white/5 rounded-2xl w-fit">
                {agent.icon}
              </div>
              
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                {agent.title}
                <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </h3>
              
              <p className="text-white/60 mb-8 leading-relaxed">
                {agent.description}
              </p>
              
              <ul className="space-y-3">
                {agent.features.map((feat, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-white/40">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
