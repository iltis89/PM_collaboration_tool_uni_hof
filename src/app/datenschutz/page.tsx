import Link from 'next/link';

export default function PrivacyPage() {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--surface)',
            color: 'var(--foreground)',
            padding: '40px',
            fontFamily: 'var(--font-inter)'
        }}>
            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                background: 'var(--surface-highlight)',
                padding: '40px',
                borderRadius: '8px',
                border: '1px solid var(--border)'
            }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Datenschutzerklärung</h1>
                <p style={{ marginBottom: '2rem', color: 'var(--foreground-muted)' }}>Stand: 15. Dezember 2025</p>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--accent)' }}>1. Einleitung</h2>
                    <p style={{ lineHeight: 1.6 }}>
                        Diese Datenschutzerklärung klärt Nutzer über die Art, den Umfang und Zwecke der Erhebung und Verwendung personenbezogener Daten innerhalb dieser Online-Lernplattform (&quot;Plattform&quot;) auf. Dies ist ein privates Projekt im Rahmen einer Gastdozentur von Marcus Görner und kein offizielles Angebot der Hochschule Hof.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--accent)' }}>2. Verantwortlicher</h2>
                    <p style={{ lineHeight: 1.6 }}>
                        Verantwortlich im Sinne der DSGVO ist:<br /><br />
                        <strong>Marcus Görner</strong><br />
                        an der Beermahd 12<br />
                        82229 Hechendorf<br />
                        Deutschland<br /><br />
                        E-Mail: marcus.goerner@requestchange.eu
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--accent)' }}>3. Hosting (Vercel)</h2>
                    <p style={{ lineHeight: 1.6 }}>
                        Wir hosten diese Anwendung bei <strong>Vercel Inc.</strong><br /><br />
                        Die Datenverarbeitung erfolgt ausschließlich auf Servern innerhalb der Europäischen Union (Region: Frankfurt am Main), sodass kein Drittlandtransfer stattfindet.<br /><br />
                        Weitere Infos zum Datenschutz bei Vercel: <a href="https://vercel.com/legal/privacy-policy" style={{ color: 'var(--accent)' }}>Privacy Policy</a>
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--accent)' }}>4. Art der verarbeiteten Daten</h2>
                    <ul style={{ paddingLeft: '20px', lineHeight: 1.6 }}>
                        <li><strong>Bestandsdaten:</strong> Namen (z.B. User-Logins &quot;Student&quot;, &quot;Admin&quot;)</li>
                        <li><strong>Inhaltsdaten:</strong> Texteingaben im Chat/Forum, hochgeladene Dateien.</li>
                        <li><strong>Nutzungsdaten:</strong> Besuchte Seiten, Zugriffszeiten, Klickpfade.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--accent)' }}>5. Zweck der Verarbeitung</h2>
                    <ul style={{ paddingLeft: '20px', lineHeight: 1.6 }}>
                        <li>Bereitstellung der Lernplattform und ihrer Funktionen.</li>
                        <li>Kommunikation zwischen Studierenden im Rahmen der Vorlesung.</li>
                        <li>Sicherstellung der technischen Sicherheit.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--accent)' }}>6. Ihre Rechte</h2>
                    <ul style={{ paddingLeft: '20px', lineHeight: 1.6 }}>
                        <li>Auskunft über Ihre gespeicherten Daten.</li>
                        <li>Berichtigung unrichtiger Daten.</li>
                        <li>Löschung Ihrer Daten.</li>
                        <li>Einschränkung der Datenverarbeitung.</li>
                        <li>Widerspruch gegen die Verarbeitung.</li>
                    </ul>
                    <p style={{ marginTop: '1rem' }}>Bitte wenden Sie sich hierfür an den oben genannten Verantwortlichen.</p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--accent)' }}>7. Hinweis zur Testphase</h2>
                    <p style={{ lineHeight: 1.6 }}>
                        Diese Plattform ist ein Prototyp (&quot;Test&quot;) für eine Vorlesung. Es werden keine sensiblen Echtdaten von Studierenden (außer den für den Test notwendigen Mock-Daten oder freiwilligen Eingaben) dauerhaft gespeichert. Nach Abschluss des Semesters/Projekts werden alle Daten gelöscht.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--accent)' }}>8. Nutzungsbedingungen & Haftungsausschluss</h2>
                    <p style={{ lineHeight: 1.6 }}>
                        <strong>Haftungsausschluss:</strong> Diese Anwendung ist ein Prototyp und wird ausschließlich zu Demonstrationszwecken im Rahmen der Lehre bereitgestellt (&quot;As-is&quot;). Es wird keine Gewähr für die Richtigkeit, Vollständigkeit oder ständige Verfügbarkeit übernommen. Jegliche Haftung für Schäden, die direkt oder indirekt aus der Nutzung entstehen (insbesondere Datenverlust), wird ausgeschlossen, soweit dies gesetzlich zulässig ist.
                    </p>
                </section>

                <section style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--foreground)' }}>Impressum</h2>
                    <p style={{ lineHeight: 1.6 }}>
                        Angaben gemäß § 5 DDG:<br /><br />
                        Marcus Görner<br />
                        an der Beermahd 12<br />
                        82229 Hechendorf<br /><br />
                        Kontakt:<br />
                        E-Mail: marcus.goerner@requestchange.eu
                    </p>
                </section>

                <div style={{ marginTop: '40px' }}>
                    <Link href="/" style={{
                        display: 'inline-block',
                        padding: '10px 20px',
                        background: 'var(--accent)',
                        color: 'black',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        fontWeight: 'bold'
                    }}>
                        Zurück zur Startseite
                    </Link>
                </div>
            </div>
        </div>
    );
}
