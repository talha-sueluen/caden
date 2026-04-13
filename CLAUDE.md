# CLAUDE.md — Caden

This file contains instructions and project context for the AI assistant (Claude Code) building this project.

---

## Project Summary

**Caden** is a **Progressive Web App (PWA)** combining a daily/weekly task planner with a full calendar.
Designed for a single user — multi-user support, authentication, and backend are **out of scope for now.**

---

## Core Features

### 1. Task Management
- Add, edit, and delete daily tasks
- Mark tasks as complete / incomplete
- Weekly task overview

### 2. Calendar & Events
- Full calendar view (month, week, day)
- Add future events with a title, date, time, and optional notes
- Events are visually distinct from daily tasks in the UI
- Upcoming events shown in a sidebar or dedicated section

### 3. Escalating Notifications — Task Mode (full intensity)

Applied when the item is a **task** (something that must be done).

| Time remaining | Frequency | Interval |
|---|---|---|
| 2 weeks away | Every 3 days | ~1 notification / 3 days |
| 1 week away | Once a day | ~1 / day |
| 3 days away | 3 times a day | ~1 / 8 hours |
| 2 days away | 6 times a day | ~1 / 4 hours |
| 1 day away | 12 times a day | ~1 / 2 hours |
| Within 12 hours | 24 times a day | ~1 / hour |
| Passed without completion | Stops automatically | — |

### 4. Escalating Notifications — Event Mode (light)

Applied when the item is a **calendar event** (something to be aware of, not necessarily acted upon).
Intentionally minimal — just enough to not forget.

| Time remaining | Frequency |
|---|---|
| 2 weeks away | Every 3 days |
| 3 days away | Once a day |
| Passed | Stops automatically |

**Implementation note:** The `type` field on each item (`"task"` or `"event"`) determines which notification schedule is applied. The Service Worker reads this field when scheduling notifications.

- All notifications run via Service Worker (active even when the app is closed)
- Notification permission is requested on first launch

### 5. Aggressive Task Notifications
- If incomplete tasks exist: push notification **every 5 minutes**
- Stops automatically when the task is marked complete
- Separate from event notifications — both can run simultaneously

### 6. AI Assistant (Weekly Planning)
- User inputs their weekly to-do list as free text
- Uses Anthropic API (`claude-sonnet-4-20250514`) + web search tool
- AI researches each task and assigns a **difficulty score (1–5)** with a short justification
- Proposes a **draft weekly plan** balancing difficulty across days
- User can approve, edit, or reset the draft
- Approved draft is added to the task list

### 7. Language Support
- Default language: **Turkish (tr)**
- Second language: **German (de)**
- Language is selected in the Settings screen and saved to `localStorage`
- All UI strings live in a single `i18n` object — hardcoded Turkish strings are not allowed

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (Vite) |
| Styling | Tailwind CSS |
| PWA | `vite-plugin-pwa` |
| Notifications | Web Notifications API + Service Worker |
| Calendar | `react-big-calendar` or custom (TBD) |
| AI | Anthropic API (`claude-sonnet-4-20250514`) |
| Data | `localStorage` (no backend, no DB) |
| Deploy | Vercel or Netlify |

---

## Project Structure

```
/
├── public/
│   └── icons/                  # PWA icons (192x192, 512x512)
├── src/
│   ├── components/             # UI components
│   ├── pages/                  # Main pages (Today, Week, Calendar, Settings)
│   ├── hooks/                  # Custom React hooks
│   ├── services/
│   │   ├── ai.js               # Anthropic API calls
│   │   ├── notifications.js    # Service Worker & notification scheduling
│   │   └── storage.js          # localStorage CRUD
│   ├── i18n/
│   │   └── index.js            # Turkish and German translation strings
│   ├── App.jsx
│   └── main.jsx
├── CLAUDE.md                   # This file
├── .env.example                # VITE_ANTHROPIC_API_KEY=
└── vite.config.js
```

---

## Data Model (localStorage)

```js
// Tasks
tasks: [
  {
    id: string,           // crypto.randomUUID()
    title: string,
    date: string,         // "YYYY-MM-DD"
    completed: boolean,
    difficulty: number,   // 1–5, assigned by AI (null if not yet scored)
    createdAt: string,    // ISO timestamp
  }
]

// Calendar events
events: [
  {
    id: string,           // crypto.randomUUID()
    title: string,
    date: string,         // "YYYY-MM-DD"
    time: string,         // "HH:MM" (optional)
    notes: string,        // optional
    type: "task" | "event", // determines notification intensity schedule
    createdAt: string,    // ISO timestamp
  }
]

// Settings
settings: {
  language: "tr" | "de",
  notificationsEnabled: boolean,
  apiKey: string,         // Anthropic API key — entered by user, stored locally only
}

// Unsaved AI draft plan (temporary until approved)
draftPlan: {
  weekOf: string,         // "YYYY-MM-DD" (Monday of the week)
  tasks: Task[],
  generatedAt: string,
}
```

---

## Notification Logic — Important Details

- Notification scheduling happens in the **Service Worker**, not in React components
- On every app open, re-evaluate all upcoming events and reschedule notifications accordingly
- Use `setTimeout` / `setInterval` inside the Service Worker for scheduling
- Each event's notification schedule is recalculated based on `Date.now()` vs `event.date + event.time`
- Task notifications (every 5 min) and event escalation notifications are **independent systems**
- When an event's date/time passes, cancel all pending notifications for that event

---

## AI Integration — Rules

- API key is entered by the user in the Settings screen — never hardcoded or committed
- Show a loading indicator during API calls
- On error (rate limit, network failure), display a message in Turkish or German depending on active language
- AI-assigned difficulty score and justification are shown on the task card
- Web search tool must be enabled — required for AI to research tasks

---

## UI Design Rules

- **Color palette:** Minimal colors, not lifeless. Neutral base (white/gray tones), one accent color (e.g. purple or teal). Completed tasks fade out, pending tasks stand out.
- **Typography:** Clean and readable. Two font weights only (regular + medium).
- **Information density:** Don't show everything at once. Today's tasks front and center, weekly/calendar views on separate tabs/pages.
- **Notifications:** Disruptive at OS level, calm in the UI — the interface itself stays quiet.
- **Animations:** Minimal. A small transition on task completion is enough — no bouncing or flashing.
- **Mobile-first:** All components designed for mobile first, desktop is secondary.

---

## Build Phases (in order)

1. **Core UI** — task add/list/complete, localStorage, basic layout
2. **Calendar & Events** — calendar view, event creation, event list
3. **PWA & Notifications** — manifest, Service Worker, aggressive task notifications, escalating event notifications
4. **AI Assistant** — Anthropic API integration, difficulty scoring, draft weekly plan
5. **Language Support** — i18n infrastructure, Turkish/German toggle

> Do not start a new phase until the current phase is working and stable.

---

## Out of Scope (for now)

- User accounts / authentication
- Cloud sync or remote database
- Sharing with other users
- Native iOS / Android app
- Multi-user or team features
- Any framework other than React PWA
