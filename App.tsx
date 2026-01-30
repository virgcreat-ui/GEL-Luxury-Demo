
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import BreakfastCard from "./components/BreakfastCard";
import AdminHub from "./components/AdminHub";
import AdminShell from "./components/AdminShell";
import ConciergeScreen from "./components/ConciergeScreen";
import { t, Lang, LANG_LABELS, LANG_SHORT, LANG_STORAGE_KEY, safeLang } from "./i18n";
import { setDefaultConfig, loadConfig } from "./services/configService";
import { ImageSlot, clearSlotOverride } from "./services/imageSlots";
import { voiceService } from "./services/voiceService";
import { getImageForSlot } from "./services/imageService";
import { getActiveContext, setActiveContext, getRoomNotes, RoomContext } from "./services/contextService";
import { CARD_VOICE_LINES, getSpeechLangCode } from "./services/cardVoiceLines";
import { openLGEAppLink } from "./constants/links";

/* =========================================================
   TYPES & CONSTANTS
   ========================================================= */


type Route =
  | { name: "welcome" }
  | { name: "home" }
  | { name: "list"; categoryId: string }
  | { name: "detail"; guideId: string }
  | { name: "events-list"; mode: "today" | "week" }
  | { name: "event-detail"; eventId: string }
  | { name: "ask" }
  | { name: "admin" };

type ImageRef = { kind: "none" } | { kind: "url"; url: string } | { kind: "key"; key: string };
type MediaItem = { kind: "key"; key: string; url: string; label?: string; createdAt?: number; };

type GuideCategory = {
  id: string;
  titleKey: string;
  color: string;
  icon: string;
  heroImage?: ImageRef;
};

type GuideItem = {
  id: string;
  categoryId: string;
  titleKey: string;
  subtitleKey: string;
  heroImage?: ImageRef;
  steps: string[];
};

type EventItem = {
  id: string;
  title: Record<string, string>;
  startTime: string;
  location: Record<string, string>;
  image: ImageRef;
  dayTag: "today" | "week";
  description?: Record<string, string>;
};

export type HotelPack = {
  schemaVersion: number;
  profile: {
    hotelName: string;
    cityLabel: string;
    phoneDial: string;
    frontDeskAvailability: string;
    wifi: {
      ssid: string;
      instructions: string;
    },
    openingHours: string,
    cleaning: {
      guest: string;
      extraCleaningPrice: string;
      extraSheetsPrice: string;
    },
    amenities: string,
    acInfo: string,
    breakfast: {
      times: string,
      prices: string
    },
    poolInfo: string,
    gameRoomInfo: string,
    laundry: {
      guestPolicy: string;
      reservationApp: string;
    },
    guestPolicies: {
      kitchenRules: string;
      trashSorting: string;
      windowsRule: string;
      visitorPolicy: string;
    },
    area: {
      restaurants: string,
      discounts: string,
      transport: string,
      essentials: string
    };
    facilitiesConfig: {
      hasCinema: boolean;
      hasPool: boolean;
      hasCoworking: boolean;
      hasCommunityKitchen: boolean;
      hasSharedKitchens: boolean;
      hasQuietWorkspace: boolean;
    };
  };
  categories: GuideCategory[];
  guides: GuideItem[];
  events: EventItem[];
  media: MediaItem[];
  concierge: ConciergeData;
};

export interface KnowledgeTopic {
  title: string;
  body: string;
}

export interface GuideTopic {
  id: string;
  label: { [lang: string]: string };
  voice: { [lang: string]: string };
  cards: {
    title: { [lang: string]: string };
    body: { [lang: string]: string };
    image?: ImageRef;
  }[];
}

export interface ConciergeData {
  welcomeVoice: { [lang: string]: string };
  selectionVoice: { [lang: string]: string };
  introPhrases: {
    guest: { [lang: string]: string[] };
  };
  fallbackHumanHelp: { [lang: string]: string };
  guest: {
    primaryTopicIds: string[];
    topics: Record<string, GuideTopic>;
  };
}

const LS_PACK = "lge_pack_v5";
const LS_LANG = "lge_lang";
const LS_LAST_ROOM = "lge_last_room";

const ui = {
  yellow: "#FFE400",
  hubGreen: "#43D3A0",
  roomPink: "#FFB6CC",
  accentRed: "#FF3B57",
  ink: "#0B0B0B",
  sub: "#6B7280",
};

/* =========================================================
   UTILITIES
   ========================================================= */
function safeParse<T>(json: string | null, fallback: T): T {
  if (!json) return fallback;
  try { return JSON.parse(json) as T; } catch { return fallback; }
}

const cx = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(" ");

function resolveImageSrc(media: MediaItem[], ref?: ImageRef) {
  if (!ref || ref.kind === "none") return undefined;
  if (ref.kind === "url") return ref.url;
  if (ref.kind === "key") {
    const item = media.find((m) => m.key === ref.key);
    return item?.url;
  }
  return undefined;
}

