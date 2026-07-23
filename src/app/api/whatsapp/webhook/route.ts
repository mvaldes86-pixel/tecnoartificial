import { NextResponse } from 'next/server';
import crypto from 'crypto';
import Anthropic from '@anthropic-ai/sdk';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getAdminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'tecnoartificial_verify_token';
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_APP_SECRET = process.env.WHATSAPP_APP_SECRET;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
// Alertas por Telegram (canal fiable para avisar a Manuel: sin ventana de 24h ni
// plantillas, a diferencia de WhatsApp). TELEGRAM_CHAT_ID = chat de Manuel con el bot.
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const GRAPH_API_VERSION = 'v21.0';
const MAX_HISTORY = 20;
const CALENDAR_LINK = 'https://calendar.app.google/Ag4TCcUv2KxATUAe9';
// Número PERSONAL de Manuel donde LLEGAN las alertas de leads calificados.
// OJO: NO debe ser el número del bot/negocio (56920293667). El bot envía DESDE
// ese número, así que si MANU_WA fuera el mismo, el bot se enviaría mensajes a
// sí mismo y las alertas no llegarían. Debe ser un WhatsApp que Manuel lea.
const MANU_WA = '56933472864';

// Enlace wa.me al WhatsApp de Manuel con mensaje prellenado. Se le entrega al
// CLIENTE para que sea ÉL quien inicie el contacto (así Manuel nunca escribe en
// frío y no cae en bloqueos de WhatsApp).
const MANU_WA_LINK = `https://wa.me/${MANU_WA}?text=${encodeURIComponent(
  'Hola 👋 Vengo del asistente de TecnoArtificial y quiero avanzar con un proyecto.'
)}`;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface LeadProfile {
  nombre: string;
  empresa: string;
  industria: string;
  desafio: string;
  presupuesto: string;
  urgencia: string;
  score: number;
  fase: string;
  derivado: boolean;
}

interface ExtractedData {
  nombre?: string;
  empresa?: string;
  industria?: string;
  desafio?: string;
  presupuesto?: string;
  urgencia?: string;
  score?: number | string;
  fase?: string;
  derivado?: boolean | string;
}

const DEFAULT_LEAD: LeadProfile = {
  nombre: '', empresa: '', industria: '', desafio: '', presupuesto: '', urgencia: '',
  score: 0, fase: 'inicio', derivado: false,
};

const QUALIFYING_KEYWORDS = [
  'AGENDAR', 'REUNION', 'REUNIÓN', 'COTIZAR', 'COTIZACION', 'COTIZACIÓN', 'PRECIO',
  'CUANTO CUESTA', 'CUÁNTO CUESTA', 'LLAMADA', 'HABLAR CON ALGUIEN', 'CONTRATAR', 'PROPUESTA',
];

