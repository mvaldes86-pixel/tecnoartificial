'use client';

import React from 'react';
import Image from 'next/image';

const logos = [
  { src: '/logos/arigrav.png', alt: 'Arigrav', invert: true },
  { src: '/logos/ecolados.avif', alt: 'Ecolados', invert: false },
  { src: '/logos/ecoqueen.webp', alt: 'EcoQueen', invert: false },
];

export default function Clients() {
  // Duplicate logos for seamless scroll
  const displayLogos = [...logos, ...logos, ...logos, ...logos];

  return (
    <section className="py-20 bg-background overflow-hidden border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <h2 className="text-white/40 text-sm font-black uppercase tracking-[0.3em]">
          Empresas que confían en nosotros
        </h2>
      </div>
      
      <div className="relative flex overflow-hidden group">
        <div className="flex animate-scroll whitespace-nowrap">
          {displayLogos.map((logo, index) => (
            <div key={index} className="flex items-center justify-center px-12 h-20 grayscale hover:grayscale-0 transition-all duration-500 opacity-50 hover:opacity-100">
              <div className={`relative h-full aspect-[3/1] ${logo.invert ? 'invert' : ''}`}>
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          display: flex;
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
