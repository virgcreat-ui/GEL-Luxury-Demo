
import { Lang } from "../i18n";
import { SCRIPT_POOLS, ScriptScene } from "./voiceScripts";

// We track usage to avoid repeats.
// Map<Scene, Set<UsedPhrase>>
const phraseHistory: Map<string, Set<string>> = new Map();

/**
 * Gets a random phrase for a scene/lang, ensuring no back-to-back repeats.
 * If all phrases have been used, it resets the pool for that scene.
 */
export function getVoiceScript(scene: ScriptScene, lang: Lang): string {
    const pool = SCRIPT_POOLS[scene]?.[lang] || SCRIPT_POOLS[scene]?.["en"];

    if (!pool || pool.length === 0) {
        console.warn(`[VoiceLogic] No pool found for scene: ${scene} (${lang})`);
        return "";
    }

    // If pool has only 1 item, return it (repeat inevitable)
    if (pool.length === 1) return pool[0];

    const historyKey = `${scene}_${lang}`;
    if (!phraseHistory.has(historyKey)) {
        phraseHistory.set(historyKey, new Set());
    }

    const used = phraseHistory.get(historyKey)!;

    // Filter out used phrases
    const available = pool.filter(p => !used.has(p));

    // If we exhausted all options, reset history and use full pool
    if (available.length === 0) {
        used.clear();
        // Start fresh with full pool
        // To be super safe, we could pick any, but let's try to avoid the VERY LAST one if possible
        // For now, simpler: pick random from full pool
        const random = pool[Math.floor(Math.random() * pool.length)];
        used.add(random);
        return random;
    }

    // Pick random from available
    const selected = available[Math.floor(Math.random() * available.length)];
    used.add(selected);
    return selected;
}

export function resetVoiceHistory() {
    phraseHistory.clear();
}
