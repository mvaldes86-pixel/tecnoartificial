import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Rate limiting best-effort en memoria (por instancia serverless). No es infalible
// —para algo robusto conviene Vercel BotID/WAF— pero corta ráfagas de spam básicas.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 4;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > MAX_PER_WINDOW;
}

// Escapa el input del usuario antes de incrustarlo en el HTML del correo, para que
// nadie pueda inyectar markup/enlaces de phishing en los emails que enviamos.
function esc(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function bad(message: string) {
  return NextResponse.json({ success: false, error: 'VALIDATION', message }, { status: 400 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { nombre, email, whatsapp, empresa, desafio, industria, website } = body || {};

    // Honeypot: los bots rellenan campos ocultos que un humano nunca ve. Fingimos
    // éxito y descartamos silenciosamente (no gastamos envíos ni alertamos).
    if (typeof website === 'string' && website.trim() !== '') {
      return NextResponse.json({ success: true, resendId: 'ok' });
    }

    // Límite por IP (anti-spam / anti-abuso del dominio).
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
    if (rateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: 'RATE_LIMIT', message: 'Demasiados envíos. Intenta de nuevo en unos minutos.' },
        { status: 429 }
      );
    }

    // Validación de entrada.
    const nom = String(nombre ?? '').trim();
    const mail = String(email ?? '').trim();
    const wsp = String(whatsapp ?? '').trim();
    const emp = String(empresa ?? '').trim();
    const des = String(desafio ?? '').trim();
    const ind = String(industria ?? '').trim().slice(0, 60) || 'No indicada';
    const digits = wsp.replace(/[^0-9]/g, '');

    if (nom.length < 2 || nom.length > 100) return bad('Ingresa tu nombre completo.');
    if (!EMAIL_RE.test(mail) || mail.length > 150) return bad('Ingresa un correo válido.');
    if (digits.length < 8 || digits.length > 15) return bad('Ingresa un WhatsApp válido.');
    if (emp.length < 1 || emp.length > 120) return bad('Ingresa el nombre de tu empresa.');
    if (des.length < 1 || des.length > 2000) return bad('Cuéntanos tu desafío (máx. 2000 caracteres).');

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'MISSING_KEY' }, { status: 500 });
    }

    const tecnoWhatsapp = '+56920293667';

    // 1. EMAIL PARA ADMIN
    const adminHtml = `
      <div style="font-family: sans-serif; background-color: #f4f7ff; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
          <div style="background-color: #0A0A1F; padding: 30px; text-align: center;">
            <h1 style="color: #6366F1; margin: 0; font-size: 24px;">TecnoArtificial</h1>
            <p style="color: rgba(255,255,255,0.6); margin: 5px 0 0 0; font-size: 14px;">Nueva Solicitud Detectada</p>
          </div>
          <div style="padding: 40px;">
            <div style="margin-bottom: 25px;">
              <label style="display: block; font-size: 11px; font-weight: 800; color: #6366F1; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Cliente</label>
              <div style="font-size: 18px; color: #1f2937; font-weight: 600;">${esc(nom)}</div>
            </div>
            <div style="margin-bottom: 25px;">
              <label style="display: block; font-size: 11px; font-weight: 800; color: #9ca3af; text-transform: uppercase; margin-bottom: 5px;">Empresa / Email / Industria</label>
              <div style="color: #4b5563;">${esc(emp)} | ${esc(mail)} | ${esc(ind)}</div>
            </div>
            <div style="margin-bottom: 35px;">
              <label style="display: block; font-size: 11px; font-weight: 800; color: #9ca3af; text-transform: uppercase; margin-bottom: 10px;">Desafío</label>
              <div style="background-color: #f9fafb; padding: 20px; border-radius: 12px; border-left: 4px solid #6366F1; color: #374151;">
                "${esc(des)}"
              </div>
            </div>
            <a href="https://wa.me/${digits}" style="display: block; background-color: #6366F1; color: #ffffff; text-align: center; padding: 18px; border-radius: 12px; text-decoration: none; font-weight: 700;">
              Contactar al Cliente (${esc(wsp)})
            </a>
          </div>
        </div>
      </div>
    `;

    await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        from: 'TecnoArtificial <contacto@tecnoartificial.com>',
        to: ['mvaldes@tecnoartificial.com', 'contacto@tecnoartificial.com'],
        subject: `🚀 Lead: ${emp} (${nom})`,
        html: adminHtml,
      }),
    });

    // 2. EMAIL PARA CLIENTE (a la dirección ya validada)
    const primerNombre = esc(nom.split(' ')[0] || nom);
    const clientHtml = `
      <div style="font-family: sans-serif; background-color: #0A0A1F; padding: 40px 20px; color: #ffffff;">
        <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(145deg, #16163a, #0A0A1F); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 24px; overflow: hidden; padding: 40px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="font-size: 28px; font-weight: 900; color: #ffffff;">Tecno<span style="color: #6366F1;">Artificial</span></div>
          </div>

          <h1 style="font-size: 28px; font-weight: 800; margin-bottom: 20px; text-align: center;">¡Hola ${primerNombre}!</h1>

          <p style="font-size: 16px; line-height: 1.6; color: rgba(255,255,255,0.7); text-align: center; margin-bottom: 30px;">
            Hemos recibido tu solicitud para optimizar los procesos en <strong>${esc(emp)}</strong>. <br/>
            Nuestro equipo analizará tu caso y te contactará en menos de 24 horas.
          </p>

          <div style="text-align: center; margin-bottom: 40px;">
            <p style="font-size: 14px; color: rgba(255,255,255,0.5); margin-bottom: 15px;">¿Quieres acelerar el proceso?</p>
            <a href="https://wa.me/${tecnoWhatsapp.replace('+', '')}" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 100px; font-weight: 700; font-size: 15px;">
              Hablar con el equipo de TecnoArtificial
            </a>
          </div>

          <div style="background: rgba(99, 102, 241, 0.05); border: 1px solid rgba(99, 102, 241, 0.1); border-radius: 20px; padding: 30px;">
            <h3 style="color: #6366F1; margin-top: 0; font-size: 13px; text-transform: uppercase;">Próximos pasos</h3>
            <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin: 0;">
              ✓ Auditoría preliminar de procesos.<br/>
              ✓ Identificación de cuellos de botella.<br/>
              ✓ Sesión de estrategia personalizada.
            </p>
          </div>

          <div style="text-align: center; margin-top: 50px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05);">
            <p style="font-size: 11px; color: rgba(255,255,255,0.3);">TecnoArtificial © 2026 | Innovación en Automatización IA</p>
          </div>
        </div>
      </div>
    `;

    const clientResponse = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        from: 'TecnoArtificial <contacto@tecnoartificial.com>',
        to: mail,
        subject: 'Recibimos tu solicitud - TecnoArtificial',
        html: clientHtml,
      }),
    });

    const clientResult = await clientResponse.json().catch(() => ({}));
    return NextResponse.json({ success: true, resendId: clientResult.id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
