"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { changePassword } from '@/app/actions';
import styles from '../../page.module.css';

export default function ChangePasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 8) {
            setError('Das Passwort muss mindestens 8 Zeichen lang sein.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Die Passwörter stimmen nicht überein.');
            return;
        }

        setIsLoading(true);
        try {
            const result = await changePassword(password);
            if (result.success) {
                // Success - redirect to dashboard
                // Force a hard reload or router refresh to ensure auth state is clean
                router.refresh();
                router.push('/dashboard');
            }
        } catch (err) {
            setError('Ein unerwarteter Fehler ist aufgetreten.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--background)',
            padding: '20px'
        }}>
            <div className={styles.card} style={{ maxWidth: '400px', width: '100%', padding: '40px' }}>
                <h1 style={{ fontSize: '1.5rem', marginBottom: '10px', textAlign: 'center' }}>Passwort ändern</h1>
                <p style={{ color: 'var(--foreground-muted)', textAlign: 'center', marginBottom: '30px' }}>
                    Bitte legen Sie ein neues, sicheres Passwort für Ihren Account fest, um fortzufahren.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {error && (
                        <div style={{ padding: '12px', background: 'rgba(255, 50, 50, 0.1)', color: 'var(--error)', borderRadius: '8px', fontSize: '0.9rem' }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label htmlFor="password" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Neues Passwort</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                padding: '12px',
                                background: 'var(--surface)',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                color: 'var(--foreground)',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label htmlFor="confirm" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Passwort bestätigen</label>
                        <input
                            id="confirm"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            style={{
                                padding: '12px',
                                background: 'var(--surface)',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                color: 'var(--foreground)',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            padding: '14px',
                            background: 'var(--accent)',
                            color: '#000',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            opacity: isLoading ? 0.7 : 1,
                            marginTop: '10px'
                        }}
                    >
                        {isLoading ? 'Speichert...' : 'Passwort ändern'}
                    </button>
                </form>
            </div>
        </div>
    );
}
