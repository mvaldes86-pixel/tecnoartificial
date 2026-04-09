import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";

export default function Home() {
  return (
    <main className="relative flex flex-col w-full">
      <Navbar />
      <Hero />
      <Services />
      
      {/* Additional sections can be added here */}
      
      <footer className="py-12 border-t border-white/10 px-6 text-center text-white/40">
        <p>&copy; {new Date().getFullYear()} TecnoArtificial. Liderando la optimización con IA.</p>
      </footer>
    </main>
  );
}
