"use client";

import { useState, useEffect } from 'react';
import Card from '@/components/Card';
import { useRouter } from 'next/navigation';
import { getExams } from '@/app/actions';

interface ExamListItem {
    id: string;
    title: string;
    description: string;
    duration: number;
    _count?: { questions: number };
}

export default function ExamPrep() {
    const [exams, setExams] = useState<ExamListItem[]>([]);
    const router = useRouter();

    useEffect(() => {
        getExams().then(setExams);
    }, []);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Prüfungsmodus</h1>
                <p style={{ color: 'var(--foreground-muted)' }}>Wähle eine Prüfung und teste dein Wissen.</p>
            </header>

            <div style={{ display: 'grid', gap: '24px' }}>
                {exams.length === 0 && <p style={{ textAlign: 'center', color: 'var(--foreground-muted)' }}>Keine Prüfungen verfügbar.</p>}

                {exams.map((exam) => (
                    <Card key={exam.id} className="glass-card" style={{ padding: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '8px' }}>
                                    {exam.title}
                                </h2>
                                <p style={{ color: 'var(--foreground-muted)', marginBottom: '16px' }}>
                                    {exam.description}
                                </p>
                            </div>
                            <div style={{
                                background: 'var(--surface-highlight)',
                                padding: '8px 16px',
                                borderRadius: '100px',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                color: 'var(--accent)'
                            }}>
                                {exam.duration} Min.
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
                            <div style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem' }}>
                                {exam._count?.questions || 0} Fragen
                            </div>
                            <button
                                onClick={() => router.push(`/exam-prep/${exam.id}`)}
                                style={{
                                    padding: '12px 32px',
                                    background: 'var(--primary)',
                                    color: 'black',
                                    border: 'none',
                                    borderRadius: 'var(--radius-sm)',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    fontSize: '1rem'
                                }}
                            >
                                Starten
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
