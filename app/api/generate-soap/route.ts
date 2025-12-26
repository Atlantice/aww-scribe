/**
 * SOAP Note Generation Endpoint
 *
 * Uses Google Gemini (Vertex AI) to convert veterinary appointment transcripts
 * into structured SOAP notes with medical entity extraction
 */

import { NextResponse } from 'next/server'
import { VertexAI } from '@google-cloud/vertexai'

const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT_ID!,
  location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
})

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface GenerateSOAPRequest {
  transcript: string
  patientId?: string
  patientName: string
  patientBreed: string
  patientAge?: string
  patientWeight?: string
}

export async function POST(req: Request) {
  try {
    const body: GenerateSOAPRequest = await req.json()

    const { transcript, patientName, patientBreed, patientAge, patientWeight } = body

    if (!transcript || !transcript.trim()) {
      return NextResponse.json(
        { error: 'Transcript is required and cannot be empty' },
        { status: 400 }
      )
    }

    if (!patientName || !patientBreed) {
      return NextResponse.json(
        { error: 'Patient name and breed are required' },
        { status: 400 }
      )
    }

    // Get Gemini model
    const model = vertexAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.3, // Lower temperature for more consistent medical documentation
        maxOutputTokens: 2048,
        topP: 0.95,
      },
    })

    // Build patient info string
    const patientInfo = [
      `Name: ${patientName}`,
      `Breed: ${patientBreed}`,
      patientAge && `Age: ${patientAge}`,
      patientWeight && `Weight: ${patientWeight}`,
    ]
      .filter(Boolean)
      .join('\n')

    // Prompt for SOAP note generation
    const prompt = `You are an expert veterinary medical scribe with years of experience in clinical documentation.

You have just listened to a complete veterinary appointment. Your task is to generate a comprehensive, professional SOAP note from the transcript.

**PATIENT INFORMATION (for reference only):**
${patientInfo}

**APPOINTMENT TRANSCRIPT:**
${transcript}

**CRITICAL INSTRUCTION:**
Only extract information that is explicitly mentioned in the transcript above. Do NOT include patient details (name, breed, age, weight) in the SOAP note unless they were specifically mentioned during the conversation. The patient information above is provided for context only - do not assume it was discussed during the appointment.

**INSTRUCTIONS:**

Generate a complete SOAP note following proper veterinary medical documentation standards:

**[S] SUBJECTIVE:**
- Chief complaint as stated by the owner
- History of present illness (onset, duration, progression)
- Relevant medical history
- Owner observations and concerns
Write in narrative form, 2-4 sentences.

**[O] OBJECTIVE:**
- Vital signs (Temperature, Heart Rate, Respiratory Rate, Weight) if mentioned
- Physical examination findings organized by body system
- Any diagnostic test results mentioned
Write in organized, clinical format. Be specific about measurements.

**[A] ASSESSMENT:**
- Primary diagnosis or differential diagnoses
- Clinical reasoning and interpretation
- Prognosis if discussed
Write clearly and concisely, 1-3 sentences.

**[P] PLAN:**
- Treatments prescribed (medications with dosages and frequencies)
- Diagnostic tests ordered
- Follow-up recommendations
- Client education provided
Use numbered list format for clarity.

**IMPORTANT:**
- Extract ONLY information actually mentioned in the transcript
- Use proper veterinary medical terminology
- Be concise but comprehensive
- If vitals are mentioned, capture exact values
- If medications are mentioned, include doses and frequencies

**OUTPUT FORMAT:**
Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks):
{
  "subjective": "string",
  "objective": "string",
  "assessment": "string",
  "plan": "string",
  "vitals": {
    "temperature": "string or null",
    "heartRate": "string or null",
    "respiratoryRate": "string or null",
    "weight": "string or null"
  },
  "chiefComplaint": "string or null",
  "diagnosis": "string or null"
}

Generate the SOAP note now:`

    // Generate SOAP note
    const result = await model.generateContent(prompt)
    const response = result.response
    const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text || ''

    if (!responseText) {
      throw new Error('No response from Gemini model')
    }

    // Parse JSON from response
    let soapNote
    try {
      // Remove markdown code blocks if present
      const cleanedText = responseText
        .replace(/```json\n?|\n?```/g, '')
        .replace(/```\n?|\n?```/g, '')
        .trim()

      soapNote = JSON.parse(cleanedText)

      // Validate required fields
      if (!soapNote.subjective || !soapNote.objective || !soapNote.assessment || !soapNote.plan) {
        throw new Error('Invalid SOAP note structure')
      }
    } catch (parseError) {
      console.error('Failed to parse SOAP note JSON:', responseText)
      console.error('Parse error:', parseError)

      // Fallback: create basic structure from raw text
      soapNote = {
        subjective: responseText.substring(0, 500),
        objective: 'Unable to parse structured data. Please review transcript.',
        assessment: 'See subjective section for AI-generated content.',
        plan: 'Manual review required.',
        vitals: null,
        chiefComplaint: null,
        diagnosis: null,
      }
    }

    console.log('SOAP note generated successfully for patient:', patientName)

    return NextResponse.json(soapNote)
  } catch (error) {
    console.error('Error generating SOAP note:', error)

    return NextResponse.json(
      {
        error: 'Failed to generate SOAP note',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}
