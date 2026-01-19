"use client";

import { useRef, useEffect } from 'react';
import type { ChatMessage } from './types';

interface ChatPanelProps {
    messages: ChatMessage[];
    currentUserId: string | null;
    editingMessageId: string | null;
    editContent: string;
    newMessage: string;
    isSending: boolean;
    onNewMessageChange: (content: string) => void;
    onEditChange: (content: string) => void;
    onSend: (e: React.FormEvent) => void;
    onUpdateMessage: (messageId: string) => void;
    onCancelEdit: () => void;
    onStartEdit: (messageId: string, content: string) => void;
    onDelete: (messageId: string) => void;
    canEdit: (authorId: string) => boolean;
}

export default function ChatPanel({
    messages,
    currentUserId,
    editingMessageId,
    editContent,
    newMessage,
    isSending,
    onNewMessageChange,
    onEditChange,
    onSend,
    onUpdateMessage,
    onCancelEdit,
    onStartEdit,
    onDelete,
    canEdit
}: ChatPanelProps) {
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Kurs Chat</h2>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {messages.map(msg => {
                    const isOwnMessage = msg.authorId === currentUserId;
                    return (
                        <div key={msg.id} style={{
                            alignSelf: isOwnMessage ? 'flex-end' : 'flex-start',
                            maxWidth: '70%',
                            position: 'relative'
                        }}>
                            <div style={{
                                background: isOwnMessage ? 'var(--primary)' : 'var(--surface-highlight)',
                                color: isOwnMessage ? 'black' : 'white',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                borderBottomRightRadius: isOwnMessage ? '2px' : '12px',
                                borderBottomLeftRadius: isOwnMessage ? '12px' : '2px'
                            }}>
                                {editingMessageId === msg.id ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <textarea
                                            value={editContent}
                                            onChange={e => onEditChange(e.target.value)}
                                            style={{ width: '100%', padding: '4px', background: 'white', color: 'black', border: 'none', borderRadius: '4px' }}
                                        />
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            <button onClick={() => onUpdateMessage(msg.id)} style={{ padding: '2px 6px', background: 'black', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }}>Ok</button>
                                            <button onClick={onCancelEdit} style={{ padding: '2px 6px', background: 'transparent', color: 'black', border: '1px solid black', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }}>X</button>
                                        </div>
                                    </div>
                                ) : (
                                    <p style={{ margin: 0, lineHeight: 1.4, whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                                )}
                            </div>
                            <div style={{
                                fontSize: '0.75rem',
                                color: 'var(--foreground-muted)',
                                marginTop: '4px',
                                textAlign: isOwnMessage ? 'right' : 'left',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                                gap: '8px'
                            }}>
                                {canEdit(msg.authorId) && (
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <button
                                            onClick={() => onStartEdit(msg.id, msg.content)}
                                            style={{ background: 'none', border: 'none', color: 'var(--foreground-muted)', cursor: 'pointer', padding: 0 }}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>edit</span>
                                        </button>
                                        <button
                                            onClick={() => onDelete(msg.id)}
                                            style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: 0 }}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>delete</span>
                                        </button>
                                    </div>
                                )}
                                {msg.author?.name} · {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    );
                })}
                <div ref={chatEndRef} />
            </div>

            <div style={{ padding: '16px', borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)' }}>
                <form onSubmit={onSend} style={{ display: 'flex', gap: '12px' }}>
                    <input
                        value={newMessage}
                        onChange={e => onNewMessageChange(e.target.value)}
                        placeholder="Nachricht an alle..."
                        style={{ flex: 1, padding: '12px', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'white' }}
                        disabled={isSending}
                    />
                    <button
                        type="submit"
                        disabled={isSending || !newMessage.trim()}
                        style={{
                            padding: '0 24px',
                            background: 'var(--primary)',
                            color: 'black',
                            fontWeight: 'bold',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: isSending ? 'wait' : 'pointer'
                        }}
                    >
                        <span className="material-symbols-outlined">send</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
