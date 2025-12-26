"use client"

import { useState } from "react"
import { Mic, Square, Sparkles, Save, X, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ScribeEditorProps {
  onClose: () => void
  onSave: (content: string) => void
}

export function ScribeEditor({ onClose, onSave }: ScribeEditorProps) {
  const [content, setContent] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)

  const handleStartRecording = () => {
    setIsRecording(true)
    setRecordingDuration(0)
    // Would start ElevenLabs recording here
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    setIsProcessing(true)
    // Would process recording and generate SOAP note here
    setTimeout(() => {
      setIsProcessing(false)
      setContent("Generated SOAP note content would appear here...")
    }, 2000)
  }

  const handleSave = () => {
    onSave(content)
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#0a0a0a]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-foreground">New Scribe</h2>
          {isRecording && (
            <div className="flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-900/20 rounded-full">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-medium text-red-600 dark:text-red-400 tabular-nums">
                {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={!content || isRecording}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 flex items-center gap-2 text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
            title="Close"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          {/* Ambient Recording Section - Highlighted */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="relative">
              {/* Highlight glow effect */}
              {!isRecording && !content && (
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-20 blur-lg animate-pulse" />
              )}

              <div className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                isRecording
                  ? "border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10"
                  : content
                  ? "border-border bg-white dark:bg-gray-900"
                  : "border-purple-300 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20"
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isRecording
                      ? "bg-red-100 dark:bg-red-900/30"
                      : "bg-purple-100 dark:bg-purple-900/30"
                  }`}>
                    <Mic className={`w-6 h-6 ${
                      isRecording
                        ? "text-red-600 dark:text-red-400"
                        : "text-purple-600 dark:text-purple-400"
                    }`} />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {isRecording ? "Recording in Progress" : "Ambient Scribe"}
                      {!isRecording && !content && " (Recommended)"}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {isRecording
                        ? "The AI is listening to your conversation and will automatically generate a complete SOAP note when you stop."
                        : content
                        ? "Recording completed. Review and edit the generated content below."
                        : "Have a natural conversation with your patient. The AI will listen, transcribe, and generate a structured SOAP note automatically."}
                    </p>

                    {!isRecording && !content && (
                      <button
                        onClick={handleStartRecording}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <Mic className="w-5 h-5" />
                        Start Ambient Recording
                      </button>
                    )}

                    {isRecording && (
                      <button
                        onClick={handleStopRecording}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 font-medium shadow-lg"
                      >
                        <Square className="w-5 h-5" />
                        Stop Recording
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Processing State */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-border"
              >
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Processing Recording</h4>
                    <p className="text-xs text-muted-foreground">Generating your SOAP note with AI...</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Manual Editor Section */}
          {!isRecording && (
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
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Or type your notes manually here... You can also edit the AI-generated content."
                className="w-full min-h-[400px] p-4 bg-white dark:bg-gray-900 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none font-mono text-sm leading-relaxed"
              />

              {content && (
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="w-3 h-3" />
                  <span>{content.split(/\s+/).filter(Boolean).length} words</span>
                </div>
              )}
            </motion.div>
          )}

          {/* Empty state when recording */}
          {isRecording && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4 relative">
                <div className="absolute inset-0 rounded-full bg-red-500 opacity-20 animate-ping" />
                <Mic className="w-12 h-12 text-red-600 relative z-10" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Listening...</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Have your conversation naturally. The AI is capturing everything and will generate a complete SOAP note when you're done.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
