/**
 * Media Service
 * Handles image upload, storage (IndexedDB), and management
 */

const DB_NAME = 'tsh_media_db';
const DB_VERSION = 1;
const STORE_NAME = 'media';
const METADATA_STORAGE_KEY = 'tsh_media_v1';

export interface MediaItem {
    id: string;
    name: string;
    filename: string;
    uploadedAt: number;
    thumbnailBlob: Blob;
    displayBlob: Blob;
    size: number;
    width: number;
    height: number;
}

export interface MediaItemDisplay extends Omit<MediaItem, 'thumbnailBlob' | 'displayBlob'> {
    thumbnailUrl: string;
    displayUrl: string;
}

let dbInstance: IDBDatabase | null = null;

/**
 * Initialize IndexedDB
 */
async function getDB(): Promise<IDBDatabase> {
    if (dbInstance) return dbInstance;

    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            dbInstance = request.result;
            resolve(dbInstance);
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
    });
}

/**
 * Generate unique ID
 */
function generateId(): string {
    return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Resize image to max dimensions
 */
async function resizeImage(file: File, maxDimension: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target?.result as string;
        };

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
            }

            let { width, height } = img;
            const ratio = width / height;

            // Resize maintaining aspect ratio
            if (width > height) {
                if (width > maxDimension) {
                    width = maxDimension;
                    height = width / ratio;
                }
            } else {
                if (height > maxDimension) {
                    height = maxDimension;
                    width = height * ratio;
                }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to create blob'));
                    }
                },
                'image/jpeg',
                0.9
            );
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

/**
 * Get image dimensions
 */
