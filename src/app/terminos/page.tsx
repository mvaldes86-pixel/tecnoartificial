import Link from 'next/link';
import { Cpu } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos de Servicio — TecnoArtificial',
  description: 'Términos y condiciones de uso de los servicios de TecnoArtificial SpA.',
  robots: { index: false, follow: false },
};

export default function TerminosPage() {
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
        <h1 className="font-display text-4xl font-black mb-3">Términos de Servicio</h1>
        <p className="text-white/40 text-sm mb-12">Última actualización: 4 de junio de 2026</p>

        <div className="space-y-10 text-white/70 leading-relaxed">

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-4">1. Aceptación de los Términos</h2>
            <p>
              Al acceder y utilizar el sitio web <strong className="text-white">tecnoartificial.com</strong> o contratar
              cualquiera de los servicios ofrecidos por <strong className="text-white">TecnoArtificial SpA</strong>
              (en adelante &ldquo;TecnoArtificial&rdquo;), usted acepta íntegramente los presentes Términos de Servicio.
              Si no está de acuerdo con alguno de estos términos, le rogamos que no utilice nuestros servicios.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-4">2. Descripción de los Servicios</h2>
            <p>TecnoArtificial ofrece servicios de tecnología e inteligencia artificial para empresas, que incluyen:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li><strong className="text-white">Marketing de Alta Conversión:</strong> automatización de campañas publicitarias digitales, gestión de anuncios en plataformas como Meta (Facebook/Instagram), generación de leads calificados y optimización SEO.</li>
              <li><strong className="text-white">Eficiencia Operacional 360°:</strong> diseño e implementación de agentes autónomos, desarrollo de APIs personalizadas, automatización de procesos internos e integraciones con modelos de inteligencia artificial.</li>
              <li><strong className="text-white">Consultoría:</strong> sesiones de asesoría estratégica en transformación digital e implementación de IA.</li>
            </ul>
            <p className="mt-3">
              Los alcances específicos, plazos y condiciones de cada proyecto se establecen en una propuesta o contrato
              de servicios suscrito entre las partes.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-4">3. Consultoría Gratuita</h2>
            <p>
              TecnoArtificial ofrece una sesión inicial de consultoría sin costo. Esta sesión tiene carácter exploratorio
              y no genera ninguna obligación contractual para ninguna de las partes. TecnoArtificial se reserva el derecho
              de rechazar solicitudes que no se correspondan con el perfil de cliente atendido.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-4">4. Uso del Sitio Web</h2>
            <p>Usted se compromete a utilizar este sitio web únicamente para fines lícitos y a no:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>Realizar actividades que puedan dañar, deshabilitar o sobrecargar la infraestructura del sitio.</li>
              <li>Intentar acceder sin autorización a sistemas, datos o cuentas de TecnoArtificial o de terceros.</li>
              <li>Distribuir malware, spam u otro contenido dañino a través de nuestros canales de contacto.</li>
              <li>Reproducir, copiar o explotar comercialmente cualquier contenido del sitio sin autorización expresa.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-4">5. Propiedad Intelectual</h2>
            <p>
              Todos los contenidos del sitio web (textos, imágenes, logotipos, código, diseños y materiales) son
              propiedad exclusiva de TecnoArtificial SpA o de sus licenciantes, y están protegidos por las leyes
              de propiedad intelectual e industrial vigentes en Chile y tratados internacionales aplicables.
            </p>
            <p className="mt-3">
              Respecto a los proyectos desarrollados para clientes, la propiedad intelectual del producto final
              entregado será acordada expresamente en el contrato de servicios correspondiente.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-4">6. Confidencialidad</h2>
            <p>
              TecnoArtificial se compromete a mantener la confidencialidad de la información de negocio que los
              clientes compartan durante la relación comercial. Esta obligación no aplica a información que sea
              de dominio público, que deba divulgarse por mandato legal, o que el cliente haya autorizado expresamente
              a compartir.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-4">7. Limitación de Responsabilidad</h2>
            <p>
              TecnoArtificial no será responsable por daños indirectos, incidentales, especiales o consecuentes
              que puedan derivarse del uso o imposibilidad de uso del sitio web o de los servicios contratados,
              incluyendo pérdidas de beneficios o datos. En ningún caso la responsabilidad total de TecnoArtificial
              excederá el monto efectivamente pagado por el cliente en el período de tres meses anteriores al
              evento que originó el reclamo.
            </p>
            <p className="mt-3">
              TecnoArtificial no garantiza resultados específicos en términos de ventas, conversiones o posicionamiento
              derivados de los servicios de marketing, dado que dichos resultados dependen de múltiples factores externos.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-4">8. Pagos y Facturación</h2>
            <p>
              Las condiciones de pago, precios y modalidades de facturación se establecen en la propuesta comercial
              o contrato específico acordado con cada cliente. TecnoArtificial emite documentos tributarios conforme
              a la legislación tributaria chilena vigente.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-4">9. Modificación y Terminación</h2>
            <p>
              TecnoArtificial se reserva el derecho de modificar estos Términos de Servicio en cualquier momento.
              Los cambios serán publicados en esta página con indicación de la fecha de actualización. El uso
              continuado de los servicios tras la publicación de cambios implica la aceptación de los nuevos términos.
            </p>
            <p className="mt-3">
              TecnoArtificial podrá suspender o terminar el acceso al sitio web a usuarios que incumplan estos términos,
              sin previo aviso y sin responsabilidad.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-4">10. Ley Aplicable y Jurisdicción</h2>
            <p>
              Estos Términos de Servicio se rigen por las leyes de la República de Chile. Cualquier controversia
              derivada de su interpretación o aplicación será sometida a los Tribunales de Justicia de Santiago de Chile,
              salvo que las partes acuerden expresamente otro mecanismo de resolución de conflictos.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-4">11. Contacto</h2>
            <p>
              Para consultas sobre estos Términos de Servicio, puede contactarnos en:{' '}
              <a href="mailto:contacto@tecnoartificial.com" className="text-primary hover:underline">
                contacto@tecnoartificial.com
              </a>{' '}
              o a través de nuestro WhatsApp:{' '}
              <a href="https://wa.me/56920293667" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                +56 9 2029 3667
              </a>.
            </p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/30 text-sm">
          <p>© 2026 TecnoArtificial SpA. Todos los derechos reservados. · Antonio Bellet 193, Of. 1210, Providencia, Santiago, Chile</p>
          <div className="flex gap-6">
            <Link href="/privacidad" className="hover:text-white/60 transition-colors">Política de Privacidad</Link>
            <Link href="/" className="hover:text-white/60 transition-colors">Volver al inicio</Link>
          </div>
        </div>
      </article>
    </main>
  );
}
