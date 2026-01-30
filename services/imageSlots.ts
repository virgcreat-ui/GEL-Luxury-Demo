/**
 * Image Slots Definition
 * Defines all image slots used across the guest UI
 * Each slot can be assigned a custom image via admin panel
 */

export enum ImageSlot {
    // Home/Welcome Screen
    HOME_HERO = 'home.hero',
    HOME_CARD_HUB = 'home.card.hub',
    HOME_CARD_ROOM = 'home.card.room',
    HOME_CARD_EVENTS = 'home.card.events',
    HOME_CARD_AREA = 'home.card.area',

    // Hub Section
    HUB_HERO = 'hub.hero',
    HUB_CARD_FACILITIES = 'hub.card.facilities',
    HUB_CARD_FOOD = 'hub.card.food',
    HUB_CARD_BREAKFAST = 'hub.card.breakfast',
    HUB_CARD_RESTAURANT = 'hub.card.restaurantBar',

    // Room Section
    ROOM_HERO = 'room.hero',
    ROOM_CARD_WIFI = 'room.card.wifi',
    ROOM_CARD_CLEANING = 'room.card.cleaning',
    ROOM_CARD_AMENITIES = 'room.card.amenities',
    ROOM_CARD_AC = 'room.card.ac',

    // Events Section
    EVENTS_HERO = 'events.hero',
    EVENTS_DEFAULT = 'events.event.default',

    // Area/Neighborhood Section
    AREA_HERO = 'area.hero',
    AREA_CARD_METRO = 'area.card.metro',
    AREA_CARD_GROCERY = 'area.card.grocery',
    AREA_CARD_PARTNERS = 'area.card.partners',
    AREA_CARD_BIKES = 'area.card.bikes',

    // Concierge
    CONCIERGE_BG = 'concierge.background'
}

/**
 * Default images for each slot
 * Using /assets/images/ for all luxury hotel images
 */
export const DEFAULT_IMAGES: Record<ImageSlot, string> = {
    // Home/Welcome - using dedicated luxury images
    [ImageSlot.HOME_HERO]: '/assets/images/home_hero_paris.png',
    [ImageSlot.HOME_CARD_HUB]: '/assets/images/lobby.png',
    [ImageSlot.HOME_CARD_ROOM]: '/assets/images/guest_room.png',
    [ImageSlot.HOME_CARD_EVENTS]: '/assets/images/terrace.png',
    [ImageSlot.HOME_CARD_AREA]: '/assets/images/local.png',

    // Hub
    [ImageSlot.HUB_HERO]: '/assets/images/lobby.png',
    [ImageSlot.HUB_CARD_FACILITIES]: '/assets/images/gym.png',
    [ImageSlot.HUB_CARD_FOOD]: '/assets/images/breakfast.png',
    [ImageSlot.HUB_CARD_BREAKFAST]: '/assets/images/breakfast.png',
    [ImageSlot.HUB_CARD_RESTAURANT]: '/assets/images/dining.png',

    // Room - using dedicated room images
    [ImageSlot.ROOM_HERO]: '/assets/images/guest_room.png',
    [ImageSlot.ROOM_CARD_WIFI]: '/assets/images/room_wifi.png',
    [ImageSlot.ROOM_CARD_CLEANING]: '/assets/images/room_housekeeping.png',
    [ImageSlot.ROOM_CARD_AMENITIES]: '/assets/images/room_amenities.png',
    [ImageSlot.ROOM_CARD_AC]: '/assets/images/guest_room_2.png',

    // Events
    [ImageSlot.EVENTS_HERO]: '/assets/images/terrace.png',
    [ImageSlot.EVENTS_DEFAULT]: '/assets/images/terrace.png',

    // Area - using dedicated area images
    [ImageSlot.AREA_HERO]: '/assets/images/local.png',
    [ImageSlot.AREA_CARD_METRO]: '/assets/images/area_metro.png',
    [ImageSlot.AREA_CARD_GROCERY]: '/assets/images/area_grocery.png',
    [ImageSlot.AREA_CARD_PARTNERS]: '/assets/images/dining.png',
    [ImageSlot.AREA_CARD_BIKES]: '/assets/images/area_bikes.png',

    // Concierge
    [ImageSlot.CONCIERGE_BG]: '/assets/images/lobby.png'
};

/**
 * Human-readable labels for admin UI
 */
