/**
 * Voice Conversation Component
 * Interactive voice UI with ElevenLabs TTS integration
 */

"use client"

import { useEffect, useRef } from "react"
import { Mic, MicOff, Volume2, VolumeX, Loader2, AlertCircle } from "lucide-react"
import { useVoiceConversation } from "@/hooks/use-voice-conversation"
import { VOICE_CONFIGS } from "@/lib/elevenlabs"

interface VoiceConversationProps {
  patientName?: string
  patientSpecies?: string
  patientAge?: string
  patientWeight?: string
  onTranscriptUpdate?: (transcript: string) => void
}

export function VoiceConversation({
  patientName = "Luna",
  patientSpecies = "Golden Retriever",
  patientAge = "4 years",
  patientWeight = "65 lbs",
  onTranscriptUpdate,
}: VoiceConversationProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isPlayingRef = useRef(false)

  const {
    isListening,
    isSpeaking,
    isProcessing,
    transcript,
    conversation,
    error,
    startListening,
    stopListening,
    processTranscript,
    clearConversation,
    setIsSpeaking,
  } = useVoiceConversation({
    patientContext: {
      name: patientName,
      species: patientSpecies,
      age: patientAge,
      weight: patientWeight,
    },
    onTranscriptUpdate,
  })

  // Play response using ElevenLabs API
  const playResponse = async (text: string) => {
    if (!text || isPlayingRef.current) return

    try {
      setIsSpeaking(true)
      isPlayingRef.current = true

      const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY

      if (!apiKey) {
        console.error("ElevenLabs API key not configured")
        setIsSpeaking(false)
        isPlayingRef.current = false
        return
      }

      // Call ElevenLabs TTS API directly (hackathon-friendly approach)
      const voiceId = VOICE_CONFIGS.assistant.voiceId
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2_5", // Fastest model for low latency
          voice_settings: VOICE_CONFIGS.assistant.settings,
        }),
      })

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`)
      }

      // Get audio blob
      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)

      // Play audio
      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onended = () => {
        setIsSpeaking(false)
        isPlayingRef.current = false
        URL.revokeObjectURL(audioUrl)
        // Resume listening after response
        startListening()
      }

      audio.onerror = (error) => {
        console.error("Audio playback error:", error)
        setIsSpeaking(false)
        isPlayingRef.current = false
        URL.revokeObjectURL(audioUrl)
      }

      await audio.play()
    } catch (error) {
      console.error("TTS error:", error)
      setIsSpeaking(false)
      isPlayingRef.current = false
    }
  }

  // Auto-play assistant responses
  useEffect(() => {
    const lastMessage = conversation[conversation.length - 1]
    if (lastMessage && lastMessage.role === "assistant" && !isSpeaking) {
      playResponse(lastMessage.content)
    }
  }, [conversation])

  // Handle voice interaction flow
  const handleToggleListening = () => {
    if (isListening) {
      stopListening()
      // Process what was said
      if (transcript) {
        processTranscript()
      }
    } else {
      // Stop any playing audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
        setIsSpeaking(false)
        isPlayingRef.current = false
      }
      startListening()
    }
  }

  const handleStopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setIsSpeaking(false)
    isPlayingRef.current = false
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900 dark:text-red-100">Error</p>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Voice Controls */}
      <div className="flex flex-col items-center gap-6 py-8 px-4 rounded-xl bg-gradient-to-br from-[#fafafa] to-[#f5f5f5] dark:from-[#1a1a1a] dark:to-[#0a0a0a] border border-border">
        {/* Status Indicator */}
        <div className="flex items-center gap-3">
          {isListening && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-medium text-red-600 dark:text-red-400">Listening...</span>
            </div>
          )}
          {isSpeaking && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
              <Volume2 className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-pulse" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Speaking...</span>
            </div>
          )}
          {isProcessing && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">
              <Loader2 className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-spin" />
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Processing...</span>
            </div>
          )}
        </div>

        {/* Main Control Button */}
        <button
          onClick={handleToggleListening}
          disabled={isSpeaking || isProcessing}
          className="relative w-28 h-28 rounded-full bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
          aria-label={isListening ? "Stop listening" : "Start listening"}
        >
          {isListening && (
            <div className="absolute inset-0 rounded-full bg-red-300 dark:bg-red-400 animate-ping opacity-25" />
          )}
          {isListening ? (
            <Mic className="w-12 h-12 text-white relative z-10" />
          ) : (
            <MicOff className="w-12 h-12 text-white relative z-10" />
          )}
        </button>

        {/* Secondary Controls */}
        <div className="flex gap-3">
          {isSpeaking && (
            <button
              onClick={handleStopSpeaking}
              className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors flex items-center gap-2"
            >
              <VolumeX className="w-4 h-4" />
              Stop Speaking
            </button>
          )}
          <button
            onClick={clearConversation}
            className="px-4 py-2 rounded-lg border border-border hover:bg-gray-50 dark:hover:bg-[#1a1a1a] text-sm font-medium text-foreground transition-colors"
          >
            Clear Conversation
          </button>
        </div>

        {/* Current Transcript Preview */}
        {transcript && (
          <div className="max-w-md text-center">
            <p className="text-sm text-muted-foreground mb-1">Current input:</p>
            <p className="text-base text-foreground font-medium">{transcript}</p>
          </div>
        )}
      </div>

      {/* Conversation History */}
      {conversation.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Conversation</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {conversation.map((message, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  message.role === "user"
                    ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                    : "bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-xs font-semibold ${
                      message.role === "user"
                        ? "text-blue-700 dark:text-blue-300"
                        : "text-purple-700 dark:text-purple-300"
                    }`}
                  >
                    {message.role === "user" ? "You" : "Assistant"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{message.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
