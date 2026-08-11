import { firebase } from '../firebase-config.js';
import { UserDAO } from '../dao.js';

let adminUsersUnsubscribe = null;

/**
 * User List — Card-Based Layout with KPI Stats
 */
export function loadAdminUsers() {
    try {
        if (adminUsersUnsubscribe) adminUsersUnsubscribe();

        const listContainer = document.getElementById('admin-users-list');
        if(!listContainer) return;

        adminUsersUnsubscribe = UserDAO.listenAll(users => {
            // Sort pending FIRST, then by creation date (newest first)
            users.sort((a, b) => {
                if (a.status === 'pending' && b.status !== 'pending') return -1;
                if (a.status !== 'pending' && b.status === 'pending') return 1;
                const dateA = a.createdAt ? a.createdAt.toMillis() : 0;
                const dateB = b.createdAt ? b.createdAt.toMillis() : 0;
                return dateB - dateA;
            });

            // Update KPI Stats
            const totalEl = document.getElementById('stat-total-users');
            const activeEl = document.getElementById('stat-active-users');
            const pendingEl = document.getElementById('stat-pending-users');
            const blockedEl = document.getElementById('stat-blocked-users');
            const activeCount = users.filter(u => u.status === 'approved').length;
            const pendingCount = users.filter(u => u.status === 'pending').length;
            const blockedCount = users.filter(u => u.status === 'blocked' || u.status === 'revoked').length;
            if (totalEl) totalEl.textContent = users.length;
            if (activeEl) activeEl.textContent = activeCount;
            if (pendingEl) pendingEl.textContent = pendingCount;
            if (blockedEl) blockedEl.textContent = blockedCount;

            let html = '<div class="grid grid-cols-1 gap-3">';

            users.forEach(data => {
                const docId = data.id;
                const isMe = docId === firebase.auth().currentUser?.uid;
                const isPending = data.status === 'pending';
                const isBlocked = data.status === 'blocked' || data.status === 'revoked';
                const email = data.email || docId;
                const initial = (email.charAt(0) || '?').toUpperCase();

                let lastLoginStr = 'N/A';
                if(data.lastLogin) {
                    const d = data.lastLogin.toDate();
                    lastLoginStr = d.toLocaleDateString('en-GB') + ' ' + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                }

                // Avatar colors
                const avatarColors = isPending
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                    : isBlocked
                        ? 'bg-red-500/15 border-red-500/30 text-red-400'
                        : isMe
                            ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400'
                            : 'bg-slate-700/50 border-slate-600/30 text-slate-300';

                // Status badge
                const statusBadge = isPending
                    ? '<span class="text-[9px] bg-amber-500/20 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded-full font-black uppercase animate-pulse">Pending</span>'
                    : isBlocked
                        ? '<span class="text-[9px] bg-red-500/20 border border-red-500/30 text-red-400 px-2 py-0.5 rounded-full font-black uppercase">Blocked</span>'
                        : '<span class="text-[9px] bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full font-black uppercase">Active</span>';

                // Role badge
                const roleBadge = data.role === 'Admin'
                    ? '<span class="text-[9px] bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 px-2 py-0.5 rounded-full font-black uppercase">Admin</span>'
                    : '<span class="text-[9px] bg-slate-600/30 border border-slate-500/30 text-slate-300 px-2 py-0.5 rounded-full font-black uppercase">Staff</span>';

                // Card border style
                const cardBorder = isPending
                    ? 'border-amber-500/30 bg-amber-500/[0.03]'
                    : isBlocked
                        ? 'border-red-500/20 bg-red-500/[0.02]'
                        : 'border-slate-800/60 hover:border-indigo-500/20';

                // Action buttons
                let actions = '';
                if (!isMe) {
                    if (isPending) {
                        actions = `
                            <button class="h-8 px-3 rounded-lg bg-emerald-600/15 border border-emerald-500/25 hover:bg-emerald-600 text-emerald-400 hover:text-white text-[11px] font-bold transition-all cursor-pointer active:scale-95 flex items-center gap-1" onclick="appAdmin.approveStaff('${docId}', '${email}')"><i class="fa-solid fa-check text-[10px]"></i>অনুমোদন</button>
                            <button class="h-8 px-3 rounded-lg bg-red-500/10 border border-red-500/25 hover:bg-red-600 text-red-400 hover:text-white text-[11px] font-bold transition-all cursor-pointer active:scale-95 flex items-center gap-1" onclick="appAdmin.deleteUserAccount('${docId}', '${email}')"><i class="fa-solid fa-trash text-[10px]"></i>বাতিল</button>`;
                    } else if (data.role === 'Staff') {
                        actions = `
                            <button class="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-600 text-indigo-400 hover:text-white text-xs transition-all cursor-pointer active:scale-95 flex items-center justify-center" onclick="appAdmin.managePermissions('${docId}', '${email}')" title="পারমিশন"><i class="fa-solid fa-shield-halved"></i></button>
                            <button class="h-8 w-8 rounded-lg bg-slate-700/50 border border-slate-600/30 hover:bg-blue-600 text-slate-300 hover:text-white text-xs transition-all cursor-pointer active:scale-95 flex items-center justify-center" onclick="appAdmin.changeStaffPin('${docId}', '${data.pin || ''}')" title="Change PIN"><i class="fa-solid fa-key"></i></button>
                            <button class="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:bg-amber-600 text-amber-400 hover:text-white text-xs transition-all cursor-pointer active:scale-95 flex items-center justify-center" onclick="appAdmin.revokeStaff('${docId}')" title="Block"><i class="fa-solid fa-ban"></i></button>
                            <button class="h-8 w-8 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-600 text-red-400 hover:text-white text-xs transition-all cursor-pointer active:scale-95 flex items-center justify-center" onclick="appAdmin.deleteUserAccount('${docId}', '${email}')" title="ডিলেট"><i class="fa-solid fa-trash"></i></button>`;
                    } else {
                        actions = `
                            <button class="h-8 w-8 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-600 text-red-400 hover:text-white text-xs transition-all cursor-pointer active:scale-95 flex items-center justify-center" onclick="appAdmin.deleteUserAccount('${docId}', '${email}')" title="ডিলেট"><i class="fa-solid fa-trash"></i></button>`;
                    }
                }

                // Role dropdown (for non-pending, non-self users)
                const roleDropdown = (!isMe && !isPending)
                    ? `<select id="role-${docId}" class="h-7 px-2 rounded-lg bg-slate-950/80 border border-slate-700/60 text-xs text-white font-bold outline-none cursor-pointer" onchange="appAdmin.updateUserRole('${docId}')">
                        <option value="Admin" ${data.role === 'Admin' ? 'selected' : ''}>Admin</option>
                        <option value="Staff" ${data.role === 'Staff' ? 'selected' : ''}>Staff</option>
                    </select>`
                    : '';

                html += `
                    <div class="rounded-xl border ${cardBorder} p-3 md:p-4 transition-all group">
                        <div class="flex items-start gap-3">
                            <!-- Avatar -->
                            <div class="w-10 h-10 rounded-xl ${avatarColors} border flex items-center justify-center font-black text-sm shrink-0">${initial}</div>
                            <!-- Info -->
                            <div class="flex-1 min-w-0">
                                <div class="flex flex-wrap items-center gap-1.5">
                                    <span class="text-sm font-bold text-white truncate max-w-[200px] md:max-w-[320px]">${email}</span>
                                    ${isMe ? '<span class="text-[9px] bg-blue-500/20 border border-blue-500/30 text-blue-400 px-1.5 py-0.5 rounded font-bold">আপনি</span>' : ''}
                                    ${statusBadge}
                                    ${roleBadge}
                                </div>
                                <div class="flex flex-wrap items-center gap-3 mt-1.5">
                                    <span class="text-[10px] text-slate-500"><i class="fa-regular fa-clock mr-1"></i>Last Login: ${lastLoginStr}</span>
                                    ${roleDropdown}
                                </div>
                            </div>
                            <!-- Actions -->
                            <div class="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">${actions || '<span class="text-[10px] text-slate-500 font-bold italic">Locked</span>'}</div>
                        </div>
                    </div>`;
            });

            html += '</div>';
            listContainer.innerHTML = html || '<div class="text-center py-8 text-slate-500 font-bold italic text-sm">কোনো অ্যাকাউন্ট পাওয়া যায়নি</div>';
        });
    } catch (error) { console.error("Error loading users:", error); }
}
