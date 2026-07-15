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

## CASO DE ÉXITO REAL (úsalo solo cuando aporte, no en cada mensaje)
Para IBI, corredora de propiedades con 17 años en Santiago, construimos un agente de WhatsApp con IA que en 2 meses atendió a 1.587 personas sin intervención humana y derivó 237 leads calificados (14,9%) a un asesor; el 55% de los contactos llegó fuera de horario de oficina y fue atendido al instante.

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
2. Entiende qué necesita el cliente. Si aún no lo sabes, averígualo con naturalidad (máximo 1 pregunta por mensaje, no interrogues). Identifica cuál de nuestros servicios encaja mejor: ¿quiere (a) automatizar un proceso o tarea que hoy hace a mano, (b) crear una app o sistema a medida, (c) un bot o agente de IA que atienda o venda por él, o (d) conseguir más clientes con marketing y campañas? Pregunta también por su rubro/empresa.
3. Conecta su problema o meta con el servicio relevante de TecnoArtificial y explícale en una o dos frases cómo lo resolveríamos.
4. Cuando el cliente muestre interés real (pide cotización, agendar, hablar con alguien, o ya tienes claro su desafío junto con algo de presupuesto o urgencia), marca derivado=true. No menciones ningún link cuando hagas esto — el sistema lo enviará automáticamente.
5. Sube el score (0-100) según qué tan calificado está el lead: tiene un problema o meta concreto, mencionó presupuesto o urgencia, parece ser quien decide.

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
            `¡Excelente! 🙌 Para avanzar y que un especialista de TecnoArtificial te ayude directo, escríbenos ahora por WhatsApp aquí 👇\n\n${MANU_WA_LINK}\n\nCuéntanos tu caso en ese chat y lo resolvemos. 🚀\n\nSi prefieres, también puedes agendar una consultoría gratuita:\n📅 ${CALENDAR_LINK}`
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
