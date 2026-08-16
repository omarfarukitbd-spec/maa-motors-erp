import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

/**
 * Global Flatpickr DD/MM/YYYY Enforcer (Restored Advanced Logic)
 */

let _isInternalFlatpickrChange = false;

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

    if (['Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Control', 'Meta', 'Alt'].includes(key)) {
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

    let val = input.value;
    const cursor = input.selectionStart;

    let day = val.substring(0, 2).replace(/\D/g, '');
    let month = val.substring(3, 5).replace(/\D/g, '');
    let year = val.substring(6, 10).replace(/\D/g, '');

    if (day.length === 2 && !isNaN(parseInt(day, 10)) && parseInt(day, 10) > 31) day = '31';
    if (month.length === 2 && !isNaN(parseInt(month, 10)) && parseInt(month, 10) > 12) month = '12';

    let formatted = day;
    if (val.length > 2 || cursor > 2) {
        formatted += '/' + month;
        if (val.length > 5 || cursor > 5) {
            formatted += '/' + year;
        }
    }

    if (val !== formatted) {
        input.value = formatted;
        let newPos = cursor;
        if ((cursor === 2 || cursor === 5) && formatted.length > cursor) newPos++;
        input.setSelectionRange(newPos, newPos);
    }

    // Full Sync to original input
    if (day.length === 2 && month.length === 2 && year.length === 4) {
        const isoStr = `${year}-${month}-${day}`;
        if (!isNaN(new Date(isoStr).getTime()) && input._parentOriginalInput) {
            const origInput = input._parentOriginalInput;
            origInput.value = isoStr;
            if (origInput._flatpickr) origInput._flatpickr.setDate(isoStr, false);
            origInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }
}

export function initDatePickers() {
    document.querySelectorAll('input.datepicker').forEach(input => {
        if(input._flatpickr) {
            if (input.value) input._flatpickr.setDate(input.value, false);
            return;
        }

        let currentVal = input.value;
        if (currentVal && /^\d{2}\/\d{2}\/\d{4}$/.test(currentVal)) {
            const [d, m, y] = currentVal.split('/');
            currentVal = `${y}-${m}-${d}`;
            input.value = currentVal;
        }
        let swalContainer = input.closest('.swal2-container');

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
                    altInput.style.cursor = 'text';

                    altInput.addEventListener('focus', handleDateFocus);
                    altInput.addEventListener('click', handleDateClick);
                    altInput.addEventListener('input', handleDateAutoMask);
                    altInput.addEventListener('keydown', handleDateKeyDown);

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
                        instance.setDate(today, true); instance.close();
                    };
                    footer.querySelector('.fp-btn-yesterday').onclick = () => {
                        const y = new Date(); y.setDate(y.getDate() - 1);
                        const yStr = y.toISOString().split('T')[0];
                        instance.setDate(yStr, true); instance.close();
                    };
                    footer.querySelector('.fp-btn-clear').onclick = () => {
                        instance.clear(); input.value = '';
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
