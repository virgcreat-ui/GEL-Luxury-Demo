/**
 * LGE App Links - Centralized Constants
 * Single source of truth for all LGE app external links
 */

export const LGE_APP_URL =
    "https://apps.apple.com/fr/app/the-social-hub/id1669765182?l=en-GB";

/**
 * Opens the LGE app in the App Store in a new tab
 * Use this for all "LGE app" link behaviors
 */
export function openLGEAppLink() {
    window.open(LGE_APP_URL, "_blank", "noopener,noreferrer");
}
