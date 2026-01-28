import { Lang } from '../i18n';

/**
 * Hub Content Configuration (MVP)
 * Simplified content schema for Hub section only
 */

export interface HubContent {
    breakfast: {
        title: Record<Lang, string>;
        hoursWeekdays: Record<Lang, string>;
        hoursWeekends: Record<Lang, string>;
        price: Record<Lang, string>;
        lastMinutePrice: Record<Lang, string>;
        note: Record<Lang, string>; // Paris breakfast-only message
    };
    shop: {
        title: Record<Lang, string>;
        caption: Record<Lang, string>;
        studentDiscount: Record<Lang, string>;
    };
    facilities: {
        title: Record<Lang, string>;
        caption: Record<Lang, string>;
    };
}

/**
 * DEFAULT_HUB_CONTENT
 * Core defaults for Hub content (EN + FR complete, others fall back to i18n)
 */
export const DEFAULT_HUB_CONTENT: HubContent = {
    breakfast: {
        title: {
            en: "Breakfast",
            fr: "Petit-déjeuner",
            de: "Breakfast", // Falls back to i18n
            es: "Breakfast",
            it: "Breakfast",
            pt: "Breakfast"
        },
        hoursWeekdays: {
            en: "Weekdays: 07:00–10:30",
            fr: "Semaine : 07h00 – 10h30",
            de: "Weekdays: 07:00–10:30",
            es: "Weekdays: 07:00–10:30",
            it: "Weekdays: 07:00–10:30",
            pt: "Weekdays: 07:00–10:30"
        },
        hoursWeekends: {
            en: "Weekends: 07:30–11:00",
            fr: "Week-end : 07h30 – 11h00",
            de: "Weekends: 07:30–11:00",
            es: "Weekends: 07:30–11:00",
            it: "Weekends: 07:30–11:00",
            pt: "Weekends: 07:30–11:00"
        },
        price: {
            en: "€15 per person",
            fr: "15€ par personne",
            de: "€15 per person",
            es: "€15 per person",
            it: "€15 per person",
            pt: "€15 per person"
        },
        lastMinutePrice: {
            en: "€19.50 same-day rate",
            fr: "19,50€ tarif jour-même",
            de: "€19.50 same-day rate",
            es: "€19.50 same-day rate",
            it: "€19.50 same-day rate",
            pt: "€19.50 same-day rate"
        },
        note: {
            en: "At TSH Paris La Défense we serve breakfast only. For lunch/dinner, check Around the Area.",
            fr: "Au TSH Paris La Défense nous servons uniquement le petit-déjeuner. Pour déjeuner/dîner, voir Aux alentours.",
            de: "At TSH Paris La Défense we serve breakfast only.",
            es: "At TSH Paris La Défense we serve breakfast only.",
            it: "At TSH Paris La Défense we serve breakfast only.",
            pt: "At TSH Paris La Défense we serve breakfast only."
        }
    },
    shop: {
        title: {
            en: "TSH Shop",
            fr: "Boutique TSH",
            de: "TSH Shop",
            es: "TSH Shop",
            it: "TSH Shop",
            pt: "TSH Shop"
        },
        caption: {
            en: "Fresh drops: tees, caps, totes & more.",
            fr: "Nouveautés : tees, casquettes, totes & plus.",
            de: "Fresh drops: tees, caps, totes & more.",
            es: "Fresh drops: tees, caps, totes & more.",
            it: "Fresh drops: tees, caps, totes & more.",
            pt: "Fresh drops: tees, caps, totes & more."
        },
        studentDiscount: {
            en: "Students: 20% discount on retail items when showing student key.",
            fr: "Étudiants : 20% de réduction sur les articles boutique sur présentation de la clé.",
            de: "Studenten: 20% Rabatt auf Shop-Artikel bei Vorzeigen des Schlüssels.",
            es: "Estudiantes: 20% de descuento en la tienda enseñando la llave.",
            it: "Studenti: 20% di sconto in negozio mostrando la chiave.",
            pt: "Estudantes: 20% de desconto na loja ao mostrar a chave."
        }
    },
    facilities: {
        title: {
            en: "Facilities",
            fr: "Équipements",
            de: "Facilities",
            es: "Facilities",
            it: "Facilities",
            pt: "Facilities"
        },
        caption: {
            en: "Gym, pool, laundry & game room.",
            fr: "Gym, piscine, buanderie & salle de jeux.",
            de: "Gym, pool, laundry & game room.",
            es: "Gym, pool, laundry & game room.",
            it: "Gym, pool, laundry & game room.",
            pt: "Gym, pool, laundry & game room."
        }
    }
};
