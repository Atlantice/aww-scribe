# 🎙️ AwwScribe - AI-Powered Veterinary Clinical Scribe

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![ElevenLabs](https://img.shields.io/badge/ElevenLabs-Scribe_v2-purple)](https://elevenlabs.io/)
[![Google Cloud](https://img.shields.io/badge/Google_Cloud-Vertex_AI-orange)](https://cloud.google.com/vertex-ai)

**AwwScribe** is an AI-powered clinical scribe designed specifically for veterinary practices. It uses ambient voice transcription and medical AI to automatically generate professional SOAP notes from veterinary appointments, freeing veterinarians to focus on patient care.

## 🌟 Features

### 1. Live Scribe (Ambient Transcription)
- **Real-time voice transcription** using ElevenLabs Scribe v2
- **Medical terminology optimized** for veterinary context
- **Sub-100ms latency** for immediate feedback
- **Voice Activity Detection (VAD)** with automatic segmentation
- **One-click SOAP generation** from complete transcripts

### 2. SOAP Note Generation
- **AI-powered medical documentation** using Google Gemini 2.0 Flash
- **Structured output** with Subjective, Objective, Assessment, Plan sections
- **Medical entity extraction** (vitals, diagnoses, medications)
- **Professional veterinary terminology**
- **Copy-to-clipboard** for easy integration with existing systems

### 3. Phone Booking Agent (Planned)
- **Conversational AI phone assistant** for appointment scheduling
- **Natural language understanding** for booking requests
- **Real-time availability checking**
- **Automated confirmations** via SMS/email

### 4. Reminder Calls (Planned)
- **Automated appointment reminders** via phone calls
- **Customizable reminder schedules** (24hr, 1hr before)
- **Natural voice interactions** using ElevenLabs TTS

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     AwwScribe Frontend                       │
│                    (Next.js 16 / React 19)                   │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
┌──────────────────────────┐    ┌──────────────────────────┐
│   ElevenLabs Scribe v2   │    │   Google Vertex AI       │
│   (Speech-to-Text)       │    │   (Gemini 2.0 Flash)     │
│                          │    │                          │
│ • Medical terminology    │    │ • SOAP note generation   │
│ • Sub-100ms latency      │    │ • Medical entity NER     │
│ • VAD segmentation       │    │ • Structured output      │
└──────────────────────────┘    └──────────────────────────┘
```

### Component Architecture

```typescript
// Live Scribe Component (Implemented)
components/live-scribe.tsx
  ├─ ElevenLabs Scribe v2 SDK integration
  ├─ Real-time transcript display
  ├─ Patient context management
  └─ SOAP generation trigger

// API Routes (Implemented)
app/api/scribe-token/route.ts     // Generate single-use tokens
app/api/generate-soap/route.ts    // Gemini SOAP generation

// API Routes (Placeholder)
app/api/check-availability/route.ts   // Future: Calendar integration
app/api/book-appointment/route.ts     // Future: Appointment booking
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (with npm or pnpm)
- **ElevenLabs API Key** ([Get it here](https://elevenlabs.io/app/settings/api-keys))
- **Google Cloud Project** with Vertex AI API enabled
- **Google Cloud Service Account** JSON key file

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/aww_scribe.git
   cd aww_scribe
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local`:
   ```env
   # ElevenLabs API Key (server-side only)
   ELEVENLABS_API_KEY=sk_your_elevenlabs_api_key_here

   # Google Cloud Configuration
   GOOGLE_CLOUD_PROJECT_ID=your_gcp_project_id
   GOOGLE_CLOUD_LOCATION=us-central1

   # Path to service account JSON key
   GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json

   # Future: Phone Booking Agent
   NEXT_PUBLIC_ELEVENLABS_AGENT_ID=agent_your_agent_id_here
   ```

4. **Set up Google Cloud credentials**

   Download your service account key:
   1. Go to [Google Cloud Console](https://console.cloud.google.com)
   2. Navigate to **IAM & Admin → Service Accounts**
   3. Create or select a service account
   4. Click **Keys → Add Key → Create New Key → JSON**
   5. Save as `service-account-key.json` in project root

   **Important:** `service-account-key.json` is in `.gitignore` - never commit this file!

5. **Enable required Google Cloud APIs**
   ```bash
   gcloud services enable aiplatform.googleapis.com
   ```

6. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Recording an Appointment

1. **Enter patient information** (or use demo patient Luna)
2. **Click "Start Listening"** to begin ambient transcription
3. **Speak naturally** with the pet owner during the appointment
4. **Watch real-time transcript** appear as you speak
5. **Click "Stop Listening"** when the appointment is complete
6. **Click "Generate SOAP Note"** to create structured documentation
7. **Copy to clipboard** and paste into your practice management system

### Example Transcript

```
Dr. Smith: Hi! What brings Luna in today?

Owner: She's been limping on her right front leg for about three days.
It started after we went to the dog park. She doesn't want to put
weight on it.

Dr. Smith: Let me examine that leg. Luna, can you stand for me?
I'm feeling some swelling around the carpus. Does this hurt?
Any yelping or crying at home?

Owner: She yelped once when she first hurt it, but since then she's
been quiet, just not using the leg much.

Dr. Smith: Her vitals look good - temperature is 101.8, heart rate
is 110. I think this is a soft tissue injury, likely a sprain.
Let's start with rest and an anti-inflammatory. I'm prescribing
Carprofen, 75mg twice daily for 7 days. Keep her calm, no running
or jumping. If she's not better in a week, we'll do X-rays.
```

### Generated SOAP Note

```json
{
  "subjective": "Luna, a 4-year-old Golden Retriever, presents with a
  3-day history of right front leg lameness following a visit to the
  dog park. Owner reports reluctance to bear weight and initial yelping
  when injury occurred.",

  "objective": "T: 101.8°F, HR: 110 bpm. Physical exam reveals swelling
  around the right carpus. Patient shows pain on palpation. Otherwise
  bright, alert, responsive.",

  "assessment": "Soft tissue injury of right front limb, likely carpal
  sprain. No radiographic evidence of fracture indicated at this time.",

  "plan": "1. Carprofen 75mg PO BID x 7 days\n2. Strict rest - no running
  or jumping\n3. Recheck in 7 days if no improvement\n4. Consider
  radiographs if lameness persists\n5. Client education provided on
  activity restriction",

  "vitals": {
    "temperature": "101.8°F",
    "heartRate": "110 bpm",
    "respiratoryRate": null,
    "weight": "65 lbs"
  },

  "chiefComplaint": "Right front leg lameness x 3 days",
  "diagnosis": "Carpal sprain, soft tissue injury"
}
```

## 📁 Project Structure

```
aww_scribe/
├── app/
│   ├── api/
│   │   ├── scribe-token/route.ts        # ElevenLabs token generation
│   │   ├── generate-soap/route.ts       # Gemini SOAP generation
│   │   ├── check-availability/route.ts  # [Placeholder] Calendar API
│   │   └── book-appointment/route.ts    # [Placeholder] Booking API
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                          # Main app page
├── components/
│   ├── ui/                               # shadcn/ui components
│   ├── live-scribe.tsx                   # Main scribe component
│   └── phone-booking-agent.tsx           # [Placeholder] Phone agent
├── lib/
│   ├── elevenlabs.ts                     # ElevenLabs config
│   └── utils.ts
├── archive/
│   └── old-conversational-approach/      # Deprecated code
├── .env.example                          # Environment template
├── .env.local                            # Your local config (gitignored)
├── service-account-key.json              # Google Cloud key (gitignored)
└── package.json
```

## 🔧 Configuration

### ElevenLabs Scribe v2 Settings

Audio configuration in `components/live-scribe.tsx`:

```typescript
const scribe = useScribe({
  modelId: 'scribe_v2_realtime',
  onPartialTranscript: handlePartialTranscript,
  onCommittedTranscript: handleCommittedTranscript,
  onError: handleError,
})

await scribe.connect({
  token: singleUseToken,
  microphone: {
    echoCancellation: true,
    noiseSuppression: true,
  },
  languageCode: 'en',
  audioFormat: 'pcm_16000',
  commitStrategy: 'vad',  // Voice Activity Detection
  vadSilenceThresholdSecs: 2.0,  // 2 seconds of silence commits
  vadThreshold: 0.4,
})
```

### Google Gemini Settings

Model configuration in `app/api/generate-soap/route.ts`:

```typescript
const model = vertexAI.getGenerativeModel({
  model: 'gemini-2.0-flash-exp',
  generationConfig: {
    temperature: 0.3,  // Lower = more consistent medical docs
    maxOutputTokens: 2048,
    topP: 0.95,
  },
})
```

## 💰 Cost Estimates

### Per 10-Minute Appointment

| Service | Usage | Cost |
|---------|-------|------|
| **ElevenLabs Scribe v2** | 10 minutes | ~$0.033 |
| **Google Gemini 2.0 Flash** | ~2K input + 1K output tokens | ~$0.000029 |
| **Total per appointment** | | **~$0.033** |

### Monthly Estimates

- **10 appointments/day** = ~$10/month
- **30 appointments/day** = ~$30/month
- **100 appointments/day** = ~$100/month

*Prices as of December 2024. Check current pricing at [ElevenLabs](https://elevenlabs.io/pricing) and [Google Cloud](https://cloud.google.com/vertex-ai/pricing).*

## 🎓 How It Works

### 1. Authentication Flow

```typescript
// Client requests a single-use token
GET /api/scribe-token
  → Server calls ElevenLabs API
  → Returns 15-minute expiring token
  → Client uses token to connect WebSocket
```

### 2. Transcription Flow

```typescript
// Real-time audio streaming
Client (LiveScribe)
  → getUserMedia() // Get microphone access
  → scribe.connect(token) // Establish WebSocket
  → scribe.startRecording() // Stream audio
  → onPartialTranscript() // Interim results (streaming)
  → onCommittedTranscript() // Final segments (on VAD silence)
```

### 3. SOAP Generation Flow

```typescript
// AI-powered documentation
POST /api/generate-soap
  {
    transcript: "full appointment text",
    patientName: "Luna",
    patientBreed: "Golden Retriever",
    ...
  }
  → Google Gemini processes with medical prompt
  → Extracts entities (vitals, diagnoses, meds)
  → Structures into SOAP format
  → Returns JSON with all sections
```

## 🔐 Security Best Practices

### Environment Variables
- ✅ **DO:** Use `ELEVENLABS_API_KEY` (server-side only, no `NEXT_PUBLIC_` prefix)
- ✅ **DO:** Generate single-use tokens with 15-minute expiration
- ❌ **DON'T:** Expose API keys to client-side code

### Service Account Key
- ✅ **DO:** Store `service-account-key.json` locally only
- ✅ **DO:** Add to `.gitignore`
- ❌ **DON'T:** Commit to version control
- ❌ **DON'T:** Share in public repositories

### Production Deployment
- Use environment variable injection (Vercel, Railway, etc.)
- Use Google Cloud Workload Identity for GKE/Cloud Run
- Implement proper CORS policies
- Add request rate limiting
- Enable API usage monitoring

## 🧪 Development

### Running Tests
```bash
npm test
# or
pnpm test
```

### Building for Production
```bash
npm run build
npm run start
```

### Linting
```bash
npm run lint
```

## 📚 Documentation

- [ElevenLabs Scribe v2 Docs](https://elevenlabs.io/docs/product/scribe)
- [ElevenLabs React SDK](https://www.npmjs.com/package/@elevenlabs/react)
- [Google Vertex AI Docs](https://cloud.google.com/vertex-ai/docs)
- [Gemini API Reference](https://ai.google.dev/api/rest)

## 🛣️ Roadmap

- [x] Live ambient transcription with Scribe v2
- [x] SOAP note generation with Gemini
- [x] Real-time transcript display
- [x] Copy-to-clipboard functionality
- [ ] Phone booking agent integration
- [ ] Automated reminder calls
- [ ] Multi-user support
- [ ] Practice management system integrations (Cornerstone, ezyVet, etc.)
- [ ] Mobile app (React Native)
- [ ] HIPAA compliance features
- [ ] Analytics dashboard

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **ElevenLabs** for the amazing Scribe v2 speech-to-text API
- **Google Cloud** for Vertex AI and Gemini models
- **V0 by Vercel** for the initial UI scaffolding
- **shadcn/ui** for the beautiful component library

## 📧 Support

- **Issues:** [GitHub Issues](https://github.com/your-org/aww_scribe/issues)
- **Email:** support@awwscribe.com
- **Documentation:** [https://docs.awwscribe.com](https://docs.awwscribe.com)

---

Built with ❤️ for veterinarians who care about their patients and their time.
