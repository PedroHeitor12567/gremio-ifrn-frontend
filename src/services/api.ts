import axios from 'axios'
import type { AuthToken, User, CreateUserPayload, UpdateUserPayload, Impression, CreateImpressionPayload, DashboardData, ReportData } from '../types'

const api = axios.create({ baseURL: 'https://gremio-ifrn-backend.onrender.com' })

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

api.interceptors.response.use(
    (r) => r,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }
        return Promise.reject(err)
    }
)

export const authService = {
    async login(email: string, password: string): Promise<AuthToken> {
        const { data } = await api.post<AuthToken>('/auth/login', { email, password })
        return data
    },
    async me(): Promise<User> {
        const { data } = await api.get<User>('/auth/me')
        return data
    },
}

export const userService = {
    async list(): Promise<User[]> {
        const { data } = await api.get<User[]>('/admin/users')
        return data
    },
    async create(payload: CreateUserPayload): Promise<User> {
        const { data } = await api.post<User>('/admin/users', payload)
        return data
    },
    async update(id: string, payload: UpdateUserPayload): Promise<User> {
        const { data } = await api.put<User>(`/admin/users/${id}`, payload)
        return data
    },
    async remove(id: string): Promise<void> {
        await api.delete(`/admin/users/${id}`)
    },
}

export const impressionService = {
    async create(payload: CreateImpressionPayload): Promise<Impression> {
        const { data } = await api.post<Impression>('/impressions/', payload)
        return data
    },
    async list(): Promise<Impression[]> {
        const { data } = await api.get<Impression[]>('/impressions/')
        return data
    },
    async remove(id: string): Promise<void> {
        await api.delete(`/impressions/${id}`)
    },
    async getDashboard(): Promise<DashboardData> {
        const { data } = await api.get<DashboardData>('/impressions/dashboard')
        return data
    },
    async getWeeklyReport(): Promise<ReportData> {
        const { data } = await api.get<ReportData>('/impressions/reports/weekly')
        return data
    },
    async getMonthlyReport(): Promise<ReportData> {
        const { data } = await api.get<ReportData>('/impressions/reports/monthly')
        return data
    },
}