
export type Lang = "en" | "fr";

export const LANG_LABELS: Record<Lang, string> = {
  en: "English",
  fr: "Français",
};

export const LANG_SHORT: Record<Lang, string> = {
  en: "EN",
  fr: "FR",
};

export const LANG_STORAGE_KEY = "lge_lang";

const en: Record<string, string> = {
  // Global / UI
  "app.title": "Le Grand Éclipse",
  "app.subtitle": "Paris La Défense",
  "lang.select": "Language",

  // Home / Menu
  "home.welcomeTitle": "Welcome to Le Grand Éclipse",
  "home.welcomeSubheading": "Paris La Défense",
  "home.welcomeSubtitle": "Le Grand Éclipse · Paris La Défense",
  "home.menu.hub": "The Hub",
  "home.menu.room": "Your Room",
  "home.menu.events": "Events",
  "home.menu.around": "Around the Area",
  "home.aiConcierge": "Digital Concierge",
  "frontdesk.label": "Front Desk",
  "frontdesk.voice_feedback": "Please dial 9 from your room phone to reach the Front Desk. Our team is available 24/7 and happy to help.",

  // Hub View
  "hub.coverSubtitle": "Facilities and opening hours",
  "hub.facilities": "Facilities",
  "hub.breakfast": "Breakfast",
  "hub.food_drinks": "Food & Drinks",
  "hub.poolGaming": "Pool and Gaming",
  "hub.pool_label": "Pool:",
  "hub.games_label": "Games:",
  "hub.human_title": "Need a human?",
  "hub.human_text": "Our front desk team is available 24/7 from any house phone.",
  "hub.dial_verb": "Dial",

  // Room View
  "room.coverTitle": "Your Room",
  "room.coverSubtitle": "Wi-Fi, cleaning & amenities",
  "room.cleaning": "Cleaning",
  "room.hotelGuests": "Hotel Guests",
  "room.students": "Students",
  "room.wifiTitle": "Wi-Fi Access",
  "room.network_label": "Network:",
  "room.amenitiesTitle": "Amenities & AC",
  "room.ac_label": "AC:",
  "room.comfortTitle": "Stay Comfortably",
  "room.comfortText": "If you need extra pillows, hangers, or have maintenance issues, just reach out.",
  "room.callFrontDesk": "Call Front Desk",

  // Neighborhood View
  "neighborhood.coverTitle": "Around the Area",
  "neighborhood.coverSubtitle": "Local tips near Le Grand Éclipse",
  "neighborhood.dining": "Dining Partners",
  "neighborhood.transport": "Transport",
  "neighborhood.essentials": "Essentials",
  "neighborhood.comingSoon": "Coming soon: interactive map, directions & live distance.",
  "neighborhood.guidanceTitle": "Need Guidance?",
  "neighborhood.guidanceText": "Our team knows all the best local spots and hidden gems in the neighborhood.",

  // Events View
  "events.coverTitle": "Events",
  "events.coverSubtitle": "What's on today & this week",
  "events.today": "Today",
  "events.week": "This Week",
  "events.empty": "No events scheduled",
  "events.viewAll": "View all events in LGE app",

  // Concierge
  "concierge.welcome": "Welcome to Le Grand Éclipse.",
  "concierge.chooseLanguage": "Please choose your language.",
  "concierge.stayType": "Are you staying with us as a student or a hotel guest?",
  "concierge.student": "Student",
  "concierge.guest": "Hotel guest",
  "concierge.visitType.first": "First time",
  "concierge.visitType.returning": "Returning guest",
  "concierge.visitType.beenAround": "I've been around",

  // --- CONTENT KEYS (Room & Hub) ---
  cleaning_title: "Cleaning",
  cleaning_subtitle: "Fresh and tidy.",
  cleaning_1: "Guests: cleaning every 2 nights. Bed sheets changed after the 4th night.",
  cleaning_2: "Students: cleaning 1x/month (free). Extra: €22.50.",
  cleaning_3: "Need help? Reach out — front desk is 24/7.",
  breakfast_title: "Breakfast",
  breakfast_subtitle: "The best start of the day.",
  breakfast_1: "Buffet: €15 per person.",
  breakfast_2: "Last minute: €19.50 per person.",
  breakfast_3: "Weekdays: 07:00–10:30 • Weekends: 07:30–11:00.",
  wifi_title: "Wi-Fi",
  wifi_subtitle: "Fast and gratis.",
  wifi_1: "Connect to 'LGEguest'.",
  wifi_2: "No password, no email required.",
  wifi_3: "Fast, free and ready in seconds.",
  shop_title: "LGE Shop",
  shop_subtitle: "Fresh drops: tees, caps, totes & more. Students get a discount.",
  shop_student_note: "Students: ask about your discount in-house.",
  restaurant_title: "Restaurant & Bar",
  restaurant_subtitle: "Food, drinks, and a great vibe — right downstairs.",
  restaurant_hours: "Open daily • 12:00–23:00",
  paris_breakfast_title: "Breakfast Only",
  paris_breakfast_subtitle: "At Le Grand Éclipse Paris La Défense we serve breakfast only. For lunch/dinner recommendations, see Around the Area.",
  amenities_guest: "Coffee & tea included. Complimentary water bottles provided.",
  frontdesk_tip: "Need help? Reach out — front desk is 24/7.",
  concierge_title: "Concierge",
  concierge_hint: "Wi-Fi, breakfast, laundry, rules...",
  concierge_fallback: "I can help with this guide. Otherwise reach out to the front desk.",
  room_note_title: "Good to know",

  // --- NEW KEYS & LEGACY SUPPORT ---
  greeting: "Welcome to Le Grand Éclipse Paris. Explore this guide, or tap the microphone in the concierge screen to talk to me.",
  c_the_hub: "The Hub",
  c_your_room: "Your room",
  c_ask: "Ask concierge",
  events_title: "What's on",
  guest_guide: "Guest guide",
  assigned_room: "Assigned room",
  quick_tip: "Quick tip",
  issue_prompt: "Issue in your room?",
  issue_desc: "Reach out to the front desk immediately — we're here 24/7 to fix it.",
  guide_label: "Guide",
  direct_support: "Direct support",
  dial_button: "Front desk",
  "hub.student_guide": "Student guide",
  "hub.guest_guide": "Guest guide",
  "hub.back_moments": "Back to moments",
  hub_pool_info: "Summer only, 09:00 – 21:00. Remember your keycard.",
  hub_games_info: "PlayStation 5, Ping Pong, Foosball.",
  neighborhood_transport_info: "Metro station nearby. Taxis can be booked via reception.",
  neighborhood_directions: "Get directions",
  "events.view_this_week": "See this week",
  "concierge.ask_front_desk": "Ask front desk",
  "navigation.back_to_menu": "Back to menu",
};

