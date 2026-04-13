'use strict'

// ─── App-shell caching (makes the app installable & basic offline) ─────────────
const CACHE = 'caden-v1'

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.add('/')))
  self.skipWaiting()
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => clients.claim())
  )
})

self.addEventListener('fetch', e => {
  // Network-first for navigation; fall back to cached shell if offline
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(() => caches.match('/')))
  }
  // All other requests (assets, API) pass through normally
})

// ─── Shared constants ──────────────────────────────────────────────────────────
const HOUR = 60 * 60 * 1000
const DAY  = 24 * HOUR

// ─── System 1 — Aggressive task notifications (every 5 min) ───────────────────
// Fires as long as there are incomplete tasks dated today.
// Cleared and re-evaluated on every SYNC message.

let taskIntervalId = null

function syncTaskNotifications(tasks) {
  if (taskIntervalId !== null) {
    clearInterval(taskIntervalId)
    taskIntervalId = null
  }

  const today = new Date().toISOString().slice(0, 10)
  const hasPending = tasks.some(t => !t.completed && t.date === today)
  if (!hasPending) return

  taskIntervalId = setInterval(() => {
    self.registration.showNotification('Caden', {
      body: 'You have incomplete tasks for today.',
      icon: '/icons/icon-192.png',
      tag: 'caden-tasks',      // same tag so notifications replace each other
      renotify: true,
    })
  }, 5 * 60 * 1000)
}

// ─── System 2 — Escalating event notifications ─────────────────────────────────
// Each event gets its own recursive setTimeout chain.
// The interval shrinks as the event approaches, per CLAUDE.md schedule.
// Both systems run independently; neither affects the other.

const eventTimers = new Map()  // eventId → timeoutId

/**
 * Return the next notification delay (ms) for an item that is `msUntil` ms away.
 * Returns null when the item has passed or no more notifications are needed.
 *
 * Task schedule (full intensity):
 *   > 14 days → every 3 days
 *   > 7 days  → every day
 *   > 3 days  → every 8 hours
 *   > 2 days  → every 4 hours
 *   > 12 h    → every 2 hours
 *   > 0       → every hour
 *
 * Event schedule (light):
 *   > 14 days → every 3 days
 *   > 0       → every day
 */
function intervalFor(msUntil, type) {
  if (msUntil <= 0) return null

  if (type === 'task') {
    if (msUntil > 14 * DAY) return 3 * DAY
    if (msUntil >  7 * DAY) return DAY
    if (msUntil >  3 * DAY) return 8 * HOUR
    if (msUntil >  2 * DAY) return 4 * HOUR
    if (msUntil > 12 * HOUR) return 2 * HOUR
    return HOUR
  }

  // event mode — intentionally minimal
  if (msUntil > 14 * DAY) return 3 * DAY
  return DAY
}

function syncEventNotifications(events) {
  // Cancel all live timers before rebuilding
  eventTimers.forEach(id => clearTimeout(id))
  eventTimers.clear()

  const now = Date.now()
  for (const ev of events) {
    const ms = new Date(`${ev.date}T${ev.time || '00:00'}:00`).getTime()
    const msUntil = ms - now
    if (msUntil <= 0) continue          // already passed
    const delay = intervalFor(msUntil, ev.type)
    if (delay !== null) armEvent(ev, delay)
  }
}

function armEvent(ev, delay) {
  const id = setTimeout(() => {
    eventTimers.delete(ev.id)

    const ms = new Date(`${ev.date}T${ev.time || '00:00'}:00`).getTime()
    const msUntil = ms - Date.now()

    if (msUntil <= 0) return   // event passed while we were waiting — skip notification

    // Format the time string for the notification body
    let timeStr = ev.date
    if (ev.time) {
      const [h, m] = ev.time.split(':')
      const hour   = Number(h)
      const suffix = hour >= 12 ? 'PM' : 'AM'
      timeStr = `${hour % 12 || 12}:${m} ${suffix}`
    }

    self.registration.showNotification(`Caden — ${ev.title}`, {
      body: `${ev.type === 'task' ? 'Task' : 'Event'} on ${timeStr}`,
      icon: '/icons/icon-192.png',
      tag: `caden-ev-${ev.id}`,
      renotify: true,
    })

    // Schedule the next notification at the (now shorter) interval
    const next = intervalFor(msUntil, ev.type)
    if (next !== null) armEvent(ev, next)
  }, delay)

  eventTimers.set(ev.id, id)
}

// ─── Message handler — called by React on every app open ──────────────────────
// React sends { type: 'SYNC', tasks: [...], events: [...] } via postMessage.
// Both systems are fully rebuilt from the latest data on every sync.

self.addEventListener('message', e => {
  if (!e.data || e.data.type !== 'SYNC') return
  const { tasks = [], events = [] } = e.data
  syncTaskNotifications(tasks)
  syncEventNotifications(events)
})

// ─── Notification click — focus or open the app ────────────────────────────────
self.addEventListener('notificationclick', e => {
  e.notification.close()
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if ('focus' in c) return c.focus()
      }
      if (clients.openWindow) return clients.openWindow('/')
    })
  )
})
