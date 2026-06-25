import Link from 'next/link';
import { Cpu } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad — TecnoArtificial',
  description: 'Política de privacidad y tratamiento de datos personales de TecnoArtificial SpA.',
  robots: { index: false, follow: false },
};

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-[#0A0A1F] text-white">
      {/* Header mínimo */}
      <header className="border-b border-white/5 px-6 py-5">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors">
            <Cpu className="w-5 h-5 text-primary" />
            <span className="font-display font-bold">TecnoArtificial</span>
          </Link>
        </div>
      </header>

      {/* Contenido */}
      <article className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="font-display text-4xl font-black mb-3">Política de Privacidad</h1>
        <p className="text-white/40 text-sm mb-12">Última actualización: 4 de junio de 2026</p>

        <div className="space-y-10 text-white/70 leading-relaxed">

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-4">1. Identificación del Responsable</h2>
            <p>
              <strong className="text-white">TecnoArtificial SpA</strong> (en adelante &ldquo;TecnoArtificial&rdquo;, &ldquo;nosotros&rdquo; o &ldquo;la empresa&rdquo;),
              con domicilio en Chile, es responsable del tratamiento de los datos personales que usted nos proporcione a través
              de nuestro sitio web <strong className="text-white">tecnoartificial.com</strong> y de nuestras plataformas digitales,
              incluyendo nuestras páginas de Facebook e Instagram.
            </p>
            <p className="mt-3">
              Contacto: <a href="mailto:contacto@tecnoartificial.com" className="text-primary hover:underline">contacto@tecnoartificial.com</a>
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-4">2. Datos que Recopilamos</h2>
            <p>Podemos recopilar los siguientes tipos de datos personales:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li><strong className="text-white">Datos de contacto:</strong> nombre, correo electrónico, número de teléfono o WhatsApp.</li>
              <li><strong className="text-white">Datos de empresa:</strong> nombre de empresa e industria, cuando usted los proporciona.</li>
              <li><strong className="text-white">Datos de navegación:</strong> dirección IP, tipo de navegador, páginas visitadas y tiempo de permanencia, recopilados mediante cookies y el Pixel de Meta.</li>
              <li><strong className="text-white">Comunicaciones:</strong> contenido de mensajes enviados a través de formularios de contacto, WhatsApp Business o redes sociales.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-4">3. Finalidad del Tratamiento</h2>
            <p>Utilizamos sus datos personales para:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>Responder a sus solicitudes de consultoría, cotización o información.</li>
              <li>Gestionar la relación comercial y prestar los servicios contratados.</li>
              <li>Enviar comunicaciones de marketing sobre nuestros servicios, previo consentimiento.</li>
              <li>Mostrar publicidad personalizada a través de Meta (Facebook/Instagram) mediante el Pixel de Meta instalado en nuestro sitio.</li>
              <li>Mejorar nuestros servicios y la experiencia en el sitio web mediante análisis estadísticos.</li>
              <li>Cumplir con obligaciones legales y reglamentarias.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-4">4. Base Legal del Tratamiento</h2>
            <p>
              El tratamiento de sus datos se basa en: (a) su consentimiento expreso al completar formularios o interactuar
              con nuestra publicidad; (b) la ejecución de un contrato o prestación de servicios solicitados; y (c) nuestro
              interés legítimo en mejorar nuestros servicios y comunicar nuestra oferta. Todo ello de conformidad con la
              <strong className="text-white"> Ley N° 19.628</strong> sobre Protección de la Vida Privada de Chile y sus modificaciones vigentes.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-4">5. Uso del Pixel de Meta y Cookies</h2>
            <p>
              Nuestro sitio web utiliza el <strong className="text-white">Pixel de Meta (Facebook Pixel)</strong>, una herramienta de análisis que nos
              permite medir la eficacia de nuestra publicidad, comprender las acciones que realizan los usuarios en el sitio
              y mostrar anuncios relevantes a personas que han visitado nuestro sitio o a audiencias similares.
            </p>
            <p className="mt-3">
              El Pixel recopila información como: visitas a páginas, interacciones con formularios y conversiones. Esta
              información se comparte con Meta Platforms Ireland Ltd. Para más información sobre cómo Meta utiliza estos
              datos, consulte la{' '}
              <a href="https://www.facebook.com/policy.php" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Política de Privacidad de Meta
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-4">6. Compartición de Datos con Terceros</h2>
            <p>No vendemos ni cedemos sus datos personales a terceros. Podemos compartirlos únicamente con:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li><strong className="text-white">Proveedores de servicios tecnológicos</strong> que nos asisten en la operación del sitio (alojamiento web, servicios de email, CRM), bajo acuerdos de confidencialidad.</li>
              <li><strong className="text-white">Meta Platforms</strong> (Facebook/Instagram) para la medición y optimización de campañas publicitarias, conforme a sus políticas.</li>
              <li><strong className="text-white">Autoridades competentes</strong>, cuando sea requerido por ley o resolución judicial.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-4">7. Conservación de los Datos</h2>
            <p>
              Conservamos sus datos personales durante el tiempo necesario para cumplir las finalidades descritas o,
              en su caso, durante el tiempo que exija la relación contractual y las obligaciones legales aplicables.
              Los datos de contacto con fines comerciales se conservan hasta que usted solicite su eliminación.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-4">8. Derechos del Titular</h2>
            <p>De conformidad con la legislación chilena vigente, usted tiene derecho a:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li><strong className="text-white">Acceso:</strong> conocer qué datos personales suyos poseemos.</li>
              <li><strong className="text-white">Rectificación:</strong> corregir datos inexactos o incompletos.</li>
              <li><strong className="text-white">Cancelación/Eliminación:</strong> solicitar la supresión de sus datos cuando ya no sean necesarios.</li>
              <li><strong className="text-white">Oposición:</strong> oponerse al tratamiento de sus datos para fines de marketing directo.</li>
            </ul>
            <p className="mt-3">
              Para ejercer estos derechos, escríbanos a{' '}
              <a href="mailto:contacto@tecnoartificial.com" className="text-primary hover:underline">
                contacto@tecnoartificial.com
              </a>{' '}
              indicando su nombre completo y la solicitud específica. Responderemos en un plazo máximo de 30 días hábiles.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-4">9. Seguridad de los Datos</h2>
            <p>
              TecnoArtificial implementa medidas técnicas y organizativas razonables para proteger sus datos personales
              contra el acceso no autorizado, pérdida, destrucción o divulgación accidental. No obstante, ningún sistema
              de transmisión de datos por internet puede garantizar una seguridad absoluta.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-4">10. Cambios a esta Política</h2>
            <p>
              Podemos actualizar esta Política de Privacidad periódicamente. La versión vigente estará siempre disponible
              en esta URL. Le recomendamos revisarla regularmente. El uso continuado de nuestros servicios tras la
              publicación de cambios implica su aceptación.
            </p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/30 text-sm">
          <p>© 2026 TecnoArtificial SpA. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link href="/terminos" className="hover:text-white/60 transition-colors">Términos de Servicio</Link>
            <Link href="/" className="hover:text-white/60 transition-colors">Volver al inicio</Link>
          </div>
        </div>
      </article>
    </main>
  );
}
