import Link from 'next/link';
import Card from '@/components/Card';
import ProgressCircle from '@/components/ProgressCircle';
import NewsCard from '@/components/NewsCard';
import { getDashboardData } from '@/app/actions';

export default async function Dashboard() {
    const data = await getDashboardData();
    const user = data?.user;
    const upcomingLectures = data?.upcomingLectures || [];
    const latestNews = data?.latestNews;

    if (!user) {
        return <div>Bitte anmelden.</div>;
    }

    // Calculate level progress (simple logic for now)
    const xpForNextLevel = user.level * 1000;
    const progressPercentage = Math.min(100, Math.round((user.xp / xpForNextLevel) * 100));

    return (
        <div>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Hallo, {user.name.split(' ')[0]} 👋</h1>
                <p style={{ color: 'var(--foreground-muted)', fontSize: 'clamp(0.85rem, 3vw, 1rem)' }}>
                    XP sammelst du durch Quizzes (10 XP) und bestandene Module (50 XP).
                </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                <Card title="Mein Fortschritt">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 0', gap: '24px' }}>
                        <ProgressCircle percentage={progressPercentage} label="Level" />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ fontSize: '0.9rem', color: 'var(--foreground-muted)' }}>Level <strong style={{ color: 'white' }}>{user.level}</strong></div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--foreground-muted)' }}>XP: <strong style={{ color: 'white' }}>{user.xp}</strong> / {xpForNextLevel}</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--foreground-muted)' }}>Serie: <strong style={{ color: 'var(--accent)' }}>{user.streak || 0} Tage 🔥</strong></div>
                        </div>
                    </div>

                    <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', color: 'var(--foreground)' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>info</span>
                            <strong>Wie sammle ich XP?</strong>
                        </div>
                        <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <li>Richtige Quiz-Antwort: <strong>10 XP</strong></li>
                            <li>Bestandene Prüfung: <strong>50 XP</strong></li>
                        </ul>
                    </div>
                </Card>

                <Card title="Aktionen">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <Link href="/exam-prep" style={{ textDecoration: 'none' }}>
                            <button style={{
                                width: '100%',
                                padding: '24px',
                                background: 'var(--surface-highlight)',
                                border: 'none',
                                borderRadius: 'var(--radius-sm)',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                                transition: 'var(--transition-fast)'
                            }}>
                                <span className="material-symbols-outlined" style={{ color: 'var(--accent)' }}>school</span>
                                <span>Lernen</span>
                            </button>
                        </Link>
                        <Link href="/collaboration" style={{ textDecoration: 'none' }}>
                            <button style={{
                                width: '100%',
                                padding: '24px',
                                background: 'var(--surface-highlight)',
                                border: 'none',
                                borderRadius: 'var(--radius-sm)',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                                transition: 'var(--transition-fast)'
                            }}>
                                <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>forum</span>
                                <span>Forum</span>
                            </button>
                        </Link>
                    </div>
                </Card>

                <Card title="Geplante Vorlesungen">
                    {upcomingLectures.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
                            {upcomingLectures.map((lecture: { id: string; title: string; startTime: Date; room: string | null; professor: string | null }, index: number) => (
                                <div key={lecture.id} style={{
                                    padding: '12px 0',
                                    borderBottom: index < upcomingLectures.length - 1 ? '1px solid var(--border)' : 'none'
                                }}>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--accent)', marginBottom: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>schedule</span>
                                        {new Date(lecture.startTime).toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin' })} {new Date(lecture.startTime).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin' })} Uhr (MEZ)
                                    </div>
                                    <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '4px' }}>{lecture.title}</div>
                                    <div style={{ color: 'var(--foreground-muted)', fontSize: '0.8rem' }}>
                                        {lecture.room && <span>{lecture.room} &middot; </span>}
                                        {lecture.professor}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--foreground-muted)' }}>
                            Keine anstehenden Vorlesungen.
                        </div>
                    )}
                </Card>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '24px' }}>Neuigkeiten &amp; Insights</h2>
            {latestNews ? (
                <NewsCard
                    id={latestNews.id}
                    title={latestNews.title}
                    content={latestNews.content}
                    createdAt={latestNews.createdAt}
                    currentUserId={user.id}
                />
            ) : (
                <div style={{ color: 'var(--foreground-muted)' }}>Keine Neuigkeiten verfügbar.</div>
            )}
        </div>
    );
}

