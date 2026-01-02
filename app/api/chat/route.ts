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

    // Initialize Vertex AI
    // Following Google Cloud best practices: https://github.com/googleapis/google-auth-library-nodejs
    const project = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const location = process.env.GOOGLE_CLOUD_LOCATION || "us-central1";

    if (!project) {
      throw new Error("GOOGLE_CLOUD_PROJECT_ID not configured");
    }

    let vertexAI: VertexAI;

    // Option 1: Use base64-encoded service account (safest for Vercel - avoids escaping issues)
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64) {
      const credentialsJson = Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64, 'base64').toString('utf-8');
      const credentials = JSON.parse(credentialsJson);
      vertexAI = new VertexAI({
        project,
        location,
        googleAuthOptions: {
          credentials,
          projectId: project,
          scopes: ['https://www.googleapis.com/auth/cloud-platform'],
        },
      });
    }
    // Option 2: Use complete service account JSON
    else if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
      vertexAI = new VertexAI({
        project,
        location,
        googleAuthOptions: {
          credentials,
          projectId: project,
          scopes: ['https://www.googleapis.com/auth/cloud-platform'],
        },
      });
    }
    // Option 3: Fallback to individual env vars (legacy)
    else if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      vertexAI = new VertexAI({
        project,
        location,
        googleAuthOptions: {
          credentials: {
            client_email: process.env.FIREBASE_CLIENT_EMAIL,
            private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            type: 'service_account',
          },
          projectId: project,
          scopes: ['https://www.googleapis.com/auth/cloud-platform'],
        },
      });
    }
    // Option 3: Default authentication (local with service-account-key.json)
    else {
      vertexAI = new VertexAI({
        project,
        location,
      });
    }

    // Get appropriate model
    const generativeModel = getModel(vertexAI, model);

    // Create system prompt with patient context
    const systemPrompt = `You are an AI veterinary assistant helping with ${patient.name}'s care.

CRITICAL INSTRUCTIONS:
- Only provide information based on the medical records provided below
- If information is not in the records, say "I don't see that information in ${patient.name}'s records"
- Be conversational but professional
- Use proper veterinary terminology
- When listing medications, use clean bullet points with medication name, dosage, frequency, and route on ONE line
- For medical questions, encourage consulting with ${patient.name}'s veterinarian
- You can help with: appointment history, medication lists, diagnoses, vitals trends, follow-up schedules
- You CANNOT: diagnose conditions, prescribe medications, provide emergency guidance
- Keep responses concise and well-formatted

${patientContext}

Answer the user's question based on this information.`;

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
    const responseText =
      response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!responseText) {
      throw new Error("No response from model");
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
      temperature: 0.7, // Higher than SOAP (0.3) for more natural chat
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
