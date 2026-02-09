'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import styles from './error-boundary.module.css'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Page error:', error)
    }, [error])

    return (
        <div className={styles.container}>
            <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: 'var(--error)', marginBottom: '1rem' }}>
                error
            </span>
            <h2 className={styles.heading}>
                Fehler aufgetreten
            </h2>
            <p className={styles.message}>
                Beim Laden dieser Seite ist ein Fehler aufgetreten.
            </p>
            <div className={styles.actions}>
                <button onClick={reset} className={styles.retryButton}>
                    Erneut versuchen
                </button>
                <Link href="/dashboard" className={styles.dashboardLink}>
                    Zum Dashboard
                </Link>
            </div>
        </div>
    )
}
