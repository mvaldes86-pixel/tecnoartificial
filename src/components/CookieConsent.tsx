'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Banner de cookies en modo CONSENTIMIENTO IMPLÍCITO (opt-out): el Meta Pixel se
// carga de inmediato para conservar la cobertura de tracking, y el banner informa.
// Si el visitante hace clic en "Rechazar", se revoca el consentimiento y se
// recuerda para próximas visitas (no se vuelve a cargar). Cumple el estándar
// habitual en Chile (Ley 19.628). Para volver a opt-in estricto, cargar el pixel
// solo cuando choice === 'granted'.
const PIXEL_ID = '1428411498841708';
const STORAGE_KEY = 'ta_cookie_consent';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fbq?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _fbq?: any;
  }
}

function loadMetaPixel() {
  if (typeof window === 'undefined' || window.fbq) return;
  /* eslint-disable */
  (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */
  window.fbq('init', PIXEL_ID);
  window.fbq('track', 'PageView');
}

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let choice: string | null = null;
    try {
      choice = localStorage.getItem(STORAGE_KEY);
    } catch {}
    // Implícito: cargamos el pixel salvo que haya rechazo explícito.
    if (choice !== 'denied') {
      loadMetaPixel();
    }
    // El banner informativo solo se muestra si aún no eligió.
    if (choice === null) {
      setShow(true);
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'granted');
    } catch {}
    setShow(false);
  };

  const reject = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'denied');
    } catch {}
    // Revoca el consentimiento para detener eventos posteriores en esta sesión.
    try {
      if (window.fbq) window.fbq('consent', 'revoke');
    } catch {}
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed bottom-4 left-4 z-[9998] max-w-sm bg-[#12122b] border border-white/10 rounded-2xl shadow-2xl p-5 text-white animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <p className="text-sm text-white/70 leading-relaxed">
        Usamos cookies propias y de terceros (Meta Pixel) para medir y mejorar nuestra
        publicidad. Al seguir navegando, aceptas su uso. Puedes rechazarlas o leer más en
        nuestra{' '}
        <Link href="/privacidad" className="text-primary hover:underline">
          política de privacidad
        </Link>
        .
      </p>
      <div className="flex gap-3 mt-4">
        <button
          onClick={accept}
          className="flex-1 bg-primary hover:bg-primary/90 transition-colors rounded-xl px-4 py-2.5 text-sm font-bold"
        >
          Aceptar
        </button>
        <button
          onClick={reject}
          className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors rounded-xl px-4 py-2.5 text-sm font-semibold text-white/80"
        >
          Rechazar
        </button>
      </div>
    </div>
  );
}
