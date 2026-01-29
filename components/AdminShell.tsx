
import React, { useState } from 'react';
import { resetConfig } from '../services/configService';
import HubContentEditor from './HubContentEditor';
import AdminConciergeFlows from "./AdminConciergeFlows";
import AdminImages from "./AdminImages";
import MediaLibrary from './MediaLibrary';
import RoomOverridesManager from './RoomOverridesManager';
import QRCodeGenerator from './QRCodeGenerator';
import AdminExportImport from './AdminExportImport';

// Admin Tabs
type AdminTab = 'concierge' | 'concierge-flows' | 'visuals' | 'rooms' | 'qr' | 'photos' | 'export';

export default function AdminShell() {
    const [activeTab, setActiveTab] = useState<AdminTab>('concierge');
    const [isResetting, setIsResetting] = useState(false);

    const handleReset = async () => {
        if (window.confirm('Reset all content to defaults? This cannot be undone.')) {
            setIsResetting(true);
            await resetConfig();
            window.location.reload();
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
            {/* Top Bar */}
            <div className="bg-white border-b border-neutral-200 px-6 lg:px-8 py-5 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-black rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">E</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight leading-tight">Admin — LGE Experience Layer</h1>
                        <p className="text-xs text-neutral-500 font-medium">Content Management System</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleReset}
                        disabled={isResetting}
                        className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        {isResetting ? 'Resetting...' : 'Reset Defaults'}
                    </button>
                    <a href="/" className="px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-neutral-800 transition-all shadow-sm">
                        Open App ↗
                    </a>
                </div>
            </div>

            {/* Main Layout */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                    {/* Sidebar Nav */}
                    <div className="lg:col-span-3 space-y-4">
                        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-2 lg:sticky lg:top-24">
                            {[
                                { id: 'concierge', label: 'Concierge Content' },
                                { id: 'concierge-flows', label: 'Concierge Flows' },
                                { id: 'visuals', label: 'Visuals & Branding' },
                                { id: 'photos', label: 'Media Library' },
                                { id: 'rooms', label: 'Room Overrides' },
                                { id: 'qr', label: 'QR Generators' },
                                { id: 'export', label: 'Export / Import' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as AdminTab)}
                                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-all mb-1 ${activeTab === tab.id
                                        ? 'bg-black text-white shadow-md'
                                        : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="hidden lg:block bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <h4 className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-2">Support</h4>
                            <p className="text-xs text-blue-700 leading-relaxed">
                                Need help? Check documentation in /docs folder.
                            </p>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-9">
                        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 min-h-[600px]">
                            {activeTab === 'concierge' && <HubContentEditor />}
                            {activeTab === 'concierge-flows' && <AdminConciergeFlows />}
                            {activeTab === 'visuals' && <AdminImages />}
                            {activeTab === 'photos' && <MediaLibrary />}
                            {activeTab === 'rooms' && <RoomOverridesManager />}
                            {activeTab === 'qr' && <QRCodeGenerator />}
                            {activeTab === 'export' && <AdminExportImport />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
