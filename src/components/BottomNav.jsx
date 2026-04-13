import { useLang } from '../context/LanguageContext'
import { t } from '../i18n/index'

const TABS = [
  {
    id: 'today',
    labelKey: 'nav.today',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path d="M9 11l3 3 5-5" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" />
        <rect x="3" y="4" width="18" height="17" rx="3" stroke="currentColor"
              strokeWidth="1.8" />
        <path d="M8 2v3M16 2v3" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'calendar',
    labelKey: 'nav.calendar',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <rect x="3" y="4" width="18" height="17" rx="3" stroke="currentColor"
              strokeWidth="1.8" />
        <path d="M8 2v3M16 2v3" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" />
        <path d="M3 10h18" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="8" cy="16" r="1" fill="currentColor" />
        <circle cx="12" cy="16" r="1" fill="currentColor" />
        <circle cx="16" cy="16" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'ai',
    labelKey: 'nav.plan',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path d="M12 2l1.8 5.4L19.2 9l-5.4 1.8L12 16.2l-1.8-5.4L4.8 9l5.4-1.8L12 2z"
              stroke="currentColor" strokeWidth="1.8"
              strokeLinejoin="round" strokeLinecap="round" />
        <path d="M19 15l.9 2.7L22.6 18l-2.7.9L19 21.6l-.9-2.7L15.4 18l2.7-.9L19 15z"
              stroke="currentColor" strokeWidth="1.4"
              strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'settings',
    labelKey: 'nav.settings',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export default function BottomNav({ active, onChange }) {
  const { lang } = useLang()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50
                    bg-white/90 backdrop-blur-md border-t border-neutral-100
                    flex justify-around safe-area-inset-bottom
                    shadow-[0_-1px_12px_rgba(0,0,0,0.06)]">
      {TABS.map(tab => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex flex-col items-center gap-0.5 flex-1 py-3 text-xs font-medium
                        transition-colors duration-150
                        ${isActive ? 'text-violet-600' : 'text-neutral-400 hover:text-neutral-600'}`}
          >
            <span className={`flex items-center justify-center rounded-xl w-10 h-7
                              transition-colors duration-150
                              ${isActive ? 'bg-violet-100' : ''}`}>
              {tab.icon}
            </span>
            {t(tab.labelKey, lang)}
          </button>
        )
      })}
    </nav>
  )
}
