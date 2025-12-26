"use client"

import { useState } from "react"
import { Plus, Search, Mic } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { usePatientAppointments } from "@/hooks/use-firestore"

interface ScribesListProps {
  onNewScribe: () => void
  onSelectScribe: (scribeId: string) => void
  selectedScribeId: string | null
  selectedPatientId: string | null
}

export function ScribesList({ onNewScribe, onSelectScribe, selectedScribeId, selectedPatientId }: ScribesListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { appointments, loading } = usePatientAppointments(selectedPatientId, 50)

  // Filter appointments that have SOAP notes (completed scribes)
  const scribes = appointments.filter(apt => apt.soap)

  const filteredScribes = scribes.filter(scribe =>
    scribe.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scribe.chiefComplaint?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scribe.soap?.subjective?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#0a0a0a] border-r border-border">
      {/* Header with New Scribe Button */}
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg text-foreground">Scribes</h2>
          <button
            onClick={onNewScribe}
            className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 flex items-center gap-2 text-sm font-medium shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            New Scribe
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search your chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-gray-900 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
          />
        </div>
      </div>

      {/* Scribes List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {loading && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Loading scribes...
            </div>
          )}

          {!loading && filteredScribes.map((appointment) => {
            const preview = appointment.chiefComplaint || appointment.soap?.subjective?.substring(0, 100) || "No preview available"

            return (
              <button
                key={appointment.id}
                onClick={() => onSelectScribe(appointment.id)}
                className={`
                  w-full text-left p-3 rounded-lg transition-all duration-200 group
                  ${
                    selectedScribeId === appointment.id
                      ? "bg-gray-100 dark:bg-gray-800"
                      : "hover:bg-gray-50 dark:hover:bg-gray-900"
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  {/* Icon indicator - always show Mic since these are all ambient recordings */}
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-purple-100 dark:bg-purple-900/30">
                    <Mic className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Title */}
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-foreground truncate">
                        {appointment.type}
                        {appointment.chiefComplaint && ` - ${appointment.chiefComplaint}`}
                      </span>
                      <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                        {formatDistanceToNow(appointment.date, { addSuffix: true })}
                      </span>
                    </div>

                    {/* Preview */}
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                      {preview}
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                        Ambient
                      </span>
                      {appointment.veterinarianName && (
                        <span>{appointment.veterinarianName}</span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            )
          })}

          {!loading && filteredScribes.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              {searchQuery ? "No scribes found" : "No scribes yet. Start an ambient recording to create your first one!"}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
