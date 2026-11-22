import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/tenant_model.dart';
import '../providers/auth_provider.dart';
import '../screens/home_dashboard_screen.dart';
import '../screens/main_counter_screen.dart';
import '../screens/challan_history_screen.dart';
import '../screens/login_screen.dart';
import '../screens/super_admin_hub_screen.dart';
import '../services/drive_backup_service.dart';
import '../services/firebase_sync_service.dart';
import '../utils/app_colors.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  void _openSuperAdminPinDialog(BuildContext context, AuthProvider auth) {
    final pinCtrl = TextEditingController();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.s1Dark,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Row(
          children: [
            Icon(Icons.shield, color: AppColors.load, size: 20),
            SizedBox(width: 8),
            Text('মালিকানা সিকিউরিটি', style: TextStyle(color: Colors.white, fontSize: 16)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'ওমর ফারুক (মালিক) সিকিউরিটি পিন দিন:',
              style: TextStyle(color: AppColors.muDark, fontSize: 13),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: pinCtrl,
              keyboardType: TextInputType.number,
              obscureText: true,
              style: const TextStyle(color: Colors.white, fontSize: 18, letterSpacing: 4),
              decoration: InputDecoration(
                filled: true,
                fillColor: AppColors.s2Dark,
                hintText: '••••',
                hintStyle: const TextStyle(color: AppColors.muDark),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('বাতিল', style: TextStyle(color: AppColors.muDark)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.load,
              foregroundColor: AppColors.textOnAccent,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            onPressed: () {
              if (pinCtrl.text.trim() == '7860') {
                Navigator.pop(ctx);
                auth.switchRole(UserRole.superAdmin);
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const SuperAdminHubScreen()),
                );
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    backgroundColor: AppColors.dng,
                    content: Text('ভুল সিকিউরিটি পিন! সঠিক ওনার পিন লিখুন।'),
                  ),
                );
              }
            },
            child: const Text('প্রবেশ'),
          ),
        ],
      ),
    );
  }

  void _openErpCloudSyncDialog(BuildContext context) {
    final sync = FirebaseSyncService();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.s1Dark,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Row(
          children: [
            Icon(Icons.cloud_sync, color: AppColors.unl, size: 22),
            SizedBox(width: 8),
            Text('মা মোটরস ইআরপি ক্লাউড সিঙ্ক', style: TextStyle(color: Colors.white, fontSize: 15)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'গোডাউন অ্যাপের প্রতিটি খালাস ও ডেলিভারি চালান সরাসরি মা মোটরস মূল ইআরপি ডাটাবেজে (maa-motors-erp) সিঙ্ক হয়।',
              style: TextStyle(color: AppColors.muDark, fontSize: 12.5),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppColors.s2Dark,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(
                        sync.isOnline ? Icons.check_circle : Icons.wifi_off,
                        color: sync.isOnline ? AppColors.load : AppColors.dng,
                        size: 16,
                      ),
                      const SizedBox(width: 6),
                      Text(
                        sync.isOnline ? 'ক্লাউড নেটওয়ার্ক সচল' : 'অফলাইন মোড',
                        style: TextStyle(
                          color: sync.isOnline ? AppColors.load : AppColors.dng,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'অপেক্ষমাণ চালান (Queue): ${sync.pendingCount} টি',
                    style: const TextStyle(color: Colors.white70, fontSize: 12),
                  ),
                  if (sync.lastSyncTime != null)
                    Text(
                      'সর্বশেষ সফল সিঙ্ক: ${sync.lastSyncTime!.hour}:${sync.lastSyncTime!.minute.toString().padLeft(2, '0')}',
                      style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11),
                    ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('বন্ধ করুন', style: TextStyle(color: AppColors.muDark)),
          ),
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.unl,
              foregroundColor: AppColors.textOnAccent,
            ),
            onPressed: () async {
              Navigator.pop(ctx);
              final pushed = await sync.syncPendingQueue();
              if (context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    backgroundColor: AppColors.load,
                    content: Text(pushed > 0
                        ? '$pushed টি অপেক্ষমাণ চালান সফলভাবে ইআরপিতে সিঙ্ক হয়েছে!'
                        : 'সকল চালান ক্লাউডে সম্পূর্ণ আপডেট রয়েছে।'),
                  ),
                );
              }
            },
            icon: const Icon(Icons.sync, size: 16),
            label: const Text('এখনই সিঙ্ক করুন'),
          ),
        ],
      ),
    );
  }

  void _openGoogleDriveDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.s1Dark,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Row(
          children: [
            Icon(Icons.cloud_upload_outlined, color: AppColors.unl, size: 22),
            SizedBox(width: 8),
            Text('গুগল ড্রাইভ ব্যাকআপ', style: TextStyle(color: Colors.white, fontSize: 16)),
          ],
        ),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'আপনার গোডাউনের সমস্ত হিসাব ও চালানের অফলাইন কপি গুগল ড্রাইভ ক্লাউডে নিরাপদ সংরক্ষিত থাকে।',
              style: TextStyle(color: AppColors.muDark, fontSize: 13),
            ),
            SizedBox(height: 12),
            Text(
              'ব্যাকআপ ড্রাইভ: office.maamotors@gmail.com',
              style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12, fontFamily: 'monospace'),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('বন্ধ করুন', style: TextStyle(color: AppColors.muDark)),
          ),
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.unl,
              foregroundColor: AppColors.textOnAccent,
            ),
            onPressed: () async {
              Navigator.pop(ctx);
              await DriveBackupService.performBackup('office.maamotors@gmail.com');
              if (context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    backgroundColor: AppColors.load,
                    content: Text('গুগল ড্রাইভ ক্লাউড ব্যাকআপ সফলভাবে সম্পন্ন!'),
                  ),
                );
              }
            },
            icon: const Icon(Icons.sync, size: 16),
            label: const Text('ব্যাকআপ নিন'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final isSuperAdmin = auth.isSuperAdmin;

    return Drawer(
      backgroundColor: const Color(0xFF0F172A),
      child: SafeArea(
        child: Column(
          children: [
            // Header Profile Card (MAA MOTORS GODOWN)
            _buildDrawerHeader(context, auth),

            // Scrollable Menu Items
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                children: [
                  // 1. Home Dashboard
                  _buildNavItem(
                    context: context,
                    icon: Icons.dashboard_outlined,
                    title: 'হোম ড্যাশবোর্ড',
                    subtitle: 'আজকের হিসাব ও চালানের সারাংশ',
                    onTap: () {
                      Navigator.pop(context);
                      Navigator.pushAndRemoveUntil(
                        context,
                        MaterialPageRoute(builder: (_) => const HomeDashboardScreen()),
                        (r) => false,
                      );
                    },
                  ),

                  // 2. Main Counter Mode
                  _buildNavItem(
                    context: context,
                    icon: Icons.touch_app_outlined,
                    title: 'মাল কাউন্টার মোড',
                    subtitle: 'গাড়ি থেকে আনলোডিং ও মাল ডেলিভারি',
                    onTap: () {
                      Navigator.pop(context);
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const MainCounterScreen(initialMode: 'unl')),
                      );
                    },
                  ),

                  // 3. Challan History
                  _buildNavItem(
                    context: context,
                    icon: Icons.receipt_long_outlined,
                    title: 'চালান ইতিহাস ও সার্চ',
                    subtitle: 'সকল আনলোডিং ও ডেলিভারি গেটপাস',
                    onTap: () {
                      Navigator.pop(context);
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const ChallanHistoryScreen()),
                      );
                    },
                  ),

                  const Divider(color: AppColors.lineDark, height: 18),

                  // 4. ERP Cloud Sync Hub
                  _buildNavItem(
                    context: context,
                    icon: Icons.cloud_sync_outlined,
                    title: 'মা মোটরস ইআরপি সিঙ্ক',
                    subtitle: 'শোরুম ও অফিসের সাথে সরাসরি সিঙ্ক',
                    iconColor: AppColors.load,
                    badgeText: 'সচল',
                    onTap: () {
                      Navigator.pop(context);
                      _openErpCloudSyncDialog(context);
                    },
                  ),

                  // 5. Staff Switcher & PIN Portal
                  _buildNavItem(
                    context: context,
                    icon: Icons.badge_outlined,
                    title: 'কর্মী পরিবর্তন ও লগইন',
                    subtitle: 'ইনচার্জ মোঃ এমরান / আলতাফ / ফারুক',
                    iconColor: const Color(0xFF38BDF8),
                    onTap: () {
                      Navigator.pop(context);
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const LoginScreen()),
                      );
                    },
                  ),

                  // 6. Google Drive Backup
                  _buildNavItem(
                    context: context,
                    icon: Icons.cloud_upload_outlined,
                    title: 'গুগল ড্রাইভ ব্যাকআপ',
                    subtitle: 'অফলাইন চালানের ব্যাকআপ কপি',
                    onTap: () {
                      Navigator.pop(context);
                      _openGoogleDriveDialog(context);
                    },
                  ),

                  const Divider(color: AppColors.lineDark, height: 18),

                  // 7. Super Admin Hub (PIN Protected: 7860)
                  _buildNavItem(
                    context: context,
                    icon: Icons.shield_outlined,
                    title: 'মালিকানা অ্যাডমিন হাব',
                    subtitle: 'ওমর ফারুক (পিন: ৭৮৬০)',
                    iconColor: const Color(0xFFFBBF24),
                    onTap: () {
                      Navigator.pop(context);
                      if (isSuperAdmin) {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const SuperAdminHubScreen()),
                        );
                      } else {
                        _openSuperAdminPinDialog(context, auth);
                      }
                    },
                  ),
                ],
              ),
            ),

            // Emergency / Owner Contact Card
            _buildContactAdminCard(context),

            // Footer
            Container(
              padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 14),
              decoration: const BoxDecoration(
                color: Color(0xFF091124),
                border: Border(top: BorderSide(color: Color(0xFF1E293B))),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'MAA MOTORS ERP • GODOWN-1',
                    style: TextStyle(color: Color(0xFF64748B), fontSize: 9.5, fontWeight: FontWeight.bold),
                  ),
                  Text(
                    'মুরাদপুর, চট্টগ্রাম',
                    style: TextStyle(color: Color(0xFF64748B), fontSize: 9.5),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDrawerHeader(BuildContext context, AuthProvider auth) {
    const badgeColor = AppColors.load;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: const BoxDecoration(
        color: Color(0xFF091124),
        border: Border(bottom: BorderSide(color: Color(0xFF1E293B))),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: badgeColor, width: 1.5),
            ),
            clipBehavior: Clip.antiAlias,
            child: Image.asset(
              'assets/images/app_logo.png',
              fit: BoxFit.cover,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'মেসার্স মা মোটরস',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.w900,
                    fontFamily: 'Hind Siliguri',
                  ),
                ),
                const SizedBox(height: 2),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: badgeColor.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    'কর্মী: ${auth.currentStaffName} (${auth.currentStaffRole})',
                    style: const TextStyle(color: badgeColor, fontSize: 10, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.close, color: Colors.white60, size: 20),
            onPressed: () => Navigator.pop(context),
          ),
        ],
      ),
    );
  }

  Widget _buildNavItem({
    required BuildContext context,
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
    Color? iconColor,
    String? badgeText,
  }) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      leading: Container(
        width: 38,
        height: 38,
        decoration: BoxDecoration(
          color: const Color(0xFF1E293B),
          borderRadius: BorderRadius.circular(10),
        ),
        alignment: Alignment.center,
        child: Icon(icon, color: iconColor ?? AppColors.unl, size: 20),
      ),
      title: Row(
        children: [
          Text(
            title,
            style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w700),
          ),
          if (badgeText != null) ...[
            const SizedBox(width: 6),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
              decoration: BoxDecoration(
                color: AppColors.load,
                borderRadius: BorderRadius.circular(4),
              ),
              child: Text(
                badgeText,
                style: const TextStyle(color: Colors.black, fontSize: 9, fontWeight: FontWeight.w900),
              ),
            ),
          ],
        ],
      ),
      subtitle: Text(
        subtitle,
        style: const TextStyle(color: AppColors.muDark, fontSize: 11),
      ),
      trailing: const Icon(Icons.chevron_right, color: Colors.white30, size: 18),
      onTap: onTap,
    );
  }

  Widget _buildContactAdminCard(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF0B192C),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.unl.withOpacity(0.3)),
      ),
      child: Row(
        children: [
          const Icon(Icons.phone_forwarded_outlined, color: AppColors.load, size: 22),
          const SizedBox(width: 10),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'মা মোটরস গোডাউন-১ সাপোর্ট',
                  style: TextStyle(color: Colors.white, fontSize: 11.5, fontWeight: FontWeight.bold),
                ),
                Text(
                  'ওমর ফারুক: 01819-397669',
                  style: TextStyle(color: AppColors.load, fontSize: 10.5, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.load,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              minimumSize: const Size(0, 30),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('কল করুন: 01819-397669 (প্রোপ্রাইটর: ওমর ফারুক)')),
              );
            },
            child: const Text('কল', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}
