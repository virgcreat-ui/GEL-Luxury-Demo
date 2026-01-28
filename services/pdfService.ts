/**
 * PDF Service
 * Generates printable QR code packs in A4 grid format
 */

import jsPDF from 'jspdf';

export interface QRItem {
    qrDataUrl: string; // Base64 QR code image
    label: string; // Room label to display below QR
}

const GRID_COLS = 3;
const GRID_ROWS = 4;
const ITEMS_PER_PAGE = GRID_COLS * GRID_ROWS; // 12

// Dimensions in mm (A4 = 210 × 297)
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 15;

const CELL_WIDTH = (PAGE_WIDTH - 2 * MARGIN) / GRID_COLS; // ~60mm
const CELL_HEIGHT = 65; // Fixed height for consistency

const QR_SIZE = 50; // 50mm × 50mm QR code

/**
 * Generate a printable PDF with QR codes in a grid layout
 * 
 * @param items - Array of QR items to include
 * @param hotelName - Hotel name for header
 * @returns PDF blob for download
 */
export function generateQRGridPDF(items: QRItem[], hotelName: string = 'Hotel QR Codes'): Blob {
    const doc = new jsPDF('p', 'mm', 'a4');

    if (items.length === 0) {
        throw new Error('No QR codes to generate');
    }

    items.forEach((item, index) => {
        // Add new page after first 12 items
        if (index > 0 && index % ITEMS_PER_PAGE === 0) {
            doc.addPage();
        }

        const pageNum = Math.floor(index / ITEMS_PER_PAGE) + 1;
        const pageIndex = index % ITEMS_PER_PAGE;
        const row = Math.floor(pageIndex / GRID_COLS);
        const col = pageIndex % GRID_COLS;

        // Calculate position
        const x = MARGIN + (col * CELL_WIDTH) + (CELL_WIDTH - QR_SIZE) / 2;
        const y = 25 + (row * CELL_HEIGHT);

        // Add header on first page only
        if (index < ITEMS_PER_PAGE && index === 0) {
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text(hotelName, PAGE_WIDTH / 2, 15, { align: 'center' });

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text('QR Access Codes', PAGE_WIDTH / 2, 20, { align: 'center' });
        }

        // Add QR code image
        try {
            doc.addImage(item.qrDataUrl, 'PNG', x, y, QR_SIZE, QR_SIZE);
        } catch (error) {
            console.error(`Failed to add QR at index ${index}:`, error);
            // Draw placeholder box
            doc.rect(x, y, QR_SIZE, QR_SIZE);
        }

        // Add label below QR
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        const labelY = y + QR_SIZE + 6;
        doc.text(item.label, x + QR_SIZE / 2, labelY, { align: 'center' });

        // Add page numbers at bottom (after all items on page)
        if ((index + 1) % ITEMS_PER_PAGE === 0 || index === items.length - 1) {
            const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.text(
                `Page ${pageNum} of ${totalPages}`,
                PAGE_WIDTH / 2,
                PAGE_HEIGHT - 10,
                { align: 'center' }
            );
        }
    });

    return doc.output('blob');
}

/**
 * Download a PDF blob with specified filename
 */
export function downloadPDF(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Generate filename for QR pack
 */
export function generateFilename(prefix: string = 'qr-pack'): string {
    const timestamp = new Date().toISOString().slice(0, 10);
    return `${prefix}-${timestamp}.pdf`;
}
