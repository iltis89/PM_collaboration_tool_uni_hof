"use client";

import { useState, useRef, useEffect } from 'react';
import styles from './AudioPlayer.module.css';

interface AudioSnippet {
    id: string;
    title: string;
    description?: string | null;
    url: string;
    transcript?: string | null;
}

export default function AudioPlayer({ snippet }: { snippet: AudioSnippet }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [volume, setVolume] = useState(1);
    const [showTranscript, setShowTranscript] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);
        const onEnded = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', onEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', onEnded);
        };
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!audioRef.current) return;
        const time = Number(e.target.value);
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    };

    const skipTime = (seconds: number) => {
        if (!audioRef.current) return;
        audioRef.current.currentTime += seconds;
    };

    const toggleSpeed = () => {
        if (!audioRef.current) return;
        const rates = [1, 1.5, 2];
        const nextIndex = (rates.indexOf(playbackRate) + 1) % rates.length;
        const nextRate = rates[nextIndex];
        audioRef.current.playbackRate = nextRate;
        setPlaybackRate(nextRate);
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className={styles.playerContainer}>
            <audio ref={audioRef} src={snippet.url} />

            <div className={styles.header}>
                <h3 className={styles.title}>{snippet.title}</h3>
                <a href={snippet.url} download target="_blank" rel="noopener noreferrer" className={styles.downloadBtn}>
                    <span className="material-symbols-outlined">download</span>
                    Herunterladen
                </a>
            </div>

            {snippet.description && <p className={styles.description}>{snippet.description}</p>}

            <div className={styles.controlsLayout}>
                <div className={styles.progressContainer}>
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className={styles.progressBar}
                        style={{ backgroundSize: `${(currentTime / duration) * 100}% 100%` }}
                    />
                    <div className={styles.timeInfo}>
                        <span>{formatTime(currentTime)}</span>

                    </div>
                </div>

                <div className={styles.mainControls}>
                    <button onClick={toggleSpeed} className={styles.speedBtn}>
                        {playbackRate}X
                    </button>

                    <button onClick={() => skipTime(-10)} className={styles.secondaryBtn}>
                        <span className="material-symbols-outlined">replay_10</span>
                    </button>

                    <button onClick={togglePlay} className={styles.playBtn}>
                        <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>
                            {isPlaying ? 'pause' : 'play_arrow'}
                        </span>
                    </button>

                    <button onClick={() => skipTime(10)} className={styles.secondaryBtn}>
                        <span className="material-symbols-outlined">forward_10</span>
                    </button>

                    <button className={styles.secondaryBtn} style={{ opacity: 0, pointerEvents: 'none' }}>
                        <span className="material-symbols-outlined">more_vert</span>
                    </button>

                </div>

                {snippet.transcript && (
                    <div style={{ marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                        <button
                            onClick={() => setShowTranscript(!showTranscript)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--accent)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: 0,
                                marginBottom: '12px'
                            }}
                        >
                            <span className="material-symbols-outlined">{showTranscript ? 'expand_less' : 'expand_more'}</span>
                            {showTranscript ? 'Transkript verbergen' : 'Transkript anzeigen'}
                        </button>

                        {showTranscript && (
                            <div className="animate-fade-in" style={{
                                background: 'var(--surface-highlight)',
                                padding: '16px',
                                borderRadius: '8px',
                                lineHeight: 1.6,
                                fontSize: '0.95rem',
                                color: 'var(--foreground-muted)'
                            }}>
                                {snippet.transcript}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
