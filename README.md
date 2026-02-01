# Piggy Bank

A financial life simulator for kids ages 7-12. Built for ElleHacks 2026.

## What It Does

Kids manage a $100/month allowance over 12 simulated months, learning to:

- **Spend** on items and subscriptions
- **Save** to earn interest
- **Invest** with market ups and downs
- **Avoid scams** through realistic scenarios
- **Chat with Piggy** - an AI financial companion

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Google Gemini API (Piggy chat)
- ElevenLabs (Piggy voice)

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables

Create a `.env` file with:

```
VITE_GEMINI_API_KEY=your_gemini_key
VITE_ELEVENLABS_API_KEY=your_elevenlabs_key
```

The app works without these keys, but Piggy's AI features will be disabled.
