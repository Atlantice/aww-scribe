"use client"

import { LiveScribe } from "@/components/live-scribe"

export default function AwwScribe() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <LiveScribe
        patientId="demo-patient-luna-001"
        patientName="Luna"
        patientBreed="Golden Retriever"
        patientAge="4 years"
        patientWeight="65 lbs"
      />
    </div>
  )
}
