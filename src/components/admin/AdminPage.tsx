import { useState, useEffect, useCallback } from 'react'
import { userService } from '../../services/api'
import type { User, CreateUserPayload, UpdateUserPayload, UserRole } from '../../types'
import { useAuth } from '../../context/AuthContext'

const EMPTY_CREATE: CreateUserPayload = { name: '', role_title: '', email: '', password: '', role: 'user' }

export function AdminPage() {
    const { user: currentUser } = useAuth()
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [editTarget, setEditTarget] = useState<User | null>(null)
    const [form, setForm] = useState<CreateUserPayload>(EMPTY_CREATE)
    const [formError, setFormError] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)

    const fetchUsers = useCallback(async () => {
        setLoading(true); setError(null)
        try { setUsers(await userService.list()) }
        catch { setError('Erro ao carregar usuários') }
        finally { setLoading(false) }
    }, [])

    useEffect(() => { fetchUsers() }, [fetchUsers])

    const openCreate = () => {
        setEditTarget(null)
        setForm(EMPTY_CREATE)
        setFormError(null)
        setShowModal(true)
    }

    const openEdit = (u: User) => {
        setEditTarget(u)
        setForm({ name: u.name, role_title: u.role_title, email: u.email, password: '', role: u.role })
        setFormError(null)
        setShowModal(true)
    }

    const handleSave = async () => {
        setFormError(null)
        if (!form.name.trim() || !form.role_title.trim() || !form.email.trim()) {
            setFormError('Preencha nome, cargo e email.'); return
        }
        if (!editTarget && !form.password) { setFormError('Senha é obrigatória.'); return }
        if (form.password && form.password.length < 6) { setFormError('Senha mínima: 6 caracteres.'); return }
        setSaving(true)
        try {
            if (editTarget) {
                const payload: UpdateUserPayload = {
                    name: form.name, role_title: form.role_title, email: form.email,
                    role: form.role, is_active: true,
                    ...(form.password ? { password: form.password } : {}),
                }
                const updated = await userService.update(editTarget.id, payload)
                setUsers(prev => prev.map(u => u.id === editTarget.id ? updated : u))
            } else {
                const created = await userService.create(form)
                setUsers(prev => [...prev, created])
            }
            setShowModal(false)
        } catch (err: any) {
            setFormError(err?.response?.data?.detail || 'Erro ao salvar.')
        } finally {
            setSaving(false)
        }
    }

    const toggleActive = async (u: User) => {
        try {
            const payload: UpdateUserPayload = {
                name: u.name, role_title: u.role_title, email: u.email,
                role: u.role, is_active: !u.is_active,
            }
            const updated = await userService.update(u.id, payload)
            setUsers(prev => prev.map(x => x.id === u.id ? updated : x))
        } catch (err: any) {
            alert(err?.response?.data?.detail || 'Erro ao atualizar.')
        }
    }

    const handleDelete = async (u: User) => {
        if (!confirm(`Excluir ${u.name}? Esta ação não pode ser desfeita.`)) return
        try {
            await userService.remove(u.id)
            setUsers(prev => prev.filter(x => x.id !== u.id))
        } catch (err: any) {
            alert(err?.response?.data?.detail || 'Erro ao excluir.')
        }
    }

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">Usuários</h1>
                <button className="btn-primary" onClick={openCreate}>+ Novo Usuário</button>
            </div>

            {loading && <div className="loading-state">Carregando...</div>}
            {error && <div className="error-state">{error}</div>}

            {!loading && (
                <div className="card table-scroll-wrap">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Cargo</th>
                            <th>Email</th>
                            <th>Perfil</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map(u => (
                            <tr key={u.id}>
                                <td>{u.name}</td>
                                <td className="date-cell">{u.role_title}</td>
                                <td className="date-cell">{u.email}</td>
                                <td>
                    <span className={`badge ${u.role === 'admin' ? 'badge-admin' : ''}`}>
                      {u.role === 'admin' ? 'Admin' : 'Usuário'}
                    </span>
                                </td>
                                <td>
                                    <button
                                        className={`toggle-btn ${u.is_active ? 'active' : 'inactive'}`}
                                        onClick={() => toggleActive(u)}
                                        disabled={u.id === currentUser?.id}
                                        title={u.id === currentUser?.id ? 'Não é possível desativar sua própria conta' : ''}
                                    >
                                        {u.is_active ? 'Ativo' : 'Inativo'}
                                    </button>
                                </td>
                                <td className="actions-cell">
                                    <button className="btn-icon" onClick={() => openEdit(u)} title="Editar">✏️</button>
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDelete(u)}
                                        disabled={u.id === currentUser?.id}
                                        title={u.id === currentUser?.id ? 'Não é possível excluir sua própria conta' : 'Excluir'}
                                    >✕</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {users.length === 0 && <p className="empty-state">Nenhum usuário cadastrado.</p>}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">{editTarget ? 'Editar Usuário' : 'Novo Usuário'}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>

                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Nome</label>
                                <input className="form-input" type="text" placeholder="Nome completo"
                                       value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Cargo</label>
                                <input className="form-input" type="text" placeholder="Ex: Presidente, Tesoureiro"
                                       value={form.role_title} onChange={e => setForm(p => ({ ...p, role_title: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input className="form-input" type="email" placeholder="email@exemplo.com"
                                       value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">{editTarget ? 'Nova Senha (deixe vazio para manter)' : 'Senha'}</label>
                                <input className="form-input" type="password" placeholder="Mínimo 6 caracteres"
                                       value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Perfil de Acesso</label>
                                <select className="form-input form-select"
                                        value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value as UserRole }))}>
                                    <option value="user">Usuário</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>
                            {formError && <p className="form-error">{formError}</p>}
                        </div>

                        <div className="modal-footer">
                            <button className="btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
                            <button className="btn-primary" onClick={handleSave} disabled={saving}>
                                {saving ? 'Salvando...' : 'Salvar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}