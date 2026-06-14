import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Vercel serverless ortamında tek bir Admin uygulaması paylaşılır.
function buildApp() {
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  // Vercel ortam değişkenlerinde \n kaçışlarını gerçek satır sonuna çevir.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Firebase Admin yapılandırması eksik (FIREBASE_PROJECT_ID / CLIENT_EMAIL / PRIVATE_KEY).')
  }

  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
}

export function adminDb() {
  const app = getApps().length ? getApp() : buildApp()
  return getFirestore(app)
}

export const adminReady = Boolean(
  (process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID) &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY,
)
