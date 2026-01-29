
import { Lang } from '../i18n';

/**
 * Concierge Flow Configuration
 * Admin-editable config for guided concierge experience
 * Guest-only flow — EN/FR only, polished French for Parisian luxury standards
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

// Default configuration — EN/FR only
export const DEFAULT_CONCIERGE_FLOW_CONFIG: ConciergeFlowConfig = {
    guest: {
        welcomeLines: {
            en: ["Welcome to Le Grand Éclipse. I'll be your digital concierge, here to help you feel at home. Whenever you're ready, I can guide you through everything you need."],
            fr: ["Bienvenue au Grand Éclipse. Je serai votre concierge digitale, à votre disposition pour vous accompagner tout au long de votre séjour. Je suis là dès que vous êtes prêt."]
        },
        askFirstTimeLines: {
            en: [
                "Lovely. Welcome. Is this your first time staying at Le Grand Éclipse, or have you stayed with us before?",
                "Great. I'll help you make the most of your stay. Is this your first time staying at Le Grand Éclipse, or have you stayed with us before?"
            ],
            fr: [
                "Enchanté. Est-ce votre première visite au Grand Éclipse, ou nous connaissez-vous déjà ?",
                "Parfait. Je suis là pour vous permettre de profiter pleinement de votre séjour. Est-ce votre première visite ?"
            ]
        },
        firstTimeConfirmLines: {
            en: ["Great choice. Le Grand Éclipse is a bit different — part hotel, part community. I'll show you the important things first."],
            fr: ["Excellent choix. Le Grand Éclipse est un établissement singulier — à la fois hôtel et lieu de vie. Permettez-moi de vous présenter l'essentiel."]
        },
        returningConfirmLines: {
            en: ["Welcome back. Let's find what you need."],
            fr: ["Heureux de vous revoir. Voyons comment je puis vous être utile."]
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
                "Que souhaitez-vous découvrir à présent ?",
                "Prenez votre temps. Où puis-je vous guider ?",
                "Puis-je vous être utile pour autre chose ?",
                "Je reste à votre disposition.",
                "Que puis-je faire pour vous ?"
            ]
        },
        idleLines: {
            en: [
                "Take your time — I'm right here.",
                "This is the Le Grand Éclipse vibe.",
                "It's all part of what makes us different.",
                "There's always something happening here.",
                "Hope you're enjoying your stay.",
                "I've got you.",
                "No rush.",
                "Good choice.",
                "Let's see what's next.",
                "You're exactly where you need to be.",
                "This is what we stand for.",
                "Part hotel, part community.",
                "You'll feel right at home.",
                "We like to keep things simple.",
                "Welcome to the hub.",
                "Happy to help."
            ],
            fr: [
                "Prenez tout votre temps — je reste à votre disposition.",
                "C'est cela, l'esprit Grand Éclipse.",
                "C'est ce qui fait notre singularité.",
                "Il se passe toujours quelque chose ici.",
                "J'espère que votre séjour vous plaît.",
                "Je suis là pour vous.",
                "Sans précipitation.",
                "Excellent choix.",
                "Voyons la suite.",
                "Vous êtes au bon endroit.",
                "C'est notre philosophie.",
                "Mi-hôtel, mi-lieu de vie.",
                "Vous vous sentirez comme chez vous.",
                "Nous aimons la simplicité.",
                "Bienvenue dans notre espace.",
                "Avec plaisir."
            ]
        },
        topics: [
            { id: "room", label: { en: "Your Room", fr: "Votre Chambre" }, order: 1 },
            { id: "breakfast", label: { en: "Breakfast", fr: "Petit-déjeuner" }, order: 2 },
            { id: "spa", label: { en: "Spa & Wellness", fr: "Spa & Bien-être" }, order: 3 },
            { id: "gym", label: { en: "Fitness Center", fr: "Centre Fitness" }, order: 4 },
            { id: "dining", label: { en: "Fine Dining", fr: "Gastronomie" }, order: 5 },
            { id: "facilities", label: { en: "Facilities", fr: "Équipements" }, order: 6 },
            { id: "shop", label: { en: "Boutique", fr: "Boutique" }, order: 7 },
            { id: "events", label: { en: "Events", fr: "Événements" }, order: 8 },
            { id: "area", label: { en: "Neighborhood", fr: "Aux Alentours" }, order: 9 }
        ],
        topicIntros: {
            room: {
                en: ["Here's what to know about your stay, from cleaning to WiFi."],
                fr: ["Voici les informations essentielles concernant votre chambre : entretien, connexion Wi-Fi et équipements."]
            },
            breakfast: {
                en: ["Breakfast is vital. Here's how it works."],
                fr: ["Le petit-déjeuner est un moment privilégié. Voici comment en profiter."]
            },
            facilities: {
                en: ["Check out our 24/7 gym, laundry, and the pool when it's open."],
                fr: ["Découvrez notre centre fitness accessible 24h/24, notre buanderie et notre piscine."]
            },
            shop: {
                en: ["Our boutique is open for daily essentials and exclusive items."],
                fr: ["Notre boutique vous propose l'essentiel du quotidien et des articles exclusifs."]
            },
            events: {
                en: ["Here's what's happening around the hub."],
                fr: ["Voici les événements de la semaine."]
            },
            area: {
                en: ["Here's what's nearby in the neighborhood."],
                fr: ["Découvrez nos recommandations dans le quartier."]
            },
            spa: {
                en: ["Indulge in our signature spa treatments. Pure relaxation awaits."],
                fr: ["Offrez-vous un moment de bien-être avec nos soins signature. La sérénité vous attend."]
            },
            gym: {
                en: ["Our 24/7 fitness center has everything you need. Let me show you."],
                fr: ["Notre centre de remise en forme, accessible 24h/24, dispose de tous les équipements nécessaires. Permettez-moi de vous le présenter."]
            },
            dining: {
                en: ["Experience culinary excellence at L'Éclipse Restaurant. Seasonal French cuisine awaits."],
                fr: ["Découvrez l'excellence gastronomique du Restaurant L'Éclipse. Une cuisine française de saison aux accents contemporains."]
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
