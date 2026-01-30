
import { Lang, t } from '../i18n';

/**
 * Content Service
 * Global content management for all guest-facing sections
 * Extends Hub Content MVP pattern to Room, Events, Area, and Concierge
 */

export type ContentSection = 'hub' | 'room' | 'events' | 'area' | 'concierge';

const STORAGE_KEYS: Record<ContentSection, string> = {
    hub: 'lge_hub_content_v1',
    room: 'lge_room_content_v1',
    events: 'lge_events_content_v1',
    area: 'lge_area_content_v1',
    concierge: 'lge_concierge_content_v1'
};

/* ========================================================
   INTERFACES
   ======================================================== */

export interface RoomContent {
    cleaning_rules: string;
    amenities_desc: string;
    wifi_desc: string;
    ac_info: string;
    house_rules: string;
}

export interface EventsContent {
    today_intro: string;
    week_intro: string;
    empty_state: string;
    cta_phrase: string;
}

export interface AreaContent {
    restaurants_intro: string;
    transport_info: string;
    local_tips: string;
    partner_disclaimer: string;
}

export interface ConciergeContent {
    welcome_sentence: string;
    guest_transition: string;
    friendly_filler_1: string;
    friendly_filler_2: string;
    friendly_filler_3: string;
    human_fallback: string;
}

/* ========================================================
   DEFAULT CONTENT
   ======================================================== */

export const DEFAULT_ROOM_CONTENT: Record<Lang, RoomContent> = {
    en: {
        cleaning_rules: "Cleaning every 2 nights. Hang the 'Do Not Disturb' sign if you prefer privacy. Bed sheets changed after the 4th night.",
        amenities_desc: "Towels, toiletries, hairdryer, safe, mini-fridge included. Coffee & tea complimentary for hotel guests.",
        wifi_desc: "Free high-speed WiFi throughout. Connect to 'LGEguest'.",
        ac_info: "Individual climate control available. Please keep windows closed when it's on.",
        house_rules: "No smoking inside. Quiet hours after 22:00. Please respect our community vibe."
    },
    fr: {
        cleaning_rules: "Service de chambre quotidien disponible. Accrochez le panneau 'Ne pas déranger' si vous préférez être tranquille.",
        amenities_desc: "Serviettes, produits de toilette, sèche-cheveux, coffre-fort, mini-frigo inclus.",
        wifi_desc: "WiFi haut débit gratuit dans tout l'établissement.",
        ac_info: "Climatisation disponible. Ajustez la température selon vos besoins.",
        house_rules: "Interdiction de fumer à l'intérieur. Heures calmes après 22h00."
    },
    de: {
        cleaning_rules: "Tägliche Reinigung verfügbar. Hängen Sie das 'Bitte nicht stören'-Schild auf, wenn Sie Ihre Ruhe möchten.",
        amenities_desc: "Handtücher, Toilettenartikel, Föhn, Safe, Minibar inklusive.",
        wifi_desc: "Kostenloses Highspeed-WLAN im gesamten Hotel.",
        ac_info: "Klimaanlage verfügbar. Passen Sie die Temperatur nach Bedarf an.",
        house_rules: "Rauchen im Zimmer verboten. Ruhezeiten nach 22:00 Uhr."
    },
    es: {
        cleaning_rules: "Limpieza diaria disponible. Cuelga el cartel 'No molestar' si prefieres privacidad.",
        amenities_desc: "Toallas, artículos de aseo, secador, caja fuerte, mini-nevera incluidos.",
        wifi_desc: "WiFi de alta velocidad gratuito en todo el establecimiento.",
        ac_info: "Control de clima disponible. Ajusta la temperatura según necesites.",
        house_rules: "Prohibido fumar dentro. Horas de silencio después de las 22:00."
    },
    it: {
        cleaning_rules: "Pulizia giornaliera disponibile. Appendi il cartello 'Non disturbare' se preferisci la privacy.",
        amenities_desc: "Asciugamani, articoli da toeletta, asciugacapelli, cassaforte, minifrigo inclusi.",
        wifi_desc: "WiFi ad alta velocità gratuito in tutta la struttura.",
        ac_info: "Climatizzazione disponibile. Regola la temperatura come preferisci.",
        house_rules: "Vietato fumare all'interno. Orari di silenzio dopo le 22:00."
    },
    pt: {
        cleaning_rules: "Limpeza diária disponível. Pendure o aviso 'Não perturbe' se preferir privacidade.",
        amenities_desc: "Toalhas, produtos de higiene, secador, cofre, mini-frigorífico incluídos.",
        wifi_desc: "WiFi de alta velocidade gratuito em toda a propriedade.",
        ac_info: "Controle de clima disponível. Ajuste a temperatura conforme necessário.",
        house_rules: "Proibido fumar dentro. Horas de silêncio após as 22:00."
    }
};

