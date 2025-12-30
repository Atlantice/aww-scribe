"use client";

import { Calendar, User, Clock, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { usePatientAppointments } from "@/hooks/use-firestore";

interface AppointmentsViewProps {
  patientId: string | null;
}

export function AppointmentsView({ patientId }: AppointmentsViewProps) {
  const { appointments, isLoading } = usePatientAppointments(patientId);

  // Sort appointments by date (newest first)
  const sortedAppointments = appointments
    ?.slice()
    .sort((a, b) => b.date.getTime() - a.date.getTime()) || [];

  // Separate upcoming and past appointments
  const now = new Date();
  const upcomingAppointments = sortedAppointments.filter(apt => apt.date > now);
  const pastAppointments = sortedAppointments.filter(apt => apt.date <= now);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'Scheduled':
        return <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'Cancelled':
        return <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getAppointmentTypeColor = (type: string) => {
    switch (type) {
      case 'Sick Visit':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'Wellness Exam':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Follow-up':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'Surgery':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'Vaccination':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
          <span>Loading appointments...</span>
        </div>
      </div>
    );
  }

  const AppointmentCard = ({ appointment }: { appointment: any }) => (
    <div
      className="p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
    >
      {/* Header Row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-base font-semibold text-foreground">
                {appointment.date.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </h3>
              <span className={`px-2 py-0.5 text-xs font-medium rounded ${getAppointmentTypeColor(appointment.type)}`}>
                {appointment.type}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{appointment.date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>{appointment.veterinarianName}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {getStatusIcon(appointment.status)}
          <span className={`px-2.5 py-1 text-xs font-medium rounded-md ${getStatusColor(appointment.status)}`}>
            {appointment.status}
          </span>
        </div>
      </div>

      {/* Reason/Chief Complaint */}
      {appointment.reason && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Reason:</span> {appointment.reason}
          </p>
        </div>
      )}

      {/* SOAP Notes Indicator */}
      {appointment.soap && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
            <FileText className="w-4 h-4" />
            <span className="font-medium">SOAP notes available</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header with Beta Badge */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Appointments</h2>
            <p className="text-sm text-muted-foreground">
              {sortedAppointments.length} {sortedAppointments.length === 1 ? 'appointment' : 'appointments'} on record
            </p>
          </div>
        </div>
        <span className="px-2 py-1 text-xs font-medium rounded-md bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
          Beta
        </span>
      </div>

      {/* Appointments List */}
      {sortedAppointments.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No Appointments</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            No appointments have been scheduled for this patient yet. Appointments will appear here once scheduled.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Upcoming Appointments */}
          {upcomingAppointments.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Upcoming ({upcomingAppointments.length})
              </h3>
              <div className="space-y-3">
                {upcomingAppointments.map((apt) => (
                  <AppointmentCard key={apt.id} appointment={apt} />
                ))}
              </div>
            </div>
          )}

          {/* Past Appointments */}
          {pastAppointments.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Past ({pastAppointments.length})
              </h3>
              <div className="space-y-3">
                {pastAppointments.map((apt) => (
                  <AppointmentCard key={apt.id} appointment={apt} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
