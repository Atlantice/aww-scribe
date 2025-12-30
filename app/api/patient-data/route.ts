import { NextResponse } from 'next/server'
import { getLatestVitals, getPatientRecentActivity } from '@/lib/firestore-helpers'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const patientId = searchParams.get('patientId')
  const type = searchParams.get('type')

  if (!patientId) {
    return NextResponse.json({ error: 'Patient ID required' }, { status: 400 })
  }

  try {
    if (type === 'vitals') {
      const vitals = await getLatestVitals(patientId)
      return NextResponse.json({ vitals })
    }

    if (type === 'activity') {
      const limit = parseInt(searchParams.get('limit') || '10')
      const activity = await getPatientRecentActivity(patientId, limit)
      return NextResponse.json({ activity })
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error) {
    console.error('Error fetching patient data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
