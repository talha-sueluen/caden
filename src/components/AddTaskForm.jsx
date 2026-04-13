import { useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { t } from '../i18n/index'

export default function AddTaskForm({ onAdd }) {
  const [value, setValue] = useState('')
  const { lang } = useLang()

  function handleSubmit(e) {
    e.preventDefault()
    onAdd(value)
    setValue('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={t('tasks.add_placeholder', lang)}
        className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm
                   placeholder:text-neutral-400 ring-1 ring-transparent
                   focus:outline-none focus:border-violet-300 focus:ring-violet-200
                   shadow-[0_1px_3px_rgba(0,0,0,0.05)]
                   transition-shadow duration-150"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className="rounded-xl bg-violet-500 px-5 py-3 text-sm font-medium text-white
                   hover:bg-violet-600 active:bg-violet-700 active:scale-95
                   shadow-[0_2px_8px_rgba(124,58,237,0.35)]
                   transition-all duration-150
                   disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
      >
        {t('tasks.add_button', lang)}
      </button>
    </form>
  )
}
