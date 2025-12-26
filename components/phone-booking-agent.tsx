"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, PhoneCall, PhoneOff, Calendar, Clock } from "lucide-react"

/**
 * Phone Booking Agent Component
 *
 * PLACEHOLDER for ElevenLabs Conversational AI Agent
 *
 * This component will integrate with ElevenLabs Agent API for phone-based
 * appointment booking. The agent will:
 * - Answer incoming phone calls
 * - Understand natural language booking requests
 * - Check appointment availability
 * - Book appointments in the system
 * - Confirm details with the caller
 *
 * Implementation requires:
 * 1. ElevenLabs Agent creation and configuration
 * 2. Phone number integration (Twilio/Vonage)
 * 3. Calendar system integration
 * 4. Database for appointment storage
 */

interface PhoneBookingAgentProps {
  agentId?: string
  clinicName?: string
  phoneNumber?: string
}

export function PhoneBookingAgent({
  agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID,
  clinicName = "Aww Veterinary Clinic",
  phoneNumber = "+1 (555) DEMO-VET",
}: PhoneBookingAgentProps) {
  const [isAgentActive, setIsAgentActive] = useState(false)
  const [callStatus, setCallStatus] = useState<"idle" | "ringing" | "active" | "ended">("idle")

  return (
    <div className="container mx-auto max-w-4xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Phone Booking Agent</h1>
          <p className="text-muted-foreground mt-1">AI-powered appointment scheduling via phone</p>
        </div>
        <Badge variant={isAgentActive ? "default" : "secondary"} className="text-sm px-3 py-1">
          {isAgentActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Agent Configuration
          </CardTitle>
          <CardDescription>
            ElevenLabs Conversational AI Agent for phone-based appointment booking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Clinic Name</p>
              <p className="text-lg font-semibold">{clinicName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
              <p className="text-lg font-semibold">{phoneNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Agent ID</p>
              <p className="text-sm font-mono text-muted-foreground">
                {agentId || "Not configured"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge variant={callStatus === "active" ? "default" : "outline"}>
                {callStatus}
              </Badge>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Agent Capabilities (Planned)
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Natural language understanding for appointment requests</span>
              </li>
              <li className="flex items-start gap-2">
                <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Real-time availability checking</span>
              </li>
              <li className="flex items-start gap-2">
                <PhoneCall className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Appointment booking and confirmation</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Multi-turn conversation with context retention</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Implementation Status</CardTitle>
          <CardDescription>This is a placeholder component for future development</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <p className="font-medium">Required Steps:</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-2">
              <li>Create and configure ElevenLabs Conversational AI Agent</li>
              <li>Set up phone number integration (Twilio, Vonage, or ElevenLabs telephony)</li>
              <li>Implement availability checking API endpoint</li>
              <li>Implement appointment booking API endpoint</li>
              <li>Configure agent tools/functions for calendar operations</li>
              <li>Set up webhook for call status updates</li>
              <li>Test with sample phone calls</li>
            </ol>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-3">
              For now, use these placeholder controls to test the UI:
            </p>
            <div className="flex gap-2">
              <Button
                variant={isAgentActive ? "destructive" : "default"}
                onClick={() => {
                  setIsAgentActive(!isAgentActive)
                  setCallStatus(isAgentActive ? "idle" : "active")
                }}
              >
                {isAgentActive ? (
                  <>
                    <PhoneOff className="h-4 w-4 mr-2" />
                    Deactivate Agent
                  </>
                ) : (
                  <>
                    <PhoneCall className="h-4 w-4 mr-2" />
                    Activate Agent
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="text-blue-900">Documentation</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 space-y-2">
          <p>
            <strong>ElevenLabs Agent API Docs:</strong>{" "}
            <a
              href="https://elevenlabs.io/docs/conversational-ai/overview"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              elevenlabs.io/docs/conversational-ai/overview
            </a>
          </p>
          <p>
            <strong>Agent Tool Calling:</strong>{" "}
            <a
              href="https://elevenlabs.io/docs/conversational-ai/customization/client-tools"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              elevenlabs.io/docs/conversational-ai/customization/client-tools
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
