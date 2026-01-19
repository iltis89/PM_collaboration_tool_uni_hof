import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🎓 Seeding 4 neue Themenblock-Module...')

    // ============== MODUL 2: Projektstart und Durchführung ==============
    const modul2Questions = await Promise.all([
        prisma.quizQuestion.create({
            data: {
                question: "Was ist der erste Schritt bei der Projektinitiierung?",
                options: ["Teambildung", "Stakeholder-Analyse", "Projektauftrag erstellen", "Budget festlegen"],
                correct: 2,
                category: "Projektstart",
                explanation: "Der Projektauftrag (Project Charter) ist das formale Dokument, das ein Projekt autorisiert und den Projektmanager benennt."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Welche Phase folgt auf die Projektinitierung?",
                options: ["Abschluss", "Durchführung", "Planung", "Monitoring"],
                correct: 2,
                category: "Projektstart",
                explanation: "Nach der Initiierung folgt die Planungsphase, in der Scope, Zeit, Kosten und Ressourcen definiert werden."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was gehört NICHT zur Projektdurchführung?",
                options: ["Teamführung", "Qualitätssicherung", "Lessons Learned dokumentieren", "Ressourcenmanagement"],
                correct: 2,
                category: "Durchführung",
                explanation: "Lessons Learned werden typischerweise in der Abschlussphase dokumentiert, nicht während der Durchführung."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was ist ein Meilenstein?",
                options: ["Ein detaillierter Arbeitsschritt", "Ein wichtiges Projektereignis ohne Dauer", "Ein Kostenposten", "Eine Teamrolle"],
                correct: 1,
                category: "Durchführung",
                explanation: "Ein Meilenstein markiert einen wichtigen Zeitpunkt im Projekt und hat keine Dauer (Dauer = 0)."
            }
        }),
    ])

    const modul2 = await prisma.exam.create({
        data: {
            title: "Themenblock 2: Projektstart und Durchführung",
            description: "Von der Initiierung bis zur Umsetzung – Projektphasen, Meilensteine und operative Steuerung.",
            duration: 12,
            order: 2,
            type: "TOPIC_BLOCK",
            questions: { connect: modul2Questions.map(q => ({ id: q.id })) }
        }
    })
    console.log(`✅ Modul 2 erstellt: ${modul2.id}`)

    // ============== MODUL 3: Agiles vs. Klassisches PM ==============
    const modul3Questions = await Promise.all([
        prisma.quizQuestion.create({
            data: {
                question: "Was ist der Hauptunterschied zwischen agilem und klassischem Projektmanagement?",
                options: ["Budget", "Iterative vs. sequentielle Planung", "Teamgröße", "Projektdauer"],
                correct: 1,
                category: "Agile vs. Klassisch",
                explanation: "Agile Methoden arbeiten iterativ in kurzen Zyklen, während klassisches PM sequentielle Phasen durchläuft."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was ist ein Sprint in Scrum?",
                options: ["Ein Wettlauf", "Ein zeitbegrenzter Entwicklungszyklus (2-4 Wochen)", "Ein Dokument", "Eine Rolle"],
                correct: 1,
                category: "Scrum",
                explanation: "Ein Sprint ist eine Timebox von 2-4 Wochen, in der ein fertiges, nutzbares Produktinkrement erstellt wird."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was beschreibt das 'Wasserfall-Modell'?",
                options: ["Iterative Entwicklung", "Streng sequentielle Projektphasen", "Agile Teamarbeit", "Kontinuierliche Lieferung"],
                correct: 1,
                category: "Klassisch",
                explanation: "Das Wasserfall-Modell durchläuft Projektphasen streng nacheinander – jede Phase muss abgeschlossen sein, bevor die nächste beginnt."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Welche Rolle gibt es NICHT in Scrum?",
                options: ["Product Owner", "Scrum Master", "Projektmanager", "Development Team"],
                correct: 2,
                category: "Scrum",
                explanation: "In Scrum gibt es keinen klassischen Projektmanager. Die Verantwortlichkeiten sind auf PO, SM und Team verteilt."
            }
        }),
    ])

    const modul3 = await prisma.exam.create({
        data: {
            title: "Themenblock 3: Agiles vs. Klassisches PM",
            description: "Scrum, Wasserfall, Kanban – wann welcher Ansatz passt und wie sie sich unterscheiden.",
            duration: 12,
            order: 3,
            type: "TOPIC_BLOCK",
            questions: { connect: modul3Questions.map(q => ({ id: q.id })) }
        }
    })
    console.log(`✅ Modul 3 erstellt: ${modul3.id}`)

    // ============== MODUL 4: Team Management & Kommunikation ==============
    const modul4Questions = await Promise.all([
        prisma.quizQuestion.create({
            data: {
                question: "Welches Modell beschreibt die Phasen der Teambildung?",
                options: ["RACI-Matrix", "Tuckman-Modell", "SWOT-Analyse", "Eisenhower-Matrix"],
                correct: 1,
                category: "Team Management",
                explanation: "Das Tuckman-Modell beschreibt die Phasen: Forming, Storming, Norming, Performing und Adjourning."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was bedeutet das 'R' in RACI?",
                options: ["Reviewed", "Responsible", "Required", "Requested"],
                correct: 1,
                category: "Kommunikation",
                explanation: "R = Responsible – die Person, die die Arbeit ausführt. A = Accountable, C = Consulted, I = Informed."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was ist der wichtigste Faktor für erfolgreiche Projektkommunikation?",
                options: ["Häufige Meetings", "Klare Kommunikationswege und -regeln", "Große E-Mail-Verteiler", "Technische Tools"],
                correct: 1,
                category: "Kommunikation",
                explanation: "Ein Kommunikationsplan mit klaren Wegen, Formaten und Frequenzen ist entscheidend für effektive Projektkommunikation."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Welche Konfliktlösungsstrategie ist langfristig am erfolgreichsten?",
                options: ["Vermeidung", "Durchsetzung", "Kooperation (Win-Win)", "Nachgeben"],
                correct: 2,
                category: "Team Management",
                explanation: "Kooperation führt zu nachhaltigen Lösungen, da beide Parteien ihre Interessen einbringen und einen Konsens finden."
            }
        }),
    ])

    const modul4 = await prisma.exam.create({
        data: {
            title: "Themenblock 4: Team Management & Kommunikation",
            description: "Teamdynamik, Stakeholder-Kommunikation, Konfliktlösung und Führungskompetenzen.",
            duration: 12,
            order: 4,
            type: "TOPIC_BLOCK",
            questions: { connect: modul4Questions.map(q => ({ id: q.id })) }
        }
    })
    console.log(`✅ Modul 4 erstellt: ${modul4.id}`)

    // ============== MODUL 5: Management Tools ==============
    const modul5Questions = await Promise.all([
        prisma.quizQuestion.create({
            data: {
                question: "Wofür wird ein Gantt-Diagramm verwendet?",
                options: ["Kostenanalyse", "Zeitplanung und Visualisierung von Aufgaben", "Risikoanalyse", "Teamorganisation"],
                correct: 1,
                category: "Tools",
                explanation: "Ein Gantt-Diagramm visualisiert Projektaufgaben auf einer Zeitachse mit Start- und Endterminen sowie Abhängigkeiten."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was zeigt ein Kanban-Board?",
                options: ["Projektbudget", "Workflow-Status von Aufgaben", "Teamhierarchie", "Risikoregister"],
                correct: 1,
                category: "Tools",
                explanation: "Ein Kanban-Board visualisiert den Arbeitsfluss mit Spalten wie 'To Do', 'In Progress' und 'Done'."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was ist der Zweck einer SWOT-Analyse?",
                options: ["Zeitplanung", "Strategische Stärken-Schwächen-Analyse", "Budgetkontrolle", "Qualitätsmessung"],
                correct: 1,
                category: "Tools",
                explanation: "SWOT analysiert Strengths, Weaknesses, Opportunities und Threats für strategische Entscheidungen."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was misst der Earned Value (EV)?",
                options: ["Geplante Kosten", "Tatsächliche Kosten", "Wert der geleisteten Arbeit", "Noch offenes Budget"],
                correct: 2,
                category: "Tools",
                explanation: "Der Earned Value zeigt den Wert der tatsächlich erledigten Arbeit basierend auf dem ursprünglichen Budget."
            }
        }),
    ])

    const modul5 = await prisma.exam.create({
        data: {
            title: "Themenblock 5: Management Tools",
            description: "Gantt, Kanban, SWOT, Earned Value – die wichtigsten PM-Werkzeuge und ihre Anwendung.",
            duration: 12,
            order: 5,
            type: "TOPIC_BLOCK",
            questions: { connect: modul5Questions.map(q => ({ id: q.id })) }
        }
    })
    console.log(`✅ Modul 5 erstellt: ${modul5.id}`)

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
