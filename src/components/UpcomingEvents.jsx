import { useLang } from '../context/LanguageContext'
import { t, LOCALE_MAP } from '../i18n/index'

function formatDate(iso, locale) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function formatTime(time) {
  if (!time) return null
  const [h, min] = time.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(min).padStart(2, '0')} ${ampm}`
}

const TYPE_STYLES = {
  task:  'bg-amber-100 text-amber-700',
  event: 'bg-violet-100 text-violet-700',
}

export default function UpcomingEvents({ events, onDelete }) {
  const { lang } = useLang()
  const locale = LOCALE_MAP[lang] ?? 'tr-TR'

  if (events.length === 0) {
    return (
      <p className="text-center text-sm text-neutral-400 py-6">
        {t('calendar.upcoming_empty', lang)}
      </p>
    )
  }

  return (
    <ul className="space-y-2">
      {events.map(ev => (
        <li key={ev.id}
            className="flex items-start gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-neutral-800 truncate">
                {ev.title}
              </span>
              <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium
                                ${TYPE_STYLES[ev.type] ?? TYPE_STYLES.event}`}>
                {t(`calendar.type_${ev.type}`, lang)}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-neutral-400">
              {formatDate(ev.date, locale)}
              {ev.time && <span> · {formatTime(ev.time)}</span>}
            </p>
            {ev.notes && (
              <p className="mt-1 text-xs text-neutral-500 line-clamp-2">{ev.notes}</p>
            )}
          </div>

          <button
            onClick={() => onDelete(ev.id)}
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
  )
}
