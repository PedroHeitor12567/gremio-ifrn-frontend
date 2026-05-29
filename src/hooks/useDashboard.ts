import { useState, useEffect, useCallback } from 'react'
import { impressionService } from '../services/api'
import type { DashboardData } from '../types'

export function useDashboard() {
    const [dashboard, setDashboard] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetch = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            setDashboard(await impressionService.getDashboard())
        } catch {
            setError('Erro ao carregar dashboard')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetch() }, [fetch])
    return { dashboard, loading, error, refetch: fetch }
}