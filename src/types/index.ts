export type UserRole = 'admin' | 'user'

export interface User {
    id: string
    name: string
    email: string
    role: UserRole
    role_title: string
    is_active: boolean
}

export interface AuthToken {
    access_token: string
    token_type: string
    user: User
}

export interface Impression {
    id: string
    person_name: string
    turma: string
    value: number
    registered_by_name: string
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

export interface CreateUserPayload {
    name: string
    email: string
    password: string
    role: UserRole
    role_title: string
}

export interface UpdateUserPayload {
    name: string
    email: string
    password?: string
    role: UserRole
    role_title: string
    is_active: boolean
}