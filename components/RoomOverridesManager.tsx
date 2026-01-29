import React, { useState, useEffect } from 'react';
import {
    getGlobalSettings,
    setGlobalSettings,
    getRoomOverrides,
    setRoomOverride,
    clearRoomOverride,
    resetRoomOverrides,
    getFloorOverrides,
    setFloorOverride,
    clearFloorOverride,
    resetFloorOverrides,
    getActiveContext,
    RoomOverride,
    FloorOverride
} from '../services/contextService';
import RoomNotesEditor from './RoomNotesEditor';

export default function RoomOverridesManager() {
    const [hotelId, setHotelId] = useState('lge_paris_defense');

    const [floorOverrides, setFloorOverridesState] = useState<FloorOverride[]>([]);
    const [roomOverrides, setRoomOverridesState] = useState<RoomOverride[]>([]);

    const [newFloor, setNewFloor] = useState('');
    const [newFloorNotes, setNewFloorNotes] = useState('');

    const [newRoom, setNewRoom] = useState('');
    const [newRoomNotes, setNewRoomNotes] = useState('');

    const [showResetConfirm, setShowResetConfirm] = useState<'room' | 'floor' | 'global' | null>(null);
    const [activeContext, setActiveContextState] = useState<any>(null);
    const [editingRoomNotes, setEditingRoomNotes] = useState<string | null>(null);

    useEffect(() => {
        loadAll();
    }, []);

    const loadAll = () => {
        const settings = getGlobalSettings();
        setHotelId(settings.hotelId);

        setFloorOverridesState(getFloorOverrides());
        setRoomOverridesState(getRoomOverrides());
        setActiveContextState(getActiveContext());
    };

    const handleSaveGlobal = () => {
        setGlobalSettings({ hotelId });
        alert('Global settings saved');
    };

    const handleAddFloor = () => {
        const floor = parseInt(newFloor);
        if (isNaN(floor) || floor < 0) {
            alert('Please enter a valid floor number');
            return;
        }

        setFloorOverride(floor, newFloorNotes.trim() || undefined);
        setNewFloor('');
        setNewFloorNotes('');
        loadAll();
    };

    const handleDeleteFloor = (floor: number) => {
        if (confirm(`Delete floor ${floor} notes?`)) {
            clearFloorOverride(floor);
            loadAll();
        }
    };

    const handleAddRoom = () => {
        if (!newRoom.trim()) {
            alert('Please enter a room number');
            return;
        }

        setRoomOverride(newRoom.trim(), newRoomNotes.trim() || undefined);
        setNewRoom('');
        setNewRoomNotes('');
        loadAll();
    };

    const handleDeleteRoom = (room: string) => {
        if (confirm(`Delete room ${room} notes?`)) {
            clearRoomOverride(room);
            loadAll();
        }
    };

    const handleReset = (type: 'room' | 'floor' | 'global') => {
        if (type === 'room') {
            resetRoomOverrides();
        } else if (type === 'floor') {
            resetFloorOverrides();
        } else {
            setGlobalSettings({ hotelId: 'lge_paris_defense' });
        }

        setShowResetConfirm(null);
        loadAll();
    };

    return (
        <div className="space-y-6">
            {/* Active Context Display (for debugging) */}
            {activeContext && (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                    <div className="text-xs font-bold uppercase text-green-600 mb-1">Active Context (Current Session)</div>
                    <div className="text-sm font-medium text-green-800">
                        Hotel: {activeContext.hotelId}
                        {activeContext.floor !== undefined && ` • Floor ${activeContext.floor}`}
                        {activeContext.room && ` • Room ${activeContext.room}`}
                    </div>
                </div>
            )}

            {/* Global Settings */}
            <div className="bg-white rounded-2xl border-2 border-neutral-200 p-6">
                <h3 className="text-xl font-bold text-black mb-4" style={{ fontFamily: '"Rubik", sans-serif' }}>
                    Global Settings
                </h3>
                <p className="text-sm text-neutral-600 mb-4">
                    Configure global hotel settings
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Hotel ID</label>
                        <input
                            type="text"
                            value={hotelId}
                            onChange={(e) => setHotelId(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 font-medium text-sm hover:border-black transition-colors"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleSaveGlobal}
                            className="flex-1 px-6 py-3 rounded-lg bg-black text-white font-bold text-sm uppercase tracking-wider hover:bg-neutral-800 active:scale-95 transition-all"
                        >
                            Save Global Settings
                        </button>
                        <button
                            onClick={() => setShowResetConfirm('global')}
                            className="px-6 py-3 rounded-lg bg-red-100 text-red-700 font-bold text-sm uppercase tracking-wider hover:bg-red-200 active:scale-95 transition-all"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* Floor Notes */}
            <div className="bg-white rounded-2xl border-2 border-neutral-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-black" style={{ fontFamily: '"Rubik", sans-serif' }}>
                            Floor Notes
                        </h3>
                        <p className="text-sm text-neutral-600">
                            {floorOverrides.length} floor{floorOverrides.length !== 1 ? 's' : ''} configured
                        </p>
                    </div>
                    {floorOverrides.length > 0 && (
                        <button
                            onClick={() => setShowResetConfirm('floor')}
                            className="px-4 py-2 rounded-lg bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider hover:bg-red-200 active:scale-95 transition-all"
                        >
                            Reset All
                        </button>
                    )}
                </div>

                {/* Floor List */}
                {floorOverrides.length > 0 && (
                    <div className="space-y-2 mb-4">
                        {floorOverrides.map(override => (
                            <div
                                key={override.floor}
                                className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200"
                            >
                                <div className="flex-1">
                                    <span className="text-sm font-bold text-black">Floor {override.floor}</span>
                                    {override.notes && (
                                        <div className="text-xs text-neutral-500 italic mt-1">
                                            {typeof override.notes === 'string' ? override.notes : '(Multi-language notes set)'}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleDeleteFloor(override.floor)}
                                    className="px-4 py-2 rounded-lg bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider hover:bg-red-200 active:scale-95 transition-all"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Floor */}
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
                    <div className="text-xs font-bold uppercase text-neutral-500">Add Floor Notes</div>
                    <div className="flex gap-3">
                        <input
                            type="number"
                            value={newFloor}
                            onChange={(e) => setNewFloor(e.target.value)}
                            placeholder="Floor #"
                            className="w-32 px-4 py-2 rounded-lg border-2 border-neutral-200 font-medium text-sm hover:border-black transition-colors"
                        />
                        <input
                            type="text"
                            value={newFloorNotes}
                            onChange={(e) => setNewFloorNotes(e.target.value)}
                            placeholder="Notes (e.g., VIP Floor, Quiet Zone)"
                            className="flex-1 px-4 py-2 rounded-lg border-2 border-neutral-200 font-medium text-sm hover:border-black transition-colors"
                        />
                        <button
                            onClick={handleAddFloor}
                            className="px-6 py-2 rounded-lg bg-black text-white font-bold text-sm uppercase tracking-wider hover:bg-neutral-800 active:scale-95 transition-all"
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>

            {/* Room Notes */}
            <div className="bg-white rounded-2xl border-2 border-neutral-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-black" style={{ fontFamily: '"Rubik", sans-serif' }}>
                            Room Notes
                        </h3>
                        <p className="text-sm text-neutral-600">
                            {roomOverrides.length} room{roomOverrides.length !== 1 ? 's' : ''} configured
                        </p>
                    </div>
                    {roomOverrides.length > 0 && (
                        <button
                            onClick={() => setShowResetConfirm('room')}
                            className="px-4 py-2 rounded-lg bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider hover:bg-red-200 active:scale-95 transition-all"
                        >
                            Reset All
                        </button>
                    )}
                </div>

                {/* Room List */}
                {roomOverrides.length > 0 && (
                    <div className="space-y-2 mb-4">
                        {roomOverrides.map(override => (
                            <div
                                key={override.room}
                                className="p-4 bg-neutral-50 rounded-lg border border-neutral-200"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-bold text-black">Room {override.room}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setEditingRoomNotes(override.room)}
                                            className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider hover:bg-blue-200 active:scale-95 transition-all"
                                        >
                                            Edit Notes
                                        </button>
                                        <button
                                            onClick={() => handleDeleteRoom(override.room)}
                                            className="px-4 py-2 rounded-lg bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider hover:bg-red-200 active:scale-95 transition-all"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                {override.notes && (
                                    <div className="text-xs text-neutral-500 italic">
                                        {typeof override.notes === 'string' ? override.notes : '(Multi-language notes set)'}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Room */}
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
                    <div className="text-xs font-bold uppercase text-neutral-500">Add Room Notes</div>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={newRoom}
                            onChange={(e) => setNewRoom(e.target.value)}
                            placeholder="Room # (e.g., A405)"
                            className="flex-1 px-4 py-2 rounded-lg border-2 border-neutral-200 font-medium text-sm hover:border-black transition-colors"
                        />
                    </div>
                    <input
                        type="text"
                        value={newRoomNotes}
                        onChange={(e) => setNewRoomNotes(e.target.value)}
                        placeholder="Notes (e.g., VIP room, Has bathtub)"
                        className="w-full px-4 py-2 rounded-lg border-2 border-neutral-200 font-medium text-sm hover:border-black transition-colors"
                    />
                    <button
                        onClick={handleAddRoom}
                        className="w-full px-6 py-3 rounded-lg bg-black text-white font-bold text-sm uppercase tracking-wider hover:bg-neutral-800 active:scale-95 transition-all"
                    >
                        Add Room Notes
                    </button>
                </div>
            </div>

            {/* Room Notes Editor Modal */}
            {editingRoomNotes && (
                <RoomNotesEditor
                    room={editingRoomNotes}
                    onClose={() => {
                        setEditingRoomNotes(null);
                        loadAll();
                    }}
                />
            )}

            {/* Reset Confirmation Modal */}
            {showResetConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
                        <h3 className="text-2xl font-bold text-black mb-4">
                            Reset {showResetConfirm === 'room' ? 'Room' : showResetConfirm === 'floor' ? 'Floor' : 'Global'} Notes?
                        </h3>
                        <p className="text-sm text-neutral-600 mb-8 leading-relaxed">
                            This will clear all {showResetConfirm} notes and cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowResetConfirm(null)}
                                className="flex-1 h-14 rounded-xl bg-neutral-100 text-black font-bold text-sm uppercase tracking-wider hover:bg-neutral-200 active:scale-95 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleReset(showResetConfirm)}
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
