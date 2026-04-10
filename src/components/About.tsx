import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export default function About() {
  const points = [
    {
      text: <><strong>CEO de TecnoArtificial</strong>, experto en marketing digital y estrategia comercial para negocios que buscan crecer de forma rentable.</>
    },
    {
      text: <>Cuenta con <strong>más de 15 años de experiencia</strong> trabajando con dueños de empresas y equipos comerciales, ayudándolos a entender qué está fallando en su marketing, tomar mejores decisiones y construir estrategias más claras antes de invertir más dinero en publicidad.</>
    },
    {
      text: <>Junto a su empresa, ha acompañado a múltiples negocios a <strong>ganar claridad, enfoque y dirección en su marketing</strong>, evitando errores comunes y decisiones improvisadas.</>
    }
  ];

  return (
    <section id="nosotros" className="py-24 px-6 bg-[#0A0A1F]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <span className="block text-sm font-black text-white/40 uppercase tracking-[0.3em] mb-4">
              Quién te invita a la sesión
            </span>
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-10 leading-tight">
              Manuel Valdés Alegría
            </h2>
            
            <div className="space-y-8">
              {points.map((point, i) => (
                <div key={i} className="flex gap-4 items-start group">
                  <div className="mt-1 flex-shrink-0">
                    <CheckCircle2 className="text-primary w-6 h-6" />
                  </div>
                  <p className="text-white/70 text-lg leading-relaxed group-hover:text-white transition-colors">
                    {point.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative p-2 rounded-[2.5rem] bg-primary shadow-[0_0_50px_rgba(99,102,241,0.2)]">
              <div className="relative w-full aspect-[4/5] md:w-[450px] rounded-[2rem] overflow-hidden bg-white/5">
                <Image 
                  src="/images/nosotros.png"
                  alt="Manuel Valdés Alegría - TecnoArtificial"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

