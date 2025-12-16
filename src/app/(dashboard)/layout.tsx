import Sidebar from '@/components/Sidebar';
import PrivacyConsentWrapper from '@/components/PrivacyConsentWrapper';
import styles from './layout.module.css';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className={styles.layoutContainer}>
            <Sidebar />
            <main className={styles.mainContent}>
                <PrivacyConsentWrapper>
                    <div className="animate-fade-in">
                        {children}
                    </div>
                </PrivacyConsentWrapper>
            </main>
        </div>
    );
}
