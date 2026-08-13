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

    // Subtle Grid lines (Dashed)
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.15)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    for (let i = 0; i <= 3; i++) {
        const y = padding + (graphHeight / 3) * i;
        ctx.beginPath(); ctx.moveTo(padding, y); ctx.lineTo(width - padding, y); ctx.stroke();
    }
    ctx.setLineDash([]); // Reset line dash for the actual lines

    // Gradient for Sales
    const salesGrad = ctx.createLinearGradient(0, padding, 0, height - padding);
    salesGrad.addColorStop(0, 'rgba(59, 130, 246, 0.4)'); // Blue
    salesGrad.addColorStop(1, 'rgba(59, 130, 246, 0.0)');

    // Gradient for Collection
    const colGrad = ctx.createLinearGradient(0, padding, 0, height - padding);
    colGrad.addColorStop(0, 'rgba(16, 185, 129, 0.4)'); // Emerald
    colGrad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

    // Draw Sales Fill
    ctx.beginPath();
    ctx.moveTo(padding, padding + graphHeight);
    days.forEach((d, i) => {
        const x = padding + i * stepX;
        const y = padding + graphHeight - (d.sales / maxVal) * graphHeight;
        ctx.lineTo(x, y);
    });
    ctx.lineTo(padding + graphWidth, padding + graphHeight);
    ctx.closePath();
    ctx.fillStyle = salesGrad;
    ctx.fill();

    // Draw Collection Fill
    ctx.beginPath();
    ctx.moveTo(padding, padding + graphHeight);
    days.forEach((d, i) => {
        const x = padding + i * stepX;
        const y = padding + graphHeight - (d.col / maxVal) * graphHeight;
        ctx.lineTo(x, y);
    });
    ctx.lineTo(padding + graphWidth, padding + graphHeight);
    ctx.closePath();
    ctx.fillStyle = colGrad;
    ctx.fill();

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
    ctx.font = 'bold 10px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'center';
    days.forEach((d, i) => {
        const x = padding + i * stepX;
        const ySales = padding + graphHeight - (d.sales / maxVal) * graphHeight;
        const yCol = padding + graphHeight - (d.col / maxVal) * graphHeight;

        // Sales Dot with Glow
        ctx.shadowColor = 'rgba(59, 130, 246, 0.8)';
        ctx.shadowBlur = 5;
        ctx.fillStyle = '#3B82F6'; ctx.beginPath(); ctx.arc(x, ySales, 4, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0; // reset
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, ySales, 1.5, 0, Math.PI * 2); ctx.fill();

        // Col Dot with Glow
        ctx.shadowColor = 'rgba(16, 185, 129, 0.8)';
        ctx.shadowBlur = 5;
        ctx.fillStyle = '#10B981'; ctx.beginPath(); ctx.arc(x, yCol, 4, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0; // reset
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, yCol, 1.5, 0, Math.PI * 2); ctx.fill();

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
