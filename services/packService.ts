/**
 * Pack Service
 * Handles hotel configuration pack export/import
 * Enables easy deployment across multiple locations
 */

import { Lang } from '../i18n';
import { ConciergeFlow } from './contentService';
import { GlobalSettings, FloorOverride, RoomOverride } from './contextService';

const STORAGE_KEYS = {
    // Hub
    hubConfig: 'tsh_hub_config_v1',
    hubContent: 'tsh_hub_content_v1',

    // Content sections
    roomContent: 'tsh_room_content_v1',
    areaContent: 'tsh_area_content_v1',
    eventsContent: 'tsh_events_content_v1',
    conciergeContent: 'tsh_concierge_content_v1',

    // Concierge flows
    conciergeFlows: 'tsh_concierge_flows',

    // QR Context
    globalSettings: 'tsh_global_settings_v1',
    floorOverrides: 'tsh_floor_overrides_v1',
    roomOverrides: 'tsh_room_overrides_v1',

    // Image slots
    imageSlots: 'tsh_image_slots_v1',
    mediaMeta: 'tsh_media_v1',
} as const;

/* ===========================================================
   DATA MODELS
   ===========================================================*/

export interface HotelPackV2 {
    version: 2;
    exportedAt: string;
    hotelMeta?: {
        name?: string;
        location?: string;
    };
    languageDefaults?: {
        defaultLang?: Lang;
    };

    // Content overrides (all sections)
    contentOverrides?: {
        hub?: any;
        room?: any;
        area?: any;
        events?: any;
        conciergeContent?: any;
    };

    // Concierge flows
    conciergeFlowOverrides?: ConciergeFlow[];

    // QR context system
    qrContext?: {
        globalDefault?: GlobalSettings;
        floorOverrides?: FloorOverride[];
        roomOverrides?: RoomOverride[];
    };

    // Image slot assignments (metadata only!)
    imageSlots?: {
        assignments?: Record<string, string>;  // slotId -> mediaKey
        mediaMeta?: Array<{
            key: string;
            label?: string;
            createdAt?: string;
        }>;
    };

    // Hub config (facility toggles)
    hubConfig?: any;
}

export interface ImportOptions {
    content?: boolean;
    conciergeFlows?: boolean;
    qrContext?: boolean;
    imageSlots?: boolean;
    hubConfig?: boolean;
}

export interface ImportSummary {
    version: number;
    exportedAt?: string;
    hotelName?: string;
    hotelLocation?: string;
    contentSections: number;
    conciergeFlows: number;
    roomOverrides: number;
    floorOverrides: number;
    imageSlotAssignments: number;
    mediaMetaCount: number;
}

/* ===========================================================
   SAFE HELPERS
   ===========================================================*/

function safeParse<T>(json: string | null, fallback: T): T {
    if (!json) return fallback;
    try {
        return JSON.parse(json) as T;
    } catch {
        return fallback;
    }
}

function safeStringify(data: any): string {
    try {
        return JSON.stringify(data, null, 2);
    } catch (error) {
        console.error('[PackService] Stringify error:', error);
        return '{}';
    }
}

/* ===========================================================
   EXPORT FUNCTIONS
   ===========================================================*/

/**
 * Assemble current hotel configuration into a pack
 */
