
import React, { useState } from "react";
import { t, Lang } from "../i18n";
import ConciergeFlowEditor from "./ConciergeFlowEditor";

interface AdminHubProps {
  pack: any;
  setPack: (pack: any) => void;
  lang: Lang;
  onExit: () => void;
}

type AdminTab = "info" | "images" | "room" | "hub" | "events" | "area" | "lang" | "concierge";

export default function AdminHub({ pack, setPack, lang, onExit }: AdminHubProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("info");

  // Fix: Made children optional to prevent TS errors when Section is used as a self-closing tag without children.
  const Section = ({ title, children }: { title: string; children?: React.ReactNode }) => (
    <div className="space-y-6 bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-8">
        <h3 className="tsh-subtitle text-xl tracking-tight text-black flex items-center gap-3">
          <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
          {title}
        </h3>
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );

  // Fix: Made children optional to prevent TS errors when Label is used in the Input component.
  const Label = ({ children }: { children?: React.ReactNode }) => (
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 block mb-2 ml-1">
      {children}
    </label>
  );

  const Input = ({ label, value, onChange, placeholder, textarea }: any) => (
    <div className="w-full">
      {label && <Label>{label}</Label>}
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full border border-neutral-200 bg-neutral-50 rounded-xl px-4 py-3 font-medium text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none shadow-sm"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-12 border border-neutral-200 bg-neutral-50 rounded-xl px-4 font-medium text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
        />
      )}
    </div>
  );

  const updateProfile = (path: string, value: any) => {
    const keys = path.split('.');
    const newPack = { ...pack };
    let current = newPack.profile;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setPack(newPack);
  };

  const updateMedia = (key: string, url: string) => {
    const newMedia = pack.media.map((m: any) => m.key === key ? { ...m, url } : m);
    setPack({ ...pack, media: newMedia });
  };

  const addEvent = () => {
    const id = Date.now().toString();
    const newEvent = {
      id,
      title: { en: "New Event" },
      startTime: "12:00",
      location: { en: "Lobby" },
      dayTag: "today",
      image: { kind: "none" },
      description: { en: "Event description" }
    };
    setPack({ ...pack, events: [newEvent, ...pack.events] });
  };

  const languages: { code: Lang; label: string }[] = [
    { code: "en", label: "EN" },
    { code: "fr", label: "FR" },
    { code: "de", label: "DE" },
    { code: "es", label: "ES" },
    { code: "it", label: "IT" },
    { code: "pt", label: "PT" },
  ];

  return (
    <div className="h-full flex flex-col bg-[#F8F9FA] overflow-hidden font-sans">
      {/* Header */}
      <div className="px-10 py-10 bg-white border-b-2 border-black flex items-center justify-between sticky top-0 z-20">
        <div>
          <h1 className="tsh-title text-4xl leading-none text-black">Control Center</h1>
          <p className="tsh-body text-xs font-bold text-neutral-400 mt-2 uppercase tracking-[0.3em]">{t(lang, "admin.subtitle")}</p>
        </div>
        <button
          onClick={onExit}
          className="h-10 px-6 rounded-lg bg-black text-white font-bold text-xs uppercase tracking-widest shadow-md hover:bg-neutral-800 transition-all"
        >
          {t(lang, "admin.exit")}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-white px-8 border-b-2 border-neutral-100 overflow-x-auto no-scrollbar py-2">
        {[
          { id: "info", label: t(lang, "admin.tab.info") },
          { id: "images", label: t(lang, "admin.tab.images") },
          { id: "room", label: t(lang, "admin.tab.room") },
          { id: "hub", label: t(lang, "admin.tab.hub") },
          { id: "events", label: t(lang, "admin.tab.events") },
          { id: "area", label: t(lang, "admin.tab.area") },
          { id: "concierge", label: "Concierge" },
          { id: "lang", label: t(lang, "admin.tab.lang") },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as AdminTab)}
            className={`px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${activeTab === tab.id
              ? "bg-black text-white shadow-md"
              : "text-neutral-500 hover:text-black hover:bg-neutral-100"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-10 space-y-12 bg-[#F8F9FA] pb-40">
        {activeTab === "info" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <Section title={t(lang, "admin.section.profile")}>
              <Input label={t(lang, "admin.profile.hotelName")} value={pack.profile.hotelName} onChange={(v: string) => updateProfile("hotelName", v)} />
              <Input label={t(lang, "admin.profile.location")} value={pack.profile.cityLabel} onChange={(v: string) => updateProfile("cityLabel", v)} />
              <Input label={t(lang, "admin.profile.receptionHelper")} textarea value={pack.profile.phoneDial} onChange={(v: string) => updateProfile("phoneDial", v)} placeholder="e.g. Just reach out from your room phone." />
              <Input label={t(lang, "admin.profile.openingHours")} value={pack.profile.openingHours} onChange={(v: string) => updateProfile("openingHours", v)} />
            </Section>
          </div>
        )}

        {activeTab === "images" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <Section title="Media Library">
              {[
                { key: "hero_paris", label: "Home Hero" },
                { key: "hero_hub", label: "Hub Hero" },
                { key: "hero_room", label: "Room Hero" },
                { key: "hero_events", label: "Events Hero" },
                { key: "concierge_main", label: "Concierge Background" },
              ].map((img) => (
                <div key={img.key} className="flex gap-6 items-end p-6 bg-neutral-50 rounded-2xl border-2 border-neutral-100">
                  <div className="w-32 h-20 rounded-xl overflow-hidden border-2 border-black shrink-0 bg-neutral-200">
                    <img
                      src={pack.media.find((m: any) => m.key === img.key)?.url || ""}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </div>
                  <Input
                    label={img.label}
                    value={pack.media.find((m: any) => m.key === img.key)?.url || ""}
                    onChange={(v: string) => updateMedia(img.key, v)}
                    placeholder="Image URL"
                  />
                </div>
              ))}
            </Section>
          </div>
        )}

        {activeTab === "room" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <Section title={t(lang, "admin.section.housekeeping")}>
              <Input label={t(lang, "admin.label.cleaningGuest")} textarea value={pack.profile.cleaning.guest} onChange={(v: string) => updateProfile("cleaning.guest", v)} />
              <Input label={t(lang, "admin.label.cleaningStudent")} textarea value={pack.profile.cleaning.student} onChange={(v: string) => updateProfile("cleaning.student", v)} />
              <Input label={t(lang, "admin.label.wifiSsid")} value={pack.profile.wifi.ssid} onChange={(v: string) => updateProfile("wifi.ssid", v)} />
              <Input label={t(lang, "admin.label.wifiInstr")} value={pack.profile.wifi.instructions} onChange={(v: string) => updateProfile("wifi.instructions", v)} />
              <Input label={t(lang, "admin.label.amenities")} textarea value={pack.profile.amenities} onChange={(v: string) => updateProfile("amenities", v)} />
              <Input label={t(lang, "admin.label.ac")} textarea value={pack.profile.acInfo} onChange={(v: string) => updateProfile("acInfo", v)} />
            </Section>
          </div>
        )}

        {activeTab === "hub" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <Section title={t(lang, "hub.facilities")}>
              <Input label={t(lang, "admin.hub.facilitiesHours")} textarea value={pack.profile.openingHours} onChange={(v: string) => updateProfile("openingHours", v)} />
              <Input label={t(lang, "admin.hub.breakfastTimes")} value={pack.profile.breakfast.times} onChange={(v: string) => updateProfile("breakfast.times", v)} />
              <Input label={t(lang, "admin.hub.breakfastPrices")} value={pack.profile.breakfast.prices} onChange={(v: string) => updateProfile("breakfast.prices", v)} />
              <Input label={t(lang, "admin.hub.games")} value={pack.profile.gameRoomInfo} onChange={(v: string) => updateProfile("gameRoomInfo", v)} />

              <div className="pt-8 border-t border-neutral-100">
                <Label>Facility Availability</Label>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {[
                    { key: 'hasCinema', label: 'Cinema' },
                    { key: 'hasPool', label: 'Pool' },
                    { key: 'hasCoworking', label: 'Coworking' },
                    { key: 'hasCommunityKitchen', label: 'Community Kitchen' },
                    { key: 'hasSharedKitchens', label: 'Shared Kitchens' },
                    { key: 'hasQuietWorkspace', label: 'Quiet Workspace' }
                  ].map(f => (
                    <button
                      key={f.key}
                      onClick={() => updateProfile(`facilitiesConfig.${f.key}`, !pack.profile.facilitiesConfig?.[f.key])}
                      className={`flex items-center justify-between px-6 py-4 rounded-xl border-2 transition-all ${pack.profile.facilitiesConfig?.[f.key]
                        ? "bg-blue-50 border-blue-600 text-blue-900"
                        : "bg-neutral-50 border-neutral-200 text-neutral-400"
                        }`}
                    >
                      <span className="text-xs font-bold uppercase tracking-wider">{f.label}</span>
                      <div className={`w-4 h-4 rounded-full border-2 ${pack.profile.facilitiesConfig?.[f.key] ? "bg-blue-600 border-blue-600" : "bg-transparent border-neutral-300"
                        }`} />
                    </button>
                  ))}
                </div>
              </div>
            </Section>
          </div>
        )}

        {activeTab === "events" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8">
              <h2 className="tsh-title text-3xl">Active Programming</h2>
              <button
                onClick={addEvent}
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all"
              >
                + Add Event
              </button>
            </div>
            <div className="grid grid-cols-1 gap-8">
              {pack.events.map((ev: any) => (
                <div key={ev.id} className="bg-white border-2 border-black rounded-[2.5rem] p-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.05)] space-y-8">
                  <div className="flex justify-between items-center border-b-2 border-neutral-100 pb-6">
                    <div className="tsh-tag bg-neutral-100 text-neutral-400 border-none shadow-none">ID: {ev.id}</div>
                    <button
                      onClick={() => setPack({ ...pack, events: pack.events.filter((e: any) => e.id !== ev.id) })}
                      className="tsh-tag bg-red-50 text-red-500 border-red-100 shadow-none hover:bg-red-500 hover:text-white transition-all capitalize"
                    >
                      Delete Event
                    </button>
                  </div>
                  <Input
                    label="Event Title"
                    value={ev.title.en}
                    onChange={(v: string) => {
                      const newEvents = pack.events.map((e: any) => e.id === ev.id ? { ...e, title: { ...e.title, en: v } } : e);
                      setPack({ ...pack, events: newEvents });
                    }}
                  />
                  <div className="grid grid-cols-2 gap-8">
                    <Input
                      label="Start Time"
                      value={ev.startTime}
                      onChange={(v: string) => {
                        const newEvents = pack.events.map((e: any) => e.id === ev.id ? { ...e, startTime: v } : e);
                        setPack({ ...pack, events: newEvents });
                      }}
                    />
                    <div className="space-y-2">
                      <Label>Schedule Phase</Label>
                      <select
                        className="w-full h-14 border-2 border-neutral-100 bg-neutral-50 rounded-2xl px-6 font-bold text-sm outline-none focus:border-black transition-all"
                        value={ev.dayTag}
                        onChange={(e) => {
                          const newEvents = pack.events.map((evItem: any) => evItem.id === ev.id ? { ...evItem, dayTag: e.target.value } : evItem);
                          setPack({ ...pack, events: newEvents });
                        }}
                      >
                        <option value="today">Happening Today</option>
                        <option value="week">Coming This Week</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "area" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <Section title="Neighborhood Content">
              <Input label={t(lang, "admin.area.restaurants")} textarea value={pack.profile.area.restaurants} onChange={(v: string) => updateProfile("area.restaurants", v)} />
              <Input label={t(lang, "admin.area.discounts")} textarea value={pack.profile.area.discounts} onChange={(v: string) => updateProfile("area.discounts", v)} />
              <Input label={t(lang, "admin.area.transport")} textarea value={pack.profile.area.transport} onChange={(v: string) => updateProfile("area.transport", v)} />
              <Input label={t(lang, "admin.area.essentials")} textarea value={pack.profile.area.essentials} onChange={(v: string) => updateProfile("area.essentials", v)} />
            </Section>
          </div>
        )}

        {activeTab === "lang" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <Section title="Localization Status">
              <div className="p-8 bg-blue-50 border border-blue-100 rounded-2xl">
                <p className="tsh-body text-sm font-bold text-blue-900 leading-relaxed">
                  The Guest Guide is currently configured for 6 languages. Translations are managed via the global translation engine and provided based on the content keys below.
                </p>
              </div>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 mt-6">
                {languages.map(l => (
                  <div key={l.code} className="w-20 h-20 flex items-center justify-center rounded-2xl border border-neutral-200 bg-white tsh-subtitle text-xl shadow-sm">
                    {l.label}
                  </div>
                ))}
              </div>
            </Section>
          </div>
        )}

        {activeTab === "concierge" && (
          <div className="animate-in fade-in duration-500">
            <ConciergeFlowEditor />
          </div>
        )}
      </div>

      {/* Sync Status Overlay */}
      <div className="fixed bottom-10 right-10 z-50">
        <div className="bg-black text-[#FFE400] px-6 py-4 rounded-full border-2 border-white/20 shadow-2xl flex items-center gap-3">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">Operator Online: Auto-Sync Active</span>
        </div>
      </div>
    </div>
  );
}
