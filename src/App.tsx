import { NovaProvider } from './app/NovaProvider'
import { Router, useRouter } from './app/router'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { BillingPage } from './pages/BillingPage'
import { DashboardPage } from './pages/DashboardPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { SettingsPage } from './pages/SettingsPage'
import { TeamPage } from './pages/TeamPage'
import { TemplatesPage } from './pages/TemplatesPage'

function Routes() {
  const { path } = useRouter()
  if (path.startsWith('/projects')) return <ProjectsPage />
  if (path.startsWith('/analytics')) return <AnalyticsPage />
  if (path.startsWith('/team')) return <TeamPage />
  if (path.startsWith('/templates')) return <TemplatesPage />
  if (path.startsWith('/settings')) return <SettingsPage />
  if (path.startsWith('/billing')) return <BillingPage />
  return <DashboardPage />
}

export default function App() {
  return (
    <Router>
      <NovaProvider>
        <Routes />
      </NovaProvider>
    </Router>
  )
}
