// Using Date instead of Timestamp for client-side type safety
// Firestore Timestamps are automatically converted to Date objects in hooks

export interface Patient {
  id: string
  name: string
  species: string
  breed?: string
  age?: string
  weight?: string
  sex?: string

  ownerName?: string
  ownerPhone?: string

  aiSummary?: string
  aiSummaryUpdatedAt?: Date

  createdAt: Date
  updatedAt: Date

  // UI helpers
  avatarColor?: string
  initial?: string
}

export interface Appointment {
  id: string
  patientId: string

  date: Date
  type: 'Wellness Exam' | 'Sick Visit' | 'Follow-up' | 'Emergency' | 'Other'
  chiefComplaint?: string
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled'

  veterinarianName: string

  soap?: {
    subjective: string
    objective: string
    assessment: string
    plan: string
    vitals?: {
      temperature?: string
      heartRate?: string
      respiratoryRate?: string
      weight?: string
    }
  }

  transcript?: string

  createdAt: Date
  updatedAt: Date
  aiProcessed: boolean
}

export interface Medication {
  id: string
  patientId: string
  appointmentId?: string

  name: string
  dosage: string
  frequency: string
  route?: string

  startDate: Date
  endDate?: Date
  status: 'Active' | 'Completed' | 'Discontinued'

  instructions?: string
  prescribedBy: string

  createdAt: Date
  updatedAt: Date
  autoExtracted: boolean
}
