const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const user = await prisma.user.upsert({
        where: { email: 'test@example.com' },
        update: {},
        create: {
            email: 'test@example.com',
            name: 'Test User',
            password: hashedPassword,
        },
    });
    const exercises = [
        {
            name: "Pompki",
            set: "Kalistenika",
            difficulty: "Średni",
            silaValue: 8,
            mobilnoscValue: 3,
            dynamikaValue: 5,
            instructions: "1. Połóż się na brzuchu. 2. Oprzyj dłonie na podłodze na szerokość barków. 3. Wyprostuj ręce, unosząc ciało. 4. Opuść ciało, zginając ręce. 5. Powtórz.",
            enrichment: "Skupiaj się na utrzymaniu prostej linii ciała przez cały czas trwania ćwiczenia."
        },
        {
            name: "Przysiady",
            set: "Kalistenika",
            difficulty: "Początkujący",
            silaValue: 7,
            mobilnoscValue: 6,
            dynamikaValue: 5,
            instructions: "1. Stań prosto, stopy na szerokość bioder. 2. Zegnij kolana, opuszczając biodra, jakbyś siadał na krześle. 3. Wróć do pozycji wyjściowej.",
            enrichment: "Utrzymuj pięty na podłodze i kolana w linii ze stopami."
        },
        {
            name: "Podciąganie na drążku",
            set: "Kalistenika",
            difficulty: "Zaawansowany",
            silaValue: 9,
            mobilnoscValue: 5,
            dynamikaValue: 6,
            instructions: "1. Chwyć drążek nachwytem. 2. Podciągnij się, aż broda znajdzie się nad drążkiem. 3. Powoli opuść się do pozycji wyjściowej.",
            enrichment: "Skup się na kontrolowaniu ruchu w dół, aby maksymalnie zaangażować mięśnie."
        },
        {
            name: "Deska (Plank)",
            set: "Kalistenika",
            difficulty: "Początkujący",
            silaValue: 6,
            mobilnoscValue: 4,
            dynamikaValue: 2,
            instructions: "1. Oprzyj się na przedramionach i palcach stóp. 2. Utrzymuj proste ciało od głowy do pięt. 3. Wytrzymaj w tej pozycji.",
            enrichment: "Napnij mięśnie brzucha i pośladków, aby utrzymać stabilną pozycję."
        },
        {
            name: "Burpees",
            set: "Kalistenika",
            difficulty: "Średni",
            silaValue: 8,
            mobilnoscValue: 7,
            dynamikaValue: 9,
            instructions: "1. Zacznij w pozycji stojącej. 2. Przykucnij i połóż dłonie na podłodze. 3. Wyrzuć nogi do tyłu do pozycji deski. 4. Zrób pompkę. 5. Przyciągnij nogi do klatki piersiowej. 6. Wyskocz w górę z rękoma nad głową.",
            enrichment: "To ćwiczenie angażuje całe ciało i świetnie poprawia wydolność."
        },
        {
            name: "Dipy na poręczach",
            set: "Kalistenika",
            difficulty: "Średni",
            silaValue: 8,
            mobilnoscValue: 5,
            dynamikaValue: 4,
            instructions: "1. Chwyć poręcze i unieś się na wyprostowanych rękach. 2. Opuść ciało, zginając łokcie. 3. Wróć do pozycji wyjściowej, prostując ręce.",
            enrichment: "Utrzymuj łokcie blisko ciała podczas ruchu, aby skupić się na tricepsach."
        },
        {
            name: "Mountain Climbers",
            set: "Kalistenika",
            difficulty: "Początkujący",
            silaValue: 5,
            mobilnoscValue: 7,
            dynamikaValue: 8,
            instructions: "1. Zacznij w pozycji deski. 2. Przyciągaj na zmianę kolana do klatki piersiowej, jakbyś biegł w miejscu.",
            enrichment: "Utrzymuj stabilną pozycję górnej części ciała i kontroluj oddech."
        },
        {
            name: "Mostki",
            set: "Kalistenika",
            difficulty: "Początkujący",
            silaValue: 5,
            mobilnoscValue: 8,
            dynamikaValue: 3,
            instructions: "1. Połóż się na plecach z ugiętymi kolanami. 2. Unieś biodra, napinając pośladki. 3. Wytrzymaj, a następnie powoli opuść.",
            enrichment: "Skup się na napięciu pośladków w górnej pozycji."
        },
        {
            name: "Pistol Squat",
            set: "Kalistenika",
            difficulty: "Zaawansowany",
            silaValue: 9,
            mobilnoscValue: 9,
            dynamikaValue: 7,
            instructions: "1. Stań na jednej nodze. 2. Powoli opuść się, zginając kolano stojącej nogi. 3. Wróć do pozycji wyjściowej.",
            enrichment: "To zaawansowane ćwiczenie wymaga dużej siły i równowagi. Zacznij od płytszych przysiadów."
        },
        {
            name: "Skłony w zwisie",
            set: "Kalistenika",
            difficulty: "Średni",
            silaValue: 7,
            mobilnoscValue: 6,
            dynamikaValue: 5,
            instructions: "1. Zwis na drążku. 2. Unieś nogi do poziomu bioder. 3. Powoli opuść nogi.",
            enrichment: "Kontroluj ruch w obu kierunkach, aby maksymalnie zaangażować mięśnie brzucha."
        },
        {
            name: "Przeskoki przez przeszkodę",
            set: "Kalistenika",
            difficulty: "Średni",
            silaValue: 6,
            mobilnoscValue: 7,
            dynamikaValue: 9,
            instructions: "1. Stań przed niską przeszkodą. 2. Przeskocz obunóż nad przeszkodą. 3. Natychmiast przeskocz z powrotem.",
            enrichment: "Skup się na szybkim odbiciu i miękkim lądowaniu."
        },
        {
            name: "Handstand Push-ups",
            set: "Kalistenika",
            difficulty: "Zaawansowany",
            silaValue: 10,
            mobilnoscValue: 8,
            dynamikaValue: 6,
            instructions: "1. Przyjmij pozycję stania na rękach przy ścianie. 2. Opuść głowę w kierunku podłogi, zginając ręce. 3. Wypchnij się z powrotem do góry.",
            enrichment: "Zacznij od zwykłego stania na rękach, zanim przejdziesz do push-upów."
        },
        {
            name: "L-sit",
            set: "Kalistenika",
            difficulty: "Zaawansowany",
            silaValue: 8,
            mobilnoscValue: 9,
            dynamikaValue: 4,
            instructions: "1. Usiądź na podłodze z wyprostowanymi nogami. 2. Połóż dłonie po bokach bioder. 3. Unieś całe ciało, utrzymując nogi równolegle do podłogi.",
            enrichment: "To ćwiczenie wymaga dużej siły core i ramion. Zacznij od krótkich przytrzymań."
        },
        {
            name: "Muscle-up",
            set: "Kalistenika",
            difficulty: "Zaawansowany",
            silaValue: 10,
            mobilnoscValue: 8,
            dynamikaValue: 9,
            instructions: "1. Zacznij od zwisu na drążku. 2. Wykonaj gwałtowne podciągnięcie. 3. W górnej fazie ruchu przenieś ciało nad drążek. 4. Zakończ ruch wyprostowaniem rąk.",
            enrichment: "To złożone ćwiczenie łączy podciąganie z dipem. Wymaga dużej siły i koordynacji."
        },
        {
            name: "Dragon Flag",
            set: "Kalistenika",
            difficulty: "Zaawansowany",
            silaValue: 9,
            mobilnoscValue: 7,
            dynamikaValue: 5,
            instructions: "1. Połóż się na ławce, trzymając się za głową. 2. Unieś całe ciało, utrzymując je w prostej linii. 3. Powoli opuść, nie dotykając ławki plecami.",
            enrichment: "To ekstremalne ćwiczenie na mięśnie brzucha. Zacznij od unoszenia tylko nóg."
        }
    ]
    console.log({ user });

    for (const exercise of exercises) {
        try {
            await prisma.exercise.create({
                data: exercise,
            })
            console.log(`Added exercise: ${exercise.name}`)
        } catch (error) {
            console.error(`Error adding exercise ${exercise.name}:`, error)
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });