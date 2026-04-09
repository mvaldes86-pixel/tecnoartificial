import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

// Usaremos una API Key de prueba por ahora, el usuario deberá proveer la suya
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  console.log("Iniciando solicitud de envío de email...");
  try {
    const body = await req.json();
    const { nombre, email, whatsapp, empresa, industria, desafio } = body;


    if (!process.env.RESEND_API_KEY) {
      console.warn("ADVERTENCIA: No hay RESEND_API_KEY configurada. El correo no se enviará.");
      return NextResponse.json({ 
        success: false, 
        message: "API Key de Resend no configurada en Hostinger." 
      }, { status: 200 }); // Retornamos 200 para no romper el flujo del cliente
    }

    // 1. Email para el Administrador
    const adminEmail = await resend.emails.send({
      from: 'TecnoArtificial <onboarding@resend.dev>',
      to: 'mvaldes86@gmail.com',
      subject: `Nueva Solicitud: ${empresa}`,
      html: `
        <h1>Nueva Solicitud de Consultoría</h1>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>WhatsApp:</strong> ${whatsapp}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Empresa:</strong> ${empresa}</p>
        <p><strong>Industria:</strong> ${industria}</p>
        <p><strong>Desafío:</strong> ${desafio}</p>

      `
    });

    if (adminEmail.error) {
      throw new Error(adminEmail.error.message);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error enviando emails:", error);
    return NextResponse.json({ 
      error: "Error interno", 
      details: error.message 
    }, { status: 500 });
  }
}
