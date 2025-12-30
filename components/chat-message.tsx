"use client";

import { Pill, ArrowRight, FileText } from "lucide-react";

interface ChatMessageProps {
  content: string;
  onNavigateToSection?: (section: string) => void;
  className?: string;
}

export function ChatMessage({ content, onNavigateToSection, className = "" }: ChatMessageProps) {
  // Detect if the message is about medications
  const isMedicationMessage = /medication|prescribed|carprofen|heartgard/i.test(content);

  // Detect if the message is about diagnoses or medical history
  const isDiagnosisMessage = /diagnos[ie]s|medical history/i.test(content);

  // Parse medication list from markdown bullet points
  const parseMedications = (text: string): { name: string; details: string }[] | null => {
    // Look for patterns like:
    // * **Carprofen** 75mg BID PO (Give with food)
    // * Carprofen 75mg BID PO (Give with food)
    // - Carprofen 75mg BID PO

    // Try with bold markers first
    let medicationPattern = /[*-]\s+\*\*([^*]+)\*\*\s+(.+)/g;
    let matches = [...text.matchAll(medicationPattern)];

    // If no matches, try without bold markers
    if (matches.length === 0) {
      // Match: * SomeMedicationName 75mg BID PO (instructions)
      medicationPattern = /[*-]\s+([A-Z][a-zA-Z\s]+?)\s+(\d+.*)/g;
      matches = [...text.matchAll(medicationPattern)];
    }

    if (matches.length === 0) return null;

    return matches.map(match => ({
      name: match[1].trim(),
      details: match[2].trim()
    }));
  };

  // Parse diagnosis list or visit history
  const parseDiagnoses = (text: string): { date: string; diagnosis: string }[] | null => {
    // Look for patterns like:
    // * **12/29/2025:** Swollen foot
    // * **12/28/2025:** No documented diagnosis
    // Visit 1 (12/30/2025): * Type: Sick Visit * Diagnoses: Soft tissue injury

    // First try the simple date: diagnosis format
    let diagnosisPattern = /[*-]\s+\*\*([^*:]+):\*\*\s+(.+)/g;
    let matches = [...text.matchAll(diagnosisPattern)];

    // If no matches, try visit format
    if (matches.length === 0) {
      // Match: Visit 1 (12/30/2025): content or **Visit 1 (12/30/2025):** content
      const visitPattern = /\*?\*?Visit \d+ \(([^)]+)\):\*?\*?\s*(.+?)(?=\*?\*?Visit \d+|\n\n|$)/gs;
      const visitMatches = [...text.matchAll(visitPattern)];

      if (visitMatches.length > 0) {
        return visitMatches.map(match => {
          const date = match[1].trim();
          const content = match[2].trim();

          // Extract diagnosis from the visit content
          const diagMatch = content.match(/Diagnos[ie]s:\s*([^*]+)/i);
          const diagnosis = diagMatch ? diagMatch[1].trim() : content.substring(0, 100) + '...';

          return {
            date: date,
            diagnosis: diagnosis
          };
        });
      }

      return null;
    }

    return matches.map(match => ({
      date: match[1].trim(),
      diagnosis: match[2].trim()
    }));
  };

  // Format markdown content (bold text)
  const formatMarkdown = (text: string) => {
    // Split by bold markers and render
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const medications = parseMedications(content);
  const diagnoses = parseDiagnoses(content);

  // If it's a diagnosis message with parsed diagnoses, render enhanced UI
  if (isDiagnosisMessage && diagnoses && diagnoses.length > 0) {
    // Extract the intro text (before the diagnosis list)
    const introMatch = content.match(/^(.+?)(?=[*-]\s+\*\*)/s);
    const introText = introMatch ? introMatch[1].trim() : "";

    return (
      <div className={className}>
        {introText && (
          <p className="text-base leading-relaxed text-foreground mb-4">
            {formatMarkdown(introText)}
          </p>
        )}

        {/* Diagnosis Timeline */}
        <div className="space-y-2 mb-4">
          {diagnoses.map((diag, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 border border-blue-200 dark:border-blue-900/40"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                  {diag.date}
                </div>
                <div className="text-sm text-blue-900/80 dark:text-blue-100/80">
                  {diag.diagnosis}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Records Button */}
        {onNavigateToSection && (
          <button
            onClick={() => onNavigateToSection('appointments')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
          >
            <FileText className="w-4 h-4" />
            View All Records
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  // If it's a medication message with parsed medications, render enhanced UI
  if (isMedicationMessage && medications && medications.length > 0) {
    // Extract the intro text (before the medication list)
    const introMatch = content.match(/^(.+?)(?=[*-]\s+\*\*)/s);
    const introText = introMatch ? introMatch[1].trim() : "";

    return (
      <div className={className}>
        {introText && (
          <p className="text-base leading-relaxed text-foreground mb-4">
            {formatMarkdown(introText)}
          </p>
        )}

        {/* Medication Cards */}
        <div className="space-y-2 mb-4">
          {medications.map((med, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-900/10 border border-purple-200 dark:border-purple-900/40"
            >
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Pill className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                  {med.name}
                </div>
                <div className="text-sm text-purple-900/80 dark:text-purple-100/80">
                  {med.details}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Medications Button */}
        {onNavigateToSection && (
          <button
            onClick={() => onNavigateToSection('medications')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors"
          >
            <Pill className="w-4 h-4" />
            View All Medications
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  // Default rendering with markdown support
  return (
    <p className={`text-base leading-relaxed text-foreground ${className}`}>
      {formatMarkdown(content)}
    </p>
  );
}
