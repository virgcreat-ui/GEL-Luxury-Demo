import React from 'react';
import { openLGEAppLink } from '../constants/links';

interface LGEAppLinkProps {
    children: React.ReactNode;
    className?: string;
    key?: any;
}

/**
 * Reusable component for making "LGE app" text clickable
 * Opens App Store in new tab when clicked
 * Subtle styling: maintains text flow with light underline
 */
export function LGEAppLink({ children, className = '' }: LGEAppLinkProps) {
    return (
        <span
            onClick={(e) => {
                e.stopPropagation(); // Prevent parent handlers
                openLGEAppLink();
            }}
            className={`cursor-pointer underline decoration-1 underline-offset-2 opacity-90 hover:opacity-100 transition-opacity ${className}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLGEAppLink();
                }
            }}
        >
            {children}
        </span>
    );
}
