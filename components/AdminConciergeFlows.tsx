
import React, { useState, useEffect } from "react";
import { ConciergeFlow, ConciergeFlowStep, getAllConciergeFlows, saveConciergeFlows, DEFAULT_CONCIERGE_FLOWS } from "../services/contentService";
import { Lang } from "../i18n";

const AdminConciergeFlows: React.FC = () => {
    const [flows, setFlows] = useState<ConciergeFlow[]>(getAllConciergeFlows());
    const [selectedAudience, setSelectedAudience] = useState<'student' | 'guest'>('student');
    const [selectedJourney, setSelectedJourney] = useState<'first_time' | 'returning'>('first_time');
    const [activeLang, setActiveLang] = useState<Lang>('en');

    // Sync from storage on mount
    useEffect(() => {
        setFlows(getAllConciergeFlows());
    }, []);

    const activeFlow = flows.find(f => f.audience === selectedAudience && f.journey === selectedJourney);

    const handleSave = () => {
        saveConciergeFlows(flows);
        alert("Flows saved successfully!");
    };

    const handleReset = () => {
        if (confirm("Reset all flows to defaults?")) {
            saveConciergeFlows(DEFAULT_CONCIERGE_FLOWS);
            setFlows(DEFAULT_CONCIERGE_FLOWS);
        }
    };

    const updateStep = (stepIdx: number, updates: Partial<ConciergeFlowStep>) => {
        if (!activeFlow) return;
        const newFlows = flows.map(f => {
            if (f.id === activeFlow.id) {
                const newSteps = [...f.steps];
                newSteps[stepIdx] = { ...newSteps[stepIdx], ...updates };
                return { ...f, steps: newSteps };
            }
            return f;
        });
        setFlows(newFlows);
    };

    // Helper to update voice line
    const updateVoice = (stepIdx: number, val: string, index: number) => {
        if (!activeFlow) return;
        const step = activeFlow.steps[stepIdx];
        const currentPool = step.voice[activeLang] || [];
        const newPool = [...currentPool];
        newPool[index] = val;

        const newVoice = { ...step.voice, [activeLang]: newPool };
        updateStep(stepIdx, { voice: newVoice });
    };

    const addVoiceLine = (stepIdx: number) => {
        if (!activeFlow) return;
        const step = activeFlow.steps[stepIdx];
        const currentPool = step.voice[activeLang] || [];
        const newVoice = { ...step.voice, [activeLang]: [...currentPool, ""] };
        updateStep(stepIdx, { voice: newVoice });
    };

    return (
        <div className="p-6 lg:p-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-black mb-2">Concierge Flows Editor</h2>
                    <p className="text-sm text-neutral-600">Configure conversation paths for Students and Guests</p>
                </div>

                {/* Controls */}
                <div className="flex gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <select
                        className="p-2 border rounded"
                        value={selectedAudience}
                        onChange={e => setSelectedAudience(e.target.value as any)}>
                        <option value="student">Student</option>
                        <option value="guest">Guest</option>
                    </select>
                    <select
                        className="p-2 border rounded"
                        value={selectedJourney}
                        onChange={e => setSelectedJourney(e.target.value as any)}>
                        <option value="first_time">First Time</option>
                        <option value="returning">Returning</option>
                    </select>
                    <select
                        className="p-2 border rounded"
                        value={activeLang}
                        onChange={e => setActiveLang(e.target.value as any)}>
                        <option value="en">English (EN)</option>
                        <option value="fr">French (FR)</option>
                        <option value="de">German (DE)</option>
                        <option value="es">Spanish (ES)</option>
                        <option value="it">Italian (IT)</option>
                        <option value="pt">Portuguese (PT)</option>
                    </select>
                    <div className="flex-1"></div>
                    <button onClick={handleReset} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded">Reset Defaults</button>
                    <button onClick={handleSave} className="px-6 py-2 bg-black text-white rounded font-bold hover:bg-gray-800">Save All</button>
                </div>

                {/* Editor */}
                {activeFlow ? (
                    <div className="space-y-8">
                        {activeFlow.steps.map((step, idx) => (
                            <div key={step.id} className="bg-white p-6 rounded-xl shadow border border-gray-200">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Step {idx + 1}</span>
                                    {step.id}
                                </h3>

                                {/* Voice Script */}
                                <div className="mb-6">
                                    <h4 className="font-semibold mb-2 text-gray-700">Voice Script ({activeLang.toUpperCase()})</h4>
                                    <div className="space-y-2">
                                        {(step.voice[activeLang] || []).map((line, vIdx) => (
                                            <textarea
                                                key={vIdx}
                                                className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                                rows={2}
                                                value={line}
                                                onChange={(e) => updateVoice(idx, e.target.value, vIdx)}
                                            />
                                        ))}
                                        <button onClick={() => addVoiceLine(idx)} className="text-sm text-blue-600 hover:underline">+ Add Variation</button>
                                    </div>
                                </div>

                                {/* Options */}
                                <div>
                                    <h4 className="font-semibold mb-2 text-gray-700">Options (Menu)</h4>
                                    <div className="grid gap-4">
                                        {step.options.map((opt, oIdx) => (
                                            <div key={opt.id} className="flex gap-4 items-start bg-gray-50 p-3 rounded border">
                                                <div className="flex-1">
                                                    <label className="block text-xs text-gray-500 mb-1">Label ({activeLang})</label>
                                                    <input
                                                        className="w-full p-2 border rounded"
                                                        value={opt.label[activeLang] || ""}
                                                        onChange={e => {
                                                            const newSteps = [...activeFlow.steps];
                                                            const newOptions = [...newSteps[idx].options];
                                                            newOptions[oIdx] = { ...opt, label: { ...opt.label, [activeLang]: e.target.value } };
                                                            updateStep(idx, { options: newOptions });
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block text-xs text-gray-500 mb-1">Target (Next Step ID)</label>
                                                    <input
                                                        className="w-full p-2 border rounded font-mono text-sm"
                                                        value={opt.nextStepId}
                                                        onChange={e => {
                                                            const newSteps = [...activeFlow.steps];
                                                            const newOptions = [...newSteps[idx].options];
                                                            newOptions[oIdx] = { ...opt, nextStepId: e.target.value };
                                                            updateStep(idx, { options: newOptions });
                                                        }}
                                                    />
                                                    <div className="text-[10px] text-gray-400 mt-1">Use 'view:[topicId]' for content.</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-400">Flow not found.</div>
                )}
            </div>
        </div>
    );
};

export default AdminConciergeFlows;
