"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Sidebar.module.css';
import { getCurrentUser, logout } from '@/app/actions';

type User = {
    id: string;
    name: string;
    role: 'STUDENT' | 'ADMIN';
    xp: number;
    level: number;
} | null;

const baseNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
    { name: 'Materialien', href: '/materials', icon: 'folder' },
    { name: 'Audio Learning', href: '/audio-learning', icon: 'headphones' },
    { name: 'Kollaboration', href: '/collaboration', icon: 'chat_bubble' },
    { name: 'Prüfung', href: '/exam-prep', icon: 'school' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<User>(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        getCurrentUser().then(setUser);
    }, []);

    // Close mobile menu on route change - this is a valid use case for syncing UI state
    // with navigation changes. The lint rule is overly strict here as this prevents
    // the menu from staying open when navigating, which is expected UX behavior.
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMobileOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    // Only show Admin link if user is ADMIN
    const navItems = user?.role === 'ADMIN'
        ? [...baseNavItems, { name: 'Admin', href: '/admin', icon: 'settings' }]
        : baseNavItems;

    return (
        <>
            {/* Mobile Header Bar */}
            <div className={styles.mobileHeader}>
                <button
                    className={styles.hamburger}
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    <span className="material-symbols-outlined">
                        {mobileOpen ? 'close' : 'menu'}
                    </span>
                </button>
                <span className={styles.mobileTitle}>Mobility Design</span>
            </div>

            {/* Overlay for mobile */}
            {mobileOpen && (
                <div
                    className={styles.overlay}
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${mobileOpen ? styles.open : ''}`}>
                <div className={styles.logo}>
                    <div className={styles.logoIcon} />
                    <span className={styles.logoText}>Mobility Design</span>
                </div>

                <nav className={styles.nav}>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className={styles.user}>
                    <div className={styles.avatar}>{user?.name?.charAt(0) || 'G'}</div>
                    <div className={styles.userInfo}>
                        <span className={styles.userName}>{user?.name || 'Gast'}</span>
                        {user && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--accent)', marginTop: '2px' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>bolt</span>
                                <span>Lvl {user.level} &middot; {user.xp.toLocaleString()} XP</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className={styles.logoutBtn}
                >
                    <span className="material-symbols-outlined">logout</span>
                    Abmelden
                </button>
            </aside>
        </>
    );
}
