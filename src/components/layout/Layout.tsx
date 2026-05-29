import { useState, type ReactNode } from 'react'
import { useAuth } from '../../context/AuthContext'

type Page = 'dashboard' | 'impressions' | 'reports' | 'admin'

interface LayoutProps {
    children: ReactNode
    currentPage: Page
    onNavigate: (page: Page) => void
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
    const { user, logout, isAdmin } = useAuth()
    const [menuOpen, setMenuOpen] = useState(false)

    const items: { id: Page; label: string; icon: string; adminOnly?: boolean }[] = [
        { id: 'dashboard', label: 'Dashboard', icon: '▦' },
        { id: 'impressions', label: 'Impressões', icon: '🖨' },
        { id: 'reports', label: 'Relatórios', icon: '📋' },
        { id: 'admin', label: 'Usuários', icon: '👥', adminOnly: true },
    ]

    const visibleItems = items.filter(i => !i.adminOnly || isAdmin)

    const NavItems = () => (
        <>
            {visibleItems.map(item => (
                <button
                    key={item.id}
                    className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                    onClick={() => { onNavigate(item.id); setMenuOpen(false) }}
                >
                    <span className="nav-icon">{item.icon}</span>
                    {item.label}
                </button>
            ))}
        </>
    )

    return (
        <div className="app-shell">
            {/* Mobile top bar */}
            <header className="mobile-header">
                <div className="mobile-header-left">
                    <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
                        <span /><span /><span />
                    </button>
                    <span className="logo-badge" style={{ fontSize: 10 }}>IFRN</span>
                    <span className="logo-title" style={{ fontSize: 14 }}>Grêmio</span>
                </div>
                <button className="btn-logout-sm" onClick={logout}>Sair</button>
            </header>

            {/* Mobile overlay menu */}
            {menuOpen && (
                <div className="mobile-overlay" onClick={() => setMenuOpen(false)}>
                    <div className="mobile-drawer" onClick={e => e.stopPropagation()}>
                        <div className="sidebar-logo" style={{ marginBottom: 24 }}>
                            <span className="logo-badge">IFRN</span>
                            <div>
                                <p className="logo-title">Grêmio</p>
                                <p className="logo-sub">Sistema de Impressões</p>
                            </div>
                        </div>
                        <nav className="sidebar-nav"><NavItems /></nav>
                        <div className="sidebar-user">
                            <p className="user-name">{user?.name}</p>
                            <p className="user-role">{user?.role_title}</p>
                            <button className="btn-logout" onClick={logout}>Sair</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop sidebar */}
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <span className="logo-badge">IFRN</span>
                    <div>
                        <p className="logo-title">Grêmio</p>
                        <p className="logo-sub">Sistema de Impressões</p>
                    </div>
                </div>
                <nav className="sidebar-nav"><NavItems /></nav>
                <div className="sidebar-user">
                    <p className="user-name">{user?.name}</p>
                    <p className="user-role">{user?.role_title}</p>
                    <button className="btn-logout" onClick={logout}>Sair</button>
                </div>
            </aside>

            <main className="main-content">{children}</main>
        </div>
    )
}