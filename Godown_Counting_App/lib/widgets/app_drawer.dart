import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../screens/home_dashboard_screen.dart';
import '../screens/main_counter_screen.dart';
import '../screens/challan_history_screen.dart';
import '../screens/license_backup_screen.dart';
import '../services/customer_directory_service.dart';
import '../utils/app_colors.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  void _openCustomerDirectoryDialog(BuildContext context) async {
    final customers = await CustomerDirectoryService().getAllCustomers();
    if (!context.mounted) return;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF0F172A),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => DraggableScrollableSheet(
        initialChildSize: 0.7,
        maxChildSize: 0.95,
        minChildSize: 0.4,
        expand: false,
        builder: (_, scrollCtrl) => Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  margin: const EdgeInsets.only(bottom: 12),
                  decoration: BoxDecoration(
                    color: Colors.white24,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const Row(
                children: [
                  Icon(Icons.contact_phone_rounded, color: Color(0xFF38BDF8), size: 22),
                  SizedBox(width: 8),
                  Text(
                    'মা মোটরস কাস্টমার ও পরিবহন ডিরেক্টরি',
                    style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Expanded(
                child: ListView.separated(
                  controller: scrollCtrl,
                  itemCount: customers.length,
                  separatorBuilder: (_, __) => const Divider(color: Color(0xFF1E293B)),
                  itemBuilder: (_, idx) {
                    final c = customers[idx];
                    return Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: const Color(0xFF1E293B),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(c.name, style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
                              Text(c.phone, style: const TextStyle(color: Color(0xFF38BDF8), fontSize: 12, fontFamily: 'monospace')),
                            ],
                          ),
                          if (c.address.isNotEmpty) ...[
                            const SizedBox(height: 2),
                            Text(c.address, style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11)),
                          ],
                          if (c.vehicleNo.isNotEmpty) ...[
                            const SizedBox(height: 4),
                            Row(
                              children: [
                                const Icon(Icons.local_shipping_outlined, color: AppColors.load, size: 14),
                                const SizedBox(width: 4),
                                Text('গাড়ি: ${c.vehicleNo} ${c.driverName.isNotEmpty ? "(${c.driverName})" : ""}', style: const TextStyle(color: AppColors.load, fontSize: 11)),
                              ],
                            ),
                          ],
                        ],
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    return Drawer(
      backgroundColor: const Color(0xFF0F172A),
      child: SafeArea(
        child: Column(
          children: [
            // 1. Elegant Corporate Header
            _buildDrawerHeader(context, auth),

            // 2. Scrollable Clean Categorized Menu
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                children: [
                  // --- SECTION 1: WAREHOUSE OPERATIONS ---
                  _buildSectionLabel('ওয়্যারহাউজ অপারেশন (দৈনন্দিন কাজ)'),

                  // Home Dashboard
                  _buildNavItem(
                    context: context,
                    icon: Icons.dashboard_rounded,
                    title: 'হোম ড্যাশবোর্ড',
                    subtitle: 'আজকের হিসাব ও চালানের সারাংশ',
                    iconColor: const Color(0xFF38BDF8),
                    onTap: () {
                      Navigator.pop(context);
                      Navigator.pushAndRemoveUntil(
                        context,
                        MaterialPageRoute(builder: (_) => const HomeDashboardScreen()),
                        (r) => false,
                      );
                    },
                  ),

                  // Unloading Mode
                  _buildNavItem(
                    context: context,
                    icon: Icons.archive_rounded,
                    title: 'গাড়ি থেকে আনলোডিং (খালাস)',
                    subtitle: 'কন্টেইনার বা ট্রাক থেকে মাল গোডাউনে নিন',
                    iconColor: AppColors.unl,
                    onTap: () {
                      Navigator.pop(context);
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const MainCounterScreen(initialMode: 'unl')),
                      );
                    },
                  ),

                  // Loading Mode
                  _buildNavItem(
                    context: context,
                    icon: Icons.unarchive_rounded,
                    title: 'গাড়িতে ডেলিভারি (গেটপাস)',
                    subtitle: 'গুনে ডেলিভারি দিন ও সরাসরি গেটপাস করুন',
                    iconColor: AppColors.load,
                    onTap: () {
                      Navigator.pop(context);
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const MainCounterScreen(initialMode: 'load')),
                      );
                    },
                  ),

                  // Challan History & Search
                  _buildNavItem(
                    context: context,
                    icon: Icons.receipt_long_rounded,
                    title: 'চালান ইতিহাস ও সার্চ',
                    subtitle: 'সকল আনলোডিং ও ডেলিভারি চালান ও স্লিপ',
                    iconColor: const Color(0xFF60A5FA),
                    onTap: () {
                      Navigator.pop(context);
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const ChallanHistoryScreen()),
                      );
                    },
                  ),

                  const SizedBox(height: 12),
                  const Divider(color: Color(0xFF1E293B), height: 1),
                  const SizedBox(height: 12),

                  // --- SECTION 2: LOGISTICS & DATA ---
                  _buildSectionLabel('লজিস্টিকস ও ডাটা সিঙ্ক'),

                  // Customer Directory
                  _buildNavItem(
                    context: context,
                    icon: Icons.contact_phone_rounded,
                    title: 'কাস্টমার ও পরিবহন তালিকা',
                    subtitle: 'নিয়মিত পার্টি, গাড়ি নম্বর ও চালকের ফোন',
                    iconColor: const Color(0xFF34D399),
                    onTap: () {
                      Navigator.pop(context);
                      _openCustomerDirectoryDialog(context);
                    },
                  ),

                  // ERP Cloud Sync & Backup Hub
                  _buildNavItem(
                    context: context,
                    icon: Icons.cloud_sync_rounded,
                    title: 'ক্লাউড সিঙ্ক ও ব্যাকআপ হাব',
                    subtitle: 'মা মোটরস ইআরপি ও গুগল ড্রাইভ ব্যাকআপ',
                    iconColor: const Color(0xFFA78BFA),
                    badgeText: 'সচল',
                    onTap: () {
                      Navigator.pop(context);
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const LicenseBackupScreen()),
                      );
                    },
                  ),
                ],
              ),
            ),

            // 3. Emergency / Owner Contact Card
            _buildContactAdminCard(context),

            // 4. Institutional Footer
            Container(
              padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
              decoration: const BoxDecoration(
                color: Color(0xFF091124),
                border: Border(top: BorderSide(color: Color(0xFF1E293B))),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'MAA MOTORS ERP • GODOWN-1',
                    style: TextStyle(color: Color(0xFF64748B), fontSize: 10, fontWeight: FontWeight.bold),
                  ),
                  Text(
                    'মুরাদপুর, চট্টগ্রাম',
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

  Widget _buildSectionLabel(String label) {
    return Padding(
      padding: const EdgeInsets.only(left: 4, bottom: 8),
      child: Text(
        label,
        style: const TextStyle(
          color: Color(0xFF64748B),
          fontSize: 11,
          fontWeight: FontWeight.bold,
          letterSpacing: 0.5,
        ),
      ),
    );
  }

  Widget _buildDrawerHeader(BuildContext context, AuthProvider auth) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: const BoxDecoration(
        color: Color(0xFF091124),
        border: Border(bottom: BorderSide(color: Color(0xFF1E293B))),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              // Corporate Automotive Warehouse Vector Emblem (No third-party logo)
              Container(
                width: 46,
                height: 46,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF0284C7), Color(0xFF059669)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFF38BDF8), width: 1.5),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF0284C7).withOpacity(0.3),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: const Icon(
                  Icons.warehouse_rounded,
                  color: Colors.white,
                  size: 26,
                ),
              ),
              const SizedBox(width: 12),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'মেসার্স মা মোটরস',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 17,
                        fontWeight: FontWeight.w900,
                        fontFamily: 'Hind Siliguri',
                      ),
                    ),
                    SizedBox(height: 2),
                    Text(
                      'গোডাউন-১ • মুরাদপুর, চট্টগ্রাম',
                      style: TextStyle(
                        color: Color(0xFF38BDF8),
                        fontSize: 11.5,
                        fontWeight: FontWeight.bold,
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
          const SizedBox(height: 12),

          // Active Staff Shift Info Pill
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: const Color(0xFF1E293B),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: const Color(0xFF334155)),
            ),
            child: Row(
              children: [
                Container(
                  width: 8,
                  height: 8,
                  decoration: const BoxDecoration(
                    color: Color(0xFF10B981), // Live Green
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'দায়িত্বে: ${auth.currentStaffName} (${auth.currentStaffRole})',
                    style: const TextStyle(
                      color: Color(0xFFE2E8F0),
                      fontSize: 11.5,
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: const Color(0xFF10B981).withOpacity(0.15),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: const Text(
                    'সক্রিয়',
                    style: TextStyle(color: Color(0xFF34D399), fontSize: 10.5, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
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
    Color iconColor = AppColors.load,
    String? badgeText,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 6),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B).withOpacity(0.4),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFF1E293B)),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 2),
        leading: Container(
          width: 38,
          height: 38,
          decoration: BoxDecoration(
            color: iconColor.withOpacity(0.12),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: iconColor, size: 20),
        ),
        title: Row(
          children: [
            Expanded(
              child: Text(
                title,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 13.5,
                  fontWeight: FontWeight.w700,
                  fontFamily: 'Hind Siliguri',
                ),
              ),
            ),
            if (badgeText != null) ...[
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                decoration: BoxDecoration(
                  color: const Color(0xFF10B981).withOpacity(0.2),
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: const Color(0xFF10B981), width: 0.8),
                ),
                child: Text(
                  badgeText,
                  style: const TextStyle(
                    color: Color(0xFF34D399),
                    fontSize: 9.5,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ],
        ),
        subtitle: Text(
          subtitle,
          style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        trailing: const Icon(Icons.chevron_right_rounded, color: Colors.white24, size: 18),
        onTap: onTap,
      ),
    );
  }

  Widget _buildContactAdminCard(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF091124),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFF334155)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.support_agent_rounded, color: Color(0xFFFBBF24), size: 18),
              SizedBox(width: 8),
              Text(
                'মা মোটরস অফিস সহায়তা',
                style: TextStyle(color: Colors.white, fontSize: 12.5, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          const SizedBox(height: 4),
          const Text(
            'অফিস: ০১৮১৯-৩৯৭৬৬৯, ০১৮১৫-৭০৭৯৩৪',
            style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: InkWell(
                  onTap: () {
                    Clipboard.setData(const ClipboardData(text: '01819397669'));
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('অফিস নম্বর কপি হয়েছে (01819-397669)')),
                    );
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 6),
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E293B),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: const Color(0xFF475569)),
                    ),
                    child: const Text('নম্বর কপি', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 6),
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: const Color(0xFF0284C7).withOpacity(0.2),
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: const Color(0xFF0284C7)),
                  ),
                  child: const Text('সরাসরি কল', style: TextStyle(color: Color(0xFF38BDF8), fontSize: 11, fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
