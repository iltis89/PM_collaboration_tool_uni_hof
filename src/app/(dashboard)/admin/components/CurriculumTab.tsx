'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/Card'
import styles from '../Admin.module.css'
import type { CurriculumTopic } from '../types'

type TopicStatus = 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED'

interface NewTopicState {
    title: string
    description: string
    order: number
    date: string
    status: TopicStatus
}

export default function CurriculumTab() {
    const [topics, setTopics] = useState<CurriculumTopic[]>([])
    const [newTopic, setNewTopic] = useState<NewTopicState>({
        title: '',
        description: '',
        order: 1,
        date: new Date().toISOString().split('T')[0],
        status: 'UPCOMING'
    })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadTopics()
    }, [])

    const loadTopics = async () => {
        const { getCurriculumTopics } = await import('@/app/actions')
        const data = await getCurriculumTopics()
        setTopics(data as CurriculumTopic[])
        setIsLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newTopic.title) return

        const { createCurriculumTopic } = await import('@/app/actions')
        await createCurriculumTopic({
            title: newTopic.title,
            description: newTopic.description,
            order: Number(newTopic.order),
            date: newTopic.date ? new Date(newTopic.date) : undefined,
            status: newTopic.status
        })

        alert('Thema hinzugefügt!')
        setNewTopic({
            title: '',
            description: '',
            order: topics.length + 2,
            date: new Date().toISOString().split('T')[0],
            status: 'UPCOMING'
        })
        loadTopics()
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Dieses Thema wirklich löschen?')) return

        const { deleteCurriculumTopic } = await import('@/app/actions')
        try {
            await deleteCurriculumTopic(id)
            setTopics(topics.filter(t => t.id !== id))
        } catch {
            alert('Fehler beim Löschen')
        }
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return { background: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50', border: '1px solid rgba(76, 175, 80, 0.3)' }
            case 'IN_PROGRESS':
                return { background: 'rgba(255, 152, 0, 0.1)', color: '#FF9800', border: '1px solid rgba(255, 152, 0, 0.3)' }
            default:
                return { background: 'rgba(255, 255, 255, 0.05)', color: 'var(--foreground-muted)', border: '1px solid rgba(255, 255, 255, 0.1)' }
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'Abgeschlossen'
            case 'IN_PROGRESS': return 'Laufend'
            default: return 'Geplant'
        }
    }

    if (isLoading) {
        return <div style={{ color: 'var(--foreground-muted)' }}>Lehrplan wird geladen...</div>
    }

    return (
        <div className={styles.tabContent}>
            <Card title="Thema zum Lehrplan hinzufügen">
                <form className={styles.form} onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Titel (z.B. Projektplanung)"
                        value={newTopic.title}
                        onChange={e => setNewTopic({ ...newTopic, title: e.target.value })}
                        className={styles.input}
                        required
                    />
                    <textarea
                        placeholder="Beschreibung"
                        value={newTopic.description}
                        onChange={e => setNewTopic({ ...newTopic, description: e.target.value })}
                        className={styles.textarea}
                        rows={2}
                    />
                    <div className={styles.formRow}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Reihenfolge</label>
                            <input
                                type="number"
                                value={newTopic.order}
                                onChange={e => setNewTopic({ ...newTopic, order: parseInt(e.target.value) })}
                                className={styles.input}
                                required
                            />
                        </div>
                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Datum</label>
                            <input
                                type="date"
                                value={newTopic.date}
                                onChange={e => setNewTopic({ ...newTopic, date: e.target.value })}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Status</label>
                            <select
                                value={newTopic.status}
                                onChange={e => {
                                    const status = e.target.value as 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED'
                                    setNewTopic({ ...newTopic, status })
                                }}
                                className={styles.input}
                            >
                                <option value="UPCOMING">Anstehend</option>
                                <option value="IN_PROGRESS">In Bearbeitung</option>
                                <option value="COMPLETED">Abgeschlossen</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className={styles.submitBtn}>Thema erstellen</button>
                </form>
            </Card>

            <Card title="Semester-Zeitstrahl">
                {topics.length === 0 && (
                    <p className={styles.emptyState}>Keine Themen definiert.</p>
                )}
                {topics.sort((a, b) => a.order - b.order).map(t => (
                    <div key={t.id} className={styles.topicItem}>
                        <div>
                            <div className={styles.topicHeader}>
                                <span className={styles.topicOrder}>{t.order}</span>
                                <div className={styles.topicTitle}>{t.title}</div>
                                <span className={styles.topicStatus} style={getStatusStyle(t.status)}>
                                    {getStatusLabel(t.status)}
                                </span>
                            </div>
                            {t.description && <div className={styles.topicDescription}>{t.description}</div>}
                            {t.date && <div className={styles.topicDate}>{new Date(t.date).toLocaleDateString()}</div>}
                        </div>
                        <button onClick={() => handleDelete(t.id)} className={styles.deleteBtn}>
                            <span className="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                ))}
            </Card>
        </div>
    )
}
