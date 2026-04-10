import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Process from "@/components/Process";
import Portfolio from "@/components/Portfolio";
import Booking from "@/components/Booking";

export default function Home() {
  return (
    <main className="relative flex flex-col w-full">
      <Navbar />
      <Hero />
      <Services />
      <Portfolio />
      <About />
      <Process />
      <Booking />
      
      <footer className="py-24 border-t border-white/5 px-6 text-center">
        <p>&copy; 2026 TecnoArtificial. Liderando la optimización con IA.</p>
      </footer>
    </main>
  );
}


