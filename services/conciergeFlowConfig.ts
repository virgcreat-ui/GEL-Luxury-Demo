
import { Lang } from '../i18n';

/**
 * Concierge Flow Configuration
 * Admin-editable config for guided concierge experience
 * Guest-only flow (student context removed)
 */

export interface TopicConfig {
    id: string;
    label: Record<Lang, string>;
    order: number;
}

export interface ConciergePathConfig {
    welcomeLines: Record<Lang, string[]>;
    askFirstTimeLines: Record<Lang, string[]>;
    firstTimeConfirmLines: Record<Lang, string[]>;
    returningConfirmLines: Record<Lang, string[]>;
    backLines: Record<Lang, string[]>;
    idleLines: Record<Lang, string[]>;
    topics: TopicConfig[];
    topicIntros: Record<string, Record<Lang, string[]>>;
}

export interface ConciergeFlowConfig {
    guest: ConciergePathConfig;
}

// Default configuration for all 6 languages - guest only
export const DEFAULT_CONCIERGE_FLOW_CONFIG: ConciergeFlowConfig = {
    guest: {
        welcomeLines: {
            en: ["Welcome to Le Grand Éclipse. I'll be your digital concierge, here to help you feel at home. Whenever you're ready, I can guide you through everything you need."],
            fr: ["Bienvenue à Le Grand Éclipse. Je serai votre concierge digitale, là pour vous aider à vous sentir chez vous. Quand vous voulez, je peux vous guider à chaque étape de votre séjour."],
            de: ["Willkommen im Le Grand Éclipse. Ich bin Ihre digitale Concierge und helfe Ihnen gern, sich hier wohlzufühlen. Wenn Sie möchten, begleite ich Sie durch alles Wichtige."],
            es: ["Bienvenido a Le Grand Éclipse. Seré tu concierge digital, aquí para ayudarte a sentirte como en casa. Cuando quieras, te guiaré en todo lo que necesites."],
            it: ["Benvenuto a Le Grand Éclipse. Sarò la tua concierge digitale, qui per farti sentire subito a casa. Quando vuoi, ti guiderò in tutto ciò di cui hai bisogno."],
            pt: ["Bem-vindo ao Le Grand Éclipse. Serei a sua concierge digital, aqui para o ajudar a sentir-se em casa. Sempre que quiser, posso guiá-lo em tudo o que precisar."]
        },
        askFirstTimeLines: {
            en: [
                "Lovely. Welcome. Is this your first time staying at Le Grand Éclipse, or have you stayed with us before?",
                "Great. I'll help you make the most of your stay. Is this your first time staying at Le Grand Éclipse, or have you stayed with us before?"
            ],
            fr: ["Ravissant. Bienvenue. C'est votre première fois au Le Grand Éclipse ?"],
            de: ["Wunderbar. Willkommen. Sind Sie zum ersten Mal im Le Grand Éclipse?"],
            es: ["Encantado. Bienvenido. ¿Es tu primera vez en Le Grand Éclipse?"],
            it: ["Piacere. Benvenuto. È la prima volta al Le Grand Éclipse?"],
            pt: ["Encantado. Bem-vindo. É a primeira vez no Le Grand Éclipse?"]
        },
        firstTimeConfirmLines: {
            en: ["Great choice. Le Grand Éclipse is a bit different — part hotel, part community. I'll show you the important things first."],
            fr: ["Excellent choix. Le Grand Éclipse est unique : mi-hôtel, mi-communauté. Je vous montre l'essentiel."],
            de: ["Gute Wahl. Le Grand Éclipse ist anders – halb Hotel, halb Community. Ich zeige Ihnen das Wichtigste zuerst."],
            es: ["Buena elección. Le Grand Éclipse es diferente: parte hotel, parte comunidad. Te enseñaré lo importante primero."],
            it: ["Ottima scelta. Le Grand Éclipse è diverso: un po' hotel, un po' community. Ti mostro prima le cose importanti."],
            pt: ["Boa escolha. O Le Grand Éclipse é diferente: parte hotel, parte comunidade. Vou mostrar-lhe o mais importante primeiro."]
        },
        returningConfirmLines: {
            en: ["Welcome back. Let's find what you need."],
            fr: ["Bon retour parmi nous. Trouvons ce qu'il vous faut."],
            de: ["Willkommen zurück. Finden wir, was Sie brauchen."],
            es: ["Bienvenido de nuevo. Busquemos lo que necesitas."],
            it: ["Bentornato. Troviamo ciò che ti serve."],
            pt: ["Bem-vindo de volta. Vamos encontrar o que precisa."]
        },
        backLines: {
            en: [
                "What would you like to check next?",
                "No rush — where to?",
                "Anything else I can help with?",
                "Let me know what you need.",
                "What's next?"
            ],
            fr: [
                "Que voulez-vous voir ensuite ?",
                "Prenez votre temps. Où aller ?",
                "Puis-je vous aider pour autre chose ?",
                "Dites-moi ce qu'il vous faut.",
                "Et maintenant ?"
            ],
            de: [
                "Was möchten Sie als nächstes sehen?",
                "Keine Eile. Wohin?",
                "Kann ich sonst noch helfen?",
                "Sagen Sie mir, was Sie brauchen.",
                "Was nun?"
            ],
            es: [
                "¿Qué quieres ver ahora?",
                "Sin prisa. ¿A dónde?",
                "¿Algo más?",
                "Dime qué necesitas.",
                "¿Y ahora?"
            ],
            it: [
                "Cosa vuoi vedere ora?",
                "Nessuna fretta. Dove andiamo?",
                "Posso aiutarti con altro?",
                "Dimmi di cosa hai bisogno.",
                "E ora?"
            ],
            pt: [
                "O que quer ver a seguir?",
                "Sem pressa. Para onde?",
                "Mais alguma coisa?",
                "Diga-me do que precisa.",
                "E agora?"
            ]
        },
        idleLines: {
            en: [
                "Take your time — I'm right here.",
                "That's the Le Grand Éclipse vibe.",
                "All part of what makes us different.",
                "There's always something happening here.",
                "Hope you're enjoying your stay.",
                "I've got you covered.",
                "Easy does it.",
                "Good choice.",
                "Let's see what's next.",
                "You're exactly where you need to be.",
                "This is what we're about.",
                "Part hotel, part community.",
                "You'll feel right at home.",
                "We like to keep things simple.",
                "Welcome to the hub.",
                "Happy to help anytime."
            ],
            fr: [
                "Prenez votre temps — je suis là.",
                "C'est ça, l'ambiance Le Grand Éclipse.",
                "Tout fait partie de notre différence.",
                "Il se passe toujours quelque chose ici.",
                "J'espère que vous profitez de votre séjour.",
                "Je m'occupe de vous.",
                "Doucement.",
                "Bon choix.",
                "Voyons la suite.",
                "Vous êtes au bon endroit.",
                "C'est ça, notre philosophie.",
                "Mi-hôtel, mi-communauté.",
                "Vous vous sentirez comme chez vous.",
                "On aime la simplicité.",
                "Bienvenue au hub.",
                "Ravi de vous aider."
            ],
            de: [
                "Lassen Sie sich Zeit — ich bin hier.",
                "Das ist der Le Grand Éclipse Vibe.",
                "Das macht uns anders.",
                "Hier ist immer was los.",
                "Ich hoffe, Sie genießen Ihren Aufenthalt.",
                "Ich kümmere mich um Sie.",
                "Ganz entspannt.",
                "Gute Wahl.",
                "Mal sehen, was kommt.",
                "Sie sind genau richtig hier.",
                "Das ist unsere Philosophie.",
                "Halb Hotel, halb Community.",
                "Sie werden sich wie zuhause fühlen.",
                "Wir mögen's unkompliziert.",
                "Willkommen im Hub.",
                "Gerne behilflich."
            ],
            es: [
                "Tómate tu tiempo — estoy aquí.",
                "Así es el rollo Le Grand Éclipse.",
                "Todo parte de lo que nos hace diferentes.",
                "Siempre pasa algo aquí.",
                "Espero que disfrutes tu estancia.",
                "Te tengo cubierto.",
                "Con calma.",
                "Buena elección.",
                "Veamos qué sigue.",
                "Estás justo donde tienes que estar.",
                "Esto es lo nuestro.",
                "Parte hotel, parte comunidad.",
                "Te sentirás como en casa.",
                "Nos gusta que sea simple.",
                "Bienvenido al hub.",
                "Feliz de ayudar."
            ],
            it: [
                "Prenditi il tuo tempo — sono qui.",
                "Questo è il vibe Le Grand Éclipse.",
                "Fa parte di ciò che ci rende diversi.",
                "Succede sempre qualcosa qui.",
                "Spero ti stia piacendo il soggiorno.",
                "Ti seguo io.",
                "Con calma.",
                "Buona scelta.",
                "Vediamo cosa c'è dopo.",
                "Sei esattamente dove devi essere.",
                "Questa è la nostra filosofia.",
                "Un po' hotel, un po' community.",
                "Ti sentirai a casa.",
                "Ci piace tenere le cose semplici.",
                "Benvenuto al hub.",
                "Felice di aiutare."
            ],
            pt: [
                "Leve o tempo que precisar — estou aqui.",
                "É assim o ambiente Le Grand Éclipse.",
                "Tudo faz parte do que nos torna diferentes.",
                "Há sempre algo a acontecer por aqui.",
                "Espero que esteja a gostar da estadia.",
                "Eu trato de tudo.",
                "Com calma.",
                "Boa escolha.",
                "Vamos ver o que vem a seguir.",
                "Tudo faz parte da experiência.",
                "Está exatamente onde precisa estar.",
                "É isto que defendemos.",
                "Parte hotel, parte comunidade.",
                "Vai sentir-se em casa.",
                "Gostamos de manter as coisas simples.",
                "Bem-vindo ao hub.",
                "Feliz em ajudar."
            ]
        },
        topics: [
            { id: "room", label: { en: "Your Room", fr: "Votre Chambre", de: "Ihr Zimmer", es: "Tu Habitación", it: "La Camera", pt: "Quarto" }, order: 1 },
            { id: "breakfast", label: { en: "Breakfast", fr: "Petit-déjeuner", de: "Frühstück", es: "Desayuno", it: "Colazione", pt: "Pequeno-almoço" }, order: 2 },
            { id: "spa", label: { en: "Spa & Wellness", fr: "Spa & Bien-être", de: "Spa & Wellness", es: "Spa y Bienestar", it: "Spa & Benessere", pt: "Spa & Bem-estar" }, order: 3 },
            { id: "gym", label: { en: "Gym", fr: "Salle de Sport", de: "Fitnessstudio", es: "Gimnasio", it: "Palestra", pt: "Ginásio" }, order: 4 },
            { id: "dining", label: { en: "Fine Dining", fr: "Gastronomie", de: "Feine Küche", es: "Alta Gastronomía", it: "Alta Cucina", pt: "Alta Gastronomia" }, order: 5 },
            { id: "facilities", label: { en: "Facilities", fr: "Installations", de: "Einrichtungen", es: "Instalaciones", it: "Strutture", pt: "Instalações" }, order: 6 },
            { id: "shop", label: { en: "Shop", fr: "Boutique", de: "Shop", es: "Tienda", it: "Negozio", pt: "Loja" }, order: 7 },
            { id: "events", label: { en: "Events", fr: "Événements", de: "Events", es: "Eventos", it: "Eventi", pt: "Eventos" }, order: 8 },
            { id: "area", label: { en: "Area", fr: "Quartier", de: "Umgebung", es: "Barrio", it: "Quartiere", pt: "Bairro" }, order: 9 }
        ],
        topicIntros: {
            room: {
                en: ["Here's what to know about your stay, from cleaning to WiFi."],
                fr: ["Voici ce qu'il faut savoir, du ménage au WiFi."],
                de: ["Hier ist alles, von der Reinigung bis zum WLAN."],
                es: ["Aquí tienes todo sobre tu estancia, de limpieza a WiFi."],
                it: ["Ecco tutto sulla tua camera, dalla pulizia al WiFi."],
                pt: ["Aqui está tudo sobre a sua estadia, da limpeza ao WiFi."]
            },
            breakfast: {
                en: ["Breakfast is vital. Here's how it works."],
                fr: ["Le petit-déjeuner est vital. Voici comment ça marche."],
                de: ["Frühstück ist wichtig. So läuft es ab."],
                es: ["El desayuno es vital. Así funciona."],
                it: ["La colazione è fondamentale. Ecco come funziona."],
                pt: ["O pequeno-almoço é vital. É assim que funciona."]
            },
            facilities: {
                en: ["Check out our 24/7 gym, laundry, and the pool when it's open."],
                fr: ["Profitez du gym 24/7, de la laverie et de la piscine."],
                de: ["Nutzen Sie Gym 24/7, Wäscherei und Pool."],
                es: ["Disfruta el gym 24/7, lavandería y piscina."],
                it: ["Scopri la palestra 24/7, la lavanderia e la piscina."],
                pt: ["Aproveite o ginásio 24/7, a lavandaria e a piscina."]
            },
            shop: {
                en: ["Our shop is open for daily essentials and latest drops."],
                fr: ["Boutique ouverte pour les essentiels et nos éditions limitées."],
                de: ["Shop für täglichen Bedarf und unsere neuesten Drops offen."],
                es: ["Tienda abierta para básicos y nuestras últimas novedades."],
                it: ["Il negozio è aperto per l'essenziale e le ultime novità."],
                pt: ["A loja está aberta para o essencial e as últimas novidades."]
            },
            events: {
                en: ["Here's what's happening around the hub."],
                fr: ["Voici ce qui se passe au hub."],
                de: ["Das ist los im Hub."],
                es: ["Esto es lo que pasa en el hub."],
                it: ["Ecco cosa succede nell'hub."],
                pt: ["Aqui está o que se passa no hub."]
            },
            area: {
                en: ["Here's what's nearby in the neighborhood."],
                fr: ["Voici ce qu'il y a dans le quartier."],
                de: ["Das gibt es in der Nachbarschaft."],
                es: ["Esto es lo que hay en el barrio."],
                it: ["Ecco cosa c'è nel quartiere."],
                pt: ["Aqui está o que há no bairro."]
            },
            spa: {
                en: ["Indulge in our signature spa treatments. Pure relaxation awaits."],
                fr: ["Offrez-vous nos soins spa signature. La détente absolue vous attend."],
                de: ["Gönnen Sie sich unsere Signature-Spa-Behandlungen. Pure Entspannung erwartet Sie."],
                es: ["Disfruta de nuestros tratamientos spa exclusivos. La relajación pura te espera."],
                it: ["Concedetevi i nostri trattamenti spa signature. Vi attende puro relax."],
                pt: ["Delicie-se com os nossos tratamentos de spa exclusivos. Puro relaxamento espera-o."]
            },
            gym: {
                en: ["Our 24/7 fitness center has everything you need. Let me show you."],
                fr: ["Notre centre fitness 24h/24 a tout ce qu'il vous faut. Laissez-moi vous montrer."],
                de: ["Unser 24/7-Fitnesscenter hat alles, was Sie brauchen. Lassen Sie mich zeigen."],
                es: ["Nuestro centro fitness 24/7 tiene todo lo que necesitas. Déjame mostrarte."],
                it: ["Il nostro centro fitness 24/7 ha tutto ciò di cui hai bisogno. Lascia che ti mostri."],
                pt: ["O nosso centro de fitness 24/7 tem tudo o que precisa. Deixe-me mostrar-lhe."]
            },
            dining: {
                en: ["Experience culinary excellence at L'Éclipse Restaurant. Seasonal French cuisine awaits."],
                fr: ["Découvrez l'excellence culinaire au Restaurant L'Éclipse. Une cuisine française de saison vous attend."],
                de: ["Erleben Sie kulinarische Exzellenz im L'Éclipse Restaurant. Saisonale französische Küche erwartet Sie."],
                es: ["Experimenta la excelencia culinaria en L'Éclipse Restaurant. La cocina francesa de temporada te espera."],
                it: ["Vivi l'eccellenza culinaria al Ristorante L'Éclipse. La cucina francese stagionale ti aspetta."],
                pt: ["Experimente a excelência culinária no Restaurante L'Éclipse. A cozinha francesa sazonal espera-o."]
            }
        }
    }
};

// LocalStorage functions
const STORAGE_KEY = 'lge_concierge_flow_config_v2';

export const loadConciergeFlowConfig = (): ConciergeFlowConfig => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored) as ConciergeFlowConfig;
        }
    } catch (e) {
        console.warn('[ConciergeFlowConfig] Failed to load from storage:', e);
    }
    return DEFAULT_CONCIERGE_FLOW_CONFIG;
};

export const saveConciergeFlowConfig = (config: ConciergeFlowConfig) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
        console.error('[ConciergeFlowConfig] Failed to save:', e);
    }
};