export function assembleHotelPack(hotelName?: string, location?: string): HotelPackV2 {
    const pack: HotelPackV2 = {
        version: 2,
        exportedAt: new Date().toISOString(),
    };

    // Hotel metadata
    if (hotelName || location) {
        pack.hotelMeta = {};
        if (hotelName) pack.hotelMeta.name = hotelName;
        if (location) pack.hotelMeta.location = location;
    }

    // Content overrides
    const contentOverrides: any = {};

    const hubContent = localStorage.getItem(STORAGE_KEYS.hubContent);
    if (hubContent) contentOverrides.hub = safeParse(hubContent, {});

    const roomContent = localStorage.getItem(STORAGE_KEYS.roomContent);
    if (roomContent) contentOverrides.room = safeParse(roomContent, {});

    const areaContent = localStorage.getItem(STORAGE_KEYS.areaContent);
    if (areaContent) contentOverrides.area = safeParse(areaContent, {});

    const eventsContent = localStorage.getItem(STORAGE_KEYS.eventsContent);
    if (eventsContent) contentOverrides.events = safeParse(eventsContent, {});

    const conciergeContent = localStorage.getItem(STORAGE_KEYS.conciergeContent);
    if (conciergeContent) contentOverrides.conciergeContent = safeParse(conciergeContent, {});

    if (Object.keys(contentOverrides).length > 0) {
        pack.contentOverrides = contentOverrides;
    }

    // Concierge flows
    const flows = localStorage.getItem(STORAGE_KEYS.conciergeFlows);
    if (flows) {
        pack.conciergeFlowOverrides = safeParse<ConciergeFlow[]>(flows, []);
    }

    // QR Context
    const qrContext: any = {};

    const globalSettings = localStorage.getItem(STORAGE_KEYS.globalSettings);
    if (globalSettings) qrContext.globalDefault = safeParse(globalSettings, {});

    const floorOverrides = localStorage.getItem(STORAGE_KEYS.floorOverrides);
    if (floorOverrides) qrContext.floorOverrides = safeParse(floorOverrides, []);

    const roomOverrides = localStorage.getItem(STORAGE_KEYS.roomOverrides);
    if (roomOverrides) qrContext.roomOverrides = safeParse(roomOverrides, []);

    if (Object.keys(qrContext).length > 0) {
        pack.qrContext = qrContext;
    }

    // Image slots (metadata only - no binary data!)
    const imageSlots: any = {};

    const slotAssignments = localStorage.getItem(STORAGE_KEYS.imageSlots);
    if (slotAssignments) {
        const assignments = safeParse(slotAssignments, []);
        // Convert array to object for easier lookup
        const assignmentMap: Record<string, string> = {};
        assignments.forEach((a: any) => {
            if (a.slotId && a.mediaId) {
                assignmentMap[a.slotId] = a.mediaId;
            }
        });
        if (Object.keys(assignmentMap).length > 0) {
            imageSlots.assignments = assignmentMap;
        }
    }

    const mediaMeta = localStorage.getItem(STORAGE_KEYS.mediaMeta);
    if (mediaMeta) {
        const meta = safeParse(mediaMeta, []);
        if (meta.length > 0) {
            imageSlots.mediaMeta = meta.map((m: any) => ({
                key: m.id,
                label: m.name,
                createdAt: m.uploadedAt ? new Date(m.uploadedAt).toISOString() : undefined
            }));
        }
    }

    if (Object.keys(imageSlots).length > 0) {
        pack.imageSlots = imageSlots;
    }

    // Hub config (facility toggles)
    const hubConfig = localStorage.getItem(STORAGE_KEYS.hubConfig);
    if (hubConfig) {
        pack.hubConfig = safeParse(hubConfig, {});
    }

    return pack;
}

/**
 * Export hotel pack and download as JSON file
 */
export function exportHotelPack(hotelName?: string, location?: string): void {
    try {
        const pack = assembleHotelPack(hotelName, location);
        const json = safeStringify(pack);

        // Generate filename
        const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const locationSlug = location ? location.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'default';
        const filename = `tsh-hotel-pack-${locationSlug}-${timestamp}.json`;

        // Create download
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log('[PackService] Exported hotel pack:', filename);
    } catch (error) {
        console.error('[PackService] Export failed:', error);
        throw new Error('Failed to export hotel pack. Please try again.');
    }
}

/* ===========================================================
   IMPORT FUNCTIONS
   ===========================================================*/

/**
 * Validate and detect pack version
 */
