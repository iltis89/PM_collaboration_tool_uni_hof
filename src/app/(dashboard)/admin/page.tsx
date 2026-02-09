import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/app/actions';
import styles from './Admin.module.css';
import AdminTabs from './AdminTabs';

export default async function AdminPage() {
    const user = await getCurrentUser();

    if (!user || user.role !== 'ADMIN') {
        redirect('/dashboard');
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Admin Dashboard</h1>
                <p style={{ color: 'var(--foreground-muted)' }}>
                    Verwaltungscockpit für Prüfungen, Benutzer und Inhalte
                </p>
            </header>

            <AdminTabs />
        </div>
    );
}
