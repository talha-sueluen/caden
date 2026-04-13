import { useState } from 'react'
import { loadSettings, saveSettings } from '../services/storage'
import { useLang } from '../context/LanguageContext'
import { t } from '../i18n/index'

export default function SettingsPage() {
  const { lang, setLang } = useLang()
  const [settings, setSettings] = useState(() => loadSettings())
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)

  function handleSave(e) {
    e.preventDefault()
    saveSettings(settings)
    setLang(settings.language)   // update context → entire UI re-renders in new language
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="px-4 pt-8 pb-24">
      <header className="mb-8">
        <h1 className="text-2xl font-medium text-neutral-800 tracking-tight">
          {t('settings.title', lang)}
        </h1>
      </header>

      <form onSubmit={handleSave} className="space-y-6">

        {/* Language */}
        <div className="rounded-2xl bg-white shadow-sm px-5 py-5 space-y-3">
          <label className="block text-sm font-medium text-neutral-700">
            {t('settings.language_label', lang)}
          </label>
          <div className="flex rounded-xl border border-neutral-200 overflow-hidden">
            {['tr', 'de'].map(l => (
              <button
                key={l}
                type="button"
                onClick={() => setSettings(s => ({ ...s, language: l }))}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors duration-150
                            ${settings.language === l
                              ? 'bg-violet-500 text-white'
                              : 'bg-white text-neutral-500 hover:bg-neutral-50'}`}
              >
                {t(`settings.language_${l}`, lang)}
              </button>
            ))}
          </div>
        </div>

        {/* API Key */}
        <div className="rounded-2xl bg-white shadow-sm px-5 py-5 space-y-3">
          <label className="block text-sm font-medium text-neutral-700">
            {t('settings.api_key_label', lang)}
          </label>

          <div className="flex gap-2">
            <input
              type={showKey ? 'text' : 'password'}
              value={settings.apiKey}
              onChange={e => setSettings(s => ({ ...s, apiKey: e.target.value }))}
              placeholder={t('settings.api_key_placeholder', lang)}
              autoComplete="off"
              spellCheck={false}
              className="flex-1 min-w-0 rounded-xl border border-neutral-200 bg-neutral-50
                         px-4 py-3 text-sm font-mono placeholder:text-neutral-400 placeholder:font-sans
                         focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white"
            />
            <button
              type="button"
              onClick={() => setShowKey(v => !v)}
              className="flex-shrink-0 rounded-xl border border-neutral-200 bg-white px-3 py-3
                         text-xs text-neutral-500 hover:bg-neutral-50 transition-colors"
            >
              {showKey ? t('settings.hide', lang) : t('settings.show', lang)}
            </button>
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed">
            {t('settings.api_key_hint', lang)}
          </p>
        </div>

        {/* Save */}
        <button
          type="submit"
          className={`w-full rounded-xl py-3 text-sm font-medium transition-colors duration-200
                      ${saved
                        ? 'bg-green-500 text-white'
                        : 'bg-violet-500 text-white hover:bg-violet-600 active:bg-violet-700'}`}
        >
          {saved ? t('settings.saved', lang) : t('settings.save', lang)}
        </button>
      </form>
    </div>
  )
}
