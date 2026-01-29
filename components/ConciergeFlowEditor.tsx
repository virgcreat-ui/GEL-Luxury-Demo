
import React, { useState, useEffect } from "react";
import { Lang, LANG_LABELS } from "../i18n";
import { loadConciergeFlowConfig, saveConciergeFlowConfig, DEFAULT_CONCIERGE_FLOW_CONFIG, ConciergeFlowConfig, TopicConfig } from "../services/conciergeFlowConfig";
import ListEditor from "./ListEditor";

export default function ConciergeFlowEditor() {
    const [config, setConfig] = useState<ConciergeFlowConfig>(loadConciergeFlowConfig());
    const [lang, setLang] = useState<Lang>("en");
    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        // Auto-select first topic when lang changes
        const topics = config.guest.topics;
        if (topics.length > 0 && !topics.find(t => t.id === selectedTopicId)) {
            setSelectedTopicId(topics[0].id);
        }
    }, [config]);

    const pathConfig = config.guest;

    const handleSave = () => {
        saveConciergeFlowConfig(config);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleReset = () => {
        if (!confirm("Reset concierge flow to defaults? This will clear all your custom voice lines.")) return;
        setConfig(DEFAULT_CONCIERGE_FLOW_CONFIG);
        saveConciergeFlowConfig(DEFAULT_CONCIERGE_FLOW_CONFIG);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const updateLines = (field: keyof typeof pathConfig, lines: string[]) => {
        setConfig({
            ...config,
            guest: {
                ...pathConfig,
                [field]: {
                    ...pathConfig[field as keyof typeof pathConfig],
                    [lang]: lines
                }
            }
        });
    };

    const updateTopicLabel = (topicId: string, label: string) => {
        const updatedTopics = pathConfig.topics.map(t =>
            t.id === topicId ? { ...t, label: { ...t.label, [lang]: label } } : t
        );
        setConfig({
            ...config,
            guest: {
                ...pathConfig,
                topics: updatedTopics
            }
        });
    };

    const moveTopicUp = (index: number) => {
        if (index === 0) return;
        const topics = [...pathConfig.topics];
        [topics[index - 1], topics[index]] = [topics[index], topics[index - 1]];
        // Update order numbers
        topics.forEach((t, i) => t.order = i + 1);
        setConfig({
            ...config,
            guest: {
                ...pathConfig,
                topics
            }
        });
    };

    const moveTopicDown = (index: number) => {
        if (index === pathConfig.topics.length - 1) return;
        const topics = [...pathConfig.topics];
        [topics[index], topics[index + 1]] = [topics[index + 1], topics[index]];
        topics.forEach((t, i) => t.order = i + 1);
        setConfig({
            ...config,
            guest: {
                ...pathConfig,
                topics
            }
        });
    };

    const updateTopicIntro = (topicId: string, lines: string[]) => {
        setConfig({
            ...config,
            guest: {
                ...pathConfig,
                topicIntros: {
                    ...pathConfig.topicIntros,
                    [topicId]: {
                        ...(pathConfig.topicIntros[topicId] || {}),
                        [lang]: lines
                    }
                }
            }
        });
    };

    const selectedTopic = pathConfig.topics.find(t => t.id === selectedTopicId);

    return (
        <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-neutral-800 mb-2">Concierge Flow Editor</h1>
                <p className="text-neutral-600">Customize voice lines and topics for the guided concierge experience.</p>
            </div>

            {/* Top Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-white rounded-xl border border-neutral-200">
                {/* Guest Flow Label */}
                <div className="text-neutral-700 font-semibold">
                    Hotel Guest Flow
                </div>

                {/* Language Selector */}
                <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value as Lang)}
                    className="px-4 py-2 border border-neutral-300 rounded-lg font-semibold focus:ring-2 focus:ring-blue-500"
                >
                    {Object.entries(LANG_LABELS).map(([code, label]) => (
                        <option key={code} value={code}>
                            {label}
                        </option>
                    ))}
                </select>

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold rounded-lg transition"
                    >
                        Reset to Defaults
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition flex items-center gap-2"
                    >
                        {saved && <span>✓</span>}
                        Save
                    </button>
                </div>
            </div>

            {/* Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LEFT COLUMN - Flow Voice */}
                <div className="bg-white p-6 rounded-xl border border-neutral-200">
                    <h2 className="text-lg font-bold text-neutral-800 mb-4">Flow Voice Lines</h2>

                    <ListEditor
                        label="Welcome Lines"
                        lines={pathConfig.welcomeLines[lang] || []}
                        onChange={(lines) => updateLines("welcomeLines", lines)}
                        placeholder="Enter welcome message..."
                    />

                    <ListEditor
                        label="Ask First-Time Lines"
                        lines={pathConfig.askFirstTimeLines[lang] || []}
                        onChange={(lines) => updateLines("askFirstTimeLines", lines)}
                        placeholder="Ask if first-time or returning..."
                    />

                    <ListEditor
                        label="First-Time Confirm Lines"
                        lines={pathConfig.firstTimeConfirmLines[lang] || []}
                        onChange={(lines) => updateLines("firstTimeConfirmLines", lines)}
                        placeholder="Confirmation for first-time visitors..."
                    />

                    <ListEditor
                        label="Returning Confirm Lines"
                        lines={pathConfig.returningConfirmLines[lang] || []}
                        onChange={(lines) => updateLines("returningConfirmLines", lines)}
                        placeholder="Confirmation for returning visitors..."
                    />

                    <ListEditor
                        label="Back Lines"
                        lines={pathConfig.backLines[lang] || []}
                        onChange={(lines) => updateLines("backLines", lines)}
                        placeholder="Short prompt when navigating back..."
                    />

                </div>

                {/* RIGHT COLUMN - Topics & Intros */}
                <div className="bg-white p-6 rounded-xl border border-neutral-200">
                    <h2 className="text-lg font-bold text-neutral-800 mb-4">Topics & Intros</h2>

                    {/* Topics List */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-neutral-700 mb-2">Topics (in order)</h3>
                        <div className="space-y-2">
                            {pathConfig.topics.map((topic, index) => (
                                <div
                                    key={topic.id}
                                    className={`flex items-center gap-2 p-3 rounded-lg border transition cursor-pointer ${selectedTopicId === topic.id
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-neutral-200 hover:border-neutral-300"
                                        }`}
                                    onClick={() => setSelectedTopicId(topic.id)}
                                >
                                    <div className="flex flex-col gap-1">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                moveTopicUp(index);
                                            }}
                                            disabled={index === 0}
                                            className="text-xs px-1 disabled:opacity-30"
                                        >
                                            ▲
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                moveTopicDown(index);
                                            }}
                                            disabled={index === pathConfig.topics.length - 1}
                                            className="text-xs px-1 disabled:opacity-30"
                                        >
                                            ▼
                                        </button>
                                    </div>

                                    <div className="flex-1">
                                        <div className="text-xs text-neutral-500 mb-1">{topic.id}</div>
                                        <input
                                            type="text"
                                            value={topic.label[lang] || ""}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                updateTopicLabel(topic.id, e.target.value);
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-full px-2 py-1 text-sm border border-neutral-300 rounded focus:ring-2 focus:ring-blue-500"
                                            placeholder={`Label in ${LANG_LABELS[lang]}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Topic Intro Editor */}
                    {selectedTopic && (
                        <div className="border-t border-neutral-200 pt-6">
                            <h3 className="text-sm font-semibold text-neutral-700 mb-2">
                                Intro Lines for: <span className="text-blue-600">{selectedTopic.label[lang] || selectedTopic.id}</span>
                            </h3>
                            <ListEditor
                                label=""
                                lines={pathConfig.topicIntros[selectedTopic.id]?.[lang] || []}
                                onChange={(lines) => updateTopicIntro(selectedTopic.id, lines)}
                                placeholder="Enter topic intro voice line..."
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
