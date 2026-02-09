"use client";

import { useState } from 'react';
import { acceptPrivacy } from '@/app/actions';
import styles from './PrivacyConsentModal.module.css';

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
        } catch (err) {
            console.error('Failed to accept privacy policy', err);
            alert('Fehler beim Speichern der Einwilligung.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2 className={styles.title}>
                    Datenschutzvereinbarung
                </h2>

                <div className={styles.scrollBox}>
                    <h3 className={styles.sectionHeading}>Datenschutzerklärung für die Nutzung der E-Learning Plattform</h3>

                    <p className={styles.paragraphBold}>
                        Präambel
                    </p>
                    <p className={styles.paragraph}>
                        Der Schutz Ihrer persönlichen Daten hat für uns höchste Priorität. Nachfolgend informieren wir Sie ausführlich über den Umgang mit Ihren Daten gemäß Art. 13 der Datenschutz-Grundverordnung (DSGVO).
                    </p>

                    <h3 className={styles.sectionHeading}>1. Verantwortliche Stelle</h3>
                    <p className={styles.paragraph}>
                        Verantwortlich für die Datenverarbeitung auf dieser Plattform ist:<br /><br />
                        <strong>Marcus Görner</strong><br />
                        an der Beermahd 12<br />
                        82229 Hechendorf<br />
                        Deutschland<br />
                        E-Mail: marcus.goerner@requestchange.eu<br />
                    </p>

                    <h3 className={styles.sectionHeading}>2. Art der verarbeiteten Daten</h3>
                    <p className={styles.paragraph}>
                        Im Rahmen Ihrer Nutzung dieser Plattform verarbeiten wir folgende Kategorien personenbezogener Daten:
                    </p>
                    <ul className={styles.list}>
                        <li><strong>Stammdaten:</strong> Name, Vorname, E-Mail-Adresse, Matrikelnummer (falls hinterlegt).</li>
                        <li><strong>Nutzungsdaten:</strong> Login-Zeitpunkte, IP-Adressen (anonymisiert), Session-IDs.</li>
                        <li><strong>Leistungsdaten:</strong> Lernfortschritt, Prüfungsergebnisse, Erfahrungspunkte, erreichte Stufen, Badges.</li>
                        <li><strong>Kommunikationsdaten:</strong> Beiträge in Foren, Chats und Nachrichten an Dozenten.</li>
                    </ul>

                    <h3 className={styles.sectionHeading}>3. Zwecke und Rechtsgrundlagen der Verarbeitung</h3>
                    <p className={styles.paragraph}>
                        Dies ist ein privates Projekt im Rahmen einer Gastdozentur und kein offizielles Angebot der Hochschule Hof. Wir verarbeiten Ihre Daten zu folgenden Zwecken:
                    </p>
                    <ul className={styles.list}>
                        <li><strong>Durchführung des Lehrbetriebs:</strong> Zur Bereitstellung der Lernmaterialien und Durchführung von Prüfungen.</li>
                        <li><strong>Leistungsbewertung:</strong> Zur Dokumentation Ihres Studienfortschritts.</li>
                        <li><strong>Sicherheit der Plattform:</strong> Zur Verhinderung von Missbrauch und Sicherstellung der Systemstabilität (Art. 6 Abs. 1 lit. f DSGVO).</li>
                        <li><strong>Einwilligung:</strong> Für optionale Funktionen wie Profilbilder oder freiwillige Angaben (Art. 6 Abs. 1 lit. a DSGVO).</li>
                    </ul>

                    <h3 className={styles.sectionHeading}>4. Empfänger der Daten</h3>
                    <p className={styles.paragraph}>
                        Ihre Daten werden grundsätzlich nicht an Dritte weitergegeben. Ausnahmen:
                    </p>
                    <ul className={styles.list}>
                        <li><strong>Dozenten/Prüfer:</strong> Erhalten Zugriff auf leistungsrelevante Daten.</li>
                        <li><strong>IT-Dienstleister:</strong> Hoster (Vercel, Neon DB) verarbeiten Daten in unserem Auftrag. Die Datenverarbeitung erfolgt ausschließlich auf Servern innerhalb der Europäischen Union (Region: Frankfurt am Main), sodass kein Drittlandtransfer stattfindet.</li>
                        <li><strong>Gesetzliche Verpflichtung:</strong> Behörden oder Gerichte bei vorliegender gesetzlicher Verpflichtung.</li>
                    </ul>

                    <h3 className={styles.sectionHeading}>5. Speicherdauer</h3>
                    <p className={styles.paragraph}>
                        Ihre Daten werden gelöscht, sobald sie für die Erreichung des Zweckes nicht mehr erforderlich sind.
                        Für prüfungsrelevante Daten gelten die gesetzlichen Aufbewahrungsfristen der Prüfungsordnung (in der Regel 5 Jahre nach Exmatrikulation).
                        Logs werden nach 7 Tagen automatisch gelöscht.
                    </p>

                    <h3 className={styles.sectionHeading}>6. Ihre Rechte</h3>
                    <p className={styles.paragraph}>
                        Sie haben jederzeit das Recht auf:
                    </p>
                    <ul className={styles.list}>
                        <li><strong>Auskunft (Art. 15 DSGVO):</strong> Über die zu Ihnen gespeicherten Daten.</li>
                        <li><strong>Berichtigung (Art. 16 DSGVO):</strong> Falscher personenbezogener Daten.</li>
                        <li><strong>Löschung (Art. 17 DSGVO):</strong> Sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</li>
                        <li><strong>Einschränkung der Verarbeitung (Art. 18 DSGVO).</strong></li>
                        <li><strong>Datenübertragbarkeit (Art. 20 DSGVO).</strong></li>
                        <li><strong>Widerspruch (Art. 21 DSGVO):</strong> Gegen die Verarbeitung auf Basis berechtigter Interessen.</li>
                    </ul>
                    <p className={styles.paragraph}>
                        Sie haben zudem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren (Bayerisches Landesamt für Datenschutzaufsicht).
                    </p>

                    <h3 className={styles.sectionHeading}>7. Kontakt</h3>
                    <p className={styles.paragraph}>
                        Bei Fragen zum Datenschutz wenden Sie sich bitte an:<br />
                        marcus.goerner@requestchange.eu
                    </p>

                    <h3 className={styles.sectionHeading}>8. Nutzungsbedingungen &amp; Haftungsausschluss</h3>
                    <p className={styles.paragraph}>
                        <strong>Haftungsausschluss:</strong> Diese Anwendung ist ein Prototyp und wird ausschließlich zu Demonstrationszwecken im Rahmen der Lehre bereitgestellt (&quot;As-is&quot;). Es wird keine Gewähr für die Richtigkeit, Vollständigkeit oder ständige Verfügbarkeit übernommen. Jegliche Haftung für Schäden, die direkt oder indirekt aus der Nutzung entstehen (insbesondere Datenverlust), wird ausgeschlossen, soweit dies gesetzlich zulässig ist.
                    </p>

                    <h3 className={styles.sectionHeading}>Impressum</h3>
                    <p className={styles.paragraph}>
                        Angaben gemäß § 5 DDG:<br /><br />
                        Marcus Görner<br />
                        an der Beermahd 12<br />
                        82229 Hechendorf<br />
                        <br />
                        Kontakt:<br />
                        E-Mail: marcus.goerner@requestchange.eu
                    </p>
                </div>

                <div className={styles.consentBox}>
                    <p className={styles.consentText}>
                        <strong>Einwilligung:</strong> Mit dem Klick auf &quot;Akzeptieren und fortfahren&quot;
                        bestätige ich, dass ich die Datenschutzvereinbarung gelesen habe und
                        mit der Verarbeitung meiner Daten zu den genannten Zwecken einverstanden bin.
                    </p>
                </div>

                <button
                    onClick={handleAccept}
                    disabled={loading}
                    className={styles.acceptButton}
                >
                    {loading ? 'Wird gespeichert...' : 'Akzeptieren und fortfahren'}
                </button>
            </div>
        </div>
    );
}
