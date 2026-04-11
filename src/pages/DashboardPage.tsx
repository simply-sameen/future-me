import { GlobalLayout } from '../components/layout/GlobalLayout'
import { MomentumModal } from '../components/modals/MomentumModal'
import { GoalsView } from '../components/dashboard/GoalsView'
import { RemindersView } from '../components/dashboard/RemindersView'
import { CalendarView } from '../components/dashboard/CalendarView'
import { AnalyticsView } from '../components/dashboard/AnalyticsView'
import { AIAssistantView } from '../components/dashboard/AIAssistantView'
import { useApp } from '../contexts/AppContext'

export function DashboardPage() {
  const { dashboardTab } = useApp()

  const renderView = () => {
    switch (dashboardTab) {
      case 'goals': return <GoalsView />
      case 'reminders': return <RemindersView />
      case 'calendar': return <CalendarView />
      case 'analytics': return <AnalyticsView />
      case 'ai-assistant': return <AIAssistantView />
      default: return <RemindersView />
    }
  }

  return (
    <>
      <GlobalLayout>
        {renderView()}
      </GlobalLayout>
      <MomentumModal />
    </>
  )
}