export const DEFAULT_EVENTS_CONTENT: Record<Lang, EventsContent> = {
    en: {
        today_intro: "Here's what's on today at Le Grand Éclipse.",
        week_intro: "Check out the local programming for this week.",
        empty_state: "Nothing scheduled right now — but check back soon!",
        cta_phrase: "Join the vibe"
    },
    fr: {
        today_intro: "Ce qui se passe aujourd'hui au Grand Éclipse.",
        week_intro: "Découvrez ce qui arrive cette semaine.",
        empty_state: "Aucun événement prévu. Revenez bientôt !",
        cta_phrase: "Rejoignez-nous"
    },
    de: {
        today_intro: "Was heute im Grand Éclipse los ist.",
        week_intro: "Schau dir an, was diese Woche ansteht.",
        empty_state: "Keine Veranstaltungen geplant. Schau bald wieder vorbei!",
        cta_phrase: "Mach mit"
    },
    es: {
        today_intro: "Qué pasa hoy en Le Grand Éclipse.",
        week_intro: "Mira qué viene esta semana.",
        empty_state: "No hay eventos programados. ¡Vuelve pronto!",
        cta_phrase: "Únete"
    },
    it: {
        today_intro: "Cosa succede oggi al Grand Éclipse.",
        week_intro: "Scopri cosa succede questa settimana.",
        empty_state: "Nessun evento in programma. Torna presto!",
        cta_phrase: "Unisciti a noi"
    },
    pt: {
        today_intro: "O que está acontecendo hoje no Grand Éclipse.",
        week_intro: "Confira o que está chegando esta semana.",
        empty_state: "Nenhum evento agendado. Volte em breve!",
        cta_phrase: "Junte-se a nós"
    }
};

export const DEFAULT_AREA_CONTENT: Record<Lang, AreaContent> = {
    en: {
        restaurants_intro: "Great food spots within walking distance.",
        transport_info: "Metro: La Défense (1 min walk). Direct links to city center, airports, and major attractions.",
        local_tips: "Don't miss the Grande Arche view. Student tip: grab groceries at Carrefour next door.",
        partner_disclaimer: "Partners offer discounts. Ask at reception for details."
    },
    fr: {
        restaurants_intro: "Excellents restaurants à deux pas.",
        transport_info: "Métro : La Défense (1 min à pied). Liaisons directes vers le centre-ville, aéroports et attractions principales.",
        local_tips: "Ne manquez pas la vue sur la Grande Arche. Astuce étudiante : courses au Carrefour à côté.",
        partner_disclaimer: "Les partenaires offrent des réductions. Demandez à la réception pour plus de détails."
    },
    de: {
        restaurants_intro: "Tolle Restaurants in Gehweite.",
        transport_info: "Metro: La Défense (1 Min. zu Fuß). Direktverbindungen zu Stadtzentrum, Flughäfen und Hauptattraktionen.",
        local_tips: "Verpasse nicht den Blick auf die Grande Arche. Studenten-Tipp: Einkaufen bei Carrefour nebenan.",
        partner_disclaimer: "Partner bieten Rabatte. Frag an der Rezeption nach Details."
    },
    es: {
        restaurants_intro: "Excelentes restaurantes a poca distancia.",
        transport_info: "Metro: La Défense (1 min caminando). Enlaces directos al centro, aeropuertos y atracciones principales.",
        local_tips: "No te pierdas la vista de la Grande Arche. Consejo para estudiantes: compra en Carrefour al lado.",
        partner_disclaimer: "Los socios ofrecen descuentos. Pregunta en recepción para más detalles."
    },
    it: {
        restaurants_intro: "Ottimi ristoranti a pochi passi.",
        transport_info: "Metro: La Défense (1 min a piedi). Collegamenti diretti per il centro, aeroporti e principali attrazioni.",
        local_tips: "Non perdere la vista sulla Grande Arche. Consiglio per studenti: spesa al Carrefour accanto.",
        partner_disclaimer: "I partner offrono sconti. Chiedi alla reception per i dettagli."
    },
    pt: {
        restaurants_intro: "Ótimos restaurantes a poucos passos.",
        transport_info: "Metro: La Défense (1 min a pé). Ligações diretas ao centro, aeroportos e principais atrações.",
        local_tips: "Não perca a vista da Grande Arche. Dica para estudantes: compras no Carrefour ao lado.",
        partner_disclaimer: "Parceiros oferecem descontos. Pergunte na recepção para detalhes."
    }
};

