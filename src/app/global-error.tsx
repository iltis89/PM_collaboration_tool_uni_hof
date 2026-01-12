'use client'

import { useEffect } from 'react'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log error to console (in production, send to error tracking service)
        console.error('Global error:', error)
    }, [error])

    return (
        <html>
            <body>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    padding: '2rem',
                    textAlign: 'center',
                    fontFamily: 'system-ui, sans-serif',
                    background: '#0a0a0a',
                    color: '#ededed'
                }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                        Etwas ist schiefgelaufen
                    </h1>
                    <p style={{ color: '#888', marginBottom: '2rem', maxWidth: '400px' }}>
                        Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.
                    </p>
                    <button
                        onClick={reset}
                        style={{
                            padding: '12px 24px',
                            background: '#22c55e',
                            color: 'black',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        Erneut versuchen
                    </button>
                    {process.env.NODE_ENV === 'development' && (
                        <pre style={{
                            marginTop: '2rem',
                            padding: '1rem',
                            background: '#1a1a1a',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            color: '#ef4444',
                            maxWidth: '100%',
                            overflow: 'auto',
                            textAlign: 'left'
                        }}>
                            {error.message}
                        </pre>
                    )}
                </div>
            </body>
        </html>
    )
}
