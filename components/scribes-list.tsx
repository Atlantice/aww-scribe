"use client"

import { useState } from "react"
import { Plus, Search, Mic, Edit3, Clock, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Scribe {
  id: string
  title: string
  date: Date
  preview: string
  type: "ambient" | "manual"
  patientName?: string
}

interface ScribesListProps {
  onNewScribe: () => void
  onSelectScribe: (scribeId: string) => void
  selectedScribeId: string | null
}

export function ScribesList({ onNewScribe, onSelectScribe, selectedScribeId }: ScribesListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data - would come from Firestore in production
  const scribes: Scribe[] = [
    {
      id: "1",
      title: "Luna - Sick Visit",
      date: new Date(2025, 11, 26, 14, 30),
      preview: "Chief complaint: Vomiting and lethargy. Temperature 102.5°F...",
      type: "ambient",
      patientName: "Luna"
    },
    {
      id: "2",
      title: "Max - Wellness Exam",
      date: new Date(2025, 11, 26, 10, 15),
      preview: "Annual wellness examination. All vitals within normal limits...",
      type: "ambient",
      patientName: "Max"
    },
    {
      id: "3",
      title: "Bella - Follow-up",
      date: new Date(2025, 11, 25, 16, 45),
      preview: "Follow-up visit for ear infection. Significant improvement noted...",
      type: "manual",
      patientName: "Bella"
    },
  ]

  const filteredScribes = scribes.filter(scribe =>
    scribe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scribe.preview.toLowerCase().includes(searchQuery.toLowerCase())
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
          {filteredScribes.map((scribe) => (
            <button
              key={scribe.id}
              onClick={() => onSelectScribe(scribe.id)}
              className={`
                w-full text-left p-3 rounded-lg transition-all duration-200 group
                ${
                  selectedScribeId === scribe.id
                    ? "bg-gray-100 dark:bg-gray-800"
                    : "hover:bg-gray-50 dark:hover:bg-gray-900"
                }
              `}
            >
              <div className="flex items-start gap-3">
                {/* Icon indicator */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  scribe.type === "ambient"
                    ? "bg-purple-100 dark:bg-purple-900/30"
                    : "bg-blue-100 dark:bg-blue-900/30"
                }`}>
                  {scribe.type === "ambient" ? (
                    <Mic className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  ) : (
                    <Edit3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-foreground truncate">
                      {scribe.title}
                    </span>
                    <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                      {formatDistanceToNow(scribe.date, { addSuffix: true })}
                    </span>
                  </div>

                  {/* Preview */}
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                    {scribe.preview}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800">
                      {scribe.type === "ambient" ? "Ambient" : "Manual"}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}

          {filteredScribes.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              {searchQuery ? "No scribes found" : "No scribes yet. Create your first one!"}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
