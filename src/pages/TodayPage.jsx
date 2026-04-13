import { useTasks } from '../hooks/useTasks'
import { useLang } from '../context/LanguageContext'
import { t, LOCALE_MAP } from '../i18n/index'
import AddTaskForm from '../components/AddTaskForm'
import TaskList from '../components/TaskList'

function todayLabel(locale) {
  return new Date().toLocaleDateString(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export default function TodayPage() {
  const { tasks, addTask, toggleTask, deleteTask } = useTasks()
  const { lang } = useLang()
  const locale = LOCALE_MAP[lang] ?? 'tr-TR'
  const pendingCount = tasks.filter(t => !t.completed).length

  return (
    <div className="px-4 pt-8 pb-24">
      <header className="mb-8">
        <h1 className="text-2xl font-medium text-neutral-800 tracking-tight">
          {t('today.title', lang)}
        </h1>
        <p className="mt-1 text-sm text-neutral-400">{todayLabel(locale)}</p>
      </header>

      {tasks.length > 0 && (
        <div className="mb-5">
          <div className="flex justify-between text-xs text-neutral-400 mb-1">
            <span>{pendingCount} {t('today.remaining', lang)}</span>
            <span>{tasks.length - pendingCount} / {tasks.length} {t('today.done', lang)}</span>
          </div>
          <div className="h-1 rounded-full bg-neutral-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-violet-500 transition-all duration-300"
              style={{ width: `${((tasks.length - pendingCount) / tasks.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="mb-6">
        <AddTaskForm onAdd={addTask} />
      </div>

      <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
    </div>
  )
}
