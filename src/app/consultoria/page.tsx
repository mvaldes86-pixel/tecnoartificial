'use client';

import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import { CheckCircle2, Send, PartyPopper } from 'lucide-react';
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ConsultoriaPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    whatsapp: '',
    empresa: '',
    industria: 'Tecnología',
    desafio: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      // 1. Guardar en Firestore
      await addDoc(collection(db, "leads"), {
        ...formData,
        timestamp: serverTimestamp()
      });

      // 2. Enviar correos electrónicos (con timeout para que no se "pegue" el formulario)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 segundos de espera máximo

        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
      } catch (emailError) {
        console.error("Los datos se guardaron pero falló el envío de emails o tomó demasiado tiempo:", emailError);
      }

      setIsSuccess(true);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      alert("Hubo un problema al procesar tu solicitud. Sin embargo, tus datos podrían haber sido guardados. Si el problema persiste, contáctanos directamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0A1F] text-white">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Branding & Info */}
        <div>
          <h1 className="font-display text-5xl md:text-7xl font-black mb-8 leading-tight">
            Transforma tu Negocio <br />
            <span className="text-primary italic">Hoy Mismo</span>
          </h1>
          
          <p className="text-xl text-white/60 mb-12 leading-relaxed">
            Nuestra sesión de consultoría gratuita te proporcionará una hoja de ruta clara para integrar la inteligencia artificial en tu operación.
          </p>
          
          <ul className="space-y-6">
            {[
              "Análisis profundo de tus procesos actuales.",
              "Identificación de cuellos de botella automatizables.",
              "Roadmap personalizado de implementación de IA.",
              "Estimación de ROI por automatización."
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-4 text-lg">
                <CheckCircle2 className="text-accent w-6 h-6 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          
          <div className="mt-16 p-8 glass-card">
            <p className="italic text-white/80 mb-4">
              "TecnoArtificial cambió nuestra forma de operar. En solo 3 meses redujimos costos operativos en un 40% gracias a sus agentes autónomos."
            </p>
            <p className="font-bold text-primary">— Director de Operaciones, NexStock</p>
          </div>
        </div>

        {/* Lead Form Section */}
        <div className="glass shadow-2xl rounded-[2rem] p-10 relative overflow-hidden min-h-[600px] flex flex-col justify-center">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-[80px] rounded-full" />
          
          {isSuccess ? (
            <div className="relative z-10 text-center animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <PartyPopper className="text-accent w-12 h-12" />
              </div>
              <h2 className="font-display text-4xl font-bold mb-4">¡Solicitud Enviada!</h2>
              <p className="text-white/60 text-lg mb-8">
                Gracias por confiar en TecnoArtificial. Un consultor experto se pondrá en contacto contigo en las próximas 24 horas.
              </p>
              <button 
                onClick={() => setIsSuccess(false)}
                className="text-primary font-bold hover:underline"
              >
                Enviar otra solicitud
              </button>
            </div>
          ) : (
            <>
              <h2 className="font-display text-3xl font-bold mb-8 relative z-10 text-glow">Agenda tu sesión</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1.5 ml-1">Nombre Completo</label>
                    <input 
                      required
                      type="text" 
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus:border-primary/50 focus:bg-white/10 transition-all outline-none" 
                      placeholder="Juan Pérez" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1.5 ml-1">WhatsApp</label>
                    <input 
                      required
                      type="tel" 
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus:border-primary/50 focus:bg-white/10 transition-all outline-none" 
                      placeholder="+56 9 ..." 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1.5 ml-1">Correo Corporativo</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus:border-primary/50 focus:bg-white/10 transition-all outline-none" 
                    placeholder="juan@empresa.com" 
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1.5 ml-1">Empresa</label>
                    <input 
                      required
                      type="text" 
                      value={formData.empresa}
                      onChange={(e) => setFormData({...formData, empresa: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus:border-primary/50 focus:bg-white/10 transition-all outline-none" 
                      placeholder="Empresa S.A." 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1.5 ml-1">Industria</label>
                    <div className="relative">
                      <select 
                        value={formData.industria}
                        onChange={(e) => setFormData({...formData, industria: e.target.value})}
                        className="w-full bg-[#1A1A3A] border border-white/10 rounded-xl px-4 py-3.5 focus:border-primary/50 focus:bg-white/10 transition-all outline-none text-white cursor-pointer appearance-none"
                      >
                        <option value="Tecnología">Tecnología</option>
                        <option value="E-commerce">E-commerce</option>
                        <option value="Inmobiliaria">Inmobiliaria</option>
                        <option value="Salud">Salud</option>
                        <option value="Otros">Otros</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                        ▼
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1.5 ml-1">¿Cuál es tu mayor desafío actual?</label>
                  <textarea 
                    required
                    value={formData.desafio}
                    onChange={(e) => setFormData({...formData, desafio: e.target.value})}
                    rows={3} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus:border-primary/50 focus:bg-white/10 transition-all outline-none resize-none" 
                    placeholder="Cuéntanos brevemente qué proceso te gustaría optimizar..."
                  ></textarea>
                </div>
                
                <button 
                  disabled={isSubmitting}
                  type="submit" 
                  className={`w-full bg-primary hover:bg-primary/80 py-4.5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-primary/20 ${isSubmitting ? 'opacity-50 cursor-not-allowed translate-y-1' : 'active:scale-95'}`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar Solicitud
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
          
          <p className="text-center text-white/20 text-xs mt-6 relative z-10">
            Responderemos en menos de 24 horas hábiles.
          </p>
        </div>
      </div>
    </main>
  );
}


