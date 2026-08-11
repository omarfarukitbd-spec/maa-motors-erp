/**
 * Advanced Floating Calculator Logic
 */

let calcHistory = '';
let shouldResetDisplay = false;
let memoryValue = 0;
let rawValue = '0'; // For holding calculation-safe string
let fullHistoryLog = [];

export function safeEvalCalc(expression) {
    if (!expression) return '0';
    // Smart percentage: 5000+10% -> 5000 + (5000 * 10 / 100)
    let parsedExp = expression.replace(/([0-9.]+)\s*([+-])\s*([0-9.]+)%/g, '$1 $2 ($1 * $3 / 100)');
    // Normal percentage for * or /
    parsedExp = parsedExp.replace(/%/g, '/100');
    if (!/^[0-9+\-*/. ()]+$/.test(parsedExp)) return 'Error';
    try {
        const res = Function(`"use strict"; return (${parsedExp})`)();
        if (typeof res === 'number' && !isNaN(res) && isFinite(res)) {
            return parseFloat(res.toFixed(6)).toString();
        }
        return 'Error';
    } catch {
        return 'Error';
    }
}

// Format number (e.g. 15,00,000) for display only
function formatForDisplay(val) {
    if (val === 'Error' || val === 'Infinity' || val === 'NaN') return '0';
    // Split into numbers and operators
    let parts = val.split(/([+\-*/])/);
    let formattedParts = parts.map(p => {
        if (['+', '-', '*', '/'].includes(p)) return p;
        if (!p) return '';
        
        let hasPercent = p.endsWith('%');
        let numStr = hasPercent ? p.slice(0, -1) : p;
        
        // If it's a number, format it, but preserve trailing dots and zeros
        if (numStr === '.') return '.' + (hasPercent ? '%' : '');
        
        if (numStr.includes('.')) {
            let [intPart, decPart] = numStr.split('.');
            let intFmt = intPart ? Number(intPart).toLocaleString('en-IN') : '0';
            return intFmt + '.' + decPart + (hasPercent ? '%' : '');
        } else {
            return Number(numStr).toLocaleString('en-IN') + (hasPercent ? '%' : '');
        }
    });
    return formattedParts.join('');
}

// Audio context tick sound
let audioCtx;
function playTick() {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.03);
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); // very low volume
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.03);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.03);
    } catch(e) {
        console.error('Audio click failed', e);
    }
}

export function handleCalc(v) {
    playTick();
    const d = document.getElementById('calc-display');
    const h = document.getElementById('calc-history');
    if(!d) return;

    let c = rawValue;
    if (c === 'Error' || c === 'Infinity' || c === 'NaN') c = '0';

    if (['MC', 'MR', 'M+', 'M-'].includes(v)) {
        if (v === 'MC') {
            memoryValue = 0;
            if (h) h.innerText = 'Memory Cleared';
        } else if (v === 'MR') {
            c = memoryValue.toString();
            shouldResetDisplay = true;
        } else if (v === 'M+') {
            memoryValue += parseFloat(safeEvalCalc(c)) || 0;
            if (h) h.innerText = 'M+ (Memory: ' + formatForDisplay(memoryValue.toString()) + ')';
            shouldResetDisplay = true;
        } else if (v === 'M-') {
            memoryValue -= parseFloat(safeEvalCalc(c)) || 0;
            if (h) h.innerText = 'M- (Memory: ' + formatForDisplay(memoryValue.toString()) + ')';
            shouldResetDisplay = true;
        }
    }
    else if(v === 'C') {
        c = '0';
        calcHistory = '';
        if(h) h.innerText = '';
    } 
    else if(v === '⌫' || v === 'Backspace') {
        if (shouldResetDisplay) {
            c = '0';
            calcHistory = '';
            if(h) h.innerText = '';
        } else {
            c = c.length > 1 ? c.slice(0, -1) : '0';
        }
    } 
    else if(v === '=' || v === 'Enter') {
        let res = safeEvalCalc(c);
        calcHistory = c + ' =';
        
        // Save to full log if it's an actual calculation
        if (c !== res && !shouldResetDisplay) {
            fullHistoryLog.unshift({ eq: c, res: res });
            updateHistoryTapeUI();
        }

        if(h) h.innerText = calcHistory;
        c = res;
        shouldResetDisplay = true;
    } 
    else if (['+', '-', '*', '/'].includes(v)) {
        shouldResetDisplay = false;
        const lastChar = c.slice(-1);
        if (['+', '-', '*', '/'].includes(lastChar)) {
            c = c.slice(0, -1) + v;
        } else {
            c += v;
        }
    }
    else {
        if (shouldResetDisplay) {
            c = '';
            shouldResetDisplay = false;
        }
        if (c === '0' && v !== '.' && v !== '00' && v !== '000') {
            c = v; // override leading zero
        } else {
            c += v;
        }
    }

    rawValue = c || '0';
    d.value = formatForDisplay(rawValue);
}

// Global Keyboard Support for Calculator
export function initCalculatorKeyboard() {
    document.addEventListener('keydown', (e) => {
        const widget = document.getElementById('calculator-widget');
        if (!widget || widget.classList.contains('hidden')) return;

        if (e.target.tagName === 'INPUT' && e.target.id !== 'calc-display') return;
        if (e.target.tagName === 'TEXTAREA') return;

        const allowedKeys = ['0','1','2','3','4','5','6','7','8','9','.','+','-','*','/','%','=','Enter','Backspace','Escape'];
        if (allowedKeys.includes(e.key)) {
            e.preventDefault();
            if (e.key === 'Escape') {
                window.app.toggleCalculator();
            } else {
                handleCalc(e.key);
            }
        }
    });
}

// Extra Features
export function toggleCalcHistoryTape() {
    const tape = document.getElementById('calc-history-tape');
    if (tape) tape.classList.toggle('hidden');
}

export async function copyCalcResult() {
    try {
        await navigator.clipboard.writeText(rawValue);
        const h = document.getElementById('calc-history');
        if (h) {
            const old = h.innerText;
            h.innerText = 'Copied: ' + rawValue;
            setTimeout(() => { h.innerText = old; }, 1500);
        }
    } catch (e) {
        console.error('Copy failed', e);
    }
}

function updateHistoryTapeUI() {
    const tape = document.getElementById('calc-history-tape');
    if (!tape) return;
    
    if (fullHistoryLog.length === 0) {
        tape.innerHTML = '<span class="text-center opacity-50 block py-4">No History</span>';
        return;
    }
    
    tape.innerHTML = fullHistoryLog.slice(0, 15).map(item => `
        <div class="border-b border-slate-800/50 pb-1 cursor-pointer hover:text-white transition-colors" onclick="window.handleCalc('C'); window.handleCalc('${item.res}')">
            <div class="text-[10px] text-slate-500">${formatForDisplay(item.eq)} =</div>
            <div class="text-sm font-black text-blue-400">${formatForDisplay(item.res)}</div>
        </div>
    `).join('');
}

// Draggable Calculator Logic
export function initDraggableCalculator() {
    const widget = document.getElementById('calculator-widget');
    const handle = document.getElementById('calc-drag-handle');
    if (!widget || !handle) return;

    let isDragging = false, currentX = 0, currentY = 0, initialX = 0, initialY = 0;
    let xOffset = 0, yOffset = 0;

    handle.addEventListener('mousedown', dragStart);
    handle.addEventListener('touchstart', dragStart, {passive: true});

    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, {passive: false});

    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchend', dragEnd);

    function dragStart(e) {
        if (e.target.closest('button')) return; // Ignore buttons
        initialX = (e.type === 'touchstart' ? e.touches[0].clientX : e.clientX) - xOffset;
        initialY = (e.type === 'touchstart' ? e.touches[0].clientY : e.clientY) - yOffset;
        isDragging = true;
    }

    function drag(e) {
        if (!isDragging) return;
        if (e.type === 'touchmove') e.preventDefault();
        
        currentX = (e.type === 'touchmove' ? e.touches[0].clientX : e.clientX) - initialX;
        currentY = (e.type === 'touchmove' ? e.touches[0].clientY : e.clientY) - initialY;
        xOffset = currentX;
        yOffset = currentY;

        widget.style.transform = `translate(${currentX}px, ${currentY}px)`;
    }

    function dragEnd() {
        isDragging = false;
    }
}

// Global Bindings
window.handleCalc = handleCalc;
window.toggleCalcHistoryTape = toggleCalcHistoryTape;
window.copyCalcResult = copyCalcResult;
