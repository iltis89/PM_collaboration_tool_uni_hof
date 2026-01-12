'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/Card'
import styles from '../Admin.module.css'
import type { AudioSnippet } from '../types'
import { renderFormattedText, formattedTextStyle } from '@/lib/format-text'

export default function AudioTab() {
    const [audioSnippets, setAudioSnippets] = useState<AudioSnippet[]>([])
    const [newAudio, setNewAudio] = useState({ title: '', description: '', transcript: '', file: null as File | null })
    const [isUploading, setIsUploading] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadAudio()
    }, [])

    const loadAudio = async () => {
        const { getAudioSnippets } = await import('@/app/actions')
        const data = await getAudioSnippets()
        setAudioSnippets(data as AudioSnippet[])
        setIsLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newAudio.title || !newAudio.file) return

        setIsUploading(true)
        try {
            const { upload } = await import('@vercel/blob/client')
            const blob = await upload(newAudio.file.name, newAudio.file, {
                access: 'public',
                handleUploadUrl: '/api/upload',
            })

            const { createAudioSnippet } = await import('@/app/actions')
            await createAudioSnippet({
                title: newAudio.title,
                description: newAudio.description,
                transcript: newAudio.transcript,
                url: blob.url
            })

            alert('Audio hinzugefügt')
            setNewAudio({ title: '', description: '', transcript: '', file: null })
            loadAudio()
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Upload fehlgeschlagen'
            alert('Fehler beim Upload: ' + message)
        } finally {
            setIsUploading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Diesen Audio-Snippet wirklich löschen?')) return

        const { deleteAudioSnippet } = await import('@/app/actions')
        try {
            await deleteAudioSnippet(id)
            setAudioSnippets(audioSnippets.filter(a => a.id !== id))
        } catch {
            alert('Fehler beim Löschen')
        }
    }

    if (isLoading) {
        return <div style={{ color: 'var(--foreground-muted)' }}>Audio-Snippets werden geladen...</div>
    }

    return (
        <div className={styles.tabContent}>
            <Card title="Neues Audio-Snippet">
                <form className={styles.form} onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Titel"
                        value={newAudio.title}
                        onChange={e => setNewAudio({ ...newAudio, title: e.target.value })}
                        className={styles.input}
                    />
                    <textarea
                        placeholder="Beschreibung (**fett**, *kursiv*)"
                        value={newAudio.description}
                        onChange={e => setNewAudio({ ...newAudio, description: e.target.value })}
                        className={styles.textarea}
                        rows={2}
                    />
                    <textarea
                        placeholder="Transkript (Absätze mit Enter, **fett**, *kursiv*)"
                        value={newAudio.transcript}
                        onChange={e => setNewAudio({ ...newAudio, transcript: e.target.value })}
                        className={styles.textarea}
                        rows={6}
                    />
                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Audio-Datei auswählen (MP3, WAV)</label>
                        <input
                            type="file"
                            accept="audio/*"
                            onChange={e => setNewAudio({ ...newAudio, file: e.target.files?.[0] || null })}
                            className={styles.fileInput}
                        />
                    </div>
                    <button type="submit" className={styles.submitBtn} disabled={isUploading}>
                        {isUploading ? 'Lädt hoch...' : 'Hinzufügen'}
                    </button>
                </form>
            </Card>

            <Card title="Vorhandene Audio-Snippets">
                {audioSnippets.map(a => (
                    <div key={a.id} className={styles.listItem}>
                        <div>
                            <div className={styles.listItemTitle}>{a.title}</div>
                            <div className={styles.listItemDescription} style={formattedTextStyle}>
                                {a.description ? renderFormattedText(a.description) : 'Keine Beschreibung'}
                            </div>
                        </div>
                        <button onClick={() => handleDelete(a.id)} className={styles.deleteBtn}>
                            <span className="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                ))}
            </Card>
        </div>
    )
}
