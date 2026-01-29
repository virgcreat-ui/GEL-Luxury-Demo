/**
 * Context Service
 * Manages room/floor context and guest notes
 * 
 * Simplified to hotel guest flow only (no student/stay type logic)
 */

import { Lang } from '../i18n';

const CONTEXT_STORAGE_KEY = 'lge_active_context_v1';
const ROOM_OVERRIDES_KEY = 'lge_room_overrides_v1';
const FLOOR_OVERRIDES_KEY = 'lge_floor_overrides_v1';
const GLOBAL_SETTINGS_KEY = 'lge_global_settings_v1';

/**
 * Room context from QR code or manual entry
 */
export interface RoomContext {
    hotelId: string;
    floor?: number;
    room?: string;
}

/**
 * Room-level override for guest notes
 * notes: Per-language informational notes shown to guests
 */
export interface RoomOverride {
    room: string;
    notes?: Partial<Record<Lang, string>> | string; // Per-language notes (string for backward compat)
}

/**
 * Floor-level override for notes
 */
export interface FloorOverride {
    floor: number;
    notes?: Partial<Record<Lang, string>> | string;
}

/**
 * Global hotel settings
 */
export interface GlobalSettings {
    hotelId: string;
}

/**
 * Safe JSON parse helper
 */
function safeParse<T>(json: string | null, fallback: T): T {
    if (!json) return fallback;
    try {
        return JSON.parse(json) as T;
    } catch {
        console.warn('[ContextService] Failed to parse, using fallback');
        return fallback;
    }
}

/* ===========================================================
   ACTIVE CONTEXT MANAGEMENT
   ===========================================================*/

/**
 * Get current room context (set by QR code or admin)
 */
export function getActiveContext(): RoomContext | null {
    try {
        const json = localStorage.getItem(CONTEXT_STORAGE_KEY);
        if (!json) return null;

        const context = safeParse<RoomContext | null>(json, null);
        return context;
    } catch (error) {
        console.error('[ContextService] Error getting active context:', error);
        return null;
    }
}

/**
 * Set active room context
 * Called when QR code is scanned or admin sets context
 */
export function setActiveContext(context: RoomContext): void {
    try {
        const json = JSON.stringify(context);
        localStorage.setItem(CONTEXT_STORAGE_KEY, json);
        console.log('[ContextService] Active context set:', context);
    } catch (error) {
        console.error('[ContextService] Error setting active context:', error);
        throw error;
    }
}

/**
 * Clear active context (for testing or reset)
 */
export function clearActiveContext(): void {
    try {
        localStorage.removeItem(CONTEXT_STORAGE_KEY);
        console.log('[ContextService] Active context cleared');
    } catch (error) {
        console.error('[ContextService] Error clearing active context:', error);
        throw error;
    }
}

/* ===========================================================
   ROOM OVERRIDES (Notes Only)
   ===========================================================*/

/**
 * Get all room overrides
 */
export function getRoomOverrides(): RoomOverride[] {
    try {
        const json = localStorage.getItem(ROOM_OVERRIDES_KEY);
        return safeParse<RoomOverride[]>(json, []);
    } catch (error) {
        console.error('[ContextService] Error getting room overrides:', error);
        return [];
    }
}

/**
 * Set or update a room override (notes only)
 */
export function setRoomOverride(room: string, notes?: string): void {
    try {
        const overrides = getRoomOverrides();
        const existingIndex = overrides.findIndex(r => r.room === room);

        const override: RoomOverride = { room, notes };

        if (existingIndex >= 0) {
            overrides[existingIndex] = override;
        } else {
            overrides.push(override);
        }

        localStorage.setItem(ROOM_OVERRIDES_KEY, JSON.stringify(overrides));
        console.log(`[ContextService] Room override set: ${room}`);
    } catch (error) {
        console.error('[ContextService] Error setting room override:', error);
        throw error;
    }
}

/**
 * Clear a specific room override
 */
export function clearRoomOverride(room: string): void {
    try {
        const overrides = getRoomOverrides();
        const filtered = overrides.filter(r => r.room !== room);
        localStorage.setItem(ROOM_OVERRIDES_KEY, JSON.stringify(filtered));
        console.log(`[ContextService] Room override cleared: ${room}`);
    } catch (error) {
        console.error('[ContextService] Error clearing room override:', error);
        throw error;
    }
}

/**
 * Clear all room overrides
 */
export function resetRoomOverrides(): void {
    try {
        localStorage.removeItem(ROOM_OVERRIDES_KEY);
        console.log('[ContextService] All room overrides reset');
    } catch (error) {
        console.error('[ContextService] Error resetting room overrides:', error);
        throw error;
    }
}

/* ===========================================================
   ROOM NOTES MANAGEMENT
   ===========================================================*/

/**
 * Migrate old string notes to new format
 */
function migrateRoomNotes(override: RoomOverride): RoomOverride {
    if (typeof override.notes === 'string') {
        // Old format: migrate to new
        return {
            ...override,
            notes: { en: override.notes }
        };
    }
    return override;
}

/**
 * Get room notes for specific language with fallback
 */
