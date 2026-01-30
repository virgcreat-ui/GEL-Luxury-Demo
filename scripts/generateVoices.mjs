// Voice Generation Script for ElevenLabs — EN/FR Only
// Pure 5-Star Luxury Hotel Branding
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
// VOICE SCRIPTS — Pure 5-Star Luxury Hotel Branding
// Tone: Elegant, refined, discreet, sophisticated service
// ═══════════════════════════════════════════════════════════════════════════

const VOICE_SCRIPTS = {
    // === WELCOME & SELECTION ===
    'welcome': {
        en: "Welcome to Le Grand Éclipse. I am your personal digital concierge, here to ensure every moment of your stay is exceptional. Please allow me to guide you through our services and amenities at your convenience.",
        fr: "Bienvenue au Grand Éclipse. Je suis votre concierge digitale personnelle, à votre entière disposition pour rendre chaque instant de votre séjour exceptionnel. Permettez-moi de vous présenter nos services et nos prestations."
    },

    // === GUEST PATH ===
    'guest_ask_first_time': {
        en: "It is my pleasure to welcome you. Is this your first stay with us at Le Grand Éclipse, or do we have the honor of hosting you again?",
        fr: "C'est un plaisir de vous accueillir. Est-ce votre premier séjour au Grand Éclipse, ou avons-nous l'honneur de vous recevoir à nouveau ?"
    },

    'guest_first_time_confirm': {
        en: "We are delighted to have you as our guest. Allow me to introduce you to the refined elegance of Le Grand Éclipse. Our staff is at your service around the clock.",
        fr: "Nous sommes ravis de vous compter parmi nos hôtes. Permettez-moi de vous présenter l'élégance raffinée du Grand Éclipse. Notre personnel est à votre service jour et nuit."
    },

    'guest_returning_confirm': {
        en: "Welcome back. It is always a pleasure to see you again. How may I be of service?",
        fr: "Bon retour parmi nous. C'est toujours un plaisir de vous revoir. Comment puis-je vous être utile ?"
    },

    // === GUEST TOPIC INTROS ===
    'guest_topic_room': {
        en: "Allow me to present the essential details of your accommodations, from our attentive housekeeping service to our high-speed connectivity.",
        fr: "Permettez-moi de vous présenter les informations essentielles concernant votre chambre : notre service d'étage attentif et notre connexion haut débit."
    },

    'guest_topic_breakfast': {
        en: "Breakfast at Le Grand Éclipse is a refined experience. Allow me to share our culinary offerings and service hours.",
        fr: "Le petit-déjeuner au Grand Éclipse est une expérience raffinée. Permettez-moi de vous présenter nos offres gastronomiques et nos horaires de service."
    },

    'guest_topic_facilities': {
        en: "Le Grand Éclipse offers an array of premium amenities for your comfort and well-being. Allow me to present our facilities.",
        fr: "Le Grand Éclipse propose un ensemble de prestations premium pour votre confort et votre bien-être. Permettez-moi de vous les présenter."
    },

    'guest_topic_shop': {
        en: "Our boutique offers a curated selection of luxury essentials and exclusive items from the house of Le Grand Éclipse.",
        fr: "Notre boutique propose une sélection raffinée d'articles de luxe et de pièces exclusives signées Le Grand Éclipse."
    },

    'guest_topic_events': {
        en: "Discover the distinguished events and cultural experiences we have arranged for our guests this week.",
        fr: "Découvrez les événements distingués et les expériences culturelles que nous avons préparés pour nos hôtes cette semaine."
    },

    'guest_topic_area': {
        en: "Allow me to share our concierge recommendations for discovering the finest establishments in the neighborhood.",
        fr: "Permettez-moi de partager nos recommandations de concierge pour découvrir les meilleures adresses du quartier."
    },

    // === LUXURY FEATURE TOPIC INTROS ===
    'guest_topic_spa': {
        en: "Our spa sanctuary awaits. Indulge in our signature treatments designed to restore balance and serenity.",
        fr: "Notre sanctuaire spa vous attend. Offrez-vous nos soins signature conçus pour restaurer équilibre et sérénité."
    },

    'guest_topic_gym': {
        en: "Our private fitness center offers state-of-the-art equipment in an atmosphere of refined tranquility. Available exclusively for our guests, around the clock.",
        fr: "Notre centre de remise en forme privé propose des équipements de pointe dans une atmosphère de tranquillité raffinée. Réservé exclusivement à nos hôtes, 24 heures sur 24."
    },

    'guest_topic_dining': {
        en: "Experience the art of French gastronomy at Restaurant L'Éclipse. Our executive chef presents seasonal cuisine with distinctive elegance.",
        fr: "Découvrez l'art de la gastronomie française au Restaurant L'Éclipse. Notre chef exécutif présente une cuisine de saison d'une élégance distinctive."
    },

    // === IDLE/NAVIGATION (12 variations — refined, discreet) ===
    'idle_1': {
        en: "Please take all the time you need.",
        fr: "Prenez tout le temps qu'il vous faut."
    },

    'idle_2': {
        en: "I remain at your disposal.",
        fr: "Je reste à votre entière disposition."
    },

    'idle_3': {
        en: "I am here whenever you wish to continue.",
        fr: "Je suis là dès que vous le souhaitez."
    },

    'idle_4': {
        en: "There is much to discover during your stay.",
        fr: "Il y a tant à découvrir durant votre séjour."
    },

    'idle_5': {
        en: "Please let me know how I may assist you further.",
        fr: "N'hésitez pas à me faire part de vos souhaits."
    },

    'idle_6': {
        en: "You may return to this information at any time.",
        fr: "Vous pourrez consulter ces informations à tout moment."
    },

    'idle_7': {
        en: "All our services are at your fingertips.",
        fr: "Tous nos services sont à votre portée."
    },

    'idle_8': {
        en: "Please explore at your leisure.",
        fr: "Explorez à votre rythme."
    },

    'idle_9': {
        en: "What would you like to discover next?",
        fr: "Que souhaitez-vous découvrir à présent ?"
    },

    'idle_10': {
        en: "Very well. Shall we continue?",
        fr: "Très bien. Souhaitez-vous poursuivre ?"
    },

    'idle_11': {
        en: "Please take your time. I am at your service.",
        fr: "Prenez votre temps. Je suis à votre service."
    },

    'idle_12': {
        en: "I remain here for you.",
        fr: "Je reste à votre disposition."
    },

    // === FACILITIES CARDS (3 variants each) ===
    'card_hub_facilities_1': {
        en: "Allow me to present our distinguished amenities, designed for your comfort and well-being.",
        fr: "Permettez-moi de vous présenter nos prestations distinguées, conçues pour votre confort et votre bien-être."
    },
    'card_hub_facilities_2': {
        en: "Our facilities have been curated to exceed the expectations of our discerning guests.",
        fr: "Nos équipements ont été sélectionnés pour surpasser les attentes de nos hôtes les plus exigeants."
    },
    'card_hub_facilities_3': {
        en: "Experience the refined amenities that define the Le Grand Éclipse standard.",
        fr: "Découvrez les prestations raffinées qui définissent l'excellence du Grand Éclipse."
    },

    'card_hub_food_drinks_1': {
        en: "Our culinary offerings reflect our commitment to gastronomic excellence.",
        fr: "Notre offre gastronomique reflète notre engagement envers l'excellence culinaire."
    },
    'card_hub_food_drinks_2': {
        en: "Allow me to present our dining options, each crafted with exceptional care.",
        fr: "Permettez-moi de vous présenter nos options de restauration, chacune élaborée avec un soin exceptionnel."
    },
    'card_hub_food_drinks_3': {
        en: "Discover the culinary artistry that awaits you at Le Grand Éclipse.",
        fr: "Découvrez l'art culinaire qui vous attend au Grand Éclipse."
    },

    'card_hub_shop_1': {
        en: "Our boutique presents a curated collection of luxury items and travel essentials.",
        fr: "Notre boutique présente une collection raffinée d'articles de luxe et d'essentiels de voyage."
    },
    'card_hub_shop_2': {
        en: "Discover exclusive pieces bearing the Le Grand Éclipse signature.",
        fr: "Découvrez des pièces exclusives portant la signature Le Grand Éclipse."
    },
    'card_hub_shop_3': {
        en: "Our boutique awaits with distinguished selections.",
        fr: "Notre boutique vous attend avec des sélections distinguées."
    },

    // === ROOM CARDS ===
    'card_room_wifi_1': {
        en: "Seamless connectivity awaits. Our high-speed network ensures you remain connected in comfort.",
        fr: "Une connectivité parfaite vous attend. Notre réseau haut débit vous garantit une connexion confortable."
    },
    'card_room_wifi_2': {
        en: "Allow me to assist you with our complimentary high-speed connection.",
        fr: "Permettez-moi de vous assister avec notre connexion haut débit offerte."
    },
    'card_room_wifi_3': {
        en: "Connecting to our secure network is effortless. Here are the details.",
        fr: "La connexion à notre réseau sécurisé est simplissime. Voici les détails."
    },

    'card_room_cleaning_1': {
        en: "Our housekeeping team maintains the highest standards of elegance and cleanliness throughout your stay.",
        fr: "Notre équipe d'étage maintient les plus hauts standards d'élégance et de propreté durant votre séjour."
    },
    'card_room_cleaning_2': {
        en: "Allow me to explain our attentive housekeeping service.",
        fr: "Permettez-moi de vous expliquer notre service d'étage attentif."
    },
    'card_room_cleaning_3': {
        en: "Your comfort is our priority. Here is our housekeeping schedule.",
        fr: "Votre confort est notre priorité. Voici notre programme d'entretien."
    },

    'card_room_amenities_1': {
        en: "Your suite has been appointed with thoughtful touches for an exceptional stay.",
        fr: "Votre suite a été agrémentée d'attentions délicates pour un séjour exceptionnel."
    },
    'card_room_amenities_2': {
        en: "Discover the refined amenities awaiting you in your accommodations.",
        fr: "Découvrez les équipements raffinés qui vous attendent dans votre chambre."
    },
    'card_room_amenities_3': {
        en: "Allow me to present the comforts of your private retreat.",
        fr: "Permettez-moi de vous présenter les agréments de votre retraite privée."
    },

    'card_room_comfort_1': {
        en: "Every detail has been considered for your absolute comfort.",
        fr: "Chaque détail a été pensé pour votre confort absolu."
    },
    'card_room_comfort_2': {
        en: "Your well-being is our utmost concern.",
        fr: "Votre bien-être est notre préoccupation première."
    },
    'card_room_comfort_3': {
        en: "Please allow me to ensure your complete satisfaction.",
        fr: "Permettez-moi de veiller à votre entière satisfaction."
    },

    // === AREA CARDS ===
    'card_area_dining_1': {
        en: "Our concierge has curated the finest dining establishments in the neighborhood for your consideration.",
        fr: "Notre concierge a sélectionné les meilleurs établissements gastronomiques du quartier pour vous."
    },
    'card_area_dining_2': {
        en: "Allow me to share our preferred addresses for distinguished dining.",
        fr: "Permettez-moi de partager nos adresses privilégiées pour une table distinguée."
    },
    'card_area_dining_3': {
        en: "These exceptional restaurants have earned our personal recommendation.",
        fr: "Ces restaurants d'exception ont mérité notre recommandation personnelle."
    },

    'card_area_transport_1': {
        en: "Allow me to facilitate your travel arrangements throughout Paris.",
        fr: "Permettez-moi de faciliter vos déplacements dans Paris."
    },
    'card_area_transport_2': {
        en: "Private transfers and transport options are available at your request.",
        fr: "Des transferts privés et options de transport sont disponibles sur demande."
    },
    'card_area_transport_3': {
        en: "Our concierge service is pleased to arrange all your transportation needs.",
        fr: "Notre service de conciergerie se fera un plaisir d'organiser tous vos besoins en transport."
    },

    'card_area_essentials_1': {
        en: "Should you require anything, the finest establishments are within easy reach.",
        fr: "Si vous avez besoin de quoi que ce soit, les meilleurs établissements sont à proximité."
    },
    'card_area_essentials_2': {
        en: "Our neighborhood offers convenient access to essential services.",
        fr: "Notre quartier offre un accès pratique aux services essentiels."
    },
    'card_area_essentials_3': {
        en: "Everything you may need is close at hand.",
        fr: "Tout ce dont vous pourriez avoir besoin est à portée de main."
    },

    // === FRONT DESK ===
    'card_front_desk_1': {
        en: "Our reception team is available around the clock. Simply dial nine from your room telephone, and we shall attend to you immediately.",
        fr: "Notre équipe de réception est disponible en permanence. Composez simplement le 9 depuis le téléphone de votre chambre, et nous nous occuperons de vous immédiatement."
    },
    'card_front_desk_2': {
        en: "For any request, our reception is at your service twenty-four hours a day. Dial nine from your suite.",
        fr: "Pour toute demande, notre réception est à votre service vingt-quatre heures sur vingt-quatre. Composez le 9 depuis votre suite."
    },
    'card_front_desk_3': {
        en: "Your comfort is our privilege. Our reception team awaits your call at any hour.",
        fr: "Votre confort est notre privilège. Notre équipe de réception attend votre appel à toute heure."
    },

    // === SPA CARDS ===
    'card_spa_treatments_1': {
        en: "Experience our signature Grand Éclipse Journey — a ninety-minute ritual combining hot stone therapy and precious essential oils for complete restoration.",
        fr: "Découvrez notre rituel signature Le Voyage Grand Éclipse — un moment de quatre-vingt-dix minutes alliant lithothérapie aux pierres chaudes et huiles essentielles précieuses pour une restauration complète."
    },
    'card_spa_treatments_2': {
        en: "Our master therapists craft bespoke wellness experiences tailored to your individual needs. Surrender to their expert care.",
        fr: "Nos maîtres praticiens conçoivent des expériences bien-être sur mesure adaptées à vos besoins individuels. Abandonnez-vous à leurs soins experts."
    },
    'card_spa_treatments_3': {
        en: "From restorative facials to deep tissue massage — discover the treatment that speaks to your soul.",
        fr: "Des soins du visage régénérants aux massages profonds — découvrez le soin qui parle à votre âme."
    },

    // === GYM CARDS ===
    'card_gym_equipment_1': {
        en: "Our fitness sanctuary features Technogym excellence, Peloton cycling, and a dedicated stretching atelier. Fresh towels and artesian water are provided with our compliments.",
        fr: "Notre sanctuaire fitness propose l'excellence Technogym, le cycling Peloton et un atelier d'étirement dédié. Serviettes fraîches et eau artésienne vous sont offertes avec nos compliments."
    },
    'card_gym_equipment_2': {
        en: "Personal training sessions with our certified instructors are available upon request. Simply contact our concierge to arrange.",
        fr: "Des séances d'entraînement personnel avec nos instructeurs certifiés sont disponibles sur demande. Contactez simplement notre conciergerie pour organiser."
    },
    'card_gym_equipment_3': {
        en: "Exclusive twenty-four hour access with your suite key. The fitness center is reserved solely for our distinguished guests.",
        fr: "Accès exclusif vingt-quatre heures sur vingt-quatre avec votre clé de suite. Le centre de remise en forme est réservé exclusivement à nos hôtes distingués."
    },

    // === RESTAURANT CARDS ===
    'card_restaurant_1': {
        en: "Restaurant L'Éclipse presents our seven-course tasting menu at ninety-five euros, or dine à la carte. Reservations are kindly requested for this distinguished experience.",
        fr: "Le Restaurant L'Éclipse présente notre menu dégustation en sept services à quatre-vingt-quinze euros, ou dînez à la carte. Nous vous prions de bien vouloir réserver pour cette expérience distinguée."
    },
    'card_restaurant_2': {
        en: "Our executive chef presents seasonal French cuisine elevated to art. Each evening brings new inspiration from the finest local purveyors.",
        fr: "Notre chef exécutif présente une cuisine française de saison élevée au rang d'art. Chaque soir apporte une nouvelle inspiration des meilleurs producteurs locaux."
    },
    'card_restaurant_3': {
        en: "Le Bar Céleste invites you for artisanal cocktails and refined small plates from five in the evening. Friday evenings feature live jazz in an atmosphere of intimate sophistication.",
        fr: "Le Bar Céleste vous invite pour des cocktails artisanaux et des petites assiettes raffinées dès dix-sept heures. Les vendredis soir présentent du jazz live dans une atmosphère de sophistication intime."
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
    console.log('🎤 Starting ElevenLabs voice generation (EN/FR — Pure Luxury Branding)...\n');
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
