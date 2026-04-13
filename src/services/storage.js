const TASKS_KEY = 'caden_tasks'
const EVENTS_KEY = 'caden_events'

export function loadTasks() {
  try {
    const raw = localStorage.getItem(TASKS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
}

export function loadEvents() {
  try {
    const raw = localStorage.getItem(EVENTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveEvents(events) {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
}

// ─── Settings ──────────────────────────────────────────────────────────────────
const SETTINGS_KEY = 'caden_settings'

const DEFAULT_SETTINGS = { language: 'tr', notificationsEnabled: true, apiKey: '' }

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

// ─── Draft Plan ────────────────────────────────────────────────────────────────
const DRAFT_KEY = 'caden_draft'

export function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveDraft(draft) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
}

export function clearDraft() {
  localStorage.removeItem(DRAFT_KEY)
}
