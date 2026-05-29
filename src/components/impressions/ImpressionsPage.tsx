import { useState } from 'react'
import { useImpressions } from '../../hooks/useImpressions'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function ImpressionsPage() {
    const { impressions, loading, error, create, remove } = useImpressions()
    const [form, setForm] = useState({ person_name: '', turma: '', value: '' })
    const [submitting, setSubmitting] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async () => {
        setFormError(null)
        setSuccess(false)

        if (!form.person_name.trim() || !form.turma.trim() || !form.value) {
            setFormError('Preencha todos os campos.')
            return
        }

        const value = parseFloat(form.value)
        if (isNaN(value) || value <= 0) {
            setFormError('O valor deve ser maior que zero.')
            return
        }

        setSubmitting(true)
        try {
            await create({ person_name: form.person_name, turma: form.turma, value })
            setForm({ person_name: '', turma: '', value: '' })
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
        } catch {
            setFormError('Erro ao registrar impressão. Verifique a conexão com o servidor.')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Confirmar exclusão desta impressão?')) return
        try {
            await remove(id)
        } catch {
            alert('Erro ao excluir impressão.')
        }
    }

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">Registrar Impressão</h1>
            </div>

            <div className="card form-card">
                <h2 className="chart-title">Nova Impressão</h2>
                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">Nome da Pessoa</label>
                        <input
                            className="form-input"
                            type="text"
                            placeholder="Ex: João Silva"
                            value={form.person_name}
                            onChange={e => setForm(p => ({ ...p, person_name: e.target.value }))}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Turma</label>
                        <input
                            className="form-input"
                            type="text"
                            placeholder="Ex: INFO3M, ALI4V"
                            value={form.turma}
                            onChange={e => setForm(p => ({ ...p, turma: e.target.value.toUpperCase() }))}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Valor (R$)</label>
                        <input
                            className="form-input"
                            type="number"
                            placeholder="Ex: 2.50"
                            min="0.01"
                            step="0.01"
                            value={form.value}
                            onChange={e => setForm(p => ({ ...p, value: e.target.value }))}
                        />
                    </div>
                </div>

                {formError && <p className="form-error">{formError}</p>}
                {success && <p className="form-success">Impressão registrada com sucesso!</p>}

                <button
                    className="btn-primary"
                    onClick={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? 'Registrando...' : '+ Registrar Impressão'}
                </button>
            </div>

            <div className="card">
                <h2 className="chart-title">Histórico ({impressions.length})</h2>

                {loading && <p className="loading-inline">Carregando...</p>}
                {error && <p className="form-error">{error}</p>}

                {!loading && impressions.length === 0 && (
                    <p className="empty-state">Nenhuma impressão registrada ainda.</p>
                )}

                {impressions.length > 0 && (
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Turma</th>
                            <th>Valor</th>
                            <th>Data</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {impressions.map(imp => (
                            <tr key={imp.id}>
                                <td>{imp.person_name}</td>
                                <td><span className="badge">{imp.turma}</span></td>
                                <td className="value-cell">R$ {imp.value.toFixed(2)}</td>
                                <td className="date-cell">
                                    {format(new Date(imp.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                </td>
                                <td>
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDelete(imp.id)}
                                    >
                                        ✕
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}