
import { Lang } from '../i18n';

/**
 * Concierge Flow Configuration
 * Admin-editable config for guided concierge experience
 * Guest-only flow — EN/FR only, Pure 5-Star Luxury Hotel Branding
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

// Default configuration — EN/FR only — Pure 5-Star Luxury Branding
export const DEFAULT_CONCIERGE_FLOW_CONFIG: ConciergeFlowConfig = {
    guest: {
        welcomeLines: {
            en: ["Welcome to Le Grand Éclipse. I am your personal digital concierge, here to ensure every moment of your stay is exceptional. Please allow me to guide you through our services and amenities at your convenience."],
            fr: ["Bienvenue au Grand Éclipse. Je suis votre concierge digitale personnelle, à votre entière disposition pour rendre chaque instant de votre séjour exceptionnel. Permettez-moi de vous présenter nos services et nos prestations."]
        },
        askFirstTimeLines: {
            en: [
                "It is my pleasure to welcome you. Is this your first stay with us at Le Grand Éclipse, or do we have the honor of hosting you again?",
                "We are delighted to have you with us. Is this your first visit to Le Grand Éclipse?"
            ],
            fr: [
                "C'est un plaisir de vous accueillir. Est-ce votre premier séjour au Grand Éclipse, ou avons-nous l'honneur de vous recevoir à nouveau ?",
                "Nous sommes ravis de vous accueillir. Est-ce votre première visite au Grand Éclipse ?"
            ]
        },
        firstTimeConfirmLines: {
            en: ["We are delighted to have you as our guest. Allow me to introduce you to the refined elegance of Le Grand Éclipse. Our staff is at your service around the clock."],
            fr: ["Nous sommes ravis de vous compter parmi nos hôtes. Permettez-moi de vous présenter l'élégance raffinée du Grand Éclipse. Notre personnel est à votre service jour et nuit."]
        },
        returningConfirmLines: {
            en: ["Welcome back. It is always a pleasure to see you again. How may I be of service?"],
            fr: ["Bon retour parmi nous. C'est toujours un plaisir de vous revoir. Comment puis-je vous être utile ?"]
        },
        backLines: {
            en: [
                "What else may I assist you with?",
                "How may I be of further service?",
                "Is there anything else you would like to explore?",
                "I am at your disposal.",
                "What would you like to discover next?"
            ],
            fr: [
                "Que puis-je faire d'autre pour vous ?",
                "Comment puis-je vous être utile ?",
                "Y a-t-il autre chose que vous souhaiteriez découvrir ?",
                "Je reste à votre disposition.",
                "Que souhaitez-vous découvrir à présent ?"
            ]
        },
        idleLines: {
            en: [
                "Please take all the time you need.",
                "I remain at your disposal.",
                "I am here whenever you wish to continue.",
                "There is much to discover during your stay.",
                "Please let me know how I may assist you further.",
                "You may return to this information at any time.",
                "All our services are at your fingertips.",
                "Please explore at your leisure.",
                "What would you like to discover next?",
                "Very well. Shall we continue?",
                "Please take your time. I am at your service.",
                "I remain here for you.",
                "Your comfort is our priority.",
                "Our team is at your service.",
                "The finest experiences await you.",
                "It is our pleasure to serve you."
            ],
            fr: [
                "Prenez tout le temps qu'il vous faut.",
                "Je reste à votre entière disposition.",
                "Je suis là dès que vous le souhaitez.",
                "Il y a tant à découvrir durant votre séjour.",
                "N'hésitez pas à me faire part de vos souhaits.",
                "Vous pourrez consulter ces informations à tout moment.",
                "Tous nos services sont à votre portée.",
                "Explorez à votre rythme.",
                "Que souhaitez-vous découvrir à présent ?",
                "Très bien. Souhaitez-vous poursuivre ?",
                "Prenez votre temps. Je suis à votre service.",
                "Je reste à votre disposition.",
                "Votre confort est notre priorité.",
                "Notre équipe est à votre service.",
                "Les plus belles expériences vous attendent.",
                "C'est un plaisir de vous servir."
            ]
        },
        topics: [
            { id: "room", label: { en: "Your Suite", fr: "Votre Suite" }, order: 1 },
            { id: "breakfast", label: { en: "Breakfast", fr: "Petit-déjeuner" }, order: 2 },
            { id: "spa", label: { en: "Spa & Wellness", fr: "Spa & Bien-être" }, order: 3 },
            { id: "gym", label: { en: "Private Fitness", fr: "Fitness Privé" }, order: 4 },
            { id: "dining", label: { en: "Fine Dining", fr: "Gastronomie" }, order: 5 },
            { id: "facilities", label: { en: "Amenities", fr: "Prestations" }, order: 6 },

            { id: "events", label: { en: "Events", fr: "Événements" }, order: 8 },
            { id: "area", label: { en: "Concierge Recommendations", fr: "Recommandations" }, order: 9 }
        ],
        topicIntros: {
            room: {
                en: ["Allow me to present the essential details of your accommodations, from our attentive housekeeping service to our high-speed connectivity."],
                fr: ["Permettez-moi de vous présenter les informations essentielles concernant votre chambre : notre service d'étage attentif et notre connexion haut débit."]
            },
            breakfast: {
                en: ["Breakfast at Le Grand Éclipse is a refined experience. Allow me to share our culinary offerings and service hours."],
                fr: ["Le petit-déjeuner au Grand Éclipse est une expérience raffinée. Permettez-moi de vous présenter nos offres gastronomiques et nos horaires de service."]
            },
            facilities: {
                en: ["Le Grand Éclipse offers an array of premium amenities for your comfort and well-being. Allow me to present our facilities."],
                fr: ["Le Grand Éclipse propose un ensemble de prestations premium pour votre confort et votre bien-être. Permettez-moi de vous les présenter."]
            },

            events: {
                en: ["Discover the distinguished events and cultural experiences we have arranged for our guests this week."],
                fr: ["Découvrez les événements distingués et les expériences culturelles que nous avons préparés pour nos hôtes cette semaine."]
            },
            area: {
                en: ["Allow me to share our concierge recommendations for discovering the finest establishments in the neighborhood."],
                fr: ["Permettez-moi de partager nos recommandations de concierge pour découvrir les meilleures adresses du quartier."]
            },
            spa: {
                en: ["Our spa sanctuary awaits. Indulge in our signature treatments designed to restore balance and serenity."],
                fr: ["Notre sanctuaire spa vous attend. Offrez-vous nos soins signature conçus pour restaurer équilibre et sérénité."]
            },
            gym: {
                en: ["Our private fitness center offers state-of-the-art equipment in an atmosphere of refined tranquility. Available exclusively for our guests, around the clock."],
                fr: ["Notre centre de remise en forme privé propose des équipements de pointe dans une atmosphère de tranquillité raffinée. Réservé exclusivement à nos hôtes, 24 heures sur 24."]
            },
            dining: {
                en: ["Experience the art of French gastronomy at Restaurant L'Éclipse. Our executive chef presents seasonal cuisine with distinctive elegance."],
                fr: ["Découvrez l'art de la gastronomie française au Restaurant L'Éclipse. Notre chef exécutif présente une cuisine de saison d'une élégance distinctive."]
            }
        }
    }
};

// LocalStorage functions
const STORAGE_KEY = 'lge_concierge_flow_config_v3';

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
