import React from "react";
import { Lang, t } from "../i18n";

interface BreakfastCardProps {
  lang: Lang;
  onBack: () => void;
}

export default function BreakfastCard({ lang, onBack }: BreakfastCardProps) {
  const hero =
    "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80"; // breakfast vibe

  return (
    <div className="h-full bg-[#F7F7F7] text-[#111] overflow-y-auto">
      <div className="mx-auto w-full max-w-[420px] px-4 py-4">
        <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-sm border border-black/5">
          <div className="relative">
            <img src={hero} alt="Breakfast" className="h-[240px] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <div className="absolute left-6 top-6">
              <button
                onClick={onBack}
                className="rounded-xl bg-white/95 h-10 w-10 flex items-center justify-center text-xl font-bold shadow-sm border border-black/5"
              >
                ‹
              </button>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="text-4xl font-black text-white uppercase tracking-tighter leading-none">{t(lang, "breakfast_title")}</div>
              <div className="mt-3 h-[4px] w-16 rounded-full bg-[#FFE400]" />
            </div>
          </div>

          <div className="p-6">
            <ul className="space-y-4 text-[15px] leading-relaxed">
              <li className="rounded-2xl bg-[#F9FAFB] p-5 flex gap-4 items-start border border-black/5">
                <span className="font-black text-lg leading-none mt-1">1.</span> 
                <span className="font-medium">{t(lang, "breakfast_1")}</span>
              </li>
              <li className="rounded-2xl bg-[#F9FAFB] p-5 flex gap-4 items-start border border-black/5">
                <span className="font-black text-lg leading-none mt-1">2.</span> 
                <span className="font-medium">{t(lang, "breakfast_2")}</span>
              </li>
              <li className="rounded-2xl bg-[#F9FAFB] p-5 flex gap-4 items-start border border-black/5">
                <span className="font-black text-lg leading-none mt-1">3.</span> 
                <span className="font-medium">{t(lang, "breakfast_3")}</span>
              </li>
            </ul>

            <div className="mt-8 rounded-[2rem] border border-black/5 bg-[#F9FAFB] p-6">
              <div className="text-[10px] font-black tracking-[0.2em] text-neutral-400 uppercase mb-2">
                RECEPTION TIP
              </div>
              <div className="text-sm text-neutral-800 font-bold leading-snug">
                {t(lang, "frontdesk_tip")}
              </div>
              <a
                href="tel:9"
                className="mt-6 block w-full rounded-2xl bg-black px-4 py-4 text-center text-xs font-black text-white uppercase tracking-widest shadow-lg active:scale-95 transition-transform"
              >
                Dial front desk (9)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
