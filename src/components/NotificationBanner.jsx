import { useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { t } from '../i18n/index'

export default function NotificationBanner() {
  const [permission, setPermission] = useState(() => {
    if (typeof Notification === 'undefined') return 'granted'
    return Notification.permission
  })
  const { lang } = useLang()

  if (permission !== 'default') return null

  async function handleEnable() {
    const result = await Notification.requestPermission()
    setPermission(result)
  }

  return (
    <div className="mx-4 mt-4 mb-0 flex items-center gap-3 rounded-xl
                    border border-violet-100 bg-violet-50 px-4 py-3">
      <svg className="w-4 h-4 flex-shrink-0 text-violet-500" viewBox="0 0 24 24" fill="none">
        <path
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          stroke="currentColor" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>

      <p className="flex-1 text-xs text-violet-700 leading-snug">
        {t('notifications.banner_text', lang)}
      </p>

      <button
        onClick={handleEnable}
        className="flex-shrink-0 text-xs font-medium text-violet-600
                   hover:text-violet-800 transition-colors duration-150"
      >
        {t('notifications.banner_cta', lang)}
      </button>
    </div>
  )
}
