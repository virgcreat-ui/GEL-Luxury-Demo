
import { Lang } from "../i18n";

export type ScriptScene =
    | "WELCOME_V4"
    | "WELCOME_VARIANTS"        // New: 8 warm greeting variants
    | "STAY_TYPE_PROMPT"       // New: Canonical stay-type question
    | "STUDENT_WELCOME"
    | "GUEST_WELCOME"
    | "STUDENT_FIRST_TIME_INTRO"
    | "STUDENT_RETURNING_INTRO"
    | "GUEST_FIRST_TIME_INTRO"
    | "GUEST_RETURNING_INTRO"
    | "ACK_ROOM"
    | "ACK_BREAKFAST"
    | "ACK_FACILITIES"
    | "ACK_EVENTS"
    | "ACK_AREA"
    | "ACK_SHOP"
    | "ACK_WIFI"
    | "ACK_LAUNDRY"
    | "ACK_KITCHEN"
    | "ACK_PACKAGES"
    | "ROOM_NOTE_INTRO"
    | "SHOP_STUDENT_ADDON"
    | "HUMAN_HELP"
    | "NO_EVENTS_VOICE"
    | "NOT_AVAILABLE_VOICE"
    | "BACK_PROMPT_V4";

export const SCRIPT_POOLS: Record<ScriptScene, Record<Lang, string[]>> = {
    WELCOME_V4: {
        en: ["Welcome to The Social Hub. I’ll be your concierge, and I’m happy to guide you. To get started — are you staying with us as a student, or as a hotel guest?"],
        fr: ["Bienvenue au Social Hub. Je m'occupe de vous. Alors, vous êtes étudiant ou client de l'hôtel ?"],
        de: ["Willkommen. Ich bin für dich da. Bist du Student oder Hotelgast?"],
        es: ["Bienvenido. Yo te ayudo. Dime, ¿eres estudiante o huésped?"],
        it: ["Benvenuto. Ci penso io. Allora, sei studente o ospite?"],
        pt: ["Bem-vindo. Eu ajudo-te. És estudante ou hóspede?"]
    },

    // New: Welcome greeting variants (8 per language) - play ONE randomly before stay-type question
    WELCOME_VARIANTS: {
        en: [
            "Welcome to The Social Hub. I'm here to help you settle in.",
            "Hey there! Welcome to Paris. Let's get you started.",
            "Welcome! Happy to have you with us at The Social Hub.",
            "Hi! Welcome to your home away from home in Paris.",
            "Welcome to The Social Hub. I'll be your guide today.",
            "Hello! Great to see you. Let's make this easy.",
            "Welcome! I'm here to show you around.",
            "Hey! Welcome to The Social Hub Paris. Ready to explore?"
        ],
        fr: [
            "Bienvenue au Social Hub. Je suis là pour vous aider.",
            "Salut ! Bienvenue à Paris. On commence ?",
            "Bienvenue ! Ravie de vous accueillir au Social Hub.",
            "Coucou ! Bienvenue chez vous à Paris.",
            "Bienvenue au Social Hub. Je vous accompagne.",
            "Bonjour ! Content de vous voir. On y va ?",
            "Bienvenue ! Je suis là pour vous guider.",
            "Hey ! Bienvenue au Social Hub Paris. Prêt à découvrir ?"
        ],
        de: [
            "Willkommen im Social Hub. Ich helf dir gern.",
            "Hey! Willkommen in Paris. Legen wir los.",
            "Willkommen! Schön, dass du da bist.",
            "Hi! Willkommen in deinem Zuhause in Paris.",
            "Willkommen im Social Hub. Ich zeig dir alles.",
            "Hallo! Freut mich. Machen wir's einfach.",
            "Willkommen! Ich bin für dich da.",
            "Hey! Willkommen im Social Hub Paris. Bereit?"
        ],
        es: [
            "Bienvenido a The Social Hub. Estoy aquí para ayudarte.",
            "¡Hola! Bienvenido a París. Empecemos.",
            "¡Bienvenido! Encantada de tenerte aquí.",
            "¡Hey! Bienvenido a tu hogar en París.",
            "Bienvenido a The Social Hub. Te acompaño.",
            "¡Hola! Qué bien verte. Vamos allá.",
            "¡Bienvenido! Estoy aquí para guiarte.",
            "¡Hey! Bienvenido a The Social Hub París. ¿Listo?"
        ],
        it: [
            "Benvenuto al Social Hub. Sono qui per aiutarti.",
            "Ciao! Benvenuto a Parigi. Iniziamo.",
            "Benvenuto! Felice di averti qui.",
            "Hey! Benvenuto a casa tua a Parigi.",
            "Benvenuto al Social Hub. Ti accompagno.",
            "Ciao! Che bello vederti. Facciamolo semplice.",
            "Benvenuto! Sono qui per guidarti.",
            "Hey! Benvenuto al Social Hub Parigi. Pronto?"
        ],
        pt: [
            "Bem-vindo ao Social Hub. Estou aqui para ajudar.",
            "Olá! Bem-vindo a Paris. Vamos começar.",
            "Bem-vindo! Que bom ter-te aqui.",
            "Hey! Bem-vindo à tua casa em Paris.",
            "Bem-vindo ao Social Hub. Eu acompanho-te.",
            "Olá! Que bom ver-te. Vamos facilitar.",
            "Bem-vindo! Estou aqui para te guiar.",
            "Hey! Bem-vindo ao Social Hub Paris. Pronto?"
        ]
    },

    // New: Canonical stay-type question - ALWAYS spoken when stay-type buttons appear
    STAY_TYPE_PROMPT: {
        en: ["To get started, are you staying with us as a hotel guest, or as a student?"],
        fr: ["Pour commencer, vous séjournez chez nous en tant que client hôtel, ou en tant qu'étudiant ?"],
        de: ["Bevor wir loslegen — wohnen Sie bei uns als Hotelgast, oder als Student?"],
        es: ["Para empezar, ¿te alojas con nosotros como huésped del hotel o como estudiante?"],
        it: ["Per cominciare, soggiorni con noi come ospite dell'hotel o come studente?"],
        pt: ["Para começar, está a ficar connosco como hóspede do hotel ou como estudante?"]
    },

    STUDENT_WELCOME: {
        en: [
            "Awesome. Welcome to your new home. Is this your first time staying with us, or have you already been around?",
            "Nice. We’re really happy to have you with us. Is this your first time staying with us, or have you already been around?",
            "Great. Welcome to The Social Hub community. Is this your first time staying with us, or have you already been around?"
        ],
        fr: ["Super. Bienvenue chez toi. C'est ta première fois ici ou tu connais déjà ?"],
        de: ["Cool. Willkommen zuhause. Warst du schon mal hier?"],
        es: ["Genial. Bienvenido a tu nuevo hogar. ¿Primera vez o ya conoces esto?"],
        it: ["Fantastico. Benvenuto a casa. Prima volta o conosci già?"],
        pt: ["Ótimo. Bem-vindo a casa. É a primeira vez ou já conheces?"]
    },

    GUEST_WELCOME: {
        en: [
            "Lovely. Welcome. Is this your first time staying at The Social Hub, or have you stayed with us before?",
            "Great. I’ll help you make the most of your stay. Is this your first time staying at The Social Hub, or have you stayed with us before?",
            "Perfect. Let me guide you. Is this your first time staying at The Social Hub, or have you stayed with us before?"
        ],
        fr: ["Parfait. Bienvenue. Première fois au Social Hub ?"],
        de: ["Schön. Willkommen. Zum ersten Mal hier?"],
        es: ["Perfecto. Bienvenido. ¿Primera vez en The Social Hub?"],
        it: ["Bene. Benvenuto. Prima volta qui?"],
        pt: ["Muito bem. Bem-vindo. Primeira vez aqui?"]
    },

    STUDENT_FIRST_TIME_INTRO: {
        en: ["Perfect. I’ll help you with the essentials to get you started. First things first — make sure you scan the room check QR code in your welcome documents. That helps us know everything is in good shape when you move in. Once that’s done, tell me what you need help with."],
        fr: ["Très bien. D'abord, scanne le QR code dans tes docs pour l'état de la chambre. Ça nous assure que tout est OK. Après, dis-moi ce qu'il te faut."],
        de: ["Perfekt. Erst mal den QR-Code scannen für den Zimmer-Check. Dann wissen wir, dass alles passt. Danach sag mir einfach Bescheid."],
        es: ["Perfecto. Primero escanea el QR de la habitación en tus papeles. Así sabemos que todo va bien. Luego me dices qué necesitas."],
        it: ["Perfetto. Prima cosa, scansiona il QR per il check della stanza. Così siamo sicuri che è tutto a posto. Poi dimmi cosa ti serve."],
        pt: ["Ótimo. Primeiro, digitaliza o QR nos documentos para o check do quarto. Assim sabemos que está tudo bem. Depois diz-me do que precisas."]
    },

    STUDENT_RETURNING_INTRO: {
        en: [
            "Alright. Then let’s get straight to what you need.",
            "Got it. I’ll keep things quick.",
            "Perfect. Where should we start?"
        ],
        fr: ["OK. Allons droit au but.", "Compris. Je fais vite.", "Parfait. On commence par quoi ?"],
        de: ["Alles klar. Dann los.", "Verstanden. Machen wir's kurz.", "Super. Was zuerst?"],
        es: ["Vale. Al grano.", "Entendido. Voy rápido.", "Perfecto. ¿Por dónde empezamos?"],
        it: ["OK. Andiamo al punto.", "Ricevuto. Facciamo veloce.", "Perfetto. Da dove iniziamo?"],
        pt: ["OK. Vamos diretos ao assunto.", "Entendido. Vou ser breve.", "Perfeito. Por onde começamos?"]
    },

    GUEST_FIRST_TIME_INTRO: {
        en: ["Great choice. The Social Hub is a bit different — part hotel, part community. I’ll show you the important things first, and you can explore more anytime."],
        fr: ["Bon choix. Ici c'est moitié hôtel, moitié communauté. Je te montre l'essentiel, tu découvriras le reste après."],
        de: ["Gute Wahl. Hier ist halb Hotel, halb Community. Ich zeig dir erst mal das Wichtigste."],
        es: ["Buena elección. Aquí es mitad hotel, mitad comunidad. Te enseño lo importante y ya explorarás."],
        it: ["Ottima scelta. Qui è metà hotel, metà community. Ti mostro l'essenziale, poi scoprirai il resto."],
        pt: ["Boa escolha. Aqui é metade hotel, metade comunidade. Mostro o essencial, depois explores."]
    },

    GUEST_RETURNING_INTRO: {
        en: ["Welcome back. Let's find what you need."],
        fr: ["Content de te revoir. Dis-moi ce qu'il te faut."],
        de: ["Schön, dich wiederzusehen. Was brauchst du?"],
        es: ["Qué bueno verte de nuevo. Dime qué necesitas."],
        it: ["Ben tornato. Cosa ti serve?"],
        pt: ["Que bom ver-te de novo. O que precisas?"]
    },

    // Meaningful Acks
    ACK_WIFI: {
        en: ["Wi-Fi is super easy here. Let me explain."],
        fr: ["Le WiFi c'est super simple. Regarde."],
        de: ["WLAN ist total easy. Schau mal."],
        es: ["El WiFi es súper fácil. Mira."],
        it: ["Il WiFi è facilissimo. Guarda."],
        pt: ["O WiFi é super fácil. Olha."]
    },
    ACK_LAUNDRY: {
        en: ["Laundry works through the Social Hub app. You get free tokens every month."],
        fr: ["La laverie marche avec l'app Social Hub. T'as des jetons gratuits tous les mois."],
        de: ["Waschmaschinen über die App. Jeden Monat kriegst du Gratis-Token."],
        es: ["La lavandería va con la app. Tienes fichas gratis cada mes."],
        it: ["Lavanderia con l'app. Hai gettoni gratis ogni mese."],
        pt: ["A lavandaria funciona pela app. Tens fichas grátis todos os meses."]
    },
    ACK_KITCHEN: {
        en: ["The shared kitchen is the heart of the community. Here's how it works."],
        fr: ["La cuisine partagée c'est le cœur d'ici. Voilà comment ça marche."],
        de: ["Die Gemeinschaftsküche ist das Herz hier. So läuft's."],
        es: ["La cocina compartida es el corazón de esto. Así va."],
        it: ["La cucina comune è il cuore. Ecco come funziona."],
        pt: ["A cozinha partilhada é o coração disto. É assim que funciona."]
    },
    ACK_ROOM: {
        en: ["Sure. Here’s what to know about your personal space."],
        fr: ["Bien sûr. Voilà l'essentiel sur ta chambre."],
        de: ["Klar. Das Wichtigste zu deinem Zimmer."],
        es: ["Claro. Lo esencial de tu espacio."],
        it: ["Certo. L'essenziale sulla tua camera."],
        pt: ["Claro. O essencial sobre o teu espaço."]
    },
    ACK_BREAKFAST: {
        en: ["Breakfast is vital. Here’s how it works."],
        fr: ["Le petit-déj c'est important. Voilà comment ça marche."],
        de: ["Frühstück ist wichtig. So geht's."],
        es: ["El desayuno es clave. Así va."],
        it: ["La colazione è importante. Ecco come funziona."],
        pt: ["O pequeno-almoço é essencial. Funciona assim."]
    },
    ACK_FACILITIES: {
        en: ["Here’s how the shared spaces work."],
        fr: ["Voilà comment marchent les espaces partagés."],
        de: ["So laufen die Gemeinschaftsräume."],
        es: ["Así van los espacios compartidos."],
        it: ["Ecco come funzionano gli spazi comuni."],
        pt: ["É assim que funcionam os espaços partilhados."]
    },
    ACK_EVENTS: {
        en: ["Here’s what’s happening around the hub."],
        fr: ["Voilà ce qui se passe au hub."],
        de: ["Das läuft im Hub."],
        es: ["Esto pasa en el hub."],
        it: ["Ecco cosa succede qui."],
        pt: ["É isto que se passa no hub."]
    },
    ACK_AREA: {
        en: ["Here’s what’s nearby in the neighborhood."],
        fr: ["Voilà ce qu'il y a dans le coin."],
        de: ["Das gibt's in der Gegend."],
        es: ["Esto hay por el barrio."],
        it: ["Ecco cosa c'è in zona."],
        pt: ["É isto que há no bairro."]
    },
    ACK_SHOP: {
        en: ["Here is our shop basics."],
        fr: ["Voilà l'essentiel du shop."],
        de: ["Das Wichtigste zum Shop."],
        es: ["Lo básico de la tienda."],
        it: ["L'essenziale del negozio."],
        pt: ["O essencial da loja."]
    },
    ACK_PACKAGES: {
        en: ["About packages and mail. Here is how we handle them."],
        fr: ["Les colis et le courrier. Voilà comment on gère."],
        de: ["Pakete und Post. So machen wir das."],
        es: ["Paquetes y correo. Así lo hacemos."],
        it: ["Pacchi e posta. Ecco come facciamo."],
        pt: ["Encomendas e correio. É assim que tratamos."]
    },

    ROOM_NOTE_INTRO: {
        en: ["Good to know."],
        fr: ["Bon à savoir."],
        de: ["Gut zu wissen."],
        es: ["Bueno saberlo."],
        it: ["Buono a sapersi."],
        pt: ["Bom saber."]
    },

    BACK_PROMPT_V4: {
        en: [
            "What would you like to check next?",
            "No rush — where to?",
            "Anything else I can help with?",
            "Happy to guide you.",
            "Let me know what you need.",
            "We’ve got a lot going on here.",
            "You can explore at your own pace.",
            "I’m here if you need me.",
            "Where should we go next?",
            "Still with me?",
            "Let’s keep going.",
            "What’s next on your list?"
        ],
        fr: [
            "Pas de souci, prenez votre temps.",
            "Je suis là si vous avez besoin.",
            "Dites-moi quand vous êtes prêt.",
            "Il y a plein de choses à découvrir.",
            "On peut continuer quand vous voulez.",
            "N'hésitez pas à explorer.",
            "Je vous accompagne.",
            "Tout est à portée de main.",
            "Où souhaitez-vous aller ensuite ?",
            "Très bien, continuons.",
            "Prenez votre temps, vraiment.",
            "Je reste avec vous."
        ],
        de: [
            "Ganz entspannt, nehmen Sie sich Zeit.",
            "Ich bin hier, wenn Sie mich brauchen.",
            "Wir können jederzeit weitermachen.",
            "Es gibt einiges zu entdecken.",
            "Sagen Sie einfach Bescheid.",
            "Schauen Sie sich gern um.",
            "Ich begleite Sie.",
            "Alles ist ganz einfach erreichbar.",
            "Wohin möchten Sie als Nächstes?",
            "Alles klar, machen wir weiter.",
            "Kein Stress.",
            "Ich bin für Sie da."
        ],
        es: [
            "Sin prisa, tómate tu tiempo.",
            "Estoy aquí cuando me necesites.",
            "Podemos continuar cuando quieras.",
            "Hay mucho por descubrir.",
            "Avísame cuando estés listo.",
            "Explora con calma.",
            "Te acompaño.",
            "Todo está a un toque.",
            "¿A dónde vamos ahora?",
            "Perfecto, seguimos.",
            "Tranquilo, no hay prisa.",
            "Aquí estoy."
        ],
        it: [
            "Nessuna fretta, prenditi il tuo tempo.",
            "Sono qui per te.",
            "Possiamo continuare quando vuoi.",
            "C'è tanto da scoprire.",
            "Dimmi tu.",
            "Dai pure un'occhiata.",
            "Ti accompagno.",
            "È tutto molto semplice.",
            "Dove andiamo adesso?",
            "Perfetto, continuiamo.",
            "Con calma.",
            "Sono qui."
        ],
        pt: [
            "Sem pressa, leve o seu tempo.",
            "Estou aqui consigo.",
            "Continuamos quando quiser.",
            "Há muito para descobrir.",
            "Diga-me quando estiver pronto.",
            "Explore à vontade.",
            "Estou a acompanhar-lhe.",
            "Está tudo aqui.",
            "Para onde vamos agora?",
            "Perfeito, vamos continuar.",
            "Com calma.",
            "Estou aqui para ajudar."
        ]
    },

    HUMAN_HELP: {
        en: ["And if you ever want to talk to someone in person, just dial 9. We’re here 24/7."],
        fr: ["Tu veux parler à quelqu'un ? Fais le 9. On est là 24h/24."],
        de: ["Willst du mit jemandem reden? Wähl die 9. Wir sind immer da."],
        es: ["¿Quieres hablar con alguien? Marca el 9. Estamos siempre."],
        it: ["Vuoi parlare con qualcuno? Chiama il 9. Ci siamo sempre."],
        pt: ["Queres falar com alguém? Marca 9. Estamos sempre cá."]
    },

    SHOP_STUDENT_ADDON: {
        en: ["Student discount applied."],
        fr: ["Réduc étudiante activée."],
        de: ["Studenten-Rabatt aktiv."],
        es: ["Descuento de estudiante activado."],
        it: ["Sconto studenti attivo."],
        pt: ["Desconto de estudante ativo."]
    },

    NO_EVENTS_VOICE: {
        en: ["Nothing scheduled right now — but check back soon."],
        fr: ["Rien pour l'instant. Reviens bientôt."],
        de: ["Gerade nichts. Schau bald wieder vorbei."],
        es: ["Nada ahora. Vuelve pronto."],
        it: ["Niente al momento. Torna presto."],
        pt: ["Nada de momento. Volta em breve."]
    },

    NOT_AVAILABLE_VOICE: {
        en: ["I’m sorry, that facility is not available at this location."],
        fr: ["Désolée, on n'a pas ça ici."],
        de: ["Tut mir leid, das haben wir hier nicht."],
        es: ["Lo siento, eso no lo tenemos aquí."],
        it: ["Mi dispiace, qui non c'è."],
        pt: ["Desculpa, isso não temos aqui."]
    },
};

