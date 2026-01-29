import React, { useState, useEffect } from 'react';
import { Lang, LANG_LABELS } from '../i18n';
import { getAllHubContent, updateHubContent, resetHubContent } from '../services/configService';
import { HubContent } from '../services/hubContent';

interface HubContentEditorProps {
    onSave?: () => void;
}

export default function HubContentEditor({ onSave }: HubContentEditorProps) {
    const [lang, setLang] = useState<Lang>('en');
    const [content, setContent] = useState<HubContent | null>(null);
    const [isDirty, setIsDirty] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = () => {
        const hubContent = getAllHubContent();
        setContent(hubContent);
        setIsDirty(false);
    };

    const handleChange = (category: keyof HubContent, field: string, value: string) => {
        if (!content) return;

        setContent(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                [category]: {
                    ...prev[category],
                    [field]: {
                        ...(prev[category] as any)[field],
                        [lang]: value
                    }
                }
            };
        });
        setIsDirty(true);
    };

    const handleSave = () => {
        if (!content) return;

        try {
            // Save all changes
            Object.entries(content).forEach(([category, fields]) => {
                Object.entries(fields).forEach(([field, translations]) => {
                    const value = (translations as Record<Lang, string>)[lang];
                    if (value !== undefined) {
                        updateHubContent(category as keyof HubContent, field, lang, value);
                    }
                });
            });

            setIsDirty(false);
            onSave?.();
            alert('Hub content saved successfully!');
        } catch (error) {
            console.error('Failed to save:', error);
            alert('Failed to save content. Check console for details.');
        }
    };

    const handleReset = () => {
        try {
            resetHubContent();
            loadContent();
            setShowResetConfirm(false);
            alert('Hub content reset to defaults!');
        } catch (error) {
            console.error('Failed to reset:', error);
            alert('Failed to reset content. Check console for details.');
        }
    };

    if (!content) {
        return <div className="p-6 text-center text-neutral-500">Loading...</div>;
    }

    const getValue = (category: keyof HubContent, field: string): string => {
        return ((content[category] as any)[field] as Record<Lang, string>)[lang] || '';
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            {/* Language Selector */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-black mb-1">Hub Content Editor</h3>
                    <p className="text-sm text-neutral-600">Edit Hub section text for each language</p>
                </div>
                <div className="flex items-center gap-3">
                    <label className="text-sm font-bold text-neutral-600 uppercase tracking-wider">Language:</label>
                    <select
                        value={lang}
                        onChange={(e) => setLang(e.target.value as Lang)}
                        className="px-4 py-2 rounded-lg border-2 border-neutral-200 font-bold text-sm bg-white hover:border-black transition-colors"
                    >
                        {(Object.keys(LANG_LABELS) as Lang[]).map((l) => (
                            <option key={l} value={l}>
                                {LANG_LABELS[l]}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Breakfast Section */}
            <div className="bg-white rounded-xl border-2 border-neutral-200 p-6 space-y-4">
                <h4 className="text-sm font-bold text-black uppercase tracking-wider border-b pb-2">Breakfast</h4>

                <div>
                    <label className="block text-xs font-bold text-neutral-600 mb-2 uppercase tracking-wider">Title</label>
                    <input
                        type="text"
                        value={getValue('breakfast', 'title')}
                        onChange={(e) => handleChange('breakfast', 'title', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:border-black outline-none"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-neutral-600 mb-2 uppercase tracking-wider">Weekday Hours</label>
                        <input
                            type="text"
                            value={getValue('breakfast', 'hoursWeekdays')}
                            onChange={(e) => handleChange('breakfast', 'hoursWeekdays', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:border-black outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-neutral-600 mb-2 uppercase tracking-wider">Weekend Hours</label>
                        <input
                            type="text"
                            value={getValue('breakfast', 'hoursWeekends')}
                            onChange={(e) => handleChange('breakfast', 'hoursWeekends', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:border-black outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-neutral-600 mb-2 uppercase tracking-wider">Standard Price</label>
                        <input
                            type="text"
                            value={getValue('breakfast', 'price')}
                            onChange={(e) => handleChange('breakfast', 'price', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:border-black outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-neutral-600 mb-2 uppercase tracking-wider">Same-Day Price</label>
                        <input
                            type="text"
                            value={getValue('breakfast', 'lastMinutePrice')}
                            onChange={(e) => handleChange('breakfast', 'lastMinutePrice', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:border-black outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-neutral-600 mb-2 uppercase tracking-wider">Paris Note (Breakfast Only)</label>
                    <textarea
                        value={getValue('breakfast', 'note')}
                        onChange={(e) => handleChange('breakfast', 'note', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:border-black outline-none resize-none"
                    />
                </div>
            </div>

            {/* Shop Section */}
            <div className="bg-white rounded-xl border-2 border-neutral-200 p-6 space-y-4">
                <h4 className="text-sm font-bold text-black uppercase tracking-wider border-b pb-2">LGE Shop</h4>

                <div>
                    <label className="block text-xs font-bold text-neutral-600 mb-2 uppercase tracking-wider">Title</label>
                    <input
                        type="text"
                        value={getValue('shop', 'title')}
                        onChange={(e) => handleChange('shop', 'title', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:border-black outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-neutral-600 mb-2 uppercase tracking-wider">Caption</label>
                    <textarea
                        value={getValue('shop', 'caption')}
                        onChange={(e) => handleChange('shop', 'caption', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:border-black outline-none resize-none"
                    />
                </div>
            </div>

            {/* Facilities Section */}
            <div className="bg-white rounded-xl border-2 border-neutral-200 p-6 space-y-4">
                <h4 className="text-sm font-bold text-black uppercase tracking-wider border-b pb-2">Facilities</h4>

                <div>
                    <label className="block text-xs font-bold text-neutral-600 mb-2 uppercase tracking-wider">Title</label>
                    <input
                        type="text"
                        value={getValue('facilities', 'title')}
                        onChange={(e) => handleChange('facilities', 'title', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:border-black outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-neutral-600 mb-2 uppercase tracking-wider">Caption</label>
                    <input
                        type="text"
                        value={getValue('facilities', 'caption')}
                        onChange={(e) => handleChange('facilities', 'caption', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:border-black outline-none"
                    />
                </div>
            </div>

            {/* Spa & Wellness Section */}
            <div className="bg-white rounded-xl border-2 border-neutral-200 p-6 space-y-4">
                <h4 className="text-sm font-bold text-black uppercase tracking-wider border-b pb-2">🧖 Spa & Wellness</h4>

                <div>
                    <label className="block text-xs font-bold text-neutral-600 mb-2 uppercase tracking-wider">Title</label>
                    <input
                        type="text"
                        value={getValue('spa', 'title')}
                        onChange={(e) => handleChange('spa', 'title', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:border-black outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-neutral-600 mb-2 uppercase tracking-wider">Caption</label>
                    <textarea
                        value={getValue('spa', 'caption')}
                        onChange={(e) => handleChange('spa', 'caption', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:border-black outline-none resize-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-neutral-600 mb-2 uppercase tracking-wider">Hours</label>
                    <input
                        type="text"
                        value={getValue('spa', 'hours')}
                        onChange={(e) => handleChange('spa', 'hours', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:border-black outline-none"
                    />
                </div>
            </div>

            {/* Gym Section */}
            <div className="bg-white rounded-xl border-2 border-neutral-200 p-6 space-y-4">
                <h4 className="text-sm font-bold text-black uppercase tracking-wider border-b pb-2">💪 State-of-the-Art Gym</h4>

                <div>
                    <label className="block text-xs font-bold text-neutral-600 mb-2 uppercase tracking-wider">Title</label>
                    <input
                        type="text"
                        value={getValue('gym', 'title')}
                        onChange={(e) => handleChange('gym', 'title', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:border-black outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-neutral-600 mb-2 uppercase tracking-wider">Caption</label>
                    <textarea
                        value={getValue('gym', 'caption')}
                        onChange={(e) => handleChange('gym', 'caption', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:border-black outline-none resize-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-neutral-600 mb-2 uppercase tracking-wider">Access Info</label>
                    <input
                        type="text"
                        value={getValue('gym', 'access')}
                        onChange={(e) => handleChange('gym', 'access', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:border-black outline-none"
                    />
                </div>
            </div>

            {/* Fine Dining Section */}
            <div className="bg-white rounded-xl border-2 border-neutral-200 p-6 space-y-4">
                <h4 className="text-sm font-bold text-black uppercase tracking-wider border-b pb-2">🍽️ Fine Dining</h4>

                <div>
                    <label className="block text-xs font-bold text-neutral-600 mb-2 uppercase tracking-wider">Title</label>
                    <input
                        type="text"
                        value={getValue('dining', 'title')}
                        onChange={(e) => handleChange('dining', 'title', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:border-black outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-neutral-600 mb-2 uppercase tracking-wider">Caption</label>
                    <textarea
                        value={getValue('dining', 'caption')}
                        onChange={(e) => handleChange('dining', 'caption', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:border-black outline-none resize-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-neutral-600 mb-2 uppercase tracking-wider">Hours & Reservations</label>
                    <input
                        type="text"
                        value={getValue('dining', 'hours')}
                        onChange={(e) => handleChange('dining', 'hours', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:border-black outline-none"
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
                <button
                    onClick={handleSave}
                    disabled={!isDirty}
                    className={`flex-1 h-14 rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-lg ${isDirty
                        ? 'bg-black text-white hover:bg-neutral-800 active:scale-95'
                        : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                        }`}
                >
                    {isDirty ? 'Save Changes' : 'No Changes'}
                </button>
                <button
                    onClick={() => setShowResetConfirm(true)}
                    className="px-6 h-14 rounded-xl bg-red-100 text-red-700 font-bold text-sm uppercase tracking-wider hover:bg-red-200 active:scale-95 transition-all"
                >
                    Reset to Defaults
                </button>
            </div>

            {/* Reset Confirmation Modal */}
            {showResetConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
                        <h3 className="text-2xl font-bold text-black mb-4">Reset Hub Content?</h3>
                        <p className="text-sm text-neutral-600 mb-8 leading-relaxed">
                            This will restore all Hub section text to factory defaults. Custom edits will be lost.
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
