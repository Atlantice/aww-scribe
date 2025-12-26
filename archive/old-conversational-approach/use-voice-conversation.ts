/**
 * Voice Conversation Hook
 * Manages speech recognition, conversation state, and TTS playback
 */

"use client"

import { useState, useCallback, useRef, useEffect } from "react"

export interface ConversationMessage {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface PatientContext {
  name: string
  species: string
  age: string
  weight: string
}

interface UseVoiceConversationOptions {
  patientContext?: PatientContext
  onTranscriptUpdate?: (transcript: string) => void
  onConversationUpdate?: (messages: ConversationMessage[]) => void
}

export function useVoiceConversation(options: UseVoiceConversationOptions = {}) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [conversation, setConversation] = useState<ConversationMessage[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const isInitializedRef = useRef(false)

  // Initialize Web Speech API
  useEffect(() => {
    if (typeof window === "undefined" || isInitializedRef.current) return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser. Please use Chrome or Edge.")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
    }

    recognition.onresult = (event) => {
      let interimTranscript = ""
      let finalTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " "
        } else {
          interimTranscript += transcript
        }
      }

      if (finalTranscript) {
        setTranscript((prev) => prev + finalTranscript)
        options.onTranscriptUpdate?.(finalTranscript.trim())
      }
    }

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error)
      if (event.error === "no-speech") {
        // Ignore no-speech errors, they're normal
        return
      }
      setError(`Speech recognition error: ${event.error}`)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
    isInitializedRef.current = true

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [options])

  // Start listening
  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError("Speech recognition not initialized")
      return
    }

    try {
      recognitionRef.current.start()
      setTranscript("")
    } catch (error) {
      console.error("Error starting recognition:", error)
      setError("Failed to start listening")
    }
  }, [])

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }, [])

  // Send message to Gemini and get response
  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim()) return null

      setIsProcessing(true)
      setError(null)

      // Add user message to conversation
      const userMessage: ConversationMessage = {
        role: "user",
        content: message.trim(),
        timestamp: new Date(),
      }

      setConversation((prev) => {
        const updated = [...prev, userMessage]
        options.onConversationUpdate?.(updated)
        return updated
      })

      try {
        // Call our API route
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: message.trim(),
            history: conversation,
            patientContext: options.patientContext,
          }),
        })

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`)
        }

        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        // Add assistant response to conversation
        const assistantMessage: ConversationMessage = {
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        }

        setConversation((prev) => {
          const updated = [...prev, assistantMessage]
          options.onConversationUpdate?.(updated)
          return updated
        })

        return assistantMessage.content
      } catch (error) {
        console.error("Error sending message:", error)
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        setError(`Failed to get response: ${errorMessage}`)
        return null
      } finally {
        setIsProcessing(false)
      }
    },
    [conversation, options]
  )

  // Process current transcript and send to Gemini
  const processTranscript = useCallback(async () => {
    if (!transcript.trim()) return

    const currentTranscript = transcript
    setTranscript("") // Clear for next input

    return await sendMessage(currentTranscript)
  }, [transcript, sendMessage])

  // Clear conversation
  const clearConversation = useCallback(() => {
    setConversation([])
    setTranscript("")
    setError(null)
    options.onConversationUpdate?.([])
  }, [options])

  return {
    // State
    isListening,
    isSpeaking,
    isProcessing,
    transcript,
    conversation,
    error,

    // Actions
    startListening,
    stopListening,
    sendMessage,
    processTranscript,
    clearConversation,
    setIsSpeaking,
  }
}

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }

  class SpeechRecognition extends EventTarget {
    continuous: boolean
    interimResults: boolean
    lang: string
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null
    onend: ((this: SpeechRecognition, ev: Event) => any) | null
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
    start(): void
    stop(): void
    abort(): void
  }

  interface SpeechRecognitionErrorEvent extends Event {
    error: string
    message: string
  }

  interface SpeechRecognitionEvent extends Event {
    resultIndex: number
    results: SpeechRecognitionResultList
  }

  interface SpeechRecognitionResultList {
    length: number
    item(index: number): SpeechRecognitionResult
    [index: number]: SpeechRecognitionResult
  }

  interface SpeechRecognitionResult {
    length: number
    item(index: number): SpeechRecognitionAlternative
    [index: number]: SpeechRecognitionAlternative
    isFinal: boolean
  }

  interface SpeechRecognitionAlternative {
    transcript: string
    confidence: number
  }
}
