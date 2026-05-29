import axios from 'axios'
import type { Impression, CreateImpressionPayload, DashboardData, ReportData } from '../types'

const api = axios.create({ baseURL: 'https://gremio-ifrn-backend.onrender.com' })

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