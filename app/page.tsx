"use client"

import { useState } from "react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Sidebar } from "@/components/sidebar"
import { VisitList } from "@/components/visit-list"
import { DetailPanel } from "@/components/detail-panel"

export default function AwwScribe() {
  const [activeSection, setActiveSection] = useState("recording")
  const [selectedItem, setSelectedItem] = useState("current-recording")
  const [selectedPatient, setSelectedPatient] = useState("luna")

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

        {/* Middle Column - 340px approx */}
        <ResizablePanel defaultSize={24} minSize={20} maxSize={30}>
          <VisitList activeSection={activeSection} selectedItem={selectedItem} onItemSelect={setSelectedItem} />
        </ResizablePanel>

        <ResizableHandle className="w-px bg-border" />

        {/* Right Panel - Remaining width */}
        <ResizablePanel defaultSize={60} minSize={45}>
          <DetailPanel activeSection={activeSection} selectedItem={selectedItem} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
