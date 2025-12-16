"use client";

import styles from './DocumentViewer.module.css';

interface DocumentViewerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    fileUrl?: string;
}

export default function DocumentViewer({ isOpen, onClose, title, fileUrl }: DocumentViewerProps) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={`${styles.modal} glass`} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    <div className={styles.actions}>
                        {fileUrl && (
                            <a href={fileUrl} download target="_blank" rel="noopener noreferrer" className={styles.actionBtn}>
                                <span className="material-symbols-outlined">download</span>
                            </a>
                        )}
                        <button className={styles.closeBtn} onClick={onClose}>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>

                <div className={styles.content}>
                    {fileUrl ? (
                        <div style={{ width: '100%', height: '100%', background: '#fff' }}>
                            <iframe
                                src={fileUrl}
                                style={{ width: '100%', height: '100%', border: 'none' }}
                                title={title}
                            />
                        </div>
                    ) : (
                        /* Mock PDF Viewer Placeholder */
                        <div className={styles.placeholder}>
                            <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: 'var(--accent)', opacity: 0.5 }}>picture_as_pdf</span>
                            <p>Vorschau Modus (Keine Datei)</p>
                            <div className={styles.mockPage} />
                            <div className={styles.mockPage} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
