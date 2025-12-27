"use client"

import { Search, Sparkles } from "lucide-react"
import { usePatientAppointments, usePatientMedications } from "@/hooks/use-firestore"
import { format, formatDistanceToNow } from "date-fns"

interface VisitListProps {
  activeSection: string
  selectedItem: string
  onItemSelect: (itemId: string) => void
  selectedPatientId: string | null
}

export function VisitList({ activeSection, selectedItem, onItemSelect, selectedPatientId }: VisitListProps) {
  const { appointments, loading: appointmentsLoading } = usePatientAppointments(selectedPatientId, 10)
  const { medications, loading: medicationsLoading } = usePatientMedications(selectedPatientId)

  console.log('🟢 VisitList state:', {
    selectedPatientId,
    appointmentsCount: appointments.length,
    appointmentsLoading,
    appointments: appointments.map(a => ({ id: a.id, date: a.date, type: a.type }))
  })
  const renderRecordingList = () => (
    <div className="flex-1 overflow-y-auto">
      <div className="p-3 space-y-2">
        {/* Active Recording Card */}
        <button
          onClick={() => onItemSelect("current-recording")}
          className={`
            w-full text-left p-3 rounded-lg transition-all duration-200 group
            ${
              selectedItem === "current-recording"
                ? "bg-gray-100 dark:bg-gray-800"
                : "hover:bg-gray-50 dark:hover:bg-gray-900"
            }
          `}
        >
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 animate-recording-pulse" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-foreground">Dec 24, 2024</span>
                <span className="text-xs text-muted-foreground">Recording</span>
              </div>
              <div className="text-sm text-muted-foreground mb-1 font-mono tabular-nums">12:34</div>
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className="px-2 py-0.5 text-xs rounded-full bg-[#8b5cf6] text-white">meeting</span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                  sick
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-gradient-to-r from-[#f9f5ff] to-[#f5f3ff] dark:from-[#2e1065] dark:to-[#1e1538] rounded-lg">
                <Sparkles className="w-4 h-4 text-[#8b5cf6] animate-pulse" />
                <span className="text-xs text-[#8b5cf6] font-medium">AI processing...</span>
              </div>
            </div>
          </div>
        </button>

        {/* Section Header */}
        <div className="pt-2 pb-1">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground px-1">Recent Visits</h3>
        </div>

        {/* Loading state */}
        {appointmentsLoading && (
          <div className="p-3 text-sm text-muted-foreground text-center">Loading appointments...</div>
        )}

        {/* Past Visits - FROM FIRESTORE */}
        {!appointmentsLoading && appointments.map((appointment) => (
          <button
            key={appointment.id}
            onClick={() => onItemSelect(appointment.id)}
            className={`
              w-full text-left p-3 rounded-lg transition-all duration-200 group
              ${
                selectedItem === appointment.id
                  ? "bg-gray-100 dark:bg-gray-800"
                  : "hover:bg-gray-50 dark:hover:bg-gray-900"
              }
            `}
          >
            <div className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-1.5 ${
                appointment.status === 'Completed'
                  ? 'bg-gray-300 dark:bg-gray-600'
                  : 'bg-purple-500 dark:bg-purple-400'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-foreground">
                    {format(appointment.date, 'MMM dd, yyyy')}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(appointment.date, { addSuffix: true })}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mb-1">
                  {appointment.type}{appointment.chiefComplaint && ` - ${appointment.chiefComplaint}`}
                </div>
                <div className="text-xs text-muted-foreground">{appointment.veterinarianName}</div>
              </div>
            </div>
          </button>
        ))}

        {/* Empty state */}
        {!appointmentsLoading && appointments.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No appointments yet. Start a recording to create the first one!
          </div>
        )}
      </div>
    </div>
  )

  const renderMedicationList = () => (
    <div className="flex-1 overflow-y-auto">
      <div className="p-3 space-y-2">
        <div className="pb-1">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground px-1">
            Active Medications
          </h3>
        </div>

        {/* Loading state */}
        {medicationsLoading && (
          <div className="p-3 text-sm text-muted-foreground text-center">Loading medications...</div>
        )}

        {/* Medications - FROM FIRESTORE */}
        {!medicationsLoading && medications.map((med) => (
          <button
            key={med.id}
            onClick={() => onItemSelect(med.id)}
            className={`
              w-full text-left p-3 rounded-lg transition-all duration-200
              ${
                selectedItem === med.id
                  ? "bg-gray-100 dark:bg-gray-800"
                  : "hover:bg-gray-50 dark:hover:bg-gray-900"
              }
            `}
          >
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-500 mt-2" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-foreground mb-1">{med.name}</div>
                <div className="text-sm text-muted-foreground mb-1">
                  {med.dosage} {med.route && `(${med.route})`} - {med.frequency}
                </div>
                {med.instructions && (
                  <div className="text-xs text-muted-foreground mb-2">{med.instructions}</div>
                )}
                <div className="text-xs text-muted-foreground mt-2">
                  {format(med.startDate, 'MMM dd, yyyy')}
                </div>
              </div>
            </div>
          </button>
        ))}

        {/* Empty state */}
        {!medicationsLoading && medications.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No active medications
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#0a0a0a] border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border space-y-3">
        <h2 className="font-semibold text-lg text-foreground capitalize">{activeSection}</h2>
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-900 rounded-lg">
          <button className="flex-1 px-3 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-gray-800 shadow-sm text-foreground transition-all duration-200">
            All
          </button>
          <button className="flex-1 px-3 py-1.5 text-xs font-medium rounded-md text-muted-foreground hover:text-foreground transition-all duration-200">
            {activeSection === "recording" ? "In Progress" : "Active"}
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder={`Search ${activeSection}...`}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-gray-900 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
          />
        </div>
      </div>

      {/* List Content */}
      {activeSection === "recording" && renderRecordingList()}
      {activeSection === "medications" && renderMedicationList()}
      {activeSection === "history" && renderRecordingList()}
    </div>
  )
}
