'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/Card'
import styles from '../Admin.module.css'
import type { AdminStats } from '../types'

export default function OverviewTab() {
    const [stats, setStats] = useState<AdminStats | null>(null)

    useEffect(() => {
        const loadStats = async () => {
            const { getAdminStats } = await import('@/app/actions')
            const data = await getAdminStats()
            setStats(data)
        }
        loadStats()
    }, [])

    if (!stats) {
        return <div style={{ color: 'var(--foreground-muted)' }}>Statistiken werden geladen...</div>
    }

    return (
        <div className={styles.overviewContainer}>
            <div className={styles.statsGrid}>
                <Card className={styles.statCard}>
                    <div className={styles.statContent}>
                        <div className={styles.statLabel}>Studenten</div>
                        <div className={styles.statValue}>{stats.userCount}</div>
                    </div>
                </Card>
                <Card className={styles.statCard}>
                    <div className={styles.statContent}>
                        <div className={styles.statLabel}>Prüfungen</div>
                        <div className={styles.statValue}>{stats.totalExams}</div>
                    </div>
                </Card>
                <Card className={styles.statCard}>
                    <div className={styles.statContent}>
                        <div className={styles.statLabel}>Bestehensquote</div>
                        <div className={styles.statValueSuccess}>{stats.passRate}%</div>
                    </div>
                </Card>
            </div>

            {stats.topStudents.length > 0 && (
                <Card title="Top Studenten">
                    <div className={styles.topStudentsList}>
                        {stats.topStudents.map((student, index) => (
                            <div key={student.id} className={styles.topStudentRow}>
                                <span className={styles.topStudentRank}>#{index + 1}</span>
                                <span className={styles.topStudentName}>{student.name}</span>
                                <span className={styles.topStudentXp}>{student.xp} EP (Stufe {student.level})</span>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    )
}
