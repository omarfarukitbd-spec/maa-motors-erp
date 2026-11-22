import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/counting_provider.dart';
import '../services/audio_engine_service.dart';
import '../utils/app_colors.dart';
import '../utils/bangla_tools.dart';
import '../widgets/godown_top_bar.dart';
import '../widgets/app_drawer.dart';
import 'main_counter_screen.dart';
import 'challan_history_screen.dart';
import 'login_screen.dart';
import '../services/customer_directory_service.dart';

class HomeDashboardScreen extends StatefulWidget {
  const HomeDashboardScreen({super.key});

  @override
  State<HomeDashboardScreen> createState() => _HomeDashboardScreenState();
}

class _HomeDashboardScreenState extends State<HomeDashboardScreen> {
  final AudioEngineService _audio = AudioEngineService();
  bool _isLightMode = false;

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final counting = context.watch<CountingProvider>();

    final totalChallans = counting.sessionHistory.length;
    final totalPcs = counting.sessionHistory.fold<int>(
      0,
      (sum, c) => sum + c.totalPcs,
    );

    return Scaffold(
      backgroundColor: _isLightMode ? AppColors.bgLight : AppColors.bgDark,
      drawer: const AppDrawer(),
      appBar: GodownTopBar(
        title: auth.shopDisplayName,
        isHome: true,
        isLightMode: _isLightMode,
        audioEngine: _audio,
        onThemeToggle: () {
          setState(() => _isLightMode = !_isLightMode);
        },
        onSoundToggled: () => setState(() {}),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Today's Stats
              Text(
                'আজকের হিসাব',
                style: TextStyle(
                  color: _isLightMode ? AppColors.txLight : AppColors.txDark,
                  fontSize: 26,
                  fontWeight: FontWeight.w800,
                  fontFamily: 'Hind Siliguri',
                ),
              ),
              const SizedBox(height: 2),
              Text(
                totalChallans > 0
                    ? 'চালান: ${BanglaTools.toBanglaDigits(totalChallans)}টি · মোট মাল: ${BanglaTools.toBanglaDigits(totalPcs)} পিস'
                    : 'আজকে এখনো কোনো চালান তৈরি হয়নি',
                style: const TextStyle(
                  color: AppColors.muDark,
                  fontSize: 14.5,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 10),

              // Active Logged In Staff Badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: _isLightMode ? AppColors.s1Light : AppColors.s1Dark,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: _isLightMode ? AppColors.lineLight : const Color(0xFF334155),
                    width: 1,
                  ),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.badge_outlined, color: AppColors.load, size: 20),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'কর্মরত: ${auth.currentStaffName} (${auth.currentStaffRole})',
                        style: TextStyle(
                          color: _isLightMode ? AppColors.txLight : Colors.white,
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          fontFamily: 'Hind Siliguri',
                        ),
                      ),
                    ),
                    InkWell(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const LoginScreen()),
                        );
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.load.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: const Text(
                          'পরিবর্তন',
                          style: TextStyle(
                            color: AppColors.load,
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const Spacer(),

              // 1. Unloading Hero Card (গাড়ি থেকে নামানো)
              _buildModeHeroCard(
                mode: 'unl',
                title: 'গাড়ি থেকে নামানো',
                subtitle: 'মাল গুনে গোডাউনে নিন',
                icon: Icons.archive_outlined,
                bgColor: AppColors.unl,
                onTap: () {
                  _audio.triggerHaptic();
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => const MainCounterScreen(initialMode: 'unl'),
                    ),
                  );
                },
              ),
              const SizedBox(height: 14),

              // 2. Loading Hero Card (গাড়িতে মাল তোলা)
              _buildModeHeroCard(
                mode: 'load',
                title: 'গাড়িতে মাল তোলা',
                subtitle: 'গুনে ডেলিভারি দিন',
                icon: Icons.unarchive_outlined,
                bgColor: AppColors.load,
                onTap: () {
                  _audio.triggerHaptic();
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => const MainCounterScreen(initialMode: 'load'),
                    ),
                  );
                },
              ),
              const Spacer(),

              // Secondary Navigation Buttons Row
              Row(
                children: [
                  Expanded(
                    child: _buildSecondaryButton(
                      label: 'চালান ইতিহাস',
                      icon: Icons.history,
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const ChallanHistoryScreen(),
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildSecondaryButton(
                      label: 'কাস্টমার তালিকা',
                      icon: Icons.contact_phone_outlined,
                      onTap: () => _openCustomerDirectoryDialog(context),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),

              // Bottom Brand Banner
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                decoration: BoxDecoration(
                  color: const Color(0xFF091124),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: const Color(0xFF1E293B)),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.warehouse_outlined, color: Color(0xFF34D399), size: 16),
                    SizedBox(width: 8),
                    Text(
                      'মেসার্স মা মোটরস • গোডাউন-১, মুরাদপুর • ০১8১৯-৩৯৭৬৬৯',
                      style: TextStyle(
                        color: Color(0xFF94A3B8),
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 6),
            ],
          ),
        ),
      ),
    );
  }

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
        initialChildSize: 0.65,
        maxChildSize: 0.9,
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
                  Icon(Icons.contact_phone, color: AppColors.load, size: 22),
                  SizedBox(width: 8),
                  Text(
                    'মা মোটরস কাস্টমার ও শোরুম ডিরেক্টরি',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 4),
              const Text(
                'গোডাউনের চালানে নিয়মিত ব্যবহৃত কাস্টমার, শোরুম ও তাদের নিয়মিত গাড়ির তালিকা',
                style: TextStyle(color: AppColors.muDark, fontSize: 12),
              ),
              const Divider(color: AppColors.lineDark, height: 20),
              Expanded(
                child: ListView.separated(
                  controller: scrollCtrl,
                  itemCount: customers.length,
                  separatorBuilder: (_, __) => const Divider(color: AppColors.lineDark, height: 12),
                  itemBuilder: (context, idx) {
                    final c = customers[idx];
                    return ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: const Color(0xFF1E293B),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        alignment: Alignment.center,
                        child: const Icon(Icons.storefront, color: AppColors.load, size: 20),
                      ),
                      title: Text(
                        c.name,
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          if (c.phone.isNotEmpty)
                            Text('ফোন: ${c.phone}', style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12)),
                          if (c.address.isNotEmpty)
                            Text('ঠিকানা: ${c.address}', style: const TextStyle(color: AppColors.muDark, fontSize: 11.5)),
                          if (c.vehicleNo.isNotEmpty)
                            Text('নিয়মিত গাড়ি: ${c.vehicleNo}', style: const TextStyle(color: Color(0xFF38BDF8), fontSize: 11.5)),
                        ],
                      ),
                      trailing: IconButton(
                        icon: const Icon(Icons.phone, color: AppColors.load, size: 20),
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text('কল করুন: ${c.phone} (${c.name})')),
                          );
                        },
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

  Widget _buildModeHeroCard({
    required String mode,
    required String title,
    required String subtitle,
    required IconData icon,
    required Color bgColor,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 22),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: bgColor.withOpacity(0.25),
              blurRadius: 15,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: Row(
          children: [
            Icon(icon, size: 42, color: AppColors.textOnAccent),
            const SizedBox(width: 18),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      color: AppColors.textOnAccent,
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                      fontFamily: 'Hind Siliguri',
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: TextStyle(
                      color: AppColors.textOnAccent.withOpacity(0.85),
                      fontSize: 14.5,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSecondaryButton({
    required String label,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        height: 56,
        padding: const EdgeInsets.symmetric(horizontal: 10),
        decoration: BoxDecoration(
          color: _isLightMode ? AppColors.s1Light : AppColors.s1Dark,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: _isLightMode ? AppColors.lineLight : AppColors.lineDark,
            width: 1.5,
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 18, color: _isLightMode ? AppColors.txLight : AppColors.txDark),
            const SizedBox(width: 8),
            Text(
              label,
              style: TextStyle(
                color: _isLightMode ? AppColors.txLight : AppColors.txDark,
                fontSize: 14,
                fontWeight: FontWeight.w600,
                fontFamily: 'Hind Siliguri',
              ),
            ),
          ],
        ),
      ),
    );
  }
}
