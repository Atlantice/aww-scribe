"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  Mic,
  Pill,
  FlaskConical,
  Calendar,
  FileText,
  MessageCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  AlertCircle,
  DollarSign,
  Clock,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

interface OverviewDashboardProps {
  patientName: string
  patientBreed: string
  patientAge: string
  patientId: string | null
  onStartRecording?: () => void
  onNavigateToSection?: (section: string) => void
}

export function OverviewDashboard({
  patientName,
  patientBreed,
  patientAge,
  patientId,
  onStartRecording,
  onNavigateToSection,
}: OverviewDashboardProps) {
  const [chatInput, setChatInput] = useState("")
  const [isQuickActionsExpanded, setIsQuickActionsExpanded] = useState(true)

  // Mock data - would come from Firestore in production
  const latestVitals = {
    temperature: { value: "101.8°F", trend: "up", normal: "101.5°F" },
    heartRate: { value: "92 bpm", trend: "up", normal: "70-120" },
    respRate: { value: "24/min", trend: "normal", normal: "15-30" },
    weight: { value: "65 lbs", trend: "normal", normal: "60-75" },
    date: "Dec 26, 2025",
  }

  const activeMedications = [
    { name: "Carprofen 75mg", frequency: "BID", remaining: "4 days remaining" },
    { name: "Heartgard Plus", frequency: "Monthly", remaining: "Due in 12 days" },
  ]

  const upcomingAppointments = [
    { date: "Dec 31, 2025", type: "Follow-up", vet: "Dr. Sarah Chen", confirmed: true },
    { date: "Jan 15, 2026", type: "Wellness Exam", vet: "Dr. Sarah Chen", confirmed: false },
  ]

  const outstandingItems = [
    { type: "lab", text: "Lab results pending (CBC from Dec 24)", urgent: true },
    { type: "billing", text: "Invoice #1234 - $233.00 (Dec 26)", urgent: false },
  ]

  const recentActivity = [
    { date: "Dec 26, 2025", type: "soap", title: "SOAP note created", detail: "Sick Visit - Leg lameness" },
    { date: "Dec 26, 2025", type: "medication", title: "Medication prescribed", detail: "Carprofen 75mg BID × 7 days" },
    { date: "Dec 24, 2025", type: "lab", title: "Lab ordered", detail: "CBC, Chemistry panel" },
  ]

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="w-3 h-3 text-red-500" />
    if (trend === "down") return <TrendingDown className="w-3 h-3 text-purple-500" />
    return <Minus className="w-3 h-3 text-gray-400" />
  }

  const quickActions = [
    {
      icon: Mic,
      label: "Start Recording",
      color: "primary",
      onClick: onStartRecording,
      section: "recording"
    },
    {
      icon: Pill,
      label: "Add Medication",
      color: "green",
      section: "medications"
    },
    {
      icon: FlaskConical,
      label: "View Lab Results",
      color: "blue",
      section: "labs"
    },
    {
      icon: Calendar,
      label: "Schedule Appointment",
      color: "purple",
      onClick: () => {
        // Would open scheduling modal
        console.log("Schedule appointment")
      }
    },
    {
      icon: FileText,
      label: "Generate Report",
      color: "amber",
      section: "documents"
    },
    {
      icon: MessageCircle,
      label: `Ask About ${patientName}`,
      color: "pink",
      onClick: () => {
        // Would activate chat
        console.log("Ask about patient")
      }
    },
  ]

  const handleQuickAction = (action: typeof quickActions[0]) => {
    if (action.onClick) {
      action.onClick()
    } else if (action.section && onNavigateToSection) {
      onNavigateToSection(action.section)
    }
  }

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-950/50 dark:to-gray-900">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Header with pet greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 mb-4">
            <span className="text-3xl">🐕</span>
          </div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">Hello {patientName}</h1>
          <p className="text-muted-foreground">
            {patientBreed} • {patientAge}
          </p>
        </motion.div>

        {/* Claude-style chat input */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="p-4">
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={`How can I help ${patientName} today?`}
              className="w-full min-h-[80px] bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none resize-none text-base"
            />
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200">
                  <Plus className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Sonnet 4.5</span>
                <button className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions - Collapsible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={() => setIsQuickActionsExpanded(!isQuickActionsExpanded)}
            className="flex items-center justify-between w-full mb-3 group"
          >
            <h2 className="text-sm font-semibold text-foreground">Quick Actions</h2>
            {isQuickActionsExpanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
            )}
          </button>

          <AnimatePresence>
            {isQuickActionsExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action)}
                      className="p-4 bg-white dark:bg-gray-900 border border-border rounded-xl hover:shadow-md hover:border-primary/50 transition-all duration-200 text-left group"
                    >
                      <action.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary mb-2 transition-colors duration-200" />
                      <div className="text-sm font-medium text-foreground">{action.label}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Health Snapshot */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-900 border border-border rounded-xl p-6 space-y-6"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">Latest Vitals</h2>
              <span className="text-xs text-muted-foreground">{latestVitals.date}</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-900/10 border border-amber-200 dark:border-amber-900/40">
                <div className="text-xs font-medium text-amber-900 dark:text-amber-400 mb-1">Temp</div>
                <div className="text-lg font-bold text-foreground">{latestVitals.temperature.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(latestVitals.temperature.trend)}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-900/10 border border-red-200 dark:border-red-900/40">
                <div className="text-xs font-medium text-red-900 dark:text-red-400 mb-1">HR</div>
                <div className="text-lg font-bold text-foreground">{latestVitals.heartRate.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(latestVitals.heartRate.trend)}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-sky-50 to-sky-100/50 dark:from-sky-900/20 dark:to-sky-900/10 border border-sky-200 dark:border-sky-900/40">
                <div className="text-xs font-medium text-sky-900 dark:text-sky-400 mb-1">RR</div>
                <div className="text-lg font-bold text-foreground">{latestVitals.respRate.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(latestVitals.respRate.trend)}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100/50 dark:from-violet-900/20 dark:to-violet-900/10 border border-violet-200 dark:border-violet-900/40">
                <div className="text-xs font-medium text-violet-900 dark:text-violet-400 mb-1">Weight</div>
                <div className="text-lg font-bold text-foreground">{latestVitals.weight.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(latestVitals.weight.trend)}
                </div>
              </div>
            </div>
          </div>

          {/* Active Medications */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">
                Active Medications ({activeMedications.length})
              </h3>
              <button className="text-xs text-primary hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-2">
              {activeMedications.map((med, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">
                      {med.name} {med.frequency}
                    </div>
                    <div className="text-xs text-muted-foreground">{med.remaining}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Upcoming Appointments</h3>
              <button className="text-xs text-primary hover:underline flex items-center gap-1">
                Schedule <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-2">
              {upcomingAppointments.map((apt, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${apt.confirmed ? "bg-green-500" : "bg-purple-500"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">
                      {apt.date} - {apt.type}
                    </div>
                    <div className="text-xs text-muted-foreground">{apt.vet}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Outstanding Items */}
          {outstandingItems.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Outstanding Items ({outstandingItems.length})
              </h3>
              <div className="space-y-2">
                {outstandingItems.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-3 rounded-lg ${
                      item.urgent
                        ? "bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/40"
                        : "bg-gray-50 dark:bg-gray-800/50"
                    }`}
                  >
                    {item.type === "lab" ? (
                      <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                    ) : (
                      <DollarSign className="w-4 h-4 text-muted-foreground mt-0.5" />
                    )}
                    <div className="text-sm text-foreground">{item.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* AI Clinical Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-900/10 border border-purple-200 dark:border-purple-900/40 rounded-xl p-6"
        >
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-2">
                AI Clinical Summary
              </h3>
              <p className="text-sm text-purple-900/80 dark:text-purple-100/80 leading-relaxed">
                {patientName} is a generally healthy {patientAge} {patientBreed} currently recovering from a right
                front leg sprain sustained during play. Recent vital trends show slight elevation in temperature
                (101.8°F vs normal 101.5°F) consistent with mild inflammation. Currently on NSAID therapy with good
                response. No concerning patterns identified in recent visit history.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-900 border border-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Recent Activity</h2>
            <button className="text-xs text-primary hover:underline flex items-center gap-1">
              View all activity <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === "soap"
                        ? "bg-purple-100 dark:bg-purple-900/30"
                        : activity.type === "medication"
                          ? "bg-green-100 dark:bg-green-900/30"
                          : "bg-purple-100 dark:bg-purple-900/30"
                    }`}
                  >
                    {activity.type === "soap" && <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                    {activity.type === "medication" && <Pill className="w-4 h-4 text-green-600 dark:text-green-400" />}
                    {activity.type === "lab" && (
                      <FlaskConical className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    )}
                  </div>
                  {index < recentActivity.length - 1 && (
                    <div className="w-px h-8 bg-border mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">{activity.title}</span>
                    <span className="text-xs text-muted-foreground">{activity.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
