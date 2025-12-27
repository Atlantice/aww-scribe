"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { LiveScribe } from "./live-scribe"

interface ScribeEditorProps {
  onClose: () => void
  patientId: string | null
}

export function ScribeEditor({ onClose, patientId }: ScribeEditorProps) {
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

      {/* Main Content - Uses existing LiveScribe component */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          <LiveScribe
            patientId={patientId || ""}
            patientName="Luna"
            patientBreed="Golden Retriever"
            patientAge="4 years"
            patientWeight="65 lbs"
            onSOAPGenerated={(soap) => {
              console.log("SOAP generated:", soap)
              // Could auto-close here if desired
              // onClose()
            }}
          />
        </div>
      </div>
    </div>
  )
}
