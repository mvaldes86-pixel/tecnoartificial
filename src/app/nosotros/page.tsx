import Navbar from "@/components/Navbar";
import { Instagram, Facebook } from "lucide-react";
import About from "@/components/About";
import Booking from "@/components/Booking";

export default function NosotrosPage() {
  return (
    <main className="relative flex flex-col w-full">
      <Navbar />
      <div className="pt-24">
        <About />
      </div>
      <Booking />
      
      <footer className="py-24 border-t border-white/5 px-6 text-center flex flex-col items-center gap-6">
        <div className="flex gap-6 items-center">
          <a href="https://www.instagram.com/tecnoartificial.spa" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-primary transition-colors">
            <Instagram className="w-6 h-6" />
          </a>
          <a href="https://www.facebook.com/profile.php?id=61586525241049" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-primary transition-colors">
            <Facebook className="w-6 h-6" />
          </a>
        </div>
        <p className="text-white/40 text-sm">Antonio Bellet 193, Of. 1210, Providencia, Santiago, Chile</p>
        <p className="text-white/60">&copy; 2026 TecnoArtificial. Liderando la optimización con IA.</p>
      </footer>
    </main>
  );
}
