/**
 * Iframe Print CSS — injected into the hidden iframe on print.
 * @page { margin:0 } removes Chrome's built-in URL/date header+footer.
 * table-layout:auto lets columns self-size to content.
 * -webkit-print-color-adjust ensures background colors print correctly.
 */
export const IFRAME_PRINT_CSS = `
@page { size: A4 portrait; margin: 0 !important; }
*, *::before, *::after {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    box-sizing: border-box;
}
html, body {
    margin: 0 !important; padding: 0 !important;
    background: #fff !important; color: #0f172a !important;
    width: 100% !important; overflow: visible !important;
    font-family: 'Anek Bangla', 'Hind Siliguri', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
}
table {
    border-collapse: collapse !important;
    width: 100% !important;
    table-layout: auto !important;
}
thead { display: table-header-group !important; }
tfoot { display: table-footer-group !important; }
tr {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
}
tbody.print-row-group {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
}
.data-table { border: 1px solid #cbd5e1 !important; }
.data-table th, .data-table td {
    border: 1px solid #cbd5e1 !important;
    padding: 4px !important;
    line-height: 1.3 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
}
.print-items-table { border: 1px solid #cbd5e1 !important; }
.print-items-table th, .print-items-table td {
    border: 1px solid #e2e8f0 !important;
    padding: 4px 5px !important;
}
.print-row-no-break,
.signature-last-page-block,
.print-sig-block,
.page-break-avoid,
[data-print-keep-together] {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
}
.spe-page {
    width: 100%;
    max-width: 794px;
    margin: 0 auto;
    box-sizing: border-box;
    background: #ffffff;
    color: #0f172a;
}
`;
