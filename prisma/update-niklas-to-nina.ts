import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🔄 Updating user name from Niklas to Nina...')

    const updatedUser = await prisma.user.update({
        where: { email: 'nlauterbach@hof-university.de' },
        data: { name: 'Nina' }
    })

    console.log('✅ User updated successfully:', updatedUser.name, `(${updatedUser.email})`)
}

main()
    .catch((e) => {
        console.error('❌ Error updating user:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
