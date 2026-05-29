import { useState, type ReactElement } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { LoginPage } from './components/auth/LoginPage'
import { Layout } from './components/layout/Layout'
import { DashboardPage } from './components/dashboard/DashboardPage'
import { ImpressionsPage } from './components/impressions/ImpressionsPage'
import { ReportsPage } from './components/reports/ReportsPage'
import { AdminPage } from './components/admin/AdminPage'

type Page = 'dashboard' | 'impressions' | 'reports' | 'admin'

function AppInner() {
  const { user, loading, isAdmin } = useAuth()
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')

  if (loading) return <div className="loading-state" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Carregando...</div>
  if (!user) return <LoginPage />

  const pages: Record<Page, ReactElement> = {
    dashboard: <DashboardPage />,
    impressions: <ImpressionsPage />,
    reports: <ReportsPage />,
    admin: isAdmin ? <AdminPage /> : <DashboardPage />,
  }

  return (
      <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
        {pages[currentPage]}
      </Layout>
  )
}

export default function App() {
  return (
      <AuthProvider>
        <AppInner />
      </AuthProvider>
  )
}