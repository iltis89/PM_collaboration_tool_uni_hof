"use client";

import { useState, useEffect, useCallback } from 'react';
import { getNewsReactions, addNewsReaction } from '@/app/actions';
import styles from './EmojiReaction.module.css';

interface EmojiReactionProps {
    newsId: string;
    currentUserId?: string;
}

const EMOJI_OPTIONS = ['👍', '❤️', '🎉', '🤔', '👏'];

export default function EmojiReaction({ newsId, currentUserId }: EmojiReactionProps) {
    const [reactions, setReactions] = useState<{ emoji: string; userId: string }[]>([]);
    const [userReaction, setUserReaction] = useState<string | null>(null);
    const [showPicker, setShowPicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const loadReactions = useCallback(async () => {
        try {
            const data = await getNewsReactions(newsId);
            setReactions(data);
            // Find current user's reaction if exists
            if (currentUserId) {
                const existing = data.find(r => r.userId === currentUserId);
                setUserReaction(existing?.emoji || null);
            }
        } catch (e) {
            console.error('Error loading reactions', e);
        }
    }, [newsId, currentUserId]);

    useEffect(() => {
        loadReactions();
    }, [loadReactions]);

    const handleReaction = async (emoji: string) => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            await addNewsReaction(newsId, emoji);
            setUserReaction(emoji);
            await loadReactions();
        } catch (e) {
            console.error('Error adding reaction', e);
        } finally {
            setIsLoading(false);
            setShowPicker(false);
        }
    };

    // Group reactions by emoji and count
    const reactionCounts = reactions.reduce((acc, r) => {
        acc[r.emoji] = (acc[r.emoji] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className={styles.container}>
            <div className={styles.reactions}>
                {Object.entries(reactionCounts).map(([emoji, count]) => (
                    <button
                        key={emoji}
                        className={`${styles.reactionBadge} ${userReaction === emoji ? styles.active : ''}`}
                        onClick={() => handleReaction(emoji)}
                        disabled={isLoading}
                    >
                        <span>{emoji}</span>
                        <span className={styles.count}>{count}</span>
                    </button>
                ))}

                <button
                    className={styles.addButton}
                    onClick={() => setShowPicker(!showPicker)}
                    title="Reaktion hinzufügen"
                >
                    <span className="material-symbols-outlined">add_reaction</span>
                </button>
            </div>

            {showPicker && (
                <div className={styles.picker}>
                    {EMOJI_OPTIONS.map(emoji => (
                        <button
                            key={emoji}
                            className={styles.emojiOption}
                            onClick={() => handleReaction(emoji)}
                            disabled={isLoading}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