// ═══════════════════════════════════════════════════════════════════════════
// FRENCH TRANSLATIONS — Parisian Luxury Hotel Standards
// Tone: Sophisticated, professional, natural, warm but refined
// ═══════════════════════════════════════════════════════════════════════════
const fr: Record<string, string> = {
  // Global / UI
  "app.title": "Le Grand Éclipse",
  "app.subtitle": "Paris La Défense",
  "lang.select": "Langue",

  // Home / Menu
  "home.welcomeTitle": "Bienvenue au Grand Éclipse",
  "home.welcomeSubheading": "Paris La Défense",
  "home.welcomeSubtitle": "Le Grand Éclipse · Paris La Défense",
  "home.menu.hub": "L'Espace",
  "home.menu.room": "Votre Chambre",
  "home.menu.events": "Événements",
  "home.menu.around": "Aux Alentours",
  "home.aiConcierge": "Concierge Digital",
  "frontdesk.label": "Réception",
  "frontdesk.voice_feedback": "Veuillez composer le 9 depuis le téléphone de votre chambre pour joindre la Réception. Notre équipe se tient à votre disposition 24h/24.",

  // Hub View
  "hub.coverSubtitle": "Équipements et horaires d'ouverture",
  "hub.facilities": "Équipements",
  "hub.breakfast": "Petit-déjeuner",
  "hub.food_drinks": "Restauration",
  "hub.poolGaming": "Piscine & Détente",
  "hub.pool_label": "Piscine :",
  "hub.games_label": "Loisirs :",
  "hub.human_title": "Besoin d'assistance ?",
  "hub.human_text": "Notre équipe de réception est à votre disposition 24h/24 via le téléphone de votre chambre.",
  "hub.dial_verb": "Composer",
  "hub.student_guide": "Guide Étudiant",
  "hub.guest_guide": "Guide Invité",
  "hub.back_moments": "Retour",

  // Room View
  "room.coverTitle": "Votre Chambre",
  "room.coverSubtitle": "Wi-Fi, entretien & équipements",
  "room.cleaning": "Entretien",
  "room.hotelGuests": "Clients Hôtel",
  "room.students": "Étudiants",
  "room.wifiTitle": "Connexion Wi-Fi",
  "room.network_label": "Réseau :",
  "room.amenitiesTitle": "Équipements & Climatisation",
  "room.ac_label": "Climatisation :",
  "room.comfortTitle": "Votre Confort",
  "room.comfortText": "Oreillers supplémentaires, cintres ou demande de maintenance ? Notre équipe se tient à votre disposition.",
  "room.callFrontDesk": "Contacter la Réception",

  // Neighborhood View
  "neighborhood.coverTitle": "Aux Alentours",
  "neighborhood.coverSubtitle": "Nos recommandations près du Grand Éclipse",
  "neighborhood.dining": "Restaurants Partenaires",
  "neighborhood.transport": "Transports",
  "neighborhood.essentials": "Commerces & Services",
  "neighborhood.comingSoon": "Prochainement : carte interactive et itinéraires en temps réel.",
  "neighborhood.guidanceTitle": "Besoin de Conseils ?",
  "neighborhood.guidanceText": "Notre équipe connaît les meilleures adresses et les trésors cachés du quartier.",

  // Events View
  "events.coverTitle": "Événements",
  "events.coverSubtitle": "Au programme cette semaine",
  "events.today": "Aujourd'hui",
  "events.week": "Cette Semaine",
  "events.empty": "Aucun événement programmé",
  "events.viewAll": "Découvrir tous les événements dans l'application",

  // Concierge
  "concierge.welcome": "Bienvenue au Grand Éclipse.",
  "concierge.chooseLanguage": "Veuillez sélectionner votre langue.",
  "concierge.stayType": "Séjournez-vous en tant qu'étudiant ou client de l'hôtel ?",
  "concierge.student": "Étudiant",
  "concierge.guest": "Client Hôtel",
  "concierge.visitType.first": "Première visite",
  "concierge.visitType.returning": "Client fidèle",
  "concierge.visitType.beenAround": "Je connais déjà",
  "concierge.mic_permission": "Autorisation microphone refusée.",
  "concierge.listening": "Je vous écoute...",
  "concierge.processing": "Un instant...",
  "concierge.error": "Je suis désolée, une erreur s'est produite.",

  // Admin Panel
  "admin.title": "Configuration Établissement",
  "admin.subtitle": "Gestion du contenu concierge",
  "admin.exit": "Quitter",
  "admin.tab.info": "Informations",
  "admin.tab.images": "Visuels",
  "admin.tab.room": "Chambres",
  "admin.tab.hub": "Espace Commun",
  "admin.tab.events": "Événements",
  "admin.tab.area": "Quartier",
  "admin.tab.lang": "Langues",
  "admin.section.profile": "Profil Général",
  "admin.section.hero": "Images d'accueil",
  "admin.section.housekeeping": "Entretien & Connectivité",
  "admin.section.bg": "Arrière-plan Concierge",
  "admin.profile.hotelName": "Nom de l'établissement",
  "admin.profile.location": "Localisation",
  "admin.profile.receptionHelper": "Assistance Réception",
  "admin.profile.openingHours": "Horaires d'ouverture",
  "admin.label.cleaningGuest": "Entretien (Clients)",
  "admin.label.cleaningStudent": "Entretien (Étudiants)",
  "admin.label.wifiSsid": "Nom du réseau Wi-Fi",
  "admin.label.wifiInstr": "Instructions de connexion",
  "admin.label.amenities": "Équipements disponibles",
  "admin.label.ac": "Climatisation",
  "admin.hub.facilitiesHours": "Équipements & Horaires",
  "admin.hub.breakfastTimes": "Horaires petit-déjeuner",
  "admin.hub.breakfastPrices": "Tarifs petit-déjeuner",
  "admin.hub.pool": "Informations piscine",
  "admin.hub.games": "Espace détente",
  "admin.area.restaurants": "Restaurants partenaires",
  "admin.area.discounts": "Avantages & Réductions",
  "admin.area.transport": "Transports",
  "admin.area.essentials": "Commerces de proximité",
  "admin.events.manage": "Gérer les événements",
  "admin.events.new": "+ Nouvel événement",
  "admin.events.remove": "Supprimer",
  "admin.events.title": "Titre",
  "admin.events.time": "Horaire",
  "admin.events.day": "Jour",
  "admin.lang.manual": "Les traductions sont révisées manuellement pour garantir une qualité irréprochable.",
  "admin.lang.editComing": "Édition multilingue disponible prochainement.",
  "admin.sync.banner": "Modifications appliquées instantanément",
  "common.cancel": "Annuler",
  "common.confirm": "Confirmer",

  // Content Keys — Polished French
  cleaning_title: "Entretien",
  cleaning_subtitle: "Un espace impeccable.",
  cleaning_1: "Clients : entretien tous les 2 jours. Draps renouvelés après la 4ème nuit.",
  cleaning_2: "Étudiants : entretien mensuel inclus. Service supplémentaire : 22,50 €.",
  cleaning_3: "Une demande ? Notre Réception est à votre disposition 24h/24.",
  breakfast_title: "Petit-déjeuner",
  breakfast_subtitle: "Commencez la journée en beauté.",
  breakfast_1: "Buffet : 15 € par personne.",
  breakfast_2: "Sans réservation : 19,50 € par personne.",
  breakfast_3: "Semaine : 07h00–10h30 • Week-end : 07h30–11h00.",
  wifi_title: "Wi-Fi",
  wifi_subtitle: "Connexion haut débit gratuite.",
  wifi_1: "Réseau : LGEguest",
  wifi_2: "Aucun mot de passe requis.",
  wifi_3: "Connectez-vous instantanément.",
  shop_title: "Boutique LGE",
  shop_subtitle: "Collection exclusive : t-shirts, casquettes, accessoires et plus encore.",
  shop_student_note: "Étudiants : bénéficiez de tarifs préférentiels sur présentation de votre carte.",
  restaurant_title: "Restaurant & Bar",
  restaurant_subtitle: "Une expérience gastronomique au cœur de l'établissement.",
  restaurant_hours: "Ouvert tous les jours • 12h00–23h00",
  paris_breakfast_title: "Petit-déjeuner uniquement",
  paris_breakfast_subtitle: "Au Grand Éclipse Paris La Défense, nous servons exclusivement le petit-déjeuner. Pour le déjeuner et le dîner, découvrez nos recommandations dans 'Aux Alentours'.",
  amenities_guest: "Café et thé de qualité à votre disposition. Eau minérale offerte.",
  frontdesk_tip: "Notre équipe se tient à votre entière disposition.",
  concierge_title: "Concierge",
  concierge_hint: "Wi-Fi, petit-déjeuner, services...",
  concierge_fallback: "Je peux vous guider dans cette application. Pour toute autre demande, notre Réception est à votre écoute.",

  // New Content Keys
  hub_pool_info: "Accès saisonnier • 09h00–21h00. Badge requis.",
  hub_games_info: "PlayStation 5, Tennis de table, Baby-foot.",
  neighborhood_transport_info: "Station de métro à proximité. Service de taxi sur demande à la Réception.",
  neighborhood_directions: "Itinéraire",
  "events.view_this_week": "Cette semaine",
  "concierge.ask_front_desk": "Contacter la Réception",
  "navigation.back_to_menu": "Retour au menu",
};

const DICTS: Record<Lang, Record<string, string>> = { en, fr };

// Export UI for backward compatibility
export const UI = DICTS;

export function safeLang(input: string | null | undefined): Lang {
  const v = (input || "").toLowerCase();
  if (v === "en" || v === "fr") return v as Lang;
  return "en";
}

export function t(lang: Lang, key: string): string {
  // Hard fallback to English to prevent blank UI.
  return DICTS[lang]?.[key] ?? DICTS.en[key] ?? key;
}
