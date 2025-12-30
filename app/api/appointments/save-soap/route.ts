import { NextResponse } from 'next/server'
import { saveSOAPNote, updatePatientAISummary } from '@/lib/firestore-helpers'
import { adminDb } from '@/lib/firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'

export async function POST(req: Request) {
  try {
    const { appointmentId, soap } = await req.json()

    if (!appointmentId || !soap) {
      return NextResponse.json({ error: 'appointmentId and soap required' }, { status: 400 })
    }

    // Save SOAP note
    await saveSOAPNote(appointmentId, soap)

    // Update appointment status
    await adminDb.collection('appointments').doc(appointmentId).update({
      status: 'Completed',
      updatedAt: Timestamp.now(),
    })

    // Get patient ID from appointment and regenerate AI summary
    try {
      const appointmentDoc = await adminDb.collection('appointments').doc(appointmentId).get()
      const appointmentData = appointmentDoc.data()
      if (appointmentData?.patientId) {
        // Update AI summary in background (don't await to avoid slowing down response)
        updatePatientAISummary(appointmentData.patientId).catch(err =>
          console.error('Failed to update AI summary:', err)
        )
      }
    } catch (err) {
      console.error('Error triggering AI summary update:', err)
      // Don't fail the request if summary update fails
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to save SOAP:', error)
    return NextResponse.json({ error: 'Failed to save SOAP' }, { status: 500 })
  }
}
