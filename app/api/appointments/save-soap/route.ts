import { NextResponse } from 'next/server'
import { saveSOAPNote } from '@/lib/firestore-helpers'
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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to save SOAP:', error)
    return NextResponse.json({ error: 'Failed to save SOAP' }, { status: 500 })
  }
}
