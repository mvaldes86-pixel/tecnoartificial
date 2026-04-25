'use client';

import React from 'react';

const logos = [
  { src: '/logos/arigrav.png', alt: 'Arigrav', invert: true, scale: 'scale-150' },
  { src: '/logos/ecolados.png', alt: 'Ecolados', invert: false, scale: 'scale-125' },
  { src: '/logos/ecoqueen.webp', alt: 'EcoQueen', invert: false, scale: 'scale-150' },
  { src: '/logos/ibi.jpeg', alt: 'IBI', invert: false, scale: 'scale-110' },
];

export default function Clients() {
  // Duplicate logos for seamless scroll
  const displayLogos = [...logos, ...logos, ...logos, ...logos];

  return (
    <section className="py-32 bg-background overflow-hidden border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
        <h2 className="text-white/40 text-sm font-black uppercase tracking-[0.3em]">
          Empresas que confían en nosotros
        </h2>
      </div>
      
      <div className="relative flex overflow-hidden">
        {/* Usamos dos contenedores para un scroll infinito perfecto */}
        <div className="flex animate-scroll whitespace-nowrap min-w-full">
          {displayLogos.map((logo, index) => (
            <div key={index} className="flex-shrink-0 flex items-center justify-center px-20 h-32">
              <div className={`relative h-20 flex items-center justify-center ${logo.scale} ${logo.invert ? 'invert' : ''}`}>
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="h-full w-auto object-contain grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
