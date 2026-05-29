import { useState, useCallback } from 'react'
import { impressionService } from '../services/api'
import type { ReportData } from '../types'

export function useReport() {
    const [report, setReport] = useState<ReportData | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [type, setType] = useState<'weekly' | 'monthly' | null>(null)

    const fetchWeekly = useCallback(async () => {
        setLoading(true)
        setError(null)
        setType('weekly')
        try {
            const data = await impressionService.getWeeklyReport()
            setReport(data)
        } catch {
            setError('Erro ao carregar relatório semanal')
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchMonthly = useCallback(async () => {
        setLoading(true)
        setError(null)
        setType('monthly')
        try {
            const data = await impressionService.getMonthlyReport()
            setReport(data)
        } catch {
            setError('Erro ao carregar relatório mensal')
        } finally {
            setLoading(false)
        }
    }, [])

    return { report, loading, error, type, fetchWeekly, fetchMonthly }
}