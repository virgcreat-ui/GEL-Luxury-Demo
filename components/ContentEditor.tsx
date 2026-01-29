import React, { useState, useEffect } from 'react';
import { Lang, LANG_LABELS } from '../i18n';
import {
    ContentSection,
    RoomContent,
    EventsContent,
    AreaContent,
    ConciergeContent,
    getSectionContent,
    updateSectionContent,
    resetSection,
    DEFAULT_ROOM_CONTENT,
    DEFAULT_EVENTS_CONTENT,
    DEFAULT_AREA_CONTENT,
    DEFAULT_CONCIERGE_CONTENT
} from '../services/contentService';

interface Field {
    key: string;
    label: string;
    multiline: boolean;
}

interface Props {
    section: ContentSection;
    onBack: () => void;
}

export default function ContentEditor({ section, onBack }: Props) {
    const [lang, setLang] = useState<Lang>('en');
    const [content, setContent] = useState<any>({});
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    useEffect(() => {
        loadContent();
    }, [section, lang]);

    const loadContent = () => {
        const data = getSectionContent<any>(section, lang);
        const defaults = getDefaults(section, lang);
        setContent({ ...defaults, ...data });
    };

    const getDefaults = (sec: ContentSection, l: Lang): any => {
        const map: Record<ContentSection, any> = {
            hub: {},
            room: DEFAULT_ROOM_CONTENT[l],
            events: DEFAULT_EVENTS_CONTENT[l],
            area: DEFAULT_AREA_CONTENT[l],
            concierge: DEFAULT_CONCIERGE_CONTENT[l]
        };
        return map[sec] || {};
    };

    const fields = getSectionFields(section);

    const handleChange = (key: string, value: string) => {
        setContent((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        try {
            updateSectionContent(section, lang, content);
            alert(`${getSectionLabel(section)} saved for ${LANG_LABELS[lang]}`);
        } catch (error) {
            alert('Failed to save. Please try again.');
        }
    };

    const handleReset = () => {
        resetSection(section);
        setShowResetConfirm(false);
        loadContent();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl border-2 border-neutral-200 p-6">
                <button
                    onClick={onBack}
                    className="mb-4 text-sm text-neutral-600 hover:text-black font-medium transition-colors"
                >
                    ← Back to Sections
                </button>

                <h2 className="text-2xl font-bold text-black mb-2" style={{ fontFamily: '"Rubik", sans-serif' }}>
                    {getSectionLabel(section)}
                </h2>

                <p className="text-sm text-neutral-600 mb-6">
                    {getSectionDescription(section)}
                </p>

                {/* Language Selector */}
                <div>
                    <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Language</label>
                    <div className="flex gap-2">
                        {(['en', 'fr', 'de', 'es', 'it', 'pt'] as Lang[]).map(l => (
                            <button
                                key={l}
                                onClick={() => setLang(l)}
                                className={`px-4 py-2 rounded-lg border-2 font-bold text-xs uppercase tracking-wider transition-all ${lang === l
                                    ? 'border-black bg-black text-white'
                                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-black'
                                    }`}
                            >
                                {LANG_LABELS[l]}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Field Editors */}
            <div className="bg-white rounded-2xl border-2 border-neutral-200 p-6 space-y-6">
                {fields.map(field => (
                    <div key={field.key}>
                        <label className="block text-sm font-bold text-black mb-2">
                            {field.label}
                        </label>
                        {field.multiline ? (
                            <textarea
                                value={content[field.key] || ''}
                                onChange={(e) => handleChange(field.key, e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 font-medium text-sm hover:border-black focus:border-black transition-colors resize-none"
                            />
                        ) : (
                            <input
                                type="text"
                                value={content[field.key] || ''}
                                onChange={(e) => handleChange(field.key, e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 font-medium text-sm hover:border-black focus:border-black transition-colors"
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <button
                    onClick={handleSave}
                    className="flex-1 px-6 py-4 rounded-lg bg-black text-white font-bold text-sm uppercase tracking-wider hover:bg-neutral-800 active:scale-95 transition-all"
                >
                    Save Changes
                </button>
                <button
                    onClick={() => setShowResetConfirm(true)}
                    className="px-6 py-4 rounded-lg bg-red-100 text-red-700 font-bold text-sm uppercase tracking-wider hover:bg-red-200 active:scale-95 transition-all"
                >
                    Reset to Defaults
                </button>
            </div>

            {/* Reset Confirmation */}
            {showResetConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
                        <h3 className="text-2xl font-bold text-black mb-4">Reset {getSectionLabel(section)}?</h3>
                        <p className="text-sm text-neutral-600 mb-8 leading-relaxed">
                            This will restore all default content for this section (all languages). Changes cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowResetConfirm(false)}
                                className="flex-1 h-14 rounded-xl bg-neutral-100 text-black font-bold text-sm uppercase tracking-wider hover:bg-neutral-200 active:scale-95 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReset}
                                className="flex-1 h-14 rounded-xl bg-red-600 text-white font-bold text-sm uppercase tracking-wider hover:bg-red-700 active:scale-95 transition-all shadow-lg"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function getSectionFields(section: ContentSection): Field[] {
    const schemas: Record<ContentSection, Field[]> = {
        hub: [],
        room: [
            { key: 'cleaning_rules', label: 'Cleaning Rules', multiline: true },
            { key: 'amenities_desc', label: 'Amenities Description', multiline: true },
            { key: 'wifi_desc', label: 'WiFi Description', multiline: false },
            { key: 'ac_info', label: 'AC/Temperature Info', multiline: false },
            { key: 'house_rules', label: 'House Rules', multiline: true }
        ],
        events: [
            { key: 'today_intro', label: 'Today Events Intro', multiline: true },
            { key: 'week_intro', label: 'Weekly Events Intro', multiline: true },
            { key: 'empty_state', label: 'No Events Message', multiline: false },
            { key: 'cta_phrase', label: 'CTA Button Text', multiline: false }
        ],
        area: [
            { key: 'restaurants_intro', label: 'Restaurants Intro', multiline: true },
            { key: 'transport_info', label: 'Transport Information', multiline: true },
            { key: 'local_tips', label: 'Local Tips', multiline: true },
            { key: 'partner_disclaimer', label: 'Partner Disclaimer', multiline: false }
        ],
        concierge: [
            { key: 'welcome_sentence', label: 'Welcome Sentence', multiline: false },
            { key: 'guest_transition', label: 'Guest Transition Line', multiline: false },
            { key: 'friendly_filler_1', label: 'Friendly Phrase #1 (e.g., "Good choice!")', multiline: false },
            { key: 'friendly_filler_2', label: 'Friendly Phrase #2 (e.g., "Nice one!")', multiline: false },
            { key: 'friendly_filler_3', label: 'Friendly Phrase #3 (e.g., "Great question!")', multiline: false },
            { key: 'human_fallback', label: 'Human Fallback Message', multiline: false }
        ]
    };
    return schemas[section] || [];
}

function getSectionLabel(section: ContentSection): string {
    const labels: Record<ContentSection, string> = {
        hub: 'Hub Content',
        room: 'Room Content',
        events: 'Events Content',
        area: 'Around the Area',
        concierge: 'Concierge Scripts'
    };
    return labels[section];
}

function getSectionDescription(section: ContentSection): string {
    const descriptions: Record<ContentSection, string> = {
        hub: 'Customize content for social spaces, breakfast, and facilities.',
        room: 'Edit cleaning rules, amenities descriptions, WiFi info, and house rules.',
        events: 'Customize event intros, empty states, and call-to-action phrases.',
        area: 'Edit restaurant recommendations, transport info, and local tips.',
        concierge: 'Customize AI assistant welcome messages, transitions, and friendly phrases.'
    };
    return descriptions[section];
}
