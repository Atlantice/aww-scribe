# 🚀 Hackathon Deployment Checklist

## Pre-Demo Setup (15 minutes)

### 1. Install Dependencies

```bash
npm add @google-cloud/vertexai
```

**Note:** ElevenLabs integration uses direct API calls (no SDK needed for our approach)

### 2. Environment Configuration

Create `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# ElevenLabs API Key
NEXT_PUBLIC_ELEVENLABS_API_KEY=sk_your_actual_key_here

# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
```

### 3. Google Cloud Setup

**A. Create Service Account**

```bash
# Create service account
gcloud iam service-accounts create aww-scribe-sa \
  --display-name="AwwScribe Hackathon Service Account"

# Grant Vertex AI permissions
gcloud projects add-iam-policy-binding aww-alpha \
  --member="serviceAccount:aww-scribe-sa@aww-alpha.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

# Download credentials
gcloud iam service-accounts keys create service-account-key.json \
  --iam-account=aww-scribe-sa@aww-alpha.iam.gserviceaccount.com
```

**B. Enable Required APIs**

```bash
gcloud services enable aiplatform.googleapis.com
```

### 4. ElevenLabs Setup

1. Go to https://elevenlabs.io/app/settings/api-keys
2. Create a new API key
3. Copy to `.env.local` as `NEXT_PUBLIC_ELEVENLABS_API_KEY`
4. Verify you have credits/quota available

### 5. Test Installation

```bash
# Start dev server
pnpm dev

# Open browser to http://localhost:3000
# Click the microphone button
# Allow microphone access
# Say something and verify:
#   - Speech recognition works
#   - Gemini responds
#   - Audio plays back
```

---

## Demo Day Checklist ✅

### Pre-Demo (30 min before)

- [ ] **Battery**: Laptop fully charged, charger nearby
- [ ] **Network**: Test internet connection (both WiFi and hotspot backup)
- [ ] **Browser**: Chrome/Edge open with localhost:3000 loaded
- [ ] **Microphone**: Test mic permissions granted in browser
- [ ] **Audio**: Test speakers/headphones volume at comfortable level
- [ ] **API Quotas**: Verify ElevenLabs and Vertex AI have sufficient quota
- [ ] **Server Running**: `pnpm dev` running in terminal
- [ ] **Backup Plan**: Have pre-recorded demo video ready

### During Demo

1. **Open app** - Already loaded at localhost:3000
2. **Click microphone button** - Large red button in center
3. **Say test phrase**: "Luna is a 4-year-old golden retriever who came in today with lameness in her right front leg"
4. **Listen to AI response** - Should ask a follow-up question
5. **Continue conversation** - Answer AI's questions naturally
6. **Show transcript** - Point out real-time transcript appearing
7. **Highlight features**:
   - Voice-driven, hands-free operation
   - Natural conversation flow
   - AI asks relevant clinical questions
   - Real-time transcription

### Talking Points

**Problem**: Veterinarians spend hours on documentation instead of patient care

**Solution**: Voice-driven AI assistant that:

- Uses natural conversation to gather clinical info
- Asks smart follow-up questions (Gemini)
- Generates structured SOAP notes
- Works hands-free during examinations

**Tech Stack** (if asked):

- Next.js + React for UI
- Browser Web Speech API for STT (zero latency)
- Google Vertex AI (Gemini) for conversational intelligence
- ElevenLabs for human-like voice responses
- Client-side architecture for sub-second response times

---

## Troubleshooting

### Microphone Not Working

```
Issue: "Speech recognition not supported"
Fix: Use Chrome or Edge browser (not Firefox/Safari)
```

```
Issue: No microphone access
Fix: Check chrome://settings/content/microphone
     Grant permissions, reload page
```

### No AI Response

```
Issue: API call failing
Fix: Check terminal for errors
     Verify GOOGLE_CLOUD_PROJECT_ID is correct
     Verify service account credentials exist
```

### No Audio Playback

```
Issue: ElevenLabs TTS failing
Fix: Check browser console for errors
     Verify NEXT_PUBLIC_ELEVENLABS_API_KEY is set
     Check ElevenLabs quota at elevenlabs.io
```

### Latency Issues

```
Issue: Slow responses
Fix: Use Gemini 2.0 Flash (not Pro)
     Check internet connection speed
     Consider using ElevenLabs Turbo v2.5 model (already configured)
```

---

## Performance Optimization Tips

1. **Pre-warm the API**: Make a test call before demo starts
2. **Keep prompts concise**: Current system prompt is optimized for speed
3. **Use fastest models**:
   - Gemini: `gemini-2.0-flash-exp` ✅ (configured)
   - ElevenLabs: `eleven_turbo_v2_5` ✅ (configured)
4. **Stable internet**: Use wired connection or reliable WiFi
5. **Close other apps**: Free up system resources

---

## Cost Monitoring

### Expected Demo Costs (10-minute demo)

- **ElevenLabs**: ~$0.10-0.20 (based on character count)
- **Vertex AI (Gemini)**: ~$0.01-0.05 (minimal with Flash model)
- **Total per demo**: < $0.30

### Free Tier Limits

- **ElevenLabs**: 10,000 characters/month free tier
- **Vertex AI**: $300 free credits for new GCP accounts

---

## Deployment to Production (Optional)

If you want to deploy publicly:

### Option 1: Vercel (Recommended for Hackathon)

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# (Don't commit .env.local!)
```

### Option 2: Google Cloud Run

```bash
# Build container
docker build -t aww-scribe .

# Push to GCP
gcloud builds submit --tag gcr.io/aww-alpha/aww-scribe

# Deploy
gcloud run deploy aww-scribe \
  --image gcr.io/aww-alpha/aww-scribe \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

**⚠️ Security Note**: For production, move API keys to server-side, implement auth, and use environment variables properly.

---

## Demo Script (30 seconds)

> "Meet AwwScribe - a voice-driven AI assistant for veterinarians. Watch as I document a patient visit entirely through conversation."

> [Click microphone] "Luna is a 4-year-old golden retriever with right front leg lameness for three days."

> [AI responds asking about severity/symptoms]

> "She's reluctant to put weight on it, slight swelling at the carpal joint."

> [AI asks about vitals]

> "Temperature 101.8, heart rate 92, respiratory rate 24."

> [AI summarizes and suggests next steps]

> "This is how veterinarians can focus on patients instead of keyboards. The AI asks relevant questions, maintains context, and will generate a complete SOAP note."

---

## Success Metrics

Track these during demo:

- ✅ Microphone activation < 1 second
- ✅ Speech recognition accuracy > 90%
- ✅ AI response time < 3 seconds
- ✅ TTS playback starts < 2 seconds
- ✅ Conversation feels natural (subjective but important!)

Good luck! 🎉
