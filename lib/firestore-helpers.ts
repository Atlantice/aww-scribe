import { adminDb } from './firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'
import type { Patient, Appointment, Medication, LabResult, Invoice } from '@/types/firestore'

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

// === MEDICATIONS ===

export async function getPatientMedications(
  patientId: string
): Promise<Medication[]> {
  try {
    const snapshot = await adminDb
      .collection('medications')
      .where('patientId', '==', patientId)
      .orderBy('createdAt', 'desc')
      .get()

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Medication[]
  } catch (error) {
    console.log('Error fetching medications:', error)
    return []
  }
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

// === VITALS ===

export async function getLatestVitals(patientId: string): Promise<{
  temperature?: string
  heartRate?: string
  respiratoryRate?: string
  weight?: string
  date?: Date
} | null> {
  const appointments = await getPatientAppointments(patientId, 10)

  // Find the most recent appointment with vitals
  for (const appointment of appointments) {
    if (appointment.soap?.vitals) {
      const vitals = appointment.soap.vitals
      // Only return if at least one vital is present
      if (vitals.temperature || vitals.heartRate || vitals.respiratoryRate || vitals.weight) {
        return {
          ...vitals,
          date: appointment.date instanceof Date ? appointment.date : (appointment.date as any).toDate?.() || new Date()
        }
      }
    }
  }

  return null
}

// === RECENT ACTIVITY ===

interface ActivityItem {
  date: Date
  type: 'soap' | 'medication' | 'lab'
  title: string
  detail: string
}

export async function getPatientRecentActivity(
  patientId: string,
  limit: number = 10
): Promise<ActivityItem[]> {
  const activities: ActivityItem[] = []

  // Get recent appointments with SOAP notes
  const appointments = await getPatientAppointments(patientId, 5)
  for (const apt of appointments) {
    if (apt.soap) {
      activities.push({
        date: apt.date instanceof Date ? apt.date : (apt.date as any).toDate?.() || new Date(),
        type: 'soap',
        title: 'SOAP note created',
        detail: `${apt.type} - ${apt.soap.assessment?.substring(0, 50) || 'Visit documented'}`
      })
    }
  }

  // Get recent medications
  try {
    const medsSnapshot = await adminDb
      .collection('medications')
      .where('patientId', '==', patientId)
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get()

    for (const doc of medsSnapshot.docs) {
      const med = doc.data() as Medication
      activities.push({
        date: med.createdAt instanceof Date ? med.createdAt : (med.createdAt as any).toDate?.() || new Date(),
        type: 'medication',
        title: 'Medication prescribed',
        detail: `${med.name} ${med.dosage} ${med.frequency} × ${
          med.endDate
            ? Math.ceil(((med.endDate instanceof Date ? med.endDate : (med.endDate as any).toDate?.() || new Date()).getTime() - (med.startDate instanceof Date ? med.startDate : (med.startDate as any).toDate?.() || new Date()).getTime()) / (1000 * 60 * 60 * 24)) + ' days'
            : 'ongoing'
        }`
      })
    }
  } catch (error) {
    // Medications collection may not exist yet
    console.log('No medications found or collection does not exist')
  }

  // Get recent lab results
  try {
    const labsSnapshot = await adminDb
      .collection('labResults')
      .where('patientId', '==', patientId)
      .orderBy('orderDate', 'desc')
      .limit(5)
      .get()

    for (const doc of labsSnapshot.docs) {
      const lab = doc.data() as LabResult
      activities.push({
        date: lab.orderDate instanceof Date ? lab.orderDate : (lab.orderDate as any).toDate?.() || new Date(),
        type: 'lab',
        title: 'Lab ordered',
        detail: lab.testType
      })
    }
  } catch (error) {
    // Lab results collection may not exist yet
    console.log('No lab results found or collection does not exist')
  }

  // Sort by date descending and limit
  return activities
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, limit)
}

// === LAB RESULTS ===

export async function createLabResult(
  data: Omit<LabResult, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const now = Timestamp.now()

  const cleanData: any = {
    ...data,
    createdAt: now,
    updatedAt: now,
  }

  const docRef = await adminDb.collection('labResults').add(cleanData)
  return docRef.id
}

// === INVOICES ===

export async function createInvoice(
  data: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const now = Timestamp.now()

  const cleanData: any = {
    ...data,
    createdAt: now,
    updatedAt: now,
  }

  const docRef = await adminDb.collection('invoices').add(cleanData)
  return docRef.id
}
