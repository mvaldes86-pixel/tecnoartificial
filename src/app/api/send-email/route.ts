import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const apiKey = process.env.RESEND_API_KEY;
  return NextResponse.json({ 
    status: "alive", 
    hasKey: !!apiKey
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, email, empresa, desafio } = body;
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ success: false, error: "NO_API_KEY" }, { status: 500 });
    }

    // ENVÍO AL ADMIN
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: 'TecnoArtificial <contacto@tecnoartificial.com>',
        to: ['mvaldes@tecnoartificial.com', 'contacto@tecnoartificial.com'],
        subject: `🚀 Solicitud: ${empresa}`,
        html: `<p><strong>Nombre:</strong> ${nombre}</p><p><strong>Empresa:</strong> ${empresa}</p><p><strong>Email:</strong> ${email}</p><p><strong>Desafío:</strong> ${desafio}</p>`
      })
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json({ success: false, error: "RESEND_REJECTED", details: result }, { status: response.status });
    }

    // MANDAR COPIA AL CLIENTE
    const clientResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: 'TecnoArtificial <contacto@tecnoartificial.com>',
        to: email,
        subject: 'Confirmación - TecnoArtificial',
        html: `<p>Hola ${nombre}, recibimos tu solicitud.</p>`
      })
    });

    const clientResult = await clientResponse.json();

    return NextResponse.json({ 
      success: true, 
      resendId: result.id, // ESTO ES LO QUE NECESITAMOS VER
      clientResendId: clientResult.id
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: "SYSTEM_FATAL", message: error.message }, { status: 500 });
  }
}
