import React from 'react';
import { openTSHAppLink } from '../constants/links';

interface TSHAppLinkProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Reusable component for making "TSH app" text clickable
 * Opens App Store in new tab when clicked
 * Subtle styling: maintains text flow with light underline
 */
export function TSHAppLink({ children, className = '' }: TSHAppLinkProps) {
    return (
        <span
            onClick={(e) => {
                e.stopPropagation(); // Prevent parent handlers
                openTSHAppLink();
            }}
            className={`cursor-pointer underline decoration-1 underline-offset-2 opacity-90 hover:opacity-100 transition-opacity ${className}`}
            role="button"
            tabIndex={0}
            on KeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openTSHAppLink();
                }
            }}
        >
            {children}
        </span>
    );
}
