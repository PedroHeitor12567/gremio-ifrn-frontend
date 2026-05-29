import { useState, useEffect, useCallback } from 'react'
import { impressionService } from '../services/api'
import type { Impression, CreateImpressionPayload } from '../types'

export function useImpressions() {
    const [impressions, setImpressions] = useState<Impression[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchImpressions = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            setImpressions(await impressionService.list())
        } catch {
            setError('Erro ao carregar impressões')
        } finally {
            setLoading(false)
        }
    }, [])

    const create = useCallback(async (payload: CreateImpressionPayload) => {
        const created = await impressionService.create(payload)
        setImpressions(prev => [created, ...prev])
        return created
    }, [])

    const remove = useCallback(async (id: string) => {
        await impressionService.remove(id)
        setImpressions(prev => prev.filter(i => i.id !== id))
    }, [])

    useEffect(() => { fetchImpressions() }, [fetchImpressions])

    return { impressions, loading, error, create, remove, refetch: fetchImpressions }
}