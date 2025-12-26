/**
 * Appointment Booking Endpoint
 *
 * PLACEHOLDER for ElevenLabs Agent Tool
 *
 * This endpoint will be called by the ElevenLabs Conversational AI Agent
 * to book appointments after confirming availability during phone calls.
 *
 * Expected functionality:
 * - Validate appointment slot is still available (race condition check)
 * - Create appointment record in database
 * - Send confirmation email/SMS to pet owner
 * - Add to veterinarian's calendar
 * - Return confirmation details for agent to read to caller
 */

import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface BookAppointmentRequest {
  patientName: string
  patientSpecies?: 'dog' | 'cat' | 'bird' | 'other'
  patientBreed?: string
  ownerName: string
  ownerPhone: string
  ownerEmail?: string
  appointmentTime: string // ISO 8601 datetime
  serviceType: 'exam' | 'surgery' | 'grooming' | 'emergency'
  veterinarianId?: string
  notes?: string
}

interface BookAppointmentResponse {
  success: boolean
  appointmentId?: string
  confirmationNumber?: string
  appointmentDetails?: {
    patientName: string
    ownerName: string
    dateTime: string
    veterinarian: string
    serviceType: string
  }
  message: string
}

export async function POST(req: Request) {
  try {
    const body: BookAppointmentRequest = await req.json()

    const {
      patientName,
      patientSpecies = 'dog',
      patientBreed,
      ownerName,
      ownerPhone,
      ownerEmail,
      appointmentTime,
      serviceType,
      veterinarianId,
      notes,
    } = body

    // Validation
    if (!patientName || !ownerName || !ownerPhone || !appointmentTime || !serviceType) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: patientName, ownerName, ownerPhone, appointmentTime, serviceType',
        },
        { status: 400 }
      )
    }

    // PLACEHOLDER: In production, this would:
    // 1. Check appointment slot is still available
    // 2. Create database record
    // 3. Send confirmation email/SMS
    // 4. Update calendar system

    console.log('[PLACEHOLDER] Book appointment request:', {
      patientName,
      patientSpecies,
      patientBreed,
      ownerName,
      ownerPhone,
      ownerEmail,
      appointmentTime,
      serviceType,
      veterinarianId,
      notes,
    })

    // Mock appointment creation
    const mockAppointmentId = `APT-${Date.now()}`
    const mockConfirmationNumber = `CONF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    const response: BookAppointmentResponse = {
      success: true,
      appointmentId: mockAppointmentId,
      confirmationNumber: mockConfirmationNumber,
      appointmentDetails: {
        patientName,
        ownerName,
        dateTime: new Date(appointmentTime).toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        }),
        veterinarian: veterinarianId || 'Dr. Smith',
        serviceType,
      },
      message: `PLACEHOLDER: Appointment mock-booked successfully. Confirmation number: ${mockConfirmationNumber}`,
    }

    // PLACEHOLDER: Send confirmation
    if (ownerEmail) {
      console.log(`[PLACEHOLDER] Would send confirmation email to: ${ownerEmail}`)
    }
    console.log(`[PLACEHOLDER] Would send confirmation SMS to: ${ownerPhone}`)

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error booking appointment:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to book appointment',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}

/**
 * TODO: Production Implementation
 *
 * 1. Database Operations:
 *    - INSERT into appointments table
 *    - Atomic transaction with availability check
 *    - Create patient record if new patient
 *    - Link to owner account
 *
 * 2. External Integrations:
 *    - Email service (SendGrid, AWS SES, Resend)
 *    - SMS service (Twilio, AWS SNS)
 *    - Calendar sync (Google Calendar API, iCal)
 *    - Payment processing if deposit required
 *
 * 3. Business Logic:
 *    - Duplicate appointment detection
 *    - Cancellation/rescheduling rules
 *    - Reminder scheduling (24hr, 1hr before)
 *    - Waitlist management
 *
 * 4. ElevenLabs Agent Tool Configuration:
 *    {
 *      "name": "book_appointment",
 *      "description": "Book a veterinary appointment for a patient",
 *      "parameters": {
 *        "type": "object",
 *        "properties": {
 *          "patientName": { "type": "string" },
 *          "ownerName": { "type": "string" },
 *          "ownerPhone": { "type": "string" },
 *          "appointmentTime": { "type": "string", "format": "date-time" },
 *          "serviceType": { "type": "string", "enum": ["exam", "surgery", "grooming"] }
 *        },
 *        "required": ["patientName", "ownerName", "ownerPhone", "appointmentTime", "serviceType"]
 *      }
 *    }
 *
 * 5. Error Handling:
 *    - Slot no longer available -> offer alternatives
 *    - Duplicate appointment -> confirm or reschedule
 *    - Invalid phone/email -> request correction
 *    - System error -> fallback to manual booking
 */
