"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { login } from './actions';

export default function LandingPage() {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [loginType, setLoginType] = useState<'student' | 'admin'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(email, password);

      if (result.success) {
        if (result.requirePasswordChange) {
          router.push('/change-password');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(result.error || 'Login fehlgeschlagen');
      }
    } catch (err) {
      console.error(err);
      setError('Ein unerwarteter Fehler ist aufgetreten.');
    } finally {
      setLoading(false);
    }
  };

  // Demo login removed

  return (
    <main className={styles.main}>
      {/* Animated Background */}
      <div className={styles.bgWrapper}>
        <div className={styles.gradient1} />
        <div className={styles.gradient2} />
        <div className={styles.gradient3} />
        <div className={styles.particles}>
          {mounted && [...Array(20)].map((_, i) => (
            <div key={i} className={styles.particle} style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 20}s`
            }} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {!showLogin ? (
          <div className={styles.hero}>
            <div className={styles.badge}>
              <span className={styles.badgeDot} />
              Mobility Design · Project Management
            </div>

            <h1 className={styles.title}>
              Learn.
              <span className={styles.titleAccent}> Collaborate.</span>
              <br />Succeed.
            </h1>

            <p className={styles.subtitle}>
              Die interaktive Lernplattform für <strong>Projektmanagement</strong>.
              <br />Gamifiziert. Modern. Effektiv.
            </p>

            <div className={styles.features}>
              <div className={styles.feature}>
                <span className="material-symbols-outlined">school</span>
                Prüfungsmodus
              </div>
              <div className={styles.feature}>
                <span className="material-symbols-outlined">groups</span>
                Kollaboration
              </div>
              <div className={styles.feature}>
                <span className="material-symbols-outlined">bolt</span>
                XP & Levels
              </div>
            </div>

            <div className={styles.cta}>
              <button
                className={styles.primaryBtn}
                onClick={() => { setLoginType('student'); setShowLogin(true); }}
              >
                <span className="material-symbols-outlined">login</span>
                Studenten Login
              </button>
              <button
                className={styles.secondaryBtn}
                onClick={() => { setLoginType('admin'); setShowLogin(true); }}
              >
                Dozenten Login
              </button>
            </div>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>20+</span>
                <span className={styles.statLabel}>Studierende</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>12</span>
                <span className={styles.statLabel}>Vorlesungen</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>98%</span>
                <span className={styles.statLabel}>Bestehensquote</span>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.loginCard}>
            <button className={styles.backBtn} onClick={() => setShowLogin(false)}>
              <span className="material-symbols-outlined">arrow_back</span>
              Zurück
            </button>

            <h2 className={styles.loginTitle}>
              {loginType === 'student' ? 'Studenten' : 'Dozenten'} Login
            </h2>

            <form onSubmit={handleLogin} className={styles.loginForm}>
              <div className={styles.inputGroup}>
                <span className="material-symbols-outlined">mail</span>
                <input
                  type="email"
                  placeholder="E-Mail Adresse"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <span className="material-symbols-outlined">lock</span>
                <input
                  type="password"
                  placeholder="Passwort"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Wird geladen...' : 'Anmelden'}
              </button>
            </form>

            {/* Demo button removed */}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <a href="/datenschutz">Datenschutz</a>
        <span>&copy; {new Date().getFullYear()} Marcus Görner</span>
      </footer>
    </main>
  );
}
