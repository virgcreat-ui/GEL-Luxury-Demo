/**
 * Image Service
 * Provides safe image retrieval for guest UI with fallback to defaults
 */

import { ImageSlot, DEFAULT_IMAGES, getSlotAssignment } from './imageSlots';
import { getMediaById } from './mediaService';

/**
 * Get image URL for a slot with safe fallback
 * This is the primary function used by guest UI components
 * 
 * @param slotId - The image slot to get image for
 * @returns Promise resolving to image URL (custom or default)
 */
export async function getImageForSlot(slotId: ImageSlot): Promise<string> {
    try {
        // 1. Check if slot has an assignment
        const mediaId = getSlotAssignment(slotId);

        if (!mediaId) {
            // No override → return default
            return DEFAULT_IMAGES[slotId];
        }

        // 2. Try to load the assigned media
        try {
            const media = await getMediaById(mediaId);

            if (media && media.displayUrl) {
                return media.displayUrl;
            }
        } catch (error) {
            console.warn(`[ImageService] Failed to load media ${mediaId} for slot ${slotId}, using default`);
        }

        // 3. Fallback to default if media not found or error
        return DEFAULT_IMAGES[slotId];
    } catch (error) {
        console.error(`[ImageService] Error getting image for slot ${slotId}:`, error);
        // Always fallback to default on any error
        return DEFAULT_IMAGES[slotId];
    }
}

/**
 * Preload image for a slot
 * Useful for improving perceived performance
 */
export async function preloadImageForSlot(slotId: ImageSlot): Promise<void> {
    try {
        const url = await getImageForSlot(slotId);
        const img = new Image();
        img.src = url;
    } catch (error) {
        // Silent fail for preload
        console.warn(`[ImageService] Failed to preload image for slot ${slotId}`);
    }
}

/**
 * Batch get images for multiple slots
 * Useful for loading all images for a section at once
 */
export async function getImagesForSlots(slotIds: ImageSlot[]): Promise<Record<ImageSlot, string>> {
    const results: Record<ImageSlot, string> = {} as any;

    await Promise.all(
        slotIds.map(async (slotId) => {
            results[slotId] = await getImageForSlot(slotId);
        })
    );

    return results;
}
