"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Admin.module.css';
import { getCurrentUser } from '@/app/actions';
import {
    OverviewTab,
    UsersTab,
    MaterialsTab,
    NewsTab,
    AudioTab,
    LecturesTab,
    CurriculumTab
} from './components';

type TabType = 'overview' | 'users' | 'materials' | 'news' | 'audio' | 'lectures' | 'curriculum';

const TAB_LABELS: Record<TabType, string> = {
    overview: 'Übersicht',
    users: 'Benutzer',
    materials: 'Materialien',
    news: 'Neuigkeiten',
    audio: 'Audio',
    lectures: 'Vorlesungen',
    curriculum: 'Lehrplan'
};

export default function AdminPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

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

    if (isLoading) {
        return <div style={{ padding: '2rem', color: 'var(--foreground-muted)' }}>Lädt...</div>;
    }

    if (!isAdmin) {
        return null;
    }

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'overview': return <OverviewTab />;
            case 'users': return <UsersTab />;
            case 'materials': return <MaterialsTab />;
            case 'news': return <NewsTab />;
            case 'audio': return <AudioTab />;
            case 'lectures': return <LecturesTab />;
            case 'curriculum': return <CurriculumTab />;
            default: return null;
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Admin Dashboard</h1>
                <p style={{ color: 'var(--foreground-muted)' }}>
                    Verwaltungscockpit für Prüfungen, Benutzer und Inhalte
                </p>
            </header>

            <div className={styles.tabs}>
                {(Object.keys(TAB_LABELS) as TabType[]).map((tab) => (
                    <button
                        key={tab}
                        className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {TAB_LABELS[tab]}
                    </button>
                ))}
            </div>

            <div className={styles.content}>
                {renderActiveTab()}
            </div>
        </div>
    );
}
