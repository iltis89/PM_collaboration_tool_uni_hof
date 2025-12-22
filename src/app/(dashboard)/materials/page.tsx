"use client";

import { useState, useEffect } from 'react';
import { getMaterials, getCurriculumTopics } from '@/app/actions';
import CurriculumTimeline from '@/components/CurriculumTimeline';
import styles from './materials.module.css';

interface Material {
    id: string;
    title: string;
    description: string | null;
    fileUrl: string | null;
    uploadedAt: Date;
    topicId: string | null;
}

interface Topic {
    id: string;
    title: string;
    description: string | null;
    order: number;
    date: Date | null;
    status: 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED';
}

export default function Materials() {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const [matsData, topicsData] = await Promise.all([
                getMaterials(),
                getCurriculumTopics()
            ]);
            setMaterials(matsData as Material[]);
            setTopics(topicsData as Topic[]);
            setIsLoading(false);
        };
        loadData();
    }, []);

    const filteredMaterials = selectedTopicId
        ? materials.filter(m => m.topicId === selectedTopicId)
        : materials;

    return (
        <div className={styles.outerContainer}>
            <CurriculumTimeline
                topics={topics}
                onTopicSelect={setSelectedTopicId}
                selectedTopicId={selectedTopicId}
            />

            <div className={styles.container}>
                {/* Left Panel - Material List */}
                <aside className={styles.sidebar}>
                    <header className={styles.sidebarHeader}>
                        <h1>Materialien</h1>
                        <p>
                            {selectedTopicId
                                ? `Thema: ${topics.find(t => t.id === selectedTopicId)?.title}`
                                : 'Alle Vorlesungsfolien und Zusatzmaterialien'}
                        </p>
                    </header>

                    <div className={styles.materialList}>
                        {isLoading && <p className={styles.loadingText}>Lade Materialien...</p>}
                        {!isLoading && filteredMaterials.length === 0 && (
                            <p className={styles.loadingText}>
                                {selectedTopicId
                                    ? 'Keine Materialien für dieses Thema.'
                                    : 'Keine Materialien vorhanden.'}
                            </p>
                        )}

                        {filteredMaterials.map((file) => (
                            <button
                                key={file.id}
                                className={`${styles.materialItem} ${selectedMaterial?.id === file.id ? styles.active : ''}`}
                                onClick={() => setSelectedMaterial(file)}
                            >
                                <div className={styles.materialIcon}>
                                    <span className="material-symbols-outlined">description</span>
                                </div>
                                <div className={styles.materialInfo}>
                                    <span className={styles.materialTitle}>{file.title}</span>
                                    <span className={styles.materialMeta}>
                                        {file.description || 'Keine Beschreibung'} · {new Date(file.uploadedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Right Panel - PDF Viewer */}
                <main className={styles.viewerPanel}>
                    {selectedMaterial ? (
                        <>
                            <header className={styles.viewerHeader}>
                                <h2>{selectedMaterial.title}</h2>
                                <div className={styles.viewerActions}>
                                    {selectedMaterial.fileUrl && (
                                        <a
                                            href={selectedMaterial.fileUrl}
                                            download
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.downloadBtn}
                                        >
                                            <span className="material-symbols-outlined">download</span>
                                            Download
                                        </a>
                                    )}
                                </div>
                            </header>

                            <div className={styles.viewerContent}>
                                {selectedMaterial.fileUrl ? (
                                    <iframe
                                        src={selectedMaterial.fileUrl}
                                        className={styles.pdfFrame}
                                        title={selectedMaterial.title}
                                    />
                                ) : (
                                    <div className={styles.noPreview}>
                                        <span className="material-symbols-outlined">picture_as_pdf</span>
                                        <p>Keine Vorschau verfügbar</p>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className={styles.emptyState}>
                            <span className="material-symbols-outlined">folder_open</span>
                            <h3>Wähle ein Material aus</h3>
                            <p>Klicke auf ein Dokument in der linken Liste, oder wähle oben ein Thema aus.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
