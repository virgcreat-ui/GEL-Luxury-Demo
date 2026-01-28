import React from 'react';
import { ContentSection } from '../services/contentService';

interface Props {
    onSelect: (section: ContentSection) => void;
}

export default function SectionSelector({ onSelect }: Props) {
    const sections: Array<{
        id: ContentSection;
        title: string;
        icon: string;
        description: string;
    }> = [
            {
                id: 'hub',
                title: 'Hub content',
                icon: '',
                description: 'Social spaces, breakfast, facilities'
            },
            {
                id: 'room',
                title: 'Room content',
                icon: '',
                description: 'Cleaning, amenities, WiFi, rules'
            },
            {
                id: 'events',
                title: 'Events content',
                icon: '',
                description: 'Event intros, empty states, CTAs'
            },
            {
                id: 'area',
                title: 'Around the area',
                icon: '',
                description: 'Restaurants, transport, local tips'
            },
            {
                id: 'concierge',
                title: 'Concierge scripts',
                icon: '',
                description: 'Welcome messages, transitions'
            }
        ];

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-2xl border-2 border-neutral-200 p-6">
                <h2 className="text-2xl font-bold text-black mb-2" style={{ fontFamily: '"Rubik", sans-serif' }}>
                    Content Management
                </h2>
                <p className="text-sm text-neutral-600 mb-6">
                    Customize all guest-facing content across sections and languages.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sections.map(section => (
                    <button
                        key={section.id}
                        onClick={() => onSelect(section.id)}
                        className="bg-white rounded-2xl border-2 border-neutral-200 p-6 text-left hover:border-black transition-all active:scale-[0.98] group"
                    >
                        {!!section.icon && <div className="text-4xl mb-3">{section.icon}</div>}
                        <h3 className="text-lg font-bold text-black mb-1 group-hover:underline">
                            {section.title}
                        </h3>
                        <p className="text-sm text-neutral-600">
                            {section.description}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
}
