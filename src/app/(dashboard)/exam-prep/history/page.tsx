"use client";

import { useState, useEffect } from 'react';
import Card from '@/components/Card';
import { getExamResults } from '@/app/actions';

interface ExamResult {
    id: string;
    score: number;
    passed: boolean;
    completedAt: Date;
    exam: { title: string };
}

export default function ExamHistory() {
    const [results, setResults] = useState<ExamResult[]>([]);

    useEffect(() => {
        getExamResults().then(result => {
            if (result.success) setResults(result.data as unknown as ExamResult[]);
        });
    }, []);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Prüfungshistorie</h1>
                <p style={{ color: 'var(--foreground-muted)' }}>Deine vergangenen Ergebnisse.</p>
            </header>

            <div style={{ display: 'grid', gap: '16px' }}>
                {results.length === 0 && <p style={{ textAlign: 'center', color: 'var(--foreground-muted)' }}>Noch keine Prüfungen absolviert.</p>}

                {results.map((result) => (
                    <Card key={result.id} className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--foreground-muted)', marginBottom: '4px' }}>
                                {new Date(result.completedAt).toLocaleDateString()} &middot; {new Date(result.completedAt).toLocaleTimeString()}
                            </div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{result.exam.title}</h3>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                            <div style={{
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                color: result.passed ? 'var(--success)' : 'var(--error)'
                            }}>
                                {result.score}%
                            </div>
                            <div style={{ fontSize: '0.9rem', color: result.passed ? 'var(--success)' : 'var(--error)' }}>
                                {result.passed ? 'Bestanden' : 'Nicht bestanden'}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
