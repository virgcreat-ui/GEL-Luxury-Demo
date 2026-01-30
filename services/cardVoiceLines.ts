import { Lang } from "../i18n";

/**
 * Voice-on-click reactions for main menu cards (ImageAccordion components)
 * Pure 5-Star Luxury Hotel Branding — Elegant, Refined, Discreet
 * Max 6-8 seconds per line
 * 
 * Used ONLY for main menu cards (Hub, Room, Area) - NOT for concierge
 */

export const CARD_VOICE_LINES: Record<string, Record<Lang, string[]>> = {
    // Hub cards
    hub_facilities: {
        en: [
            "Allow me to present our distinguished amenities, designed for your comfort and well-being.",
            "Our facilities have been curated to exceed the expectations of our discerning guests.",
            "Experience the refined amenities that define the Le Grand Éclipse standard."
        ],
        fr: [
            "Permettez-moi de vous présenter nos prestations distinguées, conçues pour votre confort et votre bien-être.",
            "Nos équipements ont été sélectionnés pour surpasser les attentes de nos hôtes les plus exigeants.",
            "Découvrez les prestations raffinées qui définissent l'excellence du Grand Éclipse."
        ]
    },
    hub_food_drinks: {
        en: [
            "Our culinary offerings reflect our commitment to gastronomic excellence.",
            "Allow me to present our dining options, each crafted with exceptional care.",
            "Discover the culinary artistry that awaits you at Le Grand Éclipse."
        ],
        fr: [
            "Notre offre gastronomique reflète notre engagement envers l'excellence culinaire.",
            "Permettez-moi de vous présenter nos options de restauration, chacune élaborée avec un soin exceptionnel.",
            "Découvrez l'art culinaire qui vous attend au Grand Éclipse."
        ]
    },
    hub_shop: {
        en: [
            "Discover Galeries Lafayette Haussmann, just fifteen minutes away. Our concierge can arrange VIP reception upon request.",
            "Paris's finest luxury shopping awaits. Allow me to share our exclusive partner benefits.",
            "Experience world-class shopping with special privileges reserved for our distinguished guests."
        ],
        fr: [
            "Découvrez les Galeries Lafayette Haussmann, à seulement quinze minutes. Notre conciergerie peut organiser un accueil VIP sur demande.",
            "Le meilleur du shopping parisien vous attend. Permettez-moi de partager nos avantages partenaires exclusifs.",
            "Profitez d'un shopping de classe mondiale avec des privilèges réservés à nos hôtes distingués."
        ]
    },

    // Room cards
    room_wifi: {
        en: [
            "Seamless connectivity awaits. Our high-speed network ensures you remain connected in comfort.",
            "Allow me to assist you with our complimentary high-speed connection.",
            "Connecting to our secure network is effortless. Here are the details."
        ],
        fr: [
            "Une connectivité parfaite vous attend. Notre réseau haut débit vous garantit une connexion confortable.",
            "Permettez-moi de vous assister avec notre connexion haut débit offerte.",
            "La connexion à notre réseau sécurisé est simplissime. Voici les détails."
        ]
    },
    room_cleaning: {
        en: [
            "Our housekeeping team maintains the highest standards of elegance and cleanliness throughout your stay.",
            "Allow me to explain our attentive housekeeping service.",
            "Your comfort is our priority. Here is our housekeeping schedule."
        ],
        fr: [
            "Notre équipe d'étage maintient les plus hauts standards d'élégance et de propreté durant votre séjour.",
            "Permettez-moi de vous expliquer notre service d'étage attentif.",
            "Votre confort est notre priorité. Voici notre programme d'entretien."
        ]
    },
    room_amenities: {
        en: [
            "Your suite has been appointed with thoughtful touches for an exceptional stay.",
            "Discover the refined amenities awaiting you in your accommodations.",
            "Allow me to present the comforts of your private retreat."
        ],
        fr: [
            "Votre suite a été agrémentée d'attentions délicates pour un séjour exceptionnel.",
            "Découvrez les équipements raffinés qui vous attendent dans votre chambre.",
            "Permettez-moi de vous présenter les agréments de votre retraite privée."
        ]
    },
    room_comfort: {
        en: [
            "Every detail has been considered for your absolute comfort.",
            "Your well-being is our utmost concern.",
            "Please allow me to ensure your complete satisfaction."
        ],
        fr: [
            "Chaque détail a été pensé pour votre confort absolu.",
            "Votre bien-être est notre préoccupation première.",
            "Permettez-moi de veiller à votre entière satisfaction."
        ]
    },

    // Area cards
    area_dining: {
        en: [
            "Our concierge has curated the finest dining establishments in the neighborhood for your consideration.",
            "Allow me to share our preferred addresses for distinguished dining.",
            "These exceptional restaurants have earned our personal recommendation."
        ],
        fr: [
            "Notre concierge a sélectionné les meilleurs établissements gastronomiques du quartier pour vous.",
            "Permettez-moi de partager nos adresses privilégiées pour une table distinguée.",
            "Ces restaurants d'exception ont mérité notre recommandation personnelle."
        ]
    },
    area_transport: {
        en: [
            "Allow me to facilitate your travel arrangements throughout Paris.",
            "Private transfers and transport options are available at your request.",
            "Our concierge service is pleased to arrange all your transportation needs."
        ],
        fr: [
            "Permettez-moi de faciliter vos déplacements dans Paris.",
            "Des transferts privés et options de transport sont disponibles sur demande.",
            "Notre service de conciergerie se fera un plaisir d'organiser tous vos besoins en transport."
        ]
    },
    area_essentials: {
        en: [
            "Should you require anything, the finest establishments are within easy reach.",
            "Our neighborhood offers convenient access to essential services.",
            "Everything you may need is close at hand."
        ],
        fr: [
            "Si vous avez besoin de quoi que ce soit, les meilleurs établissements sont à proximité.",
            "Notre quartier offre un accès pratique aux services essentiels.",
            "Tout ce dont vous pourriez avoir besoin est à portée de main."
        ]
    },

    // Front desk
    front_desk: {
        en: [
            "Our reception team is available around the clock. Simply dial nine from your room telephone.",
            "For any request, our reception is at your service twenty-four hours a day.",
            "Your comfort is our privilege. Our reception team awaits your call at any hour."
        ],
        fr: [
            "Notre équipe de réception est disponible en permanence. Composez simplement le 9 depuis le téléphone de votre chambre.",
            "Pour toute demande, notre réception est à votre service vingt-quatre heures sur vingt-quatre.",
            "Votre confort est notre privilège. Notre équipe de réception attend votre appel à toute heure."
        ]
    },

    // Spa cards
    spa_treatments: {
        en: [
            "Our spa sanctuary awaits. Indulge in our signature treatments designed to restore balance and serenity.",
            "Our master therapists craft bespoke wellness experiences tailored to your individual needs.",
            "From restorative facials to deep tissue massage — discover the treatment that speaks to your soul."
        ],
        fr: [
            "Notre sanctuaire spa vous attend. Offrez-vous nos soins signature conçus pour restaurer équilibre et sérénité.",
            "Nos maîtres praticiens conçoivent des expériences bien-être sur mesure adaptées à vos besoins individuels.",
            "Des soins du visage régénérants aux massages profonds — découvrez le soin qui parle à votre âme."
        ]
    },

    // Gym cards
    gym_equipment: {
        en: [
            "Our private fitness center offers state-of-the-art equipment in an atmosphere of refined tranquility.",
            "Personal training sessions with our certified instructors are available upon request.",
            "Exclusive twenty-four hour access with your suite key. Reserved solely for our distinguished guests."
        ],
        fr: [
            "Notre centre de remise en forme privé propose des équipements de pointe dans une atmosphère de tranquillité raffinée.",
            "Des séances d'entraînement personnel avec nos instructeurs certifiés sont disponibles sur demande.",
            "Accès exclusif vingt-quatre heures sur vingt-quatre avec votre clé de suite. Réservé exclusivement à nos hôtes distingués."
        ]
    },

    // Restaurant cards
    restaurant: {
        en: [
            "Restaurant L'Éclipse presents our seven-course tasting menu. Reservations are kindly requested.",
            "Our executive chef presents seasonal French cuisine elevated to art.",
            "Le Bar Céleste invites you for artisanal cocktails and refined small plates."
        ],
        fr: [
            "Le Restaurant L'Éclipse présente notre menu dégustation en sept services. Nous vous prions de bien vouloir réserver.",
            "Notre chef exécutif présente une cuisine française de saison élevée au rang d'art.",
            "Le Bar Céleste vous invite pour des cocktails artisanaux et des petites assiettes raffinées."
        ]
    }
};

/**
 * Returns a random voice line for the given card key and language
 */
export function getRandomCardVoiceLine(cardKey: string, lang: Lang): string | null {
    const lines = CARD_VOICE_LINES[cardKey]?.[lang];
    if (!lines || lines.length === 0) return null;
    return lines[Math.floor(Math.random() * lines.length)];
}
