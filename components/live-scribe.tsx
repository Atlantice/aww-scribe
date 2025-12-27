/**
 * Live Scribe Component
 *
 * Ambient transcription during veterinary exams using ElevenLabs Scribe v2 Realtime
 * - Real-time speech-to-text with medical terminology accuracy
 * - No AI responses during recording (passive listening only)
 * - Generates SOAP note when stopped
 */

"use client";

import { useState, useEffect } from "react";
import { useScribe } from "@elevenlabs/react";
import { Mic, Sparkles, AlertCircle, Loader2 } from "lucide-react";

interface LiveScribeProps {
  patientId: string | null;
  patientName: string;
  patientBreed: string;
  patientAge?: string;
  patientWeight?: string;
  onSOAPGenerated?: (soap: SOAPNote) => void;
  autoStart?: boolean;
}

interface SOAPNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  vitals?: {
    temperature?: string;
    heartRate?: string;
    respiratoryRate?: string;
    weight?: string;
  };
  chiefComplaint?: string;
  diagnosis?: string;
  appointmentId?: string;
}

export function LiveScribe({
  patientId,
  patientName,
  patientBreed,
  patientAge,
  patientWeight,
  onSOAPGenerated,
  autoStart = false,
}: LiveScribeProps) {
  const [fullTranscript, setFullTranscript] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAppointmentId, setCurrentAppointmentId] = useState<
    string | null
  >(null);

  // Create appointment in Firestore when recording starts
  const createAppointment = async () => {
    try {
      const response = await fetch("/api/appointments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          veterinarianName: "Dr. Sarah Chen",
          type: "Sick Visit",
        }),
      });

      const { appointmentId } = await response.json();
      setCurrentAppointmentId(appointmentId);
      console.log("✅ Created appointment:", appointmentId);
    } catch (error) {
      console.error("❌ Failed to create appointment:", error);
    }
  };

  // ElevenLabs Scribe v2 hook
  const scribe = useScribe({
    modelId: "scribe_v2_realtime",

    // Partial transcripts (live, as speaking - optional to display)
    onPartialTranscript: (data) => {
      console.log("📝 Partial transcript:", data.text);
    },

    // Committed transcripts (completed speech segments)
    onCommittedTranscript: (data) => {
      console.log("✅ Committed transcript:", data.text);
      console.log(
        "📊 Total committed transcripts:",
        scribe.committedTranscripts.length + 1
      );
      setFullTranscript((prev) => (prev ? prev + " " + data.text : data.text));
    },

    // Connection events
    onConnect: () => {
      console.log("🔗 Connected to ElevenLabs Scribe");
    },

    onDisconnect: () => {
      console.log("🔌 Disconnected from ElevenLabs Scribe");
    },

    // Error handling
    onError: (error) => {
      console.error("❌ Scribe error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setError(`Transcription error: ${errorMessage}`);
    },
  });

  // Start recording
  const handleStartRecording = async () => {
    try {
      setError(null);
      setFullTranscript("");

      // Create appointment in Firestore first
      await createAppointment();

      // Fetch single-use token
      const response = await fetch("/api/scribe-token");

      if (!response.ok) {
        throw new Error("Failed to fetch authentication token");
      }

      const { token } = await response.json();

      // Connect to ElevenLabs Scribe v2
      await scribe.connect({
        token,

        // Microphone settings for clean audio
        microphone: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },

        // Language (helps accuracy)
        languageCode: "en",

        // Audio format (16kHz recommended)
        audioFormat: "pcm_16000",

        // Commit strategy: 'vad' auto-segments on silence
        commitStrategy: "vad",

        // VAD settings
        vadSilenceThresholdSecs: 2.0, // 2 seconds silence = commit
        vadThreshold: 0.4, // Sensitivity (0.1-0.9)

        // Include word-level timestamps (optional)
        includeTimestamps: false,
      });

      console.log("✅ Recording started successfully");
    } catch (error) {
      console.error("Failed to start recording:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to start recording. Check console for details."
      );
    }
  };

  // Stop recording and generate SOAP
  const handleStopAndGenerate = async () => {
    console.log("🛑 Stopping recording...");
    console.log("📊 Scribe state:", {
      isConnected: scribe.isConnected,
      committedTranscriptsCount: scribe.committedTranscripts.length,
      partialTranscript: scribe.partialTranscript,
    });

    // Build the final transcript from ALL sources:
    // 1. Committed transcripts (finalized segments)
    // 2. Current partial transcript (not yet committed)
    // 3. Fallback to fullTranscript state
    const committedText = scribe.committedTranscripts
      .map((t) => t.text)
      .join(" ")
      .trim();

    const partialText = scribe.partialTranscript?.trim() || "";

    // Combine all transcript sources
    let finalTranscript = committedText;
    if (partialText && !finalTranscript.includes(partialText)) {
      finalTranscript = finalTranscript
        ? `${finalTranscript} ${partialText}`
        : partialText;
    }

    // Final fallback to state
    if (!finalTranscript && fullTranscript) {
      finalTranscript = fullTranscript;
    }

    finalTranscript = finalTranscript.trim();

    console.log("📝 Committed text:", committedText);
    console.log("🔄 Partial text:", partialText);
    console.log("✅ Final transcript:", finalTranscript);
    console.log("📏 Final transcript length:", finalTranscript.length);

    // Disconnect from ElevenLabs
    scribe.disconnect();

    if (!finalTranscript) {
      console.error("❌ No transcript captured!");
      console.error("Debug info:", {
        committedCount: scribe.committedTranscripts.length,
        hasPartial: !!scribe.partialTranscript,
        stateTranscript: fullTranscript,
      });
      setError("No transcript to process. Please speak during the recording.");
      return;
    }

    if (!currentAppointmentId) {
      console.error("❌ No appointment ID!");
      setError("No appointment ID - please try recording again");
      return;
    }

    // Generate SOAP note from transcript
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-soap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: finalTranscript, // Use the finalTranscript we just built
          // Patient details below are sent separately as context for AI prompt,
          // NOT merged into the transcript text
          patientId,
          patientName,
          patientBreed,
          patientAge,
          patientWeight,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate SOAP note");
      }

      const soap = await response.json();

      console.log("✅ SOAP note generated, now saving to Firestore...");

      // Save SOAP note to Firestore
      const saveResponse = await fetch("/api/appointments/save-soap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: currentAppointmentId,
          soap: {
            subjective: soap.subjective,
            objective: soap.objective,
            assessment: soap.assessment,
            plan: soap.plan,
            vitals: soap.vitals,
          },
        }),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.error || "Failed to save SOAP note");
      }

      console.log("✅ SOAP note saved to Firestore successfully");

      // Send SOAP to parent component for UI display
      if (onSOAPGenerated) {
        onSOAPGenerated({
          ...soap,
          appointmentId: currentAppointmentId,
        });
      }

      // Reset for next recording
      setCurrentAppointmentId(null);
      setFullTranscript("");
    } catch (error) {
      console.error("Failed to generate SOAP:", error);
      setError(
        error instanceof Error
          ? `Failed to generate SOAP note: ${error.message}`
          : "Failed to generate SOAP note"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900">Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Recording Controls */}
      <div className="flex flex-col items-center gap-6 py-12 px-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-sm">
        {!scribe.isConnected ? (
          <button
            onClick={handleStartRecording}
            disabled={isGenerating}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-600 hover:from-purple-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Recording
          </button>
        ) : (
          <>
            {/* Status indicator */}
            <div className="flex items-center gap-3 px-5 py-3 bg-red-50 rounded-full border-2 border-red-200">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-semibold text-red-700">
                Recording in Progress
              </span>
            </div>

            {/* Visual feedback */}
            <div className="text-center">
              <div className="relative inline-block">
                <Mic className="w-16 h-16 text-purple-600" />
                <div className="absolute inset-0 w-16 h-16 bg-purple-400 rounded-full animate-ping opacity-25" />
              </div>
              <div className="text-sm text-gray-600 mt-3">
                Listening to conversation...
              </div>
            </div>

            {/* Stop button */}
            <button
              onClick={handleStopAndGenerate}
              disabled={isGenerating}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-600 hover:from-purple-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating SOAP...
                </span>
              ) : (
                "Stop & Generate SOAP"
              )}
            </button>
          </>
        )}
      </div>

      {/* Live Transcript Display */}
      {scribe.isConnected && (
        <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live Transcript
          </h3>

          <div className="space-y-3 font-mono text-sm text-gray-700 max-h-96 overflow-y-auto">
            {/* Show committed transcripts */}
            {scribe.committedTranscripts.map((t, idx) => (
              <p key={t.id || idx} className="leading-relaxed">
                {t.text}
              </p>
            ))}

            {/* Show current partial (live) */}
            {scribe.partialTranscript && (
              <p className="text-gray-500 italic leading-relaxed">
                {scribe.partialTranscript}
                <span className="inline-block w-0.5 h-4 bg-blue-600 animate-pulse ml-1" />
              </p>
            )}

            {/* Empty state */}
            {scribe.committedTranscripts.length === 0 &&
              !scribe.partialTranscript && (
                <p className="text-gray-400 italic text-center py-8">
                  Awaiting speech...
                </p>
              )}
          </div>
        </div>
      )}

      {/* AI Processing Indicator */}
      {isGenerating && (
        <div className="flex items-center gap-3 p-5 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
          <Sparkles className="w-6 h-6 text-purple-600 animate-pulse" />
          <div>
            <p className="text-sm font-semibold text-purple-900">
              AI Processing
            </p>
            <p className="text-xs text-purple-700 mt-0.5">
              Extracting medical entities and generating SOAP note...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
