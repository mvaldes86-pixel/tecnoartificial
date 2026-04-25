import { NextResponse } from 'next/server';

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'tecnoartificial_verify_token';

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
  try {
    const body = await request.json();

    // Verificamos si es un mensaje de WhatsApp
    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const message = value?.messages?.[0];

      if (message) {
        const from = message.from; // Número del cliente
        const text = message.text?.body; // Texto del mensaje

        console.log(`Mensaje recibido de ${from}: ${text}`);

        // TODO: Aquí llamaremos a la API de OpenAI/Gemini
        // Y luego responderemos usando la API de WhatsApp
      }
      return NextResponse.json({ status: 'ok' });
    }
    
    return NextResponse.json({ status: 'not a whatsapp message' }, { status: 404 });
  } catch (error) {
    console.error('Error en Webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
