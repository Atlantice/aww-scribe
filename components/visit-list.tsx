"use client"

import { Search, Sparkles } from "lucide-react"

interface VisitListProps {
  activeSection: string
  selectedItem: string
  onItemSelect: (itemId: string) => void
}

const visits = [
  {
    id: "recent-1",
    date: "Dec 13, 2024",
    type: "Sick Visit - Limping",
    doctor: "Dr. Sarah Chen",
    tags: [
      { label: "limping", color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300" },
      { label: "resolved", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
    ],
    timeAgo: "2 weeks ago",
  },
  {
    id: "recent-2",
    date: "Nov 28, 2024",
    type: "Wellness Exam",
    doctor: "Dr. Sarah Chen",
    tags: [
      { label: "wellness", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
      { label: "normal", color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300" },
    ],
    timeAgo: "about a month ago",
  },
  {
    id: "recent-3",
    date: "Aug 15, 2024",
    type: "Sick Visit - Ear Infection",
    doctor: "Dr. Michael Torres",
    tags: [
      { label: "ear", color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300" },
      { label: "infection", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
    ],
    timeAgo: "4 months ago",
  },
]

const medications = [
  {
    id: "med-1",
    name: "Carprofen 75mg",
    dosage: "Twice daily with food",
    remaining: "4 days remaining",
    tags: [
      { label: "pain", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
      { label: "inflammation", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
    ],
    date: "Dec 13, 2024",
  },
  {
    id: "med-2",
    name: "Apoquel 16mg",
    dosage: "Daily (ongoing)",
    tags: [{ label: "allergies", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" }],
    date: "Started: May 2024",
  },
]

export function VisitList({ activeSection, selectedItem, onItemSelect }: VisitListProps) {
  const renderRecordingList = () => (
    <div className="flex-1 overflow-y-auto">
      <div className="p-3 space-y-2">
        {/* Active Recording Card */}
        <button
          onClick={() => onItemSelect("current-recording")}
          className={`
            w-full text-left p-3 rounded-xl transition-all group
            ${
              selectedItem === "current-recording"
                ? "bg-[#f9f7ff] dark:bg-[#2e1065] shadow-sm"
                : "hover:bg-purple-50/50 dark:hover:bg-[#1e1538]"
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

        {/* Past Visits */}
        {visits.map((visit) => (
          <button
            key={visit.id}
            onClick={() => onItemSelect(visit.id)}
            className={`
              w-full text-left p-3 rounded-xl transition-all group
              ${
                selectedItem === visit.id
                  ? "bg-[#f9f7ff] dark:bg-[#2e1065] shadow-sm"
                  : "hover:bg-purple-50/50 dark:hover:bg-[#1e1538]"
              }
            `}
          >
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 mt-1.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-foreground">{visit.date}</span>
                  <span className="text-xs text-muted-foreground">{visit.timeAgo}</span>
                </div>
                <div className="text-sm text-muted-foreground mb-1">{visit.type}</div>
                <div className="text-xs text-muted-foreground">{visit.doctor}</div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {visit.tags.map((tag) => (
                    <span key={tag.label} className={`px-2 py-0.5 text-xs rounded-full ${tag.color}`}>
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </button>
        ))}
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
        {medications.map((med) => (
          <button
            key={med.id}
            onClick={() => onItemSelect(med.id)}
            className={`
              w-full text-left p-3 rounded-xl transition-all
              ${
                selectedItem === med.id
                  ? "bg-[#f9f7ff] dark:bg-[#2e1065] shadow-sm"
                  : "hover:bg-purple-50/50 dark:hover:bg-[#1e1538]"
              }
            `}
          >
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-500 mt-2" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-foreground mb-1">{med.name}</div>
                <div className="text-sm text-muted-foreground mb-1">{med.dosage}</div>
                {med.remaining && <div className="text-sm text-muted-foreground mb-2">{med.remaining}</div>}
                <div className="flex gap-2 flex-wrap">
                  {med.tags.map((tag) => (
                    <span key={tag.label} className={`px-2 py-0.5 text-xs rounded-full ${tag.color}`}>
                      {tag.label}
                    </span>
                  ))}
                </div>
                {med.date && <div className="text-xs text-muted-foreground mt-2">{med.date}</div>}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#0a0a0a] border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border space-y-3">
        <h2 className="font-semibold text-lg text-foreground capitalize">{activeSection}</h2>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium transition-colors">
            All
          </button>
          <button className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-muted-foreground text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            {activeSection === "recording" ? "In Progress" : "Active"}
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={`Search ${activeSection}...`}
            className="w-full pl-9 pr-3 py-2 text-sm bg-[#fafafa] dark:bg-[#1a1a1a] border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
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
