import React from 'react';
import { Car, Nfc, ShieldCheck, Building2, ArrowUpRight } from 'lucide-react';

const highlights = [
  {
    icon: Car,
    value: '5 documentos',
    label: 'Permiso de circulación, revisión técnica, SOAP, seguro y padrón en una sola tarjeta',
  },
  {
    icon: Nfc,
    value: 'NFC + QR',
    label: 'Se abren en el navegador desde cualquier teléfono. Quien la toca o escanea no instala nada',
  },
  {
    icon: ShieldCheck,
    value: '100% legal',
    label: 'Respaldado por la Ley de Tránsito (18.290) y el dictamen N° 37.361/2013 de Contraloría',
  },
  {
    icon: Building2,
    value: 'Personas y flotas',
    label: 'En el mercado con planes desde $8.990/año y panel centralizado para empresas',
  },
];

export default function Vigenta() {
  return (
    <section id="vigenta" className="py-32 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-6 uppercase tracking-wide">
            Caso de Éxito · Producto Propio
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-black mb-6">
            Vigenta: del concepto al <span className="text-primary italic">producto real</span>
          </h2>
          <p className="text-white/60 text-xl max-w-3xl mx-auto">
            No solo asesoramos: construimos. Diseñamos y desarrollamos <strong className="text-white">Vigenta</strong> de punta a punta — una web app con tecnología <strong className="text-white">NFC + QR</strong> que reúne todos los documentos de tu vehículo en una sola tarjeta y los muestra al instante, sin papeles ni apps. Hoy está en producción y a la venta.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {highlights.map((item, i) => (
            <div key={i} className="glass-card text-center flex flex-col items-center gap-3">
              <item.icon className="w-7 h-7 text-primary" />
              <span className="text-2xl md:text-3xl font-display font-black">{item.value}</span>
              <p className="text-white/50 text-sm leading-relaxed">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="glass-card !p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center">
              <Car className="w-7 h-7 text-primary" />
            </div>
            <p className="text-white/70 max-w-md text-sm md:text-base">
              <strong className="text-white">Vigenta</strong> es una aplicación de TecnoArtificial, diseñada, desarrollada y lanzada al mercado por nuestro equipo. La prueba de que llevamos una idea desde el código hasta un producto real.
            </p>
          </div>
          <a
            href="https://www.vigenta.cl"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-black whitespace-nowrap transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-primary/20"
          >
            Conocer Vigenta
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
