/**
 * Gemini (Vertex AI) Client Configuration
 * Server-side only - handles conversational AI reasoning
 */

import { VertexAI } from "@google-cloud/vertexai"

// Initialize Vertex AI client
// Credentials loaded from GOOGLE_APPLICATION_CREDENTIALS env var
const vertex = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT_ID!,
  location: process.env.GOOGLE_CLOUD_LOCATION || "us-central1",
})

const MODEL_NAME = "gemini-2.0-flash-exp"

export interface ConversationMessage {
  role: "user" | "assistant"
  content: string
}

export interface ChatRequest {
  message: string
  history?: ConversationMessage[]
  context?: string
}

export interface ChatResponse {
  response: string
  error?: string
}

/**
 * Call Gemini for conversational response
 * Optimized for veterinary clinical documentation
 */
export async function callGemini(request: ChatRequest): Promise<ChatResponse> {
  try {
    const model = vertex.preview.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
        topP: 0.9,
        topK: 40,
      },
      systemInstruction: {
        parts: [
          {
            text: `You are a helpful veterinary assistant integrated into AwwScribe, a clinical documentation tool.

Your role:
- Help veterinarians document clinical visits through natural conversation
- Ask clarifying questions about patient symptoms, vitals, and observations
- Extract structured data (chief complaint, vitals, assessment, plan)
- Speak naturally and warmly, as if you're a helpful colleague
- Keep responses concise and conversational (2-3 sentences)
- Focus on gathering clinical information efficiently

When the veterinarian describes a case:
1. Acknowledge what you heard
2. Ask ONE specific follow-up question to gather missing details
3. Guide toward complete SOAP note information

${request.context ? `\nCurrent Context:\n${request.context}` : ""}`,
          },
        ],
      },
    })

    // Build conversation history for context
    const chatHistory = request.history || []
    const contents = chatHistory.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }))

    // Add current user message
    contents.push({
      role: "user",
      parts: [{ text: request.message }],
    })

    // Call Gemini
    const result = await model.generateContent({
      contents,
    })

    const response = result.response?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!response) {
      throw new Error("No response from Gemini")
    }

    return {
      response: response.trim(),
    }
  } catch (error) {
    console.error("Gemini API error:", error)
    return {
      response: "I'm having trouble processing that. Could you repeat what you said about the patient?",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Streaming version for lower latency (optional enhancement)
 * Use if you want progressive response rendering
 */
export async function* streamGemini(request: ChatRequest): AsyncGenerator<string> {
  try {
    const model = vertex.preview.getGenerativeModel({
      model: MODEL_NAME,
    })

    const chatHistory = request.history || []
    const contents = chatHistory.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }))

    contents.push({
      role: "user",
      parts: [{ text: request.message }],
    })

    const result = await model.generateContentStream({
      contents,
    })

    for await (const chunk of result.stream) {
      const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text
      if (text) {
        yield text
      }
    }
  } catch (error) {
    console.error("Gemini streaming error:", error)
    yield "I'm having trouble right now. Could you try again?"
  }
}