function buildSystemPrompt(lead: LeadProfile): string {
  return `Eres el asistente virtual de ventas de TecnoArtificial (tecnoartificial.com), una empresa chilena de tecnología con sede en Providencia, Santiago. Diseñamos soluciones a la medida que combinan inteligencia artificial, automatización y desarrollo de software para que las empresas vendan más, ahorren tiempo y operen mejor.

## QUÉ HACEMOS Y OFRECEMOS
1. Automatización de procesos: eliminamos tareas repetitivas y conectamos tus herramientas (CRMs, planillas, correos, sistemas internos, pagos) con flujos automáticos y APIs personalizadas. Menos trabajo manual, menos errores, más horas libres.
2. Desarrollo de aplicaciones y sistemas a medida: creamos apps web y móviles, plataformas, portales, dashboards, e-commerce y sistemas internos hechos exactamente para tu negocio.
3. Agentes de IA y bots inteligentes: construimos bots de WhatsApp y agentes autónomos con IA (como este que te atiende ahora) que responden, califican clientes y venden 24/7 sin intervención humana.
4. Marketing digital de alta conversión: campañas en Meta (Facebook e Instagram), generación de leads calificados y optimización SEO para que te encuentren en Google.

Entregamos soluciones integrales de punta a punta: desde la idea hasta el sistema funcionando, con IA de última generación. Muchos clientes combinan varios de estos servicios.

## CASO DE ÉXITO REAL (menciónalo AL MENOS UNA VEZ cuando el cliente muestre interés, para dar confianza; pero no lo repitas en cada mensaje)
Para IBI, corredora de propiedades con 17 años en Santiago, construimos un agente de WhatsApp con IA que en 2 meses atendió a 1.587 personas sin intervención humana y derivó 237 leads calificados (14,9%) a un asesor; el 55% de los contactos llegó fuera de horario de oficina y fue atendido al instante.

## VIGENTA.CL — nuestro producto propio (OJO: se maneja DISTINTO a los servicios)
Vigenta.cl es una aplicación creada por TecnoArtificial que reúne TODOS los documentos de un vehículo (permiso de circulación, revisión técnica, seguro/SOAP y padrón) en una tarjeta NFC + código QR, para mostrarlos con un solo toque o escaneando el QR, sin andar con papeles. Se accede por App, QR o tarjeta NFC, y avisa cuando algo está por vencer. Planes: 1 auto $8.990/año · hasta 4 autos $17.990/año · flotas/empresas $3.990 por vehículo al año.
REGLA CLAVE: si el cliente pregunta por Vigenta, por los papeles/documentos de su auto o moto, por la tarjeta NFC del vehículo, o quiere comprarla → esto NO es un servicio a medida y NO se deriva a un asesor. Es una compra directa y autoservicio en el sitio. Explícale breve el beneficio, recomiéndale el plan que le sirva y CIERRA la venta invitándolo a crear su cuenta y comprar directamente en https://www.vigenta.cl. En estos casos NUNCA marques derivado=true; solo entrégale el enlace https://www.vigenta.cl y anímalo a activarla hoy.

## PERFIL DEL LEAD (lo que ya sabes de este cliente)
- Nombre: ${lead.nombre || 'desconocido'}
- Empresa: ${lead.empresa || 'desconocida'}
- Industria: ${lead.industria || 'desconocida'}
- Desafío: ${lead.desafio || 'desconocido'}
- Presupuesto: ${lead.presupuesto || 'desconocido'}
- Urgencia: ${lead.urgencia || 'desconocida'}
- Fase: ${lead.fase}
- Score: ${lead.score}/100
- Ya derivado a un asesor humano: ${lead.derivado}

## AL INICIAR LA CONVERSACIÓN (primer mensaje / saludo)
En tu PRIMER mensaje saluda cálido y breve, preséntate como el asistente de TecnoArtificial y haz DOS cosas a la vez:
1. Pregúntale en qué le puedes ayudar / qué necesita o qué le gustaría automatizar o crear (para entender su proyecto).
2. Ofrécele explícitamente la opción RÁPIDA: dile que si prefiere una cotización más rápida, le puedes pasar el contacto directo de nuestro equipo para que hable al instante por WhatsApp. Invítalo a que escriba "contacto" si quiere esa vía.
Deja que el cliente elija: contarte su necesidad aquí, o ir directo al contacto. Ejemplo: "¡Hola! 👋 Soy el asistente de TecnoArtificial. Cuéntame, ¿qué necesitas o qué te gustaría automatizar o crear? 😊 Y si prefieres una cotización más rápida, escribe *contacto* y te paso el WhatsApp directo de nuestro equipo para avanzar al tiro."
NO escribas tú el link ni el número en el saludo: solo OFRECE la opción. Si el cliente la acepta, el sistema enviará el contacto automáticamente justo después de tu mensaje.

## TU OBJETIVO EN CADA MENSAJE
1. Responde breve, cercano y profesional (estilo chat, frases cortas, sin bloques largos de texto).
2. Entiende qué necesita el cliente. Si aún no lo sabes, averígualo con naturalidad (máximo 1 pregunta por mensaje, no interrogues). Identifica cuál de nuestros servicios encaja mejor: ¿quiere (a) automatizar un proceso o tarea que hoy hace a mano, (b) crear una app o sistema a medida, (c) un bot o agente de IA que atienda o venda por él, o (d) conseguir más clientes con marketing y campañas? Pregunta también por su rubro/empresa.
3. Conecta su problema o meta con el servicio relevante de TecnoArtificial y explícale en una o dos frases cómo lo resolveríamos.
4. A lo largo de la conversación CALIFICA al lead: consigue de forma natural (sin interrogar, intercalando contenido de valor) estos datos clave: nombre de la persona + nombre de su empresa (pídelos JUNTOS en una sola pregunta para agilizar, ej. "¿cómo te llamas y de qué empresa nos escribes?"), rubro, presupuesto aproximado y urgencia (para cuándo lo necesita). Evita repetir la misma pregunta: si el cliente responde otro dato, reconócelo y pide el que falta.
5. Sube el score (0-100) según qué tan calificado está el lead: tiene un problema o meta concreto, mencionó presupuesto o urgencia, parece ser quien decide.

## CUÁNDO DERIVAR A UN ASESOR (derivado=true)
- ANTES de derivar, intenta tener capturados al menos: nombre + empresa + (presupuesto O urgencia). Normalmente ya tendrás el desafío/rubro.
- Si el cliente pide cotizar, agendar o hablar con alguien pero aún faltan esos datos, primero haz UNA pregunta breve y amable para conseguir el dato que falte (por ejemplo: "¡Genial! 🙌 Antes de conectarte con un especialista, ¿cómo te llamas y de qué empresa nos escribes? ¿Tienes un presupuesto o plazo en mente?"). Recién cuando tengas esos datos, marca derivado=true.
- NUNCA marques derivado=true si nombre y empresa están vacíos, salvo que el cliente se resista a dar datos e insista en el contacto (mejor no perderlo).
- ATAJO DE CONTACTO: si el cliente pide el contacto directo, escribe "contacto", quiere hablar directo con el equipo o pide la cotización rápida, pídele PRIMERO su nombre y su empresa en UNA sola pregunta breve y amable (ej.: "¡Genial! 🙌 Para pasarte el contacto directo, ¿cómo te llamas y de qué empresa nos escribes?"). En cuanto tengas nombre + empresa, marca derivado=true y el sistema le enviará el contacto automáticamente. NO pidas presupuesto ni urgencia para el atajo: con nombre y empresa basta. Si el cliente se resiste a dar el nombre pero insiste en el contacto, deriva igual (no lo pierdas).
- EXCEPCIÓN: si el cliente insiste en hablar con una persona o claramente se resiste a dar datos, deriva igual (no lo pierdas) aunque falten algunos datos.
- Cuando marques derivado=true, tu mensaje debe INVITAR al cliente a seguir por el contacto directo: dile que le dejas el contacto para que TE ESCRIBA por WhatsApp o TE LLAME directamente y así avanzar rápido con la propuesta (ejemplo: "¡Listo Alejandro! Te dejo el contacto directo para que me escribas o me llames y afinamos la propuesta 🙌"). NUNCA digas "te contactarán", "te llamarán" ni "un especialista te escribirá" (evita el contacto en frío): SIEMPRE es el cliente quien inicia. Si el cliente quiere algo más rápido o concreto, invítalo a LLAMAR directamente. NO escribas tú el link ni el número: el sistema los enviará automáticamente justo después de tu mensaje.

## REGLAS
- No inventes precios, plazos ni detalles técnicos que no conozcas.
- Cada proyecto es a medida: si preguntan "¿cuánto cuesta?", explica que depende del alcance y ofrece agendar una consultoría gratuita para cotizarlo bien.
- Si la duda es muy específica o el cliente prefiere hablar con una persona, ofrece el contacto directo de TecnoArtificial: +56 9 2029 3667.
- Responde siempre en español, salvo que el cliente escriba en otro idioma.

## FORMATO DE RESPUESTA OBLIGATORIO
Escribe tu mensaje normalmente. Al final SIEMPRE agrega, en una línea aparte:
<data>{"nombre":"","empresa":"","industria":"","desafio":"","presupuesto":"","urgencia":"","score":0,"fase":"inicio","derivado":false}</data>

Completa solo los campos que el cliente mencionó explícitamente en este mensaje o que cambiaron. Deja vacío lo que no sabes. No inventes datos.`;
}