export const SLOT_LABELS: Record<ImageSlot, string> = {
    // Home
    [ImageSlot.HOME_HERO]: 'Home - Hero Image',
    [ImageSlot.HOME_CARD_HUB]: 'Home - Hub Card',
    [ImageSlot.HOME_CARD_ROOM]: 'Home - Room Card',
    [ImageSlot.HOME_CARD_EVENTS]: 'Home - Events Card',
    [ImageSlot.HOME_CARD_AREA]: 'Home - Area Card',

    // Hub
    [ImageSlot.HUB_HERO]: 'Hub - Hero Image',
    [ImageSlot.HUB_CARD_FACILITIES]: 'Hub - Facilities Card',
    [ImageSlot.HUB_CARD_FOOD]: 'Hub - Food Card',
    [ImageSlot.HUB_CARD_BREAKFAST]: 'Hub - Breakfast Card',
    [ImageSlot.HUB_CARD_RESTAURANT]: 'Hub - Restaurant Card',

    // Room
    [ImageSlot.ROOM_HERO]: 'Room - Hero Image',
    [ImageSlot.ROOM_CARD_WIFI]: 'Room - WiFi Card',
    [ImageSlot.ROOM_CARD_CLEANING]: 'Room - Cleaning Card',
    [ImageSlot.ROOM_CARD_AMENITIES]: 'Room - Amenities Card',
    [ImageSlot.ROOM_CARD_AC]: 'Room - AC Card',

    // Events
    [ImageSlot.EVENTS_HERO]: 'Events - Hero Image',
    [ImageSlot.EVENTS_DEFAULT]: 'Events - Default Thumbnail',

    // Area
    [ImageSlot.AREA_HERO]: 'Area - Hero Image',
    [ImageSlot.AREA_CARD_METRO]: 'Area - Metro Card',
    [ImageSlot.AREA_CARD_GROCERY]: 'Area - Grocery Card',
    [ImageSlot.AREA_CARD_PARTNERS]: 'Area - Dining Partners Card',
    [ImageSlot.AREA_CARD_BIKES]: 'Area - Bikes Card',

    // Concierge
    [ImageSlot.CONCIERGE_BG]: 'Concierge - Background'
};

/**
 * Grouped slots for admin UI organization
 */
export const SLOT_GROUPS = {
    home: [
        ImageSlot.HOME_HERO,
        ImageSlot.HOME_CARD_HUB,
        ImageSlot.HOME_CARD_ROOM,
        ImageSlot.HOME_CARD_EVENTS,
        ImageSlot.HOME_CARD_AREA
    ],
    hub: [
        ImageSlot.HUB_HERO,
        ImageSlot.HUB_CARD_FACILITIES,
        ImageSlot.HUB_CARD_FOOD,
        ImageSlot.HUB_CARD_BREAKFAST,
        ImageSlot.HUB_CARD_RESTAURANT
    ],
    room: [
        ImageSlot.ROOM_HERO,
        ImageSlot.ROOM_CARD_WIFI,
        ImageSlot.ROOM_CARD_CLEANING,
        ImageSlot.ROOM_CARD_AMENITIES,
        ImageSlot.ROOM_CARD_AC
    ],
    events: [
        ImageSlot.EVENTS_HERO,
        ImageSlot.EVENTS_DEFAULT
    ],
    area: [
        ImageSlot.AREA_HERO,
        ImageSlot.AREA_CARD_METRO,
        ImageSlot.AREA_CARD_GROCERY,
        ImageSlot.AREA_CARD_PARTNERS,
        ImageSlot.AREA_CARD_BIKES
    ],
    concierge: [
        ImageSlot.CONCIERGE_BG
    ]
};

/* ===========================================================
   SLOT ASSIGNMENT STORAGE
   ===========================================================*/

const SLOTS_STORAGE_KEY = 'lge_image_slots_v1';

export interface SlotAssignment {
    slotId: ImageSlot;
    mediaId: string;
}

/**
 * Assign an image to a slot
 */
export function assignImageToSlot(slotId: ImageSlot, mediaId: string): void {
    try {
        const assignments = getAllAssignments();
        const existing = assignments.findIndex(a => a.slotId === slotId);

        if (existing >= 0) {
            assignments[existing].mediaId = mediaId;
        } else {
            assignments.push({ slotId, mediaId });
        }

        localStorage.setItem(SLOTS_STORAGE_KEY, JSON.stringify(assignments));
        console.log(`[ImageSlots] Assigned ${mediaId} to ${slotId}`);
    } catch (error) {
        console.error('[ImageSlots] Error assigning image:', error);
        throw error;
    }
}

/**
 * Clear slot override (revert to default)
 */
export function clearSlotOverride(slotId: ImageSlot): void {
    try {
        const assignments = getAllAssignments();
        const filtered = assignments.filter(a => a.slotId !== slotId);
        localStorage.setItem(SLOTS_STORAGE_KEY, JSON.stringify(filtered));
        console.log(`[ImageSlots] Cleared override for ${slotId}`);
    } catch (error) {
        console.error('[ImageSlots] Error clearing slot:', error);
        throw error;
    }
}

/**
 * Get assigned media ID for a slot
 */
export function getSlotAssignment(slotId: ImageSlot): string | null {
    try {
        const assignments = getAllAssignments();
        const assignment = assignments.find(a => a.slotId === slotId);
        return assignment?.mediaId || null;
    } catch (error) {
        console.error('[ImageSlots] Error getting assignment:', error);
        return null;
    }
}

/**
 * Get all slot assignments
 */
export function getAllAssignments(): SlotAssignment[] {
    try {
        const json = localStorage.getItem(SLOTS_STORAGE_KEY);
        if (!json) return [];
        return JSON.parse(json) as SlotAssignment[];
    } catch (error) {
        console.error('[ImageSlots] Error getting all assignments:', error);
        return [];
    }
}

/**
 * Reset all slot assignments
 */
export function resetAllSlots(): void {
    try {
        localStorage.removeItem(SLOTS_STORAGE_KEY);
        console.log('[ImageSlots] Reset all slot assignments');
    } catch (error) {
        console.error('[ImageSlots] Error resetting slots:', error);
        throw error;
    }
}
