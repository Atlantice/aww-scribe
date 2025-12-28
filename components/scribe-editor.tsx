"use client";

import { useState } from "react";
import { X, Sparkles, Edit, Pill, AlertCircle, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LiveScribe } from "./live-scribe";
import { formatVitalSign, splitVitalSign } from "@/lib/vitals-formatter";

interface ScribeEditorProps {
  onClose: () => void;
  patientId: string | null;
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

  // NEW: Clinical workflow fields
  medications?: Array<{
    name: string;
    dosage: string;
    frequency: string; // e.g., "BID" (twice daily)
    duration: string; // e.g., "7 days", "2 weeks"
    route?: string; // e.g., "PO" (by mouth), "SC" (subcutaneous)
    instructions?: string; // e.g., "Give with food"
  }>;

  diagnoses?: Array<{
    condition: string; // e.g., "Soft tissue injury"
    icdCode?: string; // e.g., "M79.9" (optional, if extracted)
    severity?: "mild" | "moderate" | "severe";
    isPrimary: boolean;
  }>;

  procedures?: Array<{
    name: string; // e.g., "Physical examination", "Radiograph"
    code?: string; // e.g., "99213" CPT code (optional)
  }>;

  followUp?: {
    required: boolean;
    timeframe?: string; // e.g., "1 week", "2-3 weeks"
    reason?: string; // e.g., "Reassess lameness", "Remove sutures"
  };

  timestamps?: {
    examStarted?: Date;
    examCompleted?: Date;
    documented?: Date;
    attested?: Date;
  };

  attestation?: {
    provider: string;
    timestamp: Date;
    signature?: string; // Provider initials or digital signature
  };
}

