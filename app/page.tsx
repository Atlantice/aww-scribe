"use client"

import { useState } from "react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Sidebar } from "@/components/sidebar"
import { VisitList } from "@/components/visit-list"
import { DetailPanel } from "@/components/detail-panel"
import { ScribesList } from "@/components/scribes-list"
import { ScribeEditor } from "@/components/scribe-editor"

export default function AwwScribe() {
  const [activeSection, setActiveSection] = useState("overview")
  const [selectedItem, setSelectedItem] = useState("current-recording")
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedScribeId, setSelectedScribeId] = useState<string | null>(null)
  const [isNewScribe, setIsNewScribe] = useState(false)

  // Hide middle panel on Overview section
  const showMiddlePanel = activeSection !== "overview" && activeSection !== "scribes"

  // Determine which middle panel to show
  const renderMiddlePanel = () => {
    if (activeSection === "scribes") {
      return (
        <ScribesList
          onNewScribe={() => {
            setIsNewScribe(true)
            setSelectedScribeId(null)
          }}
          onSelectScribe={(scribeId) => {
            setSelectedScribeId(scribeId)
            setSelectedItem(scribeId)
            setIsNewScribe(false)
          }}
          selectedScribeId={selectedScribeId}
          selectedPatientId={selectedPatient}
        />
      )
    }
    return (
      <VisitList
        activeSection={activeSection}
        selectedItem={selectedItem}
        onItemSelect={setSelectedItem}
        selectedPatientId={selectedPatient}
      />
    )
  }

  // Determine which detail panel to show
  const renderDetailPanel = () => {
    // When in scribes section and creating new scribe, show editor
    if (activeSection === "scribes" && isNewScribe) {
      return (
        <ScribeEditor
          onClose={() => {
            setIsNewScribe(false)
          }}
          patientId={selectedPatient}
        />
      )
    }

    // When in scribes section and a scribe is selected, show it in DetailPanel
    if (activeSection === "scribes" && selectedScribeId) {
      return (
        <DetailPanel
          activeSection="recording"
          selectedItem={selectedScribeId}
          patientId={selectedPatient}
          onSectionChange={setActiveSection}
        />
      )
    }

    return (
      <DetailPanel
        activeSection={activeSection}
        selectedItem={selectedItem}
        patientId={selectedPatient}
        onSectionChange={setActiveSection}
      />
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ResizablePanelGroup direction="horizontal">
        {/* Left Sidebar - Responsive to collapse state */}
        {!sidebarCollapsed ? (
          <>
            <ResizablePanel
              defaultSize={16}
              minSize={14}
              maxSize={20}
            >
              <Sidebar
                activeSection={activeSection}
                onSectionChange={setActiveSection}
                selectedPatient={selectedPatient}
                onPatientChange={setSelectedPatient}
                onCollapseChange={setSidebarCollapsed}
                isCollapsed={sidebarCollapsed}
              />
            </ResizablePanel>
            <ResizableHandle className="w-px bg-border" />
          </>
        ) : (
          <div className="w-16 flex-shrink-0">
            <Sidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              selectedPatient={selectedPatient}
              onPatientChange={setSelectedPatient}
              onCollapseChange={setSidebarCollapsed}
              isCollapsed={sidebarCollapsed}
            />
          </div>
        )}

        {/* Middle Column - Shows Scribes list or Visit list */}
        {(showMiddlePanel || activeSection === "scribes") && (
          <>
            <ResizablePanel defaultSize={24} minSize={20} maxSize={30}>
              {renderMiddlePanel()}
            </ResizablePanel>

            <ResizableHandle className="w-px bg-border" />
          </>
        )}

        {/* Right Panel - Shows Scribe Editor or Detail Panel */}
        <ResizablePanel
          defaultSize={
            activeSection === "overview" ? 84 :
            activeSection === "scribes" ? 60 :
            showMiddlePanel ? 60 : 84
          }
          minSize={45}
        >
          {renderDetailPanel()}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
