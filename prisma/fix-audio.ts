import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🎵 Erstelle Audio-Einträge...')

    // Delete existing audio snippets if any
    const deleted = await prisma.audioSnippet.deleteMany({})
    console.log(`   Gelöscht: ${deleted.count} alte Einträge`)

    // Create audio snippet with Blob URL
    const audio = await prisma.audioSnippet.create({
        data: {
            title: 'Water-Scrum-Fall, Tools, DSGVO und KI',
            description: 'Zusammenfassung der Vorlesung zu agilen Methoden, PM-Tools, Datenschutz und KI im Projektmanagement',
            url: 'https://dfibivartddugsms.public.blob.vercel-storage.com/Water-Scrum-Fall%20Tools%20DSGVO%20und%20KI-mj8kHQL0IIWhNpqcnwSxNZBmrA0MiX.mp3',
            duration: 180 // ca. 3 min (geschätzt basierend auf 2.7MB)
        }
    })

    console.log(`✅ Audio-Snippet erstellt: "${audio.title}"`)
    console.log(`   URL: ${audio.url.substring(0, 60)}...`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
