
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

// ═══════════════════════════════════════════════════════════════════════════
// ENGLISH TRANSLATIONS — Pure 5-Star Luxury Hotel Branding
// Tone: Elegant, refined, discreet, sophisticated service
// ═══════════════════════════════════════════════════════════════════════════
const en: Record<string, string> = {
  // Global / UI
  "app.title": "Le Grand Éclipse",
  "app.subtitle": "Paris",
  "lang.select": "Language",

  // Home / Menu
  "home.welcomeTitle": "Welcome to Le Grand Éclipse",
  "home.welcomeSubheading": "Paris",
  "home.welcomeSubtitle": "Le Grand Éclipse · Paris",
  "home.menu.hub": "Amenities",
  "home.menu.room": "Your Suite",
  "home.menu.events": "Events",
  "home.menu.around": "Concierge Recommendations",
  "home.aiConcierge": "Digital Concierge",
  "frontdesk.label": "Reception",
  "frontdesk.voice_feedback": "Please dial 9 from your room telephone to reach Reception. Our team is at your service around the clock.",

  // Hub View (now "Amenities")
  "hub.coverSubtitle": "Premium facilities and services",
  "hub.facilities": "Amenities",
  "hub.breakfast": "Breakfast",
  "hub.food_drinks": "Dining",
  "hub.poolGaming": "Pool & Leisure",
  "hub.pool_label": "Pool:",
  "hub.games_label": "Leisure:",
  "hub.human_title": "Personal Assistance",
  "hub.human_text": "Our reception team is at your service around the clock via your room telephone.",
  "hub.dial_verb": "Dial",

  // Room View
  "room.coverTitle": "Your Suite",
  "room.coverSubtitle": "Connectivity, housekeeping & amenities",
  "room.cleaning": "Housekeeping",
  "room.hotelGuests": "Hotel Guests",
  "room.students": "Extended Stay",
  "room.wifiTitle": "High-Speed Connectivity",
  "room.network_label": "Network:",
  "room.amenitiesTitle": "Suite Amenities",
  "room.ac_label": "Climate Control:",
  "room.comfortTitle": "Your Comfort",
  "room.comfortText": "Additional pillows, hangers, or any special request — our team is at your disposal.",
  "room.callFrontDesk": "Contact Reception",

  // Neighborhood View
  "neighborhood.coverTitle": "Concierge Recommendations",
  "neighborhood.coverSubtitle": "Curated selections near Le Grand Éclipse",
  "neighborhood.dining": "Distinguished Dining",
  "neighborhood.transport": "Private Transport",
  "neighborhood.essentials": "Essential Services",
  "neighborhood.comingSoon": "Interactive map and real-time directions coming soon.",
  "neighborhood.guidanceTitle": "Personalized Guidance",
  "neighborhood.guidanceText": "Our concierge team has curated the finest addresses and hidden treasures in the neighborhood.",

  // Events View
  "events.coverTitle": "Events",
  "events.coverSubtitle": "Distinguished experiences this week",
  "events.today": "Today",
  "events.week": "This Week",
  "events.empty": "No events scheduled",
  "events.viewAll": "View all events",

  // Concierge
  "concierge.welcome": "Welcome to Le Grand Éclipse.",
  "concierge.chooseLanguage": "Please select your preferred language.",
  "concierge.stayType": "How may we serve you today?",
  "concierge.student": "Extended Stay",
  "concierge.guest": "Hotel Guest",
  "concierge.visitType.first": "First Visit",
  "concierge.visitType.returning": "Returning Guest",
  "concierge.visitType.beenAround": "Familiar Guest",

  // Content Keys — Luxury Branding
  cleaning_title: "Housekeeping",
  cleaning_subtitle: "Impeccable attention to detail.",
  cleaning_1: "Daily turndown service. Linens refreshed every second day.",
  cleaning_2: "Extended stay: weekly deep clean included. Additional service upon request.",
  cleaning_3: "Our reception team is at your service around the clock.",
  breakfast_title: "Breakfast",
  breakfast_subtitle: "Begin your day with refinement.",
  breakfast_1: "Gourmet buffet: €15 per person.",
  breakfast_2: "Without reservation: €19.50 per person.",
  breakfast_3: "Weekdays: 07:00–10:30 • Weekends: 07:30–11:00.",
  wifi_title: "Connectivity",
  wifi_subtitle: "Seamless high-speed connection.",
  wifi_1: "Network: LGEguest",
  wifi_2: "No password required.",
  wifi_3: "Connect instantly.",
  shop_title: "Boutique",
  shop_subtitle: "Exclusive collection: apparel, accessories, and curated luxury items.",
  shop_student_note: "Extended stay guests: inquire about preferential rates.",
  restaurant_title: "Restaurant & Bar",
  restaurant_subtitle: "Culinary excellence within the hotel.",
  restaurant_hours: "Open daily • 12:00–23:00",
  paris_breakfast_title: "Breakfast Service",
  paris_breakfast_subtitle: "At Le Grand Éclipse, we serve breakfast exclusively. For lunch and dinner, please consult our Concierge Recommendations.",
  amenities_guest: "Premium tea and coffee selection provided. Complimentary artesian water.",
  frontdesk_tip: "Our team is at your complete disposal.",
  concierge_title: "Concierge",
  concierge_hint: "Connectivity, dining, services...",
  concierge_fallback: "I can assist you with this guide. For any other request, our reception team awaits your call.",
  room_note_title: "Important Information",

  // Navigation & UI
  greeting: "Welcome to Le Grand Éclipse Paris. Explore this guide, or speak with your digital concierge.",
  c_the_hub: "Amenities",
  c_your_room: "Your Suite",
  c_ask: "Concierge",
  events_title: "Events",
  guest_guide: "Guest Guide",
  assigned_room: "Your Suite",
  quick_tip: "Important",
  issue_prompt: "Concern with your suite?",
  issue_desc: "Please contact reception immediately — we are here around the clock to assist.",
  guide_label: "Guide",
  direct_support: "Personal Assistance",
  dial_button: "Reception",
  "hub.student_guide": "Extended Stay Guide",
  "hub.guest_guide": "Guest Guide",
  "hub.back_moments": "Return",
  hub_pool_info: "Seasonal access • 09:00–21:00. Suite key required.",
  hub_games_info: "PlayStation 5, Table Tennis, Foosball.",
  neighborhood_transport_info: "Taxi G7 luxury service available 24/7. Airport transfers and private chauffeur upon request.",
  neighborhood_directions: "Directions",
  "events.view_this_week": "This week",
  "concierge.ask_front_desk": "Contact Reception",
  "navigation.back_to_menu": "Return to menu",
};

