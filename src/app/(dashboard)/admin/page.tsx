"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import styles from './Admin.module.css';
import { getCurrentUser } from '@/app/actions';

// Interfaces matching those in actions.ts or prisma schema
interface TopStudent {
    id: string;
    name: string;
    xp: number;
    level: number;
}

interface AdminStats {
    userCount: number;
    totalExams: number;
    passRate: number;
    topStudents: TopStudent[];
}

interface User {
    id: string;
    email: string;
    name: string;
    role: 'STUDENT' | 'ADMIN';
    xp: number;
    level: number;
    createdAt: Date;
    privacyAccepted: boolean;
    privacyAcceptedAt: Date | null;
}

interface Material {
    id: string;
    title: string;
    description: string | null;
    fileUrl: string | null;
    uploadedAt: Date;
}

interface News {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
}

interface AudioSnippet {
    id: string;
    title: string;
    description: string | null;
    url: string;
    uploadedAt: Date;
}

interface Lecture {
    id: string;
    title: string;
    description: string | null;
    room: string | null;
    professor: string | null;
    startTime: Date;
    endTime: Date;
}

export default function AdminPage() {
    const router = useRouter();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'materials' | 'news' | 'audio' | 'lectures'>('overview');
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    // Data Lists
    const [users, setUsers] = useState<User[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [news, setNews] = useState<News[]>([]);
    const [audioSnippets, setAudioSnippets] = useState<AudioSnippet[]>([]);
    const [lectures, setLectures] = useState<Lecture[]>([]);

    // Form states
    const [newUser, setNewUser] = useState({ email: '', name: '', password: '' });
    const [newMaterial, setNewMaterial] = useState({ title: '', description: '', file: null as File | null });
    const [newNews, setNewNews] = useState({ title: '', content: '' });
    const [newAudio, setNewAudio] = useState({ title: '', description: '', transcript: '', file: null as File | null });
    const [newLecture, setNewLecture] = useState({
        title: '',
        description: '',
        room: '',
        professor: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '11:30'
    });
    const [isUploading, setIsUploading] = useState(false);

    // Initial Auth Check
    useEffect(() => {
        getCurrentUser().then((user) => {
            if (!user || user.role !== 'ADMIN') {
                router.push('/dashboard');
            } else {
                setIsAdmin(true);
            }
            setIsLoading(false);
        });
    }, [router]);

    // Data Fetching based on Tab
    useEffect(() => {
        if (!isAdmin) return;

        const loadData = async () => {
            // Dynamically import actions
            const { getAdminStats, getUsers, getMaterials, getNews, getAudioSnippets, getLectures } = await import('@/app/actions');

            if (activeTab === 'overview') {
                getAdminStats().then(setStats);
            } else if (activeTab === 'users') {
                getUsers().then(data => setUsers(data as User[]));
            } else if (activeTab === 'materials') {
                getMaterials().then(data => setMaterials(data as Material[]));
            } else if (activeTab === 'news') {
                getNews().then(data => setNews(data as News[]));
            } else if (activeTab === 'audio') {
                getAudioSnippets().then(data => setAudioSnippets(data as AudioSnippet[]));
            } else if (activeTab === 'lectures') {
                getLectures().then(data => setLectures(data as Lecture[]));
            }
        };

        loadData();
    }, [activeTab, isAdmin]);

    // Handlers
    const handleDeleteUser = async (id: string) => {
        if (!confirm('Diesen Benutzer wirklich löschen?')) return;
        const { deleteUser } = await import('@/app/actions');
        try {
            await deleteUser(id);
            setUsers(users.filter(u => u.id !== id));
        } catch (e) { alert('Fehler beim Löschen'); }
    };

    const handleDeleteNews = async (id: string) => {
        if (!confirm('Diese Neuigkeit wirklich löschen?')) return;
        const { deleteNews } = await import('@/app/actions');
        try {
            await deleteNews(id);
            setNews(news.filter(n => n.id !== id));
        } catch (e) { alert('Fehler beim Löschen'); }
    };

    const handleDeleteMaterial = async (id: string) => {
        if (!confirm('Dieses Material wirklich löschen?')) return;
        const { deleteMaterial } = await import('@/app/actions');
        try {
            await deleteMaterial(id);
            setMaterials(materials.filter(m => m.id !== id));
        } catch (e) { alert('Fehler beim Löschen'); }
    };

    const handleDeleteAudio = async (id: string) => {
        if (!confirm('Diesen Audio-Snippet wirklich löschen?')) return;
        const { deleteAudioSnippet } = await import('@/app/actions');
        try {
            await deleteAudioSnippet(id);
            setAudioSnippets(audioSnippets.filter(a => a.id !== id));
        } catch (e) { alert('Fehler beim Löschen'); }
    };

    const handleDeleteLecture = async (id: string) => {
        if (!confirm('Diese Vorlesung wirklich löschen?')) return;
        const { deleteLecture } = await import('@/app/actions');
        try {
            await deleteLecture(id);
            setLectures(lectures.filter(l => l.id !== id));
        } catch (e) { alert('Fehler beim Löschen'); }
    };

    if (isLoading) return <div style={{ padding: '2rem', color: 'var(--foreground-muted)' }}>Lädt...</div>;
    if (!isAdmin) return null;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Admin Dashboard</h1>
                <p style={{ color: 'var(--foreground-muted)' }}>Verwaltungscockpit für Prüfungen, Benutzer und Inhalte</p>
            </header>

            <div className={styles.tabs}>
                {['overview', 'users', 'materials', 'news', 'audio', 'lectures'].map((tab) => (
                    <button
                        key={tab}
                        className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
                        onClick={() => setActiveTab(tab as any)}
                        style={{ textTransform: 'capitalize' }}
                    >
                        {tab === 'overview' && 'Übersicht'}
                        {tab === 'users' && 'Benutzer'}
                        {tab === 'materials' && 'Materialien'}
                        {tab === 'news' && 'Neuigkeiten'}
                        {tab === 'audio' && 'Audio'}
                        {tab === 'lectures' && 'Vorlesungen'}
                    </button>
                ))}
            </div>

            <div className={styles.content}>
                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && stats && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
                            <Card className={styles.statCard}>
                                <div style={{ padding: '10px' }}>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--foreground-muted)' }}>Studenten</div>
                                    <div style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.userCount}</div>
                                </div>
                            </Card>
                            <Card className={styles.statCard}>
                                <div style={{ padding: '10px' }}>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--foreground-muted)' }}>Prüfungen</div>
                                    <div style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.totalExams}</div>
                                </div>
                            </Card>
                            <Card className={styles.statCard}>
                                <div style={{ padding: '10px' }}>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--foreground-muted)' }}>Bestehensquote</div>
                                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>{stats.passRate}%</div>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {/* USERS TAB */}
                {activeTab === 'users' && (
                    <div style={{ display: 'grid', gap: '24px' }}>
                        <Card title="Neuen Benutzer anlegen">
                            <form className={styles.form} onSubmit={async (e) => {
                                e.preventDefault();
                                if (!newUser.email || !newUser.name || !newUser.password) return;
                                const { createUser, getUsers } = await import('@/app/actions');
                                try {
                                    await createUser({ ...newUser, role: 'STUDENT' });
                                    alert('Benutzer angelegt!');
                                    setNewUser({ email: '', name: '', password: '' });
                                    // Refresh list
                                    getUsers().then(data => setUsers(data as User[]));
                                } catch (err: any) { alert(err.message); }
                            }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '12px' }}>
                                    <input type="email" placeholder="E-Mail" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} className={styles.input} />
                                    <input type="text" placeholder="Name" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} className={styles.input} />
                                    <input type="password" placeholder="Passwort" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} className={styles.input} />
                                    <button type="submit" className={styles.submitBtn}>Anlegen</button>
                                </div>
                            </form>
                        </Card>

                        <Card title="Registrierte Benutzer">
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                                            <th style={{ padding: '12px' }}>Name</th>
                                            <th style={{ padding: '12px' }}>E-Mail</th>
                                            <th style={{ padding: '12px' }}>XP (Level)</th>
                                            <th style={{ padding: '12px' }}>Datenschutz?</th>
                                            <th style={{ padding: '12px', textAlign: 'right' }}>Aktionen</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr key={user.id} style={{ borderBottom: '1px solid var(--surface-highlight)' }}>
                                                <td style={{ padding: '12px', fontWeight: 600 }}>{user.name}</td>
                                                <td style={{ padding: '12px', color: 'var(--foreground-muted)' }}>{user.email}</td>
                                                <td style={{ padding: '12px' }}>{user.xp} XP (Lvl {user.level})</td>
                                                <td style={{ padding: '12px' }}>
                                                    {user.privacyAccepted ?
                                                        <span style={{ color: 'var(--success)' }}>✔ {new Date(user.privacyAcceptedAt!).toLocaleDateString()}</span> :
                                                        <span style={{ color: 'var(--error)' }}>Ausstehend</span>
                                                    }
                                                </td>
                                                <td style={{ padding: '12px', textAlign: 'right' }}>
                                                    {user.role !== 'ADMIN' && (
                                                        <button
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}
                                                            title="Löschen"
                                                        >
                                                            <span className="material-symbols-outlined">delete</span>
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                )}

                {/* MATERIALS TAB */}
                {activeTab === 'materials' && (
                    <div style={{ display: 'grid', gap: '24px' }}>
                        <Card title="Neues Material hochladen">
                            <form className={styles.form} onSubmit={async (e) => {
                                e.preventDefault();
                                if (!newMaterial.title || !newMaterial.file) return;

                                setIsUploading(true);
                                try {
                                    const { upload } = await import('@vercel/blob/client');

                                    const blob = await upload(newMaterial.file.name, newMaterial.file, {
                                        access: 'public',
                                        handleUploadUrl: '/api/upload',
                                    });

                                    const { createMaterial, getMaterials } = await import('@/app/actions');
                                    await createMaterial({
                                        title: newMaterial.title,
                                        description: newMaterial.description,
                                        fileUrl: blob.url
                                    });
                                    alert('Material hinzugefügt');
                                    setNewMaterial({ title: '', description: '', file: null });
                                    getMaterials().then(data => setMaterials(data as Material[]));
                                } catch (err: any) {
                                    console.error(err);
                                    alert('Fehler beim Upload: ' + err.message);
                                } finally {
                                    setIsUploading(false);
                                }
                            }}>
                                <input type="text" placeholder="Titel" value={newMaterial.title} onChange={e => setNewMaterial({ ...newMaterial, title: e.target.value })} className={styles.input} />
                                <input type="text" placeholder="Beschreibung" value={newMaterial.description} onChange={e => setNewMaterial({ ...newMaterial, description: e.target.value })} className={styles.input} />
                                <div style={{ marginBottom: '8px' }}>
                                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--foreground-muted)' }}>Datei auswählen</label>
                                    <input
                                        type="file"
                                        onChange={e => setNewMaterial({ ...newMaterial, file: e.target.files?.[0] || null })}
                                        className={styles.input}
                                        style={{ padding: '8px' }}
                                    />
                                </div>
                                <button type="submit" className={styles.submitBtn} disabled={isUploading}>
                                    {isUploading ? 'Lädt hoch...' : 'Hinzufügen'}
                                </button>
                            </form>
                        </Card>

                        <Card title="Vorhandene Materialien">
                            {materials.map(m => (
                                <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{m.title}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--foreground-muted)' }}>{m.description || 'Keine Beschreibung'}</div>
                                    </div>
                                    <button onClick={() => handleDeleteMaterial(m.id)} style={{ color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            ))}
                        </Card>
                    </div>
                )}

                {/* NEWS TAB */}
                {activeTab === 'news' && (
                    <div style={{ display: 'grid', gap: '24px' }}>
                        <Card title="Neuigkeit erstellen">
                            <form className={styles.form} onSubmit={async (e) => {
                                e.preventDefault();
                                if (!newNews.title || !newNews.content) return;
                                const { createNews, getNews } = await import('@/app/actions');
                                await createNews({ ...newNews, author: "Admin" });
                                alert('Veröffentlicht!');
                                setNewNews({ title: '', content: '' });
                                getNews().then(data => setNews(data as News[]));
                            }}>
                                <input type="text" placeholder="Titel" value={newNews.title} onChange={e => setNewNews({ ...newNews, title: e.target.value })} className={styles.input} />
                                <textarea placeholder="Inhalt" value={newNews.content} onChange={e => setNewNews({ ...newNews, content: e.target.value })} className={styles.textarea} rows={3} />
                                <button type="submit" className={styles.submitBtn}>Veröffentlichen</button>
                            </form>
                        </Card>

                        <Card title="Aktuelle Neuigkeiten">
                            {news.map(n => (
                                <div key={n.id} style={{ padding: '16px', background: 'var(--surface-highlight)', borderRadius: '8px', marginBottom: '12px', position: 'relative' }}>
                                    <button
                                        onClick={() => handleDeleteNews(n.id)}
                                        style={{ position: 'absolute', top: '10px', right: '10px', color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                    <h4 style={{ margin: '0 0 8px 0' }}>{n.title}</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--foreground-muted)', margin: 0 }}>{n.content}</p>
                                    <div style={{ fontSize: '0.75rem', marginTop: '8px', opacity: 0.5 }}>{new Date(n.createdAt).toLocaleDateString()}</div>
                                </div>
                            ))}
                        </Card>
                    </div>
                )}

                {/* AUDIO TAB */}
                {activeTab === 'audio' && (
                    <div style={{ display: 'grid', gap: '24px' }}>
                        <Card title="Neues Audio-Snippet">
                            <form className={styles.form} onSubmit={async (e) => {
                                e.preventDefault();
                                if (!newAudio.title || !newAudio.file) return;

                                setIsUploading(true);
                                try {
                                    const { upload } = await import('@vercel/blob/client');

                                    const blob = await upload(newAudio.file.name, newAudio.file, {
                                        access: 'public',
                                        handleUploadUrl: '/api/upload',
                                    });

                                    const { createAudioSnippet, getAudioSnippets } = await import('@/app/actions');
                                    await createAudioSnippet({
                                        title: newAudio.title,
                                        description: newAudio.description,
                                        transcript: newAudio.transcript,
                                        url: blob.url
                                    });
                                    alert('Audio hinzugefügt');
                                    setNewAudio({ title: '', description: '', transcript: '', file: null });
                                    getAudioSnippets().then(data => setAudioSnippets(data as AudioSnippet[]));
                                } catch (err: any) {
                                    console.error(err);
                                    alert('Fehler beim Upload: ' + err.message);
                                } finally {
                                    setIsUploading(false);
                                }
                            }}>
                                <input type="text" placeholder="Titel" value={newAudio.title} onChange={e => setNewAudio({ ...newAudio, title: e.target.value })} className={styles.input} />
                                <input type="text" placeholder="Beschreibung" value={newAudio.description} onChange={e => setNewAudio({ ...newAudio, description: e.target.value })} className={styles.input} />
                                <textarea
                                    placeholder="Transkript (Optional)"
                                    value={newAudio.transcript}
                                    onChange={e => setNewAudio({ ...newAudio, transcript: e.target.value })}
                                    className={styles.textarea}
                                    style={{ minHeight: '100px' }}
                                />
                                <div style={{ marginBottom: '8px' }}>
                                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--foreground-muted)' }}>Audio-Datei auswählen (MP3, WAV)</label>
                                    <input
                                        type="file"
                                        accept="audio/*"
                                        onChange={e => setNewAudio({ ...newAudio, file: e.target.files?.[0] || null })}
                                        className={styles.input}
                                        style={{ padding: '8px' }}
                                    />
                                </div>
                                <button type="submit" className={styles.submitBtn} disabled={isUploading}>
                                    {isUploading ? 'Lädt hoch...' : 'Hinzufügen'}
                                </button>
                            </form>
                        </Card>

                        <Card title="Vorhandene Audio-Snippets">
                            {audioSnippets.map(a => (
                                <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{a.title}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--foreground-muted)' }}>{a.description || 'Keine Beschreibung'}</div>
                                    </div>
                                    <button onClick={() => handleDeleteAudio(a.id)} style={{ color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            ))}
                        </Card>
                    </div>
                )}

                {/* LECTURES TAB */}
                {activeTab === 'lectures' && (
                    <div style={{ display: 'grid', gap: '24px' }}>
                        <Card title="Vorlesung planen">
                            <form className={styles.form} onSubmit={async (e) => {
                                e.preventDefault();
                                if (!newLecture.title || !newLecture.date) return;

                                const startDateTime = new Date(`${newLecture.date}T${newLecture.startTime}`);
                                const endDateTime = new Date(`${newLecture.date}T${newLecture.endTime}`);

                                const { createLecture, getLectures } = await import('@/app/actions');
                                await createLecture({
                                    title: newLecture.title,
                                    description: newLecture.description,
                                    room: newLecture.room,
                                    professor: newLecture.professor,
                                    startTime: startDateTime,
                                    endTime: endDateTime
                                });
                                alert('Vorlesung geplant!');
                                setNewLecture({ ...newLecture, title: '' });
                                getLectures().then(data => setLectures(data as Lecture[]));
                            }}>
                                <input type="text" placeholder="Titel" value={newLecture.title} onChange={e => setNewLecture({ ...newLecture, title: e.target.value })} className={styles.input} required />
                                <input type="text" placeholder="Beschreibung (optional)" value={newLecture.description} onChange={e => setNewLecture({ ...newLecture, description: e.target.value })} className={styles.input} />
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <input type="text" placeholder="Raum" value={newLecture.room} onChange={e => setNewLecture({ ...newLecture, room: e.target.value })} className={styles.input} />
                                    <input type="text" placeholder="Dozent" value={newLecture.professor} onChange={e => setNewLecture({ ...newLecture, professor: e.target.value })} className={styles.input} />
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <input type="date" value={newLecture.date} onChange={e => setNewLecture({ ...newLecture, date: e.target.value })} className={styles.input} required />
                                    <input type="time" value={newLecture.startTime} onChange={e => setNewLecture({ ...newLecture, startTime: e.target.value })} className={styles.input} required />
                                    <input type="time" value={newLecture.endTime} onChange={e => setNewLecture({ ...newLecture, endTime: e.target.value })} className={styles.input} required />
                                </div>
                                <button type="submit" className={styles.submitBtn}>Planen</button>
                            </form>
                        </Card>

                        <Card title="Geplante Vorlesungen">
                            {lectures.length === 0 && <p style={{ color: 'var(--foreground-muted)' }}>Keine Vorlesungen geplant.</p>}
                            {lectures.map(l => (
                                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{l.title}</div>
                                        <div style={{ color: 'var(--accent)', fontSize: '0.9rem', marginBottom: '4px' }}>
                                            {new Date(l.startTime).toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin' })} &middot; {new Date(l.startTime).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin' })}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--foreground-muted)' }}>
                                            {l.professor && <span>{l.professor}</span>}
                                            {l.room && <span> &middot; {l.room}</span>}
                                        </div>
                                    </div>
                                    <button onClick={() => handleDeleteLecture(l.id)} style={{ color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            ))}
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
