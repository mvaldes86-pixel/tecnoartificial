import {
  initializeApp,
  getApps,
  getApp,
  cert,
  type App,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

// Firebase Admin SDK (solo servidor). Omite las reglas de seguridad de Firestore,
// por eso el blog y el agente pueden leer/escribir `blog_posts` de forma segura
// sin exponer la base de datos a escritura pública.
//
// Requiere la variable de entorno FIREBASE_SERVICE_ACCOUNT_KEY con el JSON de la
// cuenta de servicio (Firebase Console → Configuración → Cuentas de servicio →
// Generar nueva clave privada). Se acepta el JSON crudo o codificado en base64.

let cachedDb: Firestore | null = null;

function loadServiceAccount(): Record<string, unknown> | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) return null;
  try {
    const json = raw.trim().startsWith("{")
      ? raw
      : Buffer.from(raw, "base64").toString("utf8");
    return JSON.parse(json);
  } catch (error) {
    console.error("[firebase-admin] No se pudo parsear la cuenta de servicio:", error);
    return null;
  }
}

// Devuelve el Firestore admin, o null si no hay credenciales (así el build
// no falla en entornos sin la env var).
export function getAdminDb(): Firestore | null {
  if (cachedDb) return cachedDb;

  const serviceAccount = loadServiceAccount();
  if (!serviceAccount) return null;

  let app: App;
  if (getApps().length > 0) {
    app = getApp();
  } else {
    app = initializeApp({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      credential: cert(serviceAccount as any),
    });
  }

  cachedDb = getFirestore(app);
  return cachedDb;
}