export const DEFAULT_CONCIERGE_CONTENT: Record<Lang, ConciergeContent> = {
    en: {
        welcome_sentence: "Hey! I'm here to help you make the most of your stay.",
        guest_transition: "Got it, I'll keep things short-stay focused.",
        friendly_filler_1: "Good choice!",
        friendly_filler_2: "Nice one!",
        friendly_filler_3: "Great question!",
        human_fallback: "I can't quite help with that—reach out to the front desk for more info."
    },
    fr: {
        welcome_sentence: "Salut ! Je suis là pour vous aider à profiter de votre séjour.",
        guest_transition: "Compris, je vais rester concentré sur le court terme.",
        friendly_filler_1: "Bon choix !",
        friendly_filler_2: "Bien joué !",
        friendly_filler_3: "Excellente question !",
        human_fallback: "Je ne peux pas vraiment vous aider—contactez la réception pour plus d'infos."
    },
    de: {
        welcome_sentence: "Hey! Ich bin hier, um dir bei deinem Aufenthalt zu helfen.",
        guest_transition: "Verstanden, ich bleibe auf Kurzaufenthalte fokussiert.",
        friendly_filler_1: "Gute Wahl!",
        friendly_filler_2: "Gut gemacht!",
        friendly_filler_3: "Tolle Frage!",
        human_fallback: "Ich kann dabei nicht helfen—wende dich an die Rezeption für mehr Infos."
    },
    es: {
        welcome_sentence: "¡Hola! Estoy aquí para ayudarte a aprovechar tu estadía.",
        guest_transition: "Entendido, me centraré en estadías cortas.",
        friendly_filler_1: "¡Buena elección!",
        friendly_filler_2: "¡Bien hecho!",
        friendly_filler_3: "¡Excelente pregunta!",
        human_fallback: "No puedo ayudar con eso—contacta con recepción para más información."
    },
    it: {
        welcome_sentence: "Ciao! Sono qui per aiutarti a goderti il soggiorno.",
        guest_transition: "Capito, mi concentrerò su soggiorni brevi.",
        friendly_filler_1: "Buona scelta!",
        friendly_filler_2: "Ben fatto!",
        friendly_filler_3: "Ottima domanda!",
        human_fallback: "Non posso aiutarti con questo—contatta la reception per maggiori informazioni."
    },
    pt: {
        welcome_sentence: "Olá! Estou aqui para te ajudar a aproveitar a estadia.",
        guest_transition: "Entendido, vou focar em estadias curtas.",
        friendly_filler_1: "Boa escolha!",
        friendly_filler_2: "Muito bem!",
        friendly_filler_3: "Excelente pergunta!",
        human_fallback: "Não posso ajudar com isso—fale com a recepção para mais informações."
    }
};

/* ========================================================
   STORAGE FUNCTIONS
   ======================================================== */

function safeParse<T>(json: string | null, fallback: T): T {
    if (!json) return fallback;
    try {
        return JSON.parse(json) as T;
    } catch {
        return fallback;
    }
}

export function getSectionContent<T>(section: ContentSection, lang: Lang): Partial<T> {
    try {
        const key = STORAGE_KEYS[section];
        const json = localStorage.getItem(key);
        if (!json) return {};

        const allLangs = safeParse<Partial<Record<Lang, Partial<T>>>>(json, {} as Partial<Record<Lang, Partial<T>>>);
        return allLangs[lang] || {};
    } catch (error) {
        console.error(`[ContentService] Error getting ${section} content:`, error);
        return {};
    }
}

export function updateSectionContent<T>(
    section: ContentSection,
    lang: Lang,
    content: Partial<T>
): void {
    try {
        const key = STORAGE_KEYS[section];
        const json = localStorage.getItem(key);
        const allLangs = safeParse<Partial<Record<Lang, Partial<T>>>>(json, {} as Partial<Record<Lang, Partial<T>>>);

        allLangs[lang] = { ...allLangs[lang], ...content };

        localStorage.setItem(key, JSON.stringify(allLangs));
        console.log(`[ContentService] Updated ${section} content for ${lang}`);
    } catch (error) {
        console.error(`[ContentService] Error updating ${section} content:`, error);
        throw error;
    }
}

