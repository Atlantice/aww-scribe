"use client"

import { useState } from "react"
import { Sparkles, Edit, Calendar } from "lucide-react"
import { LiveScribe } from "./live-scribe"

interface DetailPanelProps {
  activeSection: string
  selectedItem: string
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

export function DetailPanel({ activeSection, selectedItem }: DetailPanelProps) {
  const [generatedSOAP, setGeneratedSOAP] = useState<SOAPNote | null>(null)

  const handleSOAPGenerated = (soap: SOAPNote) => {
    console.log('Received SOAP in DetailPanel:', soap)
    setGeneratedSOAP(soap)
  }

  const renderRecordingView = () => (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground leading-tight">
                Luna • Dec 24, 2024 • Dr. Sarah Chen
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Golden Retriever • 4 years • 65 lbs</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-muted-foreground text-xs font-medium">
              {generatedSOAP ? 'Generated' : 'Draft'}
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
          patientId="demo-patient-luna-001"
          patientName="Luna"
          patientBreed="Golden Retriever"
          patientAge="4 years"
          patientWeight="65 lbs"
          onSOAPGenerated={handleSOAPGenerated}
        />

        {/* ONLY SHOW SOAP IF GENERATED */}
        {generatedSOAP ? (
          <>
            {/* Extracted Vitals - Clean grid with color coding */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Extracted Vitals</h3>
              <div className="grid grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                  <div className="text-xs text-muted-foreground mb-1">Temperature</div>
                  <div className="text-xl font-bold text-foreground tabular-nums">
                    {generatedSOAP.vitals?.temperature || '--'}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20">
                  <div className="text-xs text-muted-foreground mb-1">Heart Rate</div>
                  <div className="text-xl font-bold text-foreground tabular-nums">
                    {generatedSOAP.vitals?.heartRate || '--'}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-900/20">
                  <div className="text-xs text-muted-foreground mb-1">Resp. Rate</div>
                  <div className="text-xl font-bold text-foreground tabular-nums">
                    {generatedSOAP.vitals?.respiratoryRate || '--'}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-900/20">
                  <div className="text-xs text-muted-foreground mb-1">Weight</div>
                  <div className="text-xl font-bold text-foreground tabular-nums">
                    {generatedSOAP.vitals?.weight || '--'}
                  </div>
                </div>
              </div>
            </div>

            {/* SOAP Note Sections - Clean with colored left border */}
            <div className="space-y-3">
              {/* Subjective */}
              <div className="bg-white dark:bg-[#1a1a1a] border border-border rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-blue-50 dark:bg-blue-950/30 border-l-4 border-primary">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-primary">[S] SUBJECTIVE</h3>
                    <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                      <Edit className="w-3 h-3" />
                      Edit
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-foreground leading-relaxed text-pretty">
                    {generatedSOAP.subjective}
                  </p>
                </div>
              </div>

              {/* Objective */}
              <div className="bg-white dark:bg-[#1a1a1a] border border-border rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-green-50 dark:bg-green-950/30 border-l-4 border-green-600">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-green-600">[O] OBJECTIVE</h3>
                    <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
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
              <div className="bg-white dark:bg-[#1a1a1a] border border-border rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-600">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-amber-600">[A] ASSESSMENT</h3>
                    <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                      <Edit className="w-3 h-3" />
                      Edit
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-foreground leading-relaxed text-pretty">
                    {generatedSOAP.assessment}
                  </p>
                </div>
              </div>

              {/* Plan */}
              <div className="bg-white dark:bg-[#1a1a1a] border border-border rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-purple-50 dark:bg-purple-950/30 border-l-4 border-[#8b5cf6]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-[#8b5cf6]">[P] PLAN</h3>
                    <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                      <Edit className="w-3 h-3" />
                      Edit
                    </button>
                  </div>
                </div>
                <div className="p-4 space-y-3 text-sm text-foreground">
                  <p className="whitespace-pre-wrap">{generatedSOAP.plan}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <button className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors">
                Approve & Save
              </button>
              <button className="px-6 py-2.5 rounded-lg border border-border hover:bg-gray-50 dark:hover:bg-[#1a1a1a] text-foreground font-medium transition-colors">
                Edit Note
              </button>
            </div>
          </>
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
      </div>
    </div>
  )

  const renderMedicationView = () => (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Carprofen 75mg</h1>
          <div className="flex gap-2 mt-2">
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-medium">Active</span>
            <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-muted-foreground text-xs font-medium">
              4 days remaining
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#fafafa] dark:bg-[#1a1a1a] border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3">Prescription Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground mb-1">Medication</div>
              <div className="font-semibold text-foreground">Carprofen (NSAID)</div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Dose</div>
              <div className="font-semibold text-foreground">75mg</div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Frequency</div>
              <div className="font-semibold text-foreground">BID (twice daily)</div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Duration</div>
              <div className="font-semibold text-foreground">7 days</div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Prescribed</div>
              <div className="text-foreground">Dec 13, 2024</div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Prescriber</div>
              <div className="text-foreground">Dr. Sarah Chen, DVM</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (selectedItem === "current-recording" || activeSection === "recording") {
    return renderRecordingView()
  }

  if (activeSection === "medications") {
    return renderMedicationView()
  }

  return renderRecordingView()
}
