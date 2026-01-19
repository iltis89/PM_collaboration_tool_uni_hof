import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🗑️  Lösche alte Material-Einträge...')

    // Delete all existing materials
    const deleted = await prisma.material.deleteMany({})
    console.log(`   Gelöscht: ${deleted.count} Einträge`)

    console.log('\n📁 Erstelle neue Material-Einträge mit Blob-URLs...')

    // Create new materials with actual Blob URLs
    const materials = await prisma.material.createMany({
        data: [
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
    })

    console.log(`✅ ${materials.count} Materialien mit PDF-URLs erstellt!`)

    // List all materials to confirm
    const allMaterials = await prisma.material.findMany()
    console.log('\n📋 Aktuelle Materialien:')
    allMaterials.forEach(m => {
        console.log(`   - ${m.title}`)
        console.log(`     URL: ${m.fileUrl?.substring(0, 60)}...`)
    })
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
