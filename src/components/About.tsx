'use client';

import React from 'react';
import { Target, Users, ShieldCheck } from 'lucide-react';

export default function About() {
  return (
    <section id="nosotros" className="py-24 px-6 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-8">Nuestra Misión</h2>
            <p className="text-xl text-white/60 mb-8 leading-relaxed">
              En TecnoArtificial, no solo implementamos tecnología; transformamos la visión de negocio de nuestros clientes. Nuestra misión es democratizar el acceso a herramientas de IA de élite para empresas en crecimiento.
            </p>
            
            <div className="space-y-6">
              {[
                { icon: Target, title: "Enfoque en Resultados", desc: "No nos interesan los adornos, buscamos impacto directo en tu facturación." },
                { icon: Users, title: "Equipo Senior", desc: "Consultores con experiencia real en despliegue de modelos LLM." },
                { icon: ShieldCheck, title: "Seguridad de Datos", desc: "Implementaciones privadas y seguras que protegen tu propiedad intelectual." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 bg-primary/10 p-2 rounded-lg">
                    <item.icon className="text-primary w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{item.title}</h4>
                    <p className="text-white/40">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-square rounded-[3rem] overflow-hidden glass border-white/10 p-1">
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[2.8rem] flex items-center justify-center">
                <div className="text-center p-12">
                  <span className="block text-8xl font-black text-white/10 mb-4 tracking-tighter">10X</span>
                  <p className="text-2xl font-display font-medium text-white/80 uppercase tracking-widest">Aumento en<br/>Productividad</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
