import React from 'react';
import { TSHAppLink } from '../components/TSHAppLink';

/**
 * Utility to convert text containing "TSH app" into clickable links
 * Handles various cases: "TSH app", "TSH App", "app TSH", etc.
 * 
 * Usage:
 * renderTextWithTSHAppLink("Reserve via the TSH app")
 * Returns: React element with "TSH app" as clickable link
 */
export function renderTextWithTSHAppLink(text: string): React.ReactNode {
    // Match "TSH app" or "TSH App" or "app TSH" (case-insensitive in the middle)
    const regex = /(\bTSH\s+[Aa]pp\b|\b[Aa]pp\s+TSH\b)/g;

    const parts = text.split(regex);

    // If no matches, return plain text
    if (parts.length === 1) {
        return text;
    }

    // Build React nodes with clickable links
    return (
        <>
            {parts.map((part, index) => {
                // Check if this part matches the TSH app pattern
                if (part && regex.test(part)) {
                    // Reset regex lastIndex for next test
                    regex.lastIndex = 0;
                    return <TSHAppLink key={index}>{part}</TSHAppLink>;
                }
                return <React.Fragment key={index}>{part}</React.Fragment>;
            })}
        </>
    );
}
