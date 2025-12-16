"use client";

import { useEffect, useState } from 'react';
import { getAudioSnippets } from '@/app/actions';
import AudioPlayer from '@/components/AudioPlayer';

interface AudioSnippet {
    id: string;
    title: string;
    description?: string | null;
    url: string;
    uploadedAt: Date;
}

export default function AudioLearningPage() {
    const [snippets, setSnippets] = useState<AudioSnippet[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getAudioSnippets()
            .then(data => {
                setSnippets(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to load snippets", err);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <div style={{ padding: '2rem', color: 'var(--foreground-muted)' }}>Lädt Audio Learning...</div>;
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
            <header style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Audio Learning</h1>
                <p style={{ color: 'var(--foreground-muted)' }}>
                    Höre dir Zusammenfassungen und Lerninhalte unterwegs an.
                </p>
            </header>

            {snippets.length === 0 ? (
                <div style={{
                    padding: '40px',
                    textAlign: 'center',
                    background: 'var(--surface)',
                    borderRadius: '16px',
                    border: '1px solid var(--border)'
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--foreground-muted)', marginBottom: '16px' }}>headphones_off</span>
                    <p>Noch keine Audio-Inhalte verfügbar.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '24px' }}>
                    {snippets.map(snippet => (
                        <AudioPlayer key={snippet.id} snippet={snippet} />
                    ))}
                </div>
            )}
        </div>
    );
}
