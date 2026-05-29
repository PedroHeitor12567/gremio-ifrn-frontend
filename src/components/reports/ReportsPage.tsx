import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar,
} from 'recharts'
import { useReport } from '../../hooks/useReport'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { ReportData, Impression } from '../../types'

function generatePDF(report: ReportData, type: 'weekly' | 'monthly') {
    const periodLabel = type === 'weekly' ? 'Semanal' : 'Mensal'
    const start = format(new Date(report.period_start), "dd/MM/yyyy", { locale: ptBR })
    const end = format(new Date(report.period_end), "dd/MM/yyyy", { locale: ptBR })

    const rows = report.impressions.map((imp: Impression) => `
    <tr>
      <td>${imp.person_name}</td>
      <td>${imp.turma}</td>
      <td>R$ ${imp.value.toFixed(2)}</td>
      <td>${imp.registered_by_name}</td>
      <td>${format(new Date(imp.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}</td>
    </tr>
  `).join('')

    const turmaRows = Object.entries(report.impressions_by_turma).map(([turma, count]) => `
    <tr>
      <td>${turma}</td>
      <td>${count}</td>
      <td>R$ ${(report.value_by_turma[turma] ?? 0).toFixed(2)}</td>
    </tr>
  `).join('')

    const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8"/>
      <title>Relatório ${periodLabel} - Grêmio IFRN</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; font-size: 12px; color: #111; padding: 32px; }
        h1 { font-size: 20px; margin-bottom: 4px; color: #1a1a1a; }
        h2 { font-size: 14px; margin: 20px 0 8px; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
        .badge { background: #00B37E; color: #fff; padding: 3px 10px; border-radius: 4px; font-size: 11px; font-weight: bold; }
        .period { font-size: 13px; color: #555; margin-top: 4px; }
        .stats { display: flex; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
        .stat { border: 1px solid #e0e0e0; border-radius: 8px; padding: 12px 16px; flex: 1; min-width: 120px; }
        .stat-label { font-size: 10px; text-transform: uppercase; color: #888; letter-spacing: 0.5px; }
        .stat-value { font-size: 18px; font-weight: bold; color: #111; margin-top: 4px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
        th { background: #f5f5f5; padding: 8px; text-align: left; font-size: 11px; text-transform: uppercase; color: #555; border-bottom: 2px solid #ddd; }
        td { padding: 7px 8px; border-bottom: 1px solid #eee; font-size: 12px; }
        tr:last-child td { border-bottom: none; }
        .footer { margin-top: 32px; font-size: 10px; color: #aaa; text-align: center; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1>Grêmio IFRN — Relatório ${periodLabel}</h1>
          <p class="period">Período: ${start} até ${end}</p>
          <p class="period">Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
        </div>
        <span class="badge">IFRN</span>
      </div>

      <div class="stats">
        <div class="stat">
          <div class="stat-label">Total de Impressões</div>
          <div class="stat-value">${report.total_impressions}</div>
        </div>
        <div class="stat">
          <div class="stat-label">Valor Total</div>
          <div class="stat-value">R$ ${report.total_value.toFixed(2)}</div>
        </div>
        <div class="stat">
          <div class="stat-label">Ticket Médio</div>
          <div class="stat-value">R$ ${report.average_value.toFixed(2)}</div>
        </div>
        <div class="stat">
          <div class="stat-label">Turmas</div>
          <div class="stat-value">${Object.keys(report.impressions_by_turma).length}</div>
        </div>
      </div>

      <h2>Resumo por Turma</h2>
      <table>
        <thead><tr><th>Turma</th><th>Quantidade</th><th>Valor Total</th></tr></thead>
        <tbody>${turmaRows}</tbody>
      </table>

      <h2>Detalhamento das Impressões</h2>
      <table>
        <thead><tr><th>Nome</th><th>Turma</th><th>Valor</th><th>Registrado por</th><th>Data/Hora</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="5" style="text-align:center;color:#aaa;">Nenhuma impressão no período</td></tr>'}</tbody>
      </table>

      <div class="footer">Grêmio Estudantil — IFRN &nbsp;|&nbsp; Relatório gerado automaticamente</div>
    </body>
    </html>
  `

    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const w = window.open(url, '_blank')
    if (w) {
        w.onload = () => {
            w.print()
            URL.revokeObjectURL(url)
        }
    }
}

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
            turma, quantidade: count, valor: report.value_by_turma[turma] ?? 0,
        }))
        : []

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">Relatórios</h1>
                <div className="header-actions">
                    <div className="btn-group">
                        <button className={`btn-report ${type === 'weekly' ? 'active' : ''}`} onClick={fetchWeekly} disabled={loading}>Semanal</button>
                        <button className={`btn-report ${type === 'monthly' ? 'active' : ''}`} onClick={fetchMonthly} disabled={loading}>Mensal</button>
                    </div>
                    {report && (
                        <button className="btn-pdf" onClick={() => generatePDF(report, type!)}>⬇ Baixar PDF</button>
                    )}
                </div>
            </div>

            {!report && !loading && (
                <div className="empty-page-state">
                    <p>Selecione um período para gerar o relatório.</p>
                    <p className="date-cell" style={{ marginTop: 8 }}>
                        Semanal: segunda a domingo da semana atual &nbsp;|&nbsp; Mensal: dia 1 ao último dia do mês atual
                    </p>
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
                            <p className="stat-label">Valor Total</p>
                            <p className="stat-value">R$ {report.total_value.toFixed(2)}</p>
                        </div>
                        <div className="stat-card accent-red">
                            <p className="stat-label">Ticket Médio</p>
                            <p className="stat-value">R$ {report.average_value.toFixed(2)}</p>
                        </div>
                        <div className="stat-card accent-blue">
                            <p className="stat-label">Turmas</p>
                            <p className="stat-value">{Object.keys(report.impressions_by_turma).length}</p>
                        </div>
                    </div>

                    {dayChartData.length > 0 && (
                        <div className="chart-card">
                            <h2 className="chart-title">Valor por Dia (R$)</h2>
                            <ResponsiveContainer width="100%" height={200}>
                                <AreaChart data={dayChartData} margin={{ top: 8, right: 8, left: -10, bottom: 8 }}>
                                    <defs>
                                        <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#00B37E" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#00B37E" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                                    <XAxis dataKey="date" tick={{ fill: '#a1a1aa', fontSize: 11 }} />
                                    <YAxis tick={{ fill: '#a1a1aa', fontSize: 11 }} />
                                    <Tooltip formatter={(v) => [`R$ ${Number(v).toFixed(2)}`, 'Valor']} contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8 }} />
                                    <Area type="monotone" dataKey="valor" stroke="#00B37E" fill="url(#gv)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {turmaChartData.length > 0 && (
                        <div className="chart-card">
                            <h2 className="chart-title">Impressões por Turma</h2>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={turmaChartData} margin={{ top: 8, right: 8, left: -10, bottom: 8 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                                    <XAxis dataKey="turma" tick={{ fill: '#a1a1aa', fontSize: 11 }} />
                                    <YAxis tick={{ fill: '#a1a1aa', fontSize: 11 }} />
                                    <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8 }} />
                                    <Bar dataKey="quantidade" fill="#E1FF01" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {report.impressions.length > 0 && (
                        <div className="card">
                            <h2 className="chart-title">Impressões do Período ({report.impressions.length})</h2>
                            <div className="table-scroll-wrap">
                                <table className="table">
                                    <thead>
                                    <tr><th>Nome</th><th>Turma</th><th>Valor</th><th>Registrado por</th><th>Data</th></tr>
                                    </thead>
                                    <tbody>
                                    {report.impressions.map(imp => (
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
                    )}

                    {report.impressions.length === 0 && (
                        <div className="empty-page-state"><p>Nenhuma impressão neste período.</p></div>
                    )}
                </>
            )}
        </div>
    )
}