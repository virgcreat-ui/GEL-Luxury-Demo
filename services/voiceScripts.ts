
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
        en: ["Welcome to Le Grand Éclipse. I’ll be your concierge, and I’m happy to guide you. To get started — are you staying with us as a student, or as a hotel guest?"],
        fr: ["Bienvenue au Grand Éclipse. Je m'occupe de vous. Alors, vous êtes étudiant ou client de l'hôtel ?"],
        de: ["Willkommen im Grand Éclipse. Ich bin für dich da. Bist du Student oder Hotelgast?"],
        es: ["Bienvenido. Yo te ayudo. Dime, ¿eres estudiante o huésped?"],
        it: ["Benvenuto. Ci penso io. Allora, sei studente o ospite?"],
        pt: ["Bem-vindo. Eu ajudo-te. És estudante ou hóspede?"]
    },

    // Welcome greeting variants - refined luxury tone
    WELCOME_VARIANTS: {
        en: [
            "Welcome to Le Grand Éclipse. I am here to assist you.",
            "Welcome to Paris. It is my pleasure to serve you.",
            "Welcome. We are delighted to have you at Le Grand Éclipse.",
            "Welcome. Allow me to be your guide today.",
            "Welcome to Le Grand Éclipse. How may I be of service?",
            "Welcome. I am at your disposal for anything you may need.",
            "Welcome. I shall be happy to assist you throughout your stay.",
            "Welcome to Le Grand Éclipse Paris. What may I help you discover?"
        ],
        fr: [
            "Bienvenue au Grand Éclipse. Je suis à votre service.",
            "Bienvenue à Paris. C'est un plaisir de vous accueillir.",
            "Bienvenue. Nous sommes ravis de vous recevoir au Grand Éclipse.",
            "Bienvenue. Permettez-moi de vous accompagner aujourd'hui.",
            "Bienvenue au Grand Éclipse. Comment puis-je vous être utile ?",
            "Bienvenue. Je suis à votre entière disposition.",
            "Bienvenue. Je serai heureuse de vous assister durant votre séjour.",
            "Bienvenue au Grand Éclipse Paris. Que puis-je vous faire découvrir ?"
        ],
        de: [
            "Willkommen im Grand Éclipse. Ich stehe Ihnen zur Verfügung.",
            "Willkommen in Paris. Es ist mir eine Freude, Ihnen zu dienen.",
            "Willkommen. Wir freuen uns, Sie im Grand Éclipse begrüßen zu dürfen.",
            "Willkommen. Erlauben Sie mir, Sie heute zu begleiten.",
            "Willkommen im Grand Éclipse. Wie darf ich Ihnen behilflich sein?",
            "Willkommen. Ich stehe Ihnen für alle Ihre Wünsche zur Verfügung.",
            "Willkommen. Ich werde Sie gerne während Ihres Aufenthalts unterstützen.",
            "Willkommen im Grand Éclipse Paris. Was darf ich Ihnen zeigen?"
        ],
        es: [
            "Bienvenido a Le Grand Éclipse. Estoy a su servicio.",
            "Bienvenido a París. Es un placer recibirle.",
            "Bienvenido. Nos complace tenerle en Le Grand Éclipse.",
            "Bienvenido. Permítame ser su guía hoy.",
            "Bienvenido a Le Grand Éclipse. ¿Cómo puedo servirle?",
            "Bienvenido. Estoy a su entera disposición.",
            "Bienvenido. Será un placer asistirle durante su estancia.",
            "Bienvenido a Le Grand Éclipse París. ¿Qué le gustaría descubrir?"
        ],
        it: [
            "Benvenuto al Grand Éclipse. Sono al suo servizio.",
            "Benvenuto a Parigi. È un piacere poterla assistere.",
            "Benvenuto. Siamo lieti di averla al Grand Éclipse.",
            "Benvenuto. Mi permetta di accompagnarla oggi.",
            "Benvenuto al Grand Éclipse. Come posso esserle utile?",
            "Benvenuto. Sono a sua completa disposizione.",
            "Benvenuto. Sarò lieta di assisterla durante il suo soggiorno.",
            "Benvenuto al Grand Éclipse Parigi. Cosa posso farle scoprire?"
        ],
        pt: [
            "Bem-vindo ao Grand Éclipse. Estou ao seu serviço.",
            "Bem-vindo a Paris. É um prazer recebê-lo.",
            "Bem-vindo. Temos muito gosto em tê-lo no Grand Éclipse.",
            "Bem-vindo. Permita-me ser o seu guia hoje.",
            "Bem-vindo ao Grand Éclipse. Como posso ajudá-lo?",
            "Bem-vindo. Estou à sua inteira disposição.",
            "Bem-vindo. Terei todo o gosto em assisti-lo durante a sua estadia.",
            "Bem-vindo ao Grand Éclipse Paris. O que gostaria de descobrir?"
        ]
    },

    // Stay-type question - formal tone for luxury hotel
    STAY_TYPE_PROMPT: {
        en: ["How may I assist you during your stay?"],
        fr: ["Comment puis-je vous assister durant votre séjour ?"],
        de: ["Wie darf ich Ihnen während Ihres Aufenthalts behilflich sein?"],
        es: ["¿Cómo puedo asistirle durante su estancia?"],
        it: ["Come posso assisterla durante il suo soggiorno?"],
        pt: ["Como posso ajudá-lo durante a sua estadia?"]
    },

    STUDENT_WELCOME: {
        en: [
            "Awesome. Welcome to your new home. Is this your first time staying with us, or have you already been around?",
            "Nice. We’re really happy to have you with us. Is this your first time staying with us, or have you already been around?",
            "Great. Welcome to Le Grand Éclipse community. Is this your first time staying with us, or have you already been around?"
        ],
        fr: ["Super. Bienvenue chez toi. C'est ta première fois ici ou tu connais déjà ?"],
        de: ["Cool. Willkommen zuhause. Warst du schon mal hier?"],
        es: ["Genial. Bienvenido a tu nuevo hogar. ¿Primera vez o ya conoces esto?"],
        it: ["Fantastico. Benvenuto a casa. Prima volta o conosci già?"],
        pt: ["Ótimo. Bem-vindo a casa. É a primeira vez ou já conheces?"]
    },

    GUEST_WELCOME: {
        en: [
            "Lovely. Welcome. Is this your first time staying at Le Grand Éclipse, or have you stayed with us before?",
            "Great. I’ll help you make the most of your stay. Is this your first time staying at Le Grand Éclipse, or have you stayed with us before?",
            "Perfect. Let me guide you. Is this your first time staying at Le Grand Éclipse, or have you stayed with us before?"
        ],
        fr: ["Parfait. Bienvenue. Première fois au Grand Éclipse ?"],
        de: ["Schön. Willkommen. Zum ersten Mal hier?"],
        es: ["Perfecto. Bienvenido. ¿Primera vez en Le Grand Éclipse?"],
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
        en: ["Great choice. Le Grand Éclipse is a bit different — part hotel, part community. I’ll show you the important things first, and you can explore more anytime."],
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
        en: ["Laundry works through the LGE app. You get free tokens every month."],
        fr: ["Le service de blanchisserie fonctionne via l'application. Vous bénéficiez de jetons gratuits chaque mois."],
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

