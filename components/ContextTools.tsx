import React, { useState, useEffect } from 'react';
import {
    getActiveContext,
    clearActiveContext,
    resetRoomOverrides,
    resetFloorOverrides,
    resetGlobalSettings,
    RoomContext
} from '../services/contextService';

export default function ContextTools() {
    const [activeContext, setActiveContextState] = useState<RoomContext | null>(null);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    useEffect(() => {
        loadContext();
    }, []);

    const loadContext = () => {
        setActiveContextState(getActiveContext());
    };

    const handleClearContext = () => {
        clearActiveContext();
        setShowClearConfirm(false);
        loadContext();
    };

    return (
        <div className="space-y-4">
            {/* Current Context Display */}
            <div className="p-6 bg-neutral-50 rounded-xl border border-neutral-200">
                <h3 className="text-sm font-bold text-black mb-2 uppercase tracking-wider">Current Context</h3>
                <p className="text-sm text-neutral-600 mb-4">
                    Shows the active context set by QR code or manual entry
                </p>

                {activeContext ? (
                    <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg mb-4">
                        <div className="text-xs font-bold uppercase text-blue-600 mb-2">Active Context</div>
                        <div className="space-y-1 text-sm font-medium text-blue-900">
                            <div>Hotel: <strong>{activeContext.hotelId}</strong></div>
                            {activeContext.floor !== undefined && (
                                <div>Floor: <strong>{activeContext.floor}</strong></div>
                            )}
                            {activeContext.room && (
                                <div>Room: <strong>{activeContext.room}</strong></div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="p-4 bg-neutral-100 border border-neutral-200 rounded-lg mb-4 text-center">
                        <p className="text-sm text-neutral-500 italic">No context set (using global defaults)</p>
                    </div>
                )}

                <button
                    onClick={() => setShowClearConfirm(true)}
                    disabled={!activeContext}
                    className={`w-full px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${activeContext
                            ? 'bg-red-100 text-red-700 hover:bg-red-200 active:scale-95'
                            : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                        }`}
                >
                    Clear Active Context
                </button>
            </div>

            {/* Reset Tools */}
            <div className="p-6 bg-amber-50 rounded-xl border-2 border-amber-200">
                <h3 className="text-sm font-bold text-amber-800 mb-2 uppercase tracking-wider">Reset Tools</h3>
                <p className="text-sm text-amber-700 mb-4">
                    Clear override configurations (for testing or troubleshooting)
                </p>
                <div className="space-y-2">
                    <button
                        onClick={() => { if (confirm('Reset all room overrides?')) { resetRoomOverrides(); alert('Room overrides reset'); } }}
                        className="w-full px-6 py-2 rounded-lg bg-amber-100 text-amber-800 font-bold text-xs uppercase tracking-wider hover:bg-amber-200 active:scale-95 transition-all"
                    >
                        Reset Room Overrides
                    </button>
                    <button
                        onClick={() => { if (confirm('Reset all floor overrides?')) { resetFloorOverrides(); alert('Floor overrides reset'); } }}
                        className="w-full px-6 py-2 rounded-lg bg-amber-100 text-amber-800 font-bold text-xs uppercase tracking-wider hover:bg-amber-200 active:scale-95 transition-all"
                    >
                        Reset Floor Overrides
                    </button>
                    <button
                        onClick={() => { if (confirm('Reset global settings to defaults?')) { resetGlobalSettings(); alert('Global settings reset'); } }}
                        className="w-full px-6 py-2 rounded-lg bg-amber-100 text-amber-800 font-bold text-xs uppercase tracking-wider hover:bg-amber-200 active:scale-95 transition-all"
                    >
                        Reset Global Settings
                    </button>
                </div>
            </div>

            {/* Clear Context Confirmation */}
            {showClearConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
                        <h3 className="text-2xl font-bold text-black mb-4">Clear Active Context?</h3>
                        <p className="text-sm text-neutral-600 mb-8 leading-relaxed">
                            This will remove the current QR-set context. The app will revert to using global default stay type.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowClearConfirm(false)}
                                className="flex-1 h-14 rounded-xl bg-neutral-100 text-black font-bold text-sm uppercase tracking-wider hover:bg-neutral-200 active:scale-95 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleClearContext}
                                className="flex-1 h-14 rounded-xl bg-red-600 text-white font-bold text-sm uppercase tracking-wider hover:bg-red-700 active:scale-95 transition-all shadow-lg"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
