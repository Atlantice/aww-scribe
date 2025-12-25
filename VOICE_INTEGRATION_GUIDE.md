# 🎙️ Voice Integration Guide - AwwScribe Hackathon

## Quick Start Commands

```bash
# Install dependencies
pnpm add @elevenlabs/react @google-cloud/aiplatform

# Set environment variables
cp .env.example .env.local
# Add your API keys to .env.local
```

## Environment Variables (.env.local)

```env
# ElevenLabs API Key (get from https://elevenlabs.io)
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=your_gcp_project_id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
```

## Architecture Overview

```
User speaks → Browser STT → Next.js API → Gemini → ElevenLabs SDK → Audio playback
```

**Key Components:**
1. `hooks/use-voice-conversation.ts` - Main voice conversation hook
2. `components/voice-conversation.tsx` - Voice UI component
3. `app/api/chat/route.ts` - Gemini integration endpoint

## File Structure

```
aww_scribe/
├── app/
│   └── api/
│       └── chat/
│           └── route.ts          # NEW: Gemini API endpoint
├── components/
│   ├── voice-conversation.tsx     # NEW: Voice UI component
│   └── detail-panel.tsx          # MODIFIED: Integrate voice
├── hooks/
│   └── use-voice-conversation.ts  # NEW: Voice conversation logic
└── lib/
    ├── elevenlabs.ts              # NEW: ElevenLabs config
    └── gemini.ts                  # NEW: Gemini client
```

## Implementation Steps

### 1. Backend: Gemini Integration

Create `lib/gemini.ts` for Vertex AI client initialization.

### 2. Backend: Chat API Route

Create `app/api/chat/route.ts` to handle conversation requests.

### 3. Frontend: Voice Conversation Hook

Create `hooks/use-voice-conversation.ts` for managing voice state.

### 4. Frontend: Voice UI Component

Create `components/voice-conversation.tsx` for voice controls.

### 5. Integration: Update Detail Panel

Modify `components/detail-panel.tsx` to use the voice component.

## Demo Checklist

- [ ] Microphone permission granted
- [ ] Speech recognition working (Chrome/Edge recommended)
- [ ] Gemini API responding
- [ ] ElevenLabs voice playing back
- [ ] Conversation context maintained
- [ ] Error states handled gracefully
- [ ] Visual feedback for recording/speaking states

## Latency Optimization Tips

1. **Preload ElevenLabs**: Initialize SDK early
2. **Stream responses**: Use Gemini streaming API if possible
3. **Optimize prompts**: Keep system prompts concise
4. **Cache voices**: Reuse ElevenLabs voice settings
5. **Browser choice**: Chrome/Edge have best STT

## Troubleshooting

**No microphone access:** Check browser permissions in chrome://settings/content/microphone

**CORS errors:** Ensure API routes are in `/app/api/` directory

**Gemini errors:** Verify service account permissions and quota

**No audio playback:** Check ElevenLabs API key and quota

**Speech recognition not working:** Use Chrome/Edge, not Firefox/Safari