export function getRoomNotes(room: string, lang: Lang): string | null {
    try {
        const overrides = getRoomOverrides();
        const override = overrides.find(o => o.room === room);

        if (!override || !override.notes) return null;

        // Handle old string format
        if (typeof override.notes === 'string') {
            return override.notes;
        }

        // Try requested language
        if (override.notes[lang]) return override.notes[lang];

        // Fallback to English
        if (override.notes.en) return override.notes.en;

        // No notes available
        return null;
    } catch (error) {
        console.error('[ContextService] Error getting room notes:', error);
        return null;
    }
}

/**
 * Set room notes for specific language
 */
export function setRoomNotes(room: string, lang: Lang, text: string): void {
    try {
        const overrides = getRoomOverrides().map(migrateRoomNotes);
        const existingIndex = overrides.findIndex(r => r.room === room);

        if (existingIndex >= 0) {
            const existing = overrides[existingIndex];
            const notes = typeof existing.notes === 'object' ? existing.notes : {};
            overrides[existingIndex] = {
                ...existing,
                notes: { ...notes, [lang]: text }
            };
        } else {
            // Create new override with just notes
            overrides.push({
                room,
                notes: { [lang]: text }
            });
        }

        localStorage.setItem(ROOM_OVERRIDES_KEY, JSON.stringify(overrides));
        console.log(`[ContextService] Room notes set: ${room} (${lang})`);
    } catch (error) {
        console.error('[ContextService] Error setting room notes:', error);
        throw error;
    }
}

/**
 * Clear all notes for a room (all languages)
 */
export function clearRoomNotes(room: string): void {
    try {
        const overrides = getRoomOverrides();
        const override = overrides.find(o => o.room === room);

        if (override) {
            override.notes = undefined;
            localStorage.setItem(ROOM_OVERRIDES_KEY, JSON.stringify(overrides));
            console.log(`[ContextService] Room notes cleared: ${room}`);
        }
    } catch (error) {
        console.error('[ContextService] Error clearing room notes:', error);
        throw error;
    }
}

/* ===========================================================
   FLOOR OVERRIDES (Notes Only)
   ===========================================================*/

/**
 * Get all floor overrides
 */
export function getFloorOverrides(): FloorOverride[] {
    try {
        const json = localStorage.getItem(FLOOR_OVERRIDES_KEY);
        return safeParse<FloorOverride[]>(json, []);
    } catch (error) {
        console.error('[ContextService] Error getting floor overrides:', error);
        return [];
    }
}

/**
 * Set or update a floor override (notes only)
 */
export function setFloorOverride(floor: number, notes?: string): void {
    try {
        const overrides = getFloorOverrides();
        const existingIndex = overrides.findIndex(f => f.floor === floor);

        const override: FloorOverride = { floor, notes };

        if (existingIndex >= 0) {
            overrides[existingIndex] = override;
        } else {
            overrides.push(override);
        }

        localStorage.setItem(FLOOR_OVERRIDES_KEY, JSON.stringify(overrides));
        console.log(`[ContextService] Floor override set: Floor ${floor}`);
    } catch (error) {
        console.error('[ContextService] Error setting floor override:', error);
        throw error;
    }
}

/**
 * Clear a specific floor override
 */
export function clearFloorOverride(floor: number): void {
    try {
        const overrides = getFloorOverrides();
        const filtered = overrides.filter(f => f.floor !== floor);
        localStorage.setItem(FLOOR_OVERRIDES_KEY, JSON.stringify(filtered));
        console.log(`[ContextService] Floor override cleared: Floor ${floor}`);
    } catch (error) {
        console.error('[ContextService] Error clearing floor override:', error);
        throw error;
    }
}

/**
 * Clear all floor overrides
 */
export function resetFloorOverrides(): void {
    try {
        localStorage.removeItem(FLOOR_OVERRIDES_KEY);
        console.log('[ContextService] All floor overrides reset');
    } catch (error) {
        console.error('[ContextService] Error resetting floor overrides:', error);
        throw error;
    }
}

/* ===========================================================
   GLOBAL SETTINGS
   ===========================================================*/

/**
 * Get global hotel settings
 */
export function getGlobalSettings(): GlobalSettings {
    try {
        const json = localStorage.getItem(GLOBAL_SETTINGS_KEY);
        return safeParse<GlobalSettings>(json, {
            hotelId: 'lge_paris_defense'
        });
    } catch (error) {
        console.error('[ContextService] Error getting global settings:', error);
        return {
            hotelId: 'lge_paris_defense'
        };
    }
}

/**
 * Set global hotel settings
 */
export function setGlobalSettings(settings: GlobalSettings): void {
    try {
        localStorage.setItem(GLOBAL_SETTINGS_KEY, JSON.stringify(settings));
        console.log('[ContextService] Global settings saved:', settings);
    } catch (error) {
        console.error('[ContextService] Error setting global settings:', error);
        throw error;
    }
}

/**
 * Reset global settings to defaults
 */
export function resetGlobalSettings(): void {
    try {
        localStorage.removeItem(GLOBAL_SETTINGS_KEY);
        console.log('[ContextService] Global settings reset to defaults');
    } catch (error) {
        console.error('[ContextService] Error resetting global settings:', error);
        throw error;
    }
}