function isValidSignature(rawBody: string, signature: string | null): boolean {
  if (!WHATSAPP_APP_SECRET) {
    // Fail-closed: sin secret NO se puede verificar el origen, así que rechazamos
    // en vez de aceptar cualquier POST (evita inyección de leads falsos).
    console.error('WHATSAPP_APP_SECRET no configurado: rechazando webhook por seguridad.');
    return false;
  }
  if (!signature) return false;

  const expected = 'sha256=' + crypto.createHmac('sha256', WHATSAPP_APP_SECRET).update(rawBody).digest('hex');
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return false;
  return crypto.timingSafeEqual(sigBuf, expBuf);
}

// Reintenta una operación con backoff. Los fallos transitorios de Firestore
// (que antes se perdían en silencio y hacían desaparecer leads del CRM) ahora
// se reintentan antes de rendirse. Ver el incidente del lead "Constructora Andes".
async function withRetry<T>(fn: () => Promise<T>, tries = 3): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      await new Promise((r) => setTimeout(r, 300 * (i + 1)));
    }
  }
  throw lastError;
}

async function getHistory(phone: string): Promise<ChatMessage[]> {
  try {
    const admin = getAdminDb();
    if (admin) {
      const snap = await admin.collection('whatsapp_conversations').doc(phone).get();
      return snap.exists ? ((snap.data()?.messages as ChatMessage[]) ?? []) : [];
    }
    const snap = await getDoc(doc(db, 'whatsapp_conversations', phone));
    return snap.exists() ? (snap.data().messages as ChatMessage[]) || [] : [];
  } catch (error) {
    console.error('No se pudo leer el historial de Firestore:', error);
    return [];
  }
}

