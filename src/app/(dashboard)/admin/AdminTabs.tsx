"use client";

import { useState } from 'react';
import styles from './Admin.module.css';
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

export default function AdminTabs() {
    const [activeTab, setActiveTab] = useState<TabType>('overview');

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
        <>
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
        </>
    );
}
