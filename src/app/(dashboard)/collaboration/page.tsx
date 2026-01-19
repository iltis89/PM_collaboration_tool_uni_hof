"use client";

import { useState, useEffect } from 'react';
import Card from '@/components/Card';
import styles from './Collaboration.module.css';
import {
    getThreads, createThread, getThread, createMessage, updateThread,
    getCurrentUser, deleteThread, deleteMessage, updateMessage,
    getCourseMessages, sendCourseMessage, updateCourseMessage, deleteCourseMessage
} from '@/app/actions';
import {
    ThreadList, ThreadDetail, ThreadMessages, ChatPanel,
} from './components';
import type { Thread, ThreadDetailData, ChatMessage, CurrentUser } from './components/types';

export default function Collaboration() {
    // Tab state
    const [activeTab, setActiveTab] = useState('threads');

    // Thread state
    const [threads, setThreads] = useState<Thread[]>([]);
    const [selectedThread, setSelectedThread] = useState<ThreadDetailData | null>(null);
    const [isLoadingThread, setIsLoadingThread] = useState(false);
    const [showNewThreadForm, setShowNewThreadForm] = useState(false);
    const [newThread, setNewThread] = useState({ title: '', content: '' });
    const [editingThread, setEditingThread] = useState(false);
    const [editThreadData, setEditThreadData] = useState({ title: '', content: '' });

    // Message state
    const [newMessage, setNewMessage] = useState('');
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [editMessageContent, setEditMessageContent] = useState('');

    // Chat state
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [newChatMessage, setNewChatMessage] = useState('');
    const [isSendingChatMessage, setIsSendingChatMessage] = useState(false);
    const [editingChatMessageId, setEditingChatMessageId] = useState<string | null>(null);
    const [editChatMessageContent, setEditChatMessageContent] = useState('');

    // User state
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

    // Load initial data
    useEffect(() => {
        loadThreads();
        loadChatMessages();
        getCurrentUser().then(u => setCurrentUser(u ? { id: u.id, role: u.role } : null));

        const interval = setInterval(loadChatMessages, 10000);
        return () => clearInterval(interval);
    }, []);

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
            setSelectedThread(data as ThreadDetailData);
            setEditingThread(false);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoadingThread(false);
        }
    }

    async function handleCreateThread(e: React.FormEvent) {
        e.preventDefault();
        const result = await createThread(newThread);
        if (!result.success) {
            alert('Fehler: ' + result.error);
            return;
        }
        setShowNewThreadForm(false);
        setNewThread({ title: '', content: '' });
        await loadThreads();
        handleSelectThread(result.data.id);
    }

    async function handleUpdateThread(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedThread) return;
        const result = await updateThread(selectedThread.id, editThreadData);
        if (!result.success) {
            alert('Fehler: ' + result.error);
            return;
        }
        setEditingThread(false);
        await loadThreads();
        handleSelectThread(selectedThread.id);
    }

    async function handleSendMessage(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedThread || !newMessage.trim()) return;
        setIsSendingMessage(true);
        const result = await createMessage(selectedThread.id, newMessage);
        if (!result.success) {
            alert('Fehler: ' + result.error);
            setIsSendingMessage(false);
            return;
        }
        setNewMessage('');
        const updated = await getThread(selectedThread.id);
        setSelectedThread(updated as ThreadDetailData);
        await loadThreads();
        setIsSendingMessage(false);
    }

    async function handleUpdateMessage(messageId: string) {
        if (!editMessageContent.trim() || !selectedThread) return;
        const result = await updateMessage(messageId, editMessageContent);
        if (!result.success) {
            alert('Fehler: ' + result.error);
            return;
        }
        setEditingMessageId(null);
        const updated = await getThread(selectedThread.id);
        setSelectedThread(updated as ThreadDetailData);
    }

    async function handleDeleteMessage(messageId: string) {
        if (!confirm("Nachricht wirklich löschen?") || !selectedThread) return;
        const result = await deleteMessage(messageId);
        if (!result.success) {
            alert('Fehler: ' + result.error);
            return;
        }
        const updated = await getThread(selectedThread.id);
        setSelectedThread(updated as ThreadDetailData);
        await loadThreads();
    }

    async function handleDeleteThread(id: string) {
        if (!confirm("Wirklich löschen?")) return;
        const result = await deleteThread(id);
        if (!result.success) {
            alert(result.error);
            return;
        }
        setSelectedThread(null);
        loadThreads();
    }

    async function handleSendChatMessage(e: React.FormEvent) {
        e.preventDefault();
        if (!newChatMessage.trim()) return;
        setIsSendingChatMessage(true);
        const result = await sendCourseMessage(newChatMessage);
        if (!result.success) {
            console.error(result.error);
            setIsSendingChatMessage(false);
            return;
        }
        setNewChatMessage('');
        await loadChatMessages();
        setIsSendingChatMessage(false);
    }

    async function handleUpdateChatMessage(messageId: string) {
        if (!editChatMessageContent.trim()) return;
        const result = await updateCourseMessage(messageId, editChatMessageContent);
        if (!result.success) {
            console.error(result.error);
            return;
        }
        setEditingChatMessageId(null);
        await loadChatMessages();
    }

    async function handleDeleteChatMessage(messageId: string) {
        if (!confirm("Nachricht wirklich löschen?")) return;
        const result = await deleteCourseMessage(messageId);
        if (!result.success) {
            console.error(result.error);
            return;
        }
        await loadChatMessages();
    }

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
                            <ThreadList
                                threads={threads}
                                selectedThreadId={selectedThread?.id || null}
                                onSelectThread={handleSelectThread}
                            />
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
                                            <ThreadDetail
                                                thread={selectedThread}
                                                isEditing={editingThread}
                                                editData={editThreadData}
                                                onEditChange={setEditThreadData}
                                                onSave={handleUpdateThread}
                                                onCancel={() => setEditingThread(false)}
                                                onDelete={() => handleDeleteThread(selectedThread.id)}
                                                onStartEdit={() => {
                                                    setEditThreadData({ title: selectedThread.title, content: selectedThread.content });
                                                    setEditingThread(true);
                                                }}
                                                canEdit={canEdit(selectedThread.authorId)}
                                            />

                                            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                <ThreadMessages
                                                    messages={selectedThread.messages}
                                                    threadAuthorId={selectedThread.authorId}
                                                    editingMessageId={editingMessageId}
                                                    editContent={editMessageContent}
                                                    onEditChange={setEditMessageContent}
                                                    onSave={handleUpdateMessage}
                                                    onCancel={() => setEditingMessageId(null)}
                                                    onStartEdit={(id, content) => {
                                                        setEditingMessageId(id);
                                                        setEditMessageContent(content);
                                                    }}
                                                    onDelete={handleDeleteMessage}
                                                    canEdit={canEdit}
                                                />
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
                            <ChatPanel
                                messages={chatMessages}
                                currentUserId={currentUser?.id || null}
                                editingMessageId={editingChatMessageId}
                                editContent={editChatMessageContent}
                                newMessage={newChatMessage}
                                isSending={isSendingChatMessage}
                                onNewMessageChange={setNewChatMessage}
                                onEditChange={setEditChatMessageContent}
                                onSend={handleSendChatMessage}
                                onUpdateMessage={handleUpdateChatMessage}
                                onCancelEdit={() => setEditingChatMessageId(null)}
                                onStartEdit={(id, content) => {
                                    setEditingChatMessageId(id);
                                    setEditChatMessageContent(content);
                                }}
                                onDelete={handleDeleteChatMessage}
                                canEdit={canEdit}
                            />
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
