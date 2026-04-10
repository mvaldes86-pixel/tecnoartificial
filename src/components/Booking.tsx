import React from 'react';
import { Calendar, Mail, ArrowRight, Video } from 'lucide-react';

export default function Booking() {
  return (
    <section id="consultoria" className="py-24 px-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-5xl mx-auto">
        <div className="glass-card !p-12 border-primary/20 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-6">
                <Video className="w-4 h-4" />
                SESIÓN VÍA GOOGLE MEET
              </div>
              
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight">
                ¿Listo para escalar con IA?
              </h2>
              <p className="text-xl text-white/60 mb-8 leading-relaxed">
                Agenda una consultoría estratégica gratuita. Analizaremos tus procesos actuales y diseñaremos una hoja de ruta para tu transformación digital.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-white/80">
                  <div className="p-2 bg-white/5 rounded-lg">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <span>tecnoartificialoficial@gmail.com</span>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <div className="p-2 bg-white/5 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <span>Lunes a Viernes - Horarios flexibles</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <a 
                href="https://calendar.google.com/calendar/u/2?cid=dGVjbm9hcnRpZmljaWFsb2ZpY2lhbEBnbWFpbC5jb20" 
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-2xl font-black text-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-primary/20"
              >
                Agendar en mi Calendario
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <p className="text-center text-white/40 text-sm">
                * Se creará automáticamente un evento con enlace a Google Meet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