async function saveHistory(phone: string, messages: ChatMessage[]) {
  const trimmed = messages.slice(-MAX_HISTORY);
  try {
    const admin = getAdminDb();
    await withRetry(async () => {
      if (admin) {
        await admin
          .collection('whatsapp_conversations')
          .doc(phone)
          .set({ messages: trimmed, updatedAt: FieldValue.serverTimestamp() });
      } else {
        await setDoc(doc(db, 'whatsapp_conversations', phone), {
          messages: trimmed,
          updatedAt: serverTimestamp(),
        });
      }
    });
  } catch (error) {
    console.error('CRÍTICO: no se pudo guardar el historial tras reintentos:', phone, error);
  }
}

async function getLead(phone: string): Promise<LeadProfile> {
  try {
    const admin = getAdminDb();
    const data = admin
      ? (await admin.collection('whatsapp_leads').doc(phone).get()).data()
      : (await getDoc(doc(db, 'whatsapp_leads', phone))).data();
    if (!data) return { ...DEFAULT_LEAD };
    return {
      nombre: data.nombre || '',
      empresa: data.empresa || '',
      industria: data.industria || '',
      desafio: data.desafio || '',
      presupuesto: data.presupuesto || '',
      urgencia: data.urgencia || '',
      score: data.score || 0,
      fase: data.fase || 'inicio',
      derivado: data.derivado === true,
    };
  } catch (error) {
    console.error('No se pudo leer el lead de Firestore:', error);
    return { ...DEFAULT_LEAD };
  }
}

async function saveLead(phone: string, lead: LeadProfile) {
  try {
    const admin = getAdminDb();
    await withRetry(async () => {
      if (admin) {
        await admin
          .collection('whatsapp_leads')
          .doc(phone)
          .set({ ...lead, telefono: phone, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      } else {
        await setDoc(
          doc(db, 'whatsapp_leads', phone),
          { ...lead, telefono: phone, updatedAt: serverTimestamp() },
          { merge: true }
        );
      }
    });
  } catch (error) {
    console.error('CRÍTICO: no se pudo guardar el lead tras reintentos:', phone, error);
  }
}

async function askClaude(history: ChatMessage[], lead: LeadProfile): Promise<{ message: string; extracted: ExtractedData }> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 600,
    system: buildSystemPrompt(lead),
    messages: history,
  });

  const block = response.content[0];
  const raw = block.type === 'text' ? block.text : '';
  if (!raw) {
    return { message: 'Disculpa, no pude generar una respuesta. ¿Puedes repetir tu mensaje?', extracted: {} };
  }

  const match = raw.match(/<data>([\s\S]*?)<\/data>/i);
  let extracted: ExtractedData = {};
  let message = raw;
  if (match) {
    try {
      extracted = JSON.parse(match[1].trim());
    } catch (error) {
      console.error('No se pudo parsear <data> de Claude:', error);
    }
    message = raw.replace(/<data>[\s\S]*?<\/data>/gi, '').trim();
  }
  return { message, extracted };
}

