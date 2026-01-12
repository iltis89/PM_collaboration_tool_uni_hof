'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/Card'
import styles from '../Admin.module.css'
import type { News } from '../types'

export default function NewsTab() {
    const [news, setNews] = useState<News[]>([])
    const [newNews, setNewNews] = useState({ title: '', content: '' })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadNews()
    }, [])

    const loadNews = async () => {
        const { getNews } = await import('@/app/actions')
        const data = await getNews()
        setNews(data as News[])
        setIsLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newNews.title || !newNews.content) return

        const { createNews } = await import('@/app/actions')
        await createNews({ ...newNews, author: 'Admin' })
        alert('Veröffentlicht!')
        setNewNews({ title: '', content: '' })
        loadNews()
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Diese Neuigkeit wirklich löschen?')) return

        const { deleteNews } = await import('@/app/actions')
        try {
            await deleteNews(id)
            setNews(news.filter(n => n.id !== id))
        } catch {
            alert('Fehler beim Löschen')
        }
    }

    if (isLoading) {
        return <div style={{ color: 'var(--foreground-muted)' }}>News werden geladen...</div>
    }

    return (
        <div className={styles.tabContent}>
            <Card title="Neuigkeit erstellen">
                <form className={styles.form} onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Titel"
                        value={newNews.title}
                        onChange={e => setNewNews({ ...newNews, title: e.target.value })}
                        className={styles.input}
                    />
                    <textarea
                        placeholder="Inhalt"
                        value={newNews.content}
                        onChange={e => setNewNews({ ...newNews, content: e.target.value })}
                        className={styles.textarea}
                        rows={3}
                    />
                    <button type="submit" className={styles.submitBtn}>Veröffentlichen</button>
                </form>
            </Card>

            <Card title="Aktuelle Neuigkeiten">
                {news.map(n => (
                    <div key={n.id} className={styles.newsCard}>
                        <button
                            onClick={() => handleDelete(n.id)}
                            className={styles.newsDeleteBtn}
                        >
                            <span className="material-symbols-outlined">delete</span>
                        </button>
                        <h4 className={styles.newsTitle}>{n.title}</h4>
                        <p className={styles.newsContent}>{n.content}</p>
                        <div className={styles.newsDate}>{new Date(n.createdAt).toLocaleDateString()}</div>
                    </div>
                ))}
            </Card>
        </div>
    )
}
