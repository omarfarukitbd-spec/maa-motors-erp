/**
 * --- DASHBOARD CHARTS MODULE (100% Offline Canvas / SVG Renderer) ---
 * Lightweight, zero-dependency visual graph renderer.
 */
import { formatAmountWithComma } from '../utils.js';

export function renderSalesVsCollectionChart(canvasId, dataPoints = []) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.parentElement.clientWidth || 500;
    const height = 180;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    // Dummy or calculated 7-day data fallback
    const days = dataPoints.length > 0 ? dataPoints : [
        { day: 'Sat', sales: 12000, col: 15000 },
        { day: 'Sun', sales: 25000, col: 18000 },
        { day: 'Mon', sales: 18000, col: 22000 },
        { day: 'Tue', sales: 30000, col: 28000 },
        { day: 'Wed', sales: 22000, col: 26000 },
        { day: 'Thu', sales: 35000, col: 32000 },
        { day: 'Fri', sales: 28000, col: 31000 }
    ];

    const padding = 30;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    const maxVal = Math.max(...days.map(d => Math.max(d.sales, d.col)), 40000);
    const stepX = graphWidth / (days.length - 1);

    // Grid lines
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 3; i++) {
        const y = padding + (graphHeight / 3) * i;
        ctx.beginPath(); ctx.moveTo(padding, y); ctx.lineTo(width - padding, y); ctx.stroke();
    }

    // Draw Sales Line (Blue)
    ctx.beginPath();
    ctx.strokeStyle = '#3B82F6'; ctx.lineWidth = 3;
    days.forEach((d, i) => {
        const x = padding + i * stepX;
        const y = padding + graphHeight - (d.sales / maxVal) * graphHeight;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw Collection Line (Emerald Green)
    ctx.beginPath();
    ctx.strokeStyle = '#10B981'; ctx.lineWidth = 3;
    days.forEach((d, i) => {
        const x = padding + i * stepX;
        const y = padding + graphHeight - (d.col / maxVal) * graphHeight;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw Data Dots & X-Labels
    ctx.font = '10px "Hind Siliguri", sans-serif';
    ctx.fillStyle = '#94A3B8';
    days.forEach((d, i) => {
        const x = padding + i * stepX;
        const ySales = padding + graphHeight - (d.sales / maxVal) * graphHeight;
        const yCol = padding + graphHeight - (d.col / maxVal) * graphHeight;

        // Sales Dot
        ctx.fillStyle = '#3B82F6'; ctx.beginPath(); ctx.arc(x, ySales, 4, 0, Math.PI * 2); ctx.fill();
        // Collection Dot
        ctx.fillStyle = '#10B981'; ctx.beginPath(); ctx.arc(x, yCol, 4, 0, Math.PI * 2); ctx.fill();

        // X Labels
        ctx.fillStyle = '#94A3B8'; ctx.fillText(d.day, x - 10, height - 8);
    });
}

export function renderPaymentDonutChart(canvasId, cashAmt = 0, bankAmt = 0) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 120;
    canvas.width = size; canvas.height = size;
    const centerX = size / 2, centerY = size / 2, radius = 45, innerRadius = 30;

    const total = cashAmt + bankAmt;
    ctx.clearRect(0, 0, size, size);

    if (total === 0) {
        ctx.beginPath(); ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#334155'; ctx.lineWidth = 14; ctx.stroke();
        return;
    }

    const cashAngle = (cashAmt / total) * Math.PI * 2;
    const bankAngle = (bankAmt / total) * Math.PI * 2;

    // Cash Arc (Emerald)
    if (cashAmt > 0) {
        ctx.beginPath(); ctx.arc(centerX, centerY, radius, 0, cashAngle);
        ctx.strokeStyle = '#10B981'; ctx.lineWidth = 14; ctx.stroke();
    }

    // Bank Arc (Blue)
    if (bankAmt > 0) {
        ctx.beginPath(); ctx.arc(centerX, centerY, radius, cashAngle, cashAngle + bankAngle);
        ctx.strokeStyle = '#3B82F6'; ctx.lineWidth = 14; ctx.stroke();
    }
}
