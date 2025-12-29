"use client";

import { useState } from 'react';
import { acceptPrivacy } from '@/app/actions';

interface PrivacyConsentModalProps {
    onAccept: () => void;
}

export default function PrivacyConsentModal({ onAccept }: PrivacyConsentModalProps) {
    const [loading, setLoading] = useState(false);

    const handleAccept = async () => {
        setLoading(true);
        try {
            await acceptPrivacy();
            onAccept();
        } catch (error) {
            console.error('Failed to accept privacy policy', error);
            alert('Fehler beim Speichern der Einwilligung.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
        }}>
            <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '80vh',
                overflow: 'auto',
                padding: '32px'
            }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px', color: 'var(--foreground)' }}>
                    Datenschutzvereinbarung
                </h2>

                <div style={{
                    background: 'var(--surface-highlight)',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '24px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    fontSize: '0.9rem',
                    lineHeight: 1.7,
                    color: 'var(--foreground-muted)'
                }}>
                    <h3 style={{ color: 'var(--foreground)', marginTop: '24px', marginBottom: '12px' }}>Datenschutzerklärung für die Nutzung der E-Learning Plattform</h3>

                    <p style={{ marginBottom: '16px', fontWeight: 'bold' }}>
                        Präambel
                    </p>
                    <p style={{ marginBottom: '16px' }}>
                        Der Schutz Ihrer persönlichen Daten hat für uns höchste Priorität. Nachfolgend informieren wir Sie ausführlich über den Umgang mit Ihren Daten gemäß Art. 13 der Datenschutz-Grundverordnung (DSGVO).
                    </p>

                    <h3 style={{ color: 'var(--foreground)', marginTop: '24px', marginBottom: '12px' }}>1. Verantwortliche Stelle</h3>
                    <p style={{ marginBottom: '16px' }}>
                        Verantwortlich für die Datenverarbeitung auf dieser Plattform ist:<br /><br />
                        <strong>Marcus Görner</strong><br />
                        an der Beermahd 12<br />
                        82229 Hechendorf<br />
                        Deutschland<br />
                        E-Mail: marcus.goener@requestchange.eu<br />
                    </p>

                    <h3 style={{ color: 'var(--foreground)', marginTop: '24px', marginBottom: '12px' }}>2. Art der verarbeiteten Daten</h3>
                    <p style={{ marginBottom: '16px' }}>
                        Im Rahmen Ihrer Nutzung dieser Plattform verarbeiten wir folgende Kategorien personenbezogener Daten:
                    </p>
                    <ul style={{ marginBottom: '16px', paddingLeft: '20px' }}>
                        <li><strong>Stammdaten:</strong> Name, Vorname, E-Mail-Adresse, Matrikelnummer (falls hinterlegt).</li>
                        <li><strong>Nutzungsdaten:</strong> Login-Zeitpunkte, IP-Adressen (anonymisiert), Session-IDs.</li>
                        <li><strong>Leistungsdaten:</strong> Lernfortschritt, Prüfungsergebnisse, XP-Punkte, erreichte Level, Badges.</li>
                        <li><strong>Kommunikationsdaten:</strong> Beiträge in Foren, Chats und Nachrichten an Dozenten.</li>
                    </ul>

                    <h3 style={{ color: 'var(--foreground)', marginTop: '24px', marginBottom: '12px' }}>3. Zwecke und Rechtsgrundlagen der Verarbeitung</h3>
                    <p style={{ marginBottom: '16px' }}>
                        Dies ist ein privates Projekt im Rahmen einer Gastdozentur und kein offizielles Angebot der Hochschule Hof. Wir verarbeiten Ihre Daten zu folgenden Zwecken:
                    </p>
                    <ul style={{ marginBottom: '16px', paddingLeft: '20px' }}>
                        <li><strong>Durchführung des Lehrbetriebs:</strong> Zur Bereitstellung der Lernmaterialien und Durchführung von Prüfungen.</li>
                        <li><strong>Leistungsbewertung:</strong> Zur Dokumentation Ihres Studienfortschritts.</li>
                        <li><strong>Sicherheit der Plattform:</strong> Zur Verhinderung von Missbrauch und Sicherstellung der Systemstabilität (Art. 6 Abs. 1 lit. f DSGVO).</li>
                        <li><strong>Einwilligung:</strong> Für optionale Funktionen wie Profilbilder oder freiwillige Angaben (Art. 6 Abs. 1 lit. a DSGVO).</li>
                    </ul>

                    <h3 style={{ color: 'var(--foreground)', marginTop: '24px', marginBottom: '12px' }}>4. Empfänger der Daten</h3>
                    <p style={{ marginBottom: '16px' }}>
                        Ihre Daten werden grundsätzlich nicht an Dritte weitergegeben. Ausnahmen:
                    </p>
                    <ul style={{ marginBottom: '16px', paddingLeft: '20px' }}>
                        <li><strong>Dozenten/Prüfer:</strong> Erhalten Zugriff auf leistungsrelevante Daten.</li>
                        <li><strong>IT-Dienstleister:</strong> Hoster (Vercel, Neon DB) verarbeiten Daten in unserem Auftrag. Die Datenverarbeitung erfolgt ausschließlich auf Servern innerhalb der Europäischen Union (Region: Frankfurt am Main), sodass kein Drittlandtransfer stattfindet.</li>
                        <li><strong>Gesetzliche Verpflichtung:</strong> Behörden oder Gerichte bei vorliegender gesetzlicher Verpflichtung.</li>
                    </ul>

                    <h3 style={{ color: 'var(--foreground)', marginTop: '24px', marginBottom: '12px' }}>5. Speicherdauer</h3>
                    <p style={{ marginBottom: '16px' }}>
                        Ihre Daten werden gelöscht, sobald sie für die Erreichung des Zweckes nicht mehr erforderlich sind.
                        Für prüfungsrelevante Daten gelten die gesetzlichen Aufbewahrungsfristen der Prüfungsordnung (in der Regel 5 Jahre nach Exmatrikulation).
                        Logs werden nach 7 Tagen automatisch gelöscht.
                    </p>

                    <h3 style={{ color: 'var(--foreground)', marginTop: '24px', marginBottom: '12px' }}>6. Ihre Rechte</h3>
                    <p style={{ marginBottom: '16px' }}>
                        Sie haben jederzeit das Recht auf:
                    </p>
                    <ul style={{ marginBottom: '16px', paddingLeft: '20px' }}>
                        <li><strong>Auskunft (Art. 15 DSGVO):</strong> Über die zu Ihnen gespeicherten Daten.</li>
                        <li><strong>Berichtigung (Art. 16 DSGVO):</strong> Falscher personenbezogener Daten.</li>
                        <li><strong>Löschung (Art. 17 DSGVO):</strong> Sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</li>
                        <li><strong>Einschränkung der Verarbeitung (Art. 18 DSGVO).</strong></li>
                        <li><strong>Datenübertragbarkeit (Art. 20 DSGVO).</strong></li>
                        <li><strong>Widerspruch (Art. 21 DSGVO):</strong> Gegen die Verarbeitung auf Basis berechtigter Interessen.</li>
                    </ul>
                    <p style={{ marginBottom: '16px' }}>
                        Sie haben zudem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren (Bayerisches Landesamt für Datenschutzaufsicht).
                    </p>

                    <h3 style={{ color: 'var(--foreground)', marginTop: '24px', marginBottom: '12px' }}>7. Kontakt</h3>
                    <p style={{ marginBottom: '16px' }}>
                        Bei Fragen zum Datenschutz wenden Sie sich bitte an:<br />
                        marcus.goener@requestchange.eu
                    </p>

                    <h3 style={{ color: 'var(--foreground)', marginTop: '24px', marginBottom: '12px' }}>8. Nutzungsbedingungen & Haftungsausschluss</h3>
                    <p style={{ marginBottom: '16px' }}>
                        <strong>Haftungsausschluss:</strong> Diese Anwendung ist ein Prototyp und wird ausschließlich zu Demonstrationszwecken im Rahmen der Lehre bereitgestellt ("As-is"). Es wird keine Gewähr für die Richtigkeit, Vollständigkeit oder ständige Verfügbarkeit übernommen. Jegliche Haftung für Schäden, die direkt oder indirekt aus der Nutzung entstehen (insbesondere Datenverlust), wird ausgeschlossen, soweit dies gesetzlich zulässig ist.
                    </p>

                    <h3 style={{ color: 'var(--foreground)', marginTop: '24px', marginBottom: '12px' }}>Impressum</h3>
                    <p style={{ marginBottom: '16px' }}>
                        Angaben gemäß § 5 DDG:<br /><br />
                        Marcus Görner<br />
                        an der Beermahd 12<br />
                        82229 Hechendorf<br />
                        <br />
                        Kontakt:<br />
                        E-Mail: marcus.goener@requestchange.eu
                    </p>
                </div>

                <div style={{
                    background: 'rgba(0, 255, 102, 0.1)',
                    border: '1px solid var(--accent)',
                    padding: '16px',
                    borderRadius: '8px',
                    marginBottom: '24px'
                }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--foreground)' }}>
                        <strong>Einwilligung:</strong> Mit dem Klick auf "Akzeptieren und fortfahren"
                        bestätige ich, dass ich die Datenschutzvereinbarung gelesen habe und
                        mit der Verarbeitung meiner Daten zu den genannten Zwecken einverstanden bin.
                    </p>
                </div>

                <button
                    onClick={handleAccept}
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '16px',
                        background: 'var(--accent)',
                        color: 'black',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 700,
                        fontSize: '1rem',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? 'Wird gespeichert...' : 'Akzeptieren und fortfahren'}
                </button>
            </div>
        </div>
    );
}
