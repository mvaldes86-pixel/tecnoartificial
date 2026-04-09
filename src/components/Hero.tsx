'use client';

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-40 pb-20 px-6 min-h-[90vh] flex items-center justify-center">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 blur-[120px] rounded-full" />
      
      <div className="relative z-10 max-w-5xl text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
          <Sparkles className="text-secondary w-4 h-4" />
          <span className="text-sm font-bold text-white/80 tracking-wide uppercase">Liderando la Revolución con IA</span>
        </div>
        
        <h1 className="font-display text-4xl md:text-7xl font-black mb-8 leading-[1.2] px-4">
          Evoluciona tu Negocio con <br />
          <span className="text-secondary">
            Inteligencia Artificial
          </span>
        </h1>






        
        <p className="font-sans text-xl md:text-2xl text-white/60 mb-12 max-w-3xl mx-auto leading-relaxed">
          Diseñamos agentes autónomos y automatizamos tus campañas de venta para que escales mientras nosotros optimizamos tu operación.
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <a href="/consultoria" className="group bg-primary hover:bg-primary/80 text-white px-10 py-5 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all shadow-2xl shadow-primary/40">
            Solicitar Consultoría Gratuita
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="/#servicios" className="glass hover:bg-white/10 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all">
            Ver Servicios
          </a>
        </div>

      </div>
    </section>
  );
}
