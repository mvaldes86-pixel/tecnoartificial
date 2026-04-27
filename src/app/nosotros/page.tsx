import Navbar from "@/components/Navbar";
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
      
      <footer className="py-24 border-t border-white/5 px-6 text-center">
        <p>&copy; 2026 TecnoArtificial. Liderando la optimización con IA.</p>
      </footer>
    </main>
  );
}
