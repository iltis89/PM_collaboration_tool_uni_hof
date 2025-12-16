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
        { name: 'Kiri Wolf', email: 'kwolf@hof-university.de' },
        { name: 'Vijona Gashi', email: 'vijona.gashi@hof-university.de' },
        { name: 'Konstantin', email: 'kwehr@hof-university.de' },
        { name: 'Ludwig Stangenberg', email: 'ludwig.stangenberg@hof-university.de' },
    ]

    for (const student of students) {
        await prisma.user.upsert({
            where: { email: student.email },
            update: { mustChangePassword: true },
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
    const materials = await prisma.material.createMany({
        data: [
            { title: 'Layer 01 - Intro to PM.pdf', size: '2.4 MB' },
            { title: 'Layer 02 - Stakeholder Management.pdf', size: '1.8 MB' },
            { title: 'Layer 03 - Agile Basics.pdf', size: '3.1 MB' },
            { title: 'Case Study - Tesla.pdf', size: '5.4 MB' },
        ],
        skipDuplicates: true,
    })
    console.log('✅ Materials seeded:', materials.count)

    // Create sample quiz questions
    const quizQuestions = await prisma.quizQuestion.createMany({
        data: [
            {
                question: 'Was ist die Hauptbeschränkung im magischen Dreieck des Projektmanagements?',
                options: ['Kosten', 'Qualität', 'Alle sind Beschränkungen (Zeit, Kosten, Umfang)', 'Ressourcen'],
                correct: 2,
                category: 'Layer 01',
            },
            {
                question: 'Welche Phase kommt zuerst im Projektlebenszyklus?',
                options: ['Durchführung', 'Planung', 'Initiierung', 'Abschluss'],
                correct: 2,
                category: 'Layer 01',
            },
            {
                question: 'Wer ist in Scrum für das Product Backlog verantwortlich?',
                options: ['Scrum Master', 'Product Owner', 'Entwicklungsteam', 'Stakeholder'],
                correct: 1,
                category: 'Layer 03',
            },
        ],
        skipDuplicates: true,
    })
    console.log('✅ Quiz questions seeded:', quizQuestions.count)

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
