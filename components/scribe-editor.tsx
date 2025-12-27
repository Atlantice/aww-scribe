"use client"

import { useState } from "react"
import { X, Mic, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { LiveScribe } from "./live-scribe"

interface ScribeEditorProps {
  onClose: () => void
  patientId: string | null
}

export function ScribeEditor({ onClose, patientId }: ScribeEditorProps) {
  const [showLiveScribe, setShowLiveScribe] = useState(false)
  const [manualContent, setManualContent] = useState("")

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
          {/* Show LiveScribe when recording is active */}
          {showLiveScribe ? (
            <LiveScribe
              patientId={patientId || ""}
              patientName="Luna"
              patientBreed="Golden Retriever"
              patientAge="4 years"
              patientWeight="65 lbs"
              autoStart={true}
              onSOAPGenerated={(soap) => {
                console.log("SOAP generated:", soap)
              }}
            />
          ) : (
            <>
              {/* Ambient Recording Section - Highlighted */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div className="relative">
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
                          onClick={() => setShowLiveScribe(true)}
                          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-600 hover:from-purple-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          <Mic className="w-5 h-5" />
                          Start Ambient Recording
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Manual Editor Section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}
