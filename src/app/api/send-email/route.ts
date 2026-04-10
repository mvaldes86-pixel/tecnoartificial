import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, email, whatsapp, empresa, industria, desafio } = body;

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ 
        success: false, 
        message: "API Key de Resend no configurada." 
      }, { status: 200 });
    }

    // 1. Email para TecnoArtificial
    const adminEmail = await resend.emails.send({
      from: 'TecnoArtificial <contacto@tecnoartificial.com>',
      to: ['mvaldes@tecnoartificial.com', 'contacto@tecnoartificial.com'],
      subject: `🚀 Nueva Solicitud: ${empresa}`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #6366F1;">Nueva Solicitud de Consultoría</h2>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p><strong>Nombre:</strong> ${nombre}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>WhatsApp:</strong> ${whatsapp || 'No proporcionado'}</p>
          <p><strong>Empresa:</strong> ${empresa}</p>
          <p><strong>Industria:</strong> ${industria}</p>
          <p><strong>Desafío Principal:</strong></p>
          <blockquote style="background: #f9f9f9; padding: 15px; border-left: 5px solid #6366F1;">${desafio}</blockquote>
        </div>
      `
    });

    if (adminEmail.error) {
      throw new Error(adminEmail.error.message);
    }

    // 2. Copia para el Cliente
    await resend.emails.send({
      from: 'TecnoArtificial <contacto@tecnoartificial.com>',
      to: email,
      subject: 'Confirmación de Solicitud - TecnoArtificial',
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #6366F1;">¡Hola ${nombre}!</h2>
          <p>Gracias por contactar con <strong>TecnoArtificial</strong>. Hemos recibido tu solicitud para <strong>${empresa}</strong>.</p>
          <p>Nuestro equipo revisará tu caso y te contactará pronto.</p>
          <br/>
          <p>Saludos,<br/>El Equipo de TecnoArtificial</p>
        </div>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error enviando emails:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
