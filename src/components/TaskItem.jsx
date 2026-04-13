import { useLang } from '../context/LanguageContext'
import { t } from '../i18n/index'

export default function TaskItem({ task, onToggle, onDelete }) {
  const { lang } = useLang()

  return (
    <li className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm
                   transition-opacity duration-200"
        style={{ opacity: task.completed ? 0.5 : 1 }}
    >
      <button
        onClick={() => onToggle(task.id)}
        aria-label={task.completed
          ? t('tasks.aria_incomplete', lang)
          : t('tasks.aria_complete', lang)}
        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
                    transition-colors duration-150
                    ${task.completed
                      ? 'border-violet-500 bg-violet-500'
                      : 'border-neutral-300 bg-white hover:border-violet-400'}`}
      >
        {task.completed && (
          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <span
        className={`flex-1 text-sm leading-snug
                    ${task.completed ? 'line-through text-neutral-400' : 'text-neutral-800'}`}
      >
        {task.title}
      </span>

      <button
        onClick={() => onDelete(task.id)}
        aria-label={t('tasks.aria_delete', lang)}
        className="flex-shrink-0 text-neutral-300 hover:text-red-400 transition-colors duration-150"
      >
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6"
                strokeLinecap="round" />
        </svg>
      </button>
    </li>
  )
}
