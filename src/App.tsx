import { AppProvider, useApp } from './contexts/AppContext'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { AdminPage } from './pages/AdminPage'

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
      <Router />
    </AppProvider>
  )
}

export default App
