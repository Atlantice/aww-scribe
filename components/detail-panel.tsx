"use client"

import { Sparkles, Edit, Calendar } from "lucide-react"
import { useState } from "react"
import { VoiceConversation } from "./voice-conversation"

interface DetailPanelProps {
  activeSection: string
  selectedItem: string
}

export function DetailPanel({ activeSection, selectedItem }: DetailPanelProps) {
  const [liveTranscript, setLiveTranscript] = useState<string[]>([])

  const handleTranscriptUpdate = (transcript: string) => {
    setLiveTranscript((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${transcript}`])
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

        {/* Voice Conversation Component - INTEGRATED */}
        <VoiceConversation
          patientName="Luna"
          patientSpecies="Golden Retriever"
          patientAge="4 years"
          patientWeight="65 lbs"
          onTranscriptUpdate={handleTranscriptUpdate}
        />

        {/* Live Transcript */}
        {liveTranscript.length > 0 && (
          <div className="p-4 rounded-xl bg-[#fafafa] dark:bg-[#1a1a1a] border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-3">Live Transcript</h3>
            <div className="space-y-2 text-sm font-mono leading-relaxed max-h-60 overflow-y-auto">
              {liveTranscript.map((entry, index) => (
                <div key={index} className="text-foreground">
                  {entry}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Extracted Vitals - Clean grid with color coding */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Extracted Vitals</h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20">
              <div className="text-xs text-muted-foreground mb-1">Temperature</div>
              <div className="text-xl font-bold text-foreground tabular-nums">101.8°F</div>
              <div className="text-xs text-muted-foreground mt-1">↑ (101.5°F)</div>
            </div>
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20">
              <div className="text-xs text-muted-foreground mb-1">Heart Rate</div>
              <div className="text-xl font-bold text-foreground tabular-nums">92 bpm</div>
              <div className="text-xs text-muted-foreground mt-1">↑ (88 bpm)</div>
            </div>
            <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-900/20">
              <div className="text-xs text-muted-foreground mb-1">Resp. Rate</div>
              <div className="text-xl font-bold text-foreground tabular-nums">24/min</div>
              <div className="text-xs text-muted-foreground mt-1">→ (24/min)</div>
            </div>
            <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-900/20">
              <div className="text-xs text-muted-foreground mb-1">Weight</div>
              <div className="text-xl font-bold text-foreground tabular-nums">65 lbs</div>
              <div className="text-xs text-muted-foreground mt-1">→ (65 lbs)</div>
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
                4-year-old Golden Retriever presenting with right front leg lameness of 3 days duration. Onset following
                play at dog park. Owner reports no visible wounds. Patient maintaining normal appetite, water intake,
                and energy levels.
              </p>
              <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-l-2 border-blue-400">
                <p className="text-xs text-blue-700 dark:text-blue-400 italic">
                  Referenced from Nov 28: No previous musculoskeletal concerns
                </p>
              </div>
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
              <p>
                <strong>Vitals:</strong> T 101.8°F, HR 92 bpm, RR 24/min, Wt 65 lbs • BCS: 5/9
              </p>
              <p>
                <strong>Physical Examination:</strong>
              </p>
              <ul className="space-y-1 pl-4">
                <li>• Alert and responsive</li>
                <li>• Right front leg: Mild swelling at carpal joint, warm to touch, pain on flexion</li>
                <li>• No crepitus or joint instability detected</li>
              </ul>
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
                Soft tissue injury (suspected sprain) of right front carpus, likely secondary to overexertion/trauma
                during play activity.
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
              <div>
                <p>1. Radiographs of right carpus to rule out fracture</p>
                <div className="flex items-center gap-2 mt-1">
                  <Sparkles className="w-3 h-3 text-[#8b5cf6]" />
                  <span className="text-xs text-[#8b5cf6]">Lab order auto-created</span>
                </div>
              </div>
              <div>
                <p>2. Carprofen 75mg PO BID × 7 days with food</p>
                <div className="mt-1 px-3 py-1.5 bg-green-100 dark:bg-green-900/20 rounded-lg inline-block">
                  <span className="text-xs text-green-600">✓ No interactions • Prescription ready</span>
                </div>
              </div>
              <p>3. Activity restriction for 7-10 days (leash walks only)</p>
              <p>4. Cold compress therapy: 10 minutes TID × 48 hours</p>
              <div>
                <p>5. Recheck examination in 7-10 days if not improved</p>
                <div className="flex items-center gap-2 mt-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-xs text-primary font-medium">Follow-up: Dec 31, 2024 at 2:00 PM</span>
                  <button className="ml-auto px-3 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Summary */}
        <div className="p-4 rounded-xl bg-[#fafafa] dark:bg-[#1a1a1a] border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3">Billing Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-foreground">
              <span>Office Visit (Established)</span>
              <span className="font-semibold tabular-nums">$85</span>
            </div>
            <div className="flex justify-between text-foreground">
              <span>Radiograph, 2 views</span>
              <span className="font-semibold tabular-nums">$120</span>
            </div>
            <div className="flex justify-between text-foreground">
              <span>Carprofen 7-day supply</span>
              <span className="font-semibold tabular-nums">$28</span>
            </div>
            <div className="h-px bg-border my-3" />
            <div className="flex justify-between text-lg font-bold text-foreground">
              <span>Estimated Total:</span>
              <span className="tabular-nums">$233</span>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-gray-50 dark:hover:bg-[#1a1a1a] text-sm font-medium text-foreground transition-colors">
                Edit Codes
              </button>
              <button className="flex-1 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-colors">
                Send to Billing
              </button>
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
