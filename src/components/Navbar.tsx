'use client';

import React from 'react';
import Link from 'next/link';
import { Cpu } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6">
      <div className="glass flex items-center justify-between w-full max-w-7xl px-8 py-4 rounded-2xl">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
          <Cpu className="text-primary w-8 h-8" />
          <span className="font-display font-bold text-2xl tracking-tight">TecnoArtificial</span>
        </Link>


        
        <div className="hidden md:flex items-center gap-8">
          <Link href="/#servicios" className="text-white/70 hover:text-white transition-colors">Servicios</Link>
          <Link href="/#nosotros" className="text-white/70 hover:text-white transition-colors">Nosotros</Link>
          <Link href="/#proceso" className="text-white/70 hover:text-white transition-colors">Proceso</Link>
          <Link href="/consultoria" className="bg-primary hover:bg-primary/80 px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-primary/20">
            Consultoría Gratis
          </Link>
        </div>


      </div>
    </nav>
  );
}
