import React, { useState, useEffect } from 'react';
import { Lang, LANG_LABELS } from '../i18n';
import { getRoomNotes, setRoomNotes, clearRoomNotes } from '../services/contextService';

interface Props {
    room: string;
    onClose: () => void;
}

export default function RoomNotesEditor({ room, onClose }: Props) {
    const [lang, setLang] = useState<Lang>('en');
    const [notes, setNotes] = useState<string>('');
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    useEffect(() => {
        loadNotes();
    }, [room, lang]);

    const loadNotes = () => {
        const roomNotes = getRoomNotes(room, lang);
        setNotes(roomNotes || '');
    };

    const handleSave = () => {
        if (notes.trim()) {
            setRoomNotes(room, lang, notes.trim());
            alert(`Notes saved for ${room} (${LANG_LABELS[lang]})`);
        } else {
            alert('Please enter some text or use Clear to remove notes');
        }
    };

    const handleClear = () => {
        clearRoomNotes(room);
        setShowClearConfirm(false);
        setNotes('');
        alert(`All notes cleared for ${room}`);
    };

    const charCount = notes.length;
    const isLong = charCount > 150;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-white rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-black mb-2" style={{ fontFamily: '"Rubik", sans-serif' }}>
                        Room Notes: {room}
                    </h3>
                    <p className="text-sm text-neutral-600">
                        Add informational notes that guests will see (e.g., "This room has a bathtub", "Near elevator")
                    </p>
                </div>

                {/* Language Selector */}
                <div className="mb-4">
                    <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Language</label>
                    <div className="flex gap-2 flex-wrap">
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

                {/* Notes Input */}
                <div className="mb-4">
                    <label className="block text-sm font-bold text-black mb-2">
                        Notes ({LANG_LABELS[lang]})
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                        placeholder="e.g., This room has limited natural light"
                        className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 font-medium text-sm hover:border-black focus:border-black transition-colors resize-none"
                    />
                    <div className={`text-xs mt-1 ${isLong ? 'text-amber-600' : 'text-neutral-500'}`}>
                        {charCount} characters {isLong && '(keep it concise for best readability)'}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={handleSave}
                        disabled={!notes.trim()}
                        className="flex-1 px-6 py-3 rounded-lg bg-black text-white font-bold text-sm uppercase tracking-wider hover:bg-neutral-800 active:scale-95 transition-all disabled:bg-neutral-300 disabled:cursor-not-allowed"
                    >
                        Save Notes
                    </button>
                    <button
                        onClick={() => setShowClearConfirm(true)}
                        className="px-6 py-3 rounded-lg bg-red-100 text-red-700 font-bold text-sm uppercase tracking-wider hover:bg-red-200 active:scale-95 transition-all"
                    >
                        Clear All
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-lg bg-neutral-100 text-black font-bold text-sm uppercase tracking-wider hover:bg-neutral-200 active:scale-95 transition-all"
                    >
                        Close
                    </button>
                </div>

                {/* Info */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-xs font-bold text-blue-900 mb-1">Good to know</div>
                    <div className="text-xs text-blue-700">
                        Notes are informational only. Guests will see them in the Room section. Keep them short and helpful.
                    </div>
                </div>

                {/* Clear Confirmation */}
                {showClearConfirm && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
                            <h4 className="text-xl font-bold text-black mb-4">Clear All Notes?</h4>
                            <p className="text-sm text-neutral-600 mb-6">
                                This will remove notes for ALL languages for room {room}. This action cannot be undone.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowClearConfirm(false)}
                                    className="flex-1 px-6 py-3 rounded-lg bg-neutral-100 text-black font-bold text-sm uppercase tracking-wider hover:bg-neutral-200 active:scale-95 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleClear}
                                    className="flex-1 px-6 py-3 rounded-lg bg-red-600 text-white font-bold text-sm uppercase tracking-wider hover:bg-red-700 active:scale-95 transition-all"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
