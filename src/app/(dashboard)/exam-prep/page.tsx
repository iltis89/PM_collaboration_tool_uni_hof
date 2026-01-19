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
    order: number;
    type: 'TOPIC_BLOCK' | 'MAIN_EXAM';
    isUnlocked: boolean;
    _count?: { questions: number };
    results?: { score: number; passed: boolean }[];
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
                    <Card
                        key={exam.id}
                        className="glass-card"
                        style={{
                            padding: '32px',
                            opacity: exam.isUnlocked ? 1 : 0.5,
                            filter: exam.isUnlocked ? 'none' : 'grayscale(40%)',
                            transition: 'all 0.3s ease'
                        }}
                    >
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
                                background: exam.isUnlocked ? 'var(--surface-highlight)' : 'transparent',
                                padding: '8px 16px',
                                borderRadius: '100px',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                color: exam.isUnlocked ? 'var(--accent)' : 'var(--foreground-muted)'
                            }}>
                                {exam.duration} Min.
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
                            <div style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem' }}>
                                {exam._count?.questions || 0} Fragen
                            </div>

                            {/* Progress Bar */}
                            <div style={{ flex: 1, margin: '0 24px' }}>
                                {exam.results && exam.results.length > 0 ? (
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--foreground-muted)' }}>
                                            <span>Dein Bestwert</span>
                                            <span style={{ color: exam.results[0].passed ? 'var(--accent)' : 'white' }}>{exam.results[0].score}%</span>
                                        </div>
                                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{
                                                height: '100%',
                                                width: `${exam.results[0].score}%`,
                                                background: exam.results[0].passed ? 'var(--accent)' : 'var(--primary)',
                                                borderRadius: '3px',
                                                transition: 'width 1s ease-out'
                                            }} />
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)', fontStyle: 'italic' }}>
                                        {exam.isUnlocked ? 'Noch nicht absolviert' : ''}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => exam.isUnlocked && router.push(`/exam-prep/${exam.id}`)}
                                disabled={!exam.isUnlocked}
                                style={{
                                    padding: '12px 32px',
                                    background: exam.isUnlocked ? 'var(--primary)' : 'var(--surface-highlight)',
                                    color: exam.isUnlocked ? 'black' : 'var(--foreground-muted)',
                                    border: 'none',
                                    borderRadius: 'var(--radius-sm)',
                                    fontWeight: 600,
                                    cursor: exam.isUnlocked ? 'pointer' : 'not-allowed',
                                    fontSize: '1rem'
                                }}
                            >
                                {exam.isUnlocked ? 'Starten' : '🔒 Gesperrt'}
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
        </div >
    );
}
