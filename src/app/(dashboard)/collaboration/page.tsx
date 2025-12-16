"use client";

// Note: We need to use a Client Component for interactivity, but we can fetch initial data in a Server Component wrapper if we wanted.
// For simplicity and speed in this "use client" file, we will fetch data via a useEffect or just wrap it.
// Actually, let's keep it "use client" and fetch on mount or convert to Server Component + Client Islands.
// Given the current structure, I'll switch to fetching on mount for now to keep it simple without major refactoring.

import { useState, useEffect } from 'react';
import Card from '@/components/Card';
import styles from './Collaboration.module.css';
import { getThreads, createThread } from '@/app/actions';

interface Thread {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    author?: { id: string; name: string };
    _count?: { messages: number };
}

export default function Collaboration() {
    const [activeTab, setActiveTab] = useState('threads');
    const [threads, setThreads] = useState<Thread[]>([]);
    const [showNewThreadForm, setShowNewThreadForm] = useState(false);
    const [newThread, setNewThread] = useState({ title: '', content: '' });

    useEffect(() => {
        let isMounted = true;
        getThreads().then(data => {
            if (isMounted) {
                setThreads(data as Thread[]);
            }
        }).catch(e => {
            console.error("Failed to load threads", e);
        });
        return () => { isMounted = false; };
    }, []);

    async function loadThreads() {
        try {
            const data = await getThreads();
            setThreads(data as Thread[]);
        } catch (e) {
            console.error("Failed to load threads", e);
        }
    }

    async function handleCreateThread(e: React.FormEvent) {
        e.preventDefault();
        try {
            await createThread(newThread);
            setShowNewThreadForm(false);
            setNewThread({ title: '', content: '' });
            loadThreads(); // Refresh
        } catch (err) {
            console.error(err);
            alert('Fehler beim Erstellen: ' + (err instanceof Error ? err.message : 'Unbekannt'));
        }
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Kollaboration</h1>
                    <p style={{ color: 'var(--foreground-muted)' }}>Diskutiert, teilt und löst Probleme gemeinsam.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        className={styles.newButton}
                        onClick={() => setShowNewThreadForm(!showNewThreadForm)}
                    >
                        {showNewThreadForm ? 'Abbrechen' : 'Neuer Beitrag'}
                    </button>
                </div>
            </header>

            {showNewThreadForm && (
                <Card className="mb-8" style={{ marginBottom: '32px' }}>
                    <form onSubmit={handleCreateThread} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <input
                            placeholder="Titel deiner Frage..."
                            value={newThread.title}
                            onChange={e => setNewThread({ ...newThread, title: e.target.value })}
                            style={{ padding: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'white', borderRadius: '4px' }}
                            required
                        />
                        <textarea
                            placeholder="Beschreibe dein Problem..."
                            value={newThread.content}
                            onChange={e => setNewThread({ ...newThread, content: e.target.value })}
                            style={{ padding: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'white', borderRadius: '4px', minHeight: '100px' }}
                            required
                        />
                        <button type="submit" style={{ padding: '12px', background: 'var(--primary)', color: 'black', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Veröffentlichen
                        </button>
                    </form>
                </Card>
            )}

            <div className={styles.grid}>
                <div className={styles.threadsColumn}>
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${activeTab === 'threads' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('threads')}
                        >
                            Diskussionen
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'chat' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('chat')}
                        >
                            Kurs Chat
                        </button>
                    </div>

                    <div className={styles.threadList}>
                        {threads.length === 0 && <p style={{ color: 'var(--foreground-muted)' }}>Keine Diskussionen vorhanden.</p>}
                        {threads.map(thread => (
                            <div key={thread.id} className="glass-card" style={{ padding: '20px', cursor: 'pointer', transition: 'var(--transition-fast)', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                    <div style={{
                                        width: '32px', height: '32px', borderRadius: '50%',
                                        background: 'var(--surface-highlight)', color: 'var(--foreground)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.8rem', fontWeight: 600
                                    }}>
                                        {thread.author?.name?.substring(0, 2).toUpperCase() || '??'}
                                    </div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{thread.author?.name || 'Unbekannt'}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)', marginLeft: 'auto' }}>
                                        {new Date(thread.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>{thread.title}</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--foreground-muted)', marginBottom: '16px' }}>
                                    {thread.content.substring(0, 100)}...
                                </p>
                                <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--accent)' }}>
                                    <span>{thread._count?.messages || 0} Antworten</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.chatColumn}>
                    <Card className={styles.chatCard}>
                        <div style={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--foreground-muted)',
                            textAlign: 'center',
                            padding: '40px'
                        }}>
                            <p>Wähle eine Diskussion um Details zu sehen.</p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
