"use client";

import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/app/actions';
import PrivacyConsentModal from './PrivacyConsentModal';

interface User {
    id: string;
    name: string;
    role: 'STUDENT' | 'ADMIN';
    xp: number;
    level: number;
    privacyAccepted: boolean;
}

export default function PrivacyConsentWrapper({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [showConsent, setShowConsent] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCurrentUser().then(data => {
            if (data) {
                setUser(data as User);
                // Show consent modal if user is a student and hasn't accepted privacy
                if (data.role === 'STUDENT' && !data.privacyAccepted) {
                    setShowConsent(true);
                }
            }
            setLoading(false);
        });
    }, []);

    const handleAccept = () => {
        setShowConsent(false);
        if (user) {
            setUser({ ...user, privacyAccepted: true });
        }
    };

    if (loading) {
        return <>{children}</>;
    }

    return (
        <>
            {showConsent && <PrivacyConsentModal onAccept={handleAccept} />}
            {children}
        </>
    );
}
