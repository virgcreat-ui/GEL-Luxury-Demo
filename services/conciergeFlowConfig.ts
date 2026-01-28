
import { Lang } from '../i18n';

/**
 * Concierge Flow Configuration (Phase E1)
 * Admin-editable config for guided concierge experience
 * Includes per-topic intro voice lines for both student and guest paths
 */

export interface TopicConfig {
    id: string;
    label: Record<Lang, string>;
    order: number;
}

export interface ConciergePathConfig {
    welcomeLines: Record<Lang, string[]>;
    askFirstTimeLines: Record<Lang, string[]>;
    firstTimeConfirmLines: Record<Lang, string[]>;
    returningConfirmLines: Record<Lang, string[]>;
    backLines: Record<Lang, string[]>;
    idleLines: Record<Lang, string[]>; // NEW: Idle/transition voice pool
    topics: TopicConfig[];
    topicIntros: Record<string, Record<Lang, string[]>>;
}

export interface ConciergeFlowConfig {
    student: ConciergePathConfig & {
        studentOnboardingLines: Record<Lang, string[]>;
    };
    guest: ConciergePathConfig;
}

// Default configuration for all 6 languages
export const DEFAULT_CONCIERGE_FLOW_CONFIG: ConciergeFlowConfig = {
    student: {
        welcomeLines: {
            en: ["Welcome to The Social Hub. I'll be your digital concierge, here to help you feel at home. Whenever you're ready, I can guide you through everything you need. To get started — are you staying with us as a hotel guest, or as a student?"],
            fr: ["Bienvenue à The Social Hub. Je serai votre concierge digitale, là pour vous aider à vous sentir chez vous. Quand vous voulez, je peux vous guider à chaque étape de votre séjour. Pour commencer — séjournez-vous chez nous en tant que client hôtel, ou étudiant ?"],
            de: ["Willkommen im The Social Hub. Ich bin Ihre digitale Concierge und helfe Ihnen gern, sich hier wohlzufühlen. Wenn Sie möchten, begleite ich Sie durch alles Wichtige. Zum Start — sind Sie bei uns als Hotelgast, oder als Student?"],
            es: ["Bienvenido a The Social Hub. Seré tu concierge digital, aquí para ayudarte a sentirte como en casa. Cuando quieras, te guiaré en todo lo que necesites. Para empezar — ¿te alojas con nosotros como huésped del hotel, o como estudiante?"],
            it: ["Benvenuto a The Social Hub. Sarò la tua concierge digitale, qui per farti sentire subito a casa. Quando vuoi, ti guiderò in tutto ciò di cui hai bisogno. Per iniziare — soggiorni con noi come ospite dell'hotel, o come studente?"],
            pt: ["Bem-vindo ao The Social Hub. Serei a sua concierge digital, aqui para o ajudar a sentir-se em casa. Sempre que quiser, posso guiá-lo em tudo o que precisar. Para começar — está connosco como hóspede do hotel, ou como estudante?"]
        },
        askFirstTimeLines: {
            en: [
                "Awesome. Welcome to your new home. Is this your first time staying with us, or have you already been around?",
                "Nice. We're really happy to have you with us. Is this your first time staying with us, or have you already been around?"
            ],
            fr: ["Génial. Bienvenue chez vous. C'est votre première fois ou vous connaissez déjà ?"],
            de: ["Super. Willkommen zuhause. Sind Sie zum ersten Mal hier oder kennen Sie sich schon aus?"],
            es: ["Genial. Bienvenido a tu nuevo hogar. ¿Es tu primera vez o ya has estado aquí?"],
            it: ["Fantastico. Benvenuto a casa. È la tua prima volta o ci conosci già?"],
            pt: ["Fantástico. Bem-vindo a casa. É a primeira vez ou já conhece?"]
        },
        firstTimeConfirmLines: {
            en: ["Perfect. I'll help you with the essentials to get you started."],
            fr: ["Parfait. Commençons par l'essentiel."],
            de: ["Perfekt. Fangen wir mit dem Wichtigsten an."],
            es: ["Perfecto. Empecemos por lo esencial."],
            it: ["Perfetto. Iniziamo dall'essenziale."],
            pt: ["Perfeito. Comecemos pelo essencial."]
        },
        studentOnboardingLines: {
            en: ["First things first — make sure you scan the room check QR code in your welcome documents within 48 hours. That helps us know everything is in good shape when you move in."],
            fr: ["D'abord, scannez le QR code de l'état des lieux dans vos documents sous 48h. Ça nous permet de vérifier que tout va bien."],
            de: ["Scannen Sie zuerst den QR-Code für den Zimmercheck innerhalb von 48 Stunden. So wissen wir, dass alles okay ist."],
            es: ["Primero, escanea el código QR de revisión de habitación en un plazo de 48 horas. Así sabemos que todo está bien."],
            it: ["Prima cosa: scansiona il QR code per il controllo stanza entro 48 ore. Così sappiamo che è tutto ok."],
            pt: ["Primeiro, digitalize o código QR de verificação do quarto em 48 horas. Assim sabemos que está tudo bem."]
        },
        returningConfirmLines: {
            en: ["Alright. Then let's get straight to what you need.", "Got it. I'll keep things quick."],
            fr: ["D'accord. Allons droit au but.", "Compris. On fait vite."],
            de: ["Okay. Kommen wir zum Punkt.", "Verstanden. Ich mache es kurz."],
            es: ["Vale. Vamos al grano.", "Entendido. Seré breve."],
            it: ["Ok. Andiamo al sodo.", "Ricevuto. Farò in fretta."],
            pt: ["Ok. Vamos direto ao assunto.", "Entendido. Serei breve."]
        },
        backLines: {
            en: [
                "What would you like to check next?",
                "No rush — where to?",
                "Anything else I can help with?",
                "Let me know what you need.",
                "What's next on your list?"
            ],
            fr: [
                "Que voulez-vous voir ensuite ?",
                "Prenez votre temps. Où aller ?",
                "Puis-je vous aider pour autre chose ?",
                "Dites-moi ce qu'il vous faut.",
                "C'est quoi la suite ?"
            ],
            de: [
                "Was möchten Sie als nächstes sehen?",
                "Keine Eile. Wohin?",
                "Kann ich sonst noch helfen?",
                "Sagen Sie mir, was Sie brauchen.",
                "Was steht als nächstes an?"
            ],
            es: [
                "¿Qué quieres ver ahora?",
                "Sin prisa. ¿A dónde?",
                "¿Algo más?",
                "Dime qué necesitas.",
                "¿Qué sigue en tu lista?"
            ],
            it: [
                "Cosa vuoi vedere ora?",
                "Nessuna fretta. Dove andiamo?",
                "Posso aiutarti con altro?",
                "Dimmi di cosa hai bisogno.",
                "Prossima fermata?"
            ],
            pt: [
                "O que quer ver a seguir?",
                "Sem pressa. Para onde?",
                "Mais alguma coisa?",
                "Diga-me do que precisa.",
                "O que se segue na lista?"
            ]
        },
        idleLines: {
            en: [
                "Take your time — I'm right here.",
                "That's the Social Hub vibe.",
                "You're doing great.",
                "There's always something happening around here.",
                "This place has a way of feeling like home.",
                "I've got you if you need anything.",
                "Easy does it.",
                "Good choice.",
                "Let's see what's next.",
                "All part of the experience.",
                "You're exactly where you need to be.",
                "This is what we're about here.",
                "Community starts with the little things.",
                "You'll get the hang of it in no time.",
                "We like to keep things simple.",
                "Welcome to the hub life."
            ],
            fr: [
                "Prenez votre temps — je suis là.",
                "C'est ça, l'ambiance Social Hub.",
                "Vous vous débrouillez bien.",
                "Il se passe toujours quelque chose ici.",
                "Cet endroit finit par ressembler à la maison.",
                "Je suis là si besoin.",
                "Doucement.",
                "Bon choix.",
                "Voyons la suite.",
                "Tout fait partie de l'expérience.",
                "Vous êtes exactement où il faut.",
                "C'est ça, notre philosophie.",
                "La communauté commence par les petites choses.",
                "Vous allez vite comprendre.",
                "On aime la simplicité.",
                "Bienvenue dans la vie du hub."
            ],
            de: [
                "Lassen Sie sich Zeit — ich bin hier.",
                "Das ist der Social Hub Vibe.",
                "Sie machen das toll.",
                "Hier ist immer was los.",
                "Dieser Ort fühlt sich schnell wie zuhause an.",
                "Ich bin für Sie da.",
                "Ganz entspannt.",
                "Gute Wahl.",
                "Mal sehen, was als Nächstes kommt.",
                "Alles Teil des Erlebnisses.",
                "Sie sind genau richtig hier.",
                "Das ist unsere Philosophie.",
                "Community beginnt mit den kleinen Dingen.",
                "Sie werden sich schnell zurechtfinden.",
                "Wir mögen's unkompliziert.",
                "Willkommen im Hub-Leben."
            ],
            es: [
                "Tómate tu tiempo — estoy aquí.",
                "Así es el rollo Social Hub.",
                "Lo estás haciendo genial.",
                "Siempre pasa algo por aquí.",
                "Este lugar acaba sintiéndose como casa.",
                "Estoy aquí si necesitas algo.",
                "Con calma.",
                "Buena elección.",
                "Veamos qué sigue.",
                "Todo es parte de la experiencia.",
                "Estás justo donde tienes que estar.",
                "Esto es lo nuestro.",
                "La comunidad empieza por las pequeñas cosas.",
                "Te acostumbrarás enseguida.",
                "Nos gusta que sea simple.",
                "Bienvenido a la vida del hub."
            ],
            it: [
                "Prenditi il tuo tempo — sono qui.",
                "Questo è il vibe Social Hub.",
                "Stai andando alla grande.",
                "Succede sempre qualcosa qui.",
                "Questo posto finisce per sembrare casa.",
                "Sono qui se hai bisogno.",
                "Con calma.",
                "Buona scelta.",
                "Vediamo cosa c'è dopo.",
                "Fa tutto parte dell'esperienza.",
                "Sei esattamente dove devi essere.",
                "Questa è la nostra filosofia.",
                "La community inizia dalle piccole cose.",
                "Ti ci abituerai in un attimo.",
                "Ci piace tenere le cose semplici.",
                "Benvenuto nella vita del hub."
            ],
            pt: [
                "Leve o tempo que precisar — estou aqui.",
                "É assim o ambiente Social Hub.",
                "Está a ir muito bem.",
                "Há sempre algo a acontecer por aqui.",
                "Este lugar acaba por parecer casa.",
                "Estou aqui se precisar.",
                "Com calma.",
                "Boa escolha.",
                "Vamos ver o que vem a seguir.",
                "Tudo faz parte da experiência.",
                "Está exatamente onde precisa estar.",
                "É isto que defendemos.",
                "A comunidade começa pelas pequenas coisas.",
                "Vai habituar-se rapidamente.",
                "Gostamos de manter as coisas simples.",
                "Bem-vindo à vida do hub."
            ]
        },
        topics: [
            { id: "room", label: { en: "Your Room", fr: "Votre Chambre", de: "Ihr Zimmer", es: "Tu Habitación", it: "La Tua Camera", pt: "O Seu Quarto" }, order: 1 },
            { id: "kitchen", label: { en: "Kitchen", fr: "Cuisine", de: "Küche", es: "Cocina", it: "Cucina", pt: "Cozinha" }, order: 2 },
            { id: "laundry", label: { en: "Laundry", fr: "Laverie", de: "Wäscherei", es: "Lavandería", it: "Lavanderia", pt: "Lavandaria" }, order: 3 },
            { id: "facilities", label: { en: "Facilities", fr: "Installations", de: "Einrichtungen", es: "Instalaciones", it: "Strutture", pt: "Instalações" }, order: 4 },
            { id: "shop", label: { en: "Shop", fr: "Boutique", de: "Shop", es: "Tienda", it: "Negozio", pt: "Loja" }, order: 5 },
            { id: "packages", label: { en: "Packages", fr: "Colis", de: "Pakete", es: "Paquetes", it: "Pacchi", pt: "Encomendas" }, order: 6 },
            { id: "events", label: { en: "Events", fr: "Événements", de: "Events", es: "Eventos", it: "Eventi", pt: "Eventos" }, order: 7 },
            { id: "area", label: { en: "Area", fr: "Quartier", de: "Umgebung", es: "Barrio", it: "Quartiere", pt: "Bairro" }, order: 8 }
        ],
        topicIntros: {
            room: {
                en: ["Here's what to know about your personal space. Extra cleaning is available for 22 euros 50."],
                fr: ["Voici ce qu'il faut savoir sur votre espace personnel. Nettoyage supplémentaire à 22 euros 50."],
                de: ["Hier ist alles über Ihr privates Reich. Zusatzreinigung für 22 Euro 50."],
                es: ["Esto es lo que debes saber de tu espacio. Limpieza extra por 22 euros 50."],
                it: ["Ecco cosa sapere sul tuo spazio personale. Pulizia extra a 22 euro e 50."],
                pt: ["Aqui está o que deve saber sobre o seu espaço. Limpeza extra por 22 euros e 50."]
            },
            kitchen: {
                en: ["The shared kitchen is the heart of the community. Here's how it works."],
                fr: ["La cuisine partagée est le cœur de la communauté. Voici le fonctionnement."],
                de: ["Die Gemeinschaftsküche ist das Herz der Community. So funktioniert sie."],
                es: ["La cocina compartida es el corazón de la comunidad. Así funciona."],
                it: ["La cucina comune è il cuore della community. Ecco come funziona."],
                pt: ["A cozinha partilhada é o coração da comunidade. Veja como funciona."]
            },
            laundry: {
                en: ["Laundry works through the TSH app. You get free tokens every month."],
                fr: ["La lessive fonctionne via l'app TSH. Jetons gratuits chaque mois."],
                de: ["Waschen geht über die TSH app. Sie bekommen monatlich Gratis-Token."],
                es: ["La lavandería va con la app TSH. Tienes fichas gratis cada mes."],
                it: ["La lavanderia funziona con l'app TSH. Hai gettoni gratuiti ogni mese."],
                pt: ["A lavandaria funciona com a app TSH. Tem fichas grátis todos os meses."]
            },
            facilities: {
                en: ["Here's how the shared spaces work."],
                fr: ["Voici le fonctionnement des espaces partagés."],
                de: ["So funktionieren die Gemeinschaftsräume."],
                es: ["Así funcionan los espacios compartidos."],
                it: ["Ecco come funzionano gli spazi comuni."],
                pt: ["É assim que funcionam os espaços partilhados."]
            },
            shop: {
                en: ["Here is our shop basics. Student discount applied. For breakfast, we offer meal bundles — just ask at the front desk."],
                fr: ["Voici l'essentiel de la boutique. Réduction étudiante appliquée. Pour le petit-déjeuner, formules repas — demandez à la réception."],
                de: ["Das Wichtigste zum Shop. Studentenrabatt aktiv. Für Frühstück: Essenspakete — an der Rezeption fragen."],
                es: ["Lo básico de la tienda. Descuento estudiante aplicado. Para desayuno, ofrecemos paquetes de comida — pregunta en recepción."],
                it: ["L'essenziale del negozio. Sconto studenti applicato. Per la colazione, offriamo pacchetti pasto — chiedi alla reception."],
                pt: ["O essencial da loja. Desconto de estudante aplicado. Para pequeno-almoço, oferecemos pacotes de refeições — pergunte na recepção."]
            },
            packages: {
                en: ["For mail and packages, use the Social Hub address and include your room number. When it arrives, the front desk will email you with next steps."],
                fr: ["Pour le courrier et les colis, utilisez l'adresse du Social Hub et ajoutez votre numéro de chambre. Dès réception, la réception vous enverra un email avec la suite."],
                de: ["Für Post und Pakete verwenden Sie die Social Hub Adresse und fügen Sie Ihre Zimmernummer hinzu. Bei Ankunft informiert Sie die Rezeption per E-Mail über die nächsten Schritte."],
                es: ["Para correo y paquetes, usa la dirección de Social Hub e incluye tu número de habitación. Cuando llegue, recepción te enviará un email con los siguientes pasos."],
                it: ["Per posta e pacchi, usa l'indirizzo del Social Hub e aggiungi il numero della tua camera. All'arrivo, la reception ti invierà un'email con i prossimi passi."],
                pt: ["Para correio e encomendas, use o endereço do Social Hub e adicione o número do seu quarto. Quando chegar, a receção enviará um email com os próximos passos."]
            },
            events: {
                en: ["Here's what's happening around the hub."],
                fr: ["Voici ce qui se passe au hub."],
                de: ["Das ist los im Hub."],
                es: ["Esto es lo que pasa en el hub."],
                it: ["Ecco cosa succede nell'hub."],
                pt: ["Aqui está o que se passa no hub."]
            },
            area: {
                en: ["Here's what's nearby in the neighborhood."],
                fr: ["Voici ce qu'il y a dans le quartier."],
                de: ["Das gibt es in der Nachbarschaft."],
                es: ["Esto es lo que hay en el barrio."],
                it: ["Ecco cosa c'è nel quartiere."],
                pt: ["Aqui está o que há no bairro."]
            }
        }
    },
    guest: {
        welcomeLines: {
            en: ["Welcome to The Social Hub. I'll be your digital concierge, here to help you feel at home. Whenever you're ready, I can guide you through everything you need. To get started — are you staying with us as a hotel guest, or as a student?"],
            fr: ["Bienvenue à The Social Hub. Je serai votre concierge digitale, là pour vous aider à vous sentir chez vous. Quand vous voulez, je peux vous guider à chaque étape de votre séjour. Pour commencer — séjournez-vous chez nous en tant que client hôtel, ou étudiant ?"],
            de: ["Willkommen im The Social Hub. Ich bin Ihre digitale Concierge und helfe Ihnen gern, sich hier wohlzufühlen. Wenn Sie möchten, begleite ich Sie durch alles Wichtige. Zum Start — sind Sie bei uns als Hotelgast, oder als Student?"],
            es: ["Bienvenido a The Social Hub. Seré tu concierge digital, aquí para ayudarte a sentirte como en casa. Cuando quieras, te guiaré en todo lo que necesites. Para empezar — ¿te alojas con nosotros como huésped del hotel, o como estudiante?"],
            it: ["Benvenuto a The Social Hub. Sarò la tua concierge digitale, qui per farti sentire subito a casa. Quando vuoi, ti guiderò in tutto ciò di cui hai bisogno. Per iniziare — soggiorni con noi come ospite dell'hotel, o come studente?"],
            pt: ["Bem-vindo ao The Social Hub. Serei a sua concierge digital, aqui para o ajudar a sentir-se em casa. Sempre que quiser, posso guiá-lo em tudo o que precisar. Para começar — está connosco como hóspede do hotel, ou como estudante?"]
        },
        askFirstTimeLines: {
            en: [
                "Lovely. Welcome. Is this your first time staying at The Social Hub, or have you stayed with us before?",
                "Great. I'll help you make the most of your stay. Is this your first time staying at The Social Hub, or have you stayed with us before?"
            ],
            fr: ["Ravissant. Bienvenue. C'est votre première fois au Social Hub ?"],
            de: ["Wunderbar. Willkommen. Sind Sie zum ersten Mal im Social Hub?"],
            es: ["Encantado. Bienvenido. ¿Es tu primera vez en The Social Hub?"],
            it: ["Piacere. Benvenuto. È la prima volta al Social Hub?"],
            pt: ["Encantado. Bem-vindo. É a primeira vez no The Social Hub?"]
        },
        firstTimeConfirmLines: {
            en: ["Great choice. The Social Hub is a bit different — part hotel, part community. I'll show you the important things first."],
            fr: ["Excellent choix. Le Social Hub est unique : mi-hôtel, mi-communauté. Je vous montre l'essentiel."],
            de: ["Gute Wahl. The Social Hub ist anders – halb Hotel, halb Community. Ich zeige Ihnen das Wichtigste zuerst."],
            es: ["Buena elección. The Social Hub es diferente: parte hotel, parte comunidad. Te enseñaré lo importante primero."],
            it: ["Ottima scelta. The Social Hub è diverso: un po' hotel, un po' community. Ti mostro prima le cose importanti."],
            pt: ["Boa escolha. O The Social Hub é diferente: parte hotel, parte comunidade. Vou mostrar-lhe o mais importante primeiro."]
        },
        returningConfirmLines: {
            en: ["Welcome back. Let's find what you need."],
            fr: ["Bon retour parmi nous. Trouvons ce qu'il vous faut."],
            de: ["Willkommen zurück. Finden wir, was Sie brauchen."],
            es: ["Bienvenido de nuevo. Busquemos lo que necesitas."],
            it: ["Bentornato. Troviamo ciò che ti serve."],
            pt: ["Bem-vindo de volta. Vamos encontrar o que precisa."]
        },
        backLines: {
            en: [
                "What would you like to check next?",
                "No rush — where to?",
                "Anything else I can help with?",
                "Let me know what you need.",
                "What's next?"
            ],
            fr: [
                "Que voulez-vous voir ensuite ?",
                "Prenez votre temps. Où aller ?",
                "Puis-je vous aider pour autre chose ?",
                "Dites-moi ce qu'il vous faut.",
                "Et maintenant ?"
            ],
            de: [
                "Was möchten Sie als nächstes sehen?",
                "Keine Eile. Wohin?",
                "Kann ich sonst noch helfen?",
                "Sagen Sie mir, was Sie brauchen.",
                "Was nun?"
            ],
            es: [
                "¿Qué quieres ver ahora?",
                "Sin prisa. ¿A dónde?",
                "¿Algo más?",
                "Dime qué necesitas.",
                "¿Y ahora?"
            ],
            it: [
                "Cosa vuoi vedere ora?",
                "Nessuna fretta. Dove andiamo?",
                "Posso aiutarti con altro?",
                "Dimmi di cosa hai bisogno.",
                "E ora?"
            ],
            pt: [
                "O que quer ver a seguir?",
                "Sem pressa. Para onde?",
                "Mais alguma coisa?",
                "Diga-me do que precisa.",
                "E agora?"
            ]
        },
        idleLines: {
            en: [
                "Take your time  I'm right here.",
                "That's the Social Hub vibe.",
                "All part of what makes us different.",
                "There's always something happening here.",
                "Hope you're enjoying your stay.",
                "I've got you covered.",
                "Easy does it.",
                "Good choice.",
                "Let's see what's next.",
                "You're exactly where you need to be.",
                "This is what we're about.",
                "Part hotel, part community.",
                "You'll feel right at home.",
                "We like to keep things simple.",
                "Welcome to the hub.",
                "Happy to help anytime."
            ],
            fr: [
                "Prenez votre temps  je suis là.",
                "C'est ça, l'ambiance Social Hub.",
                "Tout fait partie de notre différence.",
                "Il se passe toujours quelque chose ici.",
                "J'espère que vous profitez de votre séjour.",
                "Je m'occupe de vous.",
                "Doucement.",
                "Bon choix.",
                "Voyons la suite.",
                "Vous êtes au bon endroit.",
                "C'est ça, notre philosophie.",
                "Mi-hôtel, mi-communauté.",
                "Vous vous sentirez comme chez vous.",
                "On aime la simplicité.",
                "Bienvenue au hub.",
                "Ravi de vous aider."
            ],
            de: [
                "Lassen Sie sich Zeit  ich bin hier.",
                "Das ist der Social Hub Vibe.",
                "Das macht uns anders.",
                "Hier ist immer was los.",
                "Ich hoffe, Sie genießen Ihren Aufenthalt.",
                "Ich kümmere mich um Sie.",
                "Ganz entspannt.",
                "Gute Wahl.",
                "Mal sehen, was kommt.",
                "Sie sind genau richtig hier.",
                "Das ist unsere Philosophie.",
                "Halb Hotel, halb Community.",
                "Sie werden sich wie zuhause fühlen.",
                "Wir mögen's unkompliziert.",
                "Willkommen im Hub.",
                "Gerne behilflich."
            ],
            es: [
                "Tómate tu tiempo  estoy aquí.",
                "Así es el rollo Social Hub.",
                "Todo parte de lo que nos hace diferentes.",
                "Siempre pasa algo aquí.",
                "Espero que disfrutes tu estancia.",
                "Te tengo cubierto.",
                "Con calma.",
                "Buena elección.",
                "Veamos qué sigue.",
                "Estás justo donde tienes que estar.",
                "Esto es lo nuestro.",
                "Parte hotel, parte comunidad.",
                "Te sentirás como en casa.",
                "Nos gusta que sea simple.",
                "Bienvenido al hub.",
                "Feliz de ayudar."
            ],
            it: [
                "Prenditi il tuo tempo  sono qui.",
                "Questo è il vibe Social Hub.",
                "Fa parte di ciò che ci rende diversi.",
                "Succede sempre qualcosa qui.",
                "Spero ti stia piacendo il soggiorno.",
                "Ti seguo io.",
                "Con calma.",
                "Buona scelta.",
                "Vediamo cosa c'è dopo.",
                "Sei esattamente dove devi essere.",
                "Questa è la nostra filosofia.",
                "Un po' hotel, un po' community.",
                "Ti sentirai a casa.",
                "Ci piace tenere le cose semplici.",
                "Benvenuto al hub.",
                "Felice di aiutare."
            ],
            pt: [
                "Leve o tempo que precisar  estou aqui.",
                "É assim o ambiente Social Hub.",
                "Tudo faz parte do que nos torna diferentes.",
                "Há sempre algo a acontecer por aqui.",
                "Espero que esteja a gostar da estadia.",
                "Eu trato de tudo.",
                "Com calma.",
                "Boa escolha.",
                "Vamos ver o que vem a seguir.",
                "Tudo faz parte da experiência.",
                "Está exatamente onde precisa estar.",
                "É isto que defendemos.",
                "Parte hotel, parte comunidade.",
                "Vai sentir-se em casa.",
                "Gostamos de manter as coisas simples.",
                "Bem-vindo ao hub.",
                "Feliz em ajudar."
            ]
        },
        topics: [
            { id: "room", label: { en: "Your Room", fr: "Votre Chambre", de: "Ihr Zimmer", es: "Tu Habitación", it: "La Camera", pt: "Quarto" }, order: 1 },
            { id: "breakfast", label: { en: "Breakfast", fr: "Petit-déjeuner", de: "Frühstück", es: "Desayuno", it: "Colazione", pt: "Pequeno-almoço" }, order: 2 },
            { id: "facilities", label: { en: "Facilities", fr: "Installations", de: "Einrichtungen", es: "Instalaciones", it: "Strutture", pt: "Instalações" }, order: 3 },
            { id: "shop", label: { en: "Shop", fr: "Boutique", de: "Shop", es: "Tienda", it: "Negozio", pt: "Loja" }, order: 4 },
            { id: "events", label: { en: "Events", fr: "Événements", de: "Events", es: "Eventos", it: "Eventi", pt: "Eventos" }, order: 5 },
            { id: "area", label: { en: "Area", fr: "Quartier", de: "Umgebung", es: "Barrio", it: "Quartiere", pt: "Bairro" }, order: 6 }
        ],
        topicIntros: {
            room: {
                en: ["Here's what to know about your stay, from cleaning to WiFi."],
                fr: ["Voici ce qu'il faut savoir, du ménage au WiFi."],
                de: ["Hier ist alles, von der Reinigung bis zum WLAN."],
                es: ["Aquí tienes todo sobre tu estancia, de limpieza a WiFi."],
                it: ["Ecco tutto sulla tua camera, dalla pulizia al WiFi."],
                pt: ["Aqui está tudo sobre a sua estadia, da limpeza ao WiFi."]
            },
            breakfast: {
                en: ["Breakfast is vital. Here's how it works."],
                fr: ["Le petit-déjeuner est vital. Voici comment ça marche."],
                de: ["Frühstück ist wichtig. So läuft es ab."],
                es: ["El desayuno es vital. Así funciona."],
                it: ["La colazione è fondamentale. Ecco come funziona."],
                pt: ["O pequeno-almoço é vital. É assim que funciona."]
            },
            facilities: {
                en: ["Check out our 24/7 gym, laundry, and the pool when it's open."],
                fr: ["Profitez du gym 24/7, de la laverie et de la piscine."],
                de: ["Nutzen Sie Gym 24/7, Wäscherei und Pool."],
                es: ["Disfruta el gym 24/7, lavandería y piscina."],
                it: ["Scopri la palestra 24/7, la lavanderia e la piscina."],
                pt: ["Aproveite o ginásio 24/7, a lavandaria e a piscina."]
            },
            shop: {
                en: ["Our shop is open for daily essentials and latest drops."],
                fr: ["Boutique ouverte pour les essentiels et nos éditions limitées."],
                de: ["Shop für täglichen Bedarf und unsere neuesten Drops offen."],
                es: ["Tienda abierta para básicos y nuestras últimas novedades."],
                it: ["Il negozio è aperto per l'essenziale e le ultime novità."],
                pt: ["A loja está aberta para o essencial e as últimas novidades."]
            },
            events: {
                en: ["Here's what's happening around the hub."],
                fr: ["Voici ce qui se passe au hub."],
                de: ["Das ist los im Hub."],
                es: ["Esto es lo que pasa en el hub."],
                it: ["Ecco cosa succede nell'hub."],
                pt: ["Aqui está o que se passa no hub."]
            },
            area: {
                en: ["Here's what's nearby in the neighborhood."],
                fr: ["Voici ce qu'il y a dans le quartier."],
                de: ["Das gibt es in der Nachbarschaft."],
                es: ["Esto es lo que hay en el barrio."],
                it: ["Ecco cosa c'è nel quartiere."],
                pt: ["Aqui está o que há no bairro."]
            }
        }
    }
};

// LocalStorage functions
const STORAGE_KEY = 'tsh_concierge_flow_config_v1';

export const loadConciergeFlowConfig = (): ConciergeFlowConfig => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored) as ConciergeFlowConfig;
        }
    } catch (e) {
        console.warn('[ConciergeFlowConfig] Failed to load from storage:', e);
    }
    return DEFAULT_CONCIERGE_FLOW_CONFIG;
};

export const saveConciergeFlowConfig = (config: ConciergeFlowConfig) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
        console.error('[ConciergeFlowConfig] Failed to save:', e);
    }
};