export function validatePack(data: any): { valid: boolean; version: number; error?: string } {
    if (!data || typeof data !== 'object') {
        return { valid: false, version: 0, error: 'Invalid JSON data' };
    }

    // Detect version
    const version = data.version || 1;

    if (version === 2) {
        // V2 validation
        if (!data.exportedAt) {
            return { valid: false, version: 2, error: 'Missing exportedAt field' };
        }
        return { valid: true, version: 2 };
    } else {
        // V1 or unknown - accept with warnings
        console.warn('[PackService] Legacy or unknown pack version detected');
        return { valid: true, version: 1 };
    }
}

/**
 * Preview import without applying
 */
export function previewImport(data: any): ImportSummary {
    const pack = data as HotelPackV2;

    const summary: ImportSummary = {
        version: pack.version || 1,
        exportedAt: pack.exportedAt,
        hotelName: pack.hotelMeta?.name,
        hotelLocation: pack.hotelMeta?.location,
        contentSections: 0,
        conciergeFlows: 0,
        roomOverrides: 0,
        floorOverrides: 0,
        imageSlotAssignments: 0,
        mediaMetaCount: 0,
    };

    // Count content sections
    if (pack.contentOverrides) {
        summary.contentSections = Object.keys(pack.contentOverrides).length;
    }

    // Count flows
    if (pack.conciergeFlowOverrides) {
        summary.conciergeFlows = pack.conciergeFlowOverrides.length;
    }

    // Count QR overrides
    if (pack.qrContext?.roomOverrides) {
        summary.roomOverrides = pack.qrContext.roomOverrides.length;
    }
    if (pack.qrContext?.floorOverrides) {
        summary.floorOverrides = pack.qrContext.floorOverrides.length;
    }

    // Count image assignments
    if (pack.imageSlots?.assignments) {
        summary.imageSlotAssignments = Object.keys(pack.imageSlots.assignments).length;
    }
    if (pack.imageSlots?.mediaMeta) {
        summary.mediaMetaCount = pack.imageSlots.mediaMeta.length;
    }

    return summary;
}

/**
 * Import hotel pack with selected options
 */
export function importHotelPack(data: any, options: ImportOptions): void {
    try {
        const validation = validatePack(data);
        if (!validation.valid) {
            throw new Error(validation.error || 'Invalid pack data');
        }

        const pack = data as HotelPackV2;

        // Import content overrides
        if (options.content && pack.contentOverrides) {
            if (pack.contentOverrides.hub) {
                localStorage.setItem(STORAGE_KEYS.hubContent, safeStringify(pack.contentOverrides.hub));
            }
            if (pack.contentOverrides.room) {
                localStorage.setItem(STORAGE_KEYS.roomContent, safeStringify(pack.contentOverrides.room));
            }
            if (pack.contentOverrides.area) {
                localStorage.setItem(STORAGE_KEYS.areaContent, safeStringify(pack.contentOverrides.area));
            }
            if (pack.contentOverrides.events) {
                localStorage.setItem(STORAGE_KEYS.eventsContent, safeStringify(pack.contentOverrides.events));
            }
            if (pack.contentOverrides.conciergeContent) {
                localStorage.setItem(STORAGE_KEYS.conciergeContent, safeStringify(pack.contentOverrides.conciergeContent));
            }
            console.log('[PackService] Imported content overrides');
        }

        // Import concierge flows
        if (options.conciergeFlows && pack.conciergeFlowOverrides) {
            localStorage.setItem(STORAGE_KEYS.conciergeFlows, safeStringify(pack.conciergeFlowOverrides));
            console.log('[PackService] Imported concierge flows');
        }

        // Import QR context
        if (options.qrContext && pack.qrContext) {
            if (pack.qrContext.globalDefault) {
                localStorage.setItem(STORAGE_KEYS.globalSettings, safeStringify(pack.qrContext.globalDefault));
            }
            if (pack.qrContext.floorOverrides) {
                localStorage.setItem(STORAGE_KEYS.floorOverrides, safeStringify(pack.qrContext.floorOverrides));
            }
            if (pack.qrContext.roomOverrides) {
                localStorage.setItem(STORAGE_KEYS.roomOverrides, safeStringify(pack.qrContext.roomOverrides));
            }
            console.log('[PackService] Imported QR context');
        }

        // Import image slot assignments
        if (options.imageSlots && pack.imageSlots) {
            if (pack.imageSlots.assignments) {
                // Convert object back to array format
                const assignments = Object.entries(pack.imageSlots.assignments).map(([slotId, mediaId]) => ({
                    slotId,
                    mediaId
                }));
                localStorage.setItem(STORAGE_KEYS.imageSlots, safeStringify(assignments));
            }
            if (pack.imageSlots.mediaMeta) {
                // Convert metadata format
                const meta = pack.imageSlots.mediaMeta.map(m => ({
                    id: m.key,
                    name: m.label || m.key,
                    uploadedAt: m.createdAt ? new Date(m.createdAt).getTime() : Date.now(),
                    filename: m.label || m.key,
                    size: 0,
                    width: 0,
                    height: 0
                }));
                localStorage.setItem(STORAGE_KEYS.mediaMeta, safeStringify(meta));
            }
            console.log('[PackService] Imported image slot assignments');
        }

        // Import hub config
        if (options.hubConfig && pack.hubConfig) {
            localStorage.setItem(STORAGE_KEYS.hubConfig, safeStringify(pack.hubConfig));
            console.log('[PackService] Imported hub config');
        }

        console.log('[PackService] Import completed successfully');
    } catch (error) {
        console.error('[PackService] Import failed:', error);
        throw error;
    }
}

