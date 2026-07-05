import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative pt-28 pb-14 px-6 md:pt-40 md:pb-24 flex items-center justify-center">
      <div className="relative z-10 max-w-5xl text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
          <Sparkles className="text-secondary w-4 h-4" />
          <span className="text-sm font-bold text-white/80 tracking-wide uppercase">Liderando la Revolución con IA</span>
        </div>
        
        <h1 className="font-display text-4xl md:text-6xl font-black mb-8 leading-[1.2] px-4">
          A través de agentes autónomos, automatizamos tus <br />
          <span className="text-secondary">
            Campañas de Marketing y Procesos Operacionales
          </span>
        </h1>






        
        <p className="font-sans text-xl md:text-2xl text-white/60 mb-12 max-w-3xl mx-auto leading-relaxed">
          Diseñamos agentes autónomos y automatizamos tus campañas de venta para que escales mientras nosotros optimizamos tu operación.
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <a 
            href="https://calendar.app.google/Ag4TCcUv2KxATUAe9" 
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-primary hover:bg-primary/80 text-white px-10 py-5 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all shadow-2xl shadow-primary/40"
          >
            Solicitar Consultoría Gratuita
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </a>

          <Link href="/#servicios" className="glass hover:bg-white/10 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all">
            Ver Servicios
          </Link>
        </div>

      </div>
    </section>
  );
}