const DEFAULT_PACK: HotelPack = {
  schemaVersion: 6,
  profile: {
    hotelName: "Le Grand Éclipse",
    cityLabel: "Paris",
    phoneDial: "9",
    frontDeskAvailability: "Our front desk team is here 24/7. Just reach out from your room phone.",
    wifi: {
      ssid: "LGEguest",
      instructions: "Connect to ‘LGEguest’. No password, no email required."
    },
    openingHours: "Reception: 24/7. Gym: 24/7. Laundry: 24/7. Game room access via reception.",
    cleaning: {
      guest: "Cleaning every 2 nights. Bed sheets changed after the 4th night.",
      extraCleaningPrice: "€22.50",
      extraSheetsPrice: "€5.00"
    },
    amenities: "Shampoo + soap dispensers. Towels provided. Coffee & tea included for hotel guests. Complimentary water bottles provided. No smoking allowed in rooms.",
    acInfo: "Individual AC control in room. Please keep windows closed when it's on.",
    breakfast: {
      times: "Weekdays: 07:00–10:30 • Weekends: 07:30–11:00",
      prices: "€15 per person (€19.50 if booked same morning at the desk)"
    },
    poolInfo: "Summer only, 09:00 – 21:00. Remember your keycard.",
    gameRoomInfo: "Professional pool table. Access via reception.",
    laundry: {
      guestPolicy: "Free use of laundry facilities during your stay.",
      reservationApp: "Reserve your machine via the LGE app."
    },
    guestPolicies: {
      kitchenRules: "Clean as you go. Respect your neighbor's food.",
      trashSorting: "Sorting bins available in the basement. Yellow for recycling, black for rest.",
      windowsRule: "Keep windows closed after 22:00 to keep the vibe quiet.",
      visitorPolicy: "Guests must register at reception. No overnight visitors past 23:00 without day-pass."
    },
    area: {
      restaurants: "Le Flore (French cuisine is a must try).",
      discounts: "15% discount on the day menu with LGE room key at Le Flore.",
      transport: "Metro station nearby. Taxis can be booked via reception.",
      essentials: "Grocery store close by for late night snacks."
    },
    facilitiesConfig: {
      hasCinema: false,
      hasPool: true,
      hasCoworking: true,
      hasCommunityKitchen: true,
      hasSharedKitchens: true,
      hasQuietWorkspace: true
    }
  },
  media: [
    { kind: "key", key: "hero_hub", url: "/hero_hub_v2.png", label: "Hub Hero" },
    { kind: "key", key: "hero_room", url: "/hero_room_v2.png", label: "Room Hero" },
    { kind: "key", key: "hero_events", url: "/hero_events_v2.png", label: "Events Hero" },
    { kind: "key", key: "hero_paris", url: "/hero_paris_v2.png", label: "Paris Hero" },
    { kind: "key", key: "hub_breakfast", url: "/lge_breakfast_buffet_v2.png", label: "Breakfast" },
    { kind: "key", key: "hub_pool", url: "/hub_pool_v2.png", label: "Pool" },
    { kind: "key", key: "hub_games", url: "/lge_gym_v1.png", label: "Gym" },
    { kind: "key", key: "room_cleaning", url: "/lge_housekeeping_v2.png", label: "Cleaning" },
    { kind: "key", key: "room_wifi", url: "/lge_wifi_desk_v2.png", label: "WiFi" },
    { kind: "key", key: "area_metro", url: "/lge_metro_entrance_v2.png", label: "Metro" },

    { kind: "key", key: "hub_restaurant", url: "/lge_restaurant_v1.png", label: "Restaurant" },
    { kind: "key", key: "area_bikes", url: "/lge_bikes_v1.png", label: "Bikes" },
    { kind: "key", key: "area_market", url: "/lge_grocery_v2.png", label: "Market" },
    { kind: "key", key: "area_dining", url: "/lge_dining_partners_v2.png", label: "Dining" },
    { kind: "key", key: "room_amenities", url: "/lge_thermostat_v2.png", label: "Amenities" },
    { kind: "key", key: "room_maintenance", url: "/lge_maintenance_v2.png", label: "Maintenance" },
    { kind: "key", key: "hub_packages", url: "/lge_packages_v2.png", label: "Packages" },
    { kind: "key", key: "hub_luggage", url: "/lge_luggage_v2.png", label: "Luggage" },
    { kind: "key", key: "community", url: "/lge_community_v1.png", label: "Community" },
    { kind: "key", key: "room_laundry", url: "/lge_laundry_v2.png", label: "Laundry" },
    { kind: "key", key: "room_comforty", url: "/lge_stay_comfortably_final.png", label: "Comfort" },
  ],
  categories: [
    { id: "hub", titleKey: "c_the_hub", color: ui.hubGreen, icon: "", heroImage: { kind: "key", key: "hero_hub" } },
    { id: "room", titleKey: "c_your_room", color: ui.roomPink, icon: "", heroImage: { kind: "key", key: "hero_room" } },
    { id: "events", titleKey: "events_title", color: ui.accentRed, icon: "", heroImage: { kind: "key", key: "hero_paris" } },
    { id: "neighborhood", titleKey: "Around the Area", color: ui.yellow, icon: "", heroImage: { kind: "key", key: "hero_paris" } },
    { id: "help", titleKey: "c_ask", color: ui.ink, icon: "", heroImage: { kind: "key", key: "hero_hub" } },
  ],
  guides: [
    // Hub Guides
    { id: "facilities", categoryId: "hub", titleKey: "hub.facilities", subtitleKey: "hub.coverSubtitle", steps: ["hub.facilities_desc"], heroImage: { kind: "key", key: "hub_games" } },
    { id: "food", categoryId: "hub", titleKey: "hub.food_drinks", subtitleKey: "breakfast_subtitle", steps: ["breakfast_1", "breakfast_2", "breakfast_3", "paris_breakfast_subtitle"], heroImage: { kind: "key", key: "hub_breakfast" } },


    // Room Guides
    { id: "wifi", categoryId: "room", titleKey: "room.wifiTitle", subtitleKey: "wifi_subtitle", steps: ["wifi_1", "wifi_2", "wifi_3"], heroImage: { kind: "key", key: "room_wifi" } },
    { id: "cleaning", categoryId: "room", titleKey: "room.cleaning", subtitleKey: "cleaning_subtitle", steps: ["cleaning_1", "cleaning_2", "cleaning_3"], heroImage: { kind: "key", key: "room_cleaning" } },
    { id: "amenities", categoryId: "room", titleKey: "room.amenitiesTitle", subtitleKey: "room.ac_label", steps: ["amenities_guest"], heroImage: { kind: "key", key: "room_amenities" } },
    { id: "house_rules", categoryId: "room", titleKey: "room.comfortTitle", subtitleKey: "room.comfortText", steps: ["room.comfortText"], heroImage: { kind: "key", key: "room_comforty" } },
  ],
  events: [
    {
      id: "morning-yoga",
      title: { en: "Morning Yoga", fr: "Yoga du matin", nl: "Ochtend yoga" },
      startTime: "08:00–09:00",
      location: { en: "The Gym", fr: "La salle de sport", nl: "De gym" },
      image: { kind: "url", url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80" },
      dayTag: "today",
      description: { en: "Start your day with energy and focus. Open for all levels.", fr: "Commencez votre journée avec énergie et concentration.", nl: "Begin je dag met energie en focus." }
    },
    {
      id: "wine-cheese",
      title: { en: "Wine & Cheese — à la française", fr: "Vin & fromage — à la française", nl: "Wijn & kaas" },
      startTime: "19:00–20:30",
      location: { en: "Lobby Bar", fr: "Bar du lobby", nl: "Lobby bar" },
      image: { kind: "url", url: "https://images.unsplash.com/photo-1528823872057-9c018a7a7553?auto=format&fit=crop&w=800&q=80" },
      dayTag: "today",
      description: { en: "An evening of fine French wine and artisanal cheeses. Perfect for networking.", fr: "Une soirée de bons vins français et de fromages artisanaux.", nl: "Een avond vol Franse wijn en ambachtelijke kazen." }
    },

  ],
  concierge: {
    // Extended introduction v4 - plays once when Hotel Guest / Student cards appear
    // Combines welcome + guidance offer + stay-type question in one natural flow
    welcomeVoice: {
      en: "Welcome to Le Grand Éclipse. I'll be your digital concierge, here to help you feel at home. Whenever you're ready, I can guide you through everything you need. To get started — are you staying with us as a hotel guest, or as a student?",
      fr: "Bienvenue à Le Grand Éclipse. Je serai votre concierge digitale, là pour vous aider à vous sentir chez vous. Quand vous voulez, je peux vous guider à chaque étape de votre séjour. Pour commencer — séjournez-vous chez nous en tant que client hôtel, ou étudiant ?",
      de: "Willkommen im Le Grand Éclipse. Ich bin Ihre digitale Concierge und helfe Ihnen gern, sich hier wohlzufühlen. Wenn Sie möchten, begleite ich Sie durch alles Wichtige. Zum Start — sind Sie bei uns als Hotelgast, oder als Student?",
      es: "Bienvenido a Le Grand Éclipse. Seré tu concierge digital, aquí para ayudarte a sentirte como en casa. Cuando quieras, te guiaré en todo lo que necesites. Para empezar — ¿te alojas con nosotros como huésped del hotel, o como estudiante?",
      it: "Benvenuto a Le Grand Éclipse. Sarò la tua concierge digitale, qui per farti sentire subito a casa. Quando vuoi, ti guiderò in tutto ciò di cui hai bisogno. Per iniziare — soggiorni con noi come ospite dell'hotel, o come studente?",
      pt: "Bem-vindo ao Le Grand Éclipse. Serei a sua concierge digital, aqui para o ajudar a sentir-se em casa. Sempre que quiser, posso guiá-lo em tudo o que precisar. Para começar — está connosco como hóspede do hotel, ou como estudante?"
    },
    // Legacy selectionVoice - kept for backward compatibility but welcomeVoice now includes the question
    selectionVoice: {
      en: "Before we get started, are you staying with us as a hotel guest, or as a student?",
      fr: "Avant de commencer, vous séjournez chez nous en tant que client hôtel, ou en tant qu'étudiant ?",
      de: "Bevor wir loslegen — wohnen Sie bei uns als Hotelgast, oder als Student?",
      es: "Antes de empezar, ¿te alojas con nosotros como huésped del hotel o como estudiante?",
      it: "Prima di iniziare, soggiorni con noi come ospite dell'hotel o come studente?",
      pt: "Antes de começar, está a ficar connosco como hóspede do hotel ou como estudante?"
    },
    introPhrases: {
      guest: {
        en: [
          "Welcome to your Parisian home away from home.",
          "Paris looks beautiful today. Let’s get you settled.",
          "Relax. I’m here to make your stay perfect.",
          "The city of lights awaits. Let's get you comfortable first.",
          "It's a pleasure to have you with us. How can I assist?",
          "From fresh towels to the best coffee, I've got you covered.",
          "Your comfort is my priority. Let's start with the basics."
        ],
        fr: [
          "Bienvenue chez vous, au cœur de Paris.",
          "Paris est magnifique aujourd'hui. Installons-nous.",
          "Détendez-vous. Je suis là pour parfaire votre séjour.",
          "La ville lumière vous attend. D'abord, votre confort.",
          "C'est un plaisir de vous avoir. Comment puis-je aider ?",
          "Des serviettes propres au meilleur café, je m'occupe de tout.",
          "Votre confort est ma priorité. Commençons par les bases."
        ],
        de: [
          "Willkommen in Ihrem Pariser Zuhause.",
          "Paris sieht heute wunderschön aus. Machen wir es uns gemütlich.",
          "Entspannen Sie sich. Ich bin hier für Ihren perfekten Aufenthalt.",
          "Die Stadt der Lichter wartet. Aber erst machen wir es uns bequem.",
          "Es ist mir ein Vergnügen. Wie kann ich helfen?",
          "Von frischen Handtüchern bis zum besten Kaffee, ich hab alles.",
          "Ihr Komfort ist meine Priorität. Fangen wir an."
        ],
        es: [
          "Bienvenido a tu hogar parisino lejos de casa.",
          "París está hermosa hoy. Acomodémonos.",
          "Relájate. Estoy aquí para que tu estancia sea perfecta.",
          "La ciudad de la luz espera. Pero primero, tu comodidad.",
          "Es un placer tenerte aquí. ¿Cómo puedo ayudarte?",
          "Desde toallas limpias hasta el mejor café, yo me encargo.",
          "Tu comodidad es mi prioridad. Empecemos por lo básico."
        ],
        pt: [
          "Bem-vindo à sua casa parisiense longe de casa.",
          "Paris está linda hoje. Vamos acomodá-lo.",
          "Relaxe. Estou aqui para tornar a sua estadia perfeita.",
          "A cidade luz o aguarda. Mas primeiro, o seu conforto.",
          "É um prazer tê-lo aqui. Como posso ajudar?",
          "De toalhas limpas ao melhor café, eu trato de tudo.",
          "O seu conforto é a minha prioridade. Vamos começar pelo básico."
        ],
        it: [
          "Benvenuti nella vostra casa parigina lontano da casa.",
          "Parigi è bellissima oggi. Sistemiamoci.",
          "Rilassatevi. Sono qui per rendere il vostro soggiorno perfetto.",
          "La città delle luci vi aspetta. Ma prima, il vostro comfort.",
          "È un piacere avervi qui. Come posso aiutarvi?",
          "Dagli asciugamani puliti al miglior caffè, ci penso io.",
          "Il vostro comfort è la mia priorità. Iniziamo dalle basi."
        ]
      }
    },
    fallbackHumanHelp: {
      en: "If you’d like a human, please reach out. We’re here 24/7.",
      fr: "Si vous préférez parler à un humain, contactez-nous. Nous sommes là 24h/24.",
      de: "Wenn Sie mit einem Menschen sprechen möchten, melden Sie sich bitte. Wir sind 24/7 da.",
      es: "Si prefieres hablar con un humano, contáctanos. Estamos aquí 24/7."
    },
    guest: {
      primaryTopicIds: ["room", "breakfast", "spa", "gym", "dining", "facilities", "area"],
      topics: {
        "room": {
          id: "room",
          label: { en: "Your Room", fr: "Votre Chambre", de: "Ihr Zimmer", es: "Tu Habitación" },
          voice: {
            en: "Here is everything you need to know about your stay, from housekeeping to high-speed WiFi.",
            fr: "Voici tout ce qu'il faut savoir, du service de chambre au WiFi haut débit.",
            de: "Hier finden Sie alles, von der Reinigung bis zum Highspeed-WLAN.",
            es: "Aquí tienes todo sobre tu estancia, de limpieza a WiFi rápido."
          },
          cards: [
            {
              title: { en: "Housekeeping", fr: "Service de Chambre", de: "Reinigung", es: "Limpieza" },
              body: { en: "Housekeeping every 2 nights. Linens refreshed after the 4th night.", fr: "Service de chambre tous les 2 jours. Linge renouvelé après la 4ème nuit.", de: "Reinigung alle 2 Nächte. Bettwäschewechsel nach der 4. Nacht.", es: "Limpieza cada 2 noches. Sábanas tras la 4ª noche." },
              image: { kind: "key", key: "room_cleaning" }
            },
            {
              title: { en: "WiFi", fr: "WiFi", de: "WiFi", es: "WiFi" },
              body: { en: "Free high-speed WiFi throughout the hub. Connect to 'LGEguest'.", fr: "WiFi haut débit gratuit partout. Connectez-vous à 'LGEguest'.", de: "Gratis Highspeed-WLAN überall. Mit 'LGEguest' verbinden.", es: "WiFi rápido gratis en todo el hub. Conéctate a 'LGEguest'." },
              image: { kind: "key", key: "room_wifi" }
            },
            {
              title: { en: "Stay Comfortably", fr: "Séjour tout confort", de: "Komfortabel wohnen", es: "Alojarse cómodamente" },
              body: { en: "Individual AC control in your cozy room. Please keep windows closed when it's on.", fr: "Contrôle individuel de la clim. Gardez les fenêtres fermées quand elle tourne.", de: "Individuelle Klimaanlage. Fenster bei Betrieb bitte geschlossen halten.", es: "Control de AC individual. Mantén las ventanas cerradas mientras funcione." },
              image: { kind: "key", key: "room_comforty" }
            }
          ]
        },

        "breakfast": {
          id: "breakfast",
          label: { en: "Breakfast", fr: "Petit-déjeuner", de: "Frühstück", es: "Desayuno" },
          voice: {
            en: "Start your day with our signature buffet. Here are the times and your options.",
            fr: "Commencez la journée avec notre buffet signature. Voici les infos.",
            de: "Starten Sie mit unserem Buffet in den Tag. Hier sind die Infos.",
            es: "Empieza el día con nuestro buffet insignia. Aquí los detalles."
          },
          cards: [
            {
              title: { en: "Times", fr: "Horaires", de: "Zeiten", es: "Horarios" },
              body: { en: "Weekdays: 07:00–10:30 • Weekends: 07:30–11:00.", fr: "Semaine : 07h00–10h30 • Week-end : 07h30–11h00.", de: "Wochentage: 07:00–10:30 • Wochenende: 07:30–11:00.", es: "Laborables: 07:00–10:30 • Fines de semana: 07:30–11:00." },
              image: { kind: "key", key: "hub_breakfast" }
            },
            {
              title: { en: "Price", fr: "Prix", de: "Preis", es: "Precio" },
              body: { en: "€15 per person (or €19.50 if booked same morning).", fr: "15€ par personne (ou 19,50€ réservé le matin même).", de: "15€ p.P. (oder 19,50€ bei Buchung am selben Morgen).", es: "15€ por persona (o 19,50€ si reservas esa mañana)." },
              image: { kind: "key", key: "hub_restaurant" }
            }
          ]
        },
        "facilities": {
          id: "facilities",
          label: { en: "Facilities", fr: "Équipements", de: "Einrichtungen", es: "Instalaciones" },
          voice: {
            en: "Check out our 24/7 gym, laundry, and the pool (seasonal).",
            fr: "Profitez du gym 24/7, de la laverie et de la piscine (saison).",
            de: "Nutzen Sie Gym 24/7, Wäscherei und Pool (saisonal).",
            es: "Disfruta el gym 24/7, lavandería y piscina (temporada)."
          },
          cards: [
            {
              title: { en: "Gym", fr: "Gym", de: "Fitness", es: "Gimnasio" },
              body: { en: "Free 24/7 use for guests. Located on the ground floor.", fr: "Gratuit 24h/24 pour les clients. Au rez-de-chaussée.", de: "Gratis 24/7 für Gäste. Im Erdgeschoss.", es: "Gratis 24/7 para clientes. En planta baja." },
              image: { kind: "key", key: "hub_games" }
            },
            {
              title: { en: "Bikes", fr: "Vélos", de: "Fahrräder", es: "Bicis" },
              body: { en: "Bike hire available. Ask our team for rates and LGE app setup.", fr: "Location de vélos dispo. Demandez les tarifs à l'équipe.", de: "Fahrradverleih möglich. Fragt das Team nach Preisen.", es: "Alquiler de bicis. Consulta tarifas con el equipo." },
              image: { kind: "key", key: "area_bikes" }
            },
            {
              title: { en: "Laundry", fr: "Laverie", de: "Wäscherei", es: "Lavandería" },
              body: { en: "Free for guests via LGE app. Open 24/7.", fr: "Gratuit via l'app LGE. Ouvert 24h/24.", de: "Kostenlos via LGE app. 24/7 offen.", es: "Gratis por la app LGE. Abierto 24/7." },
              image: { kind: "key", key: "room_laundry" }
            },
            {
              title: { en: "Front Desk 24/7", fr: "Réception", de: "Empfang", es: "Recepción" },
              body: { en: "Dial 9 from your room anytime. We are at your service.", fr: "Composez le 9 depuis votre chambre. Nous restons à votre entière disposition.", de: "Wählen Sie jederzeit die 9 vom Zimmer aus.", es: "Marca el 9 desde tu habitación. Estamos para ayudarte." },
              image: { kind: "key", key: "hero_paris" }
            }
          ]
        },
        "area": {
          id: "area",
          label: { en: "Around the Area", fr: "Quartier", de: "Umgebung", es: "Zona" },
          voice: {
            en: "Paris is at your doorstep. Here's how to get around and find the best spots.",
            fr: "Paris est à vos pieds. Voici comment circuler et les bons coins.",
            de: "Paris liegt Ihnen zu Füßen. Hier die besten Transport-Tipps.",
            es: "París a tus pies. Así puedes moverte y buscar sitios top."
          },
          cards: [
            {
              title: { en: "Transport", fr: "Transport", de: "Verkehr", es: "Transporte" },
              body: { en: "Metro station La Défense is a 1 min walk. Direct to city center.", fr: "Métro La Défense à 1 min. Direct vers le centre.", de: "Metro La Défense 1 Min. zu Fuß. Direkt ins Zentrum.", es: "Metro La Défense a 1 min. Directo al centro." },
              image: { kind: "key", key: "area_metro" }
            },
            {
              title: { en: "Local Life", fr: "Vie Locale", de: "Lokales", es: "Vivienda" },
              body: { en: "Le Flore restaurant nearby offers a 15% discount for LGE guests.", fr: "Le resto Le Flore offre -15% aux clients LGE.", de: "Restaurant Le Flore bietet 15% Rabatt für LGE-Gäste.", es: "Restaurante Le Flore ofrece 15% dto. a clientes LGE." },
              image: { kind: "key", key: "area_dining" }
            },
            {
              title: { en: "Late & Upgrades", fr: "Late & Upgrades", de: "Late & Upgrades", es: "Late & Upgrades" },
              body: { en: "Ask front desk for late check-out, upgrades, or parking.", fr: "Demandez à la réception (late check-out, surclassement, parking).", de: "Fragt am Empfang nach Late Check-out, Upgrades oder Parken.", es: "Consulta en recepción late check-out, upgrades o parking." },
              image: { kind: "key", key: "hero_paris" }
            }
          ]
        },
        "events": {
          id: "events",
          label: { en: "Events", fr: "Événements", de: "Events", es: "Eventos" },
          voice: {
            en: "Discover our curated events: wellness sessions, tastings, and exclusive experiences during your stay.",
            fr: "Découvrez nos événements sélectionnés : séances bien-être, dégustations et expériences exclusives durant votre séjour.",
            de: "Entdecken Sie unsere kuratierten Events: Wellness, Verkostungen und exklusive Erlebnisse.",
            es: "Descubre nuestros eventos: sesiones de bienestar, degustaciones y experiencias exclusivas."
          },
          cards: [
            { title: { en: "Happening Now", fr: "En ce moment", de: "Aktuell", es: "Ahora" }, body: { en: "Check our local programming in the Events section on Home.", fr: "Voir le programme local dans la section Événements de l'Accueil.", de: "Siehe Programm im Events-Bereich auf der Startseite.", es: "Mira el programa local en la sección Eventos de Inicio." } }
          ]
        },
        "spa": {
          id: "spa",
          label: { en: "Spa & Wellness", fr: "Spa & Bien-être", de: "Spa & Wellness", es: "Spa y Bienestar", it: "Spa & Benessere", pt: "Spa & Bem-estar" },
          voice: {
            en: "Indulge in our signature spa treatments. From aromatherapy massages to rejuvenating facials, pure relaxation awaits.",
            fr: "Offrez-vous nos soins spa signature. Des massages aromathérapie aux soins du visage, la détente absolue vous attend.",
            de: "Gönnen Sie sich unsere Signature-Spa-Behandlungen. Von Aromatherapie-Massagen bis hin zu verjüngenden Gesichtsbehandlungen.",
            es: "Disfruta de nuestros tratamientos spa exclusivos. Desde masajes de aromaterapia hasta faciales rejuvenecedores.",
            it: "Concedetevi i nostri trattamenti spa signature. Dai massaggi aromaterapici ai trattamenti viso rigeneranti.",
            pt: "Delicie-se com os nossos tratamentos de spa exclusivos. De massagens de aromaterapia a tratamentos faciais rejuvenescedores."
          },
          cards: [
            {
              title: { en: "Signature Treatments", fr: "Soins Signature", de: "Signature-Behandlungen", es: "Tratamientos Exclusivos", it: "Trattamenti Signature", pt: "Tratamentos Exclusivos" },
              body: { en: "Book our 90-minute Grand Éclipse Journey – a full-body massage with hot stones and essential oils. €180 per session.", fr: "Réservez notre Voyage Grand Éclipse de 90 minutes – massage corps entier aux pierres chaudes et huiles essentielles. 180€.", de: "Buchen Sie unsere 90-minütige Grand Éclipse Reise – Ganzkörpermassage mit heißen Steinen und ätherischen Ölen. 180€.", es: "Reserva nuestro Viaje Grand Éclipse de 90 minutos – masaje corporal con piedras calientes y aceites esenciales. 180€.", it: "Prenota il nostro Viaggio Grand Éclipse di 90 minuti – massaggio completo con pietre calde e oli essenziali. 180€.", pt: "Reserve a nossa Jornada Grand Éclipse de 90 minutos – massagem corporal com pedras quentes e óleos essenciais. 180€." },
              image: { kind: "key", key: "hub_spa" }
            },
            {
              title: { en: "Hours & Booking", fr: "Horaires & Réservation", de: "Öffnungszeiten & Buchung", es: "Horarios y Reservas", it: "Orari e Prenotazioni", pt: "Horários e Reservas" },
              body: { en: "Open daily 09:00–21:00. Reserve your slot via the LGE app or at reception. Walk-ins subject to availability.", fr: "Ouvert tous les jours 09h00–21h00. Réservez via l'app LGE ou à la réception.", de: "Täglich 09:00–21:00 Uhr. Reservieren Sie über die LGE-App oder an der Rezeption.", es: "Abierto diariamente 09:00–21:00. Reserva por la app LGE o en recepción.", it: "Aperto tutti i giorni 09:00–21:00. Prenota tramite l'app LGE o alla reception.", pt: "Aberto diariamente 09:00–21:00. Reserve pela app LGE ou na receção." },
              image: { kind: "key", key: "hub_spa" }
            }
          ]
        },
        "gym": {
          id: "gym",
          label: { en: "State-of-the-Art Gym", fr: "Salle de Sport Premium", de: "Hochmodernes Fitnessstudio", es: "Gimnasio de Última Generación", it: "Palestra all'Avanguardia", pt: "Ginásio de Última Geração" },
          voice: {
            en: "Our 24/7 fitness center features Technogym equipment, free weights, and a dedicated stretching zone. Personal trainers available on request.",
            fr: "Notre centre fitness 24h/24 dispose d'équipements Technogym, de poids libres et d'une zone d'étirement. Coachs personnels sur demande.",
            de: "Unser 24/7-Fitnesscenter bietet Technogym-Geräte, freie Gewichte und einen Dehnungsbereich. Personal Trainer auf Anfrage.",
            es: "Nuestro centro fitness 24/7 cuenta con equipos Technogym, pesas libres y zona de estiramientos. Entrenadores personales disponibles.",
            it: "Il nostro centro fitness 24/7 dispone di attrezzature Technogym, pesi liberi e zona stretching. Personal trainer su richiesta.",
            pt: "O nosso centro de fitness 24/7 possui equipamentos Technogym, pesos livres e zona de alongamento. Personal trainers disponíveis."
          },
          cards: [
            {
              title: { en: "Equipment", fr: "Équipement", de: "Ausstattung", es: "Equipamiento", it: "Attrezzatura", pt: "Equipamento" },
              body: { en: "Technogym cardio machines, strength training stations, Peloton bikes, and a TRX zone. Towels and water provided.", fr: "Machines cardio Technogym, stations de musculation, vélos Peloton et zone TRX. Serviettes et eau fournies.", de: "Technogym-Cardiogeräte, Kraftstationen, Peloton-Bikes und TRX-Zone. Handtücher und Wasser inklusive.", es: "Máquinas cardio Technogym, estaciones de fuerza, bicis Peloton y zona TRX. Toallas y agua incluidas.", it: "Macchine cardio Technogym, stazioni di forza, bici Peloton e zona TRX. Asciugamani e acqua inclusi.", pt: "Máquinas cardio Technogym, estações de força, bicicletas Peloton e zona TRX. Toalhas e água incluídas." },
              image: { kind: "key", key: "hub_gym" }
            },
            {
              title: { en: "Access & Hours", fr: "Accès & Horaires", de: "Zugang & Zeiten", es: "Acceso y Horarios", it: "Accesso e Orari", pt: "Acesso e Horários" },
              body: { en: "24/7 access with your room key. Located on -1. Personal training sessions €75/hour – book at reception.", fr: "Accès 24h/24 avec votre clé de chambre. Au niveau -1. Séances de coaching 75€/h – réservez à la réception.", de: "24/7 Zugang mit Zimmerschlüssel. Im Untergeschoss. Personal Training 75€/Stunde – an der Rezeption buchen.", es: "Acceso 24/7 con tu llave de habitación. En el nivel -1. Sesiones de entrenamiento personal 75€/hora.", it: "Accesso 24/7 con la chiave della camera. Al piano -1. Sessioni di personal training 75€/ora.", pt: "Acesso 24/7 com a chave do quarto. No piso -1. Sessões de treino pessoal 75€/hora." },
              image: { kind: "key", key: "hub_gym" }
            }
          ]
        },
        "dining": {
          id: "dining",
          label: { en: "Fine Dining", fr: "Gastronomie", de: "Feine Küche", es: "Alta Gastronomía", it: "Alta Cucina", pt: "Alta Gastronomia" },
          voice: {
            en: "Experience culinary excellence at L'Éclipse Restaurant. Our Michelin-trained chef crafts seasonal French cuisine with a modern twist.",
            fr: "Découvrez l'excellence culinaire au Restaurant L'Éclipse. Notre chef étoilé crée une cuisine française de saison revisitée.",
            de: "Erleben Sie kulinarische Exzellenz im L'Éclipse Restaurant. Unser Michelin-ausgebildeter Küchenchef kreiert saisonale französische Küche.",
            es: "Experimenta la excelencia culinaria en L'Éclipse Restaurant. Nuestro chef con formación Michelin crea cocina francesa de temporada.",
            it: "Vivi l'eccellenza culinaria al Ristorante L'Éclipse. Il nostro chef formato Michelin crea cucina francese stagionale con un tocco moderno.",
            pt: "Experimente a excelência culinária no Restaurante L'Éclipse. O nosso chef com formação Michelin cria cozinha francesa sazonal."
          },
          cards: [
            {
              title: { en: "L'Éclipse Restaurant", fr: "Restaurant L'Éclipse", de: "Restaurant L'Éclipse", es: "Restaurante L'Éclipse", it: "Ristorante L'Éclipse", pt: "Restaurante L'Éclipse" },
              body: { en: "Dinner: 19:00–22:30. Tasting menu €95 | À la carte available. Smart casual dress code. Reservations recommended.", fr: "Dîner : 19h00–22h30. Menu dégustation 95€ | À la carte disponible. Code vestimentaire smart casual. Réservation conseillée.", de: "Abendessen: 19:00–22:30. Degustationsmenü 95€ | À la carte verfügbar. Smart Casual Dresscode. Reservierung empfohlen.", es: "Cena: 19:00–22:30. Menú degustación 95€ | À la carta disponible. Vestimenta smart casual. Reservas recomendadas.", it: "Cena: 19:00–22:30. Menu degustazione 95€ | À la carte disponibile. Dress code smart casual. Prenotazione consigliata.", pt: "Jantar: 19:00–22:30. Menu degustação 95€ | À la carte disponível. Dress code smart casual. Reservas recomendadas." },
              image: { kind: "key", key: "hub_dining" }
            },
            {
              title: { en: "Le Bar Céleste", fr: "Le Bar Céleste", de: "Le Bar Céleste", es: "Le Bar Céleste", it: "Le Bar Céleste", pt: "Le Bar Céleste" },
              body: { en: "Craft cocktails and small plates. Open 17:00–01:00. Signature drink: L'Éclipse Spritz €16. Live jazz Friday evenings.", fr: "Cocktails artisanaux et petites assiettes. Ouvert 17h00–01h00. Cocktail signature : L'Éclipse Spritz 16€. Jazz live le vendredi.", de: "Craft-Cocktails und kleine Gerichte. 17:00–01:00 Uhr. Signature-Drink: L'Éclipse Spritz 16€. Live-Jazz freitags.", es: "Cócteles artesanales y tapas. Abierto 17:00–01:00. Bebida signature: L'Éclipse Spritz 16€. Jazz en vivo los viernes.", it: "Cocktail artigianali e piccoli piatti. Aperto 17:00–01:00. Drink signature: L'Éclipse Spritz 16€. Jazz dal vivo il venerdì.", pt: "Cocktails artesanais e petiscos. Aberto 17:00–01:00. Bebida signature: L'Éclipse Spritz 16€. Jazz ao vivo às sextas." },
              image: { kind: "key", key: "hub_bar" }
            }
          ]
        }
      }
    }
  }
};

/* =========================================================
   UI COMPONENTS
   ========================================================= */

function PhoneStage({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen flex justify-center p-0 sm:p-6 overflow-x-hidden bg-[#F2F2F2]">
      <div className="w-full max-w-[430px] bg-white min-h-[100vh] shadow-[0_30px_60px_-12px_rgba(50,50,93,0.25),0_18px_36px_-18px_rgba(0,0,0,0.3)] overflow-hidden relative border border-black/5">
        {children}
      </div>
    </div>
  );
}

/* =========================================================
   UI VISUAL KIT (Density & Accordions)
   ========================================================= */

function QuickPill({ icon, label, onClick }: { icon: string; label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-neutral-200 shadow-sm active:scale-95 transition-all shrink-0">
      <span className="text-xs font-bold text-neutral-800">{label}</span>
    </button>
  );
}

function ImageAccordion({ title, icon, preview, imageUrl, children, defaultOpen = false, voiceKey, lang }: { title: string; icon: string; preview?: string; imageUrl?: string; children: React.ReactNode; defaultOpen?: boolean; voiceKey?: string; lang?: Lang }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const lastVoiceTimeRef = useRef<number>(0);
  const VOICE_DEBOUNCE_MS = 500; // Define debounce constant

  const handleClick = () => {
    // Only play voice when OPENING the card (not when closing)
    if (!isOpen && voiceKey && lang) {
      const now = Date.now();
      if (now - lastVoiceTimeRef.current < VOICE_DEBOUNCE_MS) {
        // Skip if too soon (debounce)
        setIsOpen(!isOpen);
        return;
      }

      // Stop any previous audio
      voiceService.stopAllAudio();

      // Get voice line for this card (now returns an array)
      const voiceLines = CARD_VOICE_LINES[voiceKey]?.[lang];
      if (voiceLines && voiceLines.length > 0) {
        // Randomly select from 3 variants with ElevenLabs
        const variantIndex = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
        const fallbackText = voiceLines[variantIndex - 1]; // Array is 0-indexed
        const scriptId = `card_${voiceKey}_${variantIndex}`;
        voiceService.playPreGenerated(scriptId, lang, fallbackText);
        lastVoiceTimeRef.current = now;
      }
    }

    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden transition-all duration-300 group">
      <button onClick={handleClick} className="w-full relative h-[140px] text-left">
        {imageUrl ? (
          <>
            <img src={imageUrl} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300 ${isOpen ? 'opacity-90' : 'opacity-70'}`} />
          </>
        ) : (
          <div className="absolute inset-0 bg-neutral-900" />
        )}

        <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="text-xl font-semibold tracking-tight text-white drop-shadow-md leading-none" style={{ fontFamily: '"Rubik", sans-serif' }}>
              {title}
            </div>
          </div>
          <div className={`w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            <span className="text-[10px]">▼</span>
          </div>
        </div>
      </button>
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="p-6 bg-white border-t border-neutral-50">
          {children}
        </div>
      </div>
    </div>
  );
}


function StickyAction({ lang, onClick }: { lang?: string; onClick: () => void }) {
  const label = t(safeLang(lang ?? "en"), "frontdesk.label") || "Front Desk";
  const currentLang = safeLang(lang ?? "en");

  const handleClick = () => {
    // Stop any ongoing speech
    voiceService.stopAllAudio();

    // Play voice feedback from cardVoiceLines (calm, reassuring, professional)
    const voiceLines = CARD_VOICE_LINES.front_desk?.[currentLang];
    if (voiceLines && voiceLines.length > 0) {
      // Randomly select from 3 variants
      const variantIndex = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
      const fallbackText = voiceLines[variantIndex - 1]; // Array is 0-indexed
      voiceService.playPreGenerated(`card_front_desk_${variantIndex}`, currentLang, fallbackText);
    }

    // Note: No tel: link, no navigation - voice only
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 z-50 flex justify-center pb-3 pt-2 w-full pointer-events-none">
      <button
        onClick={handleClick}
        className="pointer-events-auto bg-black/95 backdrop-blur-sm text-white h-14 rounded-full shadow-lg flex items-center gap-3 px-6 active:scale-[0.96] transition-all hover:scale-[1.02] border border-white/10"
      >
        <div className="text-lg leading-none">
          ☎
        </div>
        <span className="text-sm font-semibold">
          {label}
        </span>
      </button>
    </div>
  );
}

/* =========================================================
   GUIDE COMPONENTS
   ========================================================= */

function HubView({ pack, lang, onBack }: any) {
  const p = pack.profile;

  // Use image slots with fallback
  const [heroUrl, setHeroUrl] = useState('/hero_hub_v2.png');
  const [imgBreakfast, setImgBreakfast] = useState('/hero_hub_v2.png');
  const [imgPool, setImgPool] = useState('/hero_hub_v2.png');
  const [imgGames, setImgGames] = useState('/hero_hub_v2.png');
  const [imgRestaurant, setImgRestaurant] = useState('/hero_hub_v2.png');
  const [imgShop, setImgShop] = useState('/shop_streetwear_v3.png');

  useEffect(() => {
    Promise.all([
      getImageForSlot(ImageSlot.HUB_HERO),
      getImageForSlot(ImageSlot.HUB_CARD_BREAKFAST),
      getImageForSlot(ImageSlot.HUB_CARD_FACILITIES),
      getImageForSlot(ImageSlot.HUB_CARD_FOOD),
      getImageForSlot(ImageSlot.HUB_CARD_RESTAURANT),
      getImageForSlot(ImageSlot.HUB_CARD_SHOP)
    ]).then(([hero, breakfast, facilities, food, restaurant, shop]) => {
      setHeroUrl(hero);
      setImgBreakfast(breakfast);
      setImgPool(food);  // Using food image for pool/facilities
      setImgGames(facilities);
      setImgRestaurant(restaurant);
      setImgShop(shop);
    });
  }, []);

  // Refs for scroll
  const facilitiesRef = useRef<HTMLDivElement>(null);
  const breakfastRef = useRef<HTMLDivElement>(null);
  const poolRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="h-full flex flex-col bg-[#F2F2F2] overflow-y-auto font-sans">
      {/* Hero */}
      <div className="relative h-[35vh] w-full shrink-0">
        <img src={heroUrl} className="h-full w-full object-cover" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F2F2F2] via-black/20 to-transparent" />
        <button onClick={onBack} className="absolute top-6 left-6 h-10 w-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white flex items-center justify-center shadow-lg hover:bg-black/40 transition-all z-20"><span className="text-xl pb-1">‹</span></button>
        <div className="absolute bottom-6 left-6 right-6">
          <div className="lge-tag text-[10px] mb-2 bg-[#43D3A0] text-black border-none shadow-md">{t(lang, "hub.coverSubtitle")}</div>
          <h2 className="lge-title text-4xl text-black drop-shadow-sm">{t(lang, "home.menu.hub")}</h2>
        </div>
      </div>

      {/* Accordions */}
      <div className="px-6 space-y-4 pt-6 pb-24">

        <ImageAccordion title={t(lang, "hub.facilities")} icon="" imageUrl={imgGames} voiceKey="hub_facilities" lang={lang}>
          <div className="space-y-4">
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 text-sm font-medium leading-relaxed text-neutral-600">
              {p.openingHours}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-xl border border-neutral-100 shadow-sm">
                <div className="text-xs font-medium text-neutral-500 mb-1">Gym</div>
                <div className="text-xs font-bold text-neutral-800">24/7 Access</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-neutral-100 shadow-sm">
                <div className="text-xs font-medium text-neutral-500 mb-1">Laundry</div>
                <div className="text-xs font-bold text-neutral-800">24/7 Access</div>
              </div>
            </div>
          </div>
        </ImageAccordion>

        <ImageAccordion title={t(lang, "hub.food_drinks")} icon="" imageUrl={imgBreakfast} voiceKey="hub_food_drinks" lang={lang}>
          <div className="space-y-6">
            {/* Section 1: Breakfast */}
            <div className="space-y-4">
              <div className="text-xs font-bold text-neutral-500 ml-1">
                {t(lang, "hub.breakfast")}
              </div>
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 space-y-3">
                <div className="text-sm font-bold text-neutral-800">
                  {p.breakfast.times}
                </div>
                <div className="text-sm font-bold text-neutral-800">
                  {p.breakfast.prices}
                </div>
              </div>
            </div>

            {/* Section 2: Restaurant & Bar */}
            <div className="space-y-4">
              <div className="text-xs font-bold text-neutral-500 ml-1">
                {t(lang, "restaurant_title")}
              </div>
              <div className="relative h-[120px] rounded-xl overflow-hidden mb-3">
                <img src={imgRestaurant} className="h-full w-full object-cover" alt="" />
                <div className="absolute inset-0 bg-black/20" />
              </div>
              <div className="p-4 bg-yellow-50/30 border border-yellow-100 rounded-xl">
                <p className="text-sm font-medium text-neutral-700 leading-relaxed">
                  {t(lang, "paris_breakfast_subtitle")}
                </p>
              </div>
            </div>
          </div>
        </ImageAccordion>

        <ImageAccordion title={t(lang, "shop_title")} icon="" imageUrl={resolveImageSrc(pack.media, { kind: "key", key: "hub_shop" })} voiceKey="hub_shop" lang={lang}>
          <div className="space-y-3">
            <p className="text-sm font-medium text-neutral-700 leading-relaxed">
              {t(lang, "shop_subtitle")}
            </p>
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
              <span className="text-xs font-bold text-blue-700">{t(lang, "shop_student_note")}</span>
            </div>
          </div>
        </ImageAccordion>

        {/* Pool/Gaming - Keep but integrate cleaner or as part of Facilities? User mentioned Facilities, Breakfast, Restaurant, Shop. I'll merge Pool into Facilities or keep it separate if it fits. Actually, let's keep it separate for now or remove if it clutters. The user said: "Hub page should contain these cards: Facilities, Breakfast, Restaurant/Bar, Shop". I'll stick to that. */}
      </div>

      <StickyAction lang={lang} onClick={() => window.location.href = `tel:${pack.profile.phoneDial}`} />
    </div >
  );
}

function RoomView({ pack, lang, onBack }: any) {
  const p = pack.profile;

  // Use image slots with fallback
  const [heroUrl, setHeroUrl] = useState('/hero_room_v2.png');
  const [imgWifi, setImgWifi] = useState('/hero_room_v2.png');
  const [imgCleaning, setImgCleaning] = useState('/hero_room_v2.png');
  const [imgAmenities, setImgAmenities] = useState('/hero_room_v2.png');
  const [imgAc, setImgAc] = useState('/hero_room_v2.png');

  useEffect(() => {
    Promise.all([
      getImageForSlot(ImageSlot.ROOM_HERO),
      getImageForSlot(ImageSlot.ROOM_CARD_WIFI),
      getImageForSlot(ImageSlot.ROOM_CARD_CLEANING),
      getImageForSlot(ImageSlot.ROOM_CARD_AMENITIES),
      getImageForSlot(ImageSlot.ROOM_CARD_AC)
    ]).then(([hero, wifi, cleaning, amenities, ac]) => {
      setHeroUrl(hero);
      setImgWifi(wifi);
      setImgCleaning(cleaning);
      setImgAmenities(amenities);
      setImgAc(ac);
    });
  }, []);

  const wifiRef = useRef<HTMLDivElement>(null);
  const cleaningRef = useRef<HTMLDivElement>(null);
  const amenitiesRef = useRef<HTMLDivElement>(null);
  const acRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="h-full flex flex-col bg-[#F2F2F2] overflow-y-auto font-sans">
      <div className="relative h-[35vh] w-full shrink-0">
        <img src={heroUrl} className="h-full w-full object-cover" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F2F2F2] via-black/20 to-transparent" />
        <button onClick={onBack} className="absolute top-6 left-6 h-10 w-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white flex items-center justify-center shadow-lg hover:bg-black/40 transition-all z-20"><span className="text-xl pb-1">‹</span></button>
        <div className="absolute bottom-6 left-6 right-6">
          <div className="lge-tag text-[10px] mb-2 bg-[#FF3B57] text-white border-none shadow-md">{t(lang, "room.coverSubtitle")}</div>
          <h2 className="lge-title text-4xl text-black drop-shadow-sm">{t(lang, "room.coverTitle")}</h2>
        </div>
      </div>

      {/* Content Accordions */}
      <div className="px-6 space-y-4 pt-6 pb-24">

        {/* Room Note (Micro-Patch #7.2) */}
        {(() => {
          const context = getActiveContext();
          const note = context?.room ? getRoomNotes(context.room, lang) : null;
          if (!note) return null;

          return (
            <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-sm mb-2">
              <div className="text-xs font-bold text-neutral-400 mb-2">
                {t(lang, "room_note_title")}
              </div>
              <div className="text-sm font-medium text-neutral-800 leading-relaxed">
                {note}
              </div>
            </div>
          );
        })()}

        <ImageAccordion title={t(lang, "room.wifiTitle")} icon="" imageUrl={imgWifi} voiceKey="room_wifi" lang={lang}>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="text-xs font-bold text-yellow-700 mb-1">Network</div>
            <div className="text-xl font-black text-black mb-3">{p.wifi.ssid}</div>
            <div className="text-sm font-medium text-neutral-700 leading-relaxed">
              {p.wifi.instructions}
            </div>
          </div>
        </ImageAccordion>

        <ImageAccordion title={t(lang, "room.cleaning")} icon="" imageUrl={imgCleaning} voiceKey="room_cleaning" lang={lang}>
          <div className="space-y-4">
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
              <p className="text-sm text-neutral-600 font-medium leading-relaxed">
                {t(lang, "cleaning_1")}
              </p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
              <p className="text-sm text-neutral-600 font-medium leading-relaxed">
                {t(lang, "cleaning_2")}
              </p>
            </div>
          </div>
        </ImageAccordion>

        <ImageAccordion title={t(lang, "room.amenitiesTitle")} icon="" imageUrl={imgAmenities} voiceKey="room_amenities" lang={lang}>
          <div className="space-y-4">
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
              <p className="text-sm text-neutral-600 font-medium leading-relaxed">
                {p.amenities}
              </p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
              <div className="text-xs font-medium text-neutral-500 mb-1">Climate control</div>
              <p className="text-sm text-neutral-800 font-bold">
                {p.acInfo}
              </p>
            </div>
          </div>
        </ImageAccordion>

        <ImageAccordion title={t(lang, "room.comfortTitle")} icon="" imageUrl={imgAc} voiceKey="room_comfort" lang={lang}>
          <div className="space-y-4">
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 text-sm font-medium leading-relaxed text-neutral-600">
              {t(lang, "room.comfortText")}
            </div>
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
              <div className="text-xs font-medium text-red-400 mb-1">Safety & rules</div>
              <div className="text-xs font-bold text-red-700">No smoking inside. Keep it quiet after 22:00.</div>
            </div>
          </div>
        </ImageAccordion>

      </div>

      <StickyAction lang={lang} onClick={() => window.location.href = `tel:${pack.profile.phoneDial}`} />
    </div>
  );
}

