/**
 * Context Service
 * Manages room/floor context and stay type resolution
 * 
 * CRITICAL: This system NEVER infers guest type. It only uses explicit admin configuration.
 * Resolution order: Room Override → Floor Override → Global Default
 */

import { Lang } from '../i18n';

const CONTEXT_STORAGE_KEY = 'tsh_active_context_v1';
const ROOM_OVERRIDES_KEY = 'tsh_room_overrides_v1';
const FLOOR_OVERRIDES_KEY = 'tsh_floor_overrides_v1';
const GLOBAL_SETTINGS_KEY = 'tsh_global_settings_v1';

/**
 * Stay type enum
 * - guest: Short-term hotel guests
 * - student: Long-term student residents
 * - mixed: Both types share this space (prompts user once)
 */
export type StayType = 'guest' | 'student' | 'mixed';

/**
 * Room context from QR code or manual entry
 */
export interface RoomContext {
    hotelId: string;
    floor?: number;
    room?: string;
}

/**
 * Room-level stay type override (highest priority)
 * notes: Per-language informational notes shown to guests
 */
export interface RoomOverride {
    room: string;
    stayType: StayType;
    notes?: Record<Lang, string> | string; // Per-language notes (string for backward compat)
}

/**
 * Floor-level stay type override
 */
export interface FloorOverride {
    floor: number;
    stayType: StayType;
}

/**
 * Global hotel settings (fallback)
 */
export interface GlobalSettings {
    defaultStayType: StayType;
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
   ROOM OVERRIDES
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
 * Set or update a room override
 */
export function setRoomOverride(room: string, stayType: StayType, notes?: string): void {
    try {
        const overrides = getRoomOverrides();
        const existingIndex = overrides.findIndex(r => r.room === room);

        const override: RoomOverride = { room, stayType, notes };

        if (existingIndex >= 0) {
            overrides[existingIndex] = override;
        } else {
            overrides.push(override);
        }

        localStorage.setItem(ROOM_OVERRIDES_KEY, JSON.stringify(overrides));
        console.log(`[ContextService] Room override set: ${room} → ${stayType}`);
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
function migrateRoomNotes(override: any): RoomOverride {
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
            // Create new override with just notes (no stayType yet)
            overrides.push({
                room,
                stayType: 'guest', // Default
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
            delete override.notes;
            localStorage.setItem(ROOM_OVERRIDES_KEY, JSON.stringify(overrides));
            console.log(`[ContextService] Room notes cleared: ${room}`);
        }
    } catch (error) {
        console.error('[ContextService] Error clearing room notes:', error);
        throw error;
    }
}

/* ===========================================================
   FLOOR OVERRIDES
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
 * Set or update a floor override
 */
export function setFloorOverride(floor: number, stayType: StayType): void {
    try {
        const overrides = getFloorOverrides();
        const existingIndex = overrides.findIndex(f => f.floor === floor);

        const override: FloorOverride = { floor, stayType };

        if (existingIndex >= 0) {
            overrides[existingIndex] = override;
        } else {
            overrides.push(override);
        }

        localStorage.setItem(FLOOR_OVERRIDES_KEY, JSON.stringify(overrides));
        console.log(`[ContextService] Floor override set: Floor ${floor} → ${stayType}`);
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
            defaultStayType: 'guest',
            hotelId: 'tsh_paris_defense'
        });
    } catch (error) {
        console.error('[ContextService] Error getting global settings:', error);
        return {
            defaultStayType: 'guest',
            hotelId: 'tsh_paris_defense'
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

/* ===========================================================
   STAY TYPE RESOLUTION (CORE ALGORITHM)
   ===========================================================*/

/**
 * Resolve stay type from context
 * 
 * Resolution order (highest to lowest priority):
 * 1. Room override (if context.room is set)
 * 2. Floor override (if context.floor is set)
 * 3. Global default
 * 
 * Returns:
 * - StayType if context exists and resolution succeeds
 * - null if no context (app should show current selector)
 * 
 * CRITICAL: This function NEVER assumes or infers.
 * It only returns what is explicitly configured.
 */
export function resolveStayType(context?: RoomContext | null): StayType | null {
    // No context → no resolution
    if (!context) {
        return null;
    }

    try {
        // 1. Check room override (highest priority)
        if (context.room) {
            const roomOverrides = getRoomOverrides();
            const roomOverride = roomOverrides.find(r => r.room === context.room);

            if (roomOverride) {
                console.log(`[ContextService] Resolved via room override: ${context.room} → ${roomOverride.stayType}`);
                return roomOverride.stayType;
            }
        }

        // 2. Check floor override
        if (context.floor !== undefined) {
            const floorOverrides = getFloorOverrides();
            const floorOverride = floorOverrides.find(f => f.floor === context.floor);

            if (floorOverride) {
                console.log(`[ContextService] Resolved via floor override: Floor ${context.floor} → ${floorOverride.stayType}`);
                return floorOverride.stayType;
            }
        }

        // 3. Use global default
        const settings = getGlobalSettings();
        console.log(`[ContextService] Resolved via global default: ${settings.defaultStayType}`);
        return settings.defaultStayType;
    } catch (error) {
        console.error('[ContextService] Error resolving stay type:', error);
        // Safe fallback
        return null;
    }
}

/**
 * Get stay type label for admin UI
 */
export function getStayTypeLabel(stayType: StayType): string {
    const labels: Record<StayType, string> = {
        guest: 'Hotel Guest (Short-term)',
        student: 'Student (Long-term)',
        mixed: 'Mixed (Ask on first use)'
    };
    return labels[stayType];
}
