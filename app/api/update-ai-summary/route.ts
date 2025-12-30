import { NextResponse } from 'next/server'
import { updatePatientAISummary } from '@/lib/firestore-helpers'

export async function POST(request: Request) {
  try {
    const { patientId } = await request.json()

    if (!patientId) {
      return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 })
    }

    await updatePatientAISummary(patientId)

    return NextResponse.json({ success: true, message: 'AI summary updated successfully' })
  } catch (error) {
    console.error('Error updating AI summary:', error)
    return NextResponse.json(
      { error: 'Failed to update AI summary', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
