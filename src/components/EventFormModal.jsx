import { useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { t } from '../i18n/index'

export default function EventFormModal({ initialDate, onSave, onClose }) {
  const [title, setTitle] = useState('')
  const [date,  setDate]  = useState(initialDate || '')
  const [time,  setTime]  = useState('')
  const [notes, setNotes] = useState('')
  const [type,  setType]  = useState('event')
  const { lang } = useLang()

  function handleSubmit(e) {
    e.preventDefault()
    onSave({ title, date, time, notes, type })
    onClose()
  }

  const inputCls = `w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3
                    text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white`

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-lg bg-white rounded-t-2xl px-5 pt-5 pb-8 shadow-xl
                      animate-slide-up">
        <div className="mx-auto mb-4 w-10 h-1 rounded-full bg-neutral-200" />

        <h2 className="text-base font-medium text-neutral-800 mb-5">
          {t('event_form.title', lang)}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">
              {t('event_form.field_title', lang)} <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={t('event_form.field_title_placeholder', lang)}
              autoFocus
              required
              className={`${inputCls} placeholder:text-neutral-400`}
            />
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">
                {t('event_form.field_date', lang)} <span className="text-red-400">*</span>
              </label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                     required className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">
                {t('event_form.field_time', lang)}{' '}
                <span className="text-neutral-300">{t('event_form.optional', lang)}</span>
              </label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)}
                     className={inputCls} />
            </div>
          </div>

          {/* Type toggle */}
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-2">
              {t('event_form.field_type', lang)}
            </label>
            <div className="flex rounded-xl border border-neutral-200 overflow-hidden">
              {['event', 'task'].map(tp => (
                <button
                  key={tp}
                  type="button"
                  onClick={() => setType(tp)}
                  className={`flex-1 py-2.5 text-sm font-medium transition-colors duration-150
                              ${type === tp
                                ? 'bg-violet-500 text-white'
                                : 'bg-white text-neutral-500 hover:bg-neutral-50'}`}
                >
                  {t(`event_form.type_${tp}`, lang)}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">
              {t('event_form.field_notes', lang)}{' '}
              <span className="text-neutral-300">{t('event_form.optional', lang)}</span>
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={t('event_form.field_notes_placeholder', lang)}
              rows={3}
              className={`${inputCls} placeholder:text-neutral-400 resize-none`}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-neutral-200 py-3 text-sm
                         font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
            >
              {t('event_form.cancel', lang)}
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !date}
              className="flex-1 rounded-xl bg-violet-500 py-3 text-sm font-medium text-white
                         hover:bg-violet-600 active:bg-violet-700 transition-colors
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t('event_form.save', lang)}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
