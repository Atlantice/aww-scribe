"use client"

import { useState } from "react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Sidebar } from "@/components/sidebar"
import { VisitList } from "@/components/visit-list"
import { DetailPanel } from "@/components/detail-panel"

export default function AwwScribe() {
  const [activeSection, setActiveSection] = useState("overview")
  const [selectedItem, setSelectedItem] = useState("current-recording")
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)

  // Hide middle panel on Overview section
  const showMiddlePanel = activeSection !== "overview"

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ResizablePanelGroup direction="horizontal">
        {/* Left Sidebar - 240px fixed */}
        <ResizablePanel defaultSize={16} minSize={14} maxSize={20}>
          <Sidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            selectedPatient={selectedPatient}
            onPatientChange={setSelectedPatient}
          />
        </ResizablePanel>

        <ResizableHandle className="w-px bg-border" />

        {/* Middle Column - 340px approx (hidden on Overview) */}
        {showMiddlePanel && (
          <>
            <ResizablePanel defaultSize={24} minSize={20} maxSize={30}>
              <VisitList
                activeSection={activeSection}
                selectedItem={selectedItem}
                onItemSelect={setSelectedItem}
                selectedPatientId={selectedPatient}
              />
            </ResizablePanel>

            <ResizableHandle className="w-px bg-border" />
          </>
        )}

        {/* Right Panel - Remaining width (full width on Overview) */}
        <ResizablePanel defaultSize={showMiddlePanel ? 60 : 84} minSize={45}>
          <DetailPanel
            activeSection={activeSection}
            selectedItem={selectedItem}
            patientId={selectedPatient}
            onSectionChange={setActiveSection}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
