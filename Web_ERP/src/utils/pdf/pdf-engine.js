import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { registerPDFFonts } from './pdf-fonts.js';
import { escapeHTML } from '../formatters.js';

/**
 * Universal PDF Generator powered by jsPDF & jspdf-autotable
 */
export async function generateAutoTablePDF({
    settings = {},
    options = {},
    columns = [],
    data = [],
    summaryBoxes = [],
    showSignatures = true,
    filename = 'Report.pdf'
}) {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    await registerPDFFonts(doc);

    const title = options.title || 'CUSTOMER REPORT';
    const subtitle = options.subtitle || '';
    
    const shopName = settings.shopName || "M/S. MAA-MOTOR'S";
    const shopOwner = settings.shopOwner || "Mohammed Amran";
    const shopAddress = settings.shopAddress || "Shop No. 22, Rahman Tower, 1st Rail Gate, Muradpur, Hathazari Road";
    const shopPhone = settings.shopPhone || "01819-397669, 01815-707934";

    // Load shop logo if available
    let logoDataUrl = null;
    if (settings.shopLogo) {
        try {
            logoDataUrl = await loadImageAsDataUrl(settings.shopLogo);
        } catch (e) {
            console.warn('Could not load logo image for PDF:', e);
        }
    }

    // Function to draw header banner on Page 1
    function drawPage1Header() {
        // Blue Header Banner
        doc.setFillColor(2, 132, 199); // Sky-600 #0284c7
        doc.roundedRect(14, 10, 182, 32, 3, 3, 'F');

        // Logo
        if (logoDataUrl) {
            try {
                doc.addImage(logoDataUrl, 'PNG', 18, 14, 24, 24);
            } catch {
                // Fallback circle if image fails
                doc.setFillColor(255, 255, 255);
                doc.circle(30, 26, 12, 'F');
            }
        } else {
            doc.setFillColor(255, 255, 255);
            doc.circle(30, 26, 12, 'F');
        }

        // Shop Title & Info (White Text)
        doc.setTextColor(255, 255, 255);
        
        doc.setFont('Inter', 'normal');
        doc.setFontSize(14);
        doc.text(shopName.toUpperCase(), 46, 18);

        doc.setFontSize(8);
        doc.text(`Proprietor: ${shopOwner}`, 46, 23);

        doc.setFont('Kalpurush', 'normal');
        doc.setFontSize(8);
        doc.text(shopAddress, 46, 28);

        doc.setFont('Inter', 'normal');
        doc.setFontSize(8);
        doc.text(`Mobile: ${shopPhone}`, 46, 33);

        // Title Badge Right Side
        doc.setFont('Inter', 'normal');
        doc.setFontSize(11);
        doc.text(title.toUpperCase(), 188, 22, { align: 'right' });

        if (subtitle) {
            doc.setFont('Kalpurush', 'normal');
            doc.setFontSize(8);
            doc.text(subtitle, 188, 28, { align: 'right' });
        }
    }

    // Draw Page 1 Header
    drawPage1Header();

    // Prepare AutoTable options
    const tableColumns = columns.map(c => ({
        header: c.header,
        dataKey: c.dataKey
    }));

    const columnStyles = {};
    columns.forEach((c, idx) => {
        columnStyles[idx] = {
            halign: c.align || 'left',
            cellWidth: c.width || 'auto'
        };
    });

    autoTable(doc, {
        columns: tableColumns,
        body: data,
        startY: 46,
        margin: { top: 22, bottom: 22, left: 14, right: 14 },
        styles: {
            font: 'Kalpurush',
            fontSize: 8.5,
            cellPadding: 2.5,
            overflow: 'linebreak',
            textColor: [15, 23, 42],
            valign: 'middle'
        },
        headStyles: {
            fillColor: [241, 245, 249],
            textColor: [30, 41, 59],
            fontStyle: 'bold',
            font: 'Kalpurush',
            fontSize: 8.5,
            lineColor: [203, 213, 225],
            lineWidth: 0.3
        },
        bodyStyles: {
            lineColor: [226, 232, 240],
            lineWidth: 0.2
        },
        alternateRowStyles: {
            fillColor: [248, 250, 252]
        },
        columnStyles: columnStyles,
        didDrawPage: (data) => {
            // Draw Repeat Header on Pages 2+
            if (data.pageNumber > 1) {
                doc.setFillColor(2, 132, 199);
                doc.rect(14, 10, 182, 8, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFont('Inter', 'normal');
                doc.setFontSize(8);
                doc.text(`${title} (Continued)`, 18, 15.5);

                if (subtitle) {
                    doc.setFont('Kalpurush', 'normal');
                    doc.text(subtitle, 188, 15.5, { align: 'right' });
                }
            }

            // Draw Page Footer on EVERY page
            const totalPagesExp = '{total_pages_count_string}';
            doc.setDrawColor(203, 213, 225);
            doc.setLineWidth(0.3);
            doc.line(14, 282, 196, 282);

            doc.setFont('Kalpurush', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);

            const todayStr = new Date().toLocaleDateString('en-GB');
            doc.text(`তারিখ: ${todayStr}`, 14, 287);

            const pageStr = `পৃষ্ঠা ${data.pageNumber} / ${totalPagesExp}`;
            doc.text(pageStr, 196, 287, { align: 'right' });
        }
    });

    // Handle Summary Boxes & Signatures at the end of PDF
    let finalY = doc.lastAutoTable.finalY + 8;
    if (finalY > 250) {
        doc.addPage();
        finalY = 25;
    }

    if (summaryBoxes && summaryBoxes.length > 0) {
        doc.setFont('Kalpurush', 'normal');
        doc.setFontSize(9);
        summaryBoxes.forEach(box => {
            doc.setFillColor(248, 250, 252);
            doc.setDrawColor(203, 213, 225);
            doc.roundedRect(120, finalY, 76, 16, 2, 2, 'FD');

            doc.setTextColor(71, 85, 105);
            doc.text(box.label, 124, finalY + 6);

            doc.setFontSize(10);
            if (Array.isArray(box.color)) {
                doc.setTextColor(box.color[0], box.color[1], box.color[2]);
            } else if (typeof box.color === 'string') {
                doc.setTextColor(box.color);
            } else {
                doc.setTextColor(15, 23, 42);
            }
            doc.text(box.value, 192, finalY + 11, { align: 'right' });

            finalY += 18;
        });
    }

    if (showSignatures) {
        if (finalY > 255) {
            doc.addPage();
            finalY = 30;
        } else {
            finalY = Math.max(finalY + 15, 260);
        }

        doc.setDrawColor(100, 116, 139);
        doc.setLineDashPattern([1.5, 1.5], 0);

        // Left Signature
        doc.line(24, finalY, 74, finalY);
        doc.setFont('Kalpurush', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(51, 65, 85);
        doc.text('কাস্টমারের স্বাক্ষর', 49, finalY + 4, { align: 'center' });

        // Right Signature
        doc.line(136, finalY, 186, finalY);
        doc.text('কর্তৃপক্ষের স্বাক্ষর', 161, finalY + 4, { align: 'center' });
    }

    // Replace Total Pages String alias across all pages
    if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages('{total_pages_count_string}');
    }

    // Open Print Dialog or Download
    doc.autoPrint();
    const pdfBlob = doc.output('bloburl');
    window.open(pdfBlob, '_blank');
}

/**
 * Load Image URL as Data URL
 */
function loadImageAsDataUrl(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = reject;
        img.src = url;
    });
}
