import { useLang } from '../context/LanguageContext'
import { t, LOCALE_MAP } from '../i18n/index'

const DAYS_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const DIFF_STYLES = {
  1: 'bg-green-100 text-green-700',
  2: 'bg-lime-100 text-lime-700',
  3: 'bg-amber-100 text-amber-700',
  4: 'bg-orange-100 text-orange-700',
  5: 'bg-red-100 text-red-700',
}

function DiffBadge({ score }) {
  return (
    <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium
                      ${DIFF_STYLES[score] ?? DIFF_STYLES[3]}`}>
      {score}/5
    </span>
  )
}

function shortDate(iso, locale) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(locale, { day: 'numeric', month: 'short' })
}

export default function DraftPlanView({ draft, onApprove, onReset, approving }) {
  const { lang } = useLang()
  const locale = LOCALE_MAP[lang] ?? 'tr-TR'
  const { tasks, plan, weekOf } = draft

  const taskMap = Object.fromEntries(tasks.map(tk => [tk.title, tk]))

  const dayDates = {}
  DAYS_ORDER.forEach((day, i) => {
    const d = new Date(weekOf + 'T00:00:00')
    d.setDate(d.getDate() + i)
    dayDates[day] = d.toISOString().slice(0, 10)
  })

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-neutral-700">
          {t('ai.draft_heading', lang)}
        </h2>
        <span className="text-xs text-neutral-400">
          {shortDate(weekOf, locale)} – {shortDate(dayDates['Sunday'], locale)}
        </span>
      </div>

      {/* Day cards */}
      {DAYS_ORDER.map(day => {
        const titles   = plan[day] ?? []
        const dayTasks = titles.map(title => taskMap[title]).filter(Boolean)
        const totalDiff = dayTasks.reduce((s, tk) => s + (tk.difficulty ?? 0), 0)

        if (titles.length === 0) return null

        return (
          <div key={day} className="rounded-2xl bg-white shadow-sm px-4 py-4">
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <span className="text-sm font-medium text-neutral-800">
                  {t(`calendar.days.${day}`, lang)}
                </span>
                <span className="ml-2 text-xs text-neutral-400">
                  {shortDate(dayDates[day], locale)}
                </span>
              </div>
              <span className="text-xs text-neutral-400">
                {t('ai.day_total', lang)}: {totalDiff}
              </span>
            </div>

            <ul className="space-y-3">
              {dayTasks.map((task, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <DiffBadge score={task.difficulty} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-800 leading-snug">{task.title}</p>
                    {task.justification && (
                      <p className="mt-0.5 text-xs text-neutral-400 leading-snug">
                        {task.justification}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )
      })}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onReset}
          disabled={approving}
          className="flex-1 rounded-xl border border-neutral-200 py-3 text-sm font-medium
                     text-neutral-600 hover:bg-neutral-50 transition-colors
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t('ai.reset', lang)}
        </button>
        <button
          onClick={onApprove}
          disabled={approving}
          className="flex-1 rounded-xl bg-violet-500 py-3 text-sm font-medium text-white
                     hover:bg-violet-600 active:bg-violet-700 transition-colors
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {approving ? '…' : t('ai.approve', lang)}
        </button>
      </div>
    </div>
  )
}
