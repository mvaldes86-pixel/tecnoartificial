'use client';

import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import { CheckCircle2, Send, PartyPopper, ChevronDown } from 'lucide-react';
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const industrias = ["Tecnología", "E-commerce", "Inmobiliaria", "Salud", "Otros"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const emailResponse = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const emailResult = await emailResponse.json();
      
      if (emailResult.success) {
        // Solo si el email fue exitoso, guardamos en DB y mostramos éxito
        addDoc(collection(db, "leads"), {
          ...formData,
          timestamp: serverTimestamp()
        }).catch(err => console.error("Error persistencia:", err));
        
        setIsSuccess(true);
      } else {
        // Si el servidor devolvió un error (ej: falta API KEY), lo mostramos en consola
        console.error("Fallo el envío de email:", emailResult.error, emailResult.message);
        alert(`Error: ${emailResult.message || "No se pudo enviar el correo"}`);
      }
    } catch (error: any) {
      console.error("Error crítico en formulario:", error);
      alert("Hubo un error al procesar tu solicitud. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <main className="min-h-screen bg-[#0A0A1F] text-white">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Branding & Info */}
        <div className="animate-in fade-in slide-in-from-left duration-700">
          <h1 className="font-display text-5xl md:text-7xl font-black mb-8 leading-tight">
            Transforma tu Negocio <br />
            <span className="text-primary italic">Hoy Mismo</span>
          </h1>
          
          <p className="text-xl text-white/60 mb-12 leading-relaxed max-w-lg">
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
        </div>

        {/* Lead Form Section */}
        <div className="glass shadow-2xl rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden min-h-[600px] flex flex-col justify-center animate-in fade-in slide-in-from-right duration-700">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
          
          {isSuccess ? (
            <div className="relative z-10 text-center py-10">
              <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                <PartyPopper className="text-accent w-12 h-12" />
              </div>
              <h2 className="font-display text-4xl font-bold mb-4">¡Solicitud Enviada!</h2>
              <p className="text-white/60 text-lg mb-8 max-w-xs mx-auto">
                Excelente elección. Un consultor experto revisará tu caso y te contactará en las próximas 24 horas.
              </p>
              <a 
                href="/"
                className="inline-block bg-white/10 hover:bg-white/20 px-8 py-3 rounded-full transition-all"
              >
                Volver al inicio
              </a>

            </div>
          ) : (
            <>
              <h2 className="font-display text-3xl font-bold mb-8 relative z-10">Agenda tu sesión</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Nombre Completo</label>
                    <input 
                      required
                      type="text" 
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all outline-none" 
                      placeholder="Juan Pérez" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">WhatsApp</label>
                    <input 
                      required
                      type="tel" 
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all outline-none" 
                      placeholder="+56 9 ..." 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Correo Corporativo</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all outline-none" 
                    placeholder="juan@empresa.com" 
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Empresa</label>
                    <input 
                      required
                      type="text" 
                      value={formData.empresa}
                      onChange={(e) => setFormData({...formData, empresa: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all outline-none" 
                      placeholder="Empresa S.A." 
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Industria</label>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-left flex justify-between items-center focus:ring-2 focus:ring-primary/20"
                    >
                      <span className={formData.industria ? "text-white" : "text-white/40"}>
                        {formData.industria || "Seleccionar..."}
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1A3F] border border-white/20 rounded-2xl overflow-hidden z-[100] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        {industrias.map((ind) => (
                          <button
                            key={ind}
                            type="button"
                            onClick={() => {
                              setFormData({...formData, industria: ind});
                              setIsDropdownOpen(false);
                            }}
                            className="w-full px-5 py-4 text-left hover:bg-primary transition-colors text-sm font-medium"
                          >
                            {ind}
                          </button>
                        ))}
                      </div>
                    )}

                  </div>
                </div>
                
                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">¿Cuál es tu mayor desafío actual?</label>
                  <textarea 
                    required
                    value={formData.desafio}
                    onChange={(e) => setFormData({...formData, desafio: e.target.value})}
                    rows={3} 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all outline-none resize-none" 
                    placeholder="Dinos cómo podemos ayudarte..."
                  ></textarea>
                </div>
                
                <button 
                  disabled={isSubmitting}
                  type="submit" 
                  className={`w-full bg-primary hover:bg-primary/90 py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition-all relative overflow-hidden group shadow-xl shadow-primary/20 ${isSubmitting ? 'cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95'}`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Procesando...</span>
                    </div>
                  ) : (
                    <>
                      <span>Enviar Solicitud</span>
                      <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
          
          <p className="text-center text-white/20 text-xs mt-8 relative z-10">
            Respuesta garantizada en menos de 24 horas hábiles.
          </p>
        </div>
      </div>
    </main>
  );
}


