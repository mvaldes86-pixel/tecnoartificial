import { NextResponse } from 'next/server';
import crypto from 'crypto';
import Anthropic from '@anthropic-ai/sdk';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'tecnoartificial_verify_token';
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_APP_SECRET = process.env.WHATSAPP_APP_SECRET;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const GRAPH_API_VERSION = 'v21.0';
const MAX_HISTORY = 20;
const CALENDAR_LINK = 'https://calendar.app.google/Ag4TCcUv2KxATUAe9';
const MANU_WA = '56933472864';

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
  return `Eres el asistente de ventas de TecnoArtificial, una empresa chilena que diseña agentes autónomos de IA y automatiza campañas de marketing y procesos operacionales para empresas.

## SERVICIOS
- Marketing de Alta Conversión: automatización de campañas en Meta, generación de leads calificados, diagnósticos SEO.
- Eficiencia Operacional 360°: agentes autónomos y APIs personalizadas que orquestan procesos internos.

## CASO DE ÉXITO REAL (úsalo solo si aporta a la conversación, no lo repitas en cada mensaje)
Para IBI, corredora de propiedades con 17 años en Santiago, construimos un agente de WhatsApp que en 2 meses atendió a 1.587 personas sin intervención humana y derivó 237 leads calificados (14,9%) a un asesor humano; el 55% de los contactos llegó fuera de horario de oficina y fue atendido al instante.

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

## TU OBJETIVO EN CADA MENSAJE
1. Responde breve, cercano y profesional (estilo chat, frases cortas, sin bloques largos de texto).
2. Si aún no sabes el rubro/empresa del cliente y qué proceso quiere automatizar, pregúntalo con naturalidad (máximo 1 pregunta por mensaje, no interrogues).
3. Conecta el problema del cliente con el servicio relevante de TecnoArtificial.
4. Cuando el cliente muestre interés real (pide cotización, agendar, hablar con alguien, o ya tienes claro el desafío junto con algo de presupuesto o urgencia), marca derivado=true. No menciones ningún link cuando hagas esto — el sistema lo enviará automáticamente.
5. Sube el score (0-100) según qué tan calificado está el lead: tiene un problema concreto que resolver, mencionó presupuesto o urgencia, parece ser quien decide.

## REGLAS
- No inventes precios, plazos ni detalles técnicos que no conozcas.
- Si la duda es muy específica o el cliente prefiere hablar con una persona, ofrece el contacto directo: +56 9 3347 2864.
- Responde siempre en español, salvo que el cliente escriba en otro idioma.

## FORMATO DE RESPUESTA OBLIGATORIO
Escribe tu mensaje normalmente. Al final SIEMPRE agrega, en una línea aparte:
<data>{"nombre":"","empresa":"","industria":"","desafio":"","presupuesto":"","urgencia":"","score":0,"fase":"inicio","derivado":false}</data>

Completa solo los campos que el cliente mencionó explícitamente en este mensaje o que cambiaron. Deja vacío lo que no sabes. No inventes datos.`;
}

function isValidSignature(rawBody: string, signature: string | null): boolean {
  if (!WHATSAPP_APP_SECRET) {
    console.warn('WHATSAPP_APP_SECRET no configurado: omitiendo verificación de firma.');
    return true;
  }
  if (!signature) return false;

  const expected = 'sha256=' + crypto.createHmac('sha256', WHATSAPP_APP_SECRET).update(rawBody).digest('hex');
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return false;
  return crypto.timingSafeEqual(sigBuf, expBuf);
}

async function getHistory(phone: string): Promise<ChatMessage[]> {
  try {
    const snap = await getDoc(doc(db, 'whatsapp_conversations', phone));
    return snap.exists() ? (snap.data().messages as ChatMessage[]) || [] : [];
  } catch (error) {
    console.error('No se pudo leer el historial de Firestore:', error);
    return [];
  }
}

async function saveHistory(phone: string, messages: ChatMessage[]) {
  try {
    await setDoc(doc(db, 'whatsapp_conversations', phone), {
      messages: messages.slice(-MAX_HISTORY),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('No se pudo guardar el historial en Firestore:', error);
  }
}

async function getLead(phone: string): Promise<LeadProfile> {
  try {
    const snap = await getDoc(doc(db, 'whatsapp_leads', phone));
    if (!snap.exists()) return { ...DEFAULT_LEAD };
    const data = snap.data();
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
    await setDoc(
      doc(db, 'whatsapp_leads', phone),
      { ...lead, telefono: phone, updatedAt: serverTimestamp() },
      { merge: true }
    );
  } catch (error) {
    console.error('No se pudo guardar el lead en Firestore:', error);
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

async function sendLeadAlertEmail(phone: string, lead: LeadProfile) {
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY no configurado: omitiendo alerta por email.');
    return;
  }

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

async function notifyHotLead(phone: string, lead: LeadProfile) {
  const summary = `🔥 *Nuevo lead calificado* — Bot TecnoArtificial

👤 Nombre: ${lead.nombre || 'sin dato'}
🏢 Empresa: ${lead.empresa || 'sin dato'}
🏷️ Industria: ${lead.industria || 'sin dato'}
💬 Desafío: ${lead.desafio || 'sin dato'}
💰 Presupuesto: ${lead.presupuesto || 'sin dato'}
⚡ Urgencia: ${lead.urgencia || 'sin dato'}
📊 Score: ${lead.score}/100
📱 WhatsApp: https://wa.me/${phone}`;

  await Promise.all([
    sendWhatsAppMessage(MANU_WA, summary).catch((error) => console.error('Error en alerta WhatsApp:', error)),
    sendLeadAlertEmail(phone, lead).catch((error) => console.error('Error en alerta email:', error)),
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
        const debeDerivarse =
          !yaDerivado && (extracted.derivado === true || extracted.derivado === 'true' || quiereAgendarOCotizar(text));

        await saveHistory(from, updatedHistory);
        await sendWhatsAppMessage(from, reply);

        const updatedLead: LeadProfile = {
          nombre: extracted.nombre || lead.nombre,
          empresa: extracted.empresa || lead.empresa,
          industria: extracted.industria || lead.industria,
          desafio: extracted.desafio || lead.desafio,
          presupuesto: extracted.presupuesto || lead.presupuesto,
          urgencia: extracted.urgencia || lead.urgencia,
          score: Math.max(lead.score, parseInt(String(extracted.score)) || 0),
          fase: debeDerivarse ? 'derivado' : extracted.fase || lead.fase,
          derivado: yaDerivado || debeDerivarse,
        };

        if (debeDerivarse) {
          await new Promise((r) => setTimeout(r, 800));
          await sendWhatsAppMessage(
            from,
            `📅 Puedes agendar tu consultoría gratuita directamente aquí:\n\n${CALENDAR_LINK}\n\n¡Elige el día y hora que más te acomode! 🚀`
          );
          await notifyHotLead(from, updatedLead);
        }

        await saveLead(from, updatedLead);
      }

      return NextResponse.json({ status: 'ok' });
    }

    return NextResponse.json({ status: 'not a whatsapp message' }, { status: 404 });
  } catch (error) {
    console.error('Error en Webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
