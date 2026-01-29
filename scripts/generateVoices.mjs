// Voice Generation Script for ElevenLabs — EN/FR Only
// Run this once to pre-generate all concierge voice files
// Usage: node scripts/generateVoices.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Rachel - warm female voice
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'voice');

// ═══════════════════════════════════════════════════════════════════════════
// VOICE SCRIPTS — EN/FR Only, Parisian Luxury Hotel Standards
// French: Sophisticated, professional, warm but refined
// ═══════════════════════════════════════════════════════════════════════════

const VOICE_SCRIPTS = {
    // === WELCOME & SELECTION ===
    'welcome': {
        en: "Welcome to Le Grand Éclipse. I'll be your digital concierge, here to help you feel at home. Whenever you're ready, I can guide you through everything you need.",
        fr: "Bienvenue au Grand Éclipse. Je serai votre concierge digitale, à votre disposition pour vous accompagner tout au long de votre séjour. Je suis là dès que vous êtes prêt."
    },

    // === GUEST PATH ===
    'guest_ask_first_time': {
        en: "Lovely. Welcome. Is this your first time staying at Le Grand Éclipse, or have you stayed with us before?",
        fr: "Enchanté. Est-ce votre première visite au Grand Éclipse, ou nous connaissez-vous déjà ?"
    },

    'guest_first_time_confirm': {
        en: "Great choice. Le Grand Éclipse is a bit different — part hotel, part community. I'll show you the important things first.",
        fr: "Excellent choix. Le Grand Éclipse est un établissement singulier — à la fois hôtel et lieu de vie. Permettez-moi de vous présenter l'essentiel."
    },

    'guest_returning_confirm': {
        en: "Welcome back. Let's find what you need.",
        fr: "Heureux de vous revoir. Voyons comment je puis vous être utile."
    },

    // === GUEST TOPIC INTROS ===
    'guest_topic_room': {
        en: "Here's what to know about your stay, from cleaning to WiFi.",
        fr: "Voici les informations essentielles concernant votre chambre : entretien, connexion Wi-Fi et équipements."
    },

    'guest_topic_breakfast': {
        en: "Breakfast is vital. Here's how it works.",
        fr: "Le petit-déjeuner est un moment privilégié. Voici comment en profiter."
    },

    'guest_topic_facilities': {
        en: "Check out our 24/7 gym, laundry, and the pool when it's open.",
        fr: "Découvrez notre centre fitness accessible 24h/24, notre buanderie et notre piscine."
    },

    'guest_topic_shop': {
        en: "Our boutique is open for daily essentials and exclusive items.",
        fr: "Notre boutique vous propose l'essentiel du quotidien et des articles exclusifs."
    },

    'guest_topic_events': {
        en: "Here's what's happening around the hub.",
        fr: "Voici les événements de la semaine."
    },

    'guest_topic_area': {
        en: "Here's what's nearby in the neighborhood.",
        fr: "Découvrez nos recommandations dans le quartier."
    },

    // === NEW LUXURY TOPIC INTROS ===
    'guest_topic_spa': {
        en: "Indulge in our signature spa treatments. Pure relaxation awaits.",
        fr: "Offrez-vous un moment de bien-être avec nos soins signature. La sérénité vous attend."
    },

    'guest_topic_gym': {
        en: "Our 24/7 fitness center has everything you need. Let me show you.",
        fr: "Notre centre de remise en forme, accessible 24h/24, dispose de tous les équipements nécessaires. Permettez-moi de vous le présenter."
    },

    'guest_topic_dining': {
        en: "Experience culinary excellence at L'Éclipse Restaurant. Seasonal French cuisine awaits.",
        fr: "Découvrez l'excellence gastronomique du Restaurant L'Éclipse. Une cuisine française de saison aux accents contemporains."
    },

    // === IDLE/BACK NAVIGATION (12 variations for natural feel) ===
    'idle_1': {
        en: "No worries — take your time.",
        fr: "Prenez tout votre temps."
    },

    'idle_2': {
        en: "I'm right here if you need me.",
        fr: "Je reste à votre disposition."
    },

    'idle_3': {
        en: "Happy to help whenever you're ready.",
        fr: "Je suis là dès que vous êtes prêt."
    },

    'idle_4': {
        en: "There's plenty to explore.",
        fr: "Il y a tant à découvrir."
    },

    'idle_5': {
        en: "Let me know what you'd like to look at next.",
        fr: "N'hésitez pas à me solliciter."
    },

    'idle_6': {
        en: "You can always come back to this later.",
        fr: "Vous pourrez y revenir quand vous le souhaiterez."
    },

    'idle_7': {
        en: "Everything you need is just a tap away.",
        fr: "Tout est à portée de main."
    },

    'idle_8': {
        en: "Feel free to take a look around.",
        fr: "Explorez à votre rythme."
    },

    'idle_9': {
        en: "I've got you — where to next?",
        fr: "Où souhaitez-vous vous rendre à présent ?"
    },

    'idle_10': {
        en: "All good. Let's keep going.",
        fr: "Très bien, poursuivons."
    },

    'idle_11': {
        en: "You're doing great, take it easy.",
        fr: "Prenez votre temps, vraiment."
    },

    'idle_12': {
        en: "Whenever you're ready, I'm here.",
        fr: "Je reste avec vous."
    },

    // === MAIN MENU CARD VOICES (3 variants each) ===
    'card_hub_facilities_1': {
        en: "This is where the community comes together — let's take a look.",
        fr: "C'est ici que tout se passe — permettez-moi de vous faire visiter."
    },
    'card_hub_facilities_2': {
        en: "Let me show you our favorite shared spaces.",
        fr: "Découvrez nos espaces communs les plus appréciés."
    },
    'card_hub_facilities_3': {
        en: "These are the spots where everyone hangs out.",
        fr: "Ce sont les lieux de rendez-vous de nos clients."
    },

    'card_hub_food_drinks_1': {
        en: "Good food, good moments — here's what's available.",
        fr: "Gastronomie et convivialité — voici notre offre."
    },
    'card_hub_food_drinks_2': {
        en: "Let's explore the food and drink options.",
        fr: "Permettez-moi de vous présenter nos options de restauration."
    },
    'card_hub_food_drinks_3': {
        en: "Time to check out what's cooking.",
        fr: "Découvrez ce que nous vous avons préparé."
    },

    'card_hub_shop_1': {
        en: "From essentials to exclusive items — all the good stuff.",
        fr: "De l'essentiel aux pièces exclusives — le meilleur vous attend."
    },
    'card_hub_shop_2': {
        en: "Our boutique has everything you need.",
        fr: "Notre boutique a tout ce qu'il vous faut."
    },
    'card_hub_shop_3': {
        en: "Check out what's in store today.",
        fr: "Découvrez notre sélection du jour."
    },

    'card_room_wifi_1': {
        en: "Everything you need to stay connected, right here.",
        fr: "Tout ce qu'il vous faut pour rester connecté."
    },
    'card_room_wifi_2': {
        en: "Let's get you online.",
        fr: "Permettez-moi de vous connecter."
    },
    'card_room_wifi_3': {
        en: "Here's how the WiFi works.",
        fr: "Voici comment fonctionne notre connexion Wi-Fi."
    },

    'card_room_cleaning_1': {
        en: "Keeping your space fresh and comfortable.",
        fr: "Pour un espace toujours impeccable."
    },
    'card_room_cleaning_2': {
        en: "Here's how cleaning works.",
        fr: "Voici l'organisation de notre service d'entretien."
    },
    'card_room_cleaning_3': {
        en: "Let me explain the housekeeping schedule.",
        fr: "Permettez-moi de vous expliquer notre programme d'entretien."
    },

    'card_room_amenities_1': {
        en: "All the little things that make it feel like home.",
        fr: "Tous ces petits détails qui font la différence."
    },
    'card_room_amenities_2': {
        en: "Here's what's in your room.",
        fr: "Voici les équipements de votre chambre."
    },
    'card_room_amenities_3': {
        en: "Let me show you the amenities.",
        fr: "Découvrez nos équipements."
    },

    'card_room_comfort_1': {
        en: "Everything to feel at home, right here.",
        fr: "Tout pour vous sentir comme chez vous."
    },
    'card_room_comfort_2': {
        en: "Making your stay comfortable.",
        fr: "Pour un séjour des plus agréables."
    },
    'card_room_comfort_3': {
        en: "Here's what you need to know.",
        fr: "Voici les informations essentielles."
    },

    'card_area_dining_1': {
        en: "Great spots just around the corner — local favorites.",
        fr: "Nos meilleures adresses du quartier."
    },
    'card_area_dining_2': {
        en: "Here are the best places to eat nearby.",
        fr: "Voici nos recommandations gastronomiques."
    },
    'card_area_dining_3': {
        en: "Let me show you where locals go.",
        fr: "Découvrez les adresses privilégiées des Parisiens."
    },

    'card_area_transport_1': {
        en: "Getting around is easy — here's how.",
        fr: "Se déplacer est un jeu d'enfant — voici comment."
    },
    'card_area_transport_2': {
        en: "Let me explain the transport options.",
        fr: "Permettez-moi de vous présenter les options de transport."
    },
    'card_area_transport_3': {
        en: "Here's how to move around the city.",
        fr: "Voici comment circuler dans Paris."
    },

    'card_area_essentials_1': {
        en: "Everything you might need, close by.",
        fr: "Tout ce dont vous pourriez avoir besoin, à proximité."
    },
    'card_area_essentials_2': {
        en: "Here's what's nearby.",
        fr: "Voici les commerces à proximité."
    },
    'card_area_essentials_3': {
        en: "The essentials are all around you.",
        fr: "L'essentiel est à deux pas."
    },

    'card_front_desk_1': {
        en: "Please dial nine from your room phone to reach the front desk. Our team will be happy to assist you with anything you need.",
        fr: "Veuillez composer le 9 depuis le téléphone de votre chambre pour joindre la Réception. Notre équipe se fera un plaisir de vous assister."
    },
    'card_front_desk_2': {
        en: "Need help? Just dial nine from your room. We're here for you twenty-four seven.",
        fr: "Besoin d'assistance ? Composez le 9. Nous sommes à votre disposition 24h/24."
    },
    'card_front_desk_3': {
        en: "Our front desk is always here. Dial nine from your room phone anytime.",
        fr: "Notre Réception est toujours à votre écoute. Composez le 9 à tout moment."
    },

    // === NEW LUXURY FEATURE CARDS ===
    'card_spa_treatments_1': {
        en: "Book our 90-minute Grand Éclipse Journey — a full-body massage with hot stones and essential oils. Pure indulgence.",
        fr: "Réservez notre Voyage Grand Éclipse de 90 minutes — un massage corps entier aux pierres chaudes et huiles essentielles. Un moment de pure indulgence."
    },
    'card_spa_treatments_2': {
        en: "Our spa team creates personalized wellness experiences. Let them take care of you.",
        fr: "Notre équipe spa conçoit des expériences bien-être sur mesure. Laissez-vous choyer."
    },
    'card_spa_treatments_3': {
        en: "From aromatherapy to deep tissue massage — find your perfect treatment.",
        fr: "De l'aromathérapie au massage profond — trouvez le soin qui vous convient."
    },

    'card_gym_equipment_1': {
        en: "Technogym cardio machines, strength training stations, Peloton bikes, and a TRX zone. Towels and water provided.",
        fr: "Équipements Technogym, stations de musculation, vélos Peloton et zone TRX. Serviettes et eau à disposition."
    },
    'card_gym_equipment_2': {
        en: "Our fitness center has everything for your workout. Personal trainers available on request.",
        fr: "Notre centre fitness dispose de tout le nécessaire. Coachs personnels sur demande."
    },
    'card_gym_equipment_3': {
        en: "State-of-the-art equipment awaits. Access with your room key, 24/7.",
        fr: "Des équipements de pointe vous attendent. Accès 24h/24 avec votre clé de chambre."
    },

    'card_restaurant_1': {
        en: "Dinner at L'Éclipse Restaurant. Tasting menu 95 euros, à la carte available. Reservations recommended.",
        fr: "Dîner au Restaurant L'Éclipse. Menu dégustation 95 euros, à la carte disponible. Réservation conseillée."
    },
    'card_restaurant_2': {
        en: "Seasonal French cuisine with a modern twist. Our Michelin-trained chef creates magic every evening.",
        fr: "Cuisine française de saison revisitée. Notre chef étoilé crée la magie chaque soir."
    },
    'card_restaurant_3': {
        en: "Le Bar Céleste offers craft cocktails and small plates. Open from 5 PM. Live jazz on Fridays.",
        fr: "Le Bar Céleste propose cocktails artisanaux et petites assiettes. Ouvert dès 17h. Jazz live le vendredi."
    }
};

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function generateVoice(text, language, outputFileName) {
    console.log(`Generating: ${outputFileName}...`);

    try {
        const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
            {
                method: 'POST',
                headers: {
                    'xi-api-key': ELEVENLABS_API_KEY,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    model_id: 'eleven_multilingual_v2',
                    voice_settings: {
                        stability: 0.5,           // Balance between consistency and expressiveness
                        similarity_boost: 0.75,   // Voice similarity to original
                        style: 0.5,               // Natural speaking style
                        use_speaker_boost: true   // Enhance clarity
                    }
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`ElevenLabs API error ${response.status}: ${errorText}`);
        }

        const audioBuffer = await response.arrayBuffer();
        const outputPath = path.join(OUTPUT_DIR, outputFileName);

        fs.writeFileSync(outputPath, Buffer.from(audioBuffer));
        console.log(`✓ Saved: ${outputFileName}`);

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
        console.error(`✗ Failed: ${outputFileName}`, error.message);
    }
}

async function generateAllVoices() {
    console.log('🎤 Starting ElevenLabs voice generation (EN/FR only)...\n');
    console.log(`Using voice: Rachel (${VOICE_ID})`);
    console.log(`Output directory: ${OUTPUT_DIR}\n`);

    let totalGenerated = 0;

    for (const [scriptId, languages] of Object.entries(VOICE_SCRIPTS)) {
        console.log(`\nGenerating script: ${scriptId}`);

        for (const [lang, text] of Object.entries(languages)) {
            const fileName = `${scriptId}_${lang}.mp3`;
            await generateVoice(text, lang, fileName);
            totalGenerated++;
        }
    }

    console.log(`\n✅ Generation complete! Created ${totalGenerated} voice files.`);
    console.log(`📁 Files saved to: ${OUTPUT_DIR}`);
}

// Check API key
if (!ELEVENLABS_API_KEY) {
    console.error('❌ Error: ELEVENLABS_API_KEY not found in .env file');
    process.exit(1);
}

// Run generation
generateAllVoices().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
});
