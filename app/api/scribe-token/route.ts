/**
 * Scribe Token Generation Endpoint
 *
 * Generates single-use tokens for ElevenLabs Scribe v2 Realtime
 * Tokens expire after 15 minutes for security
 */

import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY

    if (!apiKey) {
      console.error('ELEVENLABS_API_KEY not configured')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Fetch single-use token from ElevenLabs
    const response = await fetch(
      'https://api.elevenlabs.io/v1/single-use-token/realtime_scribe',
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('ElevenLabs API error:', response.status, errorText)
      throw new Error(`Failed to generate token: ${response.status}`)
    }

    const data = await response.json()

    // Token expires in 15 minutes
    return NextResponse.json({
      token: data.token,
      expiresIn: 900 // 15 minutes in seconds
    })
  } catch (error) {
    console.error('Error generating scribe token:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate authentication token',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
