"use client";

import type { Thread } from './types';

interface ThreadListProps {
    threads: Thread[];
    selectedThreadId: string | null;
    onSelectThread: (id: string) => void;
}

export default function ThreadList({ threads, selectedThreadId, onSelectThread }: ThreadListProps) {
    if (threads.length === 0) {
        return <p style={{ color: 'var(--foreground-muted)' }}>Keine Diskussionen vorhanden.</p>;
    }

    return (
        <>
            {threads.map(thread => (
                <div
                    key={thread.id}
                    className="glass-card"
                    onClick={() => onSelectThread(thread.id)}
                    style={{
                        padding: '20px',
                        cursor: 'pointer',
                        transition: 'var(--transition-fast)',
                        marginBottom: '16px',
                        border: selectedThreadId === thread.id ? '1px solid var(--primary)' : '1px solid transparent',
                        background: selectedThreadId === thread.id ? 'rgba(255,255,255,0.05)' : undefined
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
        </>
    );
}
