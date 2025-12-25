/**
 * Chat API Route - Gemini Integration
 * Handles conversational AI requests from the frontend
 */

import { NextRequest, NextResponse } from "next/server"
import { callGemini, type ConversationMessage } from "@/lib/gemini"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface ChatRequestBody {
  message: string
  history?: ConversationMessage[]
  patientContext?: {
    name: string
    species: string
    age: string
    weight: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequestBody = await request.json()

    if (!body.message || typeof body.message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Build context from patient info if available
    let context = ""
    if (body.patientContext) {
      const { name, species, age, weight } = body.patientContext
      context = `Current patient: ${name}, ${species}, ${age}, ${weight}`
    }

    // Call Gemini
    const result = await callGemini({
      message: body.message,
      history: body.history || [],
      context,
    })

    return NextResponse.json({
      response: result.response,
      error: result.error,
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      {
        error: "Failed to process chat request",
        response: "I'm having technical difficulties. Let's try that again.",
      },
      { status: 500 }
    )
  }
}
