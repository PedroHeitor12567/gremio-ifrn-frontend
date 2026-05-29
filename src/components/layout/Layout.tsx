import type { ReactNode } from 'react'

type Page = 'dashboard' | 'impressions' | 'reports'

interface SidebarProps {
    currentPage: Page
    onNavigate: (page: Page) => void
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
    const items: { id: Page; label: string; icon: string }[] = [
        { id: 'dashboard', label: 'Dashboard', icon: '▦' },
        { id: 'impressions', label: 'Impressões', icon: '🖨' },
        { id: 'reports', label: 'Relatórios', icon: '📋' },
    ]

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <span className="logo-badge">IFRN</span>
                <div>
                    <p className="logo-title">Grêmio</p>
                    <p className="logo-sub">Sistema de Impressões</p>
                </div>
            </div>
            <nav className="sidebar-nav">
                {items.map(item => (
                    <button
                        key={item.id}
                        className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                        onClick={() => onNavigate(item.id)}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </nav>
        </aside>
    )
}

interface LayoutProps {
    children: ReactNode
    currentPage: Page
    onNavigate: (page: Page) => void
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
    return (
        <div className="app-shell">
            <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
            <main className="main-content">{children}</main>
        </div>
    )
}