import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

/**
 * Global Flatpickr DD/MM/YYYY Enforcer (World-Class Segment-Aware Architecture)
 */

let _isInternalFlatpickrChange = false;

function getFallbackParts(input) {
    const today = new Date();
    const defaultDay = String(today.getDate()).padStart(2, '0');
    const defaultMonth = String(today.getMonth() + 1).padStart(2, '0');
    const defaultYear = String(today.getFullYear());

    const origVal = (input && input.value) ? String(input.value).trim() : '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(origVal)) {
        const [y, m, d] = origVal.split('-');
        return { day: d, month: m, year: y };
    } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(origVal)) {
        const [d, m, y] = origVal.split('/');
        return { day: d, month: m, year: y };
    }
    return { day: defaultDay, month: defaultMonth, year: defaultYear };
}

function getMaxDaysInMonth(monthStr, yearStr) {
    const m = parseInt(monthStr, 10);
    const y = parseInt(yearStr, 10) || new Date().getFullYear();
    if (isNaN(m) || m < 1 || m > 12) return 31;
    return new Date(y, m, 0).getDate();
}

function parseDateSegments(rawStr, fallback) {
    const trimmed = String(rawStr || '').trim();
    let day = '';
    let month = '';
    let year = '';

    if (trimmed.includes('/')) {
        const parts = trimmed.split('/');
        day = (parts[0] !== undefined ? parts[0] : '').replace(/\D/g, '');
        month = (parts[1] !== undefined ? parts[1] : '').replace(/\D/g, '');
        year = (parts[2] !== undefined ? parts[2] : '').replace(/\D/g, '');
    } else {
        const digits = trimmed.replace(/\D/g, '');
        if (digits.length <= 2) {
            day = digits;
            month = fallback.month;
            year = fallback.year;
        } else if (digits.length <= 4) {
            day = digits.slice(0, 2);
            month = digits.slice(2);
            year = fallback.year;
        } else {
            day = digits.slice(0, 2);
            month = digits.slice(2, 4);
            year = digits.slice(4, 8);
        }
    }

    return {
        day,
        month: month || fallback.month,
        year: year || fallback.year
    };
}