/**
 * Read pack from uploaded file
 */
export async function readPackFile(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const data = JSON.parse(text);
                resolve(data);
            } catch (error) {
                reject(new Error('Failed to parse JSON file'));
            }
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsText(file);
    });
}

/**
 * Get current config summary (for export UI)
 */
export function getCurrentConfigSummary(): {
    contentSections: number;
    conciergeFlows: number;
    roomOverrides: number;
    floorOverrides: number;
    imageSlotAssignments: number;
} {
    const summary = {
        contentSections: 0,
        conciergeFlows: 0,
        roomOverrides: 0,
        floorOverrides: 0,
        imageSlotAssignments: 0,
    };

    // Count content sections
    [
        STORAGE_KEYS.hubContent,
        STORAGE_KEYS.roomContent,
        STORAGE_KEYS.areaContent,
        STORAGE_KEYS.eventsContent,
        STORAGE_KEYS.conciergeContent
    ].forEach(key => {
        const item = localStorage.getItem(key);
        if (item) {
            const data = safeParse(item, {});
            if (Object.keys(data).length > 0) {
                summary.contentSections++;
            }
        }
    });

    // Count flows
    const flows = localStorage.getItem(STORAGE_KEYS.conciergeFlows);
    if (flows) {
        const data = safeParse<any[]>(flows, []);
        summary.conciergeFlows = data.length;
    }

    // Count room overrides
    const roomOverrides = localStorage.getItem(STORAGE_KEYS.roomOverrides);
    if (roomOverrides) {
        const data = safeParse<any[]>(roomOverrides, []);
        summary.roomOverrides = data.length;
    }

    // Count floor overrides
    const floorOverrides = localStorage.getItem(STORAGE_KEYS.floorOverrides);
    if (floorOverrides) {
        const data = safeParse<any[]>(floorOverrides, []);
        summary.floorOverrides = data.length;
    }

    // Count image slots
    const imageSlots = localStorage.getItem(STORAGE_KEYS.imageSlots);
    if (imageSlots) {
        const data = safeParse<any[]>(imageSlots, []);
        summary.imageSlotAssignments = data.length;
    }

    return summary;
}
