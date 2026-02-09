import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database...')

    // Create Admin User
    const adminPassword = await hash('Marcus$2025', 12)

    const admin = await prisma.user.upsert({
        where: { email: 'marcus.goerner@requestchange.eu' },
        update: {},
        create: {
            email: 'marcus.goerner@requestchange.eu',
            password: adminPassword,
            name: 'Marcus Görner',
            role: 'ADMIN',
            xp: 0,
            level: 1,
            streak: 0,
        },
    })
    console.log('✅ Admin user created:', admin.email)

    // Create Students
    const studentPassword = await hash('Start!2025', 12)
    const students = [
        { name: 'Jakob Ahlgrimm', email: 'ahlgrimmjakob@gmail.com' },
        { name: 'Erik Bär', email: 'erik.baer@hof-university.de' },
        { name: 'Vijona Gashi', email: 'vijona.gashi@hof-university.de' },
        { name: 'Konstantin Wehr', email: 'kwehr@hof-university.de' },
        { name: 'Nico Weigel', email: 'nweigel@hof-university.de' },
        { name: 'Charlotte Fritz', email: 'cfritz@hof-university.de' },
        { name: 'Nadine Bauer', email: 'nbauer@hof-university.de' },
        { name: 'Raissa Kempfer', email: 'raissa.kempfer@hof-university.de' },
        { name: 'Chiara Martin', email: 'cmartin2@hof-university.de' },
        { name: 'Metecan Durak', email: 'metecan.durak@hof-university.de' },
        { name: 'Maryam Pazouki', email: 'Maryam.pazouki@hof-university.de' },
        { name: 'Lavinia Kolofik', email: 'lavinia.kolofik@hof-university.de' },
        { name: 'Nina Lauterbach', email: 'nlauterbach@hof-university.de' },
        { name: 'Kirill Wolf', email: 'kwolf@hof-university.de' },
        { name: 'Dominika Zajaczkowska', email: 'Dominika.zajaczkowska@hof-university.de' },
        { name: 'Kasra Nobari', email: 'kasra.nobari@hof-university.de' },
        { name: 'Nick Haupt', email: 'nhaupt2@hof-university.de' },
        { name: 'Haktan Kanpolat', email: 'kanpolathaktan@gmail.com' },
        { name: 'Patrick Reichel', email: 'patrick.reichel.2@hof-university.de' },
        { name: 'Felix Rittmann', email: 'felix.rittmann@hof-university.de' },
        { name: 'Ludwig Stangenberg', email: 'ludwig.stangenberg@hof-university.de' },
    ]

    for (const student of students) {
        await prisma.user.upsert({
            where: { email: student.email },
            update: {
                name: student.name,
                mustChangePassword: true
            },
            create: {
                email: student.email,
                password: studentPassword,
                name: student.name,
                role: 'STUDENT',
                xp: 0,
                level: 1,
                streak: 0,
                mustChangePassword: true,
            },
        })
        console.log(`✅ Student created: ${student.name} (${student.email})`)
    }

    // Create sample materials
    const materialData = [
        {
            title: 'Projektmanagement 01 - Grundlagen',
            description: 'Einführung in die Grundlagen des Projektmanagements',
            fileUrl: 'https://dfibivartddugsms.public.blob.vercel-storage.com/Projektmanagement_01_Grundlagen-dqX9geFkiSDuXMuWodfYfqusatMr1j.pdf',
            size: '13.5 MB'
        },
        {
            title: 'Projektmanagement 02 - Prozess',
            description: 'Projektmanagement-Prozesse und Phasen',
            fileUrl: 'https://dfibivartddugsms.public.blob.vercel-storage.com/Projektmanagement_02_Prozess-rh5Sbkjcrb8xJCIt0ZkQtnPUC0QX6L.pdf',
            size: '14.9 MB'
        },
        {
            title: 'Wahlpflichtfach Projektmanagement',
            description: 'Kursübersicht und Anforderungen',
            fileUrl: 'https://dfibivartddugsms.public.blob.vercel-storage.com/Wahlpflichtfach%20Projektmanagement-pIdxjBwm5Mvalia9pHapTnMm4kv6AB.pdf',
            size: '647 KB'
        },
        {
            title: 'Design Projektmanagement - Methoden, Tools, KI',
            description: 'Ergänzungsmaterial zu Design-Methoden und KI im PM',
            fileUrl: 'https://dfibivartddugsms.public.blob.vercel-storage.com/Design%20Projektmanagement_%20Methoden%2C%20Tools%2C%20KI-xXWgzafu7st4JXYubi4tMgUPBJXPNd.pdf',
            size: '393 KB'
        }
    ]

    let materialsCount = 0
    for (const mat of materialData) {
        const existing = await prisma.material.findFirst({ where: { title: mat.title } })
        if (!existing) {
            await prisma.material.create({ data: mat })
            materialsCount++
        }
    }
    console.log('✅ Materials seeded:', materialsCount)

    // Create sample quiz questions
    const questionData = [
        {
            question: 'Was ist die Hauptbeschränkung im magischen Dreieck des Projektmanagements?',
            options: ['Kosten', 'Qualität', 'Alle sind Beschränkungen (Zeit, Kosten, Umfang)', 'Ressourcen'],
            correct: [2],
            category: 'Layer 01',
        },
        {
            question: 'Welche Phase kommt zuerst im Projektlebenszyklus?',
            options: ['Durchführung', 'Planung', 'Initiierung', 'Abschluss'],
            correct: [2],
            category: 'Layer 01',
        },
        {
            question: 'Wer ist in Scrum für das Product Backlog verantwortlich?',
            options: ['Scrum Master', 'Product Owner', 'Entwicklungsteam', 'Stakeholder'],
            correct: [1],
            category: 'Layer 03',
        },
    ]

    let questionsCount = 0
    for (const q of questionData) {
        const existing = await prisma.quizQuestion.findFirst({ where: { question: q.question } })
        if (!existing) {
            await prisma.quizQuestion.create({ data: q })
            questionsCount++
        }
    }
    console.log('✅ Quiz questions seeded:', questionsCount)

    // Create sample news
    const news = await prisma.news.create({
        data: {
            title: 'Willkommen zum Kurs!',
            content: 'Herzlich willkommen zur Projektmanagement Vorlesung. Wir freuen uns, dass ihr dabei seid!',
            author: 'Prof. Dr. Müller',
        },
    })
    console.log('✅ News created:', news.title)

    // Create sample lecture
    const lecture = await prisma.lecture.create({
        data: {
            title: 'Agile Methodologies II',
            description: 'Thema: Scrum vs Kanban',
            room: 'Hörsaal B12',
            professor: 'Prof. Dr. Müller',
            startTime: new Date(new Date().setHours(14, 0, 0, 0)),
            endTime: new Date(new Date().setHours(15, 30, 0, 0)),
        }
    })
    console.log('✅ Lecture created:', lecture.title)

    console.log('🎉 Seeding complete!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
