import { useState } from 'react'
import type { ReactElement } from 'react'
import { Layout } from './components/layout/Layout'
import { DashboardPage } from './components/dashboard/DashboardPage'
import { ImpressionsPage } from './components/impressions/ImpressionsPage'
import { ReportsPage } from './components/reports/ReportsPage'

type Page = 'dashboard' | 'impressions' | 'reports'

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')

  const pages: Record<Page, ReactElement> = {
    dashboard: <DashboardPage />,
    impressions: <ImpressionsPage />,
    reports: <ReportsPage />,
  }

  return (
      <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
        {pages[currentPage]}
      </Layout>
  )
}