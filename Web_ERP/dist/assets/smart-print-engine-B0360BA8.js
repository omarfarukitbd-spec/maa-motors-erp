function e(e,t){return new Promise(n=>{let r=document.createElement(`div`);r.style.cssText=[`position:fixed`,`left:-9999px`,`top:0`,`width:794px`,`visibility:hidden`,`pointer-events:none`,`font-family:"Inter","Kalpurush","Hind Siliguri",sans-serif`,`font-size:11px`,`color:#0f172a`,`background:white`,`padding:6px 12px`,`box-sizing:border-box`].join(`;`);let i=document.createElement(`table`);i.style.cssText=`width:100%;border-collapse:collapse;table-layout:auto;`,i.innerHTML=t;let a=document.createElement(`tbody`);e.forEach(e=>{let t=typeof e==`object`&&e?e.html:e,n=document.createElement(`tbody`);n.innerHTML=(t||``).trim();let r=n.querySelector(`tr`);r&&a.appendChild(r)}),i.appendChild(a),r.appendChild(i),document.body.appendChild(r),requestAnimationFrame(()=>{let e=a.querySelectorAll(`tr`),t=Array.from(e).map(e=>Math.ceil(e.getBoundingClientRect().height)+1);document.body.removeChild(r),n(t)})})}function t(e){return!e||!e.trim()?Promise.resolve(0):new Promise(t=>{let n=document.createElement(`div`);n.style.cssText=[`position:fixed`,`left:-9999px`,`top:0`,`width:794px`,`visibility:hidden`,`pointer-events:none`,`font-family:"Inter","Kalpurush","Hind Siliguri",sans-serif`,`font-size:11px`,`padding:6px 12px`,`box-sizing:border-box`].join(`;`),n.innerHTML=e,document.body.appendChild(n),requestAnimationFrame(()=>{let e=Math.ceil(n.getBoundingClientRect().height);document.body.removeChild(n),t(e||0)})})}async function n({rowsArray:n,page1HeaderHtml:r,repeatHeaderHtml:a,tableColHeaderHtml:o,summaryHtml:s=``,signatureHtml:c=``,formattedDate:l}){let[u,d]=await Promise.all([e(n,o),s?t(s):Promise.resolve(0)]),f=u.map(e=>Math.ceil(e*1)),p=[],m=[],h=0,g=!0;for(let e=0;e<n.length;e++){let t=f[e]||24,r=g?869:969,i=e===n.length-1?d:0;h+t+i>r&&m.length>0&&(p.push(m),m=[],h=0,g=!1);let a=n[e];m.push(typeof a==`object`?a.html:a),h+=t}return m.length&&p.push(m),i(p,{page1HeaderHtml:r,repeatHeaderHtml:a,tableColHeaderHtml:o,summaryHtml:s,signatureHtml:c,formattedDate:l,tableClass:`data-table`})}async function r({rowsArray:n,page1HeaderHtml:r,repeatHeaderHtml:a,tableColHeaderHtml:o,page1ExtraHtml:s=``,summaryHtml:c=``,signatureHtml:l=``,formattedDate:u}){let[d,f,p]=await Promise.all([e(n,o),s?t(s):Promise.resolve(0),c?t(c):Promise.resolve(0)]),m=d.map(e=>Math.ceil(e*1)),h=975-Math.ceil(f*1)-34-36-16+-20,g=[],_=[],v=0,y=!0;for(let e=0;e<n.length;e++){let t=m[e]||24,r=y?h:969,i=e===n.length-1?p:0;v+t+i>r&&_.length>0&&(g.push(_),_=[],v=0,y=!1);let a=n[e];_.push(typeof a==`object`?a.html:a),v+=t}return _.length&&g.push(_),i(g,{page1HeaderHtml:r,repeatHeaderHtml:a,tableColHeaderHtml:o,page1ExtraHtml:s,summaryHtml:c,signatureHtml:l,formattedDate:u,tableClass:`print-items-table`})}function i(e,t){let{page1HeaderHtml:n,repeatHeaderHtml:r,tableColHeaderHtml:i,page1ExtraHtml:a=``,summaryHtml:o=``,signatureHtml:s=``,formattedDate:c,tableClass:l}=t,u=e.length;return e.map((e,t)=>{let d=t+1,f=d===1,p=d===u;return`<div style="${p?``:`page-break-after:always;break-after:always;`}width:100%;box-sizing:border-box;background:white;color:#0f172a;padding:6px 12px;">
            <div style="padding-top:2px;margin-bottom:4px;">${f?n:r}</div>
            ${f&&a?a:``}
            <table style="width:100%;border-collapse:collapse;table-layout:auto;margin-top:2px;border:1px solid #cbd5e1;" class="${l}">
                ${i}
                <tbody${l===`print-items-table`?` style="font-size:10px;"`:``}>${e.join(``)}</tbody>
            </table>
            ${p?o+s:``}
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:10px;color:#475569;font-weight:700;border-top:1px solid #cbd5e1;padding-top:6px;margin-top:8px;font-family:'Inter','Kalpurush',sans-serif;">
                <span>তারিখ: ${c}</span>
                <span>পৃষ্ঠা ${d} / ${u}</span>
            </div>
        </div>`}).join(``)}function a(e,t=``){let n=document.getElementById(`__spe_iframe__`);n&&n.remove();let r=document.createElement(`iframe`);r.id=`__spe_iframe__`,r.setAttribute(`aria-hidden`,`true`),r.style.cssText=`position:fixed;left:-9999px;top:0;width:0;height:0;border:none;opacity:0;`,document.body.appendChild(r);let i=r.contentDocument||r.contentWindow.document;i.open(),i.write(`<!DOCTYPE html><html lang="bn"><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap" rel="stylesheet">
<link href="https://fonts.maateen.me/kalpurush/font.css" rel="stylesheet">
<style>
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
    font-family: 'Inter', 'Kalpurush', 'Hind Siliguri', sans-serif !important;
}
table {
    border-collapse: collapse !important;
    width: 100% !important;
    table-layout: auto !important;
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
.print-row-no-break, .signature-last-page-block {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
}
${t}</style>
</head><body>${e}</body></html>`),i.close();let a=()=>{try{r.contentWindow.focus(),r.contentWindow.print()}catch{window.print()}setTimeout(()=>{try{r.remove()}catch(e){console.error(`Remove iframe error:`,e)}},4e3)},o=r.contentDocument;o&&o.fonts&&o.fonts.ready?(async()=>{try{await o.fonts.ready,a()}catch(e){console.error(`Fonts ready error:`,e),setTimeout(a,700)}})():setTimeout(a,700)}export{n,r,a as t};