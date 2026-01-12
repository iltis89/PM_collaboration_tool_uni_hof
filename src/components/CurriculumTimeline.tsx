"use client";
import styles from './CurriculumTimeline.module.css';

interface Topic {
    id: string;
    title: string;
    description: string | null;
    order: number;
    date: Date | null;
    status: 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED';
}

interface CurriculumTimelineProps {
    topics: Topic[];
    onTopicSelect: (topicId: string | null) => void;
    selectedTopicId: string | null;
}

export default function CurriculumTimeline({ topics, onTopicSelect, selectedTopicId }: CurriculumTimelineProps) {
    const sortedTopics = [...topics].sort((a, b) => a.order - b.order);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>Semester-Übersicht</h3>
                <button
                    className={styles.resetBtn}
                    onClick={() => onTopicSelect(null)}
                    style={{ opacity: selectedTopicId ? 1 : 0.5 }}
                >
                    Alle anzeigen
                </button>
            </div>

            <div className={styles.timelineWrapper}>
                <div className={styles.timeline}>
                    <div className={styles.progressLine} />
                    {sortedTopics.map((topic, _index) => (
                        <div
                            key={topic.id}
                            className={`${styles.topicNode} ${selectedTopicId === topic.id ? styles.active : ''} ${styles[topic.status.toLowerCase()]}`}
                            onClick={() => onTopicSelect(topic.id === selectedTopicId ? null : topic.id)}
                        >
                            <div className={styles.nodeCircle}>
                                <span className={styles.nodeNumber}>{topic.order}</span>
                                {topic.status === 'COMPLETED' && (
                                    <span className={`material-symbols-outlined ${styles.statusIcon}`}>check_circle</span>
                                )}
                                {topic.status === 'IN_PROGRESS' && (
                                    <span className={`material-symbols-outlined ${styles.statusIcon} ${styles.rotating}`}>sync</span>
                                )}
                            </div>

                            <div className={styles.nodeContent}>
                                <div className={styles.topicTitle}>{topic.title}</div>
                                {topic.date && (
                                    <div className={styles.topicDate}>
                                        {new Date(topic.date).toLocaleDateString('de-DE', { day: '2-digit', month: 'short' })}
                                    </div>
                                )}
                            </div>

                            {/* Tooltip on hover */}
                            {topic.description && (
                                <div className={styles.tooltip}>
                                    {topic.description}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
