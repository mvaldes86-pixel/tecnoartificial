# STACK DE PRODUCCIÓN — tecnoartificial.com

> **Fuente única de verdad.** Verificado con evidencia real (headers HTTP, DNS, `vercel env ls`,
> código, API de Supabase) el **2026-07-09**. Si algo aquí contradice a la memoria o a un recuerdo,
> **gana este archivo** (o vuelve a verificar con los comandos de la sección "Cómo re-verificar").

---

## Resumen ejecutivo

**tecnoartificial.com** corre en **Vercel**, con DNS en **Cloudflare**, correo en **Zoho**, y su
**única base de datos es Firebase Firestore**. NO usa Supabase.

⚠️ **Confusión histórica frecuente:** el usuario tiene OTRO proyecto, **Arigrav (Osorno)**, que SÍ está
en **Supabase** (`arigrav-osorno`, sistema de guías de despacho). Eso NO es tecnoartificial. No mezclar.

---

## Arquitectura de producción (verificada)

| Capa | Servicio | Detalle | Cómo se verificó |
|---|---|---|---|
| Hosting / cómputo | **Vercel** | Proyecto `tecnoartificial-com` · projectId `prj_U8gx28Bi7hAL6cnH0DbllmSioBT7` · team `clientesweb-s-projects` (`team_2Hc803n0xRiscJSRyh3oIJU0`) · cuenta **tecnoartificialspa@gmail.com** | `curl -sI` → `Server: Vercel` |
| DNS | **Cloudflare** | Nameservers `georgia/milan.ns.cloudflare.com` · apex A `76.76.21.21` · www CNAME `cname.vercel-dns.com` · modo "solo DNS" (nube gris) | `nslookup -type=NS` |
| Repo / framework | **GitHub + Next.js** | `mvaldes86-pixel/tecnoartificial` · Next.js **15.1.11** App Router · React 19 | `git remote`, `package.json` |
| Correo | **Zoho Mail** | MX `mx.zoho.com` / `mx2` / `mx3` · SPF `include:zohomail.com` · buzones `contacto@` y `mvaldes@` | `nslookup -type=MX/TXT` |
| Email transaccional | **Resend** | Env `RESEND_API_KEY` · envía desde `contacto@tecnoartificial.com` | `vercel env ls` + código |
| IA del bot | **Anthropic / Claude** | Env `ANTHROPIC_API_KEY` · potencia el bot de WhatsApp | `vercel env ls` + código |
| Mensajería | **Meta WhatsApp Cloud API** | Env `WHATSAPP_TOKEN`, `WHATSAPP_APP_SECRET`, `WHATSAPP_VERIFY_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` · webhook `/api/whatsapp/webhook` · número +56 9 2029 3667 | `vercel env ls` + código |
| **Base de datos** | **Firebase Firestore** | Proyecto `tecnoartificial-leads-1234` · **config pública hardcodeada** en `src/lib/firebase.ts` (NO usa env vars) | grep del código |
| Analítica | **Meta Pixel** | ID `1428411498841708` en `layout.tsx`. **NO hay Google Analytics / GA4.** | `layout.tsx` |
| SEO | **Google Search Console** | Propiedad de **Dominio** verificada (cuenta tecnoartificialspa@) · sitemap enviado · TXT `google-site-verification=wNcOqTZ4...` | Search Console + TXT |

### NO se usa en producción (para evitar suposiciones)
- ❌ **Supabase** — el sitio en producción NO se conecta a Supabase: **cero variables `SUPABASE_*` en Vercel** y **cero código** de Supabase en el repo (verificado). ⚠️ **Límite de visibilidad:** la integración Supabase de Claude está conectada a la org **"mvaldes86-pixel's Org"** (cuenta personal), que solo tiene el proyecto `arigrav-osorno` (otro negocio: guías de despacho). Si existe un proyecto Supabase bajo **tecnoartificialspa@gmail.com**, Claude NO lo ve desde esa conexión — pero da igual: aunque exista, el sitio no lo usa (usa Firebase).
- ❌ Vercel Postgres / Vercel Blob / Neon / cualquier otra BD.
- ❌ Google Analytics.

### Mapa de cuentas (hay mezcla personal/negocio)
- GitHub repo `mvaldes86-pixel/tecnoartificial` → cuenta **personal**.
- Supabase que Claude ve (`mvaldes86-pixel's Org`) → cuenta **personal** (solo arigrav-osorno).
- Vercel (hosting/deploy), Search Console, Google Business → cuenta **negocio** `tecnoartificialspa@gmail.com`.
- Firebase `tecnoartificial-leads-1234` → dueño no confirmado (config pública en el código).

---

## Dónde vive cada dato

- **Leads del formulario de consultoría** (`src/app/consultoria/page.tsx`): se guardan en **Firestore** (`addDoc`) **Y** se envían por email vía **Resend**. (Por eso el usuario los ve por correo aunque también estén en Firebase.)
- **Historial de conversaciones y leads del bot de WhatsApp** (`src/app/api/whatsapp/webhook/route.ts`): **Firestore**.
- No hay otra persistencia.

---

## Variables de entorno en Producción (Vercel)

Solo estas 6 (verificado con `vercel env ls production`):
`RESEND_API_KEY`, `ANTHROPIC_API_KEY`, `WHATSAPP_TOKEN`, `WHATSAPP_APP_SECRET`,
`WHATSAPP_VERIFY_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`.

Firebase NO requiere env vars (config web pública en `src/lib/firebase.ts`).

---

## Deploy

- **NO hay auto-deploy desde GitHub.** El deploy a producción es **manual por CLI**:
  ```
  vercel --prod --yes --scope clientesweb-s-projects
  ```
- `next.config.ts` fuerza `Cache-Control` no-cacheable en las páginas HTML. Ese override venía de
  Hostinger; en Vercel es innecesario (Vercel purga su CDN solo) — se puede quitar, es inofensivo.

---

## Cómo re-verificar (copiar/pegar)

```bash
curl -sI https://tecnoartificial.com | grep -iE '^server:|x-vercel'   # hosting
nslookup -type=NS tecnoartificial.com                                  # DNS (Cloudflare)
nslookup -type=MX tecnoartificial.com                                  # correo (Zoho)
vercel env ls production --scope clientesweb-s-projects                 # servicios en prod
grep -rin "firebase\|supabase" src/                                    # BD real en el código
```

---

## Pendientes / legacy candidatos a limpiar (requieren OK del usuario antes de borrar)

- Proyecto Vercel **duplicado** en la cuenta `bodegapremium55@gmail.com` (`tecnoartificial-com` viejo), sin uso.
- Registro DNS `ftp.tecnoartificial.com` en Cloudflare (sobrante de Hostinger).
- Rotar credenciales que se pegaron en chats antiguos (Anthropic, WhatsApp, Resend).