function NeighborhoodView({ pack, lang, onBack }: any) {
  const p = pack.profile.area;

  // Use image slots with fallback
  const [heroUrl, setHeroUrl] = useState('/hero_paris_v2.png');
  const [imgTransport, setImgTransport] = useState('/hero_paris_v2.png');
  const [imgDining, setImgDining] = useState('/hero_paris_v2.png');
  const [imgEssentials, setImgEssentials] = useState('/hero_paris_v2.png');
  const [imgBikes, setImgBikes] = useState('/hero_paris_v2.png');

  useEffect(() => {
    Promise.all([
      getImageForSlot(ImageSlot.AREA_HERO),
      getImageForSlot(ImageSlot.AREA_CARD_METRO),
      getImageForSlot(ImageSlot.AREA_CARD_PARTNERS),
      getImageForSlot(ImageSlot.AREA_CARD_GROCERY),
      getImageForSlot(ImageSlot.AREA_CARD_BIKES)
    ]).then(([hero, metro, partners, grocery, bikes]) => {
      setHeroUrl(hero);
      setImgTransport(metro);
      setImgDining(partners);
      setImgEssentials(grocery);
      setImgBikes(bikes);
    });
  }, []);

  const diningRef = useRef<HTMLDivElement>(null);
  const transportRef = useRef<HTMLDivElement>(null);
  const essentialsRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="h-full flex flex-col bg-[#F2F2F2] overflow-y-auto font-sans">
      <div className="relative h-[35vh] w-full shrink-0">
        <img src={heroUrl} className="h-full w-full object-cover" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F2F2F2] via-black/20 to-transparent" />
        <button onClick={onBack} className="absolute top-6 left-6 h-10 w-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white flex items-center justify-center shadow-lg hover:bg-black/40 transition-all z-20"><span className="text-xl pb-1">‹</span></button>
        <div className="absolute bottom-6 left-6 right-6">
          <div className="lge-tag text-[10px] mb-2 bg-[#2563EB] text-white border-none shadow-md">{t(lang, "neighborhood.coverSubtitle")}</div>
          <h2 className="lge-title text-4xl text-black drop-shadow-sm">{t(lang, "neighborhood.coverTitle")}</h2>
        </div>
      </div>

      <div className="px-6 space-y-4 pt-6 pb-24">
        <ImageAccordion title={t(lang, "neighborhood.dining")} icon="" imageUrl={imgDining} voiceKey="area_dining" lang={lang}>
          <div className="space-y-3">
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
              <div className="text-sm font-bold text-neutral-800 mb-1">{p.restaurants}</div>
              <div className="text-xs font-bold text-green-600">
                {p.discounts}
              </div>
            </div>
          </div>
        </ImageAccordion>

        <ImageAccordion title={t(lang, "neighborhood.transport")} icon="" imageUrl={imgTransport} voiceKey="area_transport" lang={lang}>
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
            <p className="text-sm text-neutral-600 font-medium leading-relaxed">
              {p.transport}
            </p>
          </div>
        </ImageAccordion>

        <ImageAccordion title={t(lang, "neighborhood.essentials")} icon="" imageUrl={imgEssentials} voiceKey="area_essentials" lang={lang}>
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
            <p className="text-sm text-neutral-600 font-medium leading-relaxed">
              {p.essentials}
            </p>
          </div>
        </ImageAccordion>
      </div>

      <StickyAction lang={lang} onClick={() => window.location.href = `tel:${pack.profile.phoneDial}`} />
    </div>
  );
}