export function ScribeEditor({ onClose, patientId }: ScribeEditorProps) {
  const [generatedSOAP, setGeneratedSOAP] = useState<SOAPNote | null>(null);

  const handleSOAPGenerated = async (soap: SOAPNote) => {
    console.log("Received SOAP in ScribeEditor:", soap);
    setGeneratedSOAP(soap);
  };

  const appointmentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#0a0a0a]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">New Scribe</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
          title="Close"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Patient Header */}
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-semibold text-foreground leading-tight">
                  Luna • {appointmentDate} • Dr. Sarah Chen
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Golden Retriever • 4 years • 65 lbs
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-muted-foreground">
                Draft
              </span>
            </div>
          </div>

          {/* AI Summary Card - Canary Mail style */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#faf5ff] to-[#f5f3ff] dark:from-[#2e1065] dark:to-[#1e1538] border border-purple-200 dark:border-purple-900">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#8b5cf6]" />
              <h3 className="text-sm font-semibold text-foreground">
                AI Voice Assistant
              </h3>
            </div>
            <p className="text-sm text-foreground leading-relaxed text-balance">
              Have a conversation with the AI assistant to document Luna's
              visit. The assistant will ask follow-up questions and help
              generate a complete SOAP note from your voice input.
            </p>
          </div>

          {/* Live Scribe Component - INTEGRATED */}
          <LiveScribe
            patientId={patientId}
            patientName="Luna"
            patientBreed="Golden Retriever"
            patientAge="4 years"
            patientWeight="65 lbs"
            onSOAPGenerated={handleSOAPGenerated}
          />

          {/* ONLY SHOW SOAP IF GENERATED */}
          <AnimatePresence mode="wait">
            {generatedSOAP ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Extracted Vitals - Claude-inspired with hover states */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.2 }}
                >
                  <h3 className="text-sm font-semibold text-foreground mb-3">
                    Extracted Vitals
                  </h3>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-900/10 border border-amber-200 dark:border-amber-900/40 transition-all duration-200 hover:shadow-md hover:scale-[1.02] group">
                      <div className="text-xs font-medium text-amber-900 dark:text-amber-400 mb-2">
                        Temperature
                      </div>
                      <div className="text-2xl font-bold text-foreground tabular-nums">
                        {(() => {
                          const formatted = formatVitalSign(
                            generatedSOAP.vitals?.temperature,
                            "temperature"
                          );
                          const { value, unit } = splitVitalSign(formatted);
                          return (
                            <>
                              {value}
                              <span className="text-base font-normal text-muted-foreground ml-0.5">
                                {unit}
                              </span>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-900/10 border border-red-200 dark:border-red-900/40 transition-all duration-200 hover:shadow-md hover:scale-[1.02] group">
                      <div className="text-xs font-medium text-red-900 dark:text-red-400 mb-2">
                        Heart Rate
                      </div>
                      <div className="text-2xl font-bold text-foreground tabular-nums">
                        {(() => {
                          const formatted = formatVitalSign(
                            generatedSOAP.vitals?.heartRate,
                            "heartRate"
                          );
                          const { value, unit } = splitVitalSign(formatted);
                          return (
                            <>
                              {value}
                              <span className="text-base font-normal text-muted-foreground ml-1">
                                {unit}
                              </span>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-sky-50 to-sky-100/50 dark:from-sky-900/20 dark:to-sky-900/10 border border-sky-200 dark:border-sky-900/40 transition-all duration-200 hover:shadow-md hover:scale-[1.02] group">
                      <div className="text-xs font-medium text-sky-900 dark:text-sky-400 mb-2">
                        Resp. Rate
                      </div>
                      <div className="text-2xl font-bold text-foreground tabular-nums">
                        {(() => {
                          const formatted = formatVitalSign(
                            generatedSOAP.vitals?.respiratoryRate,
                            "respiratoryRate"
                          );
                          const { value, unit } = splitVitalSign(formatted);
                          return (
                            <>
                              {value}
                              <span className="text-base font-normal text-muted-foreground">
                                {unit}
                              </span>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100/50 dark:from-violet-900/20 dark:to-violet-900/10 border border-violet-200 dark:border-violet-900/40 transition-all duration-200 hover:shadow-md hover:scale-[1.02] group">
                      <div className="text-xs font-medium text-violet-900 dark:text-violet-400 mb-2">
                        Weight
                      </div>
                      <div className="text-2xl font-bold text-foreground tabular-nums">
                        {(() => {
                          const formatted = formatVitalSign(
                            generatedSOAP.vitals?.weight,
                            "weight"
                          );
                          const { value, unit } = splitVitalSign(formatted);
                          return (
                            <>
                              {value}
                              <span className="text-base font-normal text-muted-foreground ml-1">
                                {unit}
                              </span>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* SOAP Note Sections - Clean with colored left border */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.2 }}
                  className="space-y-3"
                >
                  {/* Subjective */}
                  <div className="bg-white dark:bg-[#1a1a1a] border border-border rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md hover:border-purple-200 dark:hover:border-purple-900">
                    <div className="px-5 py-3 bg-gradient-to-r from-purple-50 to-purple-100 dark:bg-gradient-to-r dark:from-purple-950/30 dark:to-purple-900/20 border-l-4 border-purple-500">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xs font-semibold text-primary uppercase tracking-wide">
                            [S] SUBJECTIVE
                          </h3>
                          <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">
                            Chief complaint and history
                          </p>
                        </div>
                        <button className="px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-purple-100 dark:hover:bg-purple-900/40 flex items-center gap-1 transition-all duration-200">
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-foreground leading-relaxed">
                        {generatedSOAP.subjective}
                      </p>
                    </div>
                  </div>

                  {/* Objective */}
                  <div className="bg-white dark:bg-[#1a1a1a] border border-border rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md hover:border-green-200 dark:hover:border-green-900">
                    <div className="px-5 py-3 bg-gradient-to-r from-green-50 to-green-100 dark:bg-gradient-to-r dark:from-green-950/30 dark:to-green-900/20 border-l-4 border-green-500">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xs font-semibold text-green-900 dark:text-green-100 uppercase tracking-wide">
                            [O] OBJECTIVE
                          </h3>
                          <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                            Physical exam and vitals
                          </p>
                        </div>
                        <button className="px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-green-100 dark:hover:bg-green-900/40 flex items-center gap-1 transition-all duration-200">
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                      </div>
                    </div>
                    <div className="p-4 space-y-2 text-sm text-foreground leading-relaxed">
                      <p className="whitespace-pre-wrap">
                        {generatedSOAP.objective}
                      </p>
                    </div>
                  </div>

                  {/* Assessment */}
                  <div className="bg-white dark:bg-[#1a1a1a] border border-border rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md hover:border-amber-200 dark:hover:border-amber-900">
                    <div className="px-5 py-3 bg-gradient-to-r from-amber-50 to-amber-100 dark:bg-gradient-to-r dark:from-amber-950/30 dark:to-amber-900/20 border-l-4 border-amber-500">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xs font-semibold text-amber-900 dark:text-amber-100 uppercase tracking-wide">
                            [A] ASSESSMENT
                          </h3>
                          <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                            Diagnosis and interpretation
                          </p>
                        </div>
                        <button className="px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-amber-100 dark:hover:bg-amber-900/40 flex items-center gap-1 transition-all duration-200">
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-foreground leading-relaxed">
                        {generatedSOAP.assessment}
                      </p>
                    </div>
                  </div>

                  {/* Plan */}
                  <div className="bg-white dark:bg-[#1a1a1a] border border-border rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md hover:border-purple-200 dark:hover:border-purple-900">
                    <div className="px-5 py-3 bg-gradient-to-r from-purple-50 to-purple-100 dark:bg-gradient-to-r dark:from-purple-950/30 dark:to-purple-900/20 border-l-4 border-purple-500">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xs font-semibold text-purple-900 dark:text-purple-100 uppercase tracking-wide">
                            [P] PLAN
                          </h3>
                          <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">
                            Treatment and follow-up
                          </p>
                        </div>
                        <button className="px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-purple-100 dark:hover:bg-purple-900/40 flex items-center gap-1 transition-all duration-200">
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                      </div>
                    </div>
                    <div className="p-4 space-y-3 text-sm text-foreground">
                      <p className="whitespace-pre-wrap">
                        {generatedSOAP.plan}
                      </p>
                    </div>
                  </div>

                  {/* Problem List / Diagnoses Section */}
                  {generatedSOAP.diagnoses &&
                    generatedSOAP.diagnoses.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.2 }}
                      >
                        <div className="bg-white dark:bg-[#1a1a1a] border border-border rounded-xl overflow-hidden shadow-sm">
                          <div className="px-5 py-3 bg-gradient-to-r from-rose-50 to-rose-100 dark:from-rose-950/30 dark:to-rose-900/20 border-l-4 border-rose-500">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-xs font-semibold text-rose-900 dark:text-rose-100 uppercase tracking-wide">
                                  PROBLEM LIST
                                </h3>
                                <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
                                  Active diagnoses and conditions
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="p-5">
                            <div className="space-y-2">
                              {generatedSOAP.diagnoses.map((dx, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50"
                                >
                                  <div
                                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                      dx.severity === "severe"
                                        ? "bg-red-500"
                                        : dx.severity === "moderate"
                                        ? "bg-amber-500"
                                        : "bg-green-500"
                                    }`}
                                  />
                                  <span className="text-sm text-foreground flex-1">
                                    {dx.condition}
                                  </span>
                                  {dx.isPrimary && (
                                    <span className="px-2 py-0.5 rounded text-xs bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300">
                                      Primary
                                    </span>
                                  )}
                                  {dx.icdCode && (
                                    <span className="text-xs text-muted-foreground font-mono">
                                      {dx.icdCode}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                  {/* Medications Section */}
                  {generatedSOAP.medications &&
                    generatedSOAP.medications.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.2 }}
                      >
                        <div className="bg-white dark:bg-[#1a1a1a] border border-border rounded-xl overflow-hidden shadow-sm">
                          <div className="px-5 py-3 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/20 border-l-4 border-indigo-500">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-xs font-semibold text-indigo-900 dark:text-indigo-100 uppercase tracking-wide">
                                  [Rx] MEDICATIONS
                                </h3>
                                <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-0.5">
                                  Prescribed medications and instructions
                                </p>
                              </div>
                              <button className="px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-indigo-100 dark:hover:bg-indigo-900/40 flex items-center gap-1 transition-all duration-200">
                                <Edit className="w-3 h-3" />
                                Edit
                              </button>
                            </div>
                          </div>
                          <div className="p-5 space-y-4">
                            {generatedSOAP.medications.map((med, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
                              >
                                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                                  <Pill className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-sm font-semibold text-foreground">
                                      {med.name}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      {med.dosage}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                                    <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium">
                                      {med.frequency}
                                    </span>
                                    {med.route && (
                                      <span>Route: {med.route}</span>
                                    )}
                                    <span>{med.duration}</span>
                                  </div>
                                  {med.instructions && (
                                    <p className="text-xs text-foreground italic">
                                      Sig: {med.instructions}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                  {/* Follow-Up Section */}
                  {generatedSOAP.followUp &&
                    generatedSOAP.followUp.required && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.2 }}
                      >
                        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950/30 dark:to-cyan-900/20 border border-cyan-200 dark:border-cyan-900 rounded-xl p-5">
                          <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="text-sm font-semibold text-cyan-900 dark:text-cyan-100 mb-1">
                                Follow-Up Required
                              </h4>
                              <p className="text-sm text-cyan-800 dark:text-cyan-200">
                                Schedule recheck in{" "}
                                <span className="font-semibold">
                                  {generatedSOAP.followUp.timeframe}
                                </span>
                              </p>
                              {generatedSOAP.followUp.reason && (
                                <p className="text-xs text-cyan-700 dark:text-cyan-300 mt-1">
                                  Reason: {generatedSOAP.followUp.reason}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                  {/* Provider Attestation Block */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.2 }}
                  >
                    {generatedSOAP.attestation ? (
                      <div className="bg-gray-50 dark:bg-gray-900/50 border border-border rounded-xl p-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-bold text-primary">
                                {generatedSOAP.attestation.signature ||
                                  generatedSOAP.attestation.provider
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-foreground">
                                {generatedSOAP.attestation.provider}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Attested{" "}
                                {new Date(
                                  generatedSOAP.attestation.timestamp
                                ).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium">
                            ✓ Attested
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900 rounded-xl p-5">
                        <div className="flex items-center gap-3">
                          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                              Awaiting Provider Attestation
                            </div>
                            <div className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                              This note must be reviewed and attested before
                              finalizing
                            </div>
                          </div>
                          <button className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-colors">
                            Attest Now
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </motion.div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  {!generatedSOAP.attestation ? (
                    <>
                      <button className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm hover:shadow-md transition-all duration-200">
                        Review & Attest
                      </button>
                      <button className="px-6 py-2.5 rounded-lg border border-border hover:bg-gray-50 dark:hover:bg-gray-800 text-foreground font-medium transition-all duration-200">
                        Edit Note
                      </button>
                      <button className="px-6 py-2.5 rounded-lg border border-border hover:bg-gray-50 dark:hover:bg-gray-800 text-foreground font-medium transition-all duration-200">
                        Save Draft
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="px-6 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-muted-foreground font-medium cursor-not-allowed">
                        ✓ Attested & Saved
                      </button>
                      <button className="px-6 py-2.5 rounded-lg border border-border hover:bg-gray-50 dark:hover:bg-gray-800 text-foreground font-medium transition-all duration-200">
                        Print / Export
                      </button>
                      <button className="px-6 py-2.5 rounded-lg border border-border hover:bg-gray-50 dark:hover:bg-gray-800 text-foreground font-medium transition-all duration-200">
                        Send to Client
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ) : (
              // BLANK STATE - Before SOAP is generated
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Ready to Document
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Click "Start Listening" above to begin documenting this
                  appointment. The AI will transcribe your conversation and
                  generate a complete SOAP note.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
