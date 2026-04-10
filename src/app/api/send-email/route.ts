import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, email, whatsapp, empresa, industria, desafio } = body;

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error("DEBUG: RESEND_API_KEY no encontrada en las variables de entorno.");
      return NextResponse.json({ 
        success: false, 
        error: "API_KEY_MISSING",
        message: "El servidor de Hostinger no tiene configurada la RESEND_API_KEY." 
      }, { status: 500 });
    }

    const resend = new Resend(apiKey);

    // 1. Email para TecnoArtificial
    const adminEmail = await resend.emails.send({
      from: 'TecnoArtificial <contacto@tecnoartificial.com>',
      to: ['mvaldes@tecnoartificial.com', 'contacto@tecnoartificial.com'],
      subject: `🚀 Nueva Solicitud: ${empresa}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Nueva Solicitud</h2>
          <p><strong>Nombre:</strong> ${nombre}</p>
          <p><strong>Empresa:</strong> ${empresa}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Desafío:</strong> ${desafio}</p>
        </div>
      `
    });

    if (adminEmail.error) {
      console.error("DEBUG: Error de Resend al enviar Admin Email:", adminEmail.error);
      return NextResponse.json({ 
        success: false, 
        error: "RESEND_ERROR",
        details: adminEmail.error 
      }, { status: 500 });
    }

    // 2. Email para el Cliente
    const clientEmail = await resend.emails.send({
      from: 'TecnoArtificial <contacto@tecnoartificial.com>',
      to: email,
      subject: 'Confirmación de Solicitud - TecnoArtificial',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>¡Hola ${nombre}!</h2>
          <p>Hemos recibido tu solicitud para <strong>${empresa}</strong>.</p>
          <p>Te contactaremos pronto.</p>
        </div>
      `
    });

    return NextResponse.json({ 
      success: true, 
      message: "Emails enviados correctamente" 
    });

  } catch (error: any) {
    console.error("DEBUG: Error fatal en el API Route:", error);
    return NextResponse.json({ 
      success: false, 
      error: "FATAL_ERROR",
      message: error.message 
    }, { status: 500 });
  }
}
