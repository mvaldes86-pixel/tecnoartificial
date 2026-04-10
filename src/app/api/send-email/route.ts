import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Método GET para que podamos probar la ruta en el navegador: tecnoartificial.com/api/send-email
export async function GET() {
  const apiKey = process.env.RESEND_API_KEY;
  return NextResponse.json({ 
    status: "alive", 
    hasKey: !!apiKey,
    keyPrefix: apiKey ? apiKey.substring(0, 5) : "none"
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, email, empresa, desafio } = body;
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ success: false, error: "Missing API Key" }, { status: 500 });
    }

    // USAMOS FETCH DIRECTO (Sin librerías para evitar errores de Hostinger)
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: 'TecnoArtificial <contacto@tecnoartificial.com>',
        to: ['mvaldes@tecnoartificial.com', 'contacto@tecnoartificial.com'],
        subject: `🚀 Nueva Solicitud: ${empresa}`,
        html: `<p><strong>Nombre:</strong> ${nombre}</p><p><strong>Email:</strong> ${email}</p><p><strong>Desafío:</strong> ${desafio}</p>`
      })
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json({ success: false, error: result }, { status: response.status });
    }

    // MANDAR COPIA AL CLIENTE
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: 'TecnoArtificial <contacto@tecnoartificial.com>',
        to: email,
        subject: 'Confirmación - TecnoArtificial',
        html: `<p>Hola ${nombre}, hemos recibido tu solicitud para ${empresa}.</p>`
      })
    });

    return NextResponse.json({ success: true, data: result });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
