"use client"

import { useState } from "react"
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
} from "lucide-react"

const patients = [
  {
    id: "luna",
    name: "Luna",
    species: "Golden Retriever",
    age: "4 years",
    initial: "L",
    color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  },
  {
    id: "whiskers",
    name: "Whiskers",
    species: "Domestic Shorthair",
    age: "2 years",
    initial: "W",
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    id: "max",
    name: "Max",
    species: "Labrador",
    age: "5 years",
    initial: "M",
    color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  },
]

const navItems = [
  { id: "overview", label: "Overview", icon: Home, badge: null },
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
  selectedPatient: string
  onPatientChange: (patientId: string) => void
}

export function Sidebar({ activeSection, onSectionChange, selectedPatient, onPatientChange }: SidebarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const currentPatient = patients.find((p) => p.id === selectedPatient) || patients[0]

  return (
    <div className="flex h-full flex-col bg-[#fafafa] dark:bg-[#0f0f0f] border-r border-border">
      {/* App Title */}
      <div className="px-4 pt-4 pb-3">
        <h1 className="text-lg font-semibold text-foreground">AwwScribe</h1>
      </div>

      {/* Patient Selector - Canary Mail style */}
      <div className="px-3 pb-4">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full px-3 py-2.5 flex items-center gap-3 bg-white dark:bg-[#1a1a1a] border border-border rounded-lg hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentPatient.color}`}>
              <span className="text-sm font-semibold">{currentPatient.initial}</span>
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="text-sm font-semibold text-foreground truncate">{currentPatient.name}</div>
              <div className="text-xs text-muted-foreground truncate">{currentPatient.species}</div>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
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
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${patient.color}`}>
                    <span className="text-sm font-semibold">{patient.initial}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-semibold text-foreground">{patient.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {patient.species} • {patient.age}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Items - Clean design */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`
                w-full px-3 py-2 flex items-center gap-3 rounded-lg transition-all text-left
                ${
                  isActive
                    ? "bg-gradient-to-r from-[#f0f4ff] to-[#e8f0fe] dark:from-[#1e293b] dark:to-[#1e3a5f]"
                    : "hover:bg-gray-50 dark:hover:bg-[#1a1a1a]"
                }
              `}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              <span
                className={`flex-1 text-sm font-medium ${isActive ? "text-primary dark:text-primary" : "text-foreground"}`}
              >
                {item.label}
              </span>
              {item.badge && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                  {item.badge}
                </span>
              )}
              {isActive && <div className="w-2 h-2 rounded-full bg-primary" />}
            </button>
          )
        })}
      </div>

      {/* Settings at bottom */}
      <div className="p-3 border-t border-border">
        <button className="w-full px-3 py-2 flex items-center gap-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors text-left">
          <Settings className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-foreground">Settings</span>
        </button>
      </div>
    </div>
  )
}
