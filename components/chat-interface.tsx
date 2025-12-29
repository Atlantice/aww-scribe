"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Loader2,
  Pill,
  Activity,
  Calendar,
  FileText,
  X,
} from "lucide-react";

interface ChatInterfaceProps {
  patientId: string;
  patientName: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  context?: {
    patientName?: string;
    latestVisitDate?: Date;
    activeMedicationsCount?: number;
  };
}

type Category = "medications" | "history" | "appointments" | "vitals" | null;

const CATEGORY_QUESTIONS: Record<string, string[]> = {
  medications: [
    "What medications is currently prescribed?",
    "Are there any medication interactions I should know about?",
    "When is the next medication refill due?",
  ],
  history: [
    "Show me the complete medical history",
    "What were the previous diagnoses?",
    "Any chronic conditions documented?",
  ],
  appointments: [
    "When was the last visit?",
    "Are there any upcoming follow-ups?",
    "Show me the appointment history",
  ],
  vitals: [
    "What were the latest vitals?",
    "Show me the vital signs trend",
    "Any concerning vital measurements?",
  ],
};

export function ChatInterface({ patientId, patientName }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>(null);
  const [isFullView, setIsFullView] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedModel = "Gemini 2.0 Flash";

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);
    setSelectedCategory(null); // Close category suggestions

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          patientId,
          conversationHistory: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
        context: data.context,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setError(err instanceof Error ? err.message : "Failed to send message");

      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `Sorry, I encountered an error: ${
          err instanceof Error ? err.message : "Unknown error"
        }. Please try again.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = async (question: string) => {
    setInput(question);
    setSelectedCategory(null);

    // Auto-send the question
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    // Enter full view when starting a conversation
    setIsFullView(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: question,
          patientId,
          conversationHistory: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
        context: data.context,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setError(err instanceof Error ? err.message : "Failed to send message");

      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `Sorry, I encountered an error: ${
          err instanceof Error ? err.message : "Unknown error"
        }. Please try again.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Full-view mode: render as full-screen modal
  if (isFullView) {
    return (
      <div className="fixed inset-0 z-50 bg-white dark:bg-gray-950 flex flex-col">
        {/* Header with close button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold">{patientName} - AI Assistant</h2>
          <button
            onClick={() => setIsFullView(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages area - scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    msg.role === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-foreground"
                  }`}
                >
                  <p className="text-base whitespace-pre-wrap">{msg.content}</p>
                  <span className="text-xs opacity-70 mt-2 block">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area - sticky at bottom */}
        <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <div className="max-w-3xl mx-auto px-6 py-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={`Ask about ${patientName}...`}
              disabled={isLoading}
              className="w-full min-h-[100px] bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none resize-none text-base"
            />

            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-800 mt-3">
              <span className="text-xs text-muted-foreground">
                {selectedModel}
              </span>
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send
                  </>
                )}
              </button>
            </div>

            {error && <p className="text-xs text-red-500 mt-2">Error: {error}</p>}
          </div>
        </div>
      </div>
    );
  }

  // Normal embedded view
  return (
    <div className="space-y-2 max-w-3xl mx-auto">
      {/* Main chat input - ultra minimal */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
        {/* Messages area - only show if there are messages */}
        {messages.length > 0 && (
          <div className="max-h-[300px] overflow-y-auto p-4 space-y-3 border-b border-gray-200 dark:border-gray-800">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 ${
                    msg.role === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-foreground"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input area */}
        <div className="p-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={`How can I help ${patientName} today?`}
            disabled={isLoading}
            className="w-full min-h-[80px] bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none resize-none text-base"
          />

          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-800">
            <span className="text-xs text-muted-foreground">
              {selectedModel}
            </span>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>

          {error && <p className="text-xs text-red-500 mt-2">Error: {error}</p>}
        </div>
      </div>

      {/* Category buttons */}
      {messages.length === 0 && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() =>
              setSelectedCategory(
                selectedCategory === "medications" ? null : "medications"
              )
            }
            className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm flex items-center gap-1.5"
          >
            <Pill className="w-3.5 h-3.5" />
            Medications
          </button>
          <button
            onClick={() =>
              setSelectedCategory(
                selectedCategory === "history" ? null : "history"
              )
            }
            className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            History
          </button>
          <button
            onClick={() =>
              setSelectedCategory(
                selectedCategory === "appointments" ? null : "appointments"
              )
            }
            className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            Appointments
          </button>
          <button
            onClick={() =>
              setSelectedCategory(
                selectedCategory === "vitals" ? null : "vitals"
              )
            }
            className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm flex items-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5" />
            Vitals
          </button>
        </div>
      )}

      {/* Expanded category suggestions */}
      {selectedCategory && messages.length === 0 && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              {selectedCategory === "medications" && (
                <>
                  <Pill className="w-4 h-4" /> Medications
                </>
              )}
              {selectedCategory === "history" && (
                <>
                  <FileText className="w-4 h-4" /> Medical History
                </>
              )}
              {selectedCategory === "appointments" && (
                <>
                  <Calendar className="w-4 h-4" /> Appointments
                </>
              )}
              {selectedCategory === "vitals" && (
                <>
                  <Activity className="w-4 h-4" /> Vitals
                </>
              )}
            </h3>
            <button
              onClick={() => setSelectedCategory(null)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1">
            {CATEGORY_QUESTIONS[selectedCategory]?.map((question, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestedQuestion(question)}
                className="block w-full text-left text-sm p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
