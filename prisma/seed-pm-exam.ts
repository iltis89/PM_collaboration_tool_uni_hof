import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding PM Exam...')

    // Define the exam data
    const examData = {
        title: 'Prüfungsvorbereitung: Wahlpflichtfach Projektmanagement',
        description: 'Hochschule Hof – Design und Mobilität. Selbstüberprüfung des Wissensstandes über Projektdefinition, Durchführung, Agiles Management, Design-Methodologie und Teamdynamik.',
        duration: 20
    }

    // Check if exam exists and clean up if it does to ensure fresh data
    const existingExams = await prisma.exam.findMany({
        where: { title: examData.title }
    })

    for (const ex of existingExams) {
        console.log(`Deleting existing exam: ${ex.id}`)
        // Delete associated questions first (since no cascade in schema for questions?)
        await prisma.quizQuestion.deleteMany({
            where: { examId: ex.id }
        })
        await prisma.exam.delete({
            where: { id: ex.id }
        })
    }

    // Create the Exam
    const createdExam = await prisma.exam.create({
        data: {
            ...examData
        }
    })

    console.log(`✅ Exam created with ID: ${createdExam.id}`)

    const questions = [
        // Teil 1
        {
            question: 'Welche drei Determinanten bilden laut Skript das „Magische Dreieck“ des Projektmanagements?',
            options: ['Kosten, Qualität, Risiko', 'Ziel, Ressourcen, Zeit', 'Personal, Budget, Stakeholder', 'Planung, Steuerung, Abschluss'],
            correct: [1],
            category: 'Teil 1: Grundlagen und Definitionen',
            explanation: 'Das Skript definiert das Projektdreieck durch die Determinanten Ziel, Ressourcen und Zeit, die nicht losgelöst voneinander betrachtet werden können.'
        },
        {
            question: 'Was ist laut DIN ISO 21500 und der im Skript genannten Definition kein zwingendes Merkmal eines Projekts?',
            options: ['Einmaligkeit der Bedingungen', 'Zeitliche Begrenzung (definierter Anfang und Ende)', 'Wiederkehrende Routinetätigkeit zur Prozessoptimierung', 'Projektspezifische Organisation'],
            correct: [2],
            category: 'Teil 1: Grundlagen und Definitionen',
            explanation: 'Ein Projekt ist definiert als ein Vorhaben, das durch Einmaligkeit gekennzeichnet ist und eben keine Routinetätigkeit darstellt.'
        },
        {
            question: 'Welche der folgenden Aufgaben gehört nicht zu den fünf zentralen Aufgaben eines Projektleiters nach Roman Stöger?',
            options: ['Für Ziele sorgen', 'Die technische Programmierung der Lösung selbst durchführen', 'Entscheidungen treffen', 'Kontrollieren und beurteilen'],
            correct: [1],
            category: 'Teil 1: Grundlagen und Definitionen',
            explanation: 'Die fünf Aufgaben sind: Für Ziele sorgen, Aufgaben gestalten, Organisieren, Entscheidungen treffen, Kontrollieren/Beurteilen. Die operative Abarbeitung von Fachaufgaben ist Aufgabe der Mitarbeiter.'
        },
        // Teil 2
        {
            question: 'Worin liegt der wesentliche inhaltliche Unterschied zwischen dem Projektauftrag (Project Charter) und dem Projektscope?',
            options: ['Der Scope ist das offizielle Startdokument, der Auftrag beschreibt nur die Details.', 'Der Projektauftrag bestätigt formell die Existenz des Projekts, während der Scope detailliert definiert, was im Projekt enthalten ist (und was nicht).', 'Der Projektauftrag wird vom Team erstellt, der Scope vom Kunden.', 'Es gibt keinen Unterschied, die Begriffe werden synonym verwendet.'],
            correct: [1],
            category: 'Teil 2: Projektstart und Durchführung',
            explanation: 'Der Projektauftrag (Charter) ist das offizielle Dokument zum Start. Der Scope definiert Liefergegenstände und Grenzen (In-Scope/Out-Scope).'
        },
        {
            question: 'Welche Konsequenz hat laut Skript das Ignorieren der frühen Projektphasen (Definition und Planung)?',
            options: ['Das Projekt wird agiler und flexibler.', '„Wer die frühen Phasen ignoriert, bekommt zum Projektende Action satt.“', 'Die Kosten sinken, da weniger Bürokratie anfällt.', 'Die Stakeholder sind zufriedener, da schneller Ergebnisse sichtbar sind.'],
            correct: [1],
            category: 'Teil 2: Projektstart und Durchführung',
            explanation: 'Dies ist ein direktes Zitat aus dem Skript im Abschnitt über Gründe für das Scheitern von Projekten (Ungenügende Projektdefinition).'
        },
        {
            question: 'In welcher Phase findet laut DIN ISO 21500 die Festlegung des Projektumfangs („in scope“ vs. „out of scope“) primär statt?',
            options: ['Initialisierungsphase', 'Definitionsphase', 'Steuerungsphase', 'Abschlussphase'],
            correct: [1],
            category: 'Teil 2: Projektstart und Durchführung',
            explanation: 'In der Definitionsphase wird festgelegt, um was für ein Projekt es sich handelt und was „in scope“ bzw. „out of scope“ ist.'
        },
        // Teil 3
        {
            question: 'Wann ist der Einsatz von klassischem Projektmanagement (Wasserfall) laut Skript dem agilen Vorgehen vorzuziehen?',
            options: ['Wenn das Projektergebnis und dessen Eigenschaften bereits vor der Umsetzung präzise beschrieben und festgelegt werden können.', 'Wenn die Anforderungen unklar sind und sich häufig ändern.', 'Wenn das Team besonders klein ist.', 'Wenn der Kunde eine hohe Flexibilität während der Entwicklung wünscht.'],
            correct: [0],
            category: 'Teil 3: Agiles vs. Klassisches Projektmanagement',
            explanation: 'Klassisches PM (Wasserfall) eignet sich, wenn das Endprodukt und die Abläufe planbar sind und einer festen Reihenfolge gehorchen.'
        },
        {
            question: 'Was kennzeichnet die Rolle des „Product Owners“ in Scrum?',
            options: ['Er beseitigt Hindernisse für das Team (Servant Leader).', 'Er ist verantwortlich für das Produkt und die Priorisierung der Anforderungen (Backlog).', 'Er führt die täglichen Stand-up Meetings.', 'Er ist für die Zuweisung der Aufgaben an die Entwickler zuständig.'],
            correct: [1],
            category: 'Teil 3: Agiles vs. Klassisches Projektmanagement',
            explanation: 'Der Product Owner ist verantwortlich für das Produkt und das Backlog. Der Scrum Master unterstützt das Team und beseitigt Hindernisse.'
        },
        {
            question: 'Welches Prinzip ist charakteristisch für die Kanban-Methode?',
            options: ['Arbeit in festen Sprints von 2-4 Wochen.', 'Strenge Trennung von Planungs- und Ausführungsphasen.', 'Limitierung der parallelen Aufgaben (Work in Progress - WIP) und Pull-Prinzip.', 'Ernennung eines Kanban-Masters, der das Team leitet.'],
            correct: [2],
            category: 'Teil 3: Agiles vs. Klassisches Projektmanagement',
            explanation: 'Kanban visualisiert den Fluss, limitiert WIP, um Überlastung zu vermeiden, und nutzt das Pull-Prinzip.'
        },
        // Teil 4
        {
            question: 'Was versteht Horst Rittel unter der „epistemischen Freiheit“ in Bezug auf Projekte?',
            options: ['Die Freiheit, das Budget beliebig zu überziehen.', 'Das Fehlen zwangsläufiger Notwendigkeiten, was individuelle Verantwortung zur Entwicklung eines zielführenden Weges erfordert.', 'Die Freiheit, Designprozesse ohne jegliche Dokumentation durchzuführen.', 'Die Unabhängigkeit von physikalischen Gesetzen im Design.'],
            correct: [1],
            category: 'Teil 4: Design-Methodologie & Improvisation',
            explanation: 'Rittel spricht davon, dass bei fehlenden offenkundigen Vorgaben die individuelle Verantwortung gefragt ist.'
        },
        {
            question: 'Welche These vertritt Annika Frye in Bezug auf Design und Improvisation?',
            options: ['Improvisation ist ein Zeichen von schlechter Planung und sollte vermieden werden.', 'Der Prozess des Entwerfens ist wichtiger als das Endprodukt; Fehler sollten als Chance betrachtet werden.', 'Design muss immer einem strikt linearen Prozess folgen, um Qualität zu sichern.', 'Improvisation funktioniert nur in der Kunst, nicht im Produktdesign.'],
            correct: [1],
            category: 'Teil 4: Design-Methodologie & Improvisation',
            explanation: 'Frye betont „Prozess statt Produkt“ und sieht Fehler als kreative Ressource und Chance.'
        },
        {
            question: 'Welcher Designprozess zeichnet sich durch die Phasen „Empathie – Problemdefinition – Ideenfindung – Prototyping – Testen“ aus?',
            options: ['Linearer Designprozess', 'Wasserfall-Modell', 'Design Thinking', 'Systemischer Designprozess'],
            correct: [2],
            category: 'Teil 4: Design-Methodologie & Improvisation',
            explanation: 'Die Phasen Empathie, Problemdefinition, Ideenfindung, Prototyping und Testen sind klassisch für Design Thinking.'
        },
        // Teil 5
        {
            question: 'Was kritisiert Patrick Sailer an der herkömmlichen Teamforschung in Bezug auf agile Teams?',
            options: ['Dass agile Teams keine Führung haben.', 'Dass die „Ordnung der Situation“ oft vergessen wird, obwohl agile Rituale (z.B. Dailies) eine eigene situative Ordnung schaffen.', 'Dass Tuckmans Phasenmodell (Forming, Storming, etc.) zu komplex ist.', 'Dass Systemtheorie in der Praxis keine Relevanz hat.'],
            correct: [1],
            category: 'Teil 5: Team Management & Kommunikation',
            explanation: 'Sailer kritisiert, dass die „Eigendynamik von Situationen“ ignoriert wird. Agile Methoden schaffen durch Rituale eine wiederkehrende Ordnung.'
        },
        {
            question: 'Was versteht man unter dem „Punctuated Equilibrium“-Modell nach Gersick (in Bezug auf Sailers Analyse)?',
            options: ['Teams entwickeln sich linear und stetig.', 'Teams ändern ihren Arbeitsansatz oft drastisch zur „Halbzeit“ der zur Verfügung stehenden Zeit.', 'Teams benötigen immer einen externen Mediator.', 'Konflikte sind schädlich für das Gleichgewicht im Team.'],
            correct: [1],
            category: 'Teil 5: Team Management & Kommunikation',
            explanation: 'Gersick stellte fest, dass Teams oft bei der Hälfte der Zeit eine drastische Veränderung (Punctuated Equilibrium) durchlaufen.'
        },
        {
            question: 'Welchen sozialen Einflussfaktor auf die Ideenbewertung hebt Tobias Adam hervor?',
            options: ['Die technische Machbarkeit der Idee.', 'Den Einfluss von „Popularitätsinformationen“ (Herding Behavior), bei dem Bewerter sich der Mehrheitsmeinung anschließen.', 'Die rein finanzielle Rentabilität einer Idee.', 'Die Verfügbarkeit von Patenten.'],
            correct: [1],
            category: 'Teil 5: Team Management & Kommunikation',
            explanation: 'Adam untersucht, wie die Kenntnis über die Popularität einer Idee die Bewertung verzerrt (Herding behavior).'
        },
        {
            question: 'Was beschreibt der „In-Group-Bias“ nach der Theorie der sozialen Identität (Adam)?',
            options: ['Die Bevorzugung von Ideen, die von Mitgliedern der eigenen Gruppe stammen.', 'Die Tendenz, Ideen von externen Experten höher zu bewerten.', 'Die Ablehnung aller Ideen, die nicht vom Vorgesetzten kommen.', 'Die neutrale Bewertung aller Ideen unabhängig vom Urheber.'],
            correct: [0],
            category: 'Teil 5: Team Management & Kommunikation',
            explanation: 'Dies beschreibt die In-Group/Out-Group-Bevorzugung, bei der Ideen der eigenen Gruppe präferiert werden.'
        },
        // Teil 6
        {
            question: 'Wozu dient ein Gantt-Diagramm primär?',
            options: ['Zur Analyse der Teampsychologie.', 'Zur Visualisierung von Aufgaben, Zeitplänen und Abhängigkeiten auf einer Zeitachse.', 'Zur Berechnung des Return on Investment (ROI).', 'Zur Durchführung von Brainstorming-Sessions.'],
            correct: [1],
            category: 'Teil 6: Management Tools',
            explanation: 'Ein Gantt-Diagramm zeigt Aufgaben, Zeitpläne, Abhängigkeiten und Fortschritt als Balkendiagramm.'
        },
        {
            question: 'Was versteht man im Änderungsmanagement unter „Scope Creep“?',
            options: ['Die bewusste Reduzierung des Projektumfangs um Kosten zu sparen.', 'Das unkontrollierte Anwachsen des Projektumfangs ohne entsprechende Anpassung von Ressourcen oder Zeit.', 'Die langsame Arbeitsweise von Projektteams.', 'Ein spezielles Software-Tool zur Terminplanung.'],
            correct: [1],
            category: 'Teil 6: Management Tools',
            explanation: 'Der Projektscope zielt darauf ab, klare Abgrenzungen zu schaffen, um das unbegrenzte Wachsen (Scope Creep) zu vermeiden.'
        }
    ]

    console.log(`Adding ${questions.length} questions...`)

    await prisma.quizQuestion.createMany({
        data: questions.map(q => ({
            ...q,
            examId: createdExam.id,
        }))
    })

    console.log(`✅ ${questions.length} questions added successfully.`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
