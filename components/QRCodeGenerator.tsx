import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { getGlobalSettings } from '../services/contextService';
import { generateQRGridPDF, downloadPDF, generateFilename, QRItem } from '../services/pdfService';

type QRMode = 'single' | 'range' | 'csv';
type SingleQRType = 'hotel' | 'floor' | 'room';

export default function QRCodeGenerator() {
    const [mode, setMode] = useState<QRMode>('single');

    // Single QR state
    const [qrType, setQRType] = useState<SingleQRType>('hotel');
    const [hotelId, setHotelId] = useState('');
    const [floor, setFloor] = useState('');
    const [room, setRoom] = useState('');
    const [qrDataUrl, setQrDataUrl] = useState('');
    const [payload, setPayload] = useState('');

    // Bulk Range state
    const [rangeFloor, setRangeFloor] = useState('');
    const [rangePrefix, setRangePrefix] = useState('');
    const [rangeStart, setRangeStart] = useState('101');
    const [rangeEnd, setRangeEnd] = useState('110');
    const [labelFormat, setLabelFormat] = useState<'room' | 'plain' | 'suite'>('room');
    const [isGenerating, setIsGenerating] = useState(false);

    // CSV state
    const [csvData, setCsvData] = useState<any[]>([]);
    const [csvError, setCsvError] = useState('');

    useEffect(() => {
        const settings = getGlobalSettings();
        setHotelId(settings.hotelId);
    }, []);

    useEffect(() => {
        if (mode === 'single') {
            generateSingleQR();
        }
    }, [mode, qrType, hotelId, floor, room]);

    const generateSingleQR = async () => {
        if (!hotelId.trim()) {
            setQrDataUrl('');
            setPayload('');
            return;
        }

        const data: any = { hotelId: hotelId.trim() };

        if (qrType === 'floor' || qrType === 'room') {
            const floorNum = parseInt(floor);
            if (!isNaN(floorNum)) {
                data.floor = floorNum;
            } else {
                setQrDataUrl('');
                setPayload('');
                return;
            }
        }

        if (qrType === 'room') {
            if (room.trim()) {
                data.room = room.trim();
            } else {
                setQrDataUrl('');
                setPayload('');
                return;
            }
        }

        const jsonPayload = JSON.stringify(data);
        setPayload(jsonPayload);

        const encoded = btoa(jsonPayload);
        const qrData = `${window.location.origin}?qr=${encoded}`;

        try {
            const dataUrl = await QRCode.toDataURL(qrData, {
                width: 300,
                margin: 2,
                color: { dark: '#000000', light: '#FFFFFF' }
            });
            setQrDataUrl(dataUrl);
        } catch (error) {
            console.error('[QRGenerator] Failed to generate QR:', error);
            setQrDataUrl('');
        }
    };

    const generateRoomLabel = (roomNum: string, format: 'room' | 'plain' | 'suite'): string => {
        if (format === 'plain') return roomNum;
        if (format === 'suite') return `Suite ${roomNum}`;
        return `Room ${roomNum}`;
    };

    const handleGenerateBulkRange = async () => {
        setIsGenerating(true);
        try {
            const start = parseInt(rangeStart);
            const end = parseInt(rangeEnd);

            if (isNaN(start) || isNaN(end) || start > end) {
                alert('Invalid room range');
                return;
            }

            const qrItems: QRItem[] = [];
            const floorNum = rangeFloor ? parseInt(rangeFloor) : undefined;

            for (let i = start; i <= end; i++) {
                const roomNum = rangePrefix + i;
                const data: any = { hotelId };
                if (floorNum !== undefined) data.floor = floorNum;
                data.room = roomNum;

                const jsonPayload = JSON.stringify(data);
                const encoded = btoa(jsonPayload);
                const qrData = `${window.location.origin}?qr=${encoded}`;

                const dataUrl = await QRCode.toDataURL(qrData, {
                    width: 200,
                    margin: 1,
                    color: { dark: '#000000', light: '#FFFFFF' }
                });

                qrItems.push({
                    qrDataUrl: dataUrl,
                    label: generateRoomLabel(roomNum, labelFormat)
                });
            }

            const pdf = generateQRGridPDF(qrItems, hotelId);
            downloadPDF(pdf, generateFilename(`qr-pack-${rangePrefix}${start}-${end}`));
        } catch (error) {
            console.error('[QRGenerator] Bulk generation failed:', error);
            alert('Failed to generate PDF');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const content = event.target?.result as string;
                const parsed = parseCSV(content);
                setCsvData(parsed);
                setCsvError('');
            } catch (error) {
                setCsvError('Failed to parse CSV');
                setCsvData([]);
            }
        };
        reader.readAsText(file);
    };

    const parseCSV = (content: string): any[] => {
        const lines = content.split('\n').filter(l => l.trim());
        if (lines.length < 2) throw new Error('CSV must have header + data');

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const data: any[] = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const row: any = {};
            headers.forEach((h, idx) => {
                row[h] = values[idx];
            });

            if (!row.room) {
                console.warn(`Row ${i}: Missing room, skipping`);
                continue;
            }

            data.push({
                room: row.room,
                floor: row.floor ? parseInt(row.floor) : undefined,
                label: row.label || `Room ${row.room}`
            });
        }

        return data;
    };

    const handleGenerateBulkCSV = async () => {
        setIsGenerating(true);
        try {
            const qrItems: QRItem[] = [];

            for (const row of csvData) {
                const data: any = { hotelId };
                if (row.floor !== undefined) data.floor = row.floor;
                data.room = row.room;

                const jsonPayload = JSON.stringify(data);
                const encoded = btoa(jsonPayload);
                const qrData = `${window.location.origin}?qr=${encoded}`;

                const dataUrl = await QRCode.toDataURL(qrData, {
                    width: 200,
                    margin: 1,
                    color: { dark: '#000000', light: '#FFFFFF' }
                });

                qrItems.push({
                    qrDataUrl: dataUrl,
                    label: row.label
                });
            }

            const pdf = generateQRGridPDF(qrItems, hotelId);
            downloadPDF(pdf, generateFilename(`qr-pack-csv`));
        } catch (error) {
            console.error('[QRGenerator] CSV bulk generation failed:', error);
            alert('Failed to generate PDF');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownloadPNG = () => {
        if (!qrDataUrl) return;
        const link = document.createElement('a');
        link.href = qrDataUrl;
        link.download = `lge-qr-${qrType}-${hotelId.replace(/[^a-z0-9]/gi, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCopyURL = () => {
        const encoded = btoa(payload);
        const url = `${window.location.origin}?qr=${encoded}`;
        navigator.clipboard.writeText(url);
        alert('URL copied to clipboard!');
    };

    const roomCount = mode === 'range' ? Math.max(0, parseInt(rangeEnd) - parseInt(rangeStart) + 1) : csvData.length;

    return (
        <div className="space-y-6">
            {/* Mode Selector */}
            <div className="bg-white rounded-2xl border-2 border-neutral-200 p-6">
                <h3 className="text-xl font-bold text-black mb-4" style={{ fontFamily: '"Rubik", sans-serif' }}>
                    QR Code Generator
                </h3>
                <div className="flex gap-3 mb-6">
                    {([
                        { id: 'single', label: 'Single QR' },
                        { id: 'range', label: 'Bulk Range' },
                        { id: 'csv', label: 'Bulk CSV' }
                    ] as const).map(({ id, label }) => (
                        <button
                            key={id}
                            onClick={() => setMode(id)}
                            className={`flex-1 px-4 py-3 rounded-lg border-2 font-bold text-sm uppercase tracking-wider transition-all ${mode === id
                                ? 'border-black bg-black text-white'
                                : 'border-neutral-200 bg-white text-neutral-600 hover:border-black'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Single QR Mode */}
                {mode === 'single' && (
                    <div className="space-y-4">
                        <div className="mb-4">
                            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">QR Type</label>
                            <div className="flex gap-3">
                                {(['hotel', 'floor', 'room'] as SingleQRType[]).map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setQRType(type)}
                                        className={`flex-1 px-4 py-2 rounded-lg border-2 font-bold text-xs uppercase tracking-wider transition-all ${qrType === type
                                            ? 'border-black bg-black text-white'
                                            : 'border-neutral-200 bg-white text-neutral-600 hover:border-black'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <input
                            type="text"
                            value={hotelId}
                            onChange={(e) => setHotelId(e.target.value)}
                            placeholder="Hotel ID"
                            className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 font-medium text-sm hover:border-black transition-colors"
                        />

                        {(qrType === 'floor' || qrType === 'room') && (
                            <input
                                type="number"
                                value={floor}
                                onChange={(e) => setFloor(e.target.value)}
                                placeholder="Floor #"
                                className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 font-medium text-sm hover:border-black transition-colors"
                            />
                        )}

                        {qrType === 'room' && (
                            <input
                                type="text"
                                value={room}
                                onChange={(e) => setRoom(e.target.value)}
                                placeholder="Room #"
                                className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 font-medium text-sm hover:border-black transition-colors"
                            />
                        )}
                    </div>
                )}

                {/* Bulk Range Mode */}
                {mode === 'range' && (
                    <div className="space-y-4">
                        <p className="text-sm text-neutral-600 mb-4">
                            Generate QR codes for a sequential range of rooms
                        </p>

                        <input
                            type="text"
                            value={hotelId}
                            onChange={(e) => setHotelId(e.target.value)}
                            placeholder="Hotel ID"
                            className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 font-medium text-sm hover:border-black transition-colors"
                        />

                        <input
                            type="number"
                            value={rangeFloor}
                            onChange={(e) => setRangeFloor(e.target.value)}
                            placeholder="Floor # (optional)"
                            className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 font-medium text-sm hover:border-black transition-colors"
                        />

                        <input
                            type="text"
                            value={rangePrefix}
                            onChange={(e) => setRangePrefix(e.target.value)}
                            placeholder="Prefix (optional, e.g., A, B)"
                            className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 font-medium text-sm hover:border-black transition-colors"
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Start Room #</label>
                                <input
                                    type="number"
                                    value={rangeStart}
                                    onChange={(e) => setRangeStart(e.target.value)}
                                    placeholder="101"
                                    className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 font-medium text-sm hover:border-black transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">End Room #</label>
                                <input
                                    type="number"
                                    value={rangeEnd}
                                    onChange={(e) => setRangeEnd(e.target.value)}
                                    placeholder="110"
                                    className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 font-medium text-sm hover:border-black transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Label Format</label>
                            <select
                                value={labelFormat}
                                onChange={(e) => setLabelFormat(e.target.value as any)}
                                className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 font-medium text-sm hover:border-black transition-colors"
                            >
                                <option value="room">Room {rangePrefix}101</option>
                                <option value="plain">{rangePrefix}101</option>
                                <option value="suite">Suite {rangePrefix}101</option>
                            </select>
                        </div>

                        <button
                            onClick={handleGenerateBulkRange}
                            disabled={isGenerating || !hotelId}
                            className="w-full px-6 py-4 rounded-lg bg-black text-white font-bold text-sm uppercase tracking-wider hover:bg-neutral-800 active:scale-95 transition-all disabled:bg-neutral-300 disabled:cursor-not-allowed"
                        >
                            {isGenerating ? 'Generating...' : `Generate PDF (${roomCount} QRs)`}
                        </button>
                    </div>
                )}

                {/* CSV Upload Mode */}
                {mode === 'csv' && (
                    <div className="space-y-4">
                        <p className="text-sm text-neutral-600 mb-4">
                            Upload a CSV file with columns: <code className="bg-neutral-100 px-2 py-1 rounded">room,floor,label</code>
                        </p>

                        <div>
                            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Upload CSV</label>
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleCSVUpload}
                                className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 font-medium text-sm hover:border-black transition-colors"
                            />
                        </div>

                        {csvError && (
                            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg text-sm text-red-700">
                                {csvError}
                            </div>
                        )}

                        {csvData.length > 0 && (
                            <>
                                <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                                    <div className="text-sm font-bold text-blue-900 mb-2">
                                        Preview: {csvData.length} rooms loaded
                                    </div>
                                    <div className="max-h-40 overflow-auto">
                                        <table className="w-full text-xs">
                                            <thead>
                                                <tr className="text-left">
                                                    <th className="p-1">Room</th>
                                                    <th className="p-1">Floor</th>
                                                    <th className="p-1">Label</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {csvData.slice(0, 10).map((row, idx) => (
                                                    <tr key={idx} className="border-t border-blue-200">
                                                        <td className="p-1">{row.room}</td>
                                                        <td className="p-1">{row.floor || '-'}</td>
                                                        <td className="p-1">{row.label}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {csvData.length > 10 && (
                                            <div className="text-xs text-blue-600 mt-2">+ {csvData.length - 10} more rows</div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={handleGenerateBulkCSV}
                                    disabled={isGenerating}
                                    className="w-full px-6 py-4 rounded-lg bg-black text-white font-bold text-sm uppercase tracking-wider hover:bg-neutral-800 active:scale-95 transition-all disabled:bg-neutral-300 disabled:cursor-not-allowed"
                                >
                                    {isGenerating ? 'Generating...' : `Generate PDF (${csvData.length} QRs)`}
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Single QR Preview */}
            {mode === 'single' && qrDataUrl && (
                <div className="bg-white rounded-2xl border-2 border-neutral-200 p-6">
                    <h3 className="text-lg font-bold text-black mb-4" style={{ fontFamily: '"Rubik", sans-serif' }}>
                        QR Code Preview
                    </h3>
                    <div className="flex gap-6">
                        <div className="shrink-0">
                            <div className="p-4 bg-white border-2 border-neutral-200 rounded-xl">
                                <img src={qrDataUrl} alt="QR Code" className="w-64 h-64" />
                            </div>
                        </div>
                        <div className="flex-1 space-y-4">
                            <div>
                                <div className="text-xs font-bold uppercase text-neutral-500 mb-2">Payload</div>
                                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 font-mono text-xs break-all">
                                    {payload}
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleDownloadPNG}
                                    className="flex-1 px-6 py-3 rounded-lg bg-black text-white font-bold text-sm uppercase tracking-wider hover:bg-neutral-800 active:scale-95 transition-all"
                                >
                                    Download PNG
                                </button>
                                <button
                                    onClick={handleCopyURL}
                                    className="flex-1 px-6 py-3 rounded-lg bg-neutral-100 text-black font-bold text-sm uppercase tracking-wider hover:bg-neutral-200 active:scale-95 transition-all"
                                >
                                    Copy URL
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
