import { firebase } from '../firebase-config.js';
import { AuditDAO } from '../dao.js';
import { capturePhoto } from '../utils/camera-capture.js';

/**
 * Logs an action to the audit trail and triggers Telegram alerts for critical security events.
 */
export async function auditLog(action, module, entityId, entityName, details = {}, changes = null) {
    try {
        const currentUser = firebase.auth().currentUser;
        const isMobile = (typeof navigator !== 'undefined' && navigator.userAgent && /Mobi|Android|iPhone/i.test(navigator.userAgent));
        
        const logEntry = {
            action: action,
            module: module,
            entityId: entityId || '',
            entityName: entityName || '',
            details: details || {},
            deviceInfo: isMobile ? 'Mobile' : 'Desktop',
            userEmail: currentUser ? currentUser.email : 'Unknown',
            userId: currentUser ? currentUser.uid : 'System',
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            clientTimestamp: new Date().toISOString()
        };

        if (changes) logEntry.changes = changes;

        await AuditDAO.add(logEntry);
        console.log(`[Audit] ${action} on ${module} (${entityName}) logged successfully.`);

        // Telegram Alert Logic (Free plan alternative)
        if (['DELETE', 'UPDATE', 'SECURITY_ALERT', 'LOGIN'].includes(action)) {
            try {
                const daoModule = await import('../dao.js');
                const settings = await daoModule.SettingsDAO.getAppSettings();
                const botToken = settings.telegramBotToken;
                const chatId = settings.telegramChatId;
                
                if (botToken && chatId) {
                    let alertType = '[INFO]';
                    if (action === 'DELETE' || action === 'SECURITY_ALERT') alertType = '[ALERT]';
                    else if (action === 'UPDATE') alertType = '[WARN]';
                    else if (action === 'LOGIN') alertType = '[SUCCESS]';

                    let detailsStr = '';
                    if (details && typeof details === 'object' && Object.keys(details).length > 0) {
                        detailsStr = `\n*Details:* \`${JSON.stringify(details).substring(0, 100)}\``;
                    }

                    const text = `
${alertType} *Maa Motors ERP Alert*
*Action:* ${action}
*Module:* ${module || 'Unknown'}
*Target:* ${entityName || entityId || 'Unknown'}
*User:* ${logEntry.userEmail}
*Time:* ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })}${detailsStr}
                    `.trim();

                    let photoBlob = null;
                    if (action === 'SECURITY_ALERT') {
                        photoBlob = await capturePhoto();
                    }

                    if (photoBlob) {
                        const formData = new FormData();
                        formData.append('chat_id', chatId);
                        formData.append('photo', photoBlob, 'intruder.jpg');
                        formData.append('caption', text);
                        formData.append('parse_mode', 'Markdown');

                        await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
                            method: 'POST',
                            body: formData
                        });
                    } else {
                        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' })
                        });
                    }
                }
            } catch(e) {
                console.error('Failed to send Telegram alert:', e);
            }
        }

    } catch (error) {
        console.error("Failed to write audit log:", error);
    }
}
