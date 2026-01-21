import { NextResponse } from "next/server";
import { VertexAI } from "@google-cloud/vertexai";
import { getPatient, getPatientAppointments, getPatientMedications } from "@/lib/firestore-helpers";
import type { Patient, Appointment, Medication } from "@/types/firestore";

interface ChatRequest {
  message: string;
  patientId: string;
  conversationHistory?: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
  model?: string;
}

interface ChatResponse {
  message: string;
  context: {
    patientName: string;
    latestVisitDate?: Date;
    activeMedicationsCount?: number;
  };
}

export async function POST(req: Request) {
  try {
    const {
      message,
      patientId,
      conversationHistory = [],
      model = "Gemini 2.0 Flash",
    }: ChatRequest = await req.json();

    // Validate inputs
    if (!message || !patientId) {
      return NextResponse.json(
        { error: "message and patientId are required" },
        { status: 400 }
      );
    }

    // Fetch patient data
    const patient = await getPatient(patientId);
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Fetch appointment history (last 10 appointments)
    const appointmentsRaw = await getPatientAppointments(patientId, 10);

    // Convert Firestore Timestamps to Date objects
    const appointments = appointmentsRaw.map((apt) => ({
      ...apt,
      date:
        apt.date instanceof Date
          ? apt.date
          : (apt.date as any)?.toDate?.() || new Date(),
    }));

    // Fetch medications from medications collection
    const medicationsRaw = await getPatientMedications(patientId);

    // Convert Firestore Timestamps to Date objects and filter for active medications
    const activeMedications = medicationsRaw
      .filter((med) => med.status === "Active")
      .map((med) => ({
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        route: med.route,
        instructions: med.instructions,
      }));

    // Build patient context string
    const patientContext = buildPatientContext(
      patient,
      appointments,
      activeMedications
    );

    // Initialize Vertex AI - use base64-encoded credentials to avoid DECODER error on Vercel
    const project = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const location = process.env.GOOGLE_CLOUD_LOCATION || "us-central1";

    if (!project) {
      throw new Error("GOOGLE_CLOUD_PROJECT_ID not configured");
    }

    let vertexAI: VertexAI;

    // For Vercel: Use base64-encoded service account JSON
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON_BASE64) {
      try {
        console.log('🔑 Using GOOGLE_APPLICATION_CREDENTIALS_JSON_BASE64');

        const credentials = JSON.parse(
          Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON_BASE64, 'base64').toString()
        );

        vertexAI = new VertexAI({
          project,
          location,
          googleAuthOptions: {
            credentials,
            projectId: project,
          },
        });
      } catch (error) {
        console.error('Failed to initialize with base64 credentials:', error);
        throw error;
      }
    }
    // Fallback: Default authentication (local)
    else {
      vertexAI = new VertexAI({
        project,
        location,
      });
    }

    // Get appropriate model
    const generativeModel = getModel(vertexAI, model);

    // Create system prompt with patient context
    const systemPrompt = `You are an AI clinical assistant helping a VETERINARY PROFESSIONAL (licensed DVM or vet tech) with ${patient.name}'s care.

=== CRITICAL USER CONTEXT ===
THE USER IS A LICENSED VETERINARIAN OR VETERINARY TECHNICIAN - NOT A PET OWNER.
NEVER suggest they consult a veterinarian - THEY ARE THE VETERINARIAN.

=== YOUR ROLE ===
Provide direct, evidence-based clinical guidance based on the medical records below.

=== INSTRUCTIONS ===
- Answer questions directly with clinical information from the records
- For drug interactions: Analyze the medication list using standard veterinary pharmacology. If no significant interactions exist, state: "No significant drug interactions identified between current medications based on standard veterinary pharmacology references."
- For missing information: "I don't see that information in ${patient.name}'s records"
- Use professional veterinary medical terminology
- Format medications as clean bullets: name, dosage, frequency, route on ONE line
- Available assistance: appointment history, medication lists, diagnoses, vitals, follow-ups, clinical summaries
- Be concise and clinically useful

=== FORBIDDEN ===
NEVER use phrases like: "consult with a/the/their/her veterinarian", "speak with a vet", "ask your veterinarian", "check with the vet", "contact a veterinarian"

${patientContext}

Provide a direct clinical answer to the veterinary professional.`;

    // Build chat history with system prompt
    const chatHistory = [
      {
        role: "user" as const,
        parts: [{ text: systemPrompt }],
      },
      {
        role: "model" as const,
        parts: [
          {
            text: `I'm ready to help with ${patient.name}'s care based on the medical records. What would you like to know?`,
          },
        ],
      },
    ];

    // Add conversation history
    conversationHistory.forEach((msg) => {
      chatHistory.push({
        role: msg.role === "user" ? ("user" as const) : ("model" as const),
        parts: [{ text: msg.content }],
      });
    });

    // Start chat and send message
    const chat = generativeModel.startChat({
      history: chatHistory,
    });

    const result = await chat.sendMessage(message);
    const response = result.response;
    let responseText =
      response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!responseText) {
      throw new Error("No response from model");
    }

    // POST-PROCESSING: Filter out inappropriate veterinarian consultation suggestions
    // This is a safety net in case the model ignores the system prompt
    const inappropriatePatterns = [
      /consult with (?:a|the|their|her|his|[\w']+s) vet(?:erinarian)?/gi,
      /speak with (?:a|the|their|her|his|[\w']+s) vet(?:erinarian)?/gi,
      /ask (?:your|a|the|their|[\w']+s) vet(?:erinarian)?/gi,
      /check with (?:a|the|their|[\w']+s) vet(?:erinarian)?/gi,
      /contact (?:a|the|their|[\w']+s) vet(?:erinarian)?/gi,
      /see (?:a|the|their|[\w']+s) vet(?:erinarian)?/gi,
      /visit (?:a|the|their|[\w']+s) vet(?:erinarian)?/gi,
      /reach out to (?:a|the|their|[\w']+s) vet(?:erinarian)?/gi,
      /talk to (?:a|the|their|[\w']+s) vet(?:erinarian)?/gi,
    ];

    let wasFiltered = false;
    for (const pattern of inappropriatePatterns) {
      if (pattern.test(responseText)) {
        wasFiltered = true;
        // Replace inappropriate suggestions with professional language
        responseText = responseText.replace(
          pattern,
          "consider additional clinical evaluation"
        );
      }
    }

    if (wasFiltered) {
      console.warn(
        "⚠️ Filtered inappropriate veterinarian consultation suggestion from AI response"
      );
    }

    // Prepare response
    const chatResponse: ChatResponse = {
      message: responseText,
      context: {
        patientName: patient.name,
        latestVisitDate: appointments[0]?.date,
        activeMedicationsCount: activeMedications.length,
      },
    };

    return NextResponse.json(chatResponse);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate response",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

// Helper: Build patient context string
function buildPatientContext(
  patient: Patient,
  appointments: Appointment[],
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    route?: string;
    instructions?: string;
  }>
): string {
  let context = `
PATIENT INFORMATION:
Name: ${patient.name}
Species: ${patient.species}
Breed: ${patient.breed || "Not specified"}
Age: ${patient.age || "Not specified"}
Weight: ${patient.weight || "Not specified"}
Sex: ${patient.sex || "Not specified"}
Owner: ${patient.ownerName || "Not specified"}
`;

  // Add current medications
  if (medications.length > 0) {
    context += `\n\nCURRENT MEDICATIONS:\n`;
    medications.forEach((med) => {
      const route = med.route ? ` ${med.route}` : "";
      const instructions = med.instructions ? ` (${med.instructions})` : "";
      context += `- ${med.name} ${med.dosage} ${med.frequency}${route}${instructions}\n`;
    });
  } else {
    context += `\n\nCURRENT MEDICATIONS: None documented\n`;
  }

  // Add recent medical history
  if (appointments.length > 0) {
    context += `\n\nRECENT MEDICAL HISTORY (Last ${Math.min(
      5,
      appointments.length
    )} visits):\n`;
    appointments.slice(0, 5).forEach((apt, idx) => {
      const diagnoses =
        apt.soap?.diagnoses?.map((d) => d.condition).join(", ") ||
        "None documented";
      const medsPresc =
        apt.soap?.medications?.map((m) => m.name).join(", ") || "None";
      const followUp = apt.soap?.followUp?.required
        ? `Yes, in ${apt.soap.followUp.timeframe}`
        : "No";

      context += `
Visit ${idx + 1} (${apt.date.toLocaleDateString()}):
Type: ${apt.type}
Chief Complaint: ${apt.chiefComplaint || "N/A"}
Diagnoses: ${diagnoses}
Medications Prescribed: ${medsPresc}
Follow-up Required: ${followUp}
`;
    });

    // Add latest vitals
    const latestVitals = appointments[0]?.soap?.vitals;
    if (latestVitals) {
      context += `\n\nLATEST VITALS (from most recent appointment ${appointments[0].date.toLocaleDateString()}):\n`;
      context += `Temperature: ${latestVitals.temperature || "Not recorded"}\n`;
      context += `Heart Rate: ${latestVitals.heartRate || "Not recorded"}\n`;
      context += `Respiratory Rate: ${
        latestVitals.respiratoryRate || "Not recorded"
      }\n`;
      context += `Weight: ${latestVitals.weight || "Not recorded"}\n`;
    }
  } else {
    context += `\n\nRECENT MEDICAL HISTORY: No appointments on record\n`;
  }

  return context;
}

// Helper: Get appropriate model
function getModel(vertexAI: VertexAI, modelName: string) {
  const baseConfig = {
    generationConfig: {
      temperature: 0.4, // Lower temperature for better instruction-following
      maxOutputTokens: 1024,
      topP: 0.95,
    },
  };

  switch (modelName) {
    case "Gemini 2.0 Flash":
      return vertexAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp",
        ...baseConfig,
      });
    case "Gemini 1.5 Pro":
      return vertexAI.getGenerativeModel({
        model: "gemini-1.5-pro",
        ...baseConfig,
      });
    case "Sonnet 4.5":
      // For now, use Gemini 2.0 Flash
      return vertexAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp",
        ...baseConfig,
      });
    default:
      return vertexAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp",
        ...baseConfig,
      });
  }
}
