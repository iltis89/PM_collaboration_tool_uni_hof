import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🎓 Seeding 4 neue Themenblock-Module (je 10 Fragen)...')

    // ============== MODUL 2: Projektstart und Durchführung ==============
    const modul2Questions = await Promise.all([
        prisma.quizQuestion.create({
            data: {
                question: "Was ist der erste Schritt bei der Projektinitiierung?",
                options: ["Teambildung", "Stakeholder-Analyse", "Projektauftrag erstellen", "Budget festlegen"],
                correct: [2],
                category: "Projektstart",
                explanation: "Der Projektauftrag (Project Charter) ist das formale Dokument, das ein Projekt autorisiert und den Projektmanager benennt."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Welche Phase folgt auf die Projektinitierung?",
                options: ["Planung", "Durchführung", "Abschluss", "Monitoring"],
                correct: [0],
                category: "Projektstart",
                explanation: "Nach der Initiierung folgt die Planungsphase, in der Scope, Zeit, Kosten und Ressourcen definiert werden."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was gehört NICHT zur Projektdurchführung?",
                options: ["Teamführung", "Qualitätssicherung", "Ressourcenmanagement", "Lessons Learned dokumentieren"],
                correct: [3],
                category: "Durchführung",
                explanation: "Lessons Learned werden typischerweise in der Abschlussphase dokumentiert, nicht während der Durchführung."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was ist ein Meilenstein?",
                options: ["Ein detaillierter Arbeitsschritt", "Ein wichtiges Projektereignis ohne Dauer", "Ein Kostenposten", "Eine Teamrolle"],
                correct: [1],
                category: "Durchführung",
                explanation: "Ein Meilenstein markiert einen wichtigen Zeitpunkt im Projekt und hat keine Dauer (Dauer = 0)."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was beschreibt der Begriff 'Scope Creep'?",
                options: ["Budgetüberschreitung", "Zeitverzug", "Unkontrollierte Ausweitung des Projektumfangs", "Teamfluktuation"],
                correct: [2],
                category: "Durchführung",
                explanation: "Scope Creep bezeichnet die schleichende, unkontrollierte Erweiterung des Projektumfangs ohne formalen Change Request."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Welches Dokument definiert den genauen Lieferumfang eines Projekts?",
                options: ["Projektplan", "Scope Statement", "Risikoregister", "Kommunikationsplan"],
                correct: [1],
                category: "Projektstart",
                explanation: "Das Scope Statement beschreibt detailliert, was im Projekt enthalten ist und was nicht (In-Scope/Out-of-Scope)."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was ist ein Arbeitspaket (Work Package)?",
                options: ["Die kleinste Einheit im WBS", "Ein Meilenstein", "Ein Projektphase", "Ein Kostenvoranschlag"],
                correct: [0],
                category: "Durchführung",
                explanation: "Ein Arbeitspaket ist die kleinste, unterste Ebene im Projektstrukturplan (WBS) und kann geschätzt und zugewiesen werden."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Wer ist für die Genehmigung des Projektauftrags verantwortlich?",
                options: ["Projektmanager", "Qualitätsmanager", "Teammitglied", "Projektsponsor"],
                correct: [3],
                category: "Projektstart",
                explanation: "Der Projektsponsor (Auftraggeber) genehmigt den Projektauftrag und stellt die Ressourcen bereit."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was ist das Ziel einer Kick-off-Meeting?",
                options: ["Projekt abschließen", "Team und Stakeholder informieren/abstimmen", "Budget freigeben", "Risiken identifizieren"],
                correct: [1],
                category: "Projektstart",
                explanation: "Das Kick-off-Meeting dient dazu, alle Beteiligten über Ziele, Rollen und Erwartungen zu informieren und abzustimmen."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was bedeutet 'Baseline' im Projektmanagement?",
                options: ["Projektende", "Risikoschwelle", "Genehmigter Referenzplan", "Teamstruktur"],
                correct: [2],
                category: "Durchführung",
                explanation: "Die Baseline ist der genehmigte, ursprüngliche Plan (Scope, Zeit, Kosten), gegen den der Fortschritt gemessen wird."
            }
        }),
    ])

    const modul2 = await prisma.exam.create({
        data: {
            title: "Themenblock 2: Projektstart und Durchführung",
            description: "Von der Initiierung bis zur Umsetzung – Projektphasen, Meilensteine und operative Steuerung.",
            duration: 15,
            order: 2,
            type: "TOPIC_BLOCK",
            questions: { connect: modul2Questions.map(q => ({ id: q.id })) }
        }
    })
    console.log(`✅ Modul 2 erstellt: ${modul2.id} (${modul2Questions.length} Fragen)`)

    // ============== MODUL 3: Agiles vs. Klassisches PM ==============
    const modul3Questions = await Promise.all([
        prisma.quizQuestion.create({
            data: {
                question: "Was ist der Hauptunterschied zwischen agilem und klassischem Projektmanagement?",
                options: ["Budget", "Iterative vs. sequentielle Planung", "Teamgröße", "Projektdauer"],
                correct: [1],
                category: "Agile vs. Klassisch",
                explanation: "Agile Methoden arbeiten iterativ in kurzen Zyklen, während klassisches PM sequentielle Phasen durchläuft."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was ist ein Sprint in Scrum?",
                options: ["Ein Wettlauf", "Eine Rolle", "Ein Dokument", "Ein zeitbegrenzter Entwicklungszyklus (2-4 Wochen)"],
                correct: [3],
                category: "Scrum",
                explanation: "Ein Sprint ist eine Timebox von 2-4 Wochen, in der ein fertiges, nutzbares Produktinkrement erstellt wird."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was beschreibt das 'Wasserfall-Modell'?",
                options: ["Streng sequentielle Projektphasen", "Iterative Entwicklung", "Agile Teamarbeit", "Kontinuierliche Lieferung"],
                correct: [0],
                category: "Klassisch",
                explanation: "Das Wasserfall-Modell durchläuft Projektphasen streng nacheinander – jede Phase muss abgeschlossen sein, bevor die nächste beginnt."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Welche Rolle gibt es NICHT in Scrum?",
                options: ["Product Owner", "Scrum Master", "Projektmanager", "Development Team"],
                correct: [2],
                category: "Scrum",
                explanation: "In Scrum gibt es keinen klassischen Projektmanager. Die Verantwortlichkeiten sind auf PO, SM und Team verteilt."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was ist das Daily Standup in Scrum?",
                options: ["Wöchentliches Planungsmeeting", "Tägliches 15-Minuten Sync-Meeting", "Sprint-Abschluss", "Retrospektive"],
                correct: [1],
                category: "Scrum",
                explanation: "Das Daily Standup ist ein kurzes tägliches Meeting (max. 15 Min.), in dem das Team den Fortschritt synchronisiert."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was ist ein Product Backlog?",
                options: ["Priorisierte Liste aller Anforderungen", "Fehlerprotokoll", "Teamkalender", "Budgetübersicht"],
                correct: [0],
                category: "Scrum",
                explanation: "Das Product Backlog ist eine geordnete, priorisierte Liste aller Features und Anforderungen für das Produkt."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Wann ist agiles PM besonders geeignet?",
                options: ["Bei festen, unveränderlichen Anforderungen", "Bei kurzen Projekten unter 1 Woche", "Bei sehr großen Teams", "Bei hoher Unsicherheit und sich ändernden Anforderungen"],
                correct: [3],
                category: "Agile vs. Klassisch",
                explanation: "Agile Methoden eignen sich besonders, wenn Anforderungen unklar sind und sich häufig ändern können."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was bedeutet 'Definition of Done' (DoD)?",
                options: ["Projektabschluss", "Kriterien, wann eine Aufgabe als fertig gilt", "Budgetfreigabe", "Teamvereinbarung"],
                correct: [1],
                category: "Scrum",
                explanation: "Die Definition of Done sind vereinbarte Qualitätskriterien, die erfüllt sein müssen, damit eine Aufgabe als abgeschlossen gilt."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was ist der Unterschied zwischen Scrum und Kanban?",
                options: ["Kanban ist nur für Hardware", "Scrum hat kein Board", "Kanban hat keine Sprints/Timeboxes", "Es gibt keinen Unterschied"],
                correct: [2],
                category: "Agile vs. Klassisch",
                explanation: "Kanban arbeitet mit kontinuierlichem Fluss ohne feste Iterationen, während Scrum zeitbegrenzte Sprints nutzt."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was ist eine Sprint Retrospektive?",
                options: ["Sprint-Planung", "Produktdemo", "Tägliches Standup", "Meeting zur Prozessverbesserung nach dem Sprint"],
                correct: [3],
                category: "Scrum",
                explanation: "In der Retrospektive reflektiert das Team am Ende des Sprints, was gut lief und was verbessert werden kann."
            }
        }),
    ])

    const modul3 = await prisma.exam.create({
        data: {
            title: "Themenblock 3: Agiles vs. Klassisches PM",
            description: "Scrum, Wasserfall, Kanban – wann welcher Ansatz passt und wie sie sich unterscheiden.",
            duration: 15,
            order: 3,
            type: "TOPIC_BLOCK",
            questions: { connect: modul3Questions.map(q => ({ id: q.id })) }
        }
    })
    console.log(`✅ Modul 3 erstellt: ${modul3.id} (${modul3Questions.length} Fragen)`)

    // ============== MODUL 4: Team Management & Kommunikation ==============
    const modul4Questions = await Promise.all([
        prisma.quizQuestion.create({
            data: {
                question: "Welches Modell beschreibt die Phasen der Teambildung?",
                options: ["RACI-Matrix", "Eisenhower-Matrix", "SWOT-Analyse", "Tuckman-Modell"],
                correct: [3],
                category: "Team Management",
                explanation: "Das Tuckman-Modell beschreibt die Phasen: Forming, Storming, Norming, Performing und Adjourning."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was bedeutet das 'R' in RACI?",
                options: ["Reviewed", "Required", "Responsible", "Requested"],
                correct: [2],
                category: "Kommunikation",
                explanation: "R = Responsible – die Person, die die Arbeit ausführt. A = Accountable, C = Consulted, I = Informed."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was ist der wichtigste Faktor für erfolgreiche Projektkommunikation?",
                options: ["Häufige Meetings", "Klare Kommunikationswege und -regeln", "Große E-Mail-Verteiler", "Technische Tools"],
                correct: [1],
                category: "Kommunikation",
                explanation: "Ein Kommunikationsplan mit klaren Wegen, Formaten und Frequenzen ist entscheidend für effektive Projektkommunikation."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Welche Konfliktlösungsstrategie ist langfristig am erfolgreichsten?",
                options: ["Kooperation (Win-Win)", "Durchsetzung", "Vermeidung", "Nachgeben"],
                correct: [0],
                category: "Team Management",
                explanation: "Kooperation führt zu nachhaltigen Lösungen, da beide Parteien ihre Interessen einbringen und einen Konsens finden."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was ist die 'Storming'-Phase im Tuckman-Modell?",
                options: ["Teambildung", "Auflösung", "Leistungsphase", "Konfliktphase"],
                correct: [3],
                category: "Team Management",
                explanation: "In der Storming-Phase entstehen Konflikte, da Teammitglieder unterschiedliche Meinungen und Arbeitsstile haben."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was bedeutet 'Accountable' (A) in der RACI-Matrix?",
                options: ["Ausführend", "Letztverantwortlich für die Entscheidung", "Zu informieren", "Zu konsultieren"],
                correct: [1],
                category: "Kommunikation",
                explanation: "Accountable ist die Person, die die finale Entscheidungsgewalt hat und für das Ergebnis verantwortlich ist."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was ist ein Stakeholder-Register?",
                options: ["Dokumentation aller Projektbeteiligten und deren Interessen", "Finanzübersicht", "Teamliste", "Risikoliste"],
                correct: [0],
                category: "Kommunikation",
                explanation: "Das Stakeholder-Register erfasst alle Stakeholder, ihre Interessen, Einfluss und Kommunikationsbedürfnisse."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Welcher Führungsstil eignet sich für ein erfahrenes, motiviertes Team?",
                options: ["Autoritär", "Direktiv", "Delegierend", "Mikromanagement"],
                correct: [2],
                category: "Team Management",
                explanation: "Ein delegierender Führungsstil gibt erfahrenen Teams Autonomie und Vertrauen für selbstständiges Arbeiten."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was ist aktives Zuhören?",
                options: ["Nur zuhören ohne Reaktion", "Aufmerksames Zuhören mit Rückfragen und Zusammenfassung", "Notizen machen", "Unterbrechungen vermeiden"],
                correct: [1],
                category: "Kommunikation",
                explanation: "Aktives Zuhören bedeutet volle Aufmerksamkeit, Verständnisfragen stellen und das Gehörte zusammenfassen."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Wie viele Kommunikationskanäle gibt es bei einem Team von 5 Personen?",
                options: ["5", "20", "15", "10"],
                correct: [3],
                category: "Kommunikation",
                explanation: "Die Formel lautet n*(n-1)/2. Bei 5 Personen: 5*4/2 = 10 Kommunikationskanäle."
            }
        }),
        // ---- NEUE FRAGEN (inkl. Mehrfachauswahl) ----
        prisma.quizQuestion.create({
            data: {
                question: "Welche der folgenden Aspekte gehören zu Tuckmans Phasenmodell? (Mehrfachauswahl)",
                options: ["Forming", "Brainstorming", "Norming", "Performing", "Reviewing"],
                correct: [0, 2, 3],
                category: "Team Management",
                explanation: "Tuckmans Modell umfasst: Forming, Storming, Norming, Performing und Adjourning. 'Brainstorming' und 'Reviewing' gehören nicht dazu."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Welche Elemente gehören zu einem Kommunikationsplan? (Mehrfachauswahl)",
                options: ["Zielgruppe und Empfänger", "Gehaltsinformationen der Teammitglieder", "Kommunikationsfrequenz und -format", "Verantwortliche Absender"],
                correct: [0, 2, 3],
                category: "Kommunikation",
                explanation: "Ein Kommunikationsplan definiert Zielgruppen, Frequenz, Format und Verantwortliche. Gehaltsinformationen sind kein Bestandteil."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was beschreibt das Modell der 'Situativen Führung' nach Hersey und Blanchard?",
                options: ["Jeder Mitarbeiter braucht denselben Führungsstil", "Der Führungsstil sollte dem Reifegrad des Mitarbeiters angepasst werden", "Nur autoritäre Führung ist effektiv", "Führung ist nicht erlernbar"],
                correct: [1],
                category: "Team Management",
                explanation: "Das Modell empfiehlt, den Führungsstil (Telling, Selling, Participating, Delegating) an den Reifegrad des Mitarbeiters anzupassen."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was versteht man unter 'Groupthink' in Projektteams?",
                options: ["Effektive Teamarbeit durch gemeinsames Denken", "Konformitätsdruck, der zu schlechten Entscheidungen führt", "Eine Kreativtechnik für Ideenfindung", "Die Aufteilung von Denkarbeit im Team"],
                correct: [1],
                category: "Team Management",
                explanation: "Groupthink beschreibt das Phänomen, dass eine Gruppe durch Konformitätsdruck kritisches Denken unterdrückt und dadurch fehlerhafte Entscheidungen trifft."
            }
        }),
    ])

    const modul4 = await prisma.exam.create({
        data: {
            title: "Themenblock 4: Team Management & Kommunikation",
            description: "Teamdynamik, Stakeholder-Kommunikation, Konfliktlösung und Führungskompetenzen.",
            duration: 18,
            order: 4,
            type: "TOPIC_BLOCK",
            questions: { connect: modul4Questions.map(q => ({ id: q.id })) }
        }
    })
    console.log(`✅ Modul 4 erstellt: ${modul4.id} (${modul4Questions.length} Fragen)`)

    // ============== MODUL 5: Management Tools ==============
    const modul5Questions = await Promise.all([
        prisma.quizQuestion.create({
            data: {
                question: "Wofür wird ein Gantt-Diagramm verwendet?",
                options: ["Kostenanalyse", "Risikoanalyse", "Zeitplanung und Visualisierung von Aufgaben", "Teamorganisation"],
                correct: [2],
                category: "Tools",
                explanation: "Ein Gantt-Diagramm visualisiert Projektaufgaben auf einer Zeitachse mit Start- und Endterminen sowie Abhängigkeiten."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was zeigt ein Kanban-Board?",
                options: ["Projektbudget", "Workflow-Status von Aufgaben", "Teamhierarchie", "Risikoregister"],
                correct: [1],
                category: "Tools",
                explanation: "Ein Kanban-Board visualisiert den Arbeitsfluss mit Spalten wie 'To Do', 'In Progress' und 'Done'."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was ist der Zweck einer SWOT-Analyse?",
                options: ["Zeitplanung", "Qualitätsmessung", "Budgetkontrolle", "Strategische Stärken-Schwächen-Analyse"],
                correct: [3],
                category: "Tools",
                explanation: "SWOT analysiert Strengths, Weaknesses, Opportunities und Threats für strategische Entscheidungen."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was misst der Earned Value (EV)?",
                options: ["Geplante Kosten", "Tatsächliche Kosten", "Wert der geleisteten Arbeit", "Noch offenes Budget"],
                correct: [2],
                category: "Tools",
                explanation: "Der Earned Value zeigt den Wert der tatsächlich erledigten Arbeit basierend auf dem ursprünglichen Budget."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was ist ein Netzplan (CPM)?",
                options: ["Grafische Darstellung von Aufgabenabhängigkeiten", "Organigramm", "Kostenübersicht", "Kommunikationsplan"],
                correct: [0],
                category: "Tools",
                explanation: "Ein Netzplan zeigt die logischen Abhängigkeiten zwischen Aufgaben und ermöglicht die Berechnung des kritischen Pfads."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was bedeutet CPI (Cost Performance Index)?",
                options: ["Zeiteffizienz", "Kosteneffizienz (EV/AC)", "Risikowert", "Qualitätsindex"],
                correct: [1],
                category: "Tools",
                explanation: "Der CPI = EV/AC zeigt die Kosteneffizienz. CPI < 1 bedeutet Budgetüberschreitung."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Wofür wird eine Risikomatrix verwendet?",
                options: ["Zeitplanung", "Budgetverteilung", "Teamzuordnung", "Bewertung von Risiken nach Wahrscheinlichkeit und Auswirkung"],
                correct: [3],
                category: "Tools",
                explanation: "Die Risikomatrix ordnet Risiken nach Eintrittswahrscheinlichkeit und Auswirkung ein, um Prioritäten zu setzen."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was ist WIP-Limit in Kanban?",
                options: ["Maximale Anzahl paralleler Aufgaben", "Maximale Projektdauer", "Budgetobergrenze", "Teamgröße"],
                correct: [0],
                category: "Tools",
                explanation: "WIP (Work in Progress) Limit begrenzt die Anzahl gleichzeitiger Aufgaben, um Überlastung zu vermeiden."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was zeigt ein Burn-Down-Chart?",
                options: ["Budgetverbrauch", "Teamperformance", "Verbleibende Arbeit über die Zeit", "Risikoentwicklung"],
                correct: [2],
                category: "Tools",
                explanation: "Ein Burn-Down-Chart zeigt, wie viel Arbeit noch übrig ist und ob das Team im Zeitplan liegt."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was ist der Unterschied zwischen SPI und CPI?",
                options: ["Kein Unterschied", "SPI misst Zeit, CPI misst Kosten", "SPI misst Qualität, CPI misst Risiko", "Beide messen Budget"],
                correct: [1],
                category: "Tools",
                explanation: "SPI (Schedule Performance Index) misst die Zeitleistung, CPI (Cost Performance Index) misst die Kostenleistung."
            }
        }),
        // ---- NEUE FRAGEN (inkl. Mehrfachauswahl) ----
        prisma.quizQuestion.create({
            data: {
                question: "Welche der folgenden sind typische Bestandteile einer SWOT-Analyse? (Mehrfachauswahl)",
                options: ["Stärken (Strengths)", "Wünsche (Wishes)", "Chancen (Opportunities)", "Risiken (Threats)"],
                correct: [0, 2, 3],
                category: "Tools",
                explanation: "SWOT steht für Strengths, Weaknesses, Opportunities, Threats. 'Wünsche' (Wishes) gehört nicht dazu – das W steht für Weaknesses (Schwächen)."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Welche Kennzahlen gehören zum Earned Value Management? (Mehrfachauswahl)",
                options: ["Planned Value (PV)", "Team Velocity (TV)", "Actual Cost (AC)", "Earned Value (EV)"],
                correct: [0, 2, 3],
                category: "Tools",
                explanation: "Die drei Kernkennzahlen des EVM sind Planned Value (PV), Actual Cost (AC) und Earned Value (EV). 'Team Velocity' ist ein Scrum-Konzept."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was ist der Unterschied zwischen einem Gantt-Diagramm und einem Netzplan?",
                options: ["Es gibt keinen Unterschied", "Der Netzplan zeigt Abhängigkeiten, das Gantt-Diagramm die Zeitachse", "Das Gantt-Diagramm ist nur für agile Projekte", "Der Netzplan zeigt nur Kosten"],
                correct: [1],
                category: "Tools",
                explanation: "Ein Netzplan visualisiert logische Abhängigkeiten zwischen Vorgängen, während ein Gantt-Diagramm Aufgaben auf einer Zeitachse darstellt. Beide ergänzen sich."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was bedeutet ein CPI von 0,8?",
                options: ["Das Projekt liegt 20% unter Budget", "Das Projekt liegt 20% über Budget", "Das Projekt ist zu 80% fertig", "80% der Aufgaben sind abgeschlossen"],
                correct: [1],
                category: "Tools",
                explanation: "CPI = EV/AC. Ein CPI von 0,8 bedeutet: Für jeden ausgegebenen Euro wurden nur 80 Cent Wert geschaffen – das Projekt liegt also 20% über Budget."
            }
        }),
    ])

    const modul5 = await prisma.exam.create({
        data: {
            title: "Themenblock 5: Management Tools",
            description: "Gantt, Kanban, SWOT, Earned Value – die wichtigsten PM-Werkzeuge und ihre Anwendung.",
            duration: 18,
            order: 5,
            type: "TOPIC_BLOCK",
            questions: { connect: modul5Questions.map(q => ({ id: q.id })) }
        }
    })
    console.log(`✅ Modul 5 erstellt: ${modul5.id} (${modul5Questions.length} Fragen)`)

    console.log('\n🎉 Alle 4 neuen Module erfolgreich erstellt!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
