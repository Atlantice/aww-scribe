import { NextResponse } from 'next/server'
import { Timestamp } from 'firebase-admin/firestore'
import { createAppointment } from '@/lib/firestore-helpers'

export async function POST(req: Request) {
  try {
    const { patientId, veterinarianName, type, chiefComplaint } = await req.json()

    console.log('Creating appointment with:', { patientId, veterinarianName, type, chiefComplaint })

    if (!patientId) {
      return NextResponse.json({ error: 'patientId required' }, { status: 400 })
    }

    const appointmentId = await createAppointment({
      patientId,
      veterinarianName: veterinarianName || 'Dr. Sarah Chen',
      type: type || 'Sick Visit',
      chiefComplaint,
      date: Timestamp.now(),
      status: 'In Progress',
    })

    console.log('✓ Appointment created successfully:', appointmentId)
    return NextResponse.json({ appointmentId })
  } catch (error) {
    console.error('✗ Failed to create appointment:', error)

    // Return more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorDetails = error instanceof Error && 'code' in error
      ? { code: (error as any).code, details: (error as any).details }
      : {}

    return NextResponse.json({
      error: 'Failed to create appointment',
      message: errorMessage,
      ...errorDetails
    }, { status: 500 })
  }
}
