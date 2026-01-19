"use client";

import type { Message } from './types';

interface ThreadMessagesProps {
    messages: Message[];
    threadAuthorId: string;
    editingMessageId: string | null;
    editContent: string;
    onEditChange: (content: string) => void;
    onSave: (messageId: string) => void;
    onCancel: () => void;
    onStartEdit: (messageId: string, content: string) => void;
    onDelete: (messageId: string) => void;
    canEdit: (authorId: string) => boolean;
}

export default function ThreadMessages({
    messages,
    threadAuthorId,
    editingMessageId,
    editContent,
    onEditChange,
    onSave,
    onCancel,
    onStartEdit,
    onDelete,
    canEdit
}: ThreadMessagesProps) {
    if (messages.length === 0) {
        return (
            <div style={{ color: 'var(--foreground-muted)', textAlign: 'center' }}>
                Noch keine Antworten. Sei der Erste!
            </div>
        );
    }

    return (
        <>
            {messages.map(msg => (
                <div key={msg.id} style={{
                    background: 'var(--surface-highlight)',
                    padding: '16px',
                    borderRadius: '8px',
                    borderLeft: `4px solid ${msg.authorId === threadAuthorId ? 'var(--primary)' : 'var(--accent)'}`,
                    position: 'relative'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{msg.author?.name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: 'var(--foreground-muted)', fontSize: '0.8rem' }}>{new Date(msg.createdAt).toLocaleString()}</span>
                            {canEdit(msg.authorId) && (
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    <button
                                        onClick={() => onStartEdit(msg.id, msg.content)}
                                        style={{ background: 'none', border: 'none', color: 'var(--foreground-muted)', cursor: 'pointer', padding: 0 }}
                                        title="Bearbeiten"
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>edit</span>
                                    </button>
                                    <button
                                        onClick={() => onDelete(msg.id)}
                                        style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: 0 }}
                                        title="Löschen"
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>delete</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    {editingMessageId === msg.id ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <textarea
                                value={editContent}
                                onChange={e => onEditChange(e.target.value)}
                                style={{ width: '100%', padding: '8px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'white', borderRadius: '4px' }}
                            />
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => onSave(msg.id)} style={{ padding: '4px 8px', background: 'var(--primary)', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Speichern</button>
                                <button onClick={onCancel} style={{ padding: '4px 8px', background: 'var(--surface)', color: 'white', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Abbrechen</button>
                            </div>
                        </div>
                    ) : (
                        <p style={{ fontSize: '0.95rem', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                    )}
                </div>
            ))}
        </>
    );
}
