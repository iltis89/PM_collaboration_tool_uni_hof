"use client";

import { useState, useEffect, use } from 'react';
import Card from '@/components/Card';
import { useRouter } from 'next/navigation';
import { getExam, submitExam } from '@/app/actions';

interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correct: number;
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
    const [answers, setAnswers] = useState<{ [key: string]: number }>({});
    const [checked, setChecked] = useState(false); // New state to track if current question was checked
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getExam(examId)
            .then(data => {
                if (data) {
                    setExam(data);
                }
                setLoading(false);
            })
            .catch((err) => {
                // Redirect bei Zugriff auf gesperrte Prüfung
                if (err.message?.includes('Themenblock') || err.message?.includes('bestanden')) {
                    router.push('/exam-prep');
                } else {
                    console.error(err);
                    setLoading(false);
                }
            });
    }, [examId, router]);



    async function handleSubmit() {
        if (!exam) return;
        try {
            await submitExam(exam.id, answers);
            alert('Lernmodul abgeschlossen! XP gutgeschrieben.');
            router.push('/exam-prep/history');
        } catch (e) {
            console.error(e);
            alert('Fehler: ' + (e instanceof Error ? e.message : 'Unbekannter Fehler beim Speichern.'));
        }
    }

    const handleNext = () => {
        setChecked(false);
        setCurrentQuestionIndex(prev => prev + 1);
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Lade Modul...</div>;
    if (!exam) return <div style={{ padding: '40px', textAlign: 'center' }}>Modul nicht gefunden.</div>;

    const currentQuestion = exam.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / exam.questions.length) * 100;
    const selectedAnswer = answers[currentQuestion.id];
    const isCorrect = selectedAnswer === currentQuestion.correct;



    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{exam.title}</h1>
            </div>

            <Card className="glass-card" style={{ padding: '48px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, height: '4px', background: 'var(--primary)', width: `${progress}%`, transition: 'width 0.3s' }} />

                <div style={{ marginBottom: '32px', color: 'var(--foreground-muted)' }}>
                    Frage {currentQuestionIndex + 1} von {exam.questions.length}
                </div>

                <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '32px', lineHeight: 1.4 }}>
                    {currentQuestion.question}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {currentQuestion.options.map((option: string, idx: number) => {
                        const isSelected = selectedAnswer === idx;
                        let borderColor = 'var(--border)';
                        let bgColor = 'transparent';
                        let textColor = 'var(--foreground)';

                        if (checked) {
                            if (idx === currentQuestion.correct) {
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
                                onClick={() => !checked && setAnswers({ ...answers, [currentQuestion.id]: idx })}
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
                                    opacity: (checked && !isSelected && idx !== currentQuestion.correct) ? 0.5 : 1
                                }}
                            >
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
                            disabled={selectedAnswer === undefined}
                            style={{
                                padding: '12px 32px',
                                background: selectedAnswer !== undefined ? 'var(--accent)' : 'var(--surface-highlight)',
                                color: selectedAnswer !== undefined ? 'white' : 'var(--foreground-muted)',
                                border: 'none',
                                borderRadius: '4px',
                                fontWeight: 600,
                                cursor: selectedAnswer !== undefined ? 'pointer' : 'not-allowed',
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
