import { useState, useMemo } from 'react'
import { useEvents } from '../hooks/useEvents'
import { useLang } from '../context/LanguageContext'
import { t } from '../i18n/index'
import CalendarGrid from '../components/CalendarGrid'
import EventFormModal from '../components/EventFormModal'
import UpcomingEvents from '../components/UpcomingEvents'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function addDays(iso, n) {
  const d = new Date(iso)
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

export default function CalendarPage() {
  const { events, addEvent, deleteEvent } = useEvents()
  const { lang } = useLang()
  const today = todayISO()

  const [viewYear,  setViewYear]  = useState(() => new Date().getFullYear())
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth())
  const [selected,  setSelected]  = useState(today)
  const [showModal, setShowModal] = useState(false)

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }
  function handleSelectDay(iso) { setSelected(iso); setShowModal(true) }

  const eventDates = useMemo(() => new Set(events.map(e => e.date)), [events])

  const selectedDayEvents = useMemo(
    () => events
      .filter(e => e.date === selected)
      .sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99')),
    [events, selected]
  )

  const upcomingEnd = addDays(today, 7)
  const upcomingEvents = useMemo(
    () => events
      .filter(e => e.date >= today && e.date <= upcomingEnd)
      .sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || '')),
    [events, today, upcomingEnd]
  )

  const TYPE_STYLES = {
    task:  'bg-amber-100 text-amber-700',
    event: 'bg-violet-100 text-violet-700',
  }

  return (
    <div className="px-4 pt-8 pb-24">
      <header className="mb-6">
        <h1 className="text-2xl font-medium text-neutral-800 tracking-tight">
          {t('calendar.title', lang)}
        </h1>
      </header>

      {/* Calendar grid */}
      <div className="bg-white rounded-2xl shadow-sm px-4 py-5 mb-6">
        <CalendarGrid
          year={viewYear}
          month={viewMonth}
          today={today}
          selected={selected}
          eventDates={eventDates}
          onSelectDay={handleSelectDay}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
        />
      </div>

      {/* Selected day events */}
      {selectedDayEvents.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">
            {selected === today ? t('calendar.today', lang) : selected}
          </h2>
          <ul className="space-y-2">
            {selectedDayEvents.map(ev => (
              <li key={ev.id}
                  className="flex items-start gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-800 truncate">{ev.title}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium
                                      ${TYPE_STYLES[ev.type] ?? TYPE_STYLES.event}`}>
                      {t(`calendar.type_${ev.type}`, lang)}
                    </span>
                  </div>
                  {ev.time && (
                    <p className="mt-0.5 text-xs text-neutral-400">{ev.time}</p>
                  )}
                  {ev.notes && (
                    <p className="mt-1 text-xs text-neutral-500 line-clamp-2">{ev.notes}</p>
                  )}
                </div>
                <button
                  onClick={() => deleteEvent(ev.id)}
                  aria-label={t('calendar.aria_delete', lang)}
                  className="flex-shrink-0 text-neutral-300 hover:text-red-400 transition-colors mt-0.5"
                >
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6"
                          strokeLinecap="round" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Upcoming events */}
      <div>
        <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">
          {t('calendar.upcoming_heading', lang)}
        </h2>
        <UpcomingEvents events={upcomingEvents} onDelete={deleteEvent} />
      </div>

      {showModal && (
        <EventFormModal
          initialDate={selected}
          onSave={addEvent}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
