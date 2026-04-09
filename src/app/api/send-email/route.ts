import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

// Usaremos una API Key de prueba por ahora, el usuario deberá proveer la suya
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, email, empresa, industria, desafio } = body;

    // 1. Email para el Administrador
    await resend.emails.send({
      from: 'TecnoArtificial <onboarding@resend.dev>',
      to: 'mvaldes86@gmail.com',
      subject: `Nueva Solicitud de Consultoría: ${empresa}`,
      html: `
        <h1>Nueva Solicitud Recibida</h1>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Empresa:</strong> ${empresa}</p>
        <p><strong>Industria:</strong> ${industria}</p>
        <p><strong>Desafío:</strong> ${desafio}</p>
      `
    });

    // 2. Email de confirmación para el Cliente
    await resend.emails.send({
      from: 'TecnoArtificial <onboarding@resend.dev>',
      to: email,
      subject: 'Confirmación de Solicitud - TecnoArtificial',
      html: `
        <h1>¡Hola ${nombre}!</h1>
        <p>Hemos recibido tu solicitud para una consultoría de IA para <strong>${empresa}</strong>.</p>
        <p>Un experto de nuestro equipo revisará tu desafío: <em>"${desafio}"</em> y se pondrá en contacto contigo en menos de 24 horas.</p>
        <br>
        <p>Saludos,<br>El equipo de TecnoArtificial.</p>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error enviando emails:", error);
    return NextResponse.json({ error: "Error enviando emails" }, { status: 500 });
  }
}
