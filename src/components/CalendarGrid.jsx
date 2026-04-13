import { useLang } from '../context/LanguageContext'
import { t, LOCALE_MAP } from '../i18n/index'

function isoDate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export default function CalendarGrid({ year, month, today, selected, eventDates, onSelectDay, onPrevMonth, onNextMonth }) {
  const { lang } = useLang()
  const locale = LOCALE_MAP[lang] ?? 'tr-TR'

  const dayHeaders = t('calendar.day_headers', lang)  // array of 7 short labels
  const firstDow   = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthLabel  = new Date(year, month, 1).toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric',
  })

  const cells = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onPrevMonth}
          aria-label={t('calendar.aria_prev', lang)}
          className="w-8 h-8 flex items-center justify-center rounded-lg
                     text-neutral-500 hover:bg-neutral-100 transition-colors"
        >
          <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <span className="text-sm font-medium text-neutral-800">{monthLabel}</span>

        <button
          onClick={onNextMonth}
          aria-label={t('calendar.aria_next', lang)}
          className="w-8 h-8 flex items-center justify-center rounded-lg
                     text-neutral-500 hover:bg-neutral-100 transition-colors"
        >
          <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {(Array.isArray(dayHeaders) ? dayHeaders : ['Su','Mo','Tu','We','Th','Fr','Sa']).map((d, i) => (
          <div key={i} className="text-center text-xs font-medium text-neutral-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} />

          const iso       = isoDate(year, month, day)
          const isToday   = iso === today
          const isSelected = iso === selected
          const hasEvent  = eventDates.has(iso)

          return (
            <button
              key={iso}
              onClick={() => onSelectDay(iso)}
              className={`relative mx-auto flex flex-col items-center justify-center
                          w-9 h-9 rounded-full text-sm transition-colors duration-100
                          ${isSelected
                            ? 'bg-violet-500 text-white'
                            : isToday
                              ? 'bg-violet-100 text-violet-700 font-medium'
                              : 'text-neutral-700 hover:bg-neutral-100'}`}
            >
              {day}
              {hasEvent && (
                <span className={`absolute bottom-1 w-1 h-1 rounded-full
                                  ${isSelected ? 'bg-white/70' : 'bg-violet-400'}`} />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
