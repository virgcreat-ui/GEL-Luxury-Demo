
import React, { useState, useRef, useEffect } from "react";
import { t } from "../i18n";
import { ImageSlot } from "../services/imageSlots";
import { getImageForSlot } from "../services/imageService";

export type LanguageCode = "en" | "fr" | "de" | "es" | "it" | "pt";

type Props = {
  lang: LanguageCode;
  setLang: (l: LanguageCode) => void;
  navigate: (route: string, params?: any) => void;
  hotelName?: string;
  hotelSubtitle?: string;
  heroUrl?: string;
  onAdminRequest?: () => void;
};

const ADMIN_CODE = "2026";
const TAP_WINDOW_MS = 3000;
const REQUIRED_TAPS = 8;

export default function WelcomeScreen({
  lang,
  setLang,
  navigate,
  hotelName = "Le Grand Éclipse",
  hotelSubtitle = "Paris",
  heroUrl = "/assets/images/exterior.png",
  onAdminRequest,
}: Props) {
  const [taps, setTaps] = useState(0);
  const lastTapRef = useRef(Date.now());
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Image system integration
  const [heroImage, setHeroImage] = useState(heroUrl);
  const [hubCardImage, setHubCardImage] = useState('/assets/images/lobby.png');
  const [roomCardImage, setRoomCardImage] = useState('/assets/images/guest_room.png');
  const [eventsCardImage, setEventsCardImage] = useState('/assets/images/terrace.png');
  const [areaCardImage, setAreaCardImage] = useState('/assets/images/local.png');

  useEffect(() => {
    // Load custom images if assigned
    Promise.all([
      getImageForSlot(ImageSlot.HOME_HERO),
      getImageForSlot(ImageSlot.HOME_CARD_HUB),
      getImageForSlot(ImageSlot.HOME_CARD_ROOM),
      getImageForSlot(ImageSlot.HOME_CARD_EVENTS),
      getImageForSlot(ImageSlot.HOME_CARD_AREA)
    ]).then(([hero, hub, room, events, area]) => {
      setHeroImage(hero);
      setHubCardImage(hub);
      setRoomCardImage(room);
      setEventsCardImage(events);
      setAreaCardImage(area);
    });
  }, []);
  const [adminCode, setAdminCode] = useState("");
  const [codeError, setCodeError] = useState(false);

  const handleTitleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < TAP_WINDOW_MS) {
      const nextTaps = taps + 1;
      if (nextTaps >= REQUIRED_TAPS) {
        setShowAdminModal(true);
        setTaps(0);
      } else {
        setTaps(nextTaps);
      }
    } else {
      setTaps(1);
    }
    lastTapRef.current = now;
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminCode === ADMIN_CODE) {
      setShowAdminModal(false);
      setAdminCode("");
      setCodeError(false);
      navigate("admin");
    } else {
      setCodeError(true);
      setTimeout(() => setCodeError(false), 600);
    }
  };

  const handleCloseModal = () => {
    setShowAdminModal(false);
    setAdminCode("");
    setCodeError(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#000] overflow-x-hidden font-sans flex flex-col">
      {/* 1) HERO SECTION */}
      <div className="relative h-[40vh] w-full shrink-0">
        <img
          src={heroImage}
          alt="Welcome to Paris"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* TOP RIGHT LANGUAGE */}
        <div className="absolute top-6 right-6 z-[60]">
          {/* This comes from App.tsx usually, but we can position a trigger here */}
        </div>

        {/* TEXT OVER HERO */}
        <div className="absolute bottom-12 left-8 right-8">
          <h1
            onClick={handleTitleTap}
            className="lge-title text-3xl sm:text-4xl font-medium text-white select-none cursor-default active:opacity-80 drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)] mb-2"
          >
            {t(lang, "home.welcomeTitle")}
          </h1>
          <p className="text-white/80 text-sm font-light tracking-wide drop-shadow-md">
            {t(lang, "home.welcomeSubheading")}
          </p>
        </div>
      </div>

      {/* 2) MENU SECTION */}
      <div className="flex-1 px-6 pt-10 pb-6 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          <MenuCard
            title={t(lang, "home.menu.hub")}
            imageUrl={hubCardImage}
            color="var(--lge-yellow)"
            onClick={() => navigate("list", { category: "hub" })}
          />
          <MenuCard
            title={t(lang, "home.menu.room")}
            imageUrl={roomCardImage}
            color="var(--lge-pink)"
            onClick={() => navigate("list", { category: "room" })}
          />
          <MenuCard
            title={t(lang, "home.menu.events")}
            imageUrl={eventsCardImage}
            color="var(--lge-green)"
            onClick={() => navigate("events-list")}
          />
          <MenuCard
            title={t(lang, "home.menu.around")}
            imageUrl={areaCardImage}
            color="var(--lge-blue)"
            onClick={() => navigate("list", { category: "neighborhood" })}
          />
        </div>
      </div>

      {/* 3) DIGITAL CONCIERGE CTA - FOOTER */}
      <div className="shrink-0 px-6 py-6 pb-12 z-20">
        <div className="max-w-[400px] mx-auto">
          <button
            onClick={() => navigate("ask")}
            className="w-full h-20 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-center relative group overflow-hidden shadow-2xl transition-transform active:scale-[0.98]"
          >
            {/* Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFE400]/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Text with Glow */}
            <span className="relative z-10 font-bold text-xl tracking-wider text-[#FFE400] drop-shadow-[0_0_10px_rgba(255,228,0,0.4)] group-hover:drop-shadow-[0_0_15px_rgba(255,228,0,0.7)] transition-all" style={{ fontFamily: '"Rubik", sans-serif' }}>
              {t(lang, "home.aiConcierge")}
            </span>
          </button>
        </div>
      </div>

      {/* ADMIN ACCESS MODAL */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div
            className={`w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl animate-in slide-in-from-bottom-10 duration-300 ${codeError ? 'animate-shake' : ''
              }`}
          >
            <h3 className="text-2xl font-bold text-black mb-2" style={{ fontFamily: '"Rubik", sans-serif' }}>
              Admin Access
            </h3>
            <p className="text-sm text-neutral-600 mb-6">
              Enter the access code to continue
            </p>

            <form onSubmit={handleCodeSubmit}>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                placeholder="Enter code"
                autoFocus
                className={`w-full h-16 px-6 rounded-xl border-2 font-bold text-2xl text-center tracking-widest transition-all outline-none ${codeError
                  ? 'border-red-500 bg-red-50 text-red-600'
                  : 'border-neutral-200 bg-neutral-50 text-black focus:border-black focus:bg-white'
                  }`}
              />

              {codeError && (
                <p className="text-sm text-red-600 font-medium mt-2 text-center animate-in fade-in duration-150">
                  Incorrect access code
                </p>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 h-14 rounded-xl bg-neutral-100 text-black font-medium text-sm hover:bg-neutral-200 active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-14 rounded-xl bg-black text-white font-medium text-sm hover:bg-neutral-800 active:scale-95 transition-all shadow-lg"
                >
                  Enter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}

function MenuCard({ title, imageUrl, color, onClick }: { title: string; imageUrl: string; color: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative h-44 w-full overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-all duration-500 group"
    >
      <img
        src={imageUrl}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {/* Bottom Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />

      {/* Title directly on image */}
      <div className="absolute bottom-5 left-5 right-5 text-left">
        <h3 className="text-white font-semibold text-lg tracking-tight drop-shadow-md">
          {title}
        </h3>
      </div>
    </button>
  );
}
