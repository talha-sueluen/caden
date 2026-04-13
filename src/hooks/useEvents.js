import { useState, useEffect } from 'react'
import { loadEvents, saveEvents } from '../services/storage'

export function useEvents() {
  const [events, setEvents] = useState(() => loadEvents())

  useEffect(() => {
    saveEvents(events)
  }, [events])

  function addEvent({ title, date, time, notes, type }) {
    const trimmed = title.trim()
    if (!trimmed || !date) return
    setEvents(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: trimmed,
        date,
        time: time || '',
        notes: notes || '',
        type: type || 'event',
        createdAt: new Date().toISOString(),
      },
    ])
  }

  function deleteEvent(id) {
    setEvents(prev => prev.filter(e => e.id !== id))
  }

  return { events, addEvent, deleteEvent }
}
