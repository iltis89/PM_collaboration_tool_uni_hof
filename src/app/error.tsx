'use client'

import { useEffect } from 'react'
import Link from 'next/link'

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
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            padding: '2rem',
            textAlign: 'center'
        }}>
            <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: 'var(--error)', marginBottom: '1rem' }}>
                error
            </span>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                Fehler aufgetreten
            </h2>
            <p style={{ color: 'var(--foreground-muted)', marginBottom: '2rem', maxWidth: '400px' }}>
                Beim Laden dieser Seite ist ein Fehler aufgetreten.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
                <button
                    onClick={reset}
                    style={{
                        padding: '12px 24px',
                        background: 'var(--accent)',
                        color: 'black',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}
                >
                    Erneut versuchen
                </button>
                <Link
                    href="/dashboard"
                    style={{
                        padding: '12px 24px',
                        background: 'var(--surface-highlight)',
                        color: 'var(--foreground)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '1rem',
                        textDecoration: 'none'
                    }}
                >
                    Zum Dashboard
                </Link>
            </div>
        </div>
    )
}
