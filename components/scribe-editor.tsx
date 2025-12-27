"use client"

import { useState, useRef } from "react"
import { X, Mic, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { LiveScribe } from "./live-scribe"

interface ScribeEditorProps {
  onClose: () => void
  patientId: string | null
}

type RecordingState = 'idle' | 'expanding' | 'connecting' | 'recording'

export function ScribeEditor({ onClose, patientId }: ScribeEditorProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle')
  const [connectionStartTime, setConnectionStartTime] = useState<number | null>(null)
  const [manualContent, setManualContent] = useState("")
  const liveScribeRef = useRef<{ startRecording: () => void } | null>(null)

  const handleStartRecording = () => {
    setConnectionStartTime(Date.now())
    setRecordingState('expanding')

    // After expansion animation (200ms), show connecting state
    setTimeout(() => {
      setRecordingState('connecting')
    }, 200)
  }

  const handleConnectionComplete = () => {
    const elapsed = Date.now() - (connectionStartTime || 0)
    const minimumDelay = 400 // ms

    if (elapsed < minimumDelay) {
      // Show connecting state for minimum 400ms
      setTimeout(() => {
        setRecordingState('recording')
        // Trigger LiveScribe to start recording after state transition
        setTimeout(() => {
          liveScribeRef.current?.startRecording()
        }, 100)
      }, minimumDelay - elapsed)
    } else {
      setRecordingState('recording')
      // Trigger LiveScribe to start recording after state transition
      setTimeout(() => {
        liveScribeRef.current?.startRecording()
      }, 100)
    }
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#0a0a0a]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">New Scribe</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
          title="Close"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          <AnimatePresence mode="wait">
            {recordingState === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.2 }}
                className="mb-6"
              >
                {/* Ambient Recording Section */}
                <motion.div
                  layoutId="recording-container"
                  className="relative"
                >
                  {/* Highlight glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-600 rounded-2xl opacity-20 blur-lg" />

                  <div className="relative p-6 rounded-xl border-2 border-purple-300 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-purple-50 dark:from-purple-900/20 dark:to-purple-900/20">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-purple-100 dark:bg-purple-900/30">
                        <Mic className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          Ambient Scribe (Recommended)
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Have a natural conversation with your patient. The AI will listen, transcribe, and generate a structured SOAP note automatically.
                        </p>

                        <button
                          onClick={handleStartRecording}
                          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-600 hover:from-purple-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          <Mic className="w-5 h-5" />
                          Start Ambient Recording
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {(recordingState === 'expanding' || recordingState === 'connecting' || recordingState === 'recording') && (
              <motion.div
                key="recording"
                layoutId="recording-container"
                initial={false}
                animate={{
                  backgroundColor: recordingState === 'expanding'
                    ? 'rgb(250, 245, 255)' // purple-50
                    : 'rgb(255, 255, 255)', // white
                }}
                transition={{
                  layout: { duration: 0.3, ease: "easeInOut" },
                  backgroundColor: { duration: 0.2 }
                }}
                className="relative rounded-xl border-2 p-6 mb-6"
                style={{
                  borderColor: recordingState === 'expanding'
                    ? 'rgb(216, 180, 254)' // purple-300
                    : 'rgb(229, 231, 235)' // gray-200
                }}
              >
                <AnimatePresence mode="wait">
                  {recordingState === 'connecting' && (
                    <motion.div
                      key="connecting"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col items-center gap-4 py-8"
                    >
                      <div className="relative inline-block">
                        <Mic className="w-16 h-16 text-purple-600 animate-pulse" />
                        <motion.div
                          className="absolute inset-0 w-16 h-16 border-4 border-purple-400 rounded-full"
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.6, 0.2, 0.6]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        Connecting to scribe...
                      </div>
                    </motion.div>
                  )}

                  {recordingState === 'recording' && (
                    <motion.div
                      key="recording-ui"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <LiveScribe
                        ref={liveScribeRef}
                        patientId={patientId || ""}
                        patientName="Luna"
                        patientBreed="Golden Retriever"
                        patientAge="4 years"
                        patientWeight="65 lbs"
                        autoStart={false}
                        onConnectionComplete={handleConnectionComplete}
                        onSOAPGenerated={(soap) => {
                          console.log("SOAP generated:", soap)
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Manual Editor Section */}
          <AnimatePresence>
            {recordingState === 'idle' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{
                  opacity: { duration: 0.2 },
                  height: { duration: 0.3 }
                }}
              >
                <div className="mb-3 flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">Manual Entry</h3>
                  <span className="text-xs text-muted-foreground">(Optional)</span>
                </div>

                <textarea
                  value={manualContent}
                  onChange={(e) => setManualContent(e.target.value)}
                  placeholder="Or type your notes manually here... You can also edit the AI-generated content."
                  className="w-full min-h-[400px] p-4 bg-white dark:bg-gray-900 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none font-mono text-sm leading-relaxed"
                />

                {manualContent && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Sparkles className="w-3 h-3" />
                    <span>{manualContent.split(/\s+/).filter(Boolean).length} words</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