export function normalizeAndSyncDate(altInput) {
    if (!altInput) return;
    const raw = altInput.value.trim();
    const origInput = altInput._parentOriginalInput;

    if (!raw) {
        if (origInput) {
            origInput.value = '';
            if (origInput._flatpickr) origInput._flatpickr.clear();
            origInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
        return;
    }

    const fallback = getFallbackParts(origInput || altInput);
    let { day, month, year } = parseDateSegments(raw, fallback);

    if (!month) month = fallback.month;
    if (!year) year = fallback.year;

    if (year.length === 2) {
        year = '20' + year;
    } else if (year.length !== 4) {
        year = fallback.year;
    }

    let mNum = parseInt(month, 10);
    if (isNaN(mNum) || mNum < 1) mNum = 1;
    if (mNum > 12) mNum = 12;
    month = String(mNum).padStart(2, '0');

    const maxDays = getMaxDaysInMonth(month, year);
    let dNum = parseInt(day, 10);
    if (isNaN(dNum) || dNum < 1) dNum = 1;
    if (dNum > maxDays) dNum = maxDays;
    day = String(dNum).padStart(2, '0');

    const formatted = `${day}/${month}/${year}`;
    if (altInput.value !== formatted) {
        altInput.value = formatted;
    }

    const isoStr = `${year}-${month}-${day}`;
    if (origInput) {
        origInput.value = isoStr;
        if (origInput._flatpickr) {
            _isInternalFlatpickrChange = true;
            origInput._flatpickr.setDate(isoStr, false);
            _isInternalFlatpickrChange = false;
        }
        origInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
}

function handleDateFocus(e) {
    const input = e.target;
    setTimeout(() => {
        if (document.activeElement === input) {
            input.setSelectionRange(0, 2);
        }
    }, 10);
}

function handleDateClick(e) {
    const input = e.target;
    const pos = input.selectionStart;
    setTimeout(() => {
        if (pos <= 2) {
            input.setSelectionRange(0, 2);
        } else if (pos >= 3 && pos <= 5) {
            input.setSelectionRange(3, 5);
        } else if (pos >= 6) {
            input.setSelectionRange(6, 10);
        }
    }, 10);
}

function handleDateKeyDown(e) {
    const input = e.target;
    const key = e.key;

    if (e.altKey && key === 'ArrowDown') {
        if (input._parentOriginalInput?._flatpickr) {
            input._parentOriginalInput._flatpickr.toggle();
        }
        return;
    }

    // Up/Down Arrow: Increment/Decrement active date segment
    if ((key === 'ArrowUp' || key === 'ArrowDown') && !e.altKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const pos = input.selectionStart;
        const fallback = getFallbackParts(input._parentOriginalInput || input);
        let { day, month, year } = parseDateSegments(input.value, fallback);
        const delta = (key === 'ArrowUp') ? 1 : -1;

        if (pos <= 2) {
            const maxDays = getMaxDaysInMonth(month || fallback.month, year || fallback.year);
            let d = (parseInt(day, 10) || parseInt(fallback.day, 10)) + delta;
            if (d > maxDays) d = 1;
            else if (d < 1) d = maxDays;
            day = String(d).padStart(2, '0');
            input.value = `${day}/${month || fallback.month}/${year || fallback.year}`;
            normalizeAndSyncDate(input);
            input.setSelectionRange(0, 2);
        } else if (pos >= 3 && pos <= 5) {
            let m = (parseInt(month, 10) || parseInt(fallback.month, 10)) + delta;
            if (m > 12) m = 1;
            else if (m < 1) m = 12;
            month = String(m).padStart(2, '0');
            input.value = `${day || fallback.day}/${month}/${year || fallback.year}`;
            normalizeAndSyncDate(input);
            input.setSelectionRange(3, 5);
        } else if (pos >= 6) {
            let y = (parseInt(year, 10) || parseInt(fallback.year, 10)) + delta;
            year = String(y);
            input.value = `${day || fallback.day}/${month || fallback.month}/${year}`;
            normalizeAndSyncDate(input);
            input.setSelectionRange(6, 10);
        }
        return;
    }

    // Left/Right Arrow: Navigate between segments
    if (key === 'ArrowRight' && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
        const pos = input.selectionStart;
        if (pos <= 2) {
            e.preventDefault();
            input.setSelectionRange(3, 5);
            return;
        } else if (pos <= 5) {
            e.preventDefault();
            input.setSelectionRange(6, 10);
            return;
        }
    }

    if (key === 'ArrowLeft' && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
        const pos = input.selectionStart;
        if (pos >= 6) {
            e.preventDefault();
            input.setSelectionRange(3, 5);
            return;
        } else if (pos >= 3) {
            e.preventDefault();
            input.setSelectionRange(0, 2);
            return;
        }
    }

    if (key === 'Enter') {
        normalizeAndSyncDate(input);
        return;
    }

    if (['Tab', 'Home', 'End', 'Control', 'Meta', 'Alt'].includes(key)) {
        return;
    }

    if (key === '/') {
        e.preventDefault();
        const pos = input.selectionStart;
        if (pos < 3) input.setSelectionRange(3, 5);
        else if (pos < 6) input.setSelectionRange(6, 10);
        return;
    }

    if (!/^[0-9]$/.test(key) && key !== 'Backspace' && key !== 'Delete') {
        e.preventDefault();
    }
}

function handleDateAutoMask(e) {
    const input = e.target;
    if (e.inputType && e.inputType.includes('delete')) return;

    const val = input.value;
    const cursor = input.selectionStart;
    const fallback = getFallbackParts(input._parentOriginalInput || input);

    let day = '';
    let month = '';
    let year = '';

    if (val.includes('/')) {
        const parts = val.split('/');
        day = (parts[0] !== undefined ? parts[0] : '').replace(/\D/g, '');
        month = (parts[1] !== undefined ? parts[1] : '').replace(/\D/g, '');
        year = (parts[2] !== undefined ? parts[2] : '').replace(/\D/g, '');
    } else {
        const digits = val.replace(/\D/g, '');
        if (digits.length <= 2) {
            day = digits;
        } else if (digits.length <= 4) {
            day = digits.slice(0, 2);
            month = digits.slice(2);
        } else {
            day = digits.slice(0, 2);
            month = digits.slice(2, 4);
            year = digits.slice(4, 8);
        }
    }

    // Preserve Month and Year if omitted while typing
    if (!month && cursor <= 2) month = fallback.month;
    if (!year && cursor <= 5) year = fallback.year;

    // Clamp Day & Month
    if (day.length === 2 && !isNaN(parseInt(day, 10)) && parseInt(day, 10) > 31) day = '31';
    if (month.length === 2 && !isNaN(parseInt(month, 10)) && parseInt(month, 10) > 12) month = '12';

    let formatted = day;
    if (month || val.includes('/') || cursor > 2) {
        formatted += '/' + month;
        if (year || (val.split('/').length > 2) || cursor > 5) {
            formatted += '/' + year;
        }
    }

    if (val !== formatted) {
        input.value = formatted;
        let newPos = cursor;
        if ((cursor === 2 || cursor === 5) && formatted.length > cursor) newPos++;
        input.setSelectionRange(newPos, newPos);
    }

    // Auto-advance selection if 2 digits of Day are typed
    if (day.length === 2 && cursor === 2 && val.includes('/')) {
        setTimeout(() => {
            if (document.activeElement === input && input.selectionStart === 2) {
                input.setSelectionRange(3, 5);
            }
        }, 10);
    }

    // Full Sync to original input when all segments complete
    if (day.length === 2 && month.length === 2 && year.length === 4) {
        const isoStr = `${year}-${month}-${day}`;
        if (!isNaN(new Date(isoStr).getTime()) && input._parentOriginalInput) {
            const origInput = input._parentOriginalInput;
            origInput.value = isoStr;
            if (origInput._flatpickr) {
                _isInternalFlatpickrChange = true;
                origInput._flatpickr.setDate(isoStr, false);
                _isInternalFlatpickrChange = false;
            }
            origInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }
}

function handleDateBlur(e) {
    normalizeAndSyncDate(e.target);
}

export function initDatePickers() {
    document.querySelectorAll('input.datepicker').forEach(input => {
        if (input._flatpickr) {
            if (input.value) input._flatpickr.setDate(input.value, false);
            return;
        }

        let currentVal = input.value;
        if (currentVal && /^\d{2}\/\d{2}\/\d{4}$/.test(currentVal)) {
            const [d, m, y] = currentVal.split('/');
            currentVal = `${y}-${m}-${d}`;
            input.value = currentVal;
        }
        const swalContainer = input.closest('.swal2-container');

        const fp = flatpickr(input, {
            appendTo: swalContainer || undefined,
            mode: input.dataset.mode || 'single',
            dateFormat: 'Y-m-d',
            altInput: true,
            altFormat: 'd/m/Y',
            allowInput: true,
            clickOpens: false,
            disableMobile: true,
            onReady: (_, __, instance) => {
                if (instance.altInput) {
                    const altInput = instance.altInput;
                    altInput.className = input.className + ' flatpickr-alt-input';
                    altInput.classList.remove('datepicker');
                    altInput.placeholder = input.placeholder || 'DD/MM/YYYY';
                    altInput._parentOriginalInput = input;
                    if (input.id) altInput.id = input.id + '-alt';
                    altInput.style.cursor = 'text';

                    altInput.addEventListener('focus', handleDateFocus);
                    altInput.addEventListener('click', handleDateClick);
                    altInput.addEventListener('input', handleDateAutoMask);
                    altInput.addEventListener('keydown', handleDateKeyDown);
                    altInput.addEventListener('blur', handleDateBlur);

                    input.style.setProperty('display', 'none', 'important');
                    input.tabIndex = -1;

                    // Centralized Container Wrapper & FontAwesome Calendar Icon Button
                    let wrapper = altInput.parentElement;
                    if (!wrapper || !wrapper.classList.contains('date-input-container')) {
                        const container = document.createElement('div');
                        container.className = 'relative inline-flex items-center w-full date-input-container';
                        altInput.parentNode.insertBefore(container, altInput);
                        container.appendChild(altInput);
                        wrapper = container;
                    }

                    const existingBtn = wrapper.querySelector('.date-picker-icon-btn');
                    if (existingBtn) existingBtn.remove();

                    const iconBtn = document.createElement('button');
                    iconBtn.type = 'button';
                    iconBtn.tabIndex = -1;
                    iconBtn.className = 'date-picker-icon-btn absolute right-2.5 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300 transition-colors p-1 cursor-pointer flex items-center justify-center border-0 bg-transparent outline-none z-10';
                    iconBtn.title = 'ক্যালেন্ডার খুলুন';
                    iconBtn.innerHTML = '<i class="fa-solid fa-calendar-days text-xs pointer-events-none"></i>';

                    iconBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        instance.toggle();
                    });

                    wrapper.appendChild(iconBtn);
                }

                // Restore footer buttons
                if (instance.calendarContainer && !instance.calendarContainer.querySelector('.fp-action-footer')) {
                    const footer = document.createElement('div');
                    footer.className = 'fp-action-footer';
                    footer.innerHTML = `
                        <button type="button" class="fp-btn-today"><i class="fa-solid fa-calendar-day"></i> আজকে</button>
                        <button type="button" class="fp-btn-yesterday"><i class="fa-solid fa-clock-rotate-left"></i> গতকাল</button>
                        <button type="button" class="fp-btn-clear"><i class="fa-solid fa-eraser"></i> ক্লিয়ার</button>
                    `;
                    footer.querySelector('.fp-btn-today').onclick = () => {
                        const today = new Date().toISOString().split('T')[0];
                        instance.setDate(today, true);
                        instance.close();
                    };
                    footer.querySelector('.fp-btn-yesterday').onclick = () => {
                        const y = new Date();
                        y.setDate(y.getDate() - 1);
                        const yStr = y.toISOString().split('T')[0];
                        instance.setDate(yStr, true);
                        instance.close();
                    };
                    footer.querySelector('.fp-btn-clear').onclick = () => {
                        instance.clear();
                        input.value = '';
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                        instance.close();
                    };
                    instance.calendarContainer.appendChild(footer);
                }
            },
            onChange: (selectedDates, dateStr, instance) => {
                _isInternalFlatpickrChange = true;
                input.value = dateStr;
                _isInternalFlatpickrChange = false;
                input.dispatchEvent(new Event('change', { bubbles: true }));
                input.dispatchEvent(new Event('input', { bubbles: true }));
                instance.close();
            }
        });

        // Value Interceptor for programmatic changes
        if (!input._valueIntercepted) {
            input._valueIntercepted = true;
            const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
            Object.defineProperty(input, 'value', {
                get() { return descriptor.get.call(this); },
                set(val) {
                    let cleanVal = val || '';
                    if (cleanVal && /^\d{2}\/\d{2}\/\d{4}$/.test(cleanVal)) {
                        const [d, m, y] = cleanVal.split('/');
                        cleanVal = `${y}-${m}-${d}`;
                    }
                    const current = descriptor.get.call(this);
                    descriptor.set.call(this, cleanVal);
                    if (this._flatpickr && cleanVal && cleanVal !== current && !_isInternalFlatpickrChange) {
                        this._flatpickr.setDate(cleanVal, false);
                    }
                },
                configurable: true
            });
        }
    });
}

const dateObserver = new MutationObserver(mutations => {
    mutations.forEach(m => {
        m.addedNodes.forEach(node => {
            if (node.nodeType !== 1) return;
            if (node.classList?.contains('datepicker')) setTimeout(() => initDatePickers(), 0);
            node.querySelectorAll?.('.datepicker').forEach(() => setTimeout(() => initDatePickers(), 0));
        });
    });
});

export function startDateObserver() {
    dateObserver.observe(document.body, { childList: true, subtree: true });
}

window.initDatePickers = initDatePickers;
