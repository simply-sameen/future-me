import { useEffect } from 'react'
import { AppProvider, useApp } from './contexts/AppContext'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { AdminPage } from './pages/AdminPage'
import { supabase } from './lib/supabaseClient'
import { applyTheme, setGlow } from './lib/themes'

/** Fetches theme settings from Supabase on boot (before login) */
function ThemeLoader() {
  const { setAppTheme, setAppGlow } = useApp()

  useEffect(() => {
    async function loadTheme() {
      try {
        const { data } = await supabase
          .from('app_settings')
          .select('theme_preset, glow_enabled')
          .eq('id', 1)
          .single()

        if (data) {
          if (data.theme_preset) {
            applyTheme(data.theme_preset)
            setAppTheme(data.theme_preset)
          }
          if (data.glow_enabled === false) {
            setGlow(false)
            setAppGlow(false)
          }
        }
      } catch (err) {
        console.error('Failed to load theme settings:', err)
      }
    }
    loadTheme()
  }, [setAppTheme, setAppGlow])

  return null
}

function Router() {
  const { currentPage } = useApp()

  switch (currentPage) {
    case 'login':
      return <LoginPage />
    case 'dashboard':
      return <DashboardPage />
    case 'admin':
      return <AdminPage />
    default:
      return <LoginPage />
  }
}

export function App() {
  return (
    <AppProvider>
      <ThemeLoader />
      <Router />
    </AppProvider>
  )
}

export default App
