import React, { useState, useEffect, useRef } from 'react';
import { uploadImage, getMediaLibrary, deleteMedia, updateMediaName, MediaItemDisplay } from '../services/mediaService';
import { ImageSlot, SLOT_LABELS, assignImageToSlot, getAllAssignments, clearSlotOverride } from '../services/imageSlots';

export default function MediaLibrary() {
    const [library, setLibrary] = useState<MediaItemDisplay[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState<MediaItemDisplay | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const [editingName, setEditingName] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadLibrary();
    }, []);

    const loadLibrary = async () => {
        try {
            const items = await getMediaLibrary();
            setLibrary(items);
        } catch (error) {
            console.error('Failed to load library:', error);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            await uploadImage(file);
            await loadLibrary();
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error: any) {
            alert(error.message || 'Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteMedia(id, (mediaId) => {
                // Clear all slot assignments for this media
                const assignments = getAllAssignments();
                assignments.forEach(a => {
                    if (a.mediaId === mediaId) {
                        clearSlotOverride(a.slotId);
                    }
                });
            });
            await loadLibrary();
            setShowDeleteConfirm(null);
            if (selectedMedia?.id === id) {
                setSelectedMedia(null);
            }
        } catch (error) {
            alert('Failed to delete image');
        }
    };

    const handleNameEdit = async (id: string) => {
        if (!editValue.trim()) return;

        try {
            await updateMediaName(id, editValue);
            await loadLibrary();
            setEditingName(null);
            setEditValue('');
        } catch (error) {
            alert('Failed to update name');
        }
    };

    const startEdit = (item: MediaItemDisplay) => {
        setEditingName(item.id);
        setEditValue(item.name);
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    };

    return (
        <div className="space-y-6">
            {/* Header + Upload */}
            <div className="bg-white rounded-2xl border-2 border-neutral-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-black mb-1" style={{ fontFamily: '"Rubik", sans-serif' }}>
                            Media Library
                        </h3>
                        <p className="text-sm text-neutral-600">
                            {library.length} image{library.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleUpload}
                            className="hidden"
                            id="image-upload"
                        />
                        <label
                            htmlFor="image-upload"
                            className={`inline-block px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all shadow-md cursor-pointer ${isUploading
                                    ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                                    : 'bg-black text-white hover:bg-neutral-800 active:scale-95'
                                }`}
                        >
                            {isUploading ? 'Uploading...' : '+ Upload Image'}
                        </label>
                    </div>
                </div>

                {library.length === 0 && !isUploading && (
                    <div className="p-12 bg-neutral-50 rounded-xl border border-neutral-200 text-center">
                        <p className="text-neutral-500 text-sm mb-4">No images uploaded yet</p>
                        <p className="text-neutral-400 text-xs">Upload an image to get started</p>
                    </div>
                )}

                {/* Library Grid */}
                {library.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                        {library.map(item => (
                            <div
                                key={item.id}
                                className="group relative bg-neutral-50 rounded-xl border-2 border-neutral-200 overflow-hidden hover:border-black transition-all cursor-pointer"
                                onClick={() => setSelectedMedia(item)}
                            >
                                {/* Thumbnail */}
                                <div className="aspect-square relative overflow-hidden bg-neutral-100">
                                    <img
                                        src={item.thumbnailUrl}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Info */}
                                <div className="p-3 space-y-2">
                                    {/* Name */}
                                    {editingName === item.id ? (
                                        <input
                                            type="text"
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            onBlur={() => handleNameEdit(item.id)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleNameEdit(item.id);
                                                if (e.key === 'Escape') { setEditingName(null); setEditValue(''); }
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            autoFocus
                                            className="w-full px-2 py-1 text-sm font-bold border border-black rounded outline-none"
                                        />
                                    ) : (
                                        <h4
                                            className="text-sm font-bold text-black truncate"
                                            onClick={(e) => { e.stopPropagation(); startEdit(item); }}
                                        >
                                            {item.name}
                                        </h4>
                                    )}

                                    {/* Meta */}
                                    <div className="flex items-center justify-between text-xs text-neutral-500">
                                        <span>{formatSize(item.size)}</span>
                                        <span>{item.width}×{item.height}</span>
                                    </div>
                                    <p className="text-xs text-neutral-400 truncate">
                                        {formatDate(item.uploadedAt)}
                                    </p>

                                    {/* Delete Button */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(item.id); }}
                                        className="w-full px-3 py-2 rounded-lg bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider hover:bg-red-200 active:scale-95 transition-all"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Assignment Panel */}
            {selectedMedia && (
                <AssignmentPanel
                    media={selectedMedia}
                    onClose={() => setSelectedMedia(null)}
                    onAssigned={loadLibrary}
                />
            )}

            {/* Delete Confirmation */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
                        <h3 className="text-2xl font-bold text-black mb-4">Delete Image?</h3>
                        <p className="text-sm text-neutral-600 mb-8 leading-relaxed">
                            This will delete the image and clear any slot assignments. This cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="flex-1 h-14 rounded-xl bg-neutral-100 text-black font-bold text-sm uppercase tracking-wider hover:bg-neutral-200 active:scale-95 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(showDeleteConfirm)}
                                className="flex-1 h-14 rounded-xl bg-red-600 text-white font-bold text-sm uppercase tracking-wider hover:bg-red-700 active:scale-95 transition-all shadow-lg"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ===========================================================
   ASSIGNMENT PANEL
   ===========================================================*/

interface AssignmentPanelProps {
    media: MediaItemDisplay;
    onClose: () => void;
    onAssigned: () => void;
}

function AssignmentPanel({ media, onClose, onAssigned }: AssignmentPanelProps) {
    const [selectedSlot, setSelectedSlot] = useState<ImageSlot | ''>('');
    const [assignments, setAssignments] = useState<{ slotId: ImageSlot; label: string }[]>([]);

    useEffect(() => {
        loadAssignments();
    }, [media.id]);

    const loadAssignments = () => {
        const all = getAllAssignments();
        const forThis = all.filter(a => a.mediaId === media.id);
        setAssignments(forThis.map(a => ({ slotId: a.slotId, label: SLOT_LABELS[a.slotId] })));
    };

    const handleAssign = () => {
        if (!selectedSlot) return;

        try {
            assignImageToSlot(selectedSlot as ImageSlot, media.id);
            loadAssignments();
            setSelectedSlot('');
            onAssigned();
            alert('Image assigned successfully!');
        } catch (error) {
            alert('Failed to assign image');
        }
    };

    const handleUnassign = (slotId: ImageSlot) => {
        try {
            clearSlotOverride(slotId);
            loadAssignments();
            onAssigned();
        } catch (error) {
            alert('Failed to clear assignment');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-white rounded-3xl p-8 shadow-2xl max-h-[80vh] overflow-y-auto">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-black mb-2" style={{ fontFamily: '"Rubik", sans-serif' }}>
                            Assign Image
                        </h3>
                        <p className="text-sm text-neutral-600">{media.name}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-neutral-100 text-black font-bold text-sm hover:bg-neutral-200 active:scale-95 transition-all"
                    >
                        Close
                    </button>
                </div>

                {/* Preview */}
                <div className="mb-6 rounded-xl overflow-hidden border-2 border-neutral-200">
                    <img src={media.displayUrl} alt={media.name} className="w-full h-auto" />
                </div>

                {/* Assign New */}
                <div className="mb-6 p-6 bg-neutral-50 rounded-xl border border-neutral-200">
                    <h4 className="text-sm font-bold text-black mb-3 uppercase tracking-wider">Assign to Slot</h4>
                    <div className="flex gap-3">
                        <select
                            value={selectedSlot}
                            onChange={(e) => setSelectedSlot(e.target.value as ImageSlot)}
                            className="flex-1 px-4 py-3 rounded-lg border-2 border-neutral-200 font-medium text-sm bg-white hover:border-black transition-colors"
                        >
                            <option value="">Select a slot...</option>
                            {Object.entries(SLOT_LABELS).map(([slot, label]) => (
                                <option key={slot} value={slot}>{label}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleAssign}
                            disabled={!selectedSlot}
                            className={`px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${selectedSlot
                                    ? 'bg-black text-white hover:bg-neutral-800 active:scale-95'
                                    : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                                }`}
                        >
                            Assign
                        </button>
                    </div>
                </div>

                {/* Current Assignments */}
                {assignments.length > 0 && (
                    <div>
                        <h4 className="text-sm font-bold text-black mb-3 uppercase tracking-wider">Current Assignments</h4>
                        <div className="space-y-2">
                            {assignments.map(a => (
                                <div
                                    key={a.slotId}
                                    className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200"
                                >
                                    <span className="text-sm font-medium text-black">{a.label}</span>
                                    <button
                                        onClick={() => handleUnassign(a.slotId)}
                                        className="px-4 py-2 rounded-lg bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider hover:bg-red-200 active:scale-95 transition-all"
                                    >
                                        Clear
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {assignments.length === 0 && (
                    <p className="text-sm text-neutral-500 italic text-center py-4">
                        Not assigned to any slots yet
                    </p>
                )}
            </div>
        </div>
    );
}
