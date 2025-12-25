# 📁 AwwScribe Voice Integration - Project Structure

## Complete File Tree

```
aww_scribe/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          ⭐ NEW: Gemini API endpoint
│   ├── layout.tsx                (existing)
│   ├── page.tsx                  (existing - main app)
│   └── globals.css               (existing)
│
├── components/
│   ├── voice-conversation.tsx    ⭐ NEW: Voice UI component
│   ├── detail-panel.tsx          ✏️  MODIFIED: Integrated voice
│   ├── sidebar.tsx               (existing)
│   ├── visit-list.tsx            (existing)
│   └── ui/                       (existing V0 components)
│
├── hooks/
│   └── use-voice-conversation.ts ⭐ NEW: Voice conversation hook
│
├── lib/
│   ├── gemini.ts                 ⭐ NEW: Vertex AI client
│   ├── elevenlabs.ts             ⭐ NEW: ElevenLabs config
│   └── utils.ts                  (existing)
│
├── public/                       (existing - icons, etc.)
│
├── .env.example                  ⭐ NEW: Environment template
├── .env.local                    🔒 CREATE THIS (gitignored)
├── service-account-key.json      🔒 CREATE THIS (gitignored)
│
├── package.json                  (existing)
├── tsconfig.json                 (existing)
├── next.config.mjs               (existing)
│
├── README_VOICE.md               ⭐ NEW: Voice integration overview
├── VOICE_INTEGRATION_GUIDE.md    ⭐ NEW: Architecture details
├── DEPLOYMENT_CHECKLIST.md       ⭐ NEW: Setup & demo guide
├── PROJECT_STRUCTURE.md          ⭐ NEW: This file
└── setup.sh                      ⭐ NEW: Installation script

⭐ = New file
✏️  = Modified file
🔒 = You need to create (contains secrets)
```

## Key Files Explained

### Backend Implementation

#### `app/api/chat/route.ts`
- Next.js API route (runs server-side)
- Receives user message + conversation history
- Calls Vertex AI Gemini for AI response
- Returns AI text to frontend
- **Purpose**: Bridge between frontend and Gemini

#### `lib/gemini.ts`
- Vertex AI client configuration
- System instructions for veterinary context
- Conversation history management
- Error handling for API failures
- **Purpose**: Encapsulate all Gemini logic

#### `lib/elevenlabs.ts`
- Voice ID configurations
- Voice settings (stability, similarity)
- Different voice profiles (professional, conversational)
- **Purpose**: Centralized TTS configuration

### Frontend Implementation

#### `hooks/use-voice-conversation.ts`
- Web Speech API integration
- Speech recognition state management
- Conversation history tracking
- API calls to `/api/chat`
- Error state handling
- **Purpose**: All voice logic in one reusable hook

#### `components/voice-conversation.tsx`
- Voice control UI (microphone button, status indicators)
- ElevenLabs TTS playback
- Conversation history display
- Error message display
- Real-time transcript preview
- **Purpose**: Complete voice interaction UI

#### `components/detail-panel.tsx` (modified)
- Integrated `VoiceConversation` component
- Passes patient context (name, species, age, weight)
- Displays live transcript from voice input
- **Purpose**: Connect voice to existing app UI

### Documentation

#### `README_VOICE.md`
- Quick start guide
- Architecture overview
- Demo flow examples
- Customization tips
- **Audience**: First-time users

#### `VOICE_INTEGRATION_GUIDE.md`
- Technical architecture details
- Implementation rationale
- File structure
- Best practices
- **Audience**: Developers

#### `DEPLOYMENT_CHECKLIST.md`
- Step-by-step setup instructions
- Google Cloud configuration
- ElevenLabs setup
- Demo day preparation
- Troubleshooting guide
- **Audience**: Demo presenters

#### `PROJECT_STRUCTURE.md`
- Complete file tree
- File purpose explanations
- Integration points
- **Audience**: Onboarding developers

### Configuration

#### `.env.example`
- Template for environment variables
- Documentation for each variable
- **Action**: Copy to `.env.local` and fill in

#### `.env.local` (you create)
- Your actual API keys
- **Security**: Never commit this file

#### `service-account-key.json` (you create)
- Google Cloud service account credentials
- **Security**: Never commit this file

## Data Flow

### Voice Input → AI Response Flow

```
1. User clicks microphone button
   └─> hooks/use-voice-conversation.ts
       └─> Browser Web Speech API activated

2. User speaks
   └─> Speech → Text transcription
       └─> State updated in hook
           └─> UI shows live transcript

3. User stops (clicks button again)
   └─> Transcript sent to API
       └─> app/api/chat/route.ts
           └─> lib/gemini.ts
               └─> Vertex AI Gemini call
                   └─> AI response returned

4. AI response received
   └─> components/voice-conversation.tsx
       └─> ElevenLabs API call (TTS)
           └─> Audio blob generated
               └─> Audio playback in browser

5. Audio finishes
   └─> Automatically resume listening
       └─> Cycle repeats
```

## Integration Points

### How Voice Connects to Existing App

1. **Patient Context**
   - `detail-panel.tsx` knows current patient (Luna)
   - Passes patient info to `VoiceConversation` component
   - AI receives context in every request

2. **UI Integration**
   - Voice component replaces old recording controls
   - Fits seamlessly into existing design
   - Uses same styling (Tailwind classes)

3. **State Management**
   - Conversation state lives in `use-voice-conversation` hook
   - Can be lifted to parent if needed for SOAP generation
   - Transcript accessible for document generation

## Dependencies Added

```json
{
  "@google-cloud/vertexai": "^latest"
}
```

**Note**: ElevenLabs uses direct API calls, no SDK needed.

## Environment Variables

### Client-Side (NEXT_PUBLIC_*)
```env
NEXT_PUBLIC_ELEVENLABS_API_KEY=sk_xxx
```
- Accessible in browser
- ⚠️ For hackathon only - move server-side for production

### Server-Side
```env
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
```
- Only accessible in API routes
- Never exposed to browser

## Git Ignore Status

Already gitignored (safe):
- `.env.local`
- `service-account-key.json`
- `node_modules/`

Should commit:
- `.env.example` ✅
- All new `.ts` and `.tsx` files ✅
- All new `.md` files ✅
- `setup.sh` ✅

## Build Process

No changes needed to existing build process:
```bash
pnpm dev     # Development
pnpm build   # Production build
pnpm start   # Production server
```

## Testing Checklist

- [ ] `pnpm dev` starts without errors
- [ ] Can access http://localhost:3000
- [ ] Microphone button appears
- [ ] Click grants mic permission
- [ ] Speaking shows transcript
- [ ] Stopping sends to AI
- [ ] AI response plays as audio
- [ ] Conversation history displays
- [ ] Error states show properly

## Future Enhancements (Post-Hackathon)

Potential additions to consider:

1. **SOAP Note Generation**
   - Use conversation history
   - Extract vitals, symptoms, plan
   - Generate structured document

2. **Voice Command Support**
   - "Generate SOAP note"
   - "Start new visit"
   - "Repeat that"

3. **Multi-Language Support**
   - Change `recognition.lang` in hook
   - Support Spanish, French, etc.

4. **Conversation Persistence**
   - Save to database
   - Resume previous conversations
   - Search historical visits

5. **Real-Time Collaboration**
   - WebSocket for live updates
   - Multiple users viewing same visit
   - Shared voice sessions

---

Ready to start? Run:
```bash
bash setup.sh
```

Then follow [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for complete setup.
