'use client';

import React from 'react';
import { Zap, TrendingUp, Bot, Code2 } from 'lucide-react';

const services = [
  {
    title: "Optimización de Procesos",
    description: "Analizamos y automatizamos tus flujos de trabajo diarios eliminando cuellos de botella mediante IA.",
    icon: Zap,
    color: "text-blue-400"
  },
  {
    title: "Campañas de Venta IA",
    description: "Creamos y gestionamos campañas en Meta y Google que se optimizan en tiempo real para maximizar el ROI.",
    icon: TrendingUp,
    color: "text-purple-400"
  },
  {
    title: "Agentes Autónomos",
    description: "Desplegamos bots inteligentes que resuelven atención al cliente y gestión de leads 24/7 sin intervención humana.",
    icon: Bot,
    color: "text-green-400"
  },
  {
    title: "Desarrollo de Apps IA",
    description: "Construimos aplicaciones a medida y ecosistemas de automatización complejos, integrando IA generativa en tu software.",
    icon: Code2,
    color: "text-orange-400"
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

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
