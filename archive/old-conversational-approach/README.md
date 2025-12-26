# Old Conversational Approach (Deprecated)

This directory contains the original conversational voice implementation that has been replaced by the Scribe v2 architecture.

## What Was This?

The original implementation was a **conversational AI system** where:
- User spoke to the AI using Web Speech API (STT)
- Gemini responded with conversational dialogue
- ElevenLabs TTS read the AI's responses aloud
- Back-and-forth conversation to gather appointment information

## Why Was It Replaced?

The conversational approach was replaced with **ambient transcription** using ElevenLabs Scribe v2 because:

1. **Better UX for Medical Context**: Veterinarians want to speak naturally with pet owners, not have a conversation with AI
2. **Lower Latency**: Scribe v2 provides sub-100ms transcription vs. multi-second round-trip for conversation
3. **Medical Terminology**: Scribe v2 is optimized for medical vocabulary
4. **Simpler Architecture**: Passive listening + post-processing is simpler than managing conversation state
5. **Professional Demo**: Ambient scribe looks more professional for hackathon

## Archived Files

- `use-voice-conversation.ts` - React hook managing conversation state with Web Speech API
- `voice-conversation.tsx` - UI component with conversational interface
- `route.ts` - API endpoint for Gemini chat conversations

## New Architecture

See the main README.md for details on the current Scribe v2 + SOAP generation architecture.

---
Archived: December 2024
