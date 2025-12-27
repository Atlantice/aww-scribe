import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import * as path from 'path'
import * as fs from 'fs'

if (!getApps().length) {
  try {
    // Try to use service account key file first (most reliable)
    const serviceAccountPath = path.join(process.cwd(), 'service-account-key.json')

    if (fs.existsSync(serviceAccountPath)) {
      console.log('Using service account key file:', serviceAccountPath)
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'))

      initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id,
      })
      console.log('✓ Firebase Admin initialized with service account file')
    } else if (process.env.GOOGLE_CLOUD_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      // Fallback to environment variables
      console.log('Using environment variables for Firebase Admin')
      initializeApp({
        credential: cert({
          projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      })
      console.log('✓ Firebase Admin initialized with environment variables')
    } else {
      throw new Error('No valid Firebase Admin credentials found')
    }
  } catch (error) {
    console.error('✗ Failed to initialize Firebase Admin:', error)
    throw error
  }
}

const db = getFirestore()

// Configure Firestore to ignore undefined properties (only call once)
try {
  db.settings({
    ignoreUndefinedProperties: true,
  })
  console.log('✓ Firestore configured with ignoreUndefinedProperties')
} catch (error) {
  // Settings already configured, ignore error
  console.log('✓ Firestore already configured')
}

export const adminDb = db
