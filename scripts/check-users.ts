import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🕵️ Checking users in the database...')

    const users = await prisma.user.findMany({
        where: {
            email: {
                in: [
                    'cfritz@hof-university.de', // Charlotte Fritz (was Christian)
                    'cmartin2@hof-university.de', // Chiara Martin (was Christian)
                    'kwolf@hof-university.de' // Kirill Wolf (was Kiri)
                ]
            }
        },
        select: {
            email: true,
            name: true
        }
    })

    console.log('Found users:')
    users.forEach(u => console.log(`- ${u.name} (${u.email})`))
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
