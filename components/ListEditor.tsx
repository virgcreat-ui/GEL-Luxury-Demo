
import React from "react";

interface ListEditorProps {
    label: string;
    lines: string[];
    onChange: (lines: string[]) => void;
    placeholder?: string;
    maxChars?: number;
}

export default function ListEditor({ label, lines, onChange, placeholder = "Enter text...", maxChars = 160 }: ListEditorProps) {
    const handleAdd = () => {
        onChange([...lines, ""]);
    };

    const handleChange = (index: number, value: string) => {
        const updated = [...lines];
        updated[index] = value;
        onChange(updated);
    };

    const handleRemove = (index: number) => {
        onChange(lines.filter((_, i) => i !== index));
    };

    const handleShuffle = () => {
        if (lines.length === 0) return;
        const randomLine = lines[Math.floor(Math.random() * lines.length)];
        alert(`Random preview:\n\n"${randomLine}"`);
    };

    const isEmpty = lines.length === 0;

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                    {label}
                    {isEmpty && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded">Empty</span>}
                </label>
                <div className="flex gap-2">
                    {lines.length > 1 && (
                        <button
                            type="button"
                            onClick={handleShuffle}
                            className="text-xs px-2 py-1 bg-neutral-100 hover:bg-neutral-200 rounded transition"
                        >
                            🎲 Preview
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={handleAdd}
                        className="text-xs px-3 py-1 bg-blue-500 text-white hover:bg-blue-600 rounded transition"
                    >
                        + Add Line
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                {lines.length === 0 ? (
                    <div className="text-sm text-neutral-400 italic py-2">No lines yet. Click "Add Line" to start.</div>
                ) : (
                    lines.map((line, index) => (
                        <div key={index} className="flex gap-2 items-start">
                            <textarea
                                value={line}
                                onChange={(e) => handleChange(index, e.target.value)}
                                placeholder={placeholder}
                                className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={Math.min(3, Math.ceil(line.length / 60) || 1)}
                            />
                            <div className="flex flex-col gap-1 pt-2">
                                <button
                                    type="button"
                                    onClick={() => handleRemove(index)}
                                    className="text-red-500 hover:text-red-700 text-sm px-2 py-1 hover:bg-red-50 rounded transition"
                                    title="Remove"
                                >
                                    🗑
                                </button>
                                {maxChars && (
                                    <span className={`text-xs ${line.length > maxChars ? 'text-amber-600' : 'text-neutral-400'}`}>
                                        {line.length}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
