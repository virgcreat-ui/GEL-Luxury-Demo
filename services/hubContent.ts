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
            en: "At Le Grand Éclipse Paris La Défense we serve breakfast only. For lunch/dinner, check Around the Area.",
            fr: "Au Le Grand Éclipse Paris La Défense nous servons uniquement le petit-déjeuner. Pour déjeuner/dîner, voir Aux alentours.",
            de: "At Le Grand Éclipse Paris La Défense we serve breakfast only.",
            es: "At Le Grand Éclipse Paris La Défense we serve breakfast only.",
            it: "At Le Grand Éclipse Paris La Défense we serve breakfast only.",
            pt: "At Le Grand Éclipse Paris La Défense we serve breakfast only."
        }
    },
    shop: {
        title: {
            en: "LGE Shop",
            fr: "Boutique LGE",
            de: "LGE Shop",
            es: "LGE Shop",
            it: "LGE Shop",
            pt: "LGE Shop"
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
    },
    spa: {
        title: {
            en: "Spa & Wellness",
            fr: "Spa & Bien-être",
            de: "Spa & Wellness",
            es: "Spa y Bienestar",
            it: "Spa & Benessere",
            pt: "Spa & Bem-estar"
        },
        caption: {
            en: "Signature treatments for pure relaxation.",
            fr: "Soins signature pour une détente absolue.",
            de: "Signature-Behandlungen für pure Entspannung.",
            es: "Tratamientos exclusivos para pura relajación.",
            it: "Trattamenti signature per puro relax.",
            pt: "Tratamentos exclusivos para puro relaxamento."
        },
        hours: {
            en: "Open daily 09:00–21:00",
            fr: "Ouvert tous les jours 09h00–21h00",
            de: "Täglich 09:00–21:00 Uhr",
            es: "Abierto diariamente 09:00–21:00",
            it: "Aperto tutti i giorni 09:00–21:00",
            pt: "Aberto diariamente 09:00–21:00"
        }
    },
    gym: {
        title: {
            en: "State-of-the-Art Gym",
            fr: "Salle de Sport Premium",
            de: "Hochmodernes Fitnessstudio",
            es: "Gimnasio de Última Generación",
            it: "Palestra all'Avanguardia",
            pt: "Ginásio de Última Geração"
        },
        caption: {
            en: "Technogym equipment, free weights, and Peloton bikes.",
            fr: "Équipements Technogym, poids libres et vélos Peloton.",
            de: "Technogym-Geräte, freie Gewichte und Peloton-Bikes.",
            es: "Equipos Technogym, pesas libres y bicicletas Peloton.",
            it: "Attrezzature Technogym, pesi liberi e bici Peloton.",
            pt: "Equipamentos Technogym, pesos livres e bicicletas Peloton."
        },
        access: {
            en: "24/7 access with room key. Level -1.",
            fr: "Accès 24h/24 avec clé de chambre. Niveau -1.",
            de: "24/7 Zugang mit Zimmerschlüssel. Untergeschoss.",
            es: "Acceso 24/7 con llave de habitación. Nivel -1.",
            it: "Accesso 24/7 con chiave della camera. Piano -1.",
            pt: "Acesso 24/7 com chave do quarto. Piso -1."
        }
    },
    dining: {
        title: {
            en: "Fine Dining",
            fr: "Gastronomie",
            de: "Feine Küche",
            es: "Alta Gastronomía",
            it: "Alta Cucina",
            pt: "Alta Gastronomia"
        },
        caption: {
            en: "L'Éclipse Restaurant — seasonal French cuisine with a modern twist.",
            fr: "Restaurant L'Éclipse — cuisine française de saison revisitée.",
            de: "Restaurant L'Éclipse — saisonale französische Küche mit modernem Touch.",
            es: "Restaurante L'Éclipse — cocina francesa de temporada con toque moderno.",
            it: "Ristorante L'Éclipse — cucina francese stagionale con tocco moderno.",
            pt: "Restaurante L'Éclipse — cozinha francesa sazonal com toque moderno."
        },
        hours: {
            en: "Dinner: 19:00–22:30. Reservations recommended.",
            fr: "Dîner : 19h00–22h30. Réservation conseillée.",
            de: "Abendessen: 19:00–22:30. Reservierung empfohlen.",
            es: "Cena: 19:00–22:30. Reservas recomendadas.",
            it: "Cena: 19:00–22:30. Prenotazione consigliata.",
            pt: "Jantar: 19:00–22:30. Reservas recomendadas."
        }
    }
};
