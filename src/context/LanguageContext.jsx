import { createContext, useContext, useState } from 'react'
import { loadSettings } from '../services/storage'

const LangCtx = createContext({ lang: 'tr', setLang: () => {} })

/**
 * Wraps the app and provides the active language to all descendants.
 * SettingsPage calls setLang() when the user saves a new language choice
 * so the entire UI re-renders without a page reload.
 */
export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => loadSettings().language ?? 'tr')
  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>
}

/** Returns { lang, setLang } — call in any component that needs translated strings. */
export function useLang() {
  return useContext(LangCtx)
}
