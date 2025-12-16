
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding Learning Mode content...')

    // Create Holistic PM Questions
    const questions = await Promise.all([
        // 1. Initiierung
        prisma.quizQuestion.create({
            data: {
                question: "Was ist das primäre Ziel der Initiierungsphase?",
                options: ["Detaillierte Zeitplanung", "Autorisierung des Projekts", "Team-Building", "Risikoanalyse"],
                correct: 1,
                category: "Initiierung",
                explanation: "Die Initiierungsphase dient dazu, das Projekt formal zu autorisieren (z.B. durch den Projektauftrag) und den Projektmanager zu ernennen."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Welches Dokument ist das wichtigste Ergebnis der Initiierungsphase?",
                options: ["Projektauftrag (Project Charter)", "Projektmanagementplan", "Risikoregister", "WBS"],
                correct: 0,
                category: "Initiierung",
                explanation: "Der Projektauftrag (Project Charter) ist das Dokument, das die Existenz des Projekts formal bestätigt und dem Projektmanager die Befugnis gibt, Ressourcen zu nutzen."
            }
        }),

        // 2. Planung (Scope, Time, Cost)
        prisma.quizQuestion.create({
            data: {
                question: "Was ist ein 'Work Breakdown Structure' (WBS)?",
                options: ["Ein Zeitplan", "Eine hierarchische Zerlegung des Lieferumfangs", "Eine Liste der Projektmitarbeiter", "Eine Kostenaufstellung"],
                correct: 1,
                category: "Planung",
                explanation: "Der WBS (Projektstrukturplan) zerlegt das Projekt hierarchisch in kleinere, handhabbare Arbeitspakete (Work Packages)."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Wie wird der 'Kritische Pfad' definiert?",
                options: ["Der kürzeste Weg zum Projektende", "Die Abfolge von Aktivitäten mit der längsten Gesamtdauer", "Der Weg mit den meisten Risiken", "Der Weg mit den höchsten Kosten"],
                correct: 1,
                category: "Planung",
                explanation: "Der Kritische Pfad bestimmt die mindeste Projektdauer. Eine Verzögerung auf diesem Pfad verzögert das gesamte Projekt."
            }
        }),

        // 3. Ausführung & Überwachung
        prisma.quizQuestion.create({
            data: {
                question: "Was versteht man unter 'Gold Plating'?",
                options: ["Veredelung des Produkts", "Hinzufügen von Funktionen, die nicht angefordert wurden", "Budgetüberschreitung", "Ein Qualitätsmerkmal"],
                correct: 1,
                category: "Ausführung",
                explanation: "Gold Plating bedeutet, dem Kunden mehr zu liefern als vereinbart wurde (Scope Creep ohne Change Request), was oft zu Ressourcenverschwendung führt."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Wie berechnet man den SPI (Schedule Performance Index)?",
                options: ["EV / AC", "EV / PV", "PV / EV", "AC / EV"],
                correct: 1,
                category: "Monitoring",
                explanation: "Der SPI ist das Verhältnis von Earned Value (EV) zu Planned Value (PV). Ein Wert < 1 bedeutet Zeitverzug."
            }
        }),

        // 4. Agile / Scrum
        prisma.quizQuestion.create({
            data: {
                question: "Wer pflegt das Product Backlog in Scrum?",
                options: ["Scrum Master", "Development Team", "Product Owner", "Stakeholder"],
                correct: 2,
                category: "Agile",
                explanation: "Der Product Owner ist allein verantwortlich für das Management und die Priorisierung des Product Backlogs."
            }
        }),
        prisma.quizQuestion.create({
            data: {
                question: "Was ist das Hauptziel eines Sprint Reviews?",
                options: ["Prozessverbesserung", "Abnahme des inkrementellen Produkts", "Planung des nächsten Sprints", "Daily Standup"],
                correct: 1,
                category: "Agile",
                explanation: "Im Sprint Review wird das fertige Inkrement den Stakeholdern vorgestellt, um Feedback einzuholen und Anpassungen am Backlog vorzunehmen."
            }
        }),

        // 5. Abschluss
        prisma.quizQuestion.create({
            data: {
                question: "Warum sind 'Lessons Learned' im Projektabschluss wichtig?",
                options: ["Um Schuldige für Fehler zu finden", "Um zukünftige Projekte zu verbessern", "Um das Budget aufzubrauchen", "Um Zeit zu schinden"],
                correct: 1,
                category: "Abschluss",
                explanation: "Lessons Learned dienen dem Wissensmanagement, um erfolgte Fehler in Zukunft zu vermeiden und Best Practices zu wiederholen."
            }
        }),
    ]);

    // Create Learning Exam
    const exam = await prisma.exam.create({
        data: {
            title: "Lernmodus: Projektmanagement 360°",
            description: "Ganzheitliches Basiswissen von Initiierung bis Abschluss. Lernen Sie mit direkter Erfolgskontrolle.",
            duration: 30, // 30 minutes for learning
            questions: {
                connect: questions.map(q => ({ id: q.id }))
            }
        }
    })

    console.log(`Created Learning Exam with id: ${exam.id}`)
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
