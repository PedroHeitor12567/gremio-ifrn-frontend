import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar,
} from 'recharts'
import { useReport } from '../../hooks/useReport'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function ReportsPage() {
    const { report, loading, error, type, fetchWeekly, fetchMonthly } = useReport()

    const dayChartData = report
        ? Object.entries(report.impressions_by_day)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, value]) => ({
                date: format(new Date(date + 'T00:00:00'), 'dd/MM', { locale: ptBR }),
                valor: value,
            }))
        : []

    const turmaChartData = report
        ? Object.entries(report.impressions_by_turma).map(([turma, count]) => ({
            turma,
            quantidade: count,
            valor: report.value_by_turma[turma] ?? 0,
        }))
        : []

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">Relatórios</h1>
                <div className="btn-group">
                    <button
                        className={`btn-report ${type === 'weekly' ? 'active' : ''}`}
                        onClick={fetchWeekly}
                        disabled={loading}
                    >
                        Semanal
                    </button>
                    <button
                        className={`btn-report ${type === 'monthly' ? 'active' : ''}`}
                        onClick={fetchMonthly}
                        disabled={loading}
                    >
                        Mensal
                    </button>
                </div>
            </div>

            {!report && !loading && (
                <div className="empty-page-state">
                    <p>Selecione um período para gerar o relatório.</p>
                </div>
            )}

            {loading && <div className="loading-state">Gerando relatório...</div>}
            {error && <div className="error-state">{error}</div>}

            {report && !loading && (
                <>
                    <div className="report-period">
                        {format(new Date(report.period_start), "dd/MM/yyyy", { locale: ptBR })}
                        {' — '}
                        {format(new Date(report.period_end), "dd/MM/yyyy", { locale: ptBR })}
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card accent-green">
                            <p className="stat-label">Total de Impressões</p>
                            <p className="stat-value">{report.total_impressions}</p>
                        </div>
                        <div className="stat-card accent-yellow">
                            <p className="stat-label">Valor Total (R$)</p>
                            <p className="stat-value">R$ {report.total_value.toFixed(2)}</p>
                        </div>
                        <div className="stat-card accent-red">
                            <p className="stat-label">Ticket Médio</p>
                            <p className="stat-value">R$ {report.average_value.toFixed(2)}</p>
                        </div>
                        <div className="stat-card accent-blue">
                            <p className="stat-label">Turmas no Período</p>
                            <p className="stat-value">{Object.keys(report.impressions_by_turma).length}</p>
                        </div>
                    </div>

                    {dayChartData.length > 0 && (
                        <div className="chart-card">
                            <h2 className="chart-title">Valor por Dia (R$)</h2>
                            <ResponsiveContainer width="100%" height={240}>
                                <AreaChart data={dayChartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                                    <defs>
                                        <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#00B37E" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#00B37E" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                                    <XAxis dataKey="date" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                                    <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                                    <Tooltip
                                        formatter={(v) => [`R$ ${Number(v).toFixed(2)}`, 'Valor']}
                                        contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8 }}
                                    />
                                    <Area type="monotone" dataKey="valor" stroke="#00B37E" fill="url(#colorValor)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {turmaChartData.length > 0 && (
                        <div className="chart-card">
                            <h2 className="chart-title">Quantidade de Impressões por Turma</h2>
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={turmaChartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                                    <XAxis dataKey="turma" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                                    <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                                    <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8 }} />
                                    <Bar dataKey="quantidade" fill="#E1FF01" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {report.impressions.length > 0 && (
                        <div className="card">
                            <h2 className="chart-title">Impressões do Período ({report.impressions.length})</h2>
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Turma</th>
                                    <th>Valor</th>
                                    <th>Data</th>
                                </tr>
                                </thead>
                                <tbody>
                                {report.impressions.map(imp => (
                                    <tr key={imp.id}>
                                        <td>{imp.person_name}</td>
                                        <td><span className="badge">{imp.turma}</span></td>
                                        <td className="value-cell">R$ {imp.value.toFixed(2)}</td>
                                        <td className="date-cell">
                                            {format(new Date(imp.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {report.impressions.length === 0 && (
                        <div className="empty-page-state">
                            <p>Nenhuma impressão neste período.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}