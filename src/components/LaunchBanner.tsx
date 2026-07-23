import { Nfc, ArrowUpRight } from "lucide-react";

// Aviso de lanzamiento de Vigenta.cl (producto propio de TecnoArtificial).
// Banner destacado que enlaza a la app.
export default function LaunchBanner() {
  return (
    <div className="px-6">
      <a
        href="https://www.vigenta.cl"
        target="_blank"
        rel="noopener noreferrer"
        className="group block max-w-6xl mx-auto my-6 md:my-10"
      >
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-5 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent px-6 py-5 md:px-9 md:py-6 overflow-hidden">
          <div className="flex items-center gap-4">
            <span className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Nfc className="w-6 h-6 text-primary" />
            </span>
            <div>
              <span className="inline-block text-[11px] font-black uppercase tracking-widest text-primary mb-1">
                🚀 Nuevo lanzamiento
              </span>
              <p className="text-white font-bold text-base md:text-lg leading-snug">
                Vigenta.cl — todos los documentos de tu vehículo con tecnología NFC
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 bg-primary group-hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all shadow-lg shadow-primary/20">
            Conócela
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </span>
        </div>
      </a>
    </div>
  );
}
