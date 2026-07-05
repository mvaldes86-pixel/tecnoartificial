import React from 'react';

const logos = [
  { src: '/logos/arigrav.png', alt: 'Arigrav', invert: true, scale: 'scale-[1.5]' },
  { src: '/logos/ibi.jpeg', alt: 'IBI', invert: false, scale: 'scale-[1.45]' },
];

export default function Clients() {
  return (
    <section className="py-16 md:py-32 bg-background overflow-hidden border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <h2 className="text-white/40 text-sm font-black uppercase tracking-[0.3em]">
          Empresas que confían en nosotros
        </h2>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-16 md:gap-28 px-6">
        {logos.map((logo, index) => (
          <div key={index} className="flex items-center justify-center h-24">
            <div className={`relative h-16 flex items-center justify-center ${logo.scale} ${logo.invert ? 'invert' : ''}`}>
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-full w-auto max-w-[220px] object-contain grayscale opacity-70"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
