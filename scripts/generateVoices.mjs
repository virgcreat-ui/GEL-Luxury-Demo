// Voice Generation Script for ElevenLabs
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

// Voice scripts organized by ID and language
const VOICE_SCRIPTS = {
    // === WELCOME & SELECTION ===
    'welcome': {
        en: "Welcome to The Social Hub. I'll be your digital concierge, here to help you feel at home. Whenever you're ready, I can guide you through everything you need. To get started — are you staying with us as a hotel guest, or as a student?",
        fr: "Bienvenue à The Social Hub. Je serai votre concierge digitale, là pour vous aider à vous sentir chez vous. Quand vous voulez, je peux vous guider à chaque étape de votre séjour. Pour commencer — séjournez-vous chez nous en tant que client hôtel, ou étudiant ?",
        de: "Willkommen im The Social Hub. Ich bin Ihre digitale Concierge und helfe Ihnen gern, sich hier wohlzufühlen. Wenn Sie möchten, begleite ich Sie durch alles Wichtige. Zum Start — sind Sie bei uns als Hotelgast, oder als Student?",
        es: "Bienvenido a The Social Hub. Seré tu concierge digital, aquí para ayudarte a sentirte como en casa. Cuando quieras, te guiaré en todo lo que necesites. Para empezar — ¿te alojas con nosotros como huésped del hotel, o como estudiante?",
        it: "Benvenuto a The Social Hub. Sarò la tua concierge digitale, qui per farti sentire subito a casa. Quando vuoi, ti guiderò in tutto ciò di cui hai bisogno. Per iniziare — soggiorni con noi come ospite dell'hotel, o come studente?",
        pt: "Bem-vindo ao The Social Hub. Serei a sua concierge digital, aqui para o ajudar a sentir-se em casa. Sempre que quiser, posso guiá-lo em tudo o que precisar. Para começar — está connosco como hóspede do hotel, ou como estudante?"
    },

    // === STUDENT PATH ===
    'student_ask_first_time': {
        en: "Awesome. Welcome to your new home. Is this your first time staying with us, or have you already been around?",
        fr: "Génial. Bienvenue chez vous. C'est votre première fois ou vous connaissez déjà ?",
        de: "Super. Willkommen zuhause. Sind Sie zum ersten Mal hier oder kennen Sie sich schon aus?",
        es: "Genial. Bienvenido a tu nuevo hogar. ¿Es tu primera vez o ya has estado aquí?",
        it: "Fantastico. Benvenuto a casa. È la tua prima volta o ci conosci già?",
        pt: "Fantástico. Bem-vindo a casa. É a primeira vez ou já conhece?"
    },

    'student_first_time_confirm': {
        en: "Perfect. I'll help you with the essentials to get you started.",
        fr: "Parfait. Commençons par l'essentiel.",
        de: "Perfekt. Fangen wir mit dem Wichtigsten an.",
        es: "Perfecto. Empecemos por lo esencial.",
        it: "Perfetto. Iniziamo dall'essenziale.",
        pt: "Perfeito. Comecemos pelo essencial."
    },

    'student_onboarding_reminder': {
        en: "First things first — make sure you scan the room check QR code in your welcome documents within 48 hours. That helps us know everything is in good shape when you move in.",
        fr: "D'abord, scannez le QR code de l'état des lieux dans vos documents sous 48h. Ça nous permet de vérifier que tout va bien.",
        de: "Scannen Sie zuerst den QR-Code für den Zimmercheck innerhalb von 48 Stunden. So wissen wir, dass alles okay ist.",
        es: "Primero, escanea el código QR de revisión de habitación en un plazo de 48 horas. Así sabemos que todo está bien.",
        it: "Prima cosa: scansiona il QR code per il controllo stanza entro 48 ore. Così sappiamo che è tutto ok.",
        pt: "Primeiro, digitalize o código QR de verificação do quarto em 48 horas. Assim sabemos que está tudo bem."
    },

    'student_returning_confirm': {
        en: "Alright. Then let's get straight to what you need.",
        fr: "D'accord. Allons droit au but.",
        de: "Okay. Kommen wir zum Punkt.",
        es: "Vale. Vamos al grano.",
        it: "Ok. Andiamo al sodo.",
        pt: "Ok. Vamos direto ao assunto."
    },

    // === GUEST PATH ===
    'guest_ask_first_time': {
        en: "Lovely. Welcome. Is this your first time staying at The Social Hub, or have you stayed with us before?",
        fr: "Ravissant. Bienvenue. C'est votre première fois au Social Hub ?",
        de: "Wunderbar. Willkommen. Sind Sie zum ersten Mal im Social Hub?",
        es: "Encantado. Bienvenido. ¿Es tu primera vez en The Social Hub?",
        it: "Piacere. Benvenuto. È la prima volta al Social Hub?",
        pt: "Encantado. Bem-vindo. É a primeira vez no The Social Hub?"
    },

    'guest_first_time_confirm': {
        en: "Great choice. The Social Hub is a bit different — part hotel, part community. I'll show you the important things first.",
        fr: "Excellent choix. Le Social Hub est unique : mi-hôtel, mi-communauté. Je vous montre l'essentiel.",
        de: "Gute Wahl. The Social Hub ist anders – halb Hotel, halb Community. Ich zeige Ihnen das Wichtigste zuerst.",
        es: "Buena elección. The Social Hub es diferente: parte hotel, parte comunidad. Te enseñaré lo importante primero.",
        it: "Ottima scelta. The Social Hub è diverso: un po' hotel, un po' community. Ti mostro prima le cose importanti.",
        pt: "Boa escolha. O The Social Hub é diferente: parte hotel, parte comunidade. Vou mostrar-lhe o mais importante primeiro."
    },

    'guest_returning_confirm': {
        en: "Welcome back. Let's find what you need.",
        fr: "Bon retour parmi nous. Trouvons ce qu'il vous faut.",
        de: "Willkommen zurück. Finden wir, was Sie brauchen.",
        es: "Bienvenido de nuevo. Busquemos lo que necesitas.",
        it: "Bentornato. Troviamo ciò che ti serve.",
        pt: "Bem-vindo de volta. Vamos encontrar o que precisa."
    },

    // === STUDENT TOPIC INTROS ===
    'student_topic_room': {
        en: "Here's what to know about your personal space. Extra cleaning is available for 22 euros 50.",
        fr: "Voici ce qu'il faut savoir sur votre espace personnel. Nettoyage supplémentaire à 22 euros 50.",
        de: "Hier ist alles über Ihr privates Reich. Zusatzreinigung für 22 Euro 50.",
        es: "Esto es lo que debes saber de tu espacio. Limpieza extra por 22 euros 50.",
        it: "Ecco cosa sapere sul tuo spazio personale. Pulizia extra a 22 euro e 50.",
        pt: "Aqui está o que deve saber sobre o seu espaço. Limpeza extra por 22 euros e 50."
    },

    'student_topic_kitchen': {
        en: "The shared kitchen is the heart of the community. Here's how it works.",
        fr: "La cuisine partagée est le cœur de la communauté. Voici le fonctionnement.",
        de: "Die Gemeinschaftsküche ist das Herz der Community. So funktioniert sie.",
        es: "La cocina compartida es el corazón de la comunidad. Así funciona.",
        it: "La cucina comune è il cuore della community. Ecco come funziona.",
        pt: "A cozinha partilhada é o coração da comunidade. Veja como funciona."
    },

    'student_topic_laundry': {
        en: "Laundry works through the TSH app. You get free tokens every month.",
        fr: "La lessive fonctionne via l'app TSH. Jetons gratuits chaque mois.",
        de: "Waschen geht über die TSH app. Sie bekommen monatlich Gratis-Token.",
        es: "La lavandería va con la app TSH. Tienes fichas gratis cada mes.",
        it: "La lavanderia funziona con l'app TSH. Hai gettoni gratuiti ogni mese.",
        pt: "A lavandaria funciona com a app TSH. Tem fichas grátis todos os meses."
    },

    'student_topic_facilities': {
        en: "Here's how the shared spaces work.",
        fr: "Voici le fonctionnement des espaces partagés.",
        de: "So funktionieren die Gemeinschaftsräume.",
        es: "Así funcionan los espacios compartidos.",
        it: "Ecco come funzionano gli spazi comuni.",
        pt: "É assim que funcionam os espaços partilhados."
    },

    'student_topic_shop': {
        en: "Here is our shop basics. Student discount applied. For breakfast, we offer meal bundles — just ask at the front desk.",
        fr: "Voici l'essentiel de la boutique. Réduction étudiante appliquée. Pour le petit-déjeuner, formules repas — demandez à la réception.",
        de: "Das Wichtigste zum Shop. Studentenrabatt aktiv. Für Frühstück: Essenspakete — an der Rezeption fragen.",
        es: "Lo básico de la tienda. Descuento estudiante aplicado. Para desayuno, ofrecemos paquetes de comida — pregunta en recepción.",
        it: "L'essenziale del negozio. Sconto studenti applicato. Per la colazione, offriamo pacchetti pasto — chiedi alla reception.",
        pt: "O essencial da loja. Desconto de estudante aplicado. Para pequeno-almoço, oferecemos pacotes de refeições — pergunte na recepção."
    },

    'student_topic_packages': {
        en: "For mail and packages, use the Social Hub address and include your room number. When it arrives, the front desk will email you with next steps.",
        fr: "Pour le courrier et les colis, utilisez l'adresse du Social Hub et ajoutez votre numéro de chambre. Dès réception, la réception vous enverra un email avec la suite.",
        de: "Für Post und Pakete verwenden Sie die Social Hub Adresse und fügen Sie Ihre Zimmernummer hinzu. Bei Ankunft informiert Sie die Rezeption per E-Mail über die nächsten Schritte.",
        es: "Para correo y paquetes, usa la dirección de Social Hub e incluye tu número de habitación. Cuando llegue, recepción te enviará un email con los siguientes pasos.",
        it: "Per posta e pacchi, usa l'indirizzo del Social Hub e aggiungi il numero della tua camera. All'arrivo, la reception ti invierà un'email con i prossimi passi.",
        pt: "Para correio e encomendas, use o endereço do Social Hub e adicione o número do seu quarto. Quando chegar, a receção enviará um email com os próximos passos."
    },

    'student_topic_events': {
        en: "Here's what's happening around the hub.",
        fr: "Voici ce qui se passe au hub.",
        de: "Das ist los im Hub.",
        es: "Esto es lo que pasa en el hub.",
        it: "Ecco cosa succede nell'hub.",
        pt: "Aqui está o que se passa no hub."
    },

    'student_topic_area': {
        en: "Here's what's nearby in the neighborhood.",
        fr: "Voici ce qu'il y a dans le quartier.",
        de: "Das gibt es in der Nachbarschaft.",
        es: "Esto es lo que hay en el barrio.",
        it: "Ecco cosa c'è nel quartiere.",
        pt: "Aqui está o que há no bairro."
    },

    // === GUEST TOPIC INTROS ===
    'guest_topic_room': {
        en: "Here's what to know about your stay, from cleaning to WiFi.",
        fr: "Voici ce qu'il faut savoir, du ménage au WiFi.",
        de: "Hier ist alles, von der Reinigung bis zum WLAN.",
        es: "Aquí tienes todo sobre tu estancia, de limpieza a WiFi.",
        it: "Ecco tutto sulla tua camera, dalla pulizia al WiFi.",
        pt: "Aqui está tudo sobre a sua estadia, da limpeza ao WiFi."
    },

    'guest_topic_breakfast': {
        en: "Breakfast is vital. Here's how it works.",
        fr: "Le petit-déjeuner est vital. Voici comment ça marche.",
        de: "Frühstück ist wichtig. So läuft es ab.",
        es: "El desayuno es vital. Así funciona.",
        it: "La colazione è fondamentale. Ecco come funziona.",
        pt: "O pequeno-almoço é vital. É assim que funciona."
    },

    'guest_topic_facilities': {
        en: "Check out our 24/7 gym, laundry, and the pool when it's open.",
        fr: "Profitez du gym 24/7, de la laverie et de la piscine.",
        de: "Nutzen Sie Gym 24/7, Wäscherei und Pool.",
        es: "Disfruta el gym 24/7, lavandería y piscina.",
        it: "Scopri la palestra 24/7, la lavanderia e la piscina.",
        pt: "Aproveite o ginásio 24/7, a lavandaria e a piscina."
    },

    'guest_topic_shop': {
        en: "Our shop is open for daily essentials and latest drops.",
        fr: "Boutique ouverte pour les essentiels et nos éditions limitées.",
        de: "Shop für täglichen Bedarf und unsere neuesten Drops offen.",
        es: "Tienda abierta para básicos y nuestras últimas novedades.",
        it: "Il negozio è aperto per l'essenziale e le ultime novità.",
        pt: "A loja está aberta para o essencial e as últimas novidades."
    },

    'guest_topic_events': {
        en: "Here's what's happening around the hub.",
        fr: "Voici ce qui se passe au hub.",
        de: "Das ist los im Hub.",
        es: "Esto es lo que pasa en el hub.",
        it: "Ecco cosa succede nell'hub.",
        pt: "Aqui está o que se passa no hub."
    },

    'guest_topic_area': {
        en: "Here's what's nearby in the neighborhood.",
        fr: "Voici ce qu'il y a dans le quartier.",
        de: "Das gibt es in der Nachbarschaft.",
        es: "Esto es lo que hay en el barrio.",
        it: "Ecco cosa c'è nel quartiere.",
        pt: "Aqui está o que há no bairro."
    },

    // === IDLE/BACK NAVIGATION (12 variations for natural feel) ===
    'idle_1': {
        en: "No worries — take your time.",
        fr: "Pas de souci, prenez votre temps.",
        de: "Ganz entspannt, nehmen Sie sich Zeit.",
        es: "Sin prisa, tómate tu tiempo.",
        it: "Nessuna fretta, prenditi il tuo tempo.",
        pt: "Sem pressa, leve o seu tempo."
    },

    'idle_2': {
        en: "I'm right here if you need me.",
        fr: "Je suis là si vous avez besoin.",
        de: "Ich bin hier, wenn Sie mich brauchen.",
        es: "Estoy aquí cuando me necesites.",
        it: "Sono qui per te.",
        pt: "Estou aqui consigo."
    },

    'idle_3': {
        en: "Happy to help whenever you're ready.",
        fr: "Dites-moi quand vous êtes prêt.",
        de: "Wir können jederzeit weitermachen.",
        es: "Podemos continuar cuando quieras.",
        it: "Possiamo continuare quando vuoi.",
        pt: "Continuamos quando quiser."
    },

    'idle_4': {
        en: "There's plenty to explore.",
        fr: "Il y a plein de choses à découvrir.",
        de: "Es gibt einiges zu entdecken.",
        es: "Hay mucho por descubrir.",
        it: "C'è tanto da scoprire.",
        pt: "Há muito para descobrir."
    },

    'idle_5': {
        en: "Let me know what you'd like to look at next.",
        fr: "On peut continuer quand vous voulez.",
        de: "Sagen Sie einfach Bescheid.",
        es: "Avísame cuando estés listo.",
        it: "Dimmi tu.",
        pt: "Diga-me quando estiver pronto."
    },

    'idle_6': {
        en: "You can always come back to this later.",
        fr: "N'hésitez pas à explorer.",
        de: "Schauen Sie sich gern um.",
        es: "Explora con calma.",
        it: "Dai pure un'occhiata.",
        pt: "Explore à vontade."
    },

    'idle_7': {
        en: "Everything you need is just a tap away.",
        fr: "Tout est à portée de main.",
        de: "Alles ist ganz einfach erreichbar.",
        es: "Todo está a un toque.",
        it: "È tutto molto semplice.",
        pt: "Está tudo aqui."
    },

    'idle_8': {
        en: "Feel free to take a look around.",
        fr: "Je vous accompagne.",
        de: "Ich begleite Sie.",
        es: "Te acompaño.",
        it: "Ti accompagno.",
        pt: "Estou a acompanhar-lhe."
    },

    'idle_9': {
        en: "I've got you — where to next?",
        fr: "Où souhaitez-vous aller ensuite ?",
        de: "Wohin möchten Sie als Nächstes?",
        es: "¿A dónde vamos ahora?",
        it: "Dove andiamo adesso?",
        pt: "Para onde vamos agora?"
    },

    'idle_10': {
        en: "All good. Let's keep going.",
        fr: "Très bien, continuons.",
        de: "Alles klar, machen wir weiter.",
        es: "Perfecto, seguimos.",
        it: "Perfetto, continuiamo.",
        pt: "Perfeito, vamos continuar."
    },

    'idle_11': {
        en: "You're doing great, take it easy.",
        fr: "Prenez votre temps, vraiment.",
        de: "Kein Stress.",
        es: "Tranquilo, no hay prisa.",
        it: "Con calma.",
        pt: "Com calma."
    },

    'idle_12': {
        en: "Whenever you're ready, I'm here.",
        fr: "Je reste avec vous.",
        de: "Ich bin für Sie da.",
        it: "Sono qui.",
        pt: "Estou aqui para ajudar."
    },

    // === MAIN MENU CARD VOICES (3 variants each) ===
    'card_hub_facilities_1': {
        en: "This is where the community comes together — let's take a look.",
        fr: "C'est ici que la communauté se rassemble — jetons un œil.",
        de: "Hier kommt die Community zusammen — schauen wir mal.",
        es: "Aquí se reúne la comunidad — echemos un vistazo.",
        it: "Qui si riunisce la community — diamo un'occhiata.",
        pt: "Aqui é onde a comunidade se reúne — vamos ver."
    },
    'card_hub_facilities_2': {
        en: "Let me show you our favorite shared spaces.",
        fr: "Voici nos espaces préférés pour se retrouver.",
        de: "Das sind unsere Lieblings-Gemeinschaftsräume.",
        es: "Te enseño nuestros espacios favoritos.",
        it: "Ti mostro i nostri spazi preferiti.",
        pt: "Deixa-me mostrar os nossos espaços favoritos."
    },
    'card_hub_facilities_3': {
        en: "These are the spots where everyone hangs out.",
        fr: "C'est là que tout le monde se retrouve.",
        de: "Hier trifft sich jeder.",
        es: "Este es el sitio donde todos se juntan.",
        it: "Qui si ritrova tutti.",
        pt: "É aqui que toda a gente se junta."
    },

    'card_hub_food_drinks_1': {
        en: "Good food, good moments — here's what's available.",
        fr: "Bonne cuisine, bons moments — voici ce qui est disponible.",
        de: "Gutes Essen, gute Momente — hier ist das Angebot.",
        es: "Buena comida, buenos momentos — esto es lo que hay.",
        it: "Buon cibo, bei momenti — ecco cosa c'è.",
        pt: "Boa comida, bons momentos — aqui está o que há."
    },
    'card_hub_food_drinks_2': {
        en: "Let's explore the food and drink options.",
        fr: "On va voir ce qu'on peut manger et boire.",
        de: "Schauen wir, was es zu essen gibt.",
        es: "Vamos a ver qué se puede comer y beber.",
        it: "Vediamo cosa c'è da mangiare e bere.",
        pt: "Vamos ver o que há para comer e beber."
    },
    'card_hub_food_drinks_3': {
        en: "Time to check out what's cooking.",
        fr: "Voyons ce qu'il y a de bon.",
        de: "Zeit für Essen und Trinken.",
        es: "A ver qué hay de bueno.",
        it: "Diamo un'occhiata al menu.",
        pt: "Hora de ver as opções."
    },

    'card_hub_shop_1': {
        en: "From essentials to latest drops — all the good stuff.",
        fr: "Des essentiels aux dernières éditions — que du bon.",
        de: "Vom Nötigsten bis zu neuesten Drops — alles Gute.",
        es: "De lo esencial a las últimas novedades — todo lo bueno.",
        it: "Dall'essenziale alle ultime novità — tutto il meglio.",
        pt: "Do essencial às últimas novidades — o melhor."
    },
    'card_hub_shop_2': {
        en: "Our shop has everything you need.",
        fr: "Le shop a tout ce qu'il faut.",
        de: "Im Shop gibt's alles, was du brauchst.",
        es: "La tienda tiene todo lo que necesitas.",
        it: "Il negozio ha tutto quello che ti serve.",
        pt: "A loja tem tudo o que precisas."
    },
    'card_hub_shop_3': {
        en: "Check out what's in store today.",
        fr: "Voyons ce qui est dispo.",
        de: "Schauen wir, was es Neues gibt.",
        es: "Veamos qué hay hoy.",
        it: "Vediamo cosa c'è oggi.",
        pt: "Vamos ver o que há."
    },

    'card_room_wifi_1': {
        en: "Everything you need to stay connected, right here.",
        fr: "Tout ce qu'il faut pour rester connecté, juste ici.",
        de: "Alles, um verbunden zu bleiben, genau hier.",
        es: "Todo lo que necesitas para estar conectado, justo aquí.",
        it: "Tutto per rimanere connesso, proprio qui.",
        pt: "Tudo para ficar conectado, mesmo aqui."
    },
    'card_room_wifi_2': {
        en: "Let's get you online.",
        fr: "On va te connecter.",
        de: "Bringen wir dich online.",
        es: "Vamos a conectarte.",
        it: "Ti connetto subito.",
        pt: "Vamos conectar-te."
    },
    'card_room_wifi_3': {
        en: "Here's how the WiFi works.",
        fr: "Voici comment marche le WiFi.",
        de: "So funktioniert das WLAN.",
        es: "Así funciona el WiFi.",
        it: "Ecco come funziona il WiFi.",
        pt: "É assim que o WiFi funciona."
    },

    'card_room_cleaning_1': {
        en: "Keeping your space fresh and comfortable.",
        fr: "Pour garder votre espace frais et confortable.",
        de: "Damit Ihr Raum frisch und gemütlich bleibt.",
        es: "Manteniendo tu espacio fresco y cómodo.",
        it: "Per mantenere il tuo spazio fresco e confortevole.",
        pt: "Mantendo o seu espaço fresco e confortável."
    },
    'card_room_cleaning_2': {
        en: "Here's how cleaning works.",
        fr: "Voici comment marche le ménage.",
        de: "So läuft die Reinigung.",
        es: "Así funciona la limpieza.",
        it: "Ecco come funziona la pulizia.",
        pt: "É assim que funciona a limpeza."
    },
    'card_room_cleaning_3': {
        en: "Let me explain the housekeeping schedule.",
        fr: "Je t'explique le planning.",
        de: "Der Reinigungsplan erklärt.",
        es: "Te explico el horario.",
        it: "Ti spiego il programma.",
        pt: "Deixa-me explicar o horário."
    },

    'card_room_amenities_1': {
        en: "All the little things that make it feel like home.",
        fr: "Tous les petits détails qui font que vous vous sentez chez vous.",
        de: "All die kleinen Dinge, die es wie zuhause anfühlen lassen.",
        es: "Todos los detalles que lo hacen sentir como casa.",
        it: "Tutti i piccoli dettagli che lo fanno sentire come casa.",
        pt: "Todos os pequenos detalhes que fazem sentir como em casa."
    },
    'card_room_amenities_2': {
        en: "Here's what's in your room.",
        fr: "Voici ce qu'il y a dans ta chambre.",
        de: "Das ist in Ihrem Zimmer.",
        es: "Esto es lo que hay en tu habitación.",
        it: "Ecco cosa c'è nella tua stanza.",
        pt: "Isto é o que está no teu quarto."
    },
    'card_room_amenities_3': {
        en: "Let me show you the amenities.",
        fr: "Je te montre les équipements.",
        de: "Die Ausstattung erklärt.",
        es: "Te enseño las comodidades.",
        it: "Ti mostro i comfort.",
        pt: "Deixa-me mostrar as comodidades."
    },

    'card_room_comfort_1': {
        en: "Everything to feel at home, right here.",
        fr: "Tout pour se sentir chez soi, juste ici.",
        de: "Alles, um sich wie zuhause zu fühlen, genau hier.",
        es: "Todo para sentirse como en casa, justo aquí.",
        it: "Tutto per sentirsi a casa, proprio qui.",
        pt: "Tudo para se sentir em casa, mesmo aqui."
    },
    'card_room_comfort_2': {
        en: "Making your stay comfortable.",
        fr: "Pour un séjour confortable.",
        de: "Für einen komfortablen Aufenthalt.",
        es: "Para una estancia cómoda.",
        it: "Per un soggiorno confortevole.",
        pt: "Para uma estadia confortável."
    },
    'card_room_comfort_3': {
        en: "Here's what you need to know.",
        fr: "Voici ce qu'il faut savoir.",
        de: "Das sollten Sie wissen.",
        es: "Esto es lo que debes saber.",
        it: "Ecco cosa devi sapere.",
        pt: "Isto é o que precisa de saber."
    },

    'card_area_dining_1': {
        en: "Great spots just around the corner — local favorites.",
        fr: "De bons endroits juste au coin — nos favoris locaux.",
        de: "Tolle Orte gleich um die Ecke — lokale Favoriten.",
        es: "Grandes sitios a la vuelta de la esquina — favoritos locales.",
        it: "Ottimi posti dietro l'angolo — i preferiti del quartiere.",
        pt: "Ótimos sítios mesmo ao virar da esquina — favoritos locais."
    },
    'card_area_dining_2': {
        en: "Here are the best places to eat nearby.",
        fr: "Voici les meilleurs restos du coin.",
        de: "Die besten Restaurants in der Nähe.",
        es: "Los mejores sitios para comer cerca.",
        it: "I migliori ristoranti qui vicino.",
        pt: "Os melhores sítios para comer perto."
    },
    'card_area_dining_3': {
        en: "Let me show you where locals go.",
        fr: "Je te montre où mangent les locaux.",
        de: "Ich zeig dir, wo die Locals hingehen.",
        es: "Te enseño dónde van los locales.",
        it: "Ti mostro dove vanno i locali.",
        pt: "Deixa-me mostrar onde vão os locais."
    },

    'card_area_transport_1': {
        en: "Getting around is easy — here's how.",
        fr: "Se déplacer est facile — voici comment.",
        de: "Unterwegs sein ist einfach — so geht's.",
        es: "Moverse es fácil — así es cómo.",
        it: "Girare è facile — ecco come.",
        pt: "Andar por aí é fácil — aqui está como."
    },
    'card_area_transport_2': {
        en: "Let me explain the transport options.",
        fr: "Je t'explique les transports.",
        de: "Die Transport-Optionen erklärt.",
        es: "Te explico las opciones de transporte.",
        it: "Ti spiego le opzioni di trasporto.",
        pt: "Deixa-me explicar as opções de transporte."
    },
    'card_area_transport_3': {
        en: "Here's how to move around the city.",
        fr: "Voici comment bouger en ville.",
        de: "So kommst du durch die Stadt.",
        es: "Así te mueves por la ciudad.",
        it: "Ecco come muoversi in città.",
        pt: "É assim que te moves pela cidade."
    },

    'card_area_essentials_1': {
        en: "Everything you might need, close by.",
        fr: "Tout ce dont vous pourriez avoir besoin, à proximité.",
        de: "Alles, was Sie brauchen könnten, ganz nah.",
        es: "Todo lo que podrías necesitar, cerca.",
        it: "Tutto ciò di cui potresti aver bisogno, vicino.",
        pt: "Tudo o que possa precisar, por perto."
    },
    'card_area_essentials_2': {
        en: "Here's what's nearby.",
        fr: "Voici ce qu'il y a près d'ici.",
        de: "Das gibt's in der Nähe.",
        es: "Esto es lo que hay cerca.",
        it: "Ecco cosa c'è qui vicino.",
        pt: "Isto é o que há perto."
    },
    'card_area_essentials_3': {
        en: "The essentials are all around you.",
        fr: "L'essentiel est juste à côté.",
        de: "Das Wichtigste ist gleich um die Ecke.",
        es: "Lo esencial está a tu alrededor.",
        it: "L'essenziale è tutto intorno.",
        pt: "O essencial está à tua volta."
    },

    'card_front_desk_1': {
        en: "Please dial nine from your room phone to reach the front desk. Our team will be happy to assist you with anything you need.",
        fr: "Veuillez composer le 9 depuis le téléphone de votre chambre pour joindre la réception. Notre équipe sera ravie de vous aider.",
        de: "Bitte wählen Sie die 9 von Ihrem Zimmertelefon, um die Rezeption zu erreichen. Unser Team hilft Ihnen gerne bei allem, was Sie brauchen.",
        es: "Por favor, marque el 9 desde el teléfono de su habitación para comunicarse con recepción. Nuestro equipo estará encantado de ayudarle con lo que necesite.",
        it: "Comporre il 9 dal telefono della camera per raggiungere la reception. Il nostro team sarà felice di assistervi con qualsiasi cosa abbiate bisogno.",
        pt: "Por favor, marque 9 do telefone do seu quarto para contactar a receção. A nossa equipa terá todo o prazer em ajudá-lo com o que precisar."
    },
    'card_front_desk_2': {
        en: "Need help? Just dial nine from your room. We're here for you twenty-four seven.",
        fr: "Besoin d'aide ? Composez le 9. On est là 24h/24.",
        de: "Brauchen Sie Hilfe? Wählen Sie einfach die 9. Wir sind rund um die Uhr da.",
        es: "¿Necesitas ayuda? Marca el 9. Estamos aquí las 24 horas.",
        it: "Serve aiuto? Chiama il 9. Ci siamo 24 ore su 24.",
        pt: "Precisa de ajuda? Marque 9. Estamos cá sempre."
    },
    'card_front_desk_3': {
        en: "Our front desk is always here. Dial nine from your room phone anytime.",
        fr: "La réception est toujours disponible. Faites le 9 depuis votre chambre.",
        de: "Unsere Rezeption ist immer für Sie da. Wählen Sie die 9.",
        es: "Recepción siempre disponible. Marca el 9 desde tu habitación.",
        it: "La reception è sempre disponibile. Chiama il 9.",
        pt: "A receção está sempre disponível. Marque 9 do seu quarto."
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
    console.log('🎤 Starting ElevenLabs voice generation...\n');
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