export function resetSection(section: ContentSection): void {
    try {
        const key = STORAGE_KEYS[section];
        localStorage.removeItem(key);
        console.log(`[ContentService] Reset ${section} content to defaults`);
    } catch (error) {
        console.error(`[ContentService] Error resetting ${section}:`, error);
        throw error;
    }
}

function getDefaultForSection(section: ContentSection, lang: Lang): any {
    const defaults: Record<ContentSection, any> = {
        hub: {}, // Hub uses hubContent.ts
        room: DEFAULT_ROOM_CONTENT[lang],
        events: DEFAULT_EVENTS_CONTENT[lang],
        area: DEFAULT_AREA_CONTENT[lang],
        concierge: DEFAULT_CONCIERGE_CONTENT[lang]
    };
    return defaults[section] || {};
}

/* ========================================================
   SAFE FALLBACK CHAIN
   ======================================================== */

export function getContent(
    section: ContentSection,
    key: string,
    lang: Lang
): string {
    try {
        // 1. Try override for this language
        const override = getSectionContent<any>(section, lang);
        if (override && override[key]) {
            return override[key];
        }

        // 2. Try default for this language
        const defaults = getDefaultForSection(section, lang);
        if (defaults && defaults[key]) {
            return defaults[key];
        }

        // 3. Fallback to English default
        if (lang !== 'en') {
            const enDefaults = getDefaultForSection(section, 'en');
            if (enDefaults && enDefaults[key]) {
                return enDefaults[key];
            }
        }

        // 4. Final fallback: try i18n (for backward compatibility)
        const legacyKey = `${section}.${key}`;
        return t(lang, legacyKey);
    } catch (error) {
        console.error(`[ContentService] Error getting content for ${section}.${key}:`, error);
        return `[${section}.${key}]`;
    }
}

export function getSectionLabel(section: ContentSection): string {
    const labels: Record<ContentSection, string> = {
        hub: 'Hub Content',
        room: 'Room Content',
        events: 'Events Content',
        area: 'Around the Area',
        concierge: 'Concierge Scripts'
    };
    return labels[section];
}

/* ========================================================
   CONCIERGE FLOWS (DYNAMIC)
   ======================================================== */

export type ConciergeFlowStep = {
    id: string;
    voice: { [lang: string]: string[] };
    options: {
        id: string;
        label: { [lang: string]: string };
        nextStepId: string; // "view:topicId" or "stepId"
    }[];
};

export type ConciergeFlow = {
    id: string;
    audience: 'guest';
    journey: 'first_time' | 'returning'; // 'returning' maps to v4 'start'
    steps: ConciergeFlowStep[];
};

