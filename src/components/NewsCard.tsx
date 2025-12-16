"use client";

import Card from '@/components/Card';
import EmojiReaction from '@/components/EmojiReaction';

interface NewsCardProps {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    currentUserId?: string;
}

export default function NewsCard({ id, title, content, createdAt, currentUserId }: NewsCardProps) {
    return (
        <Card>
            <div style={{ fontSize: '0.85rem', color: 'var(--accent)', marginBottom: '8px' }}>
                {new Date(createdAt).toLocaleDateString()}
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px' }}>{title}</h3>
            <p style={{ color: 'var(--foreground-muted)', lineHeight: 1.5, fontSize: '0.95rem' }}>
                {content}
            </p>
            <EmojiReaction newsId={id} currentUserId={currentUserId} />
        </Card>
    );
}
