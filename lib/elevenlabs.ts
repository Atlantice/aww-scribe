/**
 * ElevenLabs Configuration
 * Client-side TTS settings
 */

// Voice IDs from ElevenLabs
// Get from: https://elevenlabs.io/app/voice-library
export const VOICE_IDS = {
  // Professional, warm female voice (good for medical context)
  rachel: "21m00Tcm4TlvDq8ikWAM",
  // Calm, professional male voice
  adam: "pNInz6obpgDQGcFmaJgB",
  // Friendly, conversational female
  bella: "EXAVITQu4vr4xnSDxMaL",
  // Default voice for veterinary assistant
  vet_assistant: "21m00Tcm4TlvDq8ikWAM", // Rachel
} as const

export interface VoiceSettings {
  stability: number
  similarity_boost: number
  style?: number
  use_speaker_boost?: boolean
}

// Optimized settings for conversational AI
export const VOICE_SETTINGS: VoiceSettings = {
  stability: 0.5, // More expressive
  similarity_boost: 0.75, // Maintain voice consistency
  style: 0.5, // Natural conversational style
  use_speaker_boost: true, // Better clarity
}

// Voice configuration for different contexts
export const VOICE_CONFIGS = {
  assistant: {
    voiceId: VOICE_IDS.vet_assistant,
    settings: VOICE_SETTINGS,
  },
  professional: {
    voiceId: VOICE_IDS.adam,
    settings: {
      ...VOICE_SETTINGS,
      stability: 0.7, // More stable for formal contexts
    },
  },
} as const
