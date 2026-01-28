/**
 * TSH App Links - Centralized Constants
 * Single source of truth for all TSH app external links
 */

export const TSH_APP_URL =
    "https://apps.apple.com/fr/app/the-social-hub/id1669765182?l=en-GB";

/**
 * Opens the TSH app in the App Store in a new tab
 * Use this for all "TSH app" link behaviors
 */
export function openTSHAppLink() {
    window.open(TSH_APP_URL, "_blank", "noopener,noreferrer");
}
