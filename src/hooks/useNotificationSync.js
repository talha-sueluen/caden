import { useEffect } from 'react'

/**
 * Registers the service worker, then pushes the latest tasks + events to it
 * on mount, on every tab-visibility restore, and on a 60-second interval.
 *
 * The SW handles all timer logic — this hook is just the data bridge.
 * Does NOT touch notification permission (that's handled by NotificationBanner).
 */
export function useNotificationSync() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    // Register SW once; subsequent calls are no-ops if already registered
    navigator.serviceWorker
      .register('/sw.js')
      .catch(err => console.warn('[caden] SW registration failed:', err))

    // Initial sync — waits for SW to be ready (handles first-install race)
    syncWithSW()

    // Re-sync when the user returns to the tab (covers "every app open")
    const onVisibility = () => {
      if (document.visibilityState === 'visible') syncWithSW()
    }
    document.addEventListener('visibilitychange', onVisibility)

    // Periodic re-sync so same-tab data changes (mark complete, add task)
    // propagate to the SW without requiring a page reload
    const timer = setInterval(syncWithSW, 60_000)

    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      clearInterval(timer)
    }
  }, [])
}

async function syncWithSW() {
  try {
    const reg = await navigator.serviceWorker.ready
    if (!reg.active) return

    const tasks  = JSON.parse(localStorage.getItem('caden_tasks')  || '[]')
    const events = JSON.parse(localStorage.getItem('caden_events') || '[]')

    reg.active.postMessage({ type: 'SYNC', tasks, events })
  } catch {
    // SW unavailable (private browsing, browser restriction, etc.)
  }
}
