export interface Impression {
    id: string
    person_name: string
    turma: string
    value: number
    created_at: string
}

export interface CreateImpressionPayload {
    person_name: string
    turma: string
    value: number
}

export interface DashboardData {
    total_impressions: number
    total_value: number
    average_value: number
    impressions_by_turma: Record<string, number>
    value_by_turma: Record<string, number>
    recent_impressions: Impression[]
}

export interface ReportData {
    period_start: string
    period_end: string
    total_impressions: number
    total_value: number
    average_value: number
    impressions_by_turma: Record<string, number>
    value_by_turma: Record<string, number>
    impressions_by_day: Record<string, number>
    impressions: Impression[]
}