import Swal from 'sweetalert2';

export async function copyPortalLink(type) {
    const origin = window.location.origin;
    const url = `${origin}/?portal=${type}`;
    try {
        await navigator.clipboard.writeText(url);
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: `${type === 'boss' ? 'বস' : 'স্টাফ'} পোর্টাল লিংক কপি হয়েছে!`,
            showConfirmButton: false,
            timer: 2500,
            background: '#0F172A',
            color: '#F8FAFC'
        });
    } catch (err) {
        console.error(err);
        Swal.fire('কপি ব্যর্থ', url, 'info');
    }
}

export function sharePortalWhatsApp(type) {
    const origin = window.location.origin;
    const url = `${origin}/?portal=${type}`;
    const text = type === 'boss'
        ? `আসসালামু আলাইকুম স্যার, মা মোটরসের লাইভ হিসাব ও ড্যাশবোর্ড দেখার লিংক:\n${url}\n(আপনার সিকিউরিটি পিন: 5027)`
        : `আসসালামু আলাইকুম, মা মোটরস ERP স্টাফ পোর্টাল লিংক:\n${url}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
}