function quiereAgendarOCotizar(text: string): boolean {
  const upper = text.toUpperCase();
  return QUALIFYING_KEYWORDS.some((k) => upper.includes(k));
}

// Atajo de contacto: el cliente pide EXPLÍCITAMENTE el contacto directo / la vía
// rápida. El bot le pide nombre + empresa y recién ahí le entrega el WhatsApp de
// Manuel. Como el enlace es wa.me, es el CLIENTE quien inicia el chat → Manuel
// nunca escribe en frío y no cae en bloqueos.
const CONTACT_REQUEST_KEYWORDS = [
  'CONTACTO', 'TU NUMERO', 'TU NÚMERO', 'NUMERO DIRECTO', 'NÚMERO DIRECTO',
  'TU WHATSAPP', 'WHATSAPP DIRECTO', 'HABLAR DIRECTO', 'PASAME EL', 'PÁSAME EL',
  'DAME EL CONTACTO', 'DAME TU', 'COTIZACION RAPIDA', 'COTIZACIÓN RÁPIDA',
];
function pideContactoDirecto(text: string): boolean {
  const upper = text.toUpperCase();
  return CONTACT_REQUEST_KEYWORDS.some((k) => upper.includes(k));
}

async function sendWhatsAppMessage(to: string, text: string) {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    console.error('Faltan WHATSAPP_TOKEN o WHATSAPP_PHONE_NUMBER_ID en las variables de entorno.');
    return;
  }

  const res = await fetch(`https://graph.facebook.com/${GRAPH_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text },
    }),
  });

  if (!res.ok) {
    console.error('Error enviando mensaje de WhatsApp:', await res.text());
  }
}

async function sendTelegramMessage(text: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, disable_web_page_preview: true }),
  });
  if (!res.ok) {
    console.error('Error enviando alerta por Telegram:', await res.text());
  }
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Transcript de la conversación para incluirlo en las alertas: así, aunque
// Firestore falle, Manuel siempre puede leer TODO lo que dijo el cliente.
function formatTranscript(history: ChatMessage[]): string {
  return history
    .map((m) => `${m.role === 'user' ? '👤 Cliente' : '🤖 Bot'}: ${m.content}`)
    .join('\n\n');
}

async function sendLeadAlertEmail(phone: string, lead: LeadProfile, history: ChatMessage[]) {
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY no configurado: omitiendo alerta por email.');
    return;
  }

  const transcriptHtml = history
    .map((m) => {
      const who = m.role === 'user' ? 'Cliente' : 'Bot';
      const color = m.role === 'user' ? '#111827' : '#6366F1';
      return `<div style="margin-bottom:12px;"><strong style="color:${color}">${who}:</strong> <span style="color:#374151">${escapeHtml(m.content)}</span></div>`;
    })
    .join('');

  const html = `
    <div style="font-family: sans-serif; background-color: #f4f7ff; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
        <div style="background-color: #0A0A1F; padding: 30px; text-align: center;">
          <h1 style="color: #6366F1; margin: 0; font-size: 24px;">TecnoArtificial</h1>
          <p style="color: rgba(255,255,255,0.6); margin: 5px 0 0 0; font-size: 14px;">🔥 Lead calificado por el bot de WhatsApp</p>
        </div>
        <div style="padding: 40px;">
          <div style="margin-bottom: 20px;"><strong>Nombre:</strong> ${lead.nombre || 'sin dato'}</div>
          <div style="margin-bottom: 20px;"><strong>Empresa:</strong> ${lead.empresa || 'sin dato'}</div>
          <div style="margin-bottom: 20px;"><strong>Industria:</strong> ${lead.industria || 'sin dato'}</div>
          <div style="margin-bottom: 20px;"><strong>Desafío:</strong> ${lead.desafio || 'sin dato'}</div>
          <div style="margin-bottom: 20px;"><strong>Presupuesto:</strong> ${lead.presupuesto || 'sin dato'}</div>
          <div style="margin-bottom: 20px;"><strong>Urgencia:</strong> ${lead.urgencia || 'sin dato'}</div>
          <div style="margin-bottom: 30px;"><strong>Score:</strong> ${lead.score}/100</div>
          <a href="https://wa.me/${phone}" style="display: block; background-color: #6366F1; color: #ffffff; text-align: center; padding: 18px; border-radius: 12px; text-decoration: none; font-weight: 700;">
            Hablar por WhatsApp
          </a>
          <p style="text-align:center;color:#6b7280;font-size:13px;margin:12px 0 0;">Número del cliente: +${phone}</p>
          <h2 style="font-size:15px;color:#111827;margin:32px 0 12px;">💬 Conversación completa con el bot</h2>
          <div style="background:#f9fafb;border:1px solid #eeeeee;border-radius:12px;padding:20px;font-size:14px;line-height:1.55;">
            ${transcriptHtml || '<em style="color:#9ca3af">Sin mensajes registrados.</em>'}
          </div>
        </div>
      </div>
    </div>`;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
    body: JSON.stringify({
      from: 'TecnoArtificial Bot <contacto@tecnoartificial.com>',
      to: ['mvaldes@tecnoartificial.com', 'contacto@tecnoartificial.com'],
      subject: `🔥 Lead caliente WhatsApp: ${lead.empresa || lead.nombre || phone}`,
      html,
    }),
  });
}

async function notifyHotLead(phone: string, lead: LeadProfile, history: ChatMessage[]) {
  const summary = `🔥 *Nuevo lead calificado* — Bot TecnoArtificial

👤 Nombre: ${lead.nombre || 'sin dato'}
🏢 Empresa: ${lead.empresa || 'sin dato'}
🏷️ Industria: ${lead.industria || 'sin dato'}
💬 Desafío: ${lead.desafio || 'sin dato'}
💰 Presupuesto: ${lead.presupuesto || 'sin dato'}
⚡ Urgencia: ${lead.urgencia || 'sin dato'}
📊 Score: ${lead.score}/100
📞 Teléfono: +${phone}
📱 WhatsApp: https://wa.me/${phone}`;

  // Telegram limita a 4096 caracteres; si la conversación es larga, mostramos la parte final.
  const transcript = formatTranscript(history);
  const shown = transcript.length > 3500 ? '…' + transcript.slice(-3500) : transcript;
  const telegramText = `${summary.replace(/\*/g, '')}\n\n———\n💬 CONVERSACIÓN:\n\n${shown}`;

  await Promise.all([
    // Telegram: canal principal y fiable (no depende de la ventana de 24h de WhatsApp).
    sendTelegramMessage(telegramText).catch((error) => console.error('Error en alerta Telegram:', error)),
    sendWhatsAppMessage(MANU_WA, summary).catch((error) => console.error('Error en alerta WhatsApp:', error)),
    sendLeadAlertEmail(phone, lead, history).catch((error) => console.error('Error en alerta email:', error)),
  ]);
}

