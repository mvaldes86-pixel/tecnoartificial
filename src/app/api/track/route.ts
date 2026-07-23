import { NextResponse } from 'next/server';

// Seguimiento de apertura de documentos (cotizaciones, propuestas). Cuando alguien
// ABRE la página en un navegador real, el HTML dispara un ping a este endpoint y
// se envía una alerta a Telegram. Como el ping es por JavaScript, el robot de
// vista previa de WhatsApp/redes NO lo activa (no ejecuta JS) → cada aviso es una
// apertura humana real, no la generación del preview.
export const dynamic = 'force-dynamic';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function dec(v: string | null): string {
  if (!v) return '';
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const docId = searchParams.get('doc') || 'documento';
  const ref = searchParams.get('u') || searchParams.get('ref') || 'sin etiqueta';

  const h = request.headers;
  const loc =
    [dec(h.get('x-vercel-ip-city')), dec(h.get('x-vercel-ip-country-region')), h.get('x-vercel-ip-country')]
      .filter(Boolean)
      .join(', ') || 'ubicación desconocida';
  const ua = (h.get('user-agent') || '').slice(0, 140);
  const when = new Date().toLocaleString('es-CL', {
    timeZone: 'America/Santiago',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
    const text =
      `👀 Abrieron la cotización\n\n` +
      `📄 Documento: ${docId}\n` +
      `🏷️ Enviada a: ${ref}\n` +
      `🕒 ${when} (Santiago)\n` +
      `📍 ${loc}\n` +
      `🧭 ${ua}`;
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, disable_web_page_preview: true }),
    }).catch((error) => console.error('[track] error enviando alerta Telegram:', error));
  } else {
    console.warn('[track] faltan TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID.');
  }

  // Respuesta mínima, sin caché (el navegador la ignora).
  return new NextResponse(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
}
