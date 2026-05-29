import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export function LoginPage() {
    const { login } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        if (!email.trim() || !password.trim()) { setError('Preencha todos os campos.'); return }
        setLoading(true)
        try {
            await login(email, password)
        } catch (err: any) {
            setError(err?.response?.data?.detail || 'Credenciais inválidas.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-shell">
            <div className="login-card">
                <div className="login-logo">
                    <span className="logo-badge">IFRN</span>
                    <div>
                        <p className="logo-title">Grêmio Estudantil</p>
                        <p className="logo-sub">Sistema de Impressões</p>
                    </div>
                </div>

                <h2 className="login-heading">Entrar na plataforma</h2>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            className="form-input"
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Senha</label>
                        <input
                            className="form-input"
                            type="password"
                            placeholder="••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </div>

                    {error && <p className="form-error">{error}</p>}

                    <button className="btn-primary btn-full" type="submit" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <p className="login-hint">Acesso restrito aos membros do grêmio</p>
            </div>
        </div>
    )
}