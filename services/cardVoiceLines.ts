import { Lang } from "../i18n";

/**
 * Voice-on-click reactions for main menu cards (ImageAccordion components)
 * Warm, TSH-style, conversational voice lines
 * Max 6-8 seconds per line
 * 
 * Used ONLY for main menu cards (Hub, Room, Area) - NOT for concierge
 */

export const CARD_VOICE_LINES: Record<string, Record<Lang, string[]>> = {
    // Hub cards
    hub_facilities: {
        en: [
            "This is where the community comes together — let's take a look.",
            "Let me show you our favorite shared spaces.",
            "These are the spots where everyone hangs out."
        ],
        fr: [
            "C'est ici que la communauté se rassemble — jetons un œil.",
            "Voici nos espaces préférés pour se retrouver.",
            "C'est là que tout le monde se retrouve."
        ],
        de: [
            "Hier kommt die Community zusammen — schauen wir mal.",
            "Das sind unsere Lieblings-Gemeinschaftsräume.",
            "Hier trifft sich jeder."
        ],
        es: [
            "Aquí se reúne la comunidad — echemos un vistazo.",
            "Te enseño nuestros espacios favoritos.",
            "Este es el sitio donde todos se juntan."
        ],
        it: [
            "Qui si riunisce la community — diamo un'occhiata.",
            "Ti mostro i nostri spazi preferiti.",
            "Qui si ritrova tutti."
        ],
        pt: [
            "Aqui é onde a comunidade se reúne — vamos ver.",
            "Deixa-me mostrar os nossos espaços favoritos.",
            "É aqui que toda a gente se junta."
        ]
    },
    hub_food_drinks: {
        en: [
            "Good food, good moments — here's what's available.",
            "Let's explore the food and drink options.",
            "Time to check out what's cooking."
        ],
        fr: [
            "Bonne cuisine, bons moments — voici ce qui est disponible.",
            "On va voir ce qu'on peut manger et boire.",
            "Voyons ce qu'il y a de bon."
        ],
        de: [
            "Gutes Essen, gute Momente — hier ist das Angebot.",
            "Schauen wir, was es zu essen gibt.",
            "Zeit für Essen und Trinken."
        ],
        es: [
            "Buena comida, buenos momentos — esto es lo que hay.",
            "Vamos a ver qué se puede comer y beber.",
            "A ver qué hay de bueno."
        ],
        it: [
            "Buon cibo, bei momenti — ecco cosa c'è.",
            "Vediamo cosa c'è da mangiare e bere.",
            "Diamo un'occhiata al menu."
        ],
        pt: [
            "Boa comida, bons momentos — aqui está o que há.",
            "Vamos ver o que há para comer e beber.",
            "Hora de ver as opções."
        ]
    },
    hub_shop: {
        en: [
            "From essentials to latest drops — all the good stuff.",
            "Our shop has everything you need.",
            "Check out what's in store today."
        ],
        fr: [
            "Des essentiels aux dernières éditions — que du bon.",
            "Le shop a tout ce qu'il faut.",
            "Voyons ce qui est dispo."
        ],
        de: [
            "Vom Nötigsten bis zu neuesten Drops — alles Gute.",
            "Im Shop gibt's alles, was du brauchst.",
            "Schauen wir, was es Neues gibt."
        ],
        es: [
            "De lo esencial a las últimas novedades — todo lo bueno.",
            "La tienda tiene todo lo que necesitas.",
            "Veamos qué hay hoy."
        ],
        it: [
            "Dall'essenziale alle ultime novità — tutto il meglio.",
            "Il negozio ha tutto quello che ti serve.",
            "Vediamo cosa c'è oggi."
        ],
        pt: [
            "Do essencial às últimas novidades — o melhor.",
            "A loja tem tudo o que precisas.",
            "Vamos ver o que há."
        ]
    },

    // Room cards
    room_wifi: {
        en: [
            "Everything you need to stay connected, right here.",
            "Let's get you online.",
            "Here's how the WiFi works."
        ],
        fr: [
            "Tout ce qu'il faut pour rester connecté, juste ici.",
            "On va te connecter.",
            "Voici comment marche le WiFi."
        ],
        de: [
            "Alles, um verbunden zu bleiben, genau hier.",
            "Bringen wir dich online.",
            "So funktioniert das WLAN."
        ],
        es: [
            "Todo lo que necesitas para estar conectado, justo aquí.",
            "Vamos a conectarte.",
            "Así funciona el WiFi."
        ],
        it: [
            "Tutto per rimanere connesso, proprio qui.",
            "Ti connetto subito.",
            "Ecco come funziona il WiFi."
        ],
        pt: [
            "Tudo para ficar conectado, mesmo aqui.",
            "Vamos conectar-te.",
            "É assim que o WiFi funciona."
        ]
    },
    room_cleaning: {
        en: [
            "Keeping your space fresh and comfortable.",
            "Here's how cleaning works.",
            "Let me explain the housekeeping schedule."
        ],
        fr: [
            "Pour garder votre espace frais et confortable.",
            "Voici comment marche le ménage.",
            "Je t'explique le planning."
        ],
        de: [
            "Damit Ihr Raum frisch und gemütlich bleibt.",
            "So läuft die Reinigung.",
            "Der Reinigungsplan erklärt."
        ],
        es: [
            "Manteniendo tu espacio fresco y cómodo.",
            "Así funciona la limpieza.",
            "Te explico el horario."
        ],
        it: [
            "Per mantenere il tuo spazio fresco e confortevole.",
            "Ecco come funziona la pulizia.",
            "Ti spiego il programma."
        ],
        pt: [
            "Mantendo o seu espaço fresco e confortável.",
            "É assim que funciona a limpeza.",
            "Deixa-me explicar o horário."
        ]
    },
    room_amenities: {
        en: [
            "All the little things that make it feel like home.",
            "Here's what's in your room.",
            "Let me show you the amenities."
        ],
        fr: [
            "Tous les petits détails qui font que vous vous sentez chez vous.",
            "Voici ce qu'il y a dans ta chambre.",
            "Je te montre les équipements."
        ],
        de: [
            "All die kleinen Dinge, die es wie zuhause anfühlen lassen.",
            "Das ist in Ihrem Zimmer.",
            "Die Ausstattung erklärt."
        ],
        es: [
            "Todos los detalles que lo hacen sentir como casa.",
            "Esto es lo que hay en tu habitación.",
            "Te enseño las comodidades."
        ],
        it: [
            "Tutti i piccoli dettagli che lo fanno sentire come casa.",
            "Ecco cosa c'è nella tua stanza.",
            "Ti mostro i comfort."
        ],
        pt: [
            "Todos os pequenos detalhes que fazem sentir como em casa.",
            "Isto é o que está no teu quarto.",
            "Deixa-me mostrar as comodidades."
        ]
    },
    room_comfort: {
        en: [
            "Everything to feel at home, right here.",
            "Making your stay comfortable.",
            "Here's what you need to know."
        ],
        fr: [
            "Tout pour se sentir chez soi, juste ici.",
            "Pour un séjour confortable.",
            "Voici ce qu'il faut savoir."
        ],
        de: [
            "Alles, um sich wie zuhause zu fühlen, genau hier.",
            "Für einen komfortablen Aufenthalt.",
            "Das sollten Sie wissen."
        ],
        es: [
            "Todo para sentirse como en casa, justo aquí.",
            "Para una estancia cómoda.",
            "Esto es lo que debes saber."
        ],
        it: [
            "Tutto per sentirsi a casa, proprio qui.",
            "Per un soggiorno confortevole.",
            "Ecco cosa devi sapere."
        ],
        pt: [
            "Tudo para se sentir em casa, mesmo aqui.",
            "Para uma estadia confortável.",
            "Isto é o que precisa de saber."
        ]
    },

    // Neighborhood cards
    area_dining: {
        en: [
            "Great spots just around the corner — local favorites.",
            "Here are the best places to eat nearby.",
            "Let me show you where locals go."
        ],
        fr: [
            "De bons endroits juste au coin — nos favoris locaux.",
            "Voici les meilleurs restos du coin.",
            "Je te montre où mangent les locaux."
        ],
        de: [
            "Tolle Orte gleich um die Ecke — lokale Favoriten.",
            "Die besten Restaurants in der Nähe.",
            "Ich zeig dir, wo die Locals hingehen."
        ],
        es: [
            "Grandes sitios a la vuelta de la esquina — favoritos locales.",
            "Los mejores sitios para comer cerca.",
            "Te enseño dónde van los locales."
        ],
        it: [
            "Ottimi posti dietro l'angolo — i preferiti del quartiere.",
            "I migliori ristoranti qui vicino.",
            "Ti mostro dove vanno i locali."
        ],
        pt: [
            "Ótimos sítios mesmo ao virar da esquina — favoritos locais.",
            "Os melhores sítios para comer perto.",
            "Deixa-me mostrar onde vão os locais."
        ]
    },
    area_transport: {
        en: [
            "Getting around is easy — here's how.",
            "Let me explain the transport options.",
            "Here's how to move around the city."
        ],
        fr: [
            "Se déplacer est facile — voici comment.",
            "Je t'explique les transports.",
            "Voici comment bouger en ville."
        ],
        de: [
            "Unterwegs sein ist einfach — so geht's.",
            "Die Transport-Optionen erklärt.",
            "So kommst du durch die Stadt."
        ],
        es: [
            "Moverse es fácil — así es cómo.",
            "Te explico las opciones de transporte.",
            "Así te mueves por la ciudad."
        ],
        it: [
            "Girare è facile — ecco come.",
            "Ti spiego le opzioni di trasporto.",
            "Ecco come muoversi in città."
        ],
        pt: [
            "Andar por aí é fácil — aqui está como.",
            "Deixa-me explicar as opções de transporte.",
            "É assim que te moves pela cidade."
        ]
    },
    area_essentials: {
        en: [
            "Everything you might need, close by.",
            "Here's what's nearby.",
            "The essentials are all around you."
        ],
        fr: [
            "Tout ce dont vous pourriez avoir besoin, à proximité.",
            "Voici ce qu'il y a près d'ici.",
            "L'essentiel est juste à côté."
        ],
        de: [
            "Alles, was Sie brauchen könnten, ganz nah.",
            "Das gibt's in der Nähe.",
            "Das Wichtigste ist gleich um die Ecke."
        ],
        es: [
            "Todo lo que podrías necesitar, cerca.",
            "Esto es lo que hay cerca.",
            "Lo esencial está a tu alrededor."
        ],
        it: [
            "Tutto ciò di cui potresti aver bisogno, vicino.",
            "Ecco cosa c'è qui vicino.",
            "L'essenziale è tutto intorno."
        ],
        pt: [
            "Tudo o que possa precisar, por perto.",
            "Isto é o que há perto.",
            "O essencial está à tua volta."
        ]
    },

    // Front Desk (StickyAction card)
    front_desk: {
        en: [
            "Please dial nine from your room phone to reach the front desk. Our team will be happy to assist you with anything you need.",
            "Need help? Just dial nine from your room. We're here for you twenty-four seven.",
            "Our front desk is always here. Dial nine from your room phone anytime."
        ],
        fr: [
            "Veuillez composer le 9 depuis le téléphone de votre chambre pour joindre la réception. Notre équipe sera ravie de vous aider.",
            "Besoin d'aide ? Composez le 9. On est là 24h/24.",
            "La réception est toujours disponible. Faites le 9 depuis votre chambre."
        ],
        de: [
            "Bitte wählen Sie die 9 von Ihrem Zimmertelefon, um die Rezeption zu erreichen. Unser Team hilft Ihnen gerne bei allem, was Sie brauchen.",
            "Brauchen Sie Hilfe? Wählen Sie einfach die 9. Wir sind rund um die Uhr da.",
            "Unsere Rezeption ist immer für Sie da. Wählen Sie die 9."
        ],
        es: [
            "Por favor, marque el 9 desde el teléfono de su habitación para comunicarse con recepción. Nuestro equipo estará encantado de ayudarle con lo que necesite.",
            "¿Necesitas ayuda? Marca el 9. Estamos aquí las 24 horas.",
            "Recepción siempre disponible. Marca el 9 desde tu habitación."
        ],
        it: [
            "Comporre il 9 dal telefono della camera per raggiungere la reception. Il nostro team sarà felice di assistervi con qualsiasi cosa abbiate bisogno.",
            "Serve aiuto? Chiama il 9. Ci siamo 24 ore su 24.",
            "La reception è sempre disponibile. Chiama il 9."
        ],
        pt: [
            "Por favor, marque 9 do telefone do seu quarto para contactar a receção. A nossa equipa terá todo o prazer em ajudá-lo com o que precisar.",
            "Precisa de ajuda? Marque 9. Estamos cá sempre.",
            "A receção está sempre disponível. Marque 9 do seu quarto."
        ]
    }

};

/**
 * Helper to get speech synthesis language code from Lang
 */
export const getSpeechLangCode = (lang: Lang): string => {
    const map: Record<Lang, string> = {
        en: "en-GB",
        fr: "fr-FR",
        de: "de-DE",
        es: "es-ES",
        it: "it-IT",
        pt: "pt-PT"
    };
    return map[lang] || "en-GB";
};
