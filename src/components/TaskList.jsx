import { useLang } from '../context/LanguageContext'
import { t } from '../i18n/index'
import TaskItem from './TaskItem'

export default function TaskList({ tasks, onToggle, onDelete }) {
  const { lang } = useLang()

  if (tasks.length === 0) {
    return (
      <p className="text-center text-sm text-neutral-400 py-10">
        {t('tasks.empty', lang)}
      </p>
    )
  }

  const pending = tasks.filter(t => !t.completed)
  const done    = tasks.filter(t => t.completed)

  return (
    <div className="space-y-6">
      {pending.length > 0 && (
        <section>
          <ul className="space-y-2">
            {pending.map(task => (
              <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
            ))}
          </ul>
        </section>
      )}

      {done.length > 0 && (
        <section>
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-400">
            {t('tasks.done_heading', lang)} · {done.length}
          </h3>
          <ul className="space-y-2">
            {done.map(task => (
              <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