// ═══════════════════════════════════════════════════════════════════════════
// FRENCH TRANSLATIONS — Parisian 5-Star Luxury Hotel Standards
// Tone: Sophisticated, refined, formal "vous", natural Parisian phrasing
// ═══════════════════════════════════════════════════════════════════════════
const fr: Record<string, string> = {
  // Global / UI
  "app.title": "Le Grand Éclipse",
  "app.subtitle": "Paris",
  "lang.select": "Langue",

  // Home / Menu
  "home.welcomeTitle": "Bienvenue au Grand Éclipse",
  "home.welcomeSubheading": "Paris",
  "home.welcomeSubtitle": "Le Grand Éclipse · Paris",
  "home.menu.hub": "Prestations",
  "home.menu.room": "Votre Suite",
  "home.menu.events": "Événements",
  "home.menu.around": "Recommandations",
  "home.aiConcierge": "Concierge Digitale",
  "frontdesk.label": "Réception",
  "frontdesk.voice_feedback": "Veuillez composer le 9 depuis le téléphone de votre chambre pour joindre la Réception. Notre équipe est à votre service en permanence.",

  // Hub View (now "Prestations")
  "hub.coverSubtitle": "Équipements et services premium",
  "hub.facilities": "Prestations",
  "hub.breakfast": "Petit-déjeuner",
  "hub.food_drinks": "Gastronomie",
  "hub.poolGaming": "Piscine & Détente",
  "hub.pool_label": "Piscine :",
  "hub.games_label": "Loisirs :",
  "hub.human_title": "Assistance Personnelle",
  "hub.human_text": "Notre équipe de réception est à votre disposition en permanence via le téléphone de votre chambre.",
  "hub.dial_verb": "Composer",
  "hub.student_guide": "Guide Séjour Longue Durée",
  "hub.guest_guide": "Guide de l'Hôte",
  "hub.back_moments": "Retour",

  // Room View
  "room.coverTitle": "Votre Suite",
  "room.coverSubtitle": "Connectivité, service d'étage & équipements",
  "room.cleaning": "Service d'Étage",
  "room.hotelGuests": "Clients de l'Hôtel",
  "room.students": "Séjour Longue Durée",
  "room.wifiTitle": "Connexion Haut Débit",
  "room.network_label": "Réseau :",
  "room.amenitiesTitle": "Équipements de la Suite",
  "room.ac_label": "Climatisation :",
  "room.comfortTitle": "Votre Confort",
  "room.comfortText": "Oreillers supplémentaires, cintres ou toute demande particulière — notre équipe se tient à votre disposition.",
  "room.callFrontDesk": "Contacter la Réception",

  // Neighborhood View
  "neighborhood.coverTitle": "Recommandations de la Conciergerie",
  "neighborhood.coverSubtitle": "Sélections raffinées près du Grand Éclipse",
  "neighborhood.dining": "Tables Distinguées",
  "neighborhood.transport": "Transport Privé",
  "neighborhood.essentials": "Services Essentiels",
  "neighborhood.comingSoon": "Prochainement : carte interactive et itinéraires en temps réel.",
  "neighborhood.guidanceTitle": "Conseils Personnalisés",
  "neighborhood.guidanceText": "Notre équipe de conciergerie a sélectionné les meilleures adresses et les trésors cachés du quartier.",

  // Events View
  "events.coverTitle": "Événements",
  "events.coverSubtitle": "Expériences distinguées cette semaine",
  "events.today": "Aujourd'hui",
  "events.week": "Cette Semaine",
  "events.empty": "Aucun événement programmé",
  "events.viewAll": "Découvrir tous les événements",

  // Concierge
  "concierge.welcome": "Bienvenue au Grand Éclipse.",
  "concierge.chooseLanguage": "Veuillez sélectionner votre langue.",
  "concierge.stayType": "Comment puis-je vous être utile ?",
  "concierge.student": "Séjour Longue Durée",
  "concierge.guest": "Client de l'Hôtel",
  "concierge.visitType.first": "Première Visite",
  "concierge.visitType.returning": "Client Fidèle",
  "concierge.visitType.beenAround": "Hôte Familier",
  "concierge.mic_permission": "Autorisation microphone refusée.",
  "concierge.listening": "Je vous écoute...",
  "concierge.processing": "Un instant...",
  "concierge.error": "Veuillez m'excuser, une erreur s'est produite.",

  // Admin Panel
  "admin.title": "Configuration de l'Établissement",
  "admin.subtitle": "Administration du contenu concierge",
  "admin.exit": "Quitter",
  "admin.tab.info": "Informations",
  "admin.tab.images": "Visuels",
  "admin.tab.room": "Suites",
  "admin.tab.hub": "Prestations",
  "admin.tab.events": "Événements",
  "admin.tab.area": "Quartier",
  "admin.tab.lang": "Langues",
  "admin.section.profile": "Profil de l'Établissement",
  "admin.section.hero": "Visuels d'Accueil",
  "admin.section.housekeeping": "Service d'Étage & Connectivité",
  "admin.section.bg": "Arrière-plan Concierge",
  "admin.profile.hotelName": "Nom de l'Établissement",
  "admin.profile.location": "Localisation",
  "admin.profile.receptionHelper": "Assistance Réception",
  "admin.profile.openingHours": "Horaires de Service",
  "admin.label.cleaningGuest": "Service d'Étage (Clients)",
  "admin.label.cleaningStudent": "Service d'Étage (Longue Durée)",
  "admin.label.wifiSsid": "Nom du Réseau Wi-Fi",
  "admin.label.wifiInstr": "Instructions de Connexion",
  "admin.label.amenities": "Équipements Disponibles",
  "admin.label.ac": "Climatisation",
  "admin.hub.facilitiesHours": "Prestations & Horaires",
  "admin.hub.breakfastTimes": "Horaires du Petit-déjeuner",
  "admin.hub.breakfastPrices": "Tarification Petit-déjeuner",
  "admin.hub.pool": "Informations Piscine",
  "admin.hub.games": "Espace Détente",
  "admin.area.restaurants": "Tables Partenaires",
  "admin.area.discounts": "Avantages & Préférences",
  "admin.area.transport": "Transport",
  "admin.area.essentials": "Services de Proximité",
  "admin.events.manage": "Gérer les Événements",
  "admin.events.new": "+ Nouvel Événement",
  "admin.events.remove": "Supprimer",
  "admin.events.title": "Titre",
  "admin.events.time": "Horaire",
  "admin.events.day": "Jour",
  "admin.lang.manual": "Les traductions sont révisées manuellement pour garantir une qualité irréprochable.",
  "admin.lang.editComing": "Édition multilingue disponible prochainement.",
  "admin.sync.banner": "Modifications appliquées instantanément",
  "common.cancel": "Annuler",
  "common.confirm": "Confirmer",

  // Content Keys — Luxury Branding
  cleaning_title: "Service d'Étage",
  cleaning_subtitle: "Une attention impeccable aux détails.",
  cleaning_1: "Service de couverture quotidien. Linge renouvelé tous les deux jours.",
  cleaning_2: "Séjour longue durée : nettoyage hebdomadaire inclus. Service supplémentaire sur demande.",
  cleaning_3: "Notre Réception est à votre service en permanence.",
  breakfast_title: "Petit-déjeuner",
  breakfast_subtitle: "Commencez votre journée avec raffinement.",
  breakfast_1: "Buffet gastronomique : 15 € par personne.",
  breakfast_2: "Sans réservation : 19,50 € par personne.",
  breakfast_3: "Semaine : 07h00–10h30 • Week-end : 07h30–11h00.",
  wifi_title: "Connectivité",
  wifi_subtitle: "Connexion haut débit transparente.",
  wifi_1: "Réseau : LGEguest",
  wifi_2: "Aucun mot de passe requis.",
  wifi_3: "Connexion instantanée.",
  shop_title: "Boutique",
  shop_subtitle: "Collection exclusive : vêtements, accessoires et articles de luxe sélectionnés.",
  shop_student_note: "Séjours longue durée : renseignez-vous sur nos tarifs préférentiels.",
  restaurant_title: "Restaurant & Bar",
  restaurant_subtitle: "L'excellence gastronomique au sein de l'hôtel.",
  restaurant_hours: "Ouvert tous les jours • 12h00–23h00",
  paris_breakfast_title: "Service Petit-déjeuner",
  paris_breakfast_subtitle: "Au Grand Éclipse, nous servons exclusivement le petit-déjeuner. Pour le déjeuner et le dîner, veuillez consulter nos Recommandations.",
  amenities_guest: "Sélection premium de thé et café à votre disposition. Eau artésienne offerte.",
  frontdesk_tip: "Notre équipe se tient à votre entière disposition.",
  concierge_title: "Conciergerie",
  concierge_hint: "Connectivité, gastronomie, services...",
  concierge_fallback: "Je peux vous guider dans cette application. Pour toute autre demande, notre Réception attend votre appel.",

  // Navigation & UI
  hub_pool_info: "Accès saisonnier • 09h00–21h00. Clé de suite requise.",
  hub_games_info: "PlayStation 5, Tennis de table, Baby-foot.",
  neighborhood_transport_info: "Station de métro à proximité. Service de voiture privée disponible via la Réception.",
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