// 1. Verificación del Webhook (Requerido por Meta)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      return new NextResponse(challenge, { status: 200 });
    }
  }
  return new NextResponse('Forbidden', { status: 403 });
}

// 2. Recepción de Mensajes
export async function POST(request: Request) {
  const rawBody = await request.text();

  if (!isValidSignature(rawBody, request.headers.get('x-hub-signature-256'))) {
    console.error('Firma de webhook inválida.');
    return new NextResponse('Forbidden', { status: 403 });
  }

  try {
    const body = JSON.parse(rawBody);

    if (body.object === 'whatsapp_business_account') {
      const value = body.entry?.[0]?.changes?.[0]?.value;
      const message = value?.messages?.[0];

      if (message?.type === 'text') {
        const from = message.from;
        const text = message.text.body;

        console.log(`Mensaje recibido de ${from}: ${text}`);

        const [history, lead] = await Promise.all([getHistory(from), getLead(from)]);
        const updatedHistory: ChatMessage[] = [...history, { role: 'user', content: text }];

        const { message: reply, extracted } = await askClaude(updatedHistory, lead);
        updatedHistory.push({ role: 'assistant', content: reply });

        const yaDerivado = lead.derivado;
        const nombreFinal = extracted.nombre || lead.nombre;
        const empresaFinal = extracted.empresa || lead.empresa;
        const presupuestoFinal = extracted.presupuesto || lead.presupuesto;
        const urgenciaFinal = extracted.urgencia || lead.urgencia;
        // El modelo puede derivar por su cuenta (el prompt ya lo calibra para pedir
        // nombre/empresa/presupuesto/urgencia antes). La derivación por palabra clave
        // solo aplica si ya tenemos datos mínimos, para no cerrar la conversación en frío.
        const tieneDatosMinimos = Boolean(nombreFinal && empresaFinal && (presupuestoFinal || urgenciaFinal));
        const modeloDeriva = extracted.derivado === true || extracted.derivado === 'true';
        // Atajo de contacto: si el cliente pidió el contacto directo (en este o en
        // un mensaje anterior) y ya tenemos su nombre + empresa, se deriva y se le
        // envía el WhatsApp de Manuel. Pedimos nombre+empresa primero (no todos los
        // datos): basta con eso para la vía rápida.
        const pidioContacto = updatedHistory.some(
          (m) => m.role === 'user' && pideContactoDirecto(m.content)
        );
        const tieneNombreEmpresa = Boolean(nombreFinal && empresaFinal);
        const debeDerivarse =
          !yaDerivado &&
          (modeloDeriva ||
            (pidioContacto && tieneNombreEmpresa) ||
            (quiereAgendarOCotizar(text) && tieneDatosMinimos));

        await saveHistory(from, updatedHistory);
        await sendWhatsAppMessage(from, reply);

        const updatedLead: LeadProfile = {
          nombre: nombreFinal,
          empresa: empresaFinal,
          industria: extracted.industria || lead.industria,
          desafio: extracted.desafio || lead.desafio,
          presupuesto: presupuestoFinal,
          urgencia: urgenciaFinal,
          score: Math.max(lead.score, parseInt(String(extracted.score)) || 0),
          fase: debeDerivarse ? 'derivado' : extracted.fase || lead.fase,
          derivado: yaDerivado || debeDerivarse,
        };

        // Persistir el lead ANTES de la alerta: así queda en el CRM aunque la
        // notificación falle, y con reintegros si Firestore tiene un hipo transitorio.
        await saveLead(from, updatedLead);

        if (debeDerivarse) {
          await new Promise((r) => setTimeout(r, 800));
          const contactoMsg = `¡Excelente! 🙌 Te dejo el contacto directo de TecnoArtificial para que avancemos ahora mismo:\n\n💬 Escríbeme por WhatsApp aquí 👇\n${MANU_WA_LINK}\n\n📞 O llámame directo al +56 9 3347 2864 si quieres algo más rápido y concreto.\n\nY si prefieres, agenda una consultoría gratuita:\n📅 ${CALENDAR_LINK}\n\n¡Cuéntame tu caso y lo resolvemos! 🚀`;
          await sendWhatsAppMessage(from, contactoMsg);
          // Registrar el mensaje de contacto en el historial: así queda VISIBLE en
          // el CRM (y en la alerta) que el bot entregó el número/link de Manuel.
          // Antes se enviaba al cliente pero no se guardaba, así que en la ficha del
          // lead no había rastro del handoff.
          updatedHistory.push({ role: 'assistant', content: contactoMsg });
          await saveHistory(from, updatedHistory);
          await notifyHotLead(from, updatedLead, updatedHistory);
        }
      }

      return NextResponse.json({ status: 'ok' });
    }

    return NextResponse.json({ status: 'not a whatsapp message' }, { status: 404 });
  } catch (error) {
    console.error('Error en Webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
