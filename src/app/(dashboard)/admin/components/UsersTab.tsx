'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/Card'
import styles from '../Admin.module.css'
import type { User } from '../types'

export default function UsersTab() {
    const [users, setUsers] = useState<User[]>([])
    const [newUser, setNewUser] = useState({ email: '', name: '', password: '' })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadUsers()
    }, [])

    const loadUsers = async () => {
        const { getUsers } = await import('@/app/actions')
        const data = await getUsers()
        setUsers(data as User[])
        setIsLoading(false)
    }

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newUser.email || !newUser.name || !newUser.password) return

        const { createUser } = await import('@/app/actions')
        try {
            await createUser({ ...newUser, role: 'STUDENT' })
            alert('Benutzer angelegt!')
            setNewUser({ email: '', name: '', password: '' })
            loadUsers()
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Fehler beim Anlegen'
            alert(message)
        }
    }

    const handleDeleteUser = async (id: string) => {
        if (!confirm('Diesen Benutzer wirklich löschen?')) return

        const { deleteUser } = await import('@/app/actions')
        try {
            await deleteUser(id)
            setUsers(users.filter(u => u.id !== id))
        } catch {
            alert('Fehler beim Löschen')
        }
    }

    if (isLoading) {
        return <div style={{ color: 'var(--foreground-muted)' }}>Benutzer werden geladen...</div>
    }

    return (
        <div className={styles.tabContent}>
            <Card title="Neuen Benutzer anlegen">
                <form className={styles.form} onSubmit={handleCreateUser}>
                    <div className={styles.formGrid}>
                        <input
                            type="email"
                            placeholder="E-Mail"
                            value={newUser.email}
                            onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                            className={styles.input}
                        />
                        <input
                            type="text"
                            placeholder="Name"
                            value={newUser.name}
                            onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                            className={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="Passwort"
                            value={newUser.password}
                            onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                            className={styles.input}
                        />
                        <button type="submit" className={styles.submitBtn}>Anlegen</button>
                    </div>
                </form>
            </Card>

            <Card title="Registrierte Benutzer">
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>E-Mail</th>
                                <th>XP (Level)</th>
                                <th>Datenschutz?</th>
                                <th className={styles.actionsCol}>Aktionen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td className={styles.userNameCell}>{user.name}</td>
                                    <td className={styles.mutedCell}>{user.email}</td>
                                    <td>{user.xp} XP (Lvl {user.level})</td>
                                    <td>
                                        {user.privacyAccepted ? (
                                            <span className={styles.successText}>
                                                ✔ {new Date(user.privacyAcceptedAt!).toLocaleDateString()}
                                            </span>
                                        ) : (
                                            <span className={styles.errorText}>Ausstehend</span>
                                        )}
                                    </td>
                                    <td className={styles.actionsCol}>
                                        {user.role !== 'ADMIN' && (
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className={styles.deleteBtn}
                                                title="Löschen"
                                            >
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}
