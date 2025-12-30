"use client";

import { FlaskConical, Calendar, User, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { usePatientLabResults } from "@/hooks/use-firestore";

interface LabResultsViewProps {
  patientId: string | null;
}

export function LabResultsView({ patientId }: LabResultsViewProps) {
  const { labResults, isLoading } = usePatientLabResults(patientId);

  // Sort labs by order date (newest first)
  const sortedLabs = labResults
    ?.slice()
    .sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime()) || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'Pending':
        return <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
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
      case 'Pending':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
          <span>Loading lab results...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header with Beta Badge */}
      <div className="flex items-center justify-between mb-4 px-6 pt-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <FlaskConical className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Lab Results</h2>
            <p className="text-sm text-muted-foreground">
              {sortedLabs.length} {sortedLabs.length === 1 ? 'test' : 'tests'} on record
            </p>
          </div>
        </div>
        <span className="px-2 py-1 text-xs font-medium rounded-md bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
          Beta
        </span>
      </div>

      {/* Lab Results List */}
      {sortedLabs.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <FlaskConical className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No Lab Results</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            No laboratory tests have been ordered for this patient yet. Lab results will appear here once tests are ordered.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="space-y-3">
            {sortedLabs.map((lab) => (
            <div
              key={lab.id}
              className="p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
            >
              {/* Header Row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FlaskConical className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-foreground mb-1">
                      {lab.testType}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Ordered: {lab.orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      {lab.resultDate && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Results: {lab.resultDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        <span>{lab.orderedBy}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {getStatusIcon(lab.status)}
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-md ${getStatusColor(lab.status)}`}>
                    {lab.status}
                  </span>
                </div>
              </div>

              {/* Notes Section */}
              {lab.notes && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Notes:</span> {lab.notes}
                  </p>
                </div>
              )}

              {/* Results Section (if completed) */}
              {lab.status === 'Completed' && lab.results && Object.keys(lab.results).length > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Test Results
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(lab.results).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <span className="text-muted-foreground">{key}:</span>{' '}
                        <span className="font-medium text-foreground">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          </div>
        </div>
      )}
    </div>
  );
}
