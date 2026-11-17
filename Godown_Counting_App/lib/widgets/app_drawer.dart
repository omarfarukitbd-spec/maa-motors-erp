import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/tenant_model.dart';
import '../providers/auth_provider.dart';
import '../screens/home_dashboard_screen.dart';
import '../screens/main_counter_screen.dart';
import '../screens/challan_history_screen.dart';
import '../screens/shop_banner_studio_screen.dart';
import '../screens/license_backup_screen.dart';
import '../screens/login_screen.dart';
import '../screens/super_admin_hub_screen.dart';
import '../services/drive_backup_service.dart';
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
            Text('সুপার অ্যাডমিন সিকিউরিটি', style: TextStyle(color: Colors.white, fontSize: 16)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'মাস্টার অ্যাডমিন পিন (PIN) লিখুন:',
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
                    content: Text('ভুল সিকিউরিটি পিন!'),
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
              'আপনার গোডাউনের সমস্ত হিসাব ও চালানের অফলাইন কপি গুগল ড্রাইভে নিরাপদ ব্যাকআপ থাকবে।',
              style: TextStyle(color: AppColors.muDark, fontSize: 13),
            ),
            SizedBox(height: 12),
            Text(
              'ব্যাকআপ স্ট্যাটাস: অফলাইন সুরক্ষিত',
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
              await DriveBackupService.performBackup('omarfarukitbd@gmail.com');
              if (context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    backgroundColor: AppColors.load,
                    content: Text('গুগল ড্রাইভ ব্যাকআপ মেটাডাটা সিঙ্ক সম্পন্ন!'),
                  ),
                );
              }
            },
            icon: const Icon(Icons.sync, size: 16),
            label: const Text('সিঙ্ক করুন'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final isSuperAdmin = auth.isSuperAdmin;
    final isPro = auth.hasChallanAccess;

    return Drawer(
      backgroundColor: const Color(0xFF0F172A),
      child: SafeArea(
        child: Column(
          children: [
            // Header Profile Card
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
                    subtitle: 'আজকের হিসাব ও মূল সারাংশ',
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
                    subtitle: 'গাড়ি থেকে নামানো ও মাল তোলা',
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
                    subtitle: 'সকল আনলোডিং ও ডেলিভারি চালান',
                    onTap: () {
                      Navigator.pop(context);
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const ChallanHistoryScreen()),
                      );
                    },
                  ),

                  const Divider(color: AppColors.lineDark, height: 18),

                  // 4. Shop Heading & Banner Studio (Premium Highlight)
                  _buildNavItem(
                    context: context,
                    icon: Icons.palette_outlined,
                    title: 'দোকান হেডিং ও ব্যানার স্টুডিও',
                    subtitle: 'নাম, কালার ও নিজস্ব ব্যানার ডিজাইন',
                    iconColor: const Color(0xFFFBBF24),
                    badgeText: 'প্রিমিয়াম',
                    onTap: () {
                      Navigator.pop(context);
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const ShopBannerStudioScreen()),
                      );
                    },
                  ),

                  // 5. License & Staff Pairing
                  _buildNavItem(
                    context: context,
                    icon: Icons.qr_code_2_outlined,
                    title: 'লাইসেন্স ও স্টাফ পেয়ারিং',
                    subtitle: 'কর্মীর ফোন যুক্তকরণ ও চালান যাচাই',
                    onTap: () {
                      Navigator.pop(context);
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const LicenseBackupScreen()),
                      );
                    },
                  ),

                  // 6. Google Drive Backup
                  _buildNavItem(
                    context: context,
                    icon: Icons.cloud_upload_outlined,
                    title: 'গুগল ড্রাইভ ব্যাকআপ',
                    subtitle: 'অফলাইন ডেটা ক্লাউড সুরক্ষা',
                    onTap: () {
                      Navigator.pop(context);
                      _openGoogleDriveDialog(context);
                    },
                  ),

                  const Divider(color: AppColors.lineDark, height: 18),

                  // 7. Login / Account Switcher
                  _buildNavItem(
                    context: context,
                    icon: Icons.account_circle_outlined,
                    title: 'লগইন ও শপ লাইসেন্স পোর্টাল',
                    subtitle: 'গুগল, অ্যাপল ও লাইসেন্স কোড এন্ট্রি',
                    onTap: () {
                      Navigator.pop(context);
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const LoginScreen()),
                      );
                    },
                  ),

                  // 8. Super Admin Hub (PIN Protected)
                  _buildNavItem(
                    context: context,
                    icon: Icons.shield_outlined,
                    title: 'সুপার অ্যাডমিন হাব',
                    subtitle: 'ওমর ফারুক (মাস্টার কন্ট্রোল পিন)',
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

            // Contact Super Admin CTA Card
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
                    'গোডাউন কাউন্টার SaaS',
                    style: TextStyle(color: Color(0xFF64748B), fontSize: 10, fontWeight: FontWeight.bold),
                  ),
                  Text(
                    'v1.2.0 • ক্লাউড ও অফলাইন',
                    style: TextStyle(color: Color(0xFF64748B), fontSize: 10),
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
    final statusText = auth.isSuperAdmin
        ? 'সুপার অ্যাডমিন • মাস্টার কন্ট্রোল'
        : auth.hasChallanAccess
            ? 'সক্রিয় লাইসেন্স • প্রিমিয়াম চালান'
            : 'ফ্রি ইউজার • সাধারণ কাউন্টার';

    final badgeColor = auth.isSuperAdmin
        ? const Color(0xFFFBBF24)
        : auth.hasChallanAccess
            ? AppColors.load
            : AppColors.unl;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: const BoxDecoration(
        color: Color(0xFF091124),
        border: Border(bottom: BorderSide(color: Color(0xFF1E293B))),
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: badgeColor.withOpacity(0.15),
              shape: BoxShape.circle,
              border: Border.all(color: badgeColor, width: 1.5),
            ),
            alignment: Alignment.center,
            child: Icon(
              auth.isSuperAdmin ? Icons.workspace_premium : Icons.storefront,
              color: badgeColor,
              size: 22,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  auth.shopDisplayName,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 15,
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
                    statusText,
                    style: TextStyle(color: badgeColor, fontSize: 9.5, fontWeight: FontWeight.bold),
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
                color: const Color(0xFFFBBF24),
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
                  'প্রিমিয়াম লাইসেন্স ও সহায়তা',
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
                const SnackBar(content: Text('কল করুন: 01819-397669 (ওমর ফারুক)')),
              );
            },
            child: const Text('কল', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}
