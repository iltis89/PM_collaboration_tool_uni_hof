import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding PM Grundlagen Themenblock...')

    // Configuration for this topic block
    const examData = {
        title: 'Themenblock 1: PM Grundlagen',
        description: 'Grundlagenwissen aus dem Skript „Projektmanagement_01_Grundlagen.pdf" – Projektdefinition, Phasen, AKV-Prinzip, Scrum & Kanban.',
        duration: 15,  // 15 minutes for 13 questions
        order: 1,      // First topic block in sequence
        type: 'TOPIC_BLOCK' as const
    }

    // Check if exam exists and clean up if it does to ensure fresh data
    const existingExams = await prisma.exam.findMany({
        where: { title: examData.title }
    })

    for (const ex of existingExams) {
        console.log(`Deleting existing exam: ${ex.id}`)
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
            title: examData.title,
            description: examData.description,
            duration: examData.duration,
            order: examData.order,
            type: examData.type
        }
    })

    console.log(`✅ Exam created with ID: ${createdExam.id}`)

    const questions = [
        // Frage 1
        {
            question: 'Was sind laut Definition die wesentlichen Merkmale, die ein Projekt von einer Routineaufgabe unterscheiden?',
            options: [
                'Es ist ein fortlaufender Prozess ohne definiertes Ende.',
                'Ein Projekt ist jede Aufgabe, die länger als zwei Tage dauert.',
                'Ein Projekt zeichnet sich durch Einmaligkeit, zeitliche Befristung, Komplexität, Neuartigkeit und definierte Ziele aus.',
                'Projekte sind Aufgaben, die ausschließlich von externen Beratern durchgeführt werden.'
            ],
            correct: [2],
            category: 'Projektdefinition',
            explanation: 'Laut Skript (Seite 9–10) ist ein Projekt ein Vorhaben, das durch die Einmaligkeit der Bedingungen gekennzeichnet ist. Dazu gehören eine konkrete Zielvorgabe sowie zeitliche, finanzielle und personelle Begrenzungen. Es unterscheidet sich damit von alltäglichen Routineaufgaben.'
        },
        // Frage 2
        {
            question: 'Welche vier zentralen Fragen sollte sich ein Projektmanager zu Beginn eines Projekts stellen?',
            options: [
                'Wer ist schuld? Wie viel kostet es? Wann ist Pause? Wer macht die Arbeit?',
                'Was brauche ich? Was muss ich beachten? Was muss ich tun? Was hilft mir dabei?',
                'Warum machen wir das? Wer bezahlt das? Wann sind wir fertig? Wer ist der Chef?',
                'Wie vermeiden wir Risiken? Wer haftet? Wo ist das Büro? Welche Software nutzen wir?'
            ],
            correct: [1],
            category: 'Projektmanagement Grundfragen',
            explanation: 'Auf Seite 11 werden vier zentrale Fragen aufgeführt, die sich jeder Projektmanager zu Beginn stellen sollte: 1. Was brauche ich für mein Projekt? 2. Was muss ich bei der Durchführung beachten? 3. Was muss ich im Rahmen des Projekts alles tun? 4. Was hilft mir dabei?'
        },
        // Frage 3
        {
            question: 'Welche Tätigkeiten gehören zum „Rad des Projektmanagements" (Kernaufgaben)?',
            options: [
                'Nur das Delegieren von unbeliebten Aufgaben.',
                'Organisieren, Planen, Entscheiden, Steuern, Überwachen, Motivieren und Informieren.',
                'Ausschließlich die Überwachung der Kosten und das Schreiben von Rechnungen.',
                'Das Vermeiden von Entscheidungen, um Konflikte zu umgehen.'
            ],
            correct: [1],
            category: 'PM-Kernaufgaben',
            explanation: 'Das „Projektmanagement-Rad" auf Seite 12 visualisiert die Kernaufgaben. Dazu zählen: Organisieren, Planen, Informieren, Entscheiden, Steuern, Überwachen und Motivieren.'
        },
        // Frage 4
        {
            question: 'Woraus entstehen Projektideen (Ansatzpunkt „Auslöser") häufig?',
            options: [
                'Ausschließlich durch interne Anweisungen der Geschäftsführung.',
                'Durch das Kopieren alter Projekte ohne Anpassung.',
                'Ideen entstehen nur, wenn das Budget am Jahresende noch nicht aufgebraucht ist.',
                'Durch technische Entwicklungen, Kundenbedürfnisse (Marketingkonzepte) oder die Marktsituation (Wettbewerb).'
            ],
            correct: [3],
            category: 'Projektidee & Auslöser',
            explanation: 'Im Abschnitt „Wie entsteht eine Projektidee" (Seite 20) werden als Ansatzpunkte technische Entwicklungen, Kundenbedürfnisse (Marketingkonzepte) und die Marktsituation (Reaktion auf Wettbewerb) genannt.'
        },
        // Frage 5
        {
            question: 'Das „AKV-Prinzip" ist zentral für die Delegation und Organisation. Wofür steht die Abkürzung?',
            options: [
                'Arbeit, Kosten, Vertrauen',
                'Analyse, Konzept, Verkauf',
                'Aufgabe, Kompetenz, Verantwortung',
                'Anfang, Kernphase, Vollendung'
            ],
            correct: [2],
            category: 'AKV-Prinzip',
            explanation: 'Auf Seite 21 wird im Kontext von Delegation und Organisation das AKV-Prinzip erläutert. Es steht für die Einheit von Aufgabe, Kompetenz und Verantwortung. Nur wenn diese drei im Gleichgewicht sind, funktioniert Delegation.'
        },
        // Frage 6
        {
            question: 'Was ist der Zweck eines „Projektauftrags" (Project Charter)?',
            options: [
                'Er dient als formelles Startdokument, das Projektziele, Meilensteine, Kosten, Ressourcen und die Organisation festhält.',
                'Er ist eine unverbindliche Ideensammlung.',
                'Er dient dazu, das Projekt am Ende formell abzuschließen.',
                'Er ist eine detaillierte technische Anleitung für die Produktentwicklung.'
            ],
            correct: [0],
            category: 'Projektauftrag',
            explanation: 'Der Projektauftrag (Seite 25) ist das formelle Startdokument. Er hält die Ausgangslage, Projektziele, Meilensteine, Kosten, Ressourcen und die Projektorganisation fest und dient als Genehmigungsgrundlage.'
        },
        // Frage 7
        {
            question: 'Was wird mit dem Begriff „Projektscope" definiert?',
            options: [
                'Die geografische Reichweite des Projekts.',
                'Der detaillierte Inhalt und Umfang des Projekts sowie die Abgrenzung („in scope" vs. „out of scope").',
                'Die Anzahl der Stakeholder im Projekt.',
                'Das Budget für die Abschlussfeier.'
            ],
            correct: [1],
            category: 'Projektscope',
            explanation: 'Der Projektscope (Seite 27) beschreibt den eigentlichen Inhalt des Projekts. Essenziell ist die Unterscheidung: Was ist „in scope" (Teil des Projekts) und was ist „out of scope" (explizit nicht Teil des Projekts)?'
        },
        // Frage 8
        {
            question: 'Welche fünf Phasen definiert die Norm DIN ISO 21500 für das klassische Projektmanagement?',
            options: [
                'Idee, Entwurf, Bau, Verkauf, Abrechnung.',
                'Initialisierungsphase, Definitionsphase, Planungsphase, Steuerungsphase, Abschlussphase.',
                'Start, Mitte, Ende, Nachbereitung, Urlaub.',
                'Analyse, Design, Implementierung, Test, Wartung.'
            ],
            correct: [1],
            category: 'Projektphasen (DIN ISO 21500)',
            explanation: 'Auf Seite 28 wird das Phasenmodell nach DIN ISO 21500 vorgestellt. Die fünf Phasen sind: Initialisierungsphase, Definitionsphase, Planungsphase, Steuerungsphase (Durchführung & Controlling) und Abschlussphase.'
        },
        // Frage 9
        {
            question: 'Was kennzeichnet einen „Meilenstein" im Projektplan?',
            options: [
                'Er ist ein Ereignis oder Zeitpunkt, der wesentliche Zwischenergebnisse markiert und Phasen trennt (keine zeitliche Dauer).',
                'Er hat eine zeitliche Dauer von mindestens einer Woche.',
                'Er beschreibt die maximalen Kosten eines Arbeitspakets.',
                'Er ist ein Synonym für das Projektende.'
            ],
            correct: [0],
            category: 'Meilensteine',
            explanation: 'Ebenfalls auf Seite 28 wird definiert: „Ein Meilenstein stellt keine zeitliche Dauer, sondern ein Ereignis dar." Meilensteine trennen die einzelnen Phasen voneinander und markieren wesentliche Zwischenergebnisse.'
        },
        // Frage 10
        {
            question: 'Was ist laut Skript ein häufiger Grund für das Scheitern von Projekten?',
            options: [
                'Zu viel Kommunikation im Team.',
                'Ungenügende Projektdefinition, unklare Verantwortlichkeiten und zu knapp kalkulierte Ressourcen.',
                'Die Verwendung von moderner Software.',
                'Zu viele Stakeholder mit positivem Interesse.'
            ],
            correct: [1],
            category: 'Gründe für Projektscheitern',
            explanation: 'Seite 35 listet explizit Gründe für das Scheitern auf. Dazu zählen: Ungenügende Projektdefinition, unklare Verantwortlichkeiten und zu knapp kalkulierte Ressourcen (Zeit und Personal).'
        },
        // Frage 11
        {
            question: 'Wann ist der Einsatz der „Wasserfall-Methode" (Klassisches PM) sinnvoll?',
            options: [
                'Wenn die Anforderungen völlig unklar sind und sich täglich ändern.',
                'Wenn das Projektergebnis und die Produkteigenschaften vorab präzise beschreibbar und festlegbar sind.',
                'Wenn man ohne Planung einfach „drauflosarbeiten" möchte.',
                'Wenn der Kunde erst am Ende des Projekts eingebunden werden soll, obwohl er nicht weiß, was er will.'
            ],
            correct: [1],
            category: 'Wasserfall-Methode',
            explanation: 'Auf Seite 40 wird das klassische Projektmanagement (Wasserfall) als linearer Prozess beschrieben. Es eignet sich, wenn das Projektergebnis und die Produkteigenschaften vorab präzise beschreibbar und festlegbar sind.'
        },
        // Frage 12
        {
            question: 'Welche drei Hauptrollen gibt es im Scrum-Team?',
            options: [
                'Product Owner, Scrum Master, Entwicklungsteam.',
                'Manager, Designer, Controller.',
                'Projektleiter, Assistent, Praktikant.',
                'Chef, Kunde, Lieferant.'
            ],
            correct: [0],
            category: 'Scrum-Rollen',
            explanation: 'Seite 42 beschreibt die drei Hauptrollen im Scrum-Team: Product Owner (verantwortlich für Produkt & Backlog), Scrum Master (unterstützt Team & Prozess) und Entwicklungsteam (Umsetzung).'
        },
        // Frage 13
        {
            question: 'Was ist das Kernprinzip der Kanban-Methode?',
            options: [
                'Arbeiten in festen Sprints von 2–4 Wochen.',
                'Ein strikter Projektplan, der Monate im Voraus festgelegt wird.',
                'Visualisierung des Arbeitsflusses (z.B. Board) und Limitierung der parallelen Aufgaben (WIP – Work in Progress).',
                'Tägliche Meetings, die mindestens zwei Stunden dauern.'
            ],
            correct: [2],
            category: 'Kanban',
            explanation: 'Auf Seite 43 wird Kanban erklärt. Kernpunkte sind die Visualisierung des Arbeitsflusses (Kanban-Board) und die Limitierung der „Work in Progress" (WIP), um Überlastung zu vermeiden. Es gibt keine festen Sprints wie bei Scrum.'
        }
    ]

    console.log(`Adding ${questions.length} questions...`)

    await prisma.quizQuestion.createMany({
        data: questions.map(q => ({
            ...q,
            examId: createdExam.id,
        }))
    })

    console.log(`✅ ${questions.length} questions added to "${examData.title}" successfully.`)
    console.log(`\n📋 Summary:`)
    console.log(`   - Exam ID: ${createdExam.id}`)
    console.log(`   - Order: ${examData.order} (first topic block)`)
    console.log(`   - Type: ${examData.type}`)
    console.log(`   - Duration: ${examData.duration} minutes`)
    console.log(`   - Questions: ${questions.length}`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
