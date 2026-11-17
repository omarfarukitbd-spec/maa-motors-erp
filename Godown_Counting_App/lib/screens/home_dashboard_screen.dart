import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/counting_provider.dart';
import '../services/audio_engine_service.dart';
import '../utils/app_colors.dart';
import '../utils/bangla_tools.dart';
import '../widgets/godown_top_bar.dart';
import 'main_counter_screen.dart';
import 'challan_history_screen.dart';
import 'license_backup_screen.dart';
import 'challan_view_screen.dart';

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
                'চালান: ${BanglaTools.toBanglaDigits(totalChallans > 0 ? totalChallans : 3)}টি · মোট মাল: ${BanglaTools.toBanglaDigits(totalPcs > 0 ? totalPcs : 420)} পিস',
                style: const TextStyle(
                  color: AppColors.muDark,
                  fontSize: 14.5,
                  fontWeight: FontWeight.w500,
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
                      label: 'লাইসেন্স ও ব্যাকআপ',
                      icon: Icons.verified_user_outlined,
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const LicenseBackupScreen(),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),

              // Demo Challan Link
              Center(
                child: TextButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const ChallanViewScreen(isDemoSample: true),
                      ),
                    );
                  },
                  child: const Text(
                    'নমুনা চালান দেখুন',
                    style: TextStyle(
                      color: AppColors.muDark,
                      fontSize: 15,
                      decoration: TextDecoration.underline,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 10),
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
