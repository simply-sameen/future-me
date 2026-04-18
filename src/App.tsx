import { AppProvider, useApp } from './contexts/AppContext'
import { LandingPage } from './pages/LandingPage'
import { DashboardPage } from './pages/DashboardPage'
import { AdminPage } from './pages/AdminPage'

function Router() {
  const { currentPage } = useApp()

  switch (currentPage) {
    case 'landing':
      return <LandingPage />
    case 'dashboard':
      return <DashboardPage />
    case 'admin':
      return <AdminPage />
    default:
      return <LandingPage />
  }
}

export function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  )
}

export default App
