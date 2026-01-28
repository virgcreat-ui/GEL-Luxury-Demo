import React, { useState } from 'react';
import {
    exportHotelPack,
    importHotelPack,
    readPackFile,
    previewImport,
    getCurrentConfigSummary,
    ImportSummary,
    ImportOptions
} from '../services/packService';

export default function AdminExportImport() {
    const [hotelName, setHotelName] = useState('');
    const [location, setLocation] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<ImportSummary | null>(null);
    const [importOptions, setImportOptions] = useState<ImportOptions>({
        content: true,
        conciergeFlows: true,
        qrContext: true,
        imageSlots: true,
        hubConfig: true
    });
    const [importing, setImporting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const currentConfig = getCurrentConfigSummary();

    const handleExport = () => {
        try {
            exportHotelPack(hotelName || undefined, location || undefined);
            alert('Hotel pack exported successfully!');
        } catch (err: any) {
            alert('Export failed: ' + err.message);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        setError(null);
        setPreview(null);

        try {
            const data = await readPackFile(file);
            const summary = previewImport(data);
            setPreview(summary);
        } catch (err: any) {
            setError('Failed to read file: ' + err.message);
            setSelectedFile(null);
        }
    };

    const handleImport = async () => {
        if (!selectedFile || !preview) return;

        const confirmed = window.confirm(
            'This will import the selected configuration sections. Continue?'
        );
        if (!confirmed) return;

        setImporting(true);
        setError(null);

        try {
            const data = await readPackFile(selectedFile);
            importHotelPack(data, importOptions);
            alert('Import completed successfully! Please refresh the page to see changes.');
            // Reset
            setSelectedFile(null);
            setPreview(null);
        } catch (err: any) {
            setError('Import failed: ' + err.message);
        } finally {
            setImporting(false);
        }
    };

    const toggleOption = (key: keyof ImportOptions) => {
        setImportOptions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: '"Rubik", sans-serif' }}>
                Export / Import Hotel Pack
            </h2>

            {/* Export Section */}
            <div className="mb-12 bg-white rounded-2xl p-8 border-2 border-neutral-200">
                <h3 className="text-2xl font-bold mb-4">📦 Export Current Configuration</h3>
                <p className="text-sm text-neutral-600 mb-6">
                    Download all hotel settings as a single JSON file. This includes content, flows, QR overrides, and image slot assignments.
                </p>

                {/* Current Config Summary */}
                <div className="mb-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                    <div className="text-xs font-bold uppercase text-neutral-500 mb-2">Current Configuration</div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                            <div className="font-bold text-lg">{currentConfig.contentSections}</div>
                            <div className="text-neutral-600">Content Sections</div>
                        </div>
                        <div>
                            <div className="font-bold text-lg">{currentConfig.conciergeFlows}</div>
                            <div className="text-neutral-600">Concierge Flows</div>
                        </div>
                        <div>
                            <div className="font-bold text-lg">{currentConfig.roomOverrides}</div>
                            <div className="text-neutral-600">Room Overrides</div>
                        </div>
                        <div>
                            <div className="font-bold text-lg">{currentConfig.floorOverrides}</div>
                            <div className="text-neutral-600">Floor Overrides</div>
                        </div>
                        <div>
                            <div className="font-bold text-lg">{currentConfig.imageSlotAssignments}</div>
                            <div className="text-neutral-600">Image Slots</div>
                        </div>
                    </div>
                </div>

                {/* Hotel Metadata */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">
                            Hotel Name (optional)
                        </label>
                        <input
                            type="text"
                            value={hotelName}
                            onChange={(e) => setHotelName(e.target.value)}
                            placeholder="e.g., The Social Hub Paris"
                            className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 hover:border-black focus:border-black transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">
                            Location (optional)
                        </label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="e.g., Paris La Defense"
                            className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 hover:border-black focus:border-black transition-colors"
                        />
                    </div>
                </div>

                {/* Export Button */}
                <button
                    onClick={handleExport}
                    className="w-full px-6 py-4 rounded-lg bg-black text-white font-bold text-sm uppercase tracking-wider hover:bg-neutral-800 active:scale-[0.98] transition-all"
                >
                    💾 Export Hotel Pack (v2)
                </button>

                {/* Image Warning */}
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex gap-3">
                        <div className="text-2xl">⚠️</div>
                        <div>
                            <div className="text-xs font-bold text-amber-900 mb-1">About Images</div>
                            <div className="text-xs text-amber-700">
                                Images are stored locally in this browser (IndexedDB). The export includes only assignments and metadata.
                                You will need to <strong>re-upload images</strong> after importing to a new location.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Import Section */}
            <div className="bg-white rounded-2xl p-8 border-2 border-neutral-200">
                <h3 className="text-2xl font-bold mb-4">📥 Import Hotel Pack</h3>
                <p className="text-sm text-neutral-600 mb-6">
                    Upload a previously exported hotel pack JSON file.
                </p>

                {/* File Picker */}
                <div className="mb-6">
                    <label className="block">
                        <div className="px-6 py-4 border-2 border-dashed border-neutral-300 rounded-lg text-center hover:border-black transition-colors cursor-pointer">
                            <div className="text-4xl mb-2">📄</div>
                            <div className="font-bold text-sm mb-1">
                                {selectedFile ? selectedFile.name : 'Click to select JSON file'}
                            </div>
                            <div className="text-xs text-neutral-500">
                                {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'Select a hotel pack file to import'}
                            </div>
                        </div>
                        <input
                            type="file"
                            accept="application/json,.json"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </label>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="text-sm font-bold text-red-900 mb-1">Error</div>
                        <div className="text-sm text-red-700">{error}</div>
                    </div>
                )}

                {/* Preview */}
                {preview && (
                    <div className="mb-6">
                        <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                            <div className="text-sm font-bold text-blue-900 mb-3">📋 Import Preview</div>

                            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                <div>
                                    <div className="text-xs text-blue-700 mb-1">Version</div>
                                    <div className="font-bold text-blue-900">v{preview.version}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-blue-700 mb-1">Exported</div>
                                    <div className="font-bold text-blue-900">
                                        {preview.exportedAt ? new Date(preview.exportedAt).toLocaleDateString() : 'Unknown'}
                                    </div>
                                </div>
                                {preview.hotelName && (
                                    <div>
                                        <div className="text-xs text-blue-700 mb-1">Hotel Name</div>
                                        <div className="font-bold text-blue-900">{preview.hotelName}</div>
                                    </div>
                                )}
                                {preview.hotelLocation && (
                                    <div>
                                        <div className="text-xs text-blue-700 mb-1">Location</div>
                                        <div className="font-bold text-blue-900">{preview.hotelLocation}</div>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                                <div className="p-3 bg-white rounded-lg">
                                    <div className="font-bold text-lg text-blue-900">{preview.contentSections}</div>
                                    <div className="text-xs text-blue-700">Content Sections</div>
                                </div>
                                <div className="p-3 bg-white rounded-lg">
                                    <div className="font-bold text-lg text-blue-900">{preview.conciergeFlows}</div>
                                    <div className="text-xs text-blue-700">Concierge Flows</div>
                                </div>
                                <div className="p-3 bg-white rounded-lg">
                                    <div className="font-bold text-lg text-blue-900">{preview.roomOverrides}</div>
                                    <div className="text-xs text-blue-700">Room Overrides</div>
                                </div>
                                <div className="p-3 bg-white rounded-lg">
                                    <div className="font-bold text-lg text-blue-900">{preview.floorOverrides}</div>
                                    <div className="text-xs text-blue-700">Floor Overrides</div>
                                </div>
                                <div className="p-3 bg-white rounded-lg">
                                    <div className="font-bold text-lg text-blue-900">{preview.imageSlotAssignments}</div>
                                    <div className="text-xs text-blue-700">Image Assignments</div>
                                </div>
                                <div className="p-3 bg-white rounded-lg">
                                    <div className="font-bold text-lg text-blue-900">{preview.mediaMetaCount}</div>
                                    <div className="text-xs text-blue-700">Media References</div>
                                </div>
                            </div>
                        </div>

                        {/* Import Options */}
                        <div className="mb-6">
                            <div className="text-sm font-bold mb-3">Select what to import:</div>
                            <div className="space-y-2">
                                {[
                                    { key: 'content' as const, label: 'Content Overrides (Hub, Room, Area, Events, Concierge)' },
                                    { key: 'conciergeFlows' as const, label: 'Concierge Flows (Student/Guest journeys)' },
                                    { key: 'qrContext' as const, label: 'QR Context & Room Notes (Global, Floor, Room overrides)' },
                                    { key: 'imageSlots' as const, label: 'Image Slot Assignments (metadata only)' },
                                    { key: 'hubConfig' as const, label: 'Hub Config (facility toggles)' },
                                ].map(option => (
                                    <label key={option.key} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 cursor-pointer transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={importOptions[option.key] || false}
                                            onChange={() => toggleOption(option.key)}
                                            className="mt-1 w-4 h-4 accent-black"
                                        />
                                        <div className="text-sm">{option.label}</div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Import Button */}
                        <button
                            onClick={handleImport}
                            disabled={importing || Object.values(importOptions).every(v => !v)}
                            className="w-full px-6 py-4 rounded-lg bg-green-600 text-white font-bold text-sm uppercase tracking-wider hover:bg-green-700 active:scale-[0.98] transition-all disabled:bg-neutral-300 disabled:cursor-not-allowed"
                        >
                            {importing ? '⏳ Importing...' : '✅ Import Selected'}
                        </button>
                    </div>
                )}

                {/* Instructions */}
                {!preview && !error && (
                    <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
                        <div className="text-xs font-bold text-neutral-700 mb-2">💡 How it works</div>
                        <ul className="text-xs text-neutral-600 space-y-1 list-disc list-inside">
                            <li>Select a hotel pack JSON file exported from this or another location</li>
                            <li>Review the preview to see what will be imported</li>
                            <li>Choose which sections to import using the checkboxes</li>
                            <li>Click "Import Selected" to apply the configuration</li>
                            <li>Refresh the page to see changes in the admin panel</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
