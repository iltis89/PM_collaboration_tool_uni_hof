"use client";

import { useState, useEffect, use } from 'react';
import Card from '@/components/Card';
import { useRouter } from 'next/navigation';
import { getExam, submitExam } from '@/app/actions';

interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correct: number[];
    category: string | null;
    explanation: string | null;
}

interface Exam {
    id: string;
    title: string;
    description: string;
    duration: number;
    questions: QuizQuestion[];
}

export default function ExamRunner({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap params using React.use()
    const { id: examId } = use(params);

    const router = useRouter();
    const [exam, setExam] = useState<Exam | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [key: string]: number[] }>({});
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getExam(examId)
            .then(result => {
                if (result.success) {
                    setExam(result.data as unknown as Exam);
                } else if (result.code === 'FORBIDDEN') {
                    router.push('/exam-prep');
                }
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [examId, router]);



    async function handleSubmit() {
        if (!exam) return;
        const result = await submitExam(exam.id, answers);
        if (result.success) {
            alert('Lernmodul abgeschlossen! EP gutgeschrieben.');
            router.push('/exam-prep/history');
        } else {
            alert('Fehler: ' + result.error);
        }
    }

    const handleNext = () => {
        setChecked(false);
        setCurrentQuestionIndex(prev => prev + 1);
    };

    const toggleOption = (questionId: string, idx: number) => {
        if (checked) return;
        const current = answers[questionId] ?? [];
        const isMulti = currentQuestion.correct.length > 1;

        if (isMulti) {
            // Multi-select: toggle option in/out
            if (current.includes(idx)) {
                setAnswers({ ...answers, [questionId]: current.filter(i => i !== idx) });
            } else {
                setAnswers({ ...answers, [questionId]: [...current, idx] });
            }
        } else {
            // Single-select: replace
            setAnswers({ ...answers, [questionId]: [idx] });
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Lade Modul...</div>;
    if (!exam) return <div style={{ padding: '40px', textAlign: 'center' }}>Modul nicht gefunden.</div>;

    const currentQuestion = exam.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / exam.questions.length) * 100;
    const selectedAnswers = answers[currentQuestion.id] ?? [];
    const correctSet = new Set(currentQuestion.correct);
    const selectedSet = new Set(selectedAnswers);
    const isCorrect = correctSet.size === selectedSet.size && selectedAnswers.every(a => correctSet.has(a));
    const isMultiSelect = currentQuestion.correct.length > 1;



    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{exam.title}</h1>
            </div>

            <Card className="glass-card" style={{ padding: '48px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, height: '4px', background: 'var(--primary)', width: `${progress}%`, transition: 'width 0.3s' }} />

                <div style={{ marginBottom: '32px', color: 'var(--foreground-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Frage {currentQuestionIndex + 1} von {exam.questions.length}</span>
                    {isMultiSelect && (
                        <span style={{
                            fontSize: '0.8rem',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            background: 'rgba(0, 255, 157, 0.1)',
                            color: 'var(--primary)',
                            border: '1px solid var(--primary)',
                            fontWeight: 600
                        }}>
                            Mehrfachauswahl
                        </span>
                    )}
                </div>

                <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '32px', lineHeight: 1.4 }}>
                    {currentQuestion.question}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {currentQuestion.options.map((option: string, idx: number) => {
                        const isSelected = selectedAnswers.includes(idx);
                        const isCorrectOption = correctSet.has(idx);
                        let borderColor = 'var(--border)';
                        let bgColor = 'transparent';
                        let textColor = 'var(--foreground)';

                        if (checked) {
                            if (isCorrectOption) {
                                borderColor = 'var(--success)';
                                bgColor = 'rgba(76, 175, 80, 0.1)';
                                textColor = 'var(--success)';
                            } else if (isSelected) {
                                borderColor = 'var(--error)';
                                bgColor = 'rgba(244, 67, 54, 0.1)';
                                textColor = 'var(--error)';
                            }
                        } else if (isSelected) {
                            borderColor = 'var(--primary)';
                            bgColor = 'rgba(0, 255, 157, 0.1)';
                            textColor = 'var(--primary)';
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => toggleOption(currentQuestion.id, idx)}
                                disabled={checked}
                                style={{
                                    padding: '20px',
                                    textAlign: 'left',
                                    borderRadius: 'var(--radius-sm)',
                                    border: `1px solid ${borderColor}`,
                                    background: bgColor,
                                    color: textColor,
                                    cursor: checked ? 'default' : 'pointer',
                                    transition: 'all 0.2s',
                                    fontSize: '1rem',
                                    opacity: (checked && !isSelected && !isCorrectOption) ? 0.5 : 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}
                            >
                                {isMultiSelect && (
                                    <span style={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '4px',
                                        border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                                        background: isSelected ? 'var(--primary)' : 'transparent',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        fontSize: '0.75rem',
                                        color: isSelected ? 'black' : 'transparent',
                                        transition: 'all 0.2s'
                                    }}>
                                        ✓
                                    </span>
                                )}
                                {option}
                            </button>
                        );
                    })}
                </div>

                {checked && (
                    <div className="animate-fade-in" style={{ marginTop: '32px', padding: '24px', background: 'var(--surface)', borderRadius: '8px', borderLeft: `4px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}` }}>
                        <div style={{ fontWeight: 600, marginBottom: '8px', color: isCorrect ? 'var(--success)' : 'var(--error)' }}>
                            {isCorrect ? 'Richtig!' : 'Leider falsch.'}
                        </div>
                        <p style={{ lineHeight: 1.6, color: 'var(--foreground-muted)' }}>
                            {currentQuestion.explanation || "Keine Erklärung verfügbar."}
                        </p>
                    </div>
                )}

                <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                    {!checked ? (
                        <button
                            onClick={() => setChecked(true)}
                            disabled={selectedAnswers.length === 0}
                            style={{
                                padding: '12px 32px',
                                background: selectedAnswers.length > 0 ? 'var(--accent)' : 'var(--surface-highlight)',
                                color: selectedAnswers.length > 0 ? 'white' : 'var(--foreground-muted)',
                                border: 'none',
                                borderRadius: '4px',
                                fontWeight: 600,
                                cursor: selectedAnswers.length > 0 ? 'pointer' : 'not-allowed',
                            }}
                        >
                            Auflösen
                        </button>
                    ) : (
                        currentQuestionIndex < exam.questions.length - 1 ? (
                            <button
                                onClick={handleNext}
                                style={{
                                    padding: '12px 32px',
                                    background: 'var(--primary)',
                                    color: 'black',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Nächste Frage
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                style={{
                                    padding: '12px 32px',
                                    background: 'var(--success)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Modul abschließen
                            </button>
                        )
                    )}
                </div>
            </Card>
        </div>
    );
}
