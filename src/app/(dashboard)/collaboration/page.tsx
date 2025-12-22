"use client";

import { useState, useEffect, useRef } from 'react';
import Card from '@/components/Card';
import styles from './Collaboration.module.css';
import { getThreads, createThread, getThread, createMessage, updateThread, getCurrentUser, deleteThread, deleteMessage, getCourseMessages, sendCourseMessage } from '@/app/actions';

interface Thread {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    authorId: string;
    author?: { id: string; name: string };
    _count?: { messages: number };
}

interface Message {
    id: string;
    content: string;
    createdAt: Date;
    authorId: string;
    author?: { id: string; name: string };
}

interface ThreadDetail extends Thread {
    messages: Message[];
}

interface ChatMessage {
    id: string;
    content: string;
    createdAt: Date;
    authorId: string;
    author?: { id: string; name: string };
}

export default function Collaboration() {
    const [activeTab, setActiveTab] = useState('threads');
    const [threads, setThreads] = useState<Thread[]>([]);
    const [selectedThread, setSelectedThread] = useState<ThreadDetail | null>(null);
    const [isLoadingThread, setIsLoadingThread] = useState(false);

    const [showNewThreadForm, setShowNewThreadForm] = useState(false);
    const [newThread, setNewThread] = useState({ title: '', content: '' });

    const [newMessage, setNewMessage] = useState('');
    const [isSendingMessage, setIsSendingMessage] = useState(false);

    const [editingThread, setEditingThread] = useState(false);
    const [editThreadData, setEditThreadData] = useState({ title: '', content: '' });

    const [currentUser, setCurrentUser] = useState<{ id: string, role: string } | null>(null);

    // Chat State
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [newChatMessage, setNewChatMessage] = useState('');
    const [isSendingChatMessage, setIsSendingChatMessage] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadThreads();
        loadChatMessages();
        getCurrentUser().then(u => setCurrentUser(u ? { id: u.id, role: u.role } : null));

        // Poll for chat messages every 10 seconds (simple real-time sim)
        const interval = setInterval(loadChatMessages, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Scroll to bottom of chat when messages load
        if (activeTab === 'chat') {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatMessages, activeTab]);

    async function loadThreads() {
        const data = await getThreads();
        setThreads(data as Thread[]);
    }

    async function loadChatMessages() {
        const data = await getCourseMessages();
        setChatMessages(data as ChatMessage[]);
    }

    async function handleSelectThread(id: string) {
        setIsLoadingThread(true);
        try {
            const data = await getThread(id);
            setSelectedThread(data as ThreadDetail);
            setEditingThread(false);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoadingThread(false);
        }
    }

    async function handleCreateThread(e: React.FormEvent) {
        e.preventDefault();
        try {
            const created = await createThread(newThread);
            setShowNewThreadForm(false);
            setNewThread({ title: '', content: '' });
            await loadThreads();
            handleSelectThread(created.id);
        } catch (err: any) {
            alert('Fehler: ' + err.message);
        }
    }

    async function handleUpdateThread(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedThread) return;
        try {
            await updateThread(selectedThread.id, editThreadData);
            setEditingThread(false);
            await loadThreads();
            handleSelectThread(selectedThread.id); // Reload details
        } catch (err: any) {
            alert('Fehler: ' + err.message);
        }
    }

    async function handleSendMessage(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedThread || !newMessage.trim()) return;
        setIsSendingMessage(true);
        try {
            await createMessage(selectedThread.id, newMessage);
            setNewMessage('');
            // Refresh thread data to show new message AND update sidebar count
            const updated = await getThread(selectedThread.id);
            setSelectedThread(updated as ThreadDetail);
            await loadThreads(); // This fixes the sync issue!
        } catch (err: any) {
            alert('Fehler: ' + err.message);
        } finally {
            setIsSendingMessage(false);
        }
    }

    async function handleSendChatMessage(e: React.FormEvent) {
        e.preventDefault();
        if (!newChatMessage.trim()) return;
        setIsSendingChatMessage(true);
        try {
            await sendCourseMessage(newChatMessage);
            setNewChatMessage('');
            await loadChatMessages();
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        } catch (e: any) {
            console.error(e);
        } finally {
            setIsSendingChatMessage(false);
        }
    }

    async function handleDeleteThread(id: string) {
        if (!confirm("Wirklich löschen?")) return;
        try {
            await deleteThread(id);
            setSelectedThread(null);
            loadThreads();
        } catch (e: any) { alert(e.message); }
    }

    // Helper to check permissions
    const canEdit = (authorId: string) => currentUser?.role === 'ADMIN' || currentUser?.id === authorId;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Kollaboration</h1>
                    <p style={{ color: 'var(--foreground-muted)' }}>Diskutiert, teilt und löst Probleme gemeinsam.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    {activeTab === 'threads' && (
                        <button
                            className={styles.newButton}
                            onClick={() => setShowNewThreadForm(!showNewThreadForm)}
                        >
                            {showNewThreadForm ? 'Abbrechen' : 'Neuer Beitrag'}
                        </button>
                    )}
                </div>
            </header>

            {showNewThreadForm && activeTab === 'threads' && (
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

                    {activeTab === 'threads' ? (
                        <div className={styles.threadList}>
                            {threads.length === 0 && <p style={{ color: 'var(--foreground-muted)' }}>Keine Diskussionen vorhanden.</p>}
                            {threads.map(thread => (
                                <div
                                    key={thread.id}
                                    className="glass-card"
                                    onClick={() => handleSelectThread(thread.id)}
                                    style={{
                                        padding: '20px',
                                        cursor: 'pointer',
                                        transition: 'var(--transition-fast)',
                                        marginBottom: '16px',
                                        border: selectedThread?.id === thread.id ? '1px solid var(--primary)' : '1px solid transparent',
                                        background: selectedThread?.id === thread.id ? 'rgba(255,255,255,0.05)' : undefined
                                    }}
                                >
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
                                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--accent)' }}>
                                        <span>{thread._count?.messages || 0} Antworten</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ padding: '20px', color: 'var(--foreground-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                            <p>Willkommen im globalen Kurs-Chat! <br />Hier könnt ihr euch live austauschen.</p>
                        </div>
                    )}
                </div>

                <div className={styles.chatColumn}>
                    <Card className={styles.chatCard} style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                        {activeTab === 'threads' ? (
                            !selectedThread ? (
                                <div style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--foreground-muted)',
                                    textAlign: 'center',
                                    padding: '40px'
                                }}>
                                    <p>Wähle eine Diskussion um Details zu sehen.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    {isLoadingThread ? (
                                        <div style={{ padding: '40px', textAlign: 'center' }}>Lade...</div>
                                    ) : (
                                        <>
                                            {editingThread ? (
                                                <form onSubmit={handleUpdateThread} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                    <input
                                                        value={editThreadData.title}
                                                        onChange={e => setEditThreadData({ ...editThreadData, title: e.target.value })}
                                                        style={{ padding: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'white', fontWeight: 'bold' }}
                                                    />
                                                    <textarea
                                                        value={editThreadData.content}
                                                        onChange={e => setEditThreadData({ ...editThreadData, content: e.target.value })}
                                                        style={{ padding: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'white', minHeight: '200px' }}
                                                    />
                                                    <div style={{ display: 'flex', gap: '12px' }}>
                                                        <button type="submit" style={{ padding: '8px 16px', background: 'var(--primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'black', fontWeight: 'bold' }}>Speichern</button>
                                                        <button type="button" onClick={() => setEditingThread(false)} style={{ padding: '8px 16px', background: 'var(--surface-highlight)', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}>Abbrechen</button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '16px' }}>{selectedThread.title}</h2>
                                                        {canEdit(selectedThread.authorId) && (
                                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                                <button
                                                                    onClick={() => {
                                                                        setEditThreadData({ title: selectedThread.title, content: selectedThread.content });
                                                                        setEditingThread(true);
                                                                    }}
                                                                    style={{ background: 'none', border: 'none', color: 'var(--foreground-muted)', cursor: 'pointer' }}
                                                                    title="Bearbeiten"
                                                                >
                                                                    <span className="material-symbols-outlined">edit</span>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteThread(selectedThread.id)}
                                                                    style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}
                                                                    title="Löschen"
                                                                >
                                                                    <span className="material-symbols-outlined">delete</span>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
                                                        <div style={{ fontWeight: 600 }}>{selectedThread.author?.name}</div>
                                                        <div style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem' }}>{new Date(selectedThread.createdAt).toLocaleString()}</div>
                                                    </div>
                                                    <p style={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{selectedThread.content}</p>
                                                </div>
                                            )}

                                            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                {selectedThread.messages.map(msg => (
                                                    <div key={msg.id} style={{
                                                        background: 'var(--surface-highlight)',
                                                        padding: '16px',
                                                        borderRadius: '8px',
                                                        borderLeft: `4px solid ${msg.authorId === selectedThread.authorId ? 'var(--primary)' : 'var(--accent)'}`
                                                    }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{msg.author?.name}</span>
                                                            <span style={{ color: 'var(--foreground-muted)', fontSize: '0.8rem' }}>{new Date(msg.createdAt).toLocaleString()}</span>
                                                        </div>
                                                        <p style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>{msg.content}</p>
                                                    </div>
                                                ))}
                                                {selectedThread.messages.length === 0 && <div style={{ color: 'var(--foreground-muted)', textAlign: 'center' }}>Noch keine Antworten. Sei der Erste!</div>}
                                            </div>

                                            <div style={{ padding: '16px', borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)' }}>
                                                <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '12px' }}>
                                                    <input
                                                        value={newMessage}
                                                        onChange={e => setNewMessage(e.target.value)}
                                                        placeholder="Schreibe eine Antwort..."
                                                        style={{ flex: 1, padding: '12px', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'white' }}
                                                        disabled={isSendingMessage}
                                                    />
                                                    <button
                                                        type="submit"
                                                        disabled={isSendingMessage || !newMessage.trim()}
                                                        style={{
                                                            padding: '0 24px',
                                                            background: 'var(--primary)',
                                                            color: 'black',
                                                            fontWeight: 'bold',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: isSendingMessage ? 'wait' : 'pointer'
                                                        }}
                                                    >
                                                        Senden
                                                    </button>
                                                </form>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )
                        ) : (
                            // CHAT VIEW
                            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)' }}>
                                    <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Kurs Chat</h2>
                                </div>

                                <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {chatMessages.map(msg => {
                                        const isAndUser = msg.authorId === currentUser?.id;
                                        return (
                                            <div key={msg.id} style={{
                                                alignSelf: isAndUser ? 'flex-end' : 'flex-start',
                                                maxWidth: '70%'
                                            }}>
                                                <div style={{
                                                    background: isAndUser ? 'var(--primary)' : 'var(--surface-highlight)',
                                                    color: isAndUser ? 'black' : 'white',
                                                    padding: '12px 16px',
                                                    borderRadius: '12px',
                                                    borderBottomRightRadius: isAndUser ? '2px' : '12px',
                                                    borderBottomLeftRadius: isAndUser ? '12px' : '2px'
                                                }}>
                                                    <p style={{ margin: 0, lineHeight: 1.4 }}>{msg.content}</p>
                                                </div>
                                                <div style={{
                                                    fontSize: '0.75rem',
                                                    color: 'var(--foreground-muted)',
                                                    marginTop: '4px',
                                                    textAlign: isAndUser ? 'right' : 'left'
                                                }}>
                                                    {msg.author?.name} · {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={chatEndRef} />
                                </div>

                                <div style={{ padding: '16px', borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)' }}>
                                    <form onSubmit={handleSendChatMessage} style={{ display: 'flex', gap: '12px' }}>
                                        <input
                                            value={newChatMessage}
                                            onChange={e => setNewChatMessage(e.target.value)}
                                            placeholder="Nachricht an alle..."
                                            style={{ flex: 1, padding: '12px', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'white' }}
                                            disabled={isSendingChatMessage}
                                        />
                                        <button
                                            type="submit"
                                            disabled={isSendingChatMessage || !newChatMessage.trim()}
                                            style={{
                                                padding: '0 24px',
                                                background: 'var(--primary)',
                                                color: 'black',
                                                fontWeight: 'bold',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: isSendingChatMessage ? 'wait' : 'pointer'
                                            }}
                                        >
                                            <span className="material-symbols-outlined">send</span>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
