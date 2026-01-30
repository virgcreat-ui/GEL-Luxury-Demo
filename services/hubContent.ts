import { Lang } from '../i18n';

/**
 * Hub Content Configuration (MVP)
 * Simplified content schema for Hub section - EN/FR only
 */

export interface HubContent {
    breakfast: {
        title: Record<Lang, string>;
        hoursWeekdays: Record<Lang, string>;
        hoursWeekends: Record<Lang, string>;
        price: Record<Lang, string>;
        lastMinutePrice: Record<Lang, string>;
        note: Record<Lang, string>;
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
    spa: {
        title: Record<Lang, string>;
        caption: Record<Lang, string>;
        hours: Record<Lang, string>;
    };
    gym: {
        title: Record<Lang, string>;
        caption: Record<Lang, string>;
        access: Record<Lang, string>;
    };
    dining: {
        title: Record<Lang, string>;
        caption: Record<Lang, string>;
        hours: Record<Lang, string>;
    };
}

/**
 * DEFAULT_HUB_CONTENT
 * EN/FR only — polished French for Parisian luxury hotel standards
 */
export const DEFAULT_HUB_CONTENT: HubContent = {
    breakfast: {
        title: {
            en: "Breakfast",
            fr: "Petit-déjeuner"
        },
        hoursWeekdays: {
            en: "Weekdays: 07:00–10:30",
            fr: "Semaine : 07h00–10h30"
        },
        hoursWeekends: {
            en: "Weekends: 07:30–11:00",
            fr: "Week-end : 07h30–11h00"
        },
        price: {
            en: "€15 per person",
            fr: "15 € par personne"
        },
        lastMinutePrice: {
            en: "€19.50 same-day rate",
            fr: "19,50 € sans réservation"
        },
        note: {
            en: "At Le Grand Éclipse we serve breakfast only. For lunch/dinner, check our Concierge Recommendations.",
            fr: "Au Grand Éclipse, nous servons exclusivement le petit-déjeuner. Pour déjeuner ou dîner, consultez nos Recommandations."
        }
    },
    shop: {
        title: {
            en: "LGE Boutique",
            fr: "Boutique LGE"
        },
        caption: {
            en: "Exclusive collection: tees, caps, totes & more.",
            fr: "Collection exclusive : t-shirts, casquettes, accessoires et plus."
        },
        studentDiscount: {
            en: "Students: 20% discount on retail items when showing student key.",
            fr: "Étudiants : 20 % de réduction sur présentation de votre carte."
        }
    },
    facilities: {
        title: {
            en: "Facilities",
            fr: "Équipements"
        },
        caption: {
            en: "Gym, pool, laundry & entertainment lounge.",
            fr: "Salle de sport, piscine, buanderie et espace détente."
        }
    },
    spa: {
        title: {
            en: "Spa & Wellness",
            fr: "Spa & Bien-être"
        },
        caption: {
            en: "Signature treatments for pure relaxation.",
            fr: "Soins signature pour une détente absolue."
        },
        hours: {
            en: "Open daily 09:00–21:00",
            fr: "Ouvert tous les jours • 09h00–21h00"
        }
    },
    gym: {
        title: {
            en: "Premium Fitness Center",
            fr: "Centre de Remise en Forme"
        },
        caption: {
            en: "Technogym equipment, free weights, and Peloton bikes.",
            fr: "Équipements Technogym, poids libres et vélos Peloton."
        },
        access: {
            en: "24/7 access with room key. Level -1.",
            fr: "Accès 24h/24 avec votre clé de chambre. Niveau -1."
        }
    },
    dining: {
        title: {
            en: "Fine Dining",
            fr: "Gastronomie"
        },
        caption: {
            en: "L'Éclipse Restaurant — seasonal French cuisine with a modern twist.",
            fr: "Restaurant L'Éclipse — cuisine française de saison aux accents contemporains."
        },
        hours: {
            en: "Dinner: 19:00–22:30. Reservations recommended.",
            fr: "Dîner : 19h00–22h30. Réservation conseillée."
        }
    }
};