function ListView({ pack, lang, categoryId, onBack, onOpenDetail }: any) {
  const cat = pack.categories.find((c: any) => c.id === categoryId);
  const items = pack.guides.filter((g: any) => g.categoryId === categoryId);
  const heroUrl = resolveImageSrc(pack.media, cat?.heroImage);

  return (
    <div className="h-full flex flex-col bg-[#F8F9FA] overflow-hidden font-sans">
      <div className="relative h-[35vh] bg-black">
        <img src={heroUrl || ""} className="w-full h-full object-cover opacity-80" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <button onClick={onBack} className="absolute top-6 left-6 h-12 w-12 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-white flex items-center justify-center shadow-lg hover:bg-white/30 transition-all z-20"><span className="text-2xl mt-[-2px]">‹</span></button>
        <div className="absolute bottom-8 left-8 right-8">
          <div className="lge-tag mb-2 bg-[#FFE400] text-black">{t(lang, "guide_label")}</div>
          <h2 className="lge-title text-5xl text-white drop-shadow-lg leading-none">{cat?.id === 'neighborhood' ? 'Explore Paris' : t(lang, cat?.titleKey || "")}</h2>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-10 space-y-4 pb-24">
        {items.length > 0 ? items.map((g: any) => {
          const itemHero = resolveImageSrc(pack.media, g.heroImage);
          return (
            <button
              key={g.id}
              onClick={() => onOpenDetail(g.id)}
              className="relative h-[160px] w-full text-left rounded-2xl overflow-hidden shadow-sm active:scale-[0.98] transition-all group"
            >
              <img src={itemHero || heroUrl || ""} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-8 right-8">
                <div className="text-xl font-bold text-white drop-shadow-md leading-tight" style={{ fontFamily: '"Rubik", sans-serif' }}>
                  {t(lang, g.titleKey)}
                </div>
              </div>
            </button>
          );
        }) : (
          <div className="text-center py-20 text-neutral-400 font-bold italic">
            Check back soon for more guides.
          </div>
        )}
      </div>
    </div>
  );
}

