import { useState } from 'react'
import { LanguageProvider } from './context/LanguageContext'
import BottomNav from './components/BottomNav'
import NotificationBanner from './components/NotificationBanner'
import TodayPage from './pages/TodayPage'
import CalendarPage from './pages/CalendarPage'
import AIPage from './pages/AIPage'
import SettingsPage from './pages/SettingsPage'
import { useNotificationSync } from './hooks/useNotificationSync'

function Inner() {
  const [tab, setTab] = useState('today')
  useNotificationSync()

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-lg">
        <NotificationBanner />
        {tab === 'today'    && <TodayPage />}
        {tab === 'calendar' && <CalendarPage />}
        {tab === 'ai'       && <AIPage onNavigateToSettings={() => setTab('settings')} />}
        {tab === 'settings' && <SettingsPage />}
      </div>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <Inner />
    </LanguageProvider>
  )
}