export const DEFAULT_CONCIERGE_FLOWS: ConciergeFlow[] = [
    // 1. Guest First Time
    {
        id: "guest-first",
        audience: "guest",
        journey: "first_time",
        steps: [
            {
                id: "intro",
                voice: {
                    en: ["Great choice. Le Grand Éclipse is a bit different — part hotel, part community. I’ll show you the important things first, and you can explore more anytime."],
                    fr: ["Excellent choix. Le Grand Éclipse est unique : mi-hôtel, mi-communauté. Je vous montre l'essentiel, vous explorerez le reste plus tard."],
                    de: ["Gute Wahl. Le Grand Éclipse ist anders – halb Hotel, halb Community. Ich zeige Ihnen das Wichtigste zuerst."],
                    es: ["Buena elección. Le Grand Éclipse es diferente: parte hotel, parte comunidad. Te enseñaré lo importante primero."],
                    it: ["Ottima scelta. Le Grand Éclipse è diverso: un po' hotel, un po' community. Ti mostro prima le cose importanti."],
                    pt: ["Boa escolha. O Le Grand Éclipse é diferente: parte hotel, parte comunidade. Vou mostrar-lhe o mais importante primeiro."]
                },
                options: [
                    { id: "opt_breakfast", label: { en: "Breakfast", fr: "Petit-déjeuner", de: "Frühstück", es: "Desayuno", it: "Colazione", pt: "Pequeno-almoço" }, nextStepId: "view:breakfast" },
                    { id: "opt_room", label: { en: "Your Room", fr: "Votre Chambre", de: "Ihr Zimmer", es: "Tu Habitación", it: "La Camera", pt: "Quarto" }, nextStepId: "view:room" },
                    { id: "opt_facilities", label: { en: "Facilities", fr: "Installations", de: "Einrichtungen", es: "Instalaciones", it: "Strutture", pt: "Instalações" }, nextStepId: "view:facilities" },
                    { id: "opt_events", label: { en: "Events", fr: "Événements", de: "Events", es: "Eventos", it: "Eventi", pt: "Eventos" }, nextStepId: "view:events" },
                    { id: "opt_area", label: { en: "Area", fr: "Quartier", de: "Umgebung", es: "Barrio", it: "Quartiere", pt: "Bairro" }, nextStepId: "view:area" },
                    { id: "opt_shop", label: { en: "Shop", fr: "Boutique", de: "Shop", es: "Tienda", it: "Negozio", pt: "Loja" }, nextStepId: "view:shop" }
                ]
            }
        ]
    },
    // 4. Guest Returning
    {
        id: "guest-returning",
        audience: "guest",
        journey: "returning",
        steps: [
            {
                id: "intro",
                voice: {
                    en: ["Welcome back! Good to see you again. What can I help you with today?", "Welcome back! What's new since last time?", "Nice to have you back. What should we look at?"],
                    fr: ["Content de vous revoir ! Comment puis-je vous aider aujourd'hui ?", "Bon retour ! Quoi de neuf depuis la dernière fois ?"],
                    de: ["Willkommen zurück! Schön, Sie wiederzusehen.", "Willkommen zurück! Was kann ich heute für Sie tun?"],
                    es: ["¡Bienvenido de nuevo! Que alegría verte. ¿En qué te ayudo hoy?", "¡Hola de nuevo! ¿Qué hay de nuevo desde la última vez?"],
                    it: ["Bentornato! È un piacere rivederti. Come posso aiutarti oggi?", "Bentornato! Cosa c'è di nuovo dall'ultima volta?"],
                    pt: ["Bem-vindo de volta! É bom vê-lo novamente. Como posso ajudar hoje?", "Bem-vindo de volta! O que há de novo desde a última vez?"]
                },
                options: [
                    { id: "opt_breakfast", label: { en: "Breakfast", fr: "Petit-déjeuner", de: "Frühstück", es: "Desayuno", it: "Colazione", pt: "Pequeno-almoço" }, nextStepId: "view:breakfast" },
                    { id: "opt_room", label: { en: "Your Room", fr: "Votre Chambre", de: "Ihr Zimmer", es: "Tu Habitación", it: "La Camera", pt: "Quarto" }, nextStepId: "view:room" },
                    { id: "opt_facilities", label: { en: "Facilities", fr: "Installations", de: "Einrichtungen", es: "Instalaciones", it: "Strutture", pt: "Instalações" }, nextStepId: "view:facilities" },
                    { id: "opt_events", label: { en: "Events", fr: "Événements", de: "Events", es: "Eventos", it: "Eventi", pt: "Eventos" }, nextStepId: "view:events" },
                    { id: "opt_area", label: { en: "Area", fr: "Quartier", de: "Umgebung", es: "Barrio", it: "Quartiere", pt: "Bairro" }, nextStepId: "view:area" },
                    { id: "opt_shop", label: { en: "Shop", fr: "Boutique", de: "Shop", es: "Tienda", it: "Negozio", pt: "Loja" }, nextStepId: "view:shop" }
                ]
            }
        ]
    }
];

export const getConciergeFlow = (audience: 'guest', journey: 'first_time' | 'returning') => {
    try {
        const stored = localStorage.getItem('lge_concierge_flows');
        if (stored) {
            const flows = JSON.parse(stored) as ConciergeFlow[];
            return flows.find(f => f.audience === audience && f.journey === journey);
        }
    } catch (e) { }

    return DEFAULT_CONCIERGE_FLOWS.find(f => f.audience === audience && f.journey === journey);
};

export const saveConciergeFlows = (flows: ConciergeFlow[]) => {
    localStorage.setItem('lge_concierge_flows', JSON.stringify(flows));
};

export const getAllConciergeFlows = () => {
    try {
        const stored = localStorage.getItem('lge_concierge_flows');
        if (stored) {
            return JSON.parse(stored) as ConciergeFlow[];
        }
    } catch (e) { }
    return DEFAULT_CONCIERGE_FLOWS;
};
