/**
 * Live Scribe Component
 *
 * Ambient transcription during veterinary exams using ElevenLabs Scribe v2 Realtime
 * - Real-time speech-to-text with medical terminology accuracy
 * - No AI responses during recording (passive listening only)
 * - Generates SOAP note when stopped
 */

'use client'

import { useState } from 'react'
import { useScribe } from '@elevenlabs/react'
import { Mic, Sparkles, AlertCircle, Loader2 } from 'lucide-react'

interface LiveScribeProps {
  patientId: string
  patientName: string
  patientBreed: string
  patientAge?: string
  patientWeight?: string
  onSOAPGenerated?: (soap: SOAPNote) => void
}

interface SOAPNote {
  subjective: string
  objective: string
  assessment: string
  plan: string
  vitals?: {
    temperature?: string
    heartRate?: string
    respiratoryRate?: string
    weight?: string
  }
  chiefComplaint?: string
  diagnosis?: string
}

export function LiveScribe({
  patientId,
  patientName,
  patientBreed,
  patientAge,
  patientWeight,
  onSOAPGenerated,
}: LiveScribeProps) {
  const [fullTranscript, setFullTranscript] = useState('')
  const [soapNote, setSoapNote] = useState<SOAPNote | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ElevenLabs Scribe v2 hook
  const scribe = useScribe({
    modelId: 'scribe_v2_realtime',

    // Partial transcripts (live, as speaking - optional to display)
    onPartialTranscript: (data) => {
      console.log('Partial:', data.text)
    },

    // Committed transcripts (completed speech segments)
    onCommittedTranscript: (data) => {
      console.log('Committed:', data.text)
      setFullTranscript((prev) => (prev ? prev + ' ' + data.text : data.text))
    },

    // Error handling
    onError: (error) => {
      console.error('Scribe error:', error)
      setError(`Transcription error: ${error.message}`)
    },

    // Connection events
    onOpen: () => {
      console.log('Scribe connected')
      setError(null)
    },
    onClose: () => console.log('Scribe disconnected'),
  })

  // Start recording
  const handleStartRecording = async () => {
    try {
      setError(null)
      setFullTranscript('')
      setSoapNote(null)

      // Fetch single-use token
      const response = await fetch('/api/scribe-token')

      if (!response.ok) {
        throw new Error('Failed to fetch authentication token')
      }

      const { token } = await response.json()

      // Connect to ElevenLabs Scribe v2
      await scribe.connect({
        token,

        // Microphone settings for clean audio
        microphone: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },

        // Language (helps accuracy)
        languageCode: 'en',

        // Audio format (16kHz recommended)
        audioFormat: 'pcm_16000',

        // Commit strategy: 'vad' auto-segments on silence
        commitStrategy: 'vad',

        // VAD settings
        vadSilenceThresholdSecs: 2.0, // 2 seconds silence = commit
        vadThreshold: 0.4, // Sensitivity (0.1-0.9)

        // Include word-level timestamps (optional)
        includeTimestamps: false,
      })

      console.log('Recording started successfully')
    } catch (error) {
      console.error('Failed to start recording:', error)
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to start recording. Check console for details.'
      )
    }
  }

  // Stop recording and generate SOAP
  const handleStopAndGenerate = async () => {
    // Disconnect from ElevenLabs
    scribe.disconnect()

    if (!fullTranscript.trim()) {
      setError('No transcript to process. Please speak during the recording.')
      return
    }

    // Generate SOAP note from transcript
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-soap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: fullTranscript,
          patientId,
          patientName,
          patientBreed,
          patientAge,
          patientWeight,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate SOAP note')
      }

      const soap = await response.json()
      setSoapNote(soap)

      // Call the callback to send SOAP to parent
      if (onSOAPGenerated) {
        onSOAPGenerated(soap)
      }

      console.log('SOAP note generated successfully')
    } catch (error) {
      console.error('Failed to generate SOAP:', error)
      setError(
        error instanceof Error
          ? `Failed to generate SOAP note: ${error.message}`
          : 'Failed to generate SOAP note'
      )
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900">Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Recording Controls */}
      <div className="flex flex-col items-center gap-6 py-12 px-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-sm">
        {!scribe.isConnected ? (
          <button
            onClick={handleStartRecording}
            disabled={isGenerating}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Recording
          </button>
        ) : (
          <>
            {/* Status indicator */}
            <div className="flex items-center gap-3 px-5 py-3 bg-red-50 rounded-full border-2 border-red-200">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-semibold text-red-700">
                Recording in Progress
              </span>
            </div>

            {/* Visual feedback */}
            <div className="text-center">
              <div className="relative inline-block">
                <Mic className="w-16 h-16 text-blue-600" />
                <div className="absolute inset-0 w-16 h-16 bg-blue-400 rounded-full animate-ping opacity-25" />
              </div>
              <div className="text-sm text-gray-600 mt-3">Listening to conversation...</div>
            </div>

            {/* Stop button */}
            <button
              onClick={handleStopAndGenerate}
              disabled={isGenerating}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating SOAP...
                </span>
              ) : (
                'Stop & Generate SOAP'
              )}
            </button>
          </>
        )}
      </div>

      {/* Live Transcript Display */}
      {scribe.isConnected && (
        <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live Transcript
          </h3>

          <div className="space-y-3 font-mono text-sm text-gray-700 max-h-96 overflow-y-auto">
            {/* Show committed transcripts */}
            {scribe.committedTranscripts.map((t, idx) => (
              <p key={t.id || idx} className="leading-relaxed">
                {t.text}
              </p>
            ))}

            {/* Show current partial (live) */}
            {scribe.partialTranscript && (
              <p className="text-gray-500 italic leading-relaxed">
                {scribe.partialTranscript}
                <span className="inline-block w-0.5 h-4 bg-blue-600 animate-pulse ml-1" />
              </p>
            )}

            {/* Empty state */}
            {scribe.committedTranscripts.length === 0 && !scribe.partialTranscript && (
              <p className="text-gray-400 italic text-center py-8">
                Awaiting speech...
              </p>
            )}
          </div>
        </div>
      )}

      {/* AI Processing Indicator */}
      {isGenerating && (
        <div className="flex items-center gap-3 p-5 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
          <Sparkles className="w-6 h-6 text-purple-600 animate-pulse" />
          <div>
            <p className="text-sm font-semibold text-purple-900">AI Processing</p>
            <p className="text-xs text-purple-700 mt-0.5">
              Extracting medical entities and generating SOAP note...
            </p>
          </div>
        </div>
      )}

      {/* Generated SOAP Note */}
      {soapNote && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">SOAP Note</h2>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
              Generated
            </span>
          </div>

          {/* Subjective */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-3 bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500">
              <h3 className="text-sm font-bold text-blue-900">[S] SUBJECTIVE</h3>
              <p className="text-xs text-blue-700 mt-0.5">Chief complaint and history</p>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                {soapNote.subjective}
              </p>
            </div>
          </div>

          {/* Objective */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-3 bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500">
              <h3 className="text-sm font-bold text-green-900">[O] OBJECTIVE</h3>
              <p className="text-xs text-green-700 mt-0.5">Physical exam and vitals</p>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                {soapNote.objective}
              </p>
            </div>
          </div>

          {/* Assessment */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-3 bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-500">
              <h3 className="text-sm font-bold text-amber-900">[A] ASSESSMENT</h3>
              <p className="text-xs text-amber-700 mt-0.5">Diagnosis and interpretation</p>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                {soapNote.assessment}
              </p>
            </div>
          </div>

          {/* Plan */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-3 bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-500">
              <h3 className="text-sm font-bold text-purple-900">[P] PLAN</h3>
              <p className="text-xs text-purple-700 mt-0.5">Treatment and follow-up</p>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                {soapNote.plan}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
