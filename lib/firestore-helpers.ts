import { adminDb } from './firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'
import type { Patient, Appointment, Medication } from '@/types/firestore'

// === PATIENTS ===

export async function getPatient(patientId: string): Promise<Patient | null> {
  const doc = await adminDb.collection('patients').doc(patientId).get()
  if (!doc.exists) return null
  return { id: doc.id, ...doc.data() } as Patient
}

export async function getAllPatients(): Promise<Patient[]> {
  const snapshot = await adminDb.collection('patients').orderBy('name', 'asc').get()
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Patient[]
}

// === APPOINTMENTS ===

export async function getPatientAppointments(
  patientId: string,
  limit?: number
): Promise<Appointment[]> {
  let query = adminDb
    .collection('appointments')
    .where('patientId', '==', patientId)
    .orderBy('date', 'desc')

  if (limit) query = query.limit(limit)

  const snapshot = await query.get()
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Appointment[]
}

export async function createAppointment(
  data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'aiProcessed'>
): Promise<string> {
  const now = Timestamp.now()

  // Filter out undefined values to avoid Firestore errors
  const cleanData: any = {
    patientId: data.patientId,
    date: data.date,
    type: data.type,
    status: data.status,
    veterinarianName: data.veterinarianName,
    aiProcessed: false,
    createdAt: now,
    updatedAt: now,
  }

  // Only add optional fields if they're defined
  if (data.chiefComplaint !== undefined) cleanData.chiefComplaint = data.chiefComplaint
  if (data.soap !== undefined) cleanData.soap = data.soap
  if (data.transcript !== undefined) cleanData.transcript = data.transcript

  const docRef = await adminDb.collection('appointments').add(cleanData)
  return docRef.id
}

export async function saveSOAPNote(
  appointmentId: string,
  soap: Appointment['soap']
): Promise<void> {
  await adminDb.collection('appointments').doc(appointmentId).update({
    soap,
    aiProcessed: true,
    updatedAt: Timestamp.now(),
  })
}

// === HISTORICAL CONTEXT (for Gemini) ===

export async function getRecentSOAPNotes(
  patientId: string,
  limit: number = 3
): Promise<Array<{ date: Timestamp; soap: Appointment['soap'] }>> {
  const snapshot = await adminDb
    .collection('appointments')
    .where('patientId', '==', patientId)
    .where('aiProcessed', '==', true)
    .orderBy('date', 'desc')
    .limit(limit)
    .get()

  return snapshot.docs
    .filter(doc => doc.data().soap)
    .map(doc => ({
      date: doc.data().date,
      soap: doc.data().soap,
    }))
}

export function formatHistoricalContext(
  soapNotes: Array<{ date: Timestamp; soap: Appointment['soap'] }>
): string {
  if (soapNotes.length === 0) {
    return 'No previous visit history available.'
  }

  return soapNotes.map((entry, i) => {
    const dateStr = entry.date.toDate().toLocaleDateString()
    return `
Visit ${i + 1} (${dateStr}):
- Chief Complaint: ${entry.soap?.subjective?.substring(0, 100)}
- Assessment: ${entry.soap?.assessment?.substring(0, 100)}
`.trim()
  }).join('\n\n')
}
