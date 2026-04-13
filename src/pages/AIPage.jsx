import { useState, useEffect } from 'react'
import { loadSettings, loadTasks, saveTasks, loadDraft, saveDraft, clearDraft } from '../services/storage'
import { generateWeeklyPlan } from '../services/ai'
import DraftPlanView from '../components/DraftPlanView'
import { useLang } from '../context/LanguageContext'
import { t } from '../i18n/index'

const DAYS_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

/** Returns the upcoming Monday (or today if today is Monday) as YYYY-MM-DD */
function getNextMonday() {
  const d = new Date()
  const day = d.getDay() // 0=Sun, 1=Mon, …
  const daysUntil = day === 1 ? 0 : day === 0 ? 1 : 8 - day
  d.setDate(d.getDate() + daysUntil)
  return d.toISOString().slice(0, 10)
}

/** Classify API errors into i18n keys */
function errorKey(err) {
  if (!navigator.onLine || err.message === 'Failed to fetch') return 'error_network'
  if (err.status === 401 || err.message === 'authentication_error') return 'error_auth'
  if (err.status === 429 || err.message === 'rate_limit_error') return 'error_rate_limit'
  if (['invalid_json', 'invalid_structure', 'empty_response'].includes(err.message)) return 'error_parse'
  return 'error_generic'
}

export default function AIPage({ onNavigateToSettings }) {
  const [rawInput, setRawInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)       // translated string
  const [draft, setDraft] = useState(() => loadDraft())
  const [approving, setApproving] = useState(false)
  const [approved, setApproved] = useState(false)

  // Reload draft from storage when the tab becomes visible
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') setDraft(loadDraft())
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

  const { lang } = useLang()
  const settings = loadSettings()
  const hasKey = !!settings.apiKey?.trim()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!rawInput.trim() || loading) return
    setLoading(true)
    setError(null)

    try {
      const result = await generateWeeklyPlan(rawInput.trim(), settings.apiKey)
      const weekOf = getNextMonday()
      const newDraft = {
        weekOf,
        rawInput: rawInput.trim(),
        tasks: result.tasks,
        plan: result.plan,
        generatedAt: new Date().toISOString(),
      }
      saveDraft(newDraft)
      setDraft(newDraft)
      setRawInput('')
    } catch (err) {
      setError(t(`ai.${errorKey(err)}`, lang))
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    clearDraft()
    setDraft(null)
    setApproved(false)
  }

  function handleApprove() {
    if (!draft) return
    setApproving(true)

    const weekOf = draft.weekOf
    const taskMap = Object.fromEntries(draft.tasks.map(tk => [tk.title, tk]))

    const newTasks = []
    DAYS_ORDER.forEach((day, i) => {
      const dayDate = new Date(weekOf + 'T00:00:00')
      dayDate.setDate(dayDate.getDate() + i)
      const dateStr = dayDate.toISOString().slice(0, 10)

      for (const title of (draft.plan[day] ?? [])) {
        const info = taskMap[title]
        newTasks.push({
          id: crypto.randomUUID(),
          title,
          date: dateStr,
          completed: false,
          difficulty: info?.difficulty ?? null,
          createdAt: new Date().toISOString(),
        })
      }
    })

    const existing = loadTasks()
    saveTasks([...existing, ...newTasks])
    clearDraft()
    setDraft(null)
    setApproving(false)
    setApproved(true)
  }

  return (
    <div className="px-4 pt-8 pb-24">
      <header className="mb-6">
        <h1 className="text-2xl font-medium text-neutral-800 tracking-tight">
          {t('ai.title', lang)}
        </h1>
      </header>

      {/* No API key banner */}
      {!hasKey && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-5">
          <p className="text-sm font-medium text-amber-800 mb-1">
            {t('ai.no_key_heading', lang)}
          </p>
          <p className="text-sm text-amber-700 mb-4 leading-relaxed">
            {t('ai.no_key_body', lang)}
          </p>
          <button
            onClick={onNavigateToSettings}
            className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-medium text-white
                       hover:bg-amber-600 transition-colors"
          >
            {t('ai.no_key_cta', lang)}
          </button>
        </div>
      )}

      {/* Input form */}
      {hasKey && !draft && !approved && (
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <textarea
            value={rawInput}
            onChange={e => setRawInput(e.target.value)}
            placeholder={t('ai.placeholder', lang)}
            rows={6}
            disabled={loading}
            className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-4
                       text-sm placeholder:text-neutral-400 resize-none
                       focus:outline-none focus:ring-2 focus:ring-violet-400
                       disabled:opacity-50 disabled:cursor-not-allowed"
          />

          {/* Error message */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!rawInput.trim() || loading}
            className="w-full rounded-xl bg-violet-500 py-3 text-sm font-medium text-white
                       hover:bg-violet-600 active:bg-violet-700 transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Spinner />
                {t('ai.button_planning', lang)}
              </>
            ) : (
              <>
                <SparkleIcon />
                {t('ai.button_plan', lang)}
              </>
            )}
          </button>
        </form>
      )}

      {/* Approved toast */}
      {approved && (
        <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4
                        flex items-center gap-3">
          <svg className="w-5 h-5 text-green-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd" />
          </svg>
          <p className="text-sm text-green-700 font-medium">{t('ai.approved_toast', lang)}</p>
          <button
            onClick={() => { setApproved(false) }}
            className="ml-auto text-xs text-green-600 hover:text-green-800 transition-colors"
          >
            {/* back to input */}
            ✕
          </button>
        </div>
      )}

      {/* Draft plan */}
      {draft && (
        <DraftPlanView
          draft={draft}
          onApprove={handleApprove}
          onReset={handleReset}
          approving={approving}
        />
      )}
    </div>
  )
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

function SparkleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
      <path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.636 5.636l2.122 2.122m8.485 8.485 2.121 2.122M5.636 18.364l2.122-2.122m8.485-8.485 2.121-2.121"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
