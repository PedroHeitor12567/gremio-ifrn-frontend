import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
} from 'recharts'
import { useDashboard } from '../../hooks/useDashboard'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const COLORS = ['#00B37E', '#E1FF01', '#F75A68', '#82CFFF', '#FBA94C', '#A8A29E']

export function DashboardPage() {
    const { dashboard, loading, error, refetch } = useDashboard()

    if (loading) return <div className="loading-state">Carregando dashboard...</div>
    if (error) return <div className="error-state">{error} <button onClick={refetch}>Tentar novamente</button></div>
    if (!dashboard) return null

    const turmaBarData = Object.entries(dashboard.impressions_by_turma).map(([turma, count]) => ({
        turma, quantidade: count, valor: dashboard.value_by_turma[turma] ?? 0,
    }))

    const turmaPieData = Object.entries(dashboard.value_by_turma).map(([name, value]) => ({ name, value }))

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
                <button className="btn-ghost" onClick={refetch}>↺ Atualizar</button>
            </div>

            <div className="stats-grid">
                <div className="stat-card accent-green">
                    <p className="stat-label">Total de Impressões</p>
                    <p className="stat-value">{dashboard.total_impressions}</p>
                </div>
                <div className="stat-card accent-yellow">
                    <p className="stat-label">Valor Total</p>
                    <p className="stat-value">R$ {dashboard.total_value.toFixed(2)}</p>
                </div>
                <div className="stat-card accent-red">
                    <p className="stat-label">Ticket Médio</p>
                    <p className="stat-value">R$ {dashboard.average_value.toFixed(2)}</p>
                </div>
                <div className="stat-card accent-blue">
                    <p className="stat-label">Turmas Ativas</p>
                    <p className="stat-value">{Object.keys(dashboard.impressions_by_turma).length}</p>
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-card">
                    <h2 className="chart-title">Impressões por Turma</h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={turmaBarData} margin={{ top: 8, right: 8, left: -10, bottom: 8 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                            <XAxis dataKey="turma" tick={{ fill: '#a1a1aa', fontSize: 11 }} />
                            <YAxis tick={{ fill: '#a1a1aa', fontSize: 11 }} />
                            <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8 }} />
                            <Bar dataKey="quantidade" fill="#00B37E" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="chart-card">
                    <h2 className="chart-title">Valor por Turma (R$)</h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie data={turmaPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                                {turmaPieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip formatter={(v) => `R$ ${Number(v).toFixed(2)}`} contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8 }} />
                            <Legend wrapperStyle={{ color: '#a1a1aa', fontSize: 11 }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="card">
                <h2 className="chart-title">Últimas Impressões</h2>
                <div className="table-scroll-wrap">
                    <table className="table">
                        <thead>
                        <tr><th>Nome</th><th>Turma</th><th>Valor</th><th>Registrado por</th><th>Data</th></tr>
                        </thead>
                        <tbody>
                        {dashboard.recent_impressions.map(imp => (
                            <tr key={imp.id}>
                                <td>{imp.person_name}</td>
                                <td><span className="badge">{imp.turma}</span></td>
                                <td className="value-cell">R$ {imp.value.toFixed(2)}</td>
                                <td className="date-cell">{imp.registered_by_name}</td>
                                <td className="date-cell">{format(new Date(imp.created_at), "dd/MM/yy HH:mm", { locale: ptBR })}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}