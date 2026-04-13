import { useTasks } from '../hooks/useTasks'
import { useLang } from '../context/LanguageContext'
import { t, LOCALE_MAP } from '../i18n/index'
import AddTaskForm from '../components/AddTaskForm'
import TaskList from '../components/TaskList'

function weekdayLabel(locale) {
  return new Date().toLocaleDateString(locale, { weekday: 'long' })
}

function dateLabel(locale) {
  return new Date().toLocaleDateString(locale, { month: 'long', day: 'numeric' })
}

export default function TodayPage() {
  const { tasks, addTask, toggleTask, deleteTask } = useTasks()
  const { lang } = useLang()
  const locale = LOCALE_MAP[lang] ?? 'tr-TR'
  const pendingCount = tasks.filter(tk => !tk.completed).length
  const doneCount = tasks.length - pendingCount
  const progress = tasks.length > 0 ? (doneCount / tasks.length) * 100 : 0

  return (
    <div className="pb-24">
      {/* Hero header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-violet-500 to-violet-700
                         px-6 pt-12 pb-8 rounded-b-[2.5rem] mb-6
                         shadow-[0_8px_32px_rgba(124,58,237,0.28)]">
        {/* Decorative circles */}
        <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -right-2 top-16 w-24 h-24 rounded-full bg-white/[0.07] pointer-events-none" />

        <p className="text-sm font-medium text-violet-200 mb-0.5 capitalize">
          {weekdayLabel(locale)}
        </p>
        <h1 className="text-3xl font-semibold text-white tracking-tight leading-tight">
          {t('today.title', lang)}
        </h1>
        <p className="mt-0.5 text-sm text-violet-200">{dateLabel(locale)}</p>

        {/* Integrated progress bar */}
        {tasks.length > 0 && (
          <div className="mt-5">
            <div className="flex justify-between text-xs text-violet-200 mb-1.5">
              <span>{pendingCount} {t('today.remaining', lang)}</span>
              <span>{doneCount} / {tasks.length} {t('today.done', lang)}</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </header>

      <div className="px-4">
        <div className="mb-5">
          <AddTaskForm onAdd={addTask} />
        </div>

        <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
      </div>
    </div>
  )
}
