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

    const tecnoWhatsapp = "+56929510388";

    // 1. EMAIL PARA ADMIN
    const adminHtml = `
      <div style="font-family: sans-serif; background-color: #f4f7ff; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
          <div style="background-color: #0A0A1F; padding: 30px; text-align: center;">
            <h1 style="color: #6366F1; margin: 0; font-size: 24px;">TecnoArtificial</h1>
            <p style="color: rgba(255,255,255,0.6); margin: 5px 0 0 0; font-size: 14px;">Nueva Solicitud Detectada</p>
          </div>
          <div style="padding: 40px;">
            <div style="margin-bottom: 25px;">
              <label style="display: block; font-size: 11px; font-weight: 800; color: #6366F1; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Cliente</label>
              <div style="font-size: 18px; color: #1f2937; font-weight: 600;">${nombre}</div>
            </div>
            <div style="margin-bottom: 25px;">
              <label style="display: block; font-size: 11px; font-weight: 800; color: #9ca3af; text-transform: uppercase; margin-bottom: 5px;">Empresa / Email</label>
              <div style="color: #4b5563;">${empresa} | ${email}</div>
            </div>
            <div style="margin-bottom: 35px;">
              <label style="display: block; font-size: 11px; font-weight: 800; color: #9ca3af; text-transform: uppercase; margin-bottom: 10px;">Desafío</label>
              <div style="background-color: #f9fafb; padding: 20px; border-radius: 12px; border-left: 4px solid #6366F1; color: #374151;">
                "${desafio}"
              </div>
            </div>
            <a href="https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}" style="display: block; background-color: #6366F1; color: #ffffff; text-align: center; padding: 18px; border-radius: 12px; text-decoration: none; font-weight: 700;">
              Contactar al Cliente (${whatsapp})
            </a>
          </div>
        </div>
      </div>
    `;

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        from: 'TecnoArtificial <contacto@tecnoartificial.com>',
        to: ['mvaldes@tecnoartificial.com', 'contacto@tecnoartificial.com'],
        subject: `🚀 Lead: ${empresa} (${nombre})`,
        html: adminHtml
      })
    });

    // 2. EMAIL PARA CLIENTE
    const clientHtml = `
      <div style="font-family: sans-serif; background-color: #0A0A1F; padding: 40px 20px; color: #ffffff;">
        <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(145deg, #16163a, #0A0A1F); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 24px; overflow: hidden; padding: 40px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="font-size: 28px; font-weight: 900; color: #ffffff;">Tecno<span style="color: #6366F1;">Artificial</span></div>
          </div>
          
          <h1 style="font-size: 28px; font-weight: 800; margin-bottom: 20px; text-align: center;">¡Hola ${nombre.split(' ')[0]}!</h1>
          
          <p style="font-size: 16px; line-height: 1.6; color: rgba(255,255,255,0.7); text-align: center; margin-bottom: 30px;">
            Hemos recibido tu solicitud para optimizar los procesos en <strong>${empresa}</strong>. <br/>
            Nuestro equipo analizará tu caso y te contactará en menos de 24 horas.
          </p>

          <div style="text-align: center; margin-bottom: 40px;">
            <p style="font-size: 14px; color: rgba(255,255,255,0.5); margin-bottom: 15px;">¿Quieres acelerar el proceso?</p>
            <a href="https://wa.me/${tecnoWhatsapp.replace('+', '')}" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 100px; font-weight: 700; font-size: 15px;">
              Hablar con el equipo de TecnoArtificial
            </a>
          </div>
          
          <div style="background: rgba(99, 102, 241, 0.05); border: 1px solid rgba(99, 102, 241, 0.1); border-radius: 20px; padding: 30px;">
            <h3 style="color: #6366F1; margin-top: 0; font-size: 13px; text-transform: uppercase;">Próximos pasos</h3>
            <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin: 0;">
              ✓ Auditoría preliminar de procesos.<br/>
              ✓ Identificación de cuellos de botella.<br/>
              ✓ Sesión de estrategia personalizada.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 50px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05);">
            <p style="font-size: 11px; color: rgba(255,255,255,0.3);">TecnoArtificial © 2026 | Innovación en Automatización IA</p>
          </div>
        </div>
      </div>
    `;

    const clientResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        from: 'TecnoArtificial <contacto@tecnoartificial.com>',
        to: email,
        subject: 'Recibimos tu solicitud - TecnoArtificial',
        html: clientHtml
      })
    });

    const clientResult = await clientResponse.json();

    return NextResponse.json({ success: true, resendId: clientResult.id });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
