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
                   placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-400"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className="rounded-xl bg-violet-500 px-5 py-3 text-sm font-medium text-white
                   transition-colors hover:bg-violet-600 active:bg-violet-700
                   disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {t('tasks.add_button', lang)}
      </button>
    </form>
  )
}