function DetailView({ pack, lang, guideId, onBack }: any) {
  const guide = pack.guides.find((g: any) => g.id === guideId);
  if (!guide) return null;

  if (guideId === "breakfast") {
    return <BreakfastCard lang={lang} onBack={onBack} />;
  }

  const heroUrl = resolveImageSrc(pack.media, guide.heroImage);

  return (
    <div className="h-full flex flex-col bg-[#F2F2F2] overflow-hidden font-sans">
      <div className="relative h-[40vh] bg-black shrink-0">
        <img src={heroUrl || ""} className="w-full h-full object-cover" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F2F2F2] via-black/30 to-transparent" />
        <button onClick={onBack} className="absolute top-6 left-6 h-10 w-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white flex items-center justify-center shadow-lg hover:bg-black/40 transition-all z-20"><span className="text-xl pb-1">‹</span></button>
        <div className="absolute bottom-10 left-8 right-8">
          <h2 className="text-4xl font-semibold tracking-tight text-white drop-shadow-lg leading-tight" style={{ fontFamily: '"Rubik", sans-serif' }}>
            {t(lang, guide.titleKey)}
          </h2>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-8 space-y-8 pb-32">
        <div className="space-y-6">
          {guide.steps.map((s: string, idx: number) => (
            <div key={idx} className="flex gap-6 items-start">
              <div className="w-10 h-10 rounded-xl bg-black text-[#FFE400] flex items-center justify-center font-bold text-lg shrink-0 shadow-lg">{idx + 1}</div>
              <p className="text-lg font-medium text-neutral-800 leading-relaxed pt-1">{t(lang, s)}</p>
            </div>
          ))}
        </div>

        <div className="p-8 bg-white border border-neutral-100 rounded-[2rem] text-center shadow-sm">
          <div className="text-xs font-bold text-neutral-400 mb-6">{t(lang, "direct_support")}</div>
          <button
            onClick={() => window.location.href = `tel:${pack.profile.phoneDial}`}
            className="w-full h-16 rounded-full bg-black text-white font-bold text-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <span className="w-8 h-8 rounded-full bg-[#FFE400] text-black flex items-center justify-center text-xs">📞</span>
            {t(lang, "dial_button").split('|')[0]}
          </button>
        </div>
      </div>
    </div>
  );
}