async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target?.result as string;
        };

        img.onload = () => {
            resolve({ width: img.width, height: img.height });
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

/**
 * Check storage quota
 */
async function checkStorageQuota(): Promise<{ canUpload: boolean; usagePercent: number }> {
    if (!navigator.storage || !navigator.storage.estimate) {
        // Fallback: assume we have space
        return { canUpload: true, usagePercent: 0 };
    }

    try {
        const estimate = await navigator.storage.estimate();
        const usage = estimate.usage || 0;
        const quota = estimate.quota || 0;

        if (quota === 0) {
            return { canUpload: true, usagePercent: 0 };
        }

        const usagePercent = (usage / quota) * 100;
        const canUpload = usagePercent < 90; // Stop at 90% full

        return { canUpload, usagePercent };
    } catch (error) {
        console.warn('[MediaService] Failed to check storage quota:', error);
        return { canUpload: true, usagePercent: 0 };
    }
}

/**
 * Upload and process image
 */
export async function uploadImage(file: File): Promise<MediaItemDisplay> {
    // Check storage quota
    const { canUpload, usagePercent } = await checkStorageQuota();
    if (!canUpload) {
        throw new Error(`Storage full (${usagePercent.toFixed(0)}% used). Delete images to free up space.`);
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        throw new Error('Image too large. Maximum size is 10MB');
    }

    try {
        // Get original dimensions
        const dimensions = await getImageDimensions(file);

        // Generate thumbnail and display versions
        const thumbnailBlob = await resizeImage(file, 200);
        const displayBlob = await resizeImage(file, 1600);

        // Create media item
        const mediaItem: MediaItem = {
            id: generateId(),
            name: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
            filename: file.name,
            uploadedAt: Date.now(),
            thumbnailBlob,
            displayBlob,
            size: file.size,
            width: dimensions.width,
            height: dimensions.height
        };

        // Store in IndexedDB
        const db = await getDB();
        await new Promise<void>((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.add(mediaItem);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });

        // Update metadata in localStorage
        const metadata = getMediaMetadata();
        metadata.push({
            id: mediaItem.id,
            name: mediaItem.name,
            filename: mediaItem.filename,
            uploadedAt: mediaItem.uploadedAt,
            size: mediaItem.size,
            width: mediaItem.width,
            height: mediaItem.height
        });
        localStorage.setItem(METADATA_STORAGE_KEY, JSON.stringify(metadata));

        console.log(`[MediaService] Uploaded image: ${mediaItem.name}`);

        // Return display version with ObjectURLs
        return {
            ...mediaItem,
            thumbnailUrl: URL.createObjectURL(thumbnailBlob),
            displayUrl: URL.createObjectURL(displayBlob)
        };
    } catch (error) {
        console.error('[MediaService] Upload failed:', error);
        throw error;
    }
}

/**
 * Get metadata from localStorage
 */
function getMediaMetadata(): Array<Omit<MediaItem, 'thumbnailBlob' | 'displayBlob'>> {
    try {
        const json = localStorage.getItem(METADATA_STORAGE_KEY);
        if (!json) return [];
        return JSON.parse(json);
    } catch (error) {
        console.error('[MediaService] Failed to get metadata:', error);
        return [];
    }
}

/**
 * Get all media items
 */
export async function getMediaLibrary(): Promise<MediaItemDisplay[]> {
    try {
        const db = await getDB();
        const items: MediaItem[] = await new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        // Convert to display items with ObjectURLs
        return items.map(item => ({
            ...item,
            thumbnailUrl: URL.createObjectURL(item.thumbnailBlob),
            displayUrl: URL.createObjectURL(item.displayBlob)
        }));
    } catch (error) {
        console.error('[MediaService] Failed to get library:', error);
        return [];
    }
}

/**
 * Get single media item by ID
 */
export async function getMediaById(id: string): Promise<MediaItemDisplay | null> {
    try {
        const db = await getDB();
        const item: MediaItem | undefined = await new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        if (!item) return null;

        return {
            ...item,
            thumbnailUrl: URL.createObjectURL(item.thumbnailBlob),
            displayUrl: URL.createObjectURL(item.displayBlob)
        };
    } catch (error) {
        console.error('[MediaService] Failed to get media:', error);
        return null;
    }
}

/**
 * Update media name
 */
export async function updateMediaName(id: string, name: string): Promise<void> {
    try {
        const db = await getDB();

        // Get item from IndexedDB
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const getRequest = store.get(id);

        await new Promise<void>((resolve, reject) => {
            getRequest.onsuccess = () => {
                const item = getRequest.result;
                if (!item) {
                    reject(new Error('Media not found'));
                    return;
                }

                item.name = name;
                const putRequest = store.put(item);
                putRequest.onsuccess = () => resolve();
                putRequest.onerror = () => reject(putRequest.error);
            };
            getRequest.onerror = () => reject(getRequest.error);
        });

        // Update metadata
        const metadata = getMediaMetadata();
        const metaItem = metadata.find(m => m.id === id);
        if (metaItem) {
            metaItem.name = name;
            localStorage.setItem(METADATA_STORAGE_KEY, JSON.stringify(metadata));
        }

        console.log(`[MediaService] Updated media name: ${id}`);
    } catch (error) {
        console.error('[MediaService] Failed to update name:', error);
        throw error;
    }
}

/**
 * Delete media item
 */
export async function deleteMedia(id: string, clearSlots: (mediaId: string) => void): Promise<void> {
    try {
        const db = await getDB();

        // Delete from IndexedDB
        await new Promise<void>((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });

        // Update metadata
        const metadata = getMediaMetadata();
        const filtered = metadata.filter(m => m.id !== id);
        localStorage.setItem(METADATA_STORAGE_KEY, JSON.stringify(filtered));

        // Clear any slot assignments
        clearSlots(id);

        console.log(`[MediaService] Deleted media: ${id}`);
    } catch (error) {
        console.error('[MediaService] Failed to delete media:', error);
        throw error;
    }
}

/**
 * Clear all media (for admin reset)
 */
export async function clearAllMedia(): Promise<void> {
    try {
        const db = await getDB();

        await new Promise<void>((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });

        localStorage.removeItem(METADATA_STORAGE_KEY);
        console.log('[MediaService] Cleared all media');
    } catch (error) {
        console.error('[MediaService] Failed to clear media:', error);
        throw error;
    }
}
