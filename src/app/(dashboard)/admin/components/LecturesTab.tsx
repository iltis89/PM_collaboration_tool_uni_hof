'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/Card'
import styles from '../Admin.module.css'
import type { Lecture } from '../types'

export default function LecturesTab() {
    const [lectures, setLectures] = useState<Lecture[]>([])
    const [newLecture, setNewLecture] = useState({
        title: '',
        description: '',
        room: '',
        professor: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '11:30'
    })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadLectures()
    }, [])

    const loadLectures = async () => {
        const { getLectures } = await import('@/app/actions')
        const data = await getLectures()
        setLectures(data as Lecture[])
        setIsLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newLecture.title || !newLecture.date) return

        const startDateTime = new Date(`${newLecture.date}T${newLecture.startTime}`)
        const endDateTime = new Date(`${newLecture.date}T${newLecture.endTime}`)

        const { createLecture } = await import('@/app/actions')
        await createLecture({
            title: newLecture.title,
            description: newLecture.description,
            room: newLecture.room,
            professor: newLecture.professor,
            startTime: startDateTime,
            endTime: endDateTime
        })

        alert('Vorlesung geplant!')
        setNewLecture({ ...newLecture, title: '', description: '' })
        loadLectures()
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Diese Vorlesung wirklich löschen?')) return

        const { deleteLecture } = await import('@/app/actions')
        try {
            await deleteLecture(id)
            setLectures(lectures.filter(l => l.id !== id))
        } catch {
            alert('Fehler beim Löschen')
        }
    }

    if (isLoading) {
        return <div style={{ color: 'var(--foreground-muted)' }}>Vorlesungen werden geladen...</div>
    }

    return (
        <div className={styles.tabContent}>
            <Card title="Vorlesung planen">
                <form className={styles.form} onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Titel"
                        value={newLecture.title}
                        onChange={e => setNewLecture({ ...newLecture, title: e.target.value })}
                        className={styles.input}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Beschreibung (optional)"
                        value={newLecture.description}
                        onChange={e => setNewLecture({ ...newLecture, description: e.target.value })}
                        className={styles.input}
                    />
                    <div className={styles.formRow}>
                        <input
                            type="text"
                            placeholder="Raum"
                            value={newLecture.room}
                            onChange={e => setNewLecture({ ...newLecture, room: e.target.value })}
                            className={styles.input}
                        />
                        <input
                            type="text"
                            placeholder="Dozent"
                            value={newLecture.professor}
                            onChange={e => setNewLecture({ ...newLecture, professor: e.target.value })}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formRow}>
                        <input
                            type="date"
                            value={newLecture.date}
                            onChange={e => setNewLecture({ ...newLecture, date: e.target.value })}
                            className={styles.input}
                            required
                        />
                        <input
                            type="time"
                            value={newLecture.startTime}
                            onChange={e => setNewLecture({ ...newLecture, startTime: e.target.value })}
                            className={styles.input}
                            required
                        />
                        <input
                            type="time"
                            value={newLecture.endTime}
                            onChange={e => setNewLecture({ ...newLecture, endTime: e.target.value })}
                            className={styles.input}
                            required
                        />
                    </div>
                    <button type="submit" className={styles.submitBtn}>Planen</button>
                </form>
            </Card>

            <Card title="Geplante Vorlesungen">
                {lectures.length === 0 && (
                    <p className={styles.emptyState}>Keine Vorlesungen geplant.</p>
                )}
                {lectures.map(l => (
                    <div key={l.id} className={styles.lectureItem}>
                        <div>
                            <div className={styles.lectureTitle}>{l.title}</div>
                            <div className={styles.lectureTime}>
                                {new Date(l.startTime).toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin' })} &middot;{' '}
                                {new Date(l.startTime).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin' })}
                            </div>
                            <div className={styles.lectureMeta}>
                                {l.professor && <span>{l.professor}</span>}
                                {l.room && <span> &middot; {l.room}</span>}
                            </div>
                        </div>
                        <button onClick={() => handleDelete(l.id)} className={styles.deleteBtn}>
                            <span className="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                ))}
            </Card>
        </div>
    )
}
