import React from 'react';
import { LGEAppLink } from '../components/LGEAppLink';

/**
 * Utility to convert text containing "LGE app" into clickable links
 * Handles various cases: "LGE app", "LGE App", "app LGE", etc.
 * 
 * Usage:
 * renderTextWithLGEAppLink("Reserve via the LGE app")
 * Returns: React element with "LGE app" as clickable link
 */
export function renderTextWithLGEAppLink(text: string): React.ReactNode {
    // Match "LGE app" or "LGE App" or "app LGE" (case-insensitive in the middle)
    const regex = /(\bLGE\s+[Aa]pp\b|\b[Aa]pp\s+LGE\b)/g;

    const parts = text.split(regex);

    // If no matches, return plain text
    if (parts.length === 1) {
        return text;
    }

    // Build React nodes with clickable links
    return (
        <>
            {parts.map((part, index) => {
                // Check if this part matches the LGE app pattern
                if (part && regex.test(part)) {
                    // Reset regex lastIndex for next test
                    regex.lastIndex = 0;
                    return <LGEAppLink key={index}>{part}</LGEAppLink>;
                }
                return <React.Fragment key={index}>{part}</React.Fragment>;
            })}
        </>
    );
}
