'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Cpu, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6">
      <div className="glass flex items-center justify-between w-full max-w-7xl px-8 py-4 rounded-2xl">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer group">
          <Cpu className="text-primary w-8 h-8 group-hover:scale-110 transition-transform" />
          <span className="font-display font-bold text-2xl whitespace-nowrap">TecnoArtificial</span>
        </Link>



        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/#servicios" className="text-white/70 hover:text-white transition-colors">Servicios</Link>
          <Link href="/#nosotros" className="text-white/70 hover:text-white transition-colors">Nosotros</Link>
          <Link href="/#proceso" className="text-white/70 hover:text-white transition-colors">Proceso</Link>
          <Link href="/consultoria" className="bg-primary hover:bg-primary/80 px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-primary/20">
            Consultoría Gratis
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-white/70 hover:text-white"
        >
          {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 p-6 glass rounded-3xl md:hidden animate-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col gap-6 text-center">
              <Link onClick={() => setIsMenuOpen(false)} href="/#servicios" className="text-lg py-2">Servicios</Link>
              <Link onClick={() => setIsMenuOpen(false)} href="/#nosotros" className="text-lg py-2">Nosotros</Link>
              <Link onClick={() => setIsMenuOpen(false)} href="/#proceso" className="text-lg py-2">Proceso</Link>
              <Link onClick={() => setIsMenuOpen(false)} href="/consultoria" className="bg-primary py-4 rounded-2xl font-bold">
                Consultoría Gratis
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>

  );
}
