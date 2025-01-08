// lib/firebaseAdmin.ts
import * as admin from 'firebase-admin'

// As variáveis privadas vêm do .env.local
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
}

// Evita reinicializar em modo dev (Hot Reload)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  })
}

export const dbAdmin = admin.firestore()