function EventsListView({ pack, lang, mode, onBack, onSetMode }: any) {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const filteredEvents = pack.events.filter((ev: any) => ev.dayTag === mode);

  // Use image slots with fallback
  const [heroUrl, setHeroUrl] = useState('/hero_events_v2.png');
  const [defaultEventImage, setDefaultEventImage] = useState('/hero_events_v2.png');

  useEffect(() => {
    Promise.all([
      getImageForSlot(ImageSlot.EVENTS_HERO),
      getImageForSlot(ImageSlot.EVENTS_DEFAULT)
    ]).then(([hero, defaultImg]) => {
      setHeroUrl(hero);
      setDefaultEventImage(defaultImg);
    });
  }, []);

  return (
    <div className="h-full flex flex-col bg-[#F8F9FA] overflow-y-auto font-sans pb-24">
      {/* A) HEADER */}
      <div className="relative h-[35vh] w-full shrink-0">
        <img
          src={heroUrl}
          alt="Events at Le Grand Éclipse"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8F9FA] via-black/20 to-transparent" />
        <button onClick={onBack} className="absolute top-6 left-6 h-10 w-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white flex items-center justify-center shadow-lg hover:bg-black/40 transition-all z-20"><span className="text-xl pb-1">‹</span></button>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="inline-block px-3 py-1 rounded-full bg-[#43D3A0] text-xs font-bold text-black mb-3 shadow-md">
            {t(lang, "events.coverSubtitle")}
          </div>
          <h2 className="lge-title text-4xl text-black drop-shadow-sm">{t(lang, "events_title")}</h2>
        </div>
      </div>

      {/* B) MODE TOGGLE */}
      <div className="px-6 pb-2 pt-6">
        <div className="p-1 bg-neutral-200 rounded-xl flex gap-1">
          <button onClick={() => onSetMode("today")} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${mode === 'today' ? 'bg-white shadow-sm text-black' : 'text-neutral-500 hover:text-black'}`}>
            {t(lang, "events_today")}
          </button>
          <button onClick={() => onSetMode("week")} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${mode === 'week' ? 'bg-white shadow-sm text-black' : 'text-neutral-500 hover:text-black'}`}>
            {t(lang, "events_week")}
          </button>
        </div>
      </div>

      <div className="px-6 pb-20">
        <div className="mb-6">
          <h3 className="text-xl font-semibold tracking-tight text-neutral-800 mb-4" style={{ fontFamily: '"Rubik", sans-serif' }}>
            {mode === 'today' ? t(lang, "events.today") : t(lang, "events.week")}
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {filteredEvents.length > 0 ? filteredEvents.map((ev: any) => {
              const imgUrl = resolveImageSrc(pack.media, ev.image);
              return (
                <button
                  key={ev.id}
                  onClick={() => setSelectedEvent(ev)}
                  className="w-full relative h-[180px] text-left rounded-2xl overflow-hidden shadow-sm active:scale-[0.98] transition-all group"
                >
                  <img src={imgUrl || defaultEventImage} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute bottom-5 left-6 right-6">
                    <div className="text-xs font-bold text-white/90 mb-1">{ev.startTime} • {ev.location[lang] || ev.location.en}</div>
                    <div className="text-2xl font-semibold text-white drop-shadow-md leading-tight" style={{ fontFamily: '"Rubik", sans-serif' }}>
                      {ev.title[lang] || ev.title.en}
                    </div>
                  </div>
                </button>
              );
            }) : (
              <div className="text-center py-12 text-neutral-400 font-medium italic">
                {t(lang, "events.empty")}
              </div>
            )}
          </div>
        </div>
      </div>

      <StickyAction lang={lang} onClick={() => window.location.href = `tel:${pack.profile.phoneDial}`} />

      {/* DETAIL MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-[400px] bg-white rounded-[3rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-500 flex flex-col max-h-[85vh]">
            <div className="relative h-64 shrink-0">
              <img
                src={resolveImageSrc(pack.media, selectedEvent.image) || ""}
                alt={selectedEvent.title[lang] || selectedEvent.title.en}
                className="h-full w-full object-cover"
              />
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-6 right-6 h-10 w-10 rounded-full bg-black/50 backdrop-blur text-white flex items-center justify-center text-xl font-bold active:scale-90 transition-all"
              >
                ✕
              </button>
            </div>
            <div className="p-10 overflow-y-auto">
              <div className="text-neutral-500 font-bold text-xs mb-2">{selectedEvent.startTime} • {selectedEvent.location[lang] || selectedEvent.location.en}</div>
              <h3 className="text-4xl font-semibold tracking-tight leading-none mb-6" style={{ fontFamily: '"Rubik", sans-serif' }}>{selectedEvent.title[lang] || selectedEvent.title.en}</h3>

              <p className="text-neutral-600 font-medium leading-relaxed mb-10 text-lg">
                {selectedEvent.description?.[lang] || selectedEvent.description?.en || "Join us for an amazing community event at Le Grand Éclipse. Meeting new people and having fun is what we do best."}
              </p>

              <button
                onClick={openLGEAppLink}
                className="w-full h-16 rounded-full bg-black text-white font-bold text-sm shadow-xl active:scale-95 transition-all"
              >
                {t(lang, "events.viewAll")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   APP MAIN
   ========================================================= */

export default function App() {
  // Initialize config service with DEFAULT_PACK
  useEffect(() => {
    setDefaultConfig(DEFAULT_PACK);
  }, []);

  useEffect(() => {
    // Force clear the "Stay Comfortably" slot to fix persistent old image
    clearSlotOverride(ImageSlot.ROOM_CARD_AC);
  }, []);

  const [pack, setPack] = useState<HotelPack>(() => {
    // Try to load from config service, fall back to default
    try {
      setDefaultConfig(DEFAULT_PACK);
      return loadConfig();
    } catch {
      return DEFAULT_PACK;
    }
  });

  const [lang, setLang] = useState<Lang>(() => safeLang(localStorage.getItem(LANG_STORAGE_KEY)));

  useEffect(() => {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  }, [lang]);

  // QR Code Detection (Phase 4: Silent context setting)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const qrData = params.get('qr');

      if (qrData) {
        try {
          const decoded = atob(qrData);
          const context = JSON.parse(decoded) as RoomContext;

          // Validate context
          if (context && context.hotelId) {
            setActiveContext(context);
            console.log('[QR] Context set:', context);
          } else {
            console.warn('[QR] Invalid context structure');
          }
        } catch (error) {
          console.warn('[QR] Failed to parse QR data, ignoring');
        }

        // Clean URL (remove QR param silently)
        const cleanUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, '', cleanUrl);
      }
    } catch (error) {
      console.error('[QR] Error in QR detection:', error);
    }
  }, []);

  const tt = useMemo(() => {
    return (key: string) => t(lang, key);
  }, [lang]);

  const [room, setRoom] = useState<string>(() => localStorage.getItem(LS_LAST_ROOM) || "420");
  const [routeStack, setRouteStack] = useState<Route[]>([{ name: "welcome" }]);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [pinError, setPinError] = useState(false);

  const route = routeStack[routeStack.length - 1];

  useEffect(() => { localStorage.setItem(LS_PACK, JSON.stringify(pack)); }, [pack]);
  useEffect(() => { localStorage.setItem(LS_LANG, lang); }, [lang]);
  useEffect(() => { localStorage.setItem(LS_LAST_ROOM, room); }, [room]);

  // Always guest flow - student context has been removed

  const push = (r: Route) => setRouteStack(s => [...s, r]);
  const pop = () => setRouteStack(s => s.length > 1 ? s.slice(0, -1) : s);

  const navigate = (r: string, p?: any) => {
    if (r === "list") push({ name: "list", categoryId: p.category });
    else if (r === "ask") push({ name: "ask" });
    else if (r === "admin") push({ name: "admin" });
    else if (r === "welcome") setRouteStack([{ name: "welcome" }]);
    else if (r === "events-list") push({ name: "events-list", mode: p?.mode || "today" });
  };

  const handlePinSubmit = () => {
    if (adminPin === "2026") {
      setIsAdminModalOpen(false);
      setAdminPin("");
      navigate("admin");
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 500);
      setAdminPin("");
    }
  };

  const filteredCategories = useMemo(() => {
    return pack.categories.filter(c => {
      const id = c.id.toLowerCase();
      return !id.includes("magic") && !id.includes("postcard") && !id.includes("image");
    });
  }, [pack.categories]);

  if (route.name === "admin") {
    return <AdminShell onExit={() => navigate("welcome")} />;
  }

  return (
    <PhoneStage>

      {route.name === "welcome" && (
        <>
          <WelcomeScreen
            hotelName={pack.profile.hotelName}
            hotelSubtitle={pack.profile.cityLabel}
            lang={lang}
            setLang={setLang}
            navigate={navigate}
            heroUrl={resolveImageSrc(pack.media, { kind: "key", key: "hero_paris" }) || undefined}
            onAdminRequest={() => setIsAdminModalOpen(true)}
          />
          <div style={{ position: "absolute", top: 16, right: 16, zIndex: 50 }}>
            <LanguageDropdown lang={lang} onChange={setLang} />
          </div>
        </>
      )}
      {route.name === "list" && route.categoryId === "hub" && (
        <HubView pack={pack} lang={lang} onBack={pop} />
      )}
      {route.name === "list" && route.categoryId === "room" && (
        <RoomView pack={pack} lang={lang} onBack={pop} />
      )}
      {route.name === "list" && route.categoryId === "neighborhood" && (
        <NeighborhoodView pack={pack} lang={lang} onBack={pop} />
      )}
      {route.name === "list" && route.categoryId !== "hub" && route.categoryId !== "room" && route.categoryId !== "neighborhood" && (
        <ListView pack={pack} lang={lang} categoryId={route.categoryId} onBack={pop} onOpenDetail={(id: string) => push({ name: "detail", guideId: id })} />
      )}
      {route.name === "detail" && <DetailView pack={pack} lang={lang} guideId={route.guideId} onBack={pop} />}
      {route.name === "events-list" && (
        <EventsListView
          pack={pack}
          lang={lang}
          mode={route.mode}
          onBack={pop}
          onSetMode={(m: "today" | "week") => {
            setRouteStack(s => {
              const next = [...s];
              next[next.length - 1] = { ...next[next.length - 1], mode: m } as any;
              return next;
            });
          }}
        />
      )}
      {route.name === "ask" && (
        <ConciergeScreen
          onBack={pop}
          lang={lang}
          t={tt}
          pack={pack}
          onNavigate={(target) => {
            if (target === 'events') push({ name: 'events-list', mode: 'today' });
            else if (target === 'ask') push({ name: 'list', categoryId: 'help' });
            else pop();
          }}
        />
      )}
      {route.name === "admin" && (
        <AdminHub pack={pack} setPack={setPack} lang={lang} onExit={() => setRouteStack([{ name: "welcome" }])} />
      )}

      {/* Admin Security Modal */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-6">
          <div className={`w-full max-w-[320px] bg-white rounded-[2.5rem] p-10 shadow-2xl transition-transform ${pinError ? 'animate-shake' : ''}`}>
            <h2 className="text-2xl font-black uppercase tracking-tight text-center mb-6">Admin Access</h2>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={adminPin}
              autoFocus
              onChange={(e) => setAdminPin(e.target.value)}
              placeholder="••••"
              className="w-full text-center text-4xl tracking-[0.5em] font-black border-b-4 border-black outline-none pb-2 mb-8"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setIsAdminModalOpen(false); setAdminPin(""); }}
                className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400"
              >
                Cancel
              </button>
              <button
                onClick={handlePinSubmit}
                className="flex-1 py-4 bg-black text-[#FFE400] rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}} />
    </PhoneStage>
  );
}

function LanguageDropdown({
  lang,
  onChange,
}: {
  lang: Lang;
  onChange: (l: Lang) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="h-11 px-4 py-2 bg-white/95 backdrop-blur-sm border-2 border-black rounded-full font-bold text-sm uppercase tracking-widest shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        aria-label="Change language"
      >
        <span>{LANG_SHORT[lang]}</span>
        <span style={{ opacity: 0.7 }}>▼</span>
      </button>

      {open && (
        <div
          className="absolute right-0 top-[calc(100%+12px)] w-48 bg-white border-2 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] overflow-hidden z-[100] animate-reveal"
        >
          {(Object.keys(LANG_LABELS) as Lang[]).map((l) => {
            const active = l === lang;
            return (
              <button
                key={l}
                type="button"
                onClick={() => {
                  onChange(l);
                  setOpen(false);
                }}
                className={`w-full text-left px-6 py-4 font-bold text-sm uppercase tracking-wide border-b border-black/5 last:border-0 transition-colors ${active ? 'bg-[#FFE400] text-black' : 'hover:bg-neutral-50'}`}
              >
                {LANG_LABELS[l]}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
