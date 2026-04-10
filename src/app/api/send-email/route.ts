import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, email, whatsapp, empresa, industria, desafio } = body;
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ success: false, error: "MISSING_KEY" }, { status: 500 });
    }

    // Email para Admin
    const adminResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: 'TecnoArtificial <contacto@tecnoartificial.com>',
        to: ['mvaldes@tecnoartificial.com', 'contacto@tecnoartificial.com'],
        subject: `🚀 Leads: ${empresa} (${nombre})`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #6366F1;">Nueva Solicitud Detectada</h2>
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>WhatsApp:</strong> ${whatsapp}</p>
            <p><strong>Empresa:</strong> ${empresa}</p>
            <p><strong>Industria:</strong> ${industria}</p>
            <p><strong>Desafío:</strong> ${desafio}</p>
            <hr />
            <p style="font-size: 10px; color: #999;">Enviado desde el portal TecnoArtificial</p>
          </div>
        `
      })
    });

    const adminResult = await adminResponse.json();

    // Email para Cliente
    const clientResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: 'TecnoArtificial <contacto@tecnoartificial.com>',
        to: email,
        subject: 'Recibimos tu solicitud - TecnoArtificial',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; padding: 20px;">
            <h2>¡Hola ${nombre}!</h2>
            <p>Hemos recibido correctamente tu solicitud para <strong>${empresa}</strong>.</p>
            <p>Un consultor experto se pondrá en contacto contigo en breve.</p>
            <br />
            <p>Saludos,<br />Equipo TecnoArtificial</p>
          </div>
        `
      })
    });

    return NextResponse.json({ 
      success: true, 
      resendId: adminResult.id 
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
