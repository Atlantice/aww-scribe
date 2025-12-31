"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Mic,
  Pill,
  FlaskConical,
  Calendar,
  FileText,
  MessageCircle,
  ArrowRight,
  AlertCircle,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ChatInterface } from "./chat-interface";
import { usePatientMedications, usePatientAppointments, usePatientLabResults, usePatientInvoices } from "@/hooks/use-firestore";
import type { Patient } from "@/types/firestore";

interface OverviewDashboardProps {
  patient: Patient | null;
  patientId: string | null;
  onStartRecording?: () => void;
  onNavigateToSection?: (section: string) => void;
  onChatFullScreenChange?: (isFullScreen: boolean) => void;
}

export function OverviewDashboard({
  patient,
  patientId,
  onStartRecording,
  onNavigateToSection,
  onChatFullScreenChange,
}: OverviewDashboardProps) {
  const [triggerChatFullScreen, setTriggerChatFullScreen] = useState(false);
  const [isQuickActionsExpanded, setIsQuickActionsExpanded] = useState(true);
  const [isChatFullScreen, setIsChatFullScreen] = useState(false);

  // Fetch dynamic data
  const { medications } = usePatientMedications(patientId);
  const { appointments } = usePatientAppointments(patientId, 10);
  const { labResults } = usePatientLabResults(patientId);
  const { invoices } = usePatientInvoices(patientId);
  const [latestVitals, setLatestVitals] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Fetch latest vitals from most recent SOAP
  useEffect(() => {
    if (!patientId) return;
    fetch(`/api/patient-data?patientId=${patientId}&type=vitals`)
      .then(res => res.json())
      .then(data => {
        if (data.vitals?.date) {
          // Convert date string back to Date object
          data.vitals.date = new Date(data.vitals.date);
        }
        setLatestVitals(data.vitals);
      })
      .catch(err => console.error('Error fetching vitals:', err));
  }, [patientId]);

  // Fetch recent activity
  useEffect(() => {
    if (!patientId) return;
    fetch(`/api/patient-data?patientId=${patientId}&type=activity&limit=10`)
      .then(res => res.json())
      .then(data => {
        // Convert date strings back to Date objects
        const activities = (data.activity || []).map((activity: any) => ({
          ...activity,
          date: new Date(activity.date)
        }));
        setRecentActivity(activities);
      })
      .catch(err => console.error('Error fetching activity:', err));
  }, [patientId]);

  // Transform medications for display
  const activeMedications = medications
    ?.filter(m => m.status === 'Active')
    ?.map(m => ({
      name: `${m.name} ${m.dosage}`,
      frequency: m.frequency,
      remaining: m.endDate
        ? `${Math.ceil((m.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining`
        : 'Ongoing'
    })) || [];

  // Transform appointments for display
  const upcomingAppointments = appointments
    ?.filter(a => a.status === 'Scheduled' && a.date > new Date())
    ?.slice(0, 2)
    ?.map(a => ({
      date: a.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      type: a.type,
      vet: a.veterinarianName,
      confirmed: a.status === 'Scheduled'
    })) || [];

  // Outstanding items from lab results + invoices
  const outstandingItems = [
    ...(labResults?.filter(l => l.status === 'Pending').map(l => ({
      type: 'lab' as const,
      text: `Lab results pending (${l.testType} from ${l.orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`,
      urgent: true
    })) || []),
    ...(invoices?.filter(i => i.status === 'Pending' || i.status === 'Overdue').map(i => ({
      type: 'billing' as const,
      text: `Invoice #${i.invoiceNumber} - $${i.amount.toFixed(2)} (${i.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`,
      urgent: i.status === 'Overdue'
    })) || [])
  ];

  const quickActions = [
    {
      icon: Mic,
      label: "Start Recording",
      color: "primary",
      onClick: onStartRecording,
      section: "recording",
    },
    {
      icon: Pill,
      label: "Add Medication",
      color: "green",
      section: "medications",
    },
    {
      icon: FlaskConical,
      label: "View Lab Results",
      color: "blue",
      section: "labs",
    },
    {
      icon: Calendar,
      label: "Schedule Appointment",
      color: "purple",
      onClick: () => {
        // Would open scheduling modal
        console.log("Schedule appointment");
      },
    },
    {
      icon: FileText,
      label: "Generate Report",
      color: "amber",
      section: "documents",
    },
    {
      icon: MessageCircle,
      label: `Ask About ${patient?.name || "Patient"}`,
      color: "pink",
      onClick: () => {
        // Trigger chat to open in full-screen
        setTriggerChatFullScreen(true);
        // Reset the trigger after a brief moment
        setTimeout(() => setTriggerChatFullScreen(false), 100);
      },
    },
  ];

  const handleQuickAction = (action: (typeof quickActions)[0]) => {
    if (action.onClick) {
      action.onClick();
    } else if (action.section && onNavigateToSection) {
      onNavigateToSection(action.section);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-950/50 dark:to-gray-900">
      {/* Hero Section - Chat Interface */}
      <div className="max-w-5xl mx-auto px-6 pt-6 pb-16">
        {/* Header with pet greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 mb-4">
            <span className="text-3xl">🐕</span>
          </div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Hello {patient?.name || "Unknown Patient"}
          </h1>
          <p className="text-muted-foreground">
            {patient?.breed || "Unknown breed"} • {patient?.age || "Unknown age"}
          </p>
        </motion.div>

        {/* AI Chat Interface - Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={isChatFullScreen ? "" : "glow-container"}
        >
          {patientId && (
            <ChatInterface
              patientId={patientId}
              patientName={patient?.name || "Unknown"}
              onFullScreenChange={(isFullScreen) => {
                setIsChatFullScreen(isFullScreen);
                onChatFullScreenChange?.(isFullScreen);
              }}
              onNavigateToSection={onNavigateToSection}
              triggerFullScreen={triggerChatFullScreen}
            />
          )}
        </motion.div>
      </div>

      {/* Secondary Content - Scrollable Details */}
      <div className="bg-gray-50/50 dark:bg-gray-900/50">
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-6 space-y-6">
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
              <h2 className="text-sm font-semibold text-foreground">
                Quick Actions
              </h2>
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
                        className="p-4 bg-white dark:bg-gray-900 border border-border rounded-xl hover:shadow-md hover:border-purple-600/50 transition-all duration-200 text-left group"
                      >
                        <action.icon className="w-5 h-5 text-muted-foreground group-hover:text-purple-600 mb-2 transition-colors duration-200" />
                        <div className="text-sm font-medium text-foreground">
                          {action.label}
                        </div>
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
                <h2 className="text-sm font-semibold text-foreground">
                  Latest Vitals
                </h2>
                {latestVitals?.date && (
                  <span className="text-xs text-muted-foreground">
                    {latestVitals.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
              </div>
              {latestVitals ? (
                <div className="grid grid-cols-4 gap-3">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-900/10 border border-amber-200 dark:border-amber-900/40">
                    <div className="text-xs font-medium text-amber-900 dark:text-amber-400 mb-1">
                      Temp
                    </div>
                    <div className="text-lg font-bold text-foreground">
                      {latestVitals.temperature || "—"}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-900/10 border border-red-200 dark:border-red-900/40">
                    <div className="text-xs font-medium text-red-900 dark:text-red-400 mb-1">
                      HR
                    </div>
                    <div className="text-lg font-bold text-foreground">
                      {latestVitals.heartRate || "—"}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-sky-50 to-sky-100/50 dark:from-sky-900/20 dark:to-sky-900/10 border border-sky-200 dark:border-sky-900/40">
                    <div className="text-xs font-medium text-sky-900 dark:text-sky-400 mb-1">
                      RR
                    </div>
                    <div className="text-lg font-bold text-foreground">
                      {latestVitals.respiratoryRate || "—"}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100/50 dark:from-violet-900/20 dark:to-violet-900/10 border border-violet-200 dark:border-violet-900/40">
                    <div className="text-xs font-medium text-violet-900 dark:text-violet-400 mb-1">
                      Weight
                    </div>
                    <div className="text-lg font-bold text-foreground">
                      {latestVitals.weight || "—"}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground text-center py-8">
                  No recent vitals available
                </div>
              )}
            </div>

            {/* Active Medications */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Active Medications ({activeMedications.length})
                </h3>
                <button
                  onClick={() => onNavigateToSection?.('medications')}
                  className="text-xs text-purple-600 hover:underline flex items-center gap-1"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              {activeMedications.length > 0 ? (
                <div className="space-y-2">
                  {activeMedications.map((med, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground">
                          {med.name} {med.frequency}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {med.remaining}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground text-center py-8">
                  No active medications
                </div>
              )}
            </div>

            {/* Upcoming Appointments */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Upcoming Appointments
                </h3>
                <button className="text-xs text-purple-600 hover:underline flex items-center gap-1">
                  Schedule <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-2">
                  {upcomingAppointments.map((apt, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 ${
                          apt.confirmed ? "bg-green-500" : "bg-purple-500"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground">
                          {apt.date} - {apt.type}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {apt.vet}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground text-center py-8">
                  No upcoming appointments
                </div>
              )}
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
          {patient?.aiSummary && (
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
                    {patient.aiSummary}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-900 border border-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">
                Recent Activity
              </h2>
              <button className="text-xs text-purple-600 hover:underline flex items-center gap-1">
                View all activity <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            {recentActivity.length > 0 ? (
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
                            : "bg-blue-100 dark:bg-blue-900/30"
                        }`}
                      >
                        {activity.type === "soap" && (
                          <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        )}
                        {activity.type === "medication" && (
                          <Pill className="w-4 h-4 text-green-600 dark:text-green-400" />
                        )}
                        {activity.type === "lab" && (
                          <FlaskConical className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                      {index < recentActivity.length - 1 && (
                        <div className="w-px h-8 bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-foreground">
                          {activity.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {activity.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {activity.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-8">
                No recent activity
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
