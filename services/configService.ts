import { HotelPack } from '../App';
import { Lang } from '../i18n';
import { HubContent, DEFAULT_HUB_CONTENT } from './hubContent';

const CONFIG_STORAGE_KEY = 'tsh_concierge_config_v1';
const HUB_CONTENT_STORAGE_KEY = 'tsh_hub_content_v1';

/**
 * Config Service
 * Manages hotel configuration with safe localStorage persistence.
 */

let DEFAULT_CONFIG: HotelPack | null = null;

export function setDefaultConfig(config: HotelPack) {
    DEFAULT_CONFIG = config;
}

function safeParse<T>(json: string | null, fallback: T): T {
    if (!json) return fallback;
    try {
        return JSON.parse(json) as T;
    } catch {
        console.warn('[ConfigService] Failed to parse saved config, using defaults');
        return fallback;
    }
}

function deepMerge(target: any, source: any): any {
    if (!source) return target;
    if (!target) return source;
    const result = { ...target };
    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            result[key] = deepMerge(target[key], source[key]);
        } else {
            result[key] = source[key];
        }
    }
    return result;
}

export function loadConfig(): HotelPack {
    if (!DEFAULT_CONFIG) {
        throw new Error('[ConfigService] DEFAULT_CONFIG not initialized');
    }
    try {
        const savedJson = localStorage.getItem(CONFIG_STORAGE_KEY);
        const savedOverrides = safeParse<Partial<HotelPack>>(savedJson, {});
        const mergedConfig = deepMerge(DEFAULT_CONFIG, savedOverrides);
        mergedConfig.schemaVersion = DEFAULT_CONFIG.schemaVersion;
        return mergedConfig;
    } catch (error) {
        console.error('[ConfigService] Error loading config:', error);
        return DEFAULT_CONFIG;
    }
}

export function saveConfig(config: Partial<HotelPack>): void {
    try {
        const json = JSON.stringify(config);
        localStorage.setItem(CONFIG_STORAGE_KEY, json);
        console.log('[ConfigService] Config saved');
    } catch (error) {
        console.error('[ConfigService] Error saving config:', error);
        throw error;
    }
}

export function resetConfig(): HotelPack {
    try {
        localStorage.removeItem(CONFIG_STORAGE_KEY);
        console.log('[ConfigService] Config reset to defaults');
        if (!DEFAULT_CONFIG) {
            throw new Error('[ConfigService] DEFAULT_CONFIG not initialized');
        }
        return DEFAULT_CONFIG;
    } catch (error) {
        console.error('[ConfigService] Error resetting config:', error);
        throw error;
    }
}

export function getSavedOverrides(): Partial<HotelPack> {
    try {
        const savedJson = localStorage.getItem(CONFIG_STORAGE_KEY);
        return safeParse<Partial<HotelPack>>(savedJson, {});
    } catch (error) {
        console.error('[ConfigService] Error getting saved overrides:', error);
        return {};
    }
}

/* ===========================================================
   HUB CONTENT MANAGEMENT (MVP)
   ===========================================================*/

/**
 * Get Hub content value with safe fallback
 */
export function getHubContent(
    category: keyof HubContent,
    field: string,
    lang: Lang
): string {
    try {
        const savedJson = localStorage.getItem(HUB_CONTENT_STORAGE_KEY);
        const saved = safeParse<Partial<HubContent>>(savedJson, {});

        // Try saved content first
        const savedCategory = saved[category] as any;
        if (savedCategory && savedCategory[field] && savedCategory[field][lang]) {
            const value = savedCategory[field][lang];
            if (value && value.trim() !== '') {
                return value;
            }
        }

        // Fall back to default
        const defaultCategory = DEFAULT_HUB_CONTENT[category] as any;
        if (defaultCategory && defaultCategory[field] && defaultCategory[field][lang]) {
            return defaultCategory[field][lang];
        }

        return '';
    } catch (error) {
        console.error('[ConfigService] Error getting hub content:', error);
        try {
            const defaultCategory = DEFAULT_HUB_CONTENT[category] as any;
            return defaultCategory?.[field]?.[lang] || '';
        } catch {
            return '';
        }
    }
}

/**
 * Update Hub content
 */
export function updateHubContent(
    category: keyof HubContent,
    field: string,
    lang: Lang,
    value: string
): void {
    try {
        const savedJson = localStorage.getItem(HUB_CONTENT_STORAGE_KEY);
        const saved = safeParse<any>(savedJson, {});

        if (!saved[category]) saved[category] = {};
        if (!saved[category][field]) saved[category][field] = {};
        saved[category][field][lang] = value;

        localStorage.setItem(HUB_CONTENT_STORAGE_KEY, JSON.stringify(saved));
        console.log(`[ConfigService] Hub content updated: ${category}.${field}.${lang}`);
    } catch (error) {
        console.error('[ConfigService] Error updating hub content:', error);
        throw error;
    }
}

/**
 * Get all Hub content (for admin editing)
 */
export function getAllHubContent(): HubContent {
    try {
        const savedJson = localStorage.getItem(HUB_CONTENT_STORAGE_KEY);
        const saved = safeParse<Partial<HubContent>>(savedJson, {});
        return deepMerge(DEFAULT_HUB_CONTENT, saved);
    } catch (error) {
        console.error('[ConfigService] Error getting all hub content:', error);
        return DEFAULT_HUB_CONTENT;
    }
}

/**
 * Reset Hub content to defaults
 */
export function resetHubContent(): void {
    try {
        localStorage.removeItem(HUB_CONTENT_STORAGE_KEY);
        console.log('[ConfigService] Hub content reset to defaults');
    } catch (error) {
        console.error('[ConfigService] Error resetting hub content:', error);
        throw error;
    }
}
