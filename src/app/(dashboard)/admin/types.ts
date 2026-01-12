import type { User as PrismaUser, Material as PrismaMaterial, News as PrismaNews, AudioSnippet as PrismaAudioSnippet, Lecture as PrismaLecture, CurriculumTopic as PrismaCurriculumTopic } from '@prisma/client'

// Re-export Prisma types with selected fields for frontend use
export type User = Pick<PrismaUser, 'id' | 'email' | 'name' | 'role' | 'xp' | 'level' | 'createdAt' | 'privacyAccepted' | 'privacyAcceptedAt'>
export type Material = Pick<PrismaMaterial, 'id' | 'title' | 'description' | 'fileUrl' | 'uploadedAt'>
export type News = Pick<PrismaNews, 'id' | 'title' | 'content' | 'createdAt'>
export type AudioSnippet = Pick<PrismaAudioSnippet, 'id' | 'title' | 'description' | 'url' | 'uploadedAt'>
export type Lecture = Pick<PrismaLecture, 'id' | 'title' | 'description' | 'room' | 'professor' | 'startTime' | 'endTime'>
export type CurriculumTopic = Pick<PrismaCurriculumTopic, 'id' | 'title' | 'description' | 'order' | 'date' | 'status'>

export interface TopStudent {
    id: string
    name: string
    xp: number
    level: number
}

export interface AdminStats {
    userCount: number
    totalExams: number
    passRate: number
    topStudents: TopStudent[]
}

// Common tab props
export interface AdminTabProps {
    onRefresh?: () => void
}
