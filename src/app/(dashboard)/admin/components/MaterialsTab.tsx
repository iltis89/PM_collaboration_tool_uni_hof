'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/Card'
import styles from '../Admin.module.css'
import type { Material, CurriculumTopic } from '../types'
import { renderFormattedText, formattedTextStyle } from '@/lib/format-text'

export default function MaterialsTab() {
    const [materials, setMaterials] = useState<Material[]>([])
    const [topics, setTopics] = useState<CurriculumTopic[]>([])
    const [newMaterial, setNewMaterial] = useState({ title: '', description: '', topicId: '', file: null as File | null })
    const [isUploading, setIsUploading] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        const { getMaterials, getCurriculumTopics } = await import('@/app/actions')
        const [materialsData, topicsData] = await Promise.all([
            getMaterials(),
            getCurriculumTopics()
        ])
        setMaterials(materialsData as Material[])
        setTopics(topicsData as CurriculumTopic[])
        setIsLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMaterial.title || !newMaterial.file) return

        setIsUploading(true)
        try {
            const { upload } = await import('@vercel/blob/client')
            const blob = await upload(newMaterial.file.name, newMaterial.file, {
                access: 'public',
                handleUploadUrl: '/api/upload',
            })

            const { createMaterial } = await import('@/app/actions')
            await createMaterial({
                title: newMaterial.title,
                description: newMaterial.description,
                fileUrl: blob.url,
                topicId: newMaterial.topicId || undefined
            })

            alert('Material hinzugefügt')
            setNewMaterial({ title: '', description: '', topicId: '', file: null })
            loadData()
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Upload fehlgeschlagen'
            alert('Fehler beim Upload: ' + message)
        } finally {
            setIsUploading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Dieses Material wirklich löschen?')) return

        const { deleteMaterial } = await import('@/app/actions')
        try {
            await deleteMaterial(id)
            setMaterials(materials.filter(m => m.id !== id))
        } catch {
            alert('Fehler beim Löschen')
        }
    }

    if (isLoading) {
        return <div style={{ color: 'var(--foreground-muted)' }}>Materialien werden geladen...</div>
    }

    return (
        <div className={styles.tabContent}>
            <Card title="Neues Material hochladen">
                <form className={styles.form} onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Titel"
                        value={newMaterial.title}
                        onChange={e => setNewMaterial({ ...newMaterial, title: e.target.value })}
                        className={styles.input}
                    />
                    <textarea
                        placeholder="Beschreibung (Absätze mit Enter, **fett**, *kursiv*)"
                        value={newMaterial.description}
                        onChange={e => setNewMaterial({ ...newMaterial, description: e.target.value })}
                        className={styles.textarea}
                        rows={3}
                    />
                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Lehrplan-Thema (optional)</label>
                        <select
                            value={newMaterial.topicId}
                            onChange={e => setNewMaterial({ ...newMaterial, topicId: e.target.value })}
                            className={styles.input}
                        >
                            <option value="">Kein Thema zugeordnet</option>
                            {topics.map(t => (
                                <option key={t.id} value={t.id}>{t.order}. {t.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Datei auswählen</label>
                        <input
                            type="file"
                            onChange={e => setNewMaterial({ ...newMaterial, file: e.target.files?.[0] || null })}
                            className={styles.fileInput}
                        />
                    </div>
                    <button type="submit" className={styles.submitBtn} disabled={isUploading}>
                        {isUploading ? 'Lädt hoch...' : 'Hinzufügen'}
                    </button>
                </form>
            </Card>

            <Card title="Vorhandene Materialien">
                {materials.map(m => (
                    <div key={m.id} className={styles.listItem}>
                        <div>
                            <div className={styles.listItemTitle}>{m.title}</div>
                            <div className={styles.listItemDescription} style={formattedTextStyle}>
                                {m.description ? renderFormattedText(m.description) : 'Keine Beschreibung'}
                            </div>
                        </div>
                        <button onClick={() => handleDelete(m.id)} className={styles.deleteBtn}>
                            <span className="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                ))}
            </Card>
        </div>
    )
}
