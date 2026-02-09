'use client'

import { useEffect } from 'react'
import styles from './error-boundary.module.css'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Global error:', error)
    }, [error])

    return (
        <html>
            <body>
                <div className={styles.containerFull}>
                    <h1 className={styles.headingLarge}>
                        Etwas ist schiefgelaufen
                    </h1>
                    <p className={styles.messageDark}>
                        Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.
                    </p>
                    <button onClick={reset} className={styles.retryButtonGlobal}>
                        Erneut versuchen
                    </button>
                    {process.env.NODE_ENV === 'development' && (
                        <pre className={styles.devError}>
                            {error.message}
                        </pre>
                    )}
                </div>
            </body>
        </html>
    )
}
