'use client';

import React from 'react';
import { Megaphone, Cpu, Camera } from 'lucide-react';

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
    icon: Cpu,
    color: "text-blue-400"
  },
  {
    title: "Seguridad Inteligente",
    description: "Protección que anticipa el futuro. Integramos tecnología de análisis inteligente directamente en tu infraestructura KVM/NVR, dotando a tus cámaras de detección avanzada y alertas preventivas.",
    icon: Camera,
    color: "text-emerald-400"
  }
];


export default function Services() {
  return (
    <section id="servicios" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Nuestros Servicios de Vanguardia</h2>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          Soluciones integrales diseñadas para empresas que no solo quieren sobrevivir, sino dominar la era de la inteligencia artificial.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div key={index} className="glass-card group flex flex-col items-start gap-4">
            <div className={`p-4 rounded-xl bg-white/5 ${service.color} group-hover:scale-110 transition-transform`}>
              <service.icon className="w-8 h-8" />
            </div>
            <h3 className="font-display text-2xl font-bold mt-4">{service.title}</h3>
            <p className="text-white/50 leading-relaxed">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
