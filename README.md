# Live Speech Transcription App

A real-time speech-to-text dashboard built with **Next.js**, **Nhost Auth**, and **Deepgram**.

**Features:**

- Email/password signup & login via Nhost
- Protected dashboard route
- Live microphone transcription streamed directly to Deepgram WebSocket
- Real-time transcript display with word counter, copy, and auto-scroll

**Built in under 60 minutes for an interview coding test.**

## Deploy

1. Set env vars in Vercel: `NEXT_PUBLIC_NHOST_SUBDOMAIN`, `NEXT_PUBLIC_NHOST_REGION`, `NEXT_PUBLIC_DEEPGRAM_API_KEY`
2. In Nhost dashboard → Settings → Authentication → Allowed Redirect URLs, add your production URL (e.g. `https://your-app.vercel.app`) and `http://localhost:3000` for local dev
