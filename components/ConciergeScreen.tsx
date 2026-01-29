
import React, { useState, useEffect } from "react";
import { Lang } from "../i18n";
import { voiceService } from "../services/voiceService";
import { HotelPack } from "../App";
import { getActiveContext, getRoomNotes } from "../services/contextService";
import { getVoiceScript } from "../services/voiceLogic";
import { ScriptScene } from "../services/voiceScripts";
import { getConciergeFlow, ConciergeFlow, ConciergeFlowStep } from "../services/contentService";
import { loadConciergeFlowConfig } from "../services/conciergeFlowConfig";
import { renderTextWithLGEAppLink } from "../utils/lgeAppLinkUtils";

export default function ConciergeScreen({ onBack, onNavigate, lang, t, pack }: { onBack: () => void; onNavigate?: (route: string) => void; lang: Lang; t: (key: string) => string; pack: HotelPack }) {
  // Phases: init -> visitType -> topics -> flow (removed stayType phase - always guest)
  const [phase, setPhase] = useState<"init" | "visitType" | "topics" | "flow">("init");
  const [visitType, setVisitType] = useState<"first" | "start" | null>(null);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [visibleItems, setVisibleItems] = useState<number>(0);

  const [activeFlow, setActiveFlow] = useState<ConciergeFlow | null>(null);
  const [currentStep, setCurrentStep] = useState<ConciergeFlowStep | null>(null);
  const [finalCards, setFinalCards] = useState<any[]>([]);
  const [followUpOptions, setFollowUpOptions] = useState<{ id: string, label: string, next: string }[]>([]);
  const voiceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const lastSpokenKeyRef = React.useRef<string | null>(null);
  const topicsShownRef = React.useRef(false);

  const cinematicBg = "/concierge_bg.png";

  const getSpeechLangCode = (l: Lang) => {
    const map: Record<Lang, string> = { en: "en-GB", fr: "fr-FR", de: "de-DE", es: "es-ES", it: "it-IT", pt: "pt-PT" };
    return map[l] || "en-GB";
  };

  const cData = pack?.concierge;
  if (!cData) return <div className="text-white text-center mt-20">Concierge data missing.</div>;

  const resolveImage = (ref: any) => {
    if (!ref) return "";
    if (ref.kind === "url") return ref.url;
    if (ref.kind === "key") {
      const item = pack.media.find(m => m.key === ref.key);
      return item ? item.url : "";
    }
    return "";
  };

  const speakLegacy = (scene: ScriptScene) => {
    const text = getVoiceScript(scene, lang);
    if (text) {
      voiceService.stopAllAudio();
      voiceService.speakInstant(text, getSpeechLangCode(lang));
    }
  };

  const speakFlow = (step: ConciergeFlowStep) => {
    const pool = step.voice[lang];
    if (!pool || pool.length === 0) {
      console.warn(`[Concierge] Missing voice for lang: ${lang}, step: ${step.id}`);
      return; // Silent failure - better than wrong language
    }
    const text = pool[Math.floor(Math.random() * pool.length)];
    voiceService.stopAllAudio();
    voiceService.speakInstant(text, getSpeechLangCode(lang));
  };

  const clearVoiceTimer = () => {
    if (voiceTimeoutRef.current) {
      clearTimeout(voiceTimeoutRef.current);
      voiceTimeoutRef.current = null;
    }
    voiceService.stopAllAudio();
  };

  // Async voice helper: decouples voice from UI rendering for instant Back responsiveness
  const speakSoon = (text: string) => {
    clearVoiceTimer();
    queueMicrotask(() => {
      voiceService.speakInstant(text, getSpeechLangCode(lang));
    });
  };

  // Config-based voice helper: speaks random line from config array
  const speakConfigLines = (lines: string[] | undefined) => {
    if (!lines || lines.length === 0) return;
    const randomLine = lines[Math.floor(Math.random() * lines.length)];
    voiceService.stopAllAudio();
    voiceService.speakInstant(randomLine, getSpeechLangCode(lang));
  };

  // PHASE 0: Init - go directly to visitType (always guest flow)
  useEffect(() => {
    voiceService.stopAllAudio();
    setVisibleItems(0);

    const startJourney = async () => {
      clearVoiceTimer();
      voiceTimeoutRef.current = setTimeout(() => {
        const config = loadConciergeFlowConfig();
        const welcomeText = config.guest.welcomeLines[lang][0];
        // Use ElevenLabs pre-generated natural voice - after DOM paint
        requestAnimationFrame(() => {
          voiceService.playPreGenerated('welcome', lang, welcomeText);
        });
      }, 200);

      // Skip stayType phase, go directly to visitType
      const journeyTimer = setTimeout(() => {
        setPhase("visitType");
      }, 5000);
      return journeyTimer;
    };

    let journeyTimerId: NodeJS.Timeout | undefined;
    startJourney().then(id => journeyTimerId = id);
    return () => {
      clearVoiceTimer();
      if (journeyTimerId) clearTimeout(journeyTimerId);
    };
  }, [lang]);

  // PHASE 1: Visit Type (now the first interactive phase)
  useEffect(() => {
    if (phase === "visitType") {
      // Immediate mount - all cards visible at once, CSS handles transitions
      setVisibleItems(2);
    }
  }, [phase]);

  const handleVisitSelect = (vType: "first" | "start") => {
    voiceService.stopAllAudio(); // Stop any previous voice
    setVisitType(vType);
    topicsShownRef.current = false;

    // Always use guest flow
    const journeyKey = vType === 'first' ? 'first_time' : 'returning';
    const flow = getConciergeFlow('guest', journeyKey);

    if (flow) {
      setActiveFlow(flow);
      setCurrentStep(flow.steps[0]);
      setPhase("topics");

      clearVoiceTimer();
      voiceTimeoutRef.current = setTimeout(() => {
        const config = loadConciergeFlowConfig();
        const pathConfig = config.guest;

        // Speak confirm line with ElevenLabs - after DOM paint
        const confirmLines = vType === 'first'
          ? pathConfig.firstTimeConfirmLines
          : pathConfig.returningConfirmLines;
        const fallbackText = confirmLines[lang][0];
        const confirmScript = vType === 'first' ? "guest_first_time_confirm" : "guest_returning_confirm";
        requestAnimationFrame(() => {
          voiceService.playPreGenerated(confirmScript, lang, fallbackText);
        });
      }, 200);
    } else {
      console.error("No flow found for guest", journeyKey);
    }
  };

  // PHASE 2: Topics (Flow)
  useEffect(() => {
    if (phase === "topics" && currentStep) {
      topicsShownRef.current = true;
      // Immediate mount - all options visible at once, CSS handles transitions
      setVisibleItems(currentStep.options.length);
    }
  }, [phase, currentStep, visitType]);


  const handleOptionClick = (nextStepId: string) => {
    voiceService.stopAllAudio(); // Stop any previous voice
    if (nextStepId.startsWith("view:")) {
      const topicId = nextStepId.replace("view:", "");
      setActiveTopic(topicId);
      setPhase("flow");

      // Speak per-topic intro from config with ElevenLabs - after DOM paint
      const config = loadConciergeFlowConfig();
      const pathConfig = config.guest;
      const topicIntro = pathConfig.topicIntros[topicId]?.[lang];
      if (topicIntro && topicIntro.length > 0) {
        setTimeout(() => {
          const fallbackText = topicIntro[0];
          const scriptId = `guest_topic_${topicId}`;
          requestAnimationFrame(() => {
            voiceService.playPreGenerated(scriptId, lang, fallbackText);
          });
        }, 300); // Brief delay for UI transition
      }
    } else {
      if (activeFlow) {
        const nextStep = activeFlow.steps.find(s => s.id === nextStepId);
        if (nextStep) {
          setCurrentStep(nextStep);
          clearVoiceTimer();
          speakFlow(nextStep);
        }
      }
    }
  };

  // PHASE 3: Content - always use guest topics
  useEffect(() => {
    if (phase === "flow" && activeTopic && cData.guest?.topics[activeTopic]) {
      voiceService.stopAllAudio();
      setVisibleItems(0);

      const topicData = cData.guest.topics[activeTopic];
      const topic = topicData;

      let ackKey: ScriptScene | null = null;
      switch (activeTopic) {
        case "room": ackKey = "ACK_ROOM"; break;
        case "breakfast": ackKey = "ACK_BREAKFAST"; break;
        case "facilities": ackKey = "ACK_FACILITIES"; break;
        case "events": ackKey = "ACK_EVENTS"; break;
        case "area": ackKey = "ACK_AREA"; break;
        case "shop": ackKey = "ACK_SHOP"; break;
        case "kitchen": ackKey = "ACK_KITCHEN"; break;
        case "laundry": ackKey = "ACK_LAUNDRY"; break;
        case "packages": ackKey = "ACK_PACKAGES"; break;
      }

      // 3. Dynamic Events Handling
      let cards = [...topic.cards];
      let options: { id: string, label: string, next: string }[] = [
        { id: 'back_menu', label: t('navigation.back_to_menu') || "Back to menu", next: 'back' }
      ];

      if (activeTopic === "events") {
        if (pack.events && pack.events.length > 0) {
          cards = pack.events.map(ev => {
            const body: any = {};
            const langs: Lang[] = ['en', 'fr', 'de', 'es', 'it', 'pt'];
            langs.forEach(l => {
              const loc = (ev.location as any)[l] || (ev.location as any)['en'] || (typeof ev.location === 'string' ? ev.location : "");
              body[l] = `${ev.startTime} @ ${loc}`;
            });
            return {
              title: typeof ev.title === 'string' ? { en: ev.title } : ev.title,
              body
            };
          });
          options.unshift({ id: 'this_week', label: t('events.view_this_week') || "See this week", next: 'navigate:events' });
        } else {
          cards = [{
            title: { en: "No Events", fr: "Aucun événement", de: "Keine Events", es: "No hay eventos", it: "Nessun evento", pt: "Nenhum evento" },
            body: {
              en: "Nothing scheduled right now — but check back soon.",
              fr: "Rien de prévu pour le moment — revenez bientôt.",
              de: "Im Moment findet nichts statt – schauen Sie bald wieder vorbei.",
              es: "No hay nada programado ahora — vuelve pronto.",
              it: "Niente in programma al momento — torna presto.",
              pt: "Nada programado de momento — volte em breve."
            }
          }];
          options.unshift({ id: 'ask_desk', label: t('concierge.ask_front_desk') || "Ask front desk", next: 'navigate:ask' });
        }
      }

      // 4. Facility Availability Handling
      const config = pack.profile.facilitiesConfig;
      if (config && (activeTopic === "facilities" || activeTopic === "community" || activeTopic === "kitchen")) {
        const checkAvailability = (title: string) => {
          if (title.includes("Cinema") && !config.hasCinema) return false;
          if (title.includes("Pool") && !config.hasPool) return false;
          if (title.includes("Coffee") && !config.hasCoworking) return false; // Coworking often has coffee
          if (title.includes("Kitchen") && !config.hasCommunityKitchen && !config.hasSharedKitchens) return false;
          if (title.includes("Coworking") && !config.hasCoworking) return false;
          if (title.includes("Workspace") && !config.hasQuietWorkspace) return false;
          return true;
        };

        cards = cards.map(card => {
          const titleEn = card.title.en || "";
          if (!checkAvailability(titleEn)) {
            return {
              ...card,
              body: {
                en: "Not available at this location.",
                fr: "Non disponible ici.",
                de: "An diesem Standort nicht verfügbar.",
                es: "No disponible en esta ubicación.",
                it: "Non disponibile in questa sede.",
                pt: "Não disponível nesta localização."
              }
            };
          }
          return card;
        });
      }

      setFinalCards(cards);
      setFollowUpOptions(options);

      // Voice is handled by topic intro in handleOptionClick (ElevenLabs only)

      // Immediate mount - all cards + buttons visible at once, CSS handles transitions
      setVisibleItems(cards.length + 1); // +1 for follow-up buttons
    }
  }, [phase, activeTopic, pack.events, pack.profile.facilitiesConfig]);

  const handleFollowUp = (next: string) => {
    if (next === 'back') {
      goBack();
    } else if (next.startsWith('navigate:')) {
      const target = next.replace('navigate:', '');
      if (onNavigate) {
        onNavigate(target);
      } else {
        goBack();
      }
    }
  };

  const goBack = () => {
    clearVoiceTimer();
    voiceService.stopAllAudio();
    lastSpokenKeyRef.current = null;

    if (phase === "flow") {
      // Update UI immediately
      setPhase("topics");
      setActiveTopic(null);
      // Immediate mount - cards appear instantly on back navigation
      if (currentStep) {
        setVisibleItems(currentStep.options.length);
      }

      // Voice feedback (non-blocking) - use ElevenLabs idle voices with rotation
      const config = loadConciergeFlowConfig();
      const pathConfig = config.guest;
      const idlePool = pathConfig.idleLines[lang];
      if (idlePool && idlePool.length > 0) {
        // Pick random idle voice (1-12)
        const lastUsed = sessionStorage.getItem('lge_last_idle_index');
        let randomIndex = Math.floor(Math.random() * 12) + 1; // 1-12
        if (lastUsed) {
          const lastIndex = parseInt(lastUsed, 10);
          while (randomIndex === lastIndex) {
            randomIndex = Math.floor(Math.random() * 12) + 1;
          }
        }
        sessionStorage.setItem('lge_last_idle_index', randomIndex.toString());

        const scriptId = `idle_${randomIndex}`;
        const fallbackText = idlePool[randomIndex % idlePool.length];
        // Play idle voice after DOM paint
        requestAnimationFrame(() => {
          voiceService.playPreGenerated(scriptId, lang, fallbackText);
        });
      }
    } else if (phase === "topics") {
      setPhase("visitType");
      setVisitType(null);
      setCurrentStep(null);
      setActiveFlow(null);
      // Immediate mount
      setVisibleItems(2);
    } else {
      clearVoiceTimer();
      onBack();
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white font-sans overflow-hidden flex flex-col">
      <style>{`
        .lge-glow-pulse { animation: glow-pulse 3s infinite ease-in-out; }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 10px rgba(255, 255, 255, 0.05); }
          50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.15); }
        }
      `}</style>

      <div className="absolute inset-0 z-0">
        <img src={cinematicBg} className="w-full h-full object-cover opacity-60" alt="" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
      </div>

      <div className="relative z-30 flex items-center justify-between px-6 py-6 border-b border-white/5">
        <button
          onClick={goBack}
          className="h-10 w-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-lg hover:bg-white/10 transition-all active:scale-90"
        >
          <span className="text-xl pb-1">‹</span>
        </button>
        <span className="text-xs font-medium text-white/50">Digital concierge</span>
        <div className="w-10" />
      </div>

      <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-6 pb-20 w-full max-w-md mx-auto">

        {phase === "init" && (
          <div className="animate-pulse text-white/30 text-xs font-medium">Initializing host...</div>
        )}

        {phase === "visitType" && (
          <div className="w-full space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">{t("concierge.welcome_guest") || "Welcome to Le Grand Éclipse"}</h2>
              <p className="text-sm text-white/60">{t("concierge.first_time_question") || "Is this your first time with us?"}</p>
            </div>
            <div className={`transition-all duration-700 ${visibleItems >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <button onClick={() => handleVisitSelect("first")} className="w-full h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center gap-4 hover:bg-white/20 transition-all active:scale-95">
                <div className="text-lg font-bold text-white">{t("concierge.visitType.first") || "First time"}</div>
              </button>
            </div>
            <div className={`transition-all duration-700 ${visibleItems >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <button onClick={() => handleVisitSelect("start")} className="w-full h-20 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center gap-4 hover:bg-white/10 transition-all active:scale-95">
                <div className="text-lg font-bold text-white/80">{t("concierge.visitType.returning") || "I've been here before"}</div>
              </button>
            </div>
          </div>
        )}

        {phase === "topics" && currentStep && (
          <div className="w-full">
            <div className="space-y-3">
              {currentStep.options.map((opt, i) => {
                return (
                  <div key={opt.id} className={`transition-all duration-500 ${i < visibleItems ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <button
                      onClick={() => handleOptionClick(opt.nextStepId)}
                      className="w-full h-16 rounded-xl flex items-center justify-center text-sm font-semibold tracking-wide border border-white/10 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 transition-all active:scale-95"
                    >
                      {opt.label[lang] || opt.label["en"]}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {phase === "flow" && activeTopic && cData.guest?.topics[activeTopic] && (
          <div className="w-full space-y-6 pb-12">
            <div className="animate-in fade-in slide-in-from-top-2 duration-500 text-center mb-8">
              <h2 className="text-3xl font-bold text-white tracking-tight drop-shadow-xl" style={{ fontFamily: '"Rubik", sans-serif' }}>{cData.guest.topics[activeTopic].label[lang]}</h2>
            </div>
            {/* Topic Cards */}
            {finalCards.map((card: any, idx: number) => (
              <div key={idx} className={`bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-lg transition-all duration-700 ${idx < visibleItems ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {card.image && (
                  <div className="h-32 w-full relative overflow-hidden bg-neutral-900">
                    <img src={resolveImage(card.image)} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xs font-bold text-blue-200 mb-2 opacity-80">{card.title[lang] || card.title['en']}</h3>
                  <p className="text-white text-lg font-medium leading-relaxed">{renderTextWithLGEAppLink(card.body[lang] || card.body['en'])}</p>
                </div>
              </div>
            ))}

            {/* Follow-up Options */}
            <div className={`pt-4 space-y-3 transition-all duration-700 ${visibleItems > finalCards.length ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-center mb-4">What next?</div>
              {followUpOptions.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleFollowUp(opt.next)}
                  className={`w-full h-14 rounded-xl border border-white/20 backdrop-blur-md text-white font-bold text-sm transition-all hover:bg-white/10 active:scale-95 ${opt.next === 'back' ? 'bg-white/10 hover:bg-white/20' : 'bg-white/5'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
