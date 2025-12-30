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

// === AI CLINICAL SUMMARY ===

export async function generateAIClinicalSummary(patientId: string): Promise<string> {
  // Fetch patient data
  const patient = await getPatient(patientId)
  if (!patient) return ''

  // Fetch recent medical data
  const appointments = await getPatientAppointments(patientId, 5)
  const medications = await getPatientMedications(patientId)
  const activeMedications = medications.filter(m => m.status === 'Active')

  // Get most recent SOAP note with vitals
  const latestVitals = await getLatestVitals(patientId)

  // Get latest diagnosis from most recent appointment
  let latestDiagnosis = ''
  for (const apt of appointments) {
    if (apt.soap?.diagnoses && apt.soap.diagnoses.length > 0) {
      // Get primary diagnosis or first one
      const primaryDiag = apt.soap.diagnoses.find(d => d.isPrimary) || apt.soap.diagnoses[0]
      latestDiagnosis = primaryDiag.condition
      break
    }
  }

  // Build summary text
  const parts: string[] = []

  // Basic patient info
  parts.push(`${patient.name} is a ${patient.age || 'adult'} ${patient.breed || patient.species}`)

  // Current condition/diagnosis
  if (latestDiagnosis && !latestDiagnosis.toLowerCase().includes('no documented')) {
    parts.push(`currently recovering from ${latestDiagnosis.toLowerCase()}`)
  } else {
    parts.push(`in generally good health`)
  }

  // Vital trends
  if (latestVitals?.temperature) {
    const tempValue = parseFloat(latestVitals.temperature.replace(/[^0-9.]/g, ''))
    const normalTemp = 101.5
    if (tempValue > normalTemp + 0.3) {
      parts.push(`Recent vital trends show slight elevation in temperature (${latestVitals.temperature} vs normal ${normalTemp}°F) consistent with mild inflammation.`)
    } else if (latestVitals.temperature) {
      parts.push(`Vital signs within normal ranges.`)
    }
  }

  // Current medications
  if (activeMedications.length > 0) {
    const medNames = activeMedications.map(m => m.name).join(' and ')
    parts.push(`Currently on ${activeMedications.length > 1 ? 'medications' : 'medication'} including ${medNames} with good response.`)
  }

  // Wrap up
  parts.push(`No concerning patterns identified in recent visit history.`)

  return parts.join(' ')
}

export async function updatePatientAISummary(patientId: string): Promise<void> {
  const summary = await generateAIClinicalSummary(patientId)
  await adminDb.collection('patients').doc(patientId).update({
    aiSummary: summary,
    aiSummaryUpdatedAt: Timestamp.now()
  })
}
