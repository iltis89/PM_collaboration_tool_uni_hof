"use client";

import type { ThreadDetailData } from './types';

interface ThreadDetailProps {
    thread: ThreadDetailData;
    isEditing: boolean;
    editData: { title: string; content: string };
    onEditChange: (data: { title: string; content: string }) => void;
    onSave: (e: React.FormEvent) => void;
    onCancel: () => void;
    onDelete: () => void;
    onStartEdit: () => void;
    canEdit: boolean;
}

export default function ThreadDetail({
    thread,
    isEditing,
    editData,
    onEditChange,
    onSave,
    onCancel,
    onDelete,
    onStartEdit,
    canEdit
}: ThreadDetailProps) {
    if (isEditing) {
        return (
            <form onSubmit={onSave} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input
                    value={editData.title}
                    onChange={e => onEditChange({ ...editData, title: e.target.value })}
                    style={{ padding: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'white', fontWeight: 'bold' }}
                />
                <textarea
                    value={editData.content}
                    onChange={e => onEditChange({ ...editData, content: e.target.value })}
                    style={{ padding: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'white', minHeight: '200px' }}
                />
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="submit" style={{ padding: '8px 16px', background: 'var(--primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'black', fontWeight: 'bold' }}>Speichern</button>
                    <button type="button" onClick={onCancel} style={{ padding: '8px 16px', background: 'var(--surface-highlight)', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}>Abbrechen</button>
                </div>
            </form>
        );
    }

    return (
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '16px' }}>{thread.title}</h2>
                {canEdit && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={onStartEdit}
                            style={{ background: 'none', border: 'none', color: 'var(--foreground-muted)', cursor: 'pointer' }}
                            title="Bearbeiten"
                        >
                            <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button
                            onClick={onDelete}
                            style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}
                            title="Löschen"
                        >
                            <span className="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                )}
            </div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
                <div style={{ fontWeight: 600 }}>{thread.author?.name}</div>
                <div style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem' }}>{new Date(thread.createdAt).toLocaleString()}</div>
            </div>
            <p style={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{thread.content}</p>
        </div>
    );
}
