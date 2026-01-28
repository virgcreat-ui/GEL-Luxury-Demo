import React, { useState, useEffect } from 'react';
import {
    ImageSlot,
    SLOT_LABELS,
    SLOT_GROUPS,
    DEFAULT_IMAGES,
    getSlotAssignment,
    assignImageToSlot,
    clearSlotOverride
} from '../services/imageSlots';
import { getImageForSlot } from '../services/imageService';

interface ImageSlotDisplayProps {
    slot: ImageSlot;
    onImageUpdated: () => void;
}

function ImageSlotDisplay({ slot, onImageUpdated }: ImageSlotDisplayProps) {
    const [currentImage, setCurrentImage] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        loadCurrentImage();
    }, [slot]);

    const loadCurrentImage = async () => {
        const url = await getImageForSlot(slot);
        setCurrentImage(url);
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        setIsUploading(true);

        try {
            // Convert to base64
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setPreviewUrl(base64);
                setShowPreview(true);
                setIsUploading(false);
            };
            reader.onerror = () => {
                alert('Error reading file');
                setIsUploading(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error processing image:', error);
            alert('Error processing image');
            setIsUploading(false);
        }
    };

    const handleSaveImage = () => {
        if (!previewUrl) return;

        try {
            // Save base64 as media ID for this slot
            assignImageToSlot(slot, previewUrl);
            setCurrentImage(previewUrl);
            setShowPreview(false);
            setPreviewUrl('');
            onImageUpdated();
            alert('Image updated successfully!');
        } catch (error) {
            console.error('Error saving image:', error);
            alert('Error saving image');
        }
    };

    const handleResetToDefault = () => {
        if (!confirm('Reset to default image?')) return;

        try {
            clearSlotOverride(slot);
            setCurrentImage(DEFAULT_IMAGES[slot]);
            onImageUpdated();
            alert('Reset to default image');
        } catch (error) {
            console.error('Error resetting:', error);
            alert('Error resetting image');
        }
    };

    const hasOverride = getSlotAssignment(slot) !== null;

    return (
        <div className="border border-neutral-200 rounded-lg p-4 bg-white">
            <div className="flex gap-4">
                {/* Image Preview */}
                <div className="flex-shrink-0">
                    <div className="w-32 h-32 border border-neutral-300 rounded-lg overflow-hidden bg-neutral-100">
                        {currentImage ? (
                            <img
                                src={currentImage}
                                alt={SLOT_LABELS[slot]}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                                No image
                            </div>
                        )}
                    </div>
                </div>

                {/* Info & Actions */}
                <div className="flex-1">
                    <h4 className="font-bold text-sm text-neutral-900 mb-1">
                        {SLOT_LABELS[slot]}
                    </h4>
                    <p className="text-xs text-neutral-500 mb-3">
                        Slot ID: <code className="bg-neutral-100 px-1 rounded">{slot}</code>
                        {hasOverride && <span className="ml-2 text-green-600">● Custom</span>}
                    </p>

                    <div className="flex gap-2">
                        <label className="px-3 py-1 text-xs font-medium bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition">
                            {isUploading ? 'Processing...' : 'Replace Image'}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                                disabled={isUploading}
                            />
                        </label>

                        {hasOverride && (
                            <button
                                onClick={handleResetToDefault}
                                className="px-3 py-1 text-xs font-medium bg-neutral-200 text-neutral-700 rounded hover:bg-neutral-300 transition"
                            >
                                Reset to Default
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
                        <h3 className="text-lg font-bold mb-4">Preview New Image</h3>

                        <div className="mb-4 border border-neutral-300 rounded-lg overflow-hidden">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-full h-auto max-h-96 object-contain"
                            />
                        </div>

                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => {
                                    setShowPreview(false);
                                    setPreviewUrl('');
                                }}
                                className="px-4 py-2 text-sm font-medium bg-neutral-200 text-neutral-700 rounded hover:bg-neutral-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveImage}
                                className="px-4 py-2 text-sm font-medium bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Save Image
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function AdminImages() {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleImageUpdated = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">Visuals & Images</h2>
                <p className="text-neutral-600">
                    Manage all images used across the guest experience. Replace images to customize your property's visual identity.
                </p>
            </div>

            {/* Home/Welcome Section */}
            <section className="mb-8">
                <h3 className="text-lg font-bold text-neutral-800 mb-4 pb-2 border-b border-neutral-200">
                    🏠 Home & Welcome Screen
                </h3>
                <div className="grid gap-4">
                    {SLOT_GROUPS.home.map(slot => (
                        <ImageSlotDisplay
                            key={`${slot}-${refreshKey}`}
                            slot={slot}
                            onImageUpdated={handleImageUpdated}
                        />
                    ))}
                </div>
            </section>

            {/* Hub Section */}
            <section className="mb-8">
                <h3 className="text-lg font-bold text-neutral-800 mb-4 pb-2 border-b border-neutral-200">
                    🎯 The Hub
                </h3>
                <div className="grid gap-4">
                    {SLOT_GROUPS.hub.map(slot => (
                        <ImageSlotDisplay
                            key={`${slot}-${refreshKey}`}
                            slot={slot}
                            onImageUpdated={handleImageUpdated}
                        />
                    ))}
                </div>
            </section>

            {/* Room Section */}
            <section className="mb-8">
                <h3 className="text-lg font-bold text-neutral-800 mb-4 pb-2 border-b border-neutral-200">
                    🛏️ Your Room
                </h3>
                <div className="grid gap-4">
                    {SLOT_GROUPS.room.map(slot => (
                        <ImageSlotDisplay
                            key={`${slot}-${refreshKey}`}
                            slot={slot}
                            onImageUpdated={handleImageUpdated}
                        />
                    ))}
                </div>
            </section>

            {/* Events Section */}
            <section className="mb-8">
                <h3 className="text-lg font-bold text-neutral-800 mb-4 pb-2 border-b border-neutral-200">
                    📅 Events
                </h3>
                <div className="grid gap-4">
                    {SLOT_GROUPS.events.map(slot => (
                        <ImageSlotDisplay
                            key={`${slot}-${refreshKey}`}
                            slot={slot}
                            onImageUpdated={handleImageUpdated}
                        />
                    ))}
                </div>
            </section>

            {/* Area Section */}
            <section className="mb-8">
                <h3 className="text-lg font-bold text-neutral-800 mb-4 pb-2 border-b border-neutral-200">
                    📍 Around the Area
                </h3>
                <div className="grid gap-4">
                    {SLOT_GROUPS.area.map(slot => (
                        <ImageSlotDisplay
                            key={`${slot}-${refreshKey}`}
                            slot={slot}
                            onImageUpdated={handleImageUpdated}
                        />
                    ))}
                </div>
            </section>

            {/* Concierge Section */}
            <section className="mb-8">
                <h3 className="text-lg font-bold text-neutral-800 mb-4 pb-2 border-b border-neutral-200">
                    💼 Concierge
                </h3>
                <div className="grid gap-4">
                    {SLOT_GROUPS.concierge.map(slot => (
                        <ImageSlotDisplay
                            key={`${slot}-${refreshKey}`}
                            slot={slot}
                            onImageUpdated={handleImageUpdated}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}
