import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Process from "@/components/Process";

export default function Home() {
  return (
    <main className="relative flex flex-col w-full">
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Process />
      
      <footer className="py-24 border-t border-white/5 px-6 text-center">

        <p>&copy; {new Date().getFullYear()} TecnoArtificial. Liderando la optimización con IA.</p>
      </footer>
    </main>
  );
}
