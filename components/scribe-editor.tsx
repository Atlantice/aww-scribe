"use client"

import { useState } from "react"
import { X, Sparkles, Edit } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { LiveScribe } from "./live-scribe"

interface ScribeEditorProps {
  onClose: () => void
  patientId: string | null
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
  appointmentId?: string
}

export function ScribeEditor({ onClose, patientId }: ScribeEditorProps) {
  const [generatedSOAP, setGeneratedSOAP] = useState<SOAPNote | null>(null)

  const handleSOAPGenerated = async (soap: SOAPNote) => {
    console.log('Received SOAP in ScribeEditor:', soap)
    setGeneratedSOAP(soap)
  }

  const appointmentDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

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
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Patient Header */}
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-semibold text-foreground leading-tight">
                  Luna • {appointmentDate} • Dr. Sarah Chen
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Golden Retriever • 4 years • 65 lbs</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-muted-foreground">
                Draft
              </span>
            </div>
          </div>

          {/* AI Summary Card - Canary Mail style */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#faf5ff] to-[#f5f3ff] dark:from-[#2e1065] dark:to-[#1e1538] border border-purple-200 dark:border-purple-900">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#8b5cf6]" />
              <h3 className="text-sm font-semibold text-foreground">AI Voice Assistant</h3>
            </div>
            <p className="text-sm text-foreground leading-relaxed text-balance">
              Have a conversation with the AI assistant to document Luna's visit. The assistant will ask follow-up
              questions and help generate a complete SOAP note from your voice input.
            </p>
          </div>

          {/* Live Scribe Component - INTEGRATED */}
          <LiveScribe
            patientId={patientId}
            patientName="Luna"
            patientBreed="Golden Retriever"
            patientAge="4 years"
            patientWeight="65 lbs"
            onSOAPGenerated={handleSOAPGenerated}
          />

          {/* ONLY SHOW SOAP IF GENERATED */}
          <AnimatePresence mode="wait">
            {generatedSOAP ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Extracted Vitals - Claude-inspired with hover states */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.2 }}
                >
                  <h3 className="text-sm font-semibold text-foreground mb-3">Extracted Vitals</h3>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-900/10 border border-amber-200 dark:border-amber-900/40 transition-all duration-200 hover:shadow-md hover:scale-[1.02] group">
                      <div className="text-xs font-medium text-amber-900 dark:text-amber-400 mb-2">Temperature</div>
                      <div className="text-2xl font-bold text-foreground tabular-nums">
                        {generatedSOAP.vitals?.temperature || '--'}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-900/10 border border-red-200 dark:border-red-900/40 transition-all duration-200 hover:shadow-md hover:scale-[1.02] group">
                      <div className="text-xs font-medium text-red-900 dark:text-red-400 mb-2">Heart Rate</div>
                      <div className="text-2xl font-bold text-foreground tabular-nums">
                        {generatedSOAP.vitals?.heartRate || '--'}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-sky-50 to-sky-100/50 dark:from-sky-900/20 dark:to-sky-900/10 border border-sky-200 dark:border-sky-900/40 transition-all duration-200 hover:shadow-md hover:scale-[1.02] group">
                      <div className="text-xs font-medium text-sky-900 dark:text-sky-400 mb-2">Resp. Rate</div>
                      <div className="text-2xl font-bold text-foreground tabular-nums">
                        {generatedSOAP.vitals?.respiratoryRate || '--'}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100/50 dark:from-violet-900/20 dark:to-violet-900/10 border border-violet-200 dark:border-violet-900/40 transition-all duration-200 hover:shadow-md hover:scale-[1.02] group">
                      <div className="text-xs font-medium text-violet-900 dark:text-violet-400 mb-2">Weight</div>
                      <div className="text-2xl font-bold text-foreground tabular-nums">
                        {generatedSOAP.vitals?.weight || '--'}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* SOAP Note Sections - Clean with colored left border */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.2 }}
                  className="space-y-3"
                >
                  {/* Subjective */}
                  <div className="bg-white dark:bg-[#1a1a1a] border border-border rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md hover:border-purple-200 dark:hover:border-purple-900">
                    <div className="px-5 py-3 bg-gradient-to-r from-purple-50 to-purple-100 dark:bg-gradient-to-r dark:from-purple-950/30 dark:to-purple-900/20 border-l-4 border-purple-500">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xs font-semibold text-primary uppercase tracking-wide">[S] SUBJECTIVE</h3>
                          <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">Chief complaint and history</p>
                        </div>
                        <button className="px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-purple-100 dark:hover:bg-purple-900/40 flex items-center gap-1 transition-all duration-200">
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-foreground leading-relaxed">
                        {generatedSOAP.subjective}
                      </p>
                    </div>
                  </div>

                  {/* Objective */}
                  <div className="bg-white dark:bg-[#1a1a1a] border border-border rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md hover:border-green-200 dark:hover:border-green-900">
                    <div className="px-5 py-3 bg-gradient-to-r from-green-50 to-green-100 dark:bg-gradient-to-r dark:from-green-950/30 dark:to-green-900/20 border-l-4 border-green-500">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xs font-semibold text-green-900 dark:text-green-100 uppercase tracking-wide">[O] OBJECTIVE</h3>
                          <p className="text-xs text-green-700 dark:text-green-400 mt-1">Physical exam and vitals</p>
                        </div>
                        <button className="px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-green-100 dark:hover:bg-green-900/40 flex items-center gap-1 transition-all duration-200">
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                      </div>
                    </div>
                    <div className="p-4 space-y-2 text-sm text-foreground leading-relaxed">
                      <p className="whitespace-pre-wrap">{generatedSOAP.objective}</p>
                    </div>
                  </div>

                  {/* Assessment */}
                  <div className="bg-white dark:bg-[#1a1a1a] border border-border rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md hover:border-amber-200 dark:hover:border-amber-900">
                    <div className="px-5 py-3 bg-gradient-to-r from-amber-50 to-amber-100 dark:bg-gradient-to-r dark:from-amber-950/30 dark:to-amber-900/20 border-l-4 border-amber-500">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xs font-semibold text-amber-900 dark:text-amber-100 uppercase tracking-wide">[A] ASSESSMENT</h3>
                          <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">Diagnosis and interpretation</p>
                        </div>
                        <button className="px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-amber-100 dark:hover:bg-amber-900/40 flex items-center gap-1 transition-all duration-200">
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-foreground leading-relaxed">
                        {generatedSOAP.assessment}
                      </p>
                    </div>
                  </div>

                  {/* Plan */}
                  <div className="bg-white dark:bg-[#1a1a1a] border border-border rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md hover:border-purple-200 dark:hover:border-purple-900">
                    <div className="px-5 py-3 bg-gradient-to-r from-purple-50 to-purple-100 dark:bg-gradient-to-r dark:from-purple-950/30 dark:to-purple-900/20 border-l-4 border-purple-500">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xs font-semibold text-purple-900 dark:text-purple-100 uppercase tracking-wide">[P] PLAN</h3>
                          <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">Treatment and follow-up</p>
                        </div>
                        <button className="px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-purple-100 dark:hover:bg-purple-900/40 flex items-center gap-1 transition-all duration-200">
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                      </div>
                    </div>
                    <div className="p-4 space-y-3 text-sm text-foreground">
                      <p className="whitespace-pre-wrap">{generatedSOAP.plan}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  <button className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm hover:shadow-md transition-all duration-200">
                    Approve & Save
                  </button>
                  <button className="px-6 py-2.5 rounded-lg border border-border hover:bg-gray-50 dark:hover:bg-gray-800 text-foreground font-medium transition-all duration-200">
                    Edit Note
                  </button>
                </div>
              </motion.div>
            ) : (
              // BLANK STATE - Before SOAP is generated
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Ready to Document
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Click "Start Listening" above to begin documenting this appointment.
                  The AI will transcribe your conversation and generate a complete SOAP note.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
