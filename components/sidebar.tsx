"use client"

import { useState, useEffect } from "react"
import {
  Home,
  Mic,
  FileText,
  Pill,
  FlaskConical,
  Syringe,
  FolderOpen,
  CreditCard,
  Settings,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  MessageSquare,
} from "lucide-react"
import { usePatients } from "@/hooks/use-firestore"

const navItems = [
  { id: "overview", label: "Overview", icon: Home, badge: null },
  { id: "scribes", label: "Scribes", icon: MessageSquare, badge: null },
  { id: "recording", label: "Recording", icon: Mic, badge: null },
  { id: "history", label: "Medical History", icon: FileText, badge: null },
  { id: "medications", label: "Medications", icon: Pill, badge: 2 },
  { id: "labs", label: "Lab Results", icon: FlaskConical, badge: 1 },
  { id: "vaccinations", label: "Vaccinations", icon: Syringe, badge: null },
  { id: "documents", label: "Documents", icon: FolderOpen, badge: 12 },
  { id: "billing", label: "Billing", icon: CreditCard, badge: null },
]

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  selectedPatient: string | null
  onPatientChange: (patientId: string) => void
  onCollapseChange?: (collapsed: boolean) => void
  isCollapsed?: boolean
}

export function Sidebar({ activeSection, onSectionChange, selectedPatient, onPatientChange, onCollapseChange, isCollapsed = false }: SidebarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { patients, loading, error } = usePatients()

  // Notify parent of collapse state changes
  const handleCollapseToggle = () => {
    onCollapseChange?.(!isCollapsed)
  }

  // Auto-select first patient when loaded (using useEffect to avoid state update during render)
  useEffect(() => {
    if (!loading && !error && patients.length > 0 && !selectedPatient) {
      console.log('🔵 Auto-selecting patient:', patients[0].id, patients[0].name)
      onPatientChange(patients[0].id)
    } else {
      console.log('🔵 Patient selection state:', { loading, error: !!error, patientsCount: patients.length, selectedPatient })
    }
  }, [loading, error, patients, selectedPatient, onPatientChange])

  if (loading) {
    return (
      <div className="flex h-full flex-col bg-[#fafafa] dark:bg-[#0f0f0f] border-r border-border">
        <div className="px-4 pt-4 pb-3">
          <h1 className="text-lg font-semibold text-foreground">AwwScribe</h1>
        </div>
        <div className="px-3 pb-4">
          <div className="w-full h-16 bg-gray-100 dark:bg-[#1a1a1a] rounded-lg animate-pulse" />
        </div>
      </div>
    )
  }

  if (error || patients.length === 0) {
    return (
      <div className="flex h-full flex-col bg-[#fafafa] dark:bg-[#0f0f0f] border-r border-border">
        <div className="px-4 pt-4 pb-3">
          <h1 className="text-lg font-semibold text-foreground">AwwScribe</h1>
        </div>
        <div className="px-3 pb-4">
          <div className="p-3 text-sm text-muted-foreground text-center">
            {error ? 'Error loading patients' : 'No patients found'}
          </div>
        </div>
      </div>
    )
  }

  const currentPatient = patients.find((p) => p.id === selectedPatient) || patients[0]

  return (
    <div className={`flex h-full flex-col bg-[#fafafa] dark:bg-[#0f0f0f] ${!isCollapsed ? 'border-r border-border' : ''}`}>
      {/* App Title with Toggle */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        {!isCollapsed && <h1 className="text-lg font-semibold text-foreground">AwwScribe</h1>}
        <button
          onClick={handleCollapseToggle}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronsRight className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronsLeft className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Patient Selector - Claude-inspired style */}
      {!isCollapsed && (
        <div className="px-3 pb-4">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full px-3 py-2.5 flex items-center gap-3 bg-white dark:bg-gray-900 border border-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentPatient.avatarColor || 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                <span className="text-sm font-semibold">{currentPatient.initial}</span>
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="text-sm font-semibold text-foreground truncate">{currentPatient.name}</div>
                <div className="text-xs text-muted-foreground truncate">{currentPatient.species}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground flex-shrink-0 transition-colors duration-200" />
            </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#1a1a1a] border border-border rounded-lg shadow-lg overflow-hidden z-50">
              {patients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => {
                    onPatientChange(patient.id)
                    setDropdownOpen(false)
                  }}
                  className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${patient.avatarColor || 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400'}`}>
                    <span className="text-sm font-semibold">{patient.initial}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-semibold text-foreground">{patient.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {patient.breed || patient.species} {patient.age && `• ${patient.age}`}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
          </div>
        </div>
      )}

      {/* Collapsed Patient Avatar */}
      {isCollapsed && (
        <div className="px-2 pb-4">
          <button
            onClick={handleCollapseToggle}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 mx-auto hover:scale-110 transition-transform duration-200"
            title={currentPatient.name}
          >
            <span className="text-sm font-semibold">{currentPatient.initial}</span>
          </button>
        </div>
      )}

      {/* Navigation Items - Claude-inspired design */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`
                w-full ${isCollapsed ? 'px-0 justify-center' : 'px-3'} py-2 flex items-center gap-3 rounded-lg text-left
                transition-all duration-200
                ${
                  isActive
                    ? "bg-gray-100 dark:bg-gray-800 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-gray-50 dark:hover:bg-gray-900"
                }
              `}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-foreground" : ""} ${isCollapsed ? 'mx-auto' : ''}`} />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-sm font-medium">
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="ml-auto w-5 h-5 flex items-center justify-center bg-purple-600 text-white text-xs rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {isCollapsed && item.badge && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-purple-600 rounded-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* Settings at bottom */}
      <div className="p-3 border-t border-border">
        <button
          className={`w-full ${isCollapsed ? 'px-0 justify-center' : 'px-3'} py-2 flex items-center gap-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-200 text-left`}
          title={isCollapsed ? "Settings" : undefined}
        >
          <Settings className={`w-4 h-4 ${isCollapsed ? 'mx-auto' : ''}`} />
          {!isCollapsed && <span className="text-sm">Settings</span>}
        </button>
      </div>
    </div>
  )
}
