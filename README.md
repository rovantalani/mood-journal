# 🌸 My Mood Journal

> *A little check-in for your heart.*

A cozy, personal mood-tracking app that helps you stay in tune with your emotions — one day at a time. Log how you're feeling, jot down a few words, and let Claude reflect back on your week with warmth and care.

---

## ✨ Features

| | |
|---|---|
| 😄 **Daily mood check-ins** | Pick from five moods and add a personal note |
| 📅 **Calendar view** | See your emotional journey painted across the month |
| 🔥 **Streak tracker** | Build a journaling habit, one day at a time |
| ✨ **AI Reflection** | Claude reads your last 7 entries and shares a thoughtful, human reflection |
| 💾 **Local-first** | Everything stays on your device — your feelings are yours |

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) and start journaling!

---

## 🤖 AI Reflection Setup

The AI Reflection feature uses the [Anthropic Claude API](https://console.anthropic.com/settings/keys). You have two ways to set it up:

**Option A — Environment variable (recommended)**

Copy `.env.example` to `.env` and add your key:
```
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

**Option B — In-app**

Click the ⚙️ gear icon in the AI Reflection card, paste your key, and hit Save. It's stored locally and never sent anywhere except Anthropic.

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── MoodPicker.tsx     # The five-mood selector
│   ├── CalendarView.tsx   # Monthly calendar with mood colors
│   └── AIReflection.tsx   # Claude-powered weekly reflection
├── utils/
│   ├── storage.ts         # LocalStorage helpers
│   └── streak.ts          # Streak calculation logic
├── types.ts               # Shared types & mood config
└── App.tsx                # Main layout & state
```

---

## 🛠️ Built With

- [React 18](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vitejs.dev)
- [Anthropic Claude API](https://docs.anthropic.com) (`claude-sonnet-4-6`)

---

## 📦 Build for Production

```bash
npm run build
```

Output goes to `dist/` — ready to deploy anywhere static files are served.

