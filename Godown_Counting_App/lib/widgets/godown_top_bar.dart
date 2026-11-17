import 'package:flutter/material.dart';
import '../services/audio_engine_service.dart';
import '../utils/app_colors.dart';

class GodownTopBar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final VoidCallback? onHomePressed;
  final bool isHome;
  final VoidCallback? onThemeToggle;
  final bool isLightMode;
  final AudioEngineService audioEngine;
  final VoidCallback onSoundToggled;

  const GodownTopBar({
    super.key,
    required this.title,
    this.onHomePressed,
    this.isHome = false,
    this.onThemeToggle,
    this.isLightMode = false,
    required this.audioEngine,
    required this.onSoundToggled,
  });

  @override
  Size get preferredSize => const Size.fromHeight(68);

  @override
  Widget build(BuildContext context) {
    return Container(
      color: isLightMode ? AppColors.bgLight : AppColors.bgDark,
      padding: const EdgeInsets.only(left: 14, right: 14, top: 10, bottom: 8),
      child: SafeArea(
        bottom: false,
        child: Row(
          children: [
            // Menu (Drawer) / Back Icon Button
            Builder(
              builder: (ctx) => _buildIconButton(
                icon: isHome ? Icons.menu : Icons.arrow_back_ios_new,
                tooltip: isHome ? 'মেনু' : 'পিছনে যান',
                onTap: onHomePressed ??
                    (isHome
                        ? () => Scaffold.of(ctx).openDrawer()
                        : () => Navigator.maybePop(ctx)),
              ),
            ),
            const SizedBox(width: 10),

            // Title
            Expanded(
              child: Text(
                title,
                style: TextStyle(
                  color: isLightMode ? AppColors.txLight : AppColors.txDark,
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  fontFamily: 'Hind Siliguri',
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),

            // Theme Toggle Button
            if (onThemeToggle != null) ...[
              _buildIconButton(
                icon: isLightMode ? Icons.dark_mode_outlined : Icons.light_mode_outlined,
                tooltip: isLightMode ? 'ডার্ক মোড' : 'রোদ মোড',
                onTap: onThemeToggle,
              ),
              const SizedBox(width: 8),
            ],

            // Sound Toggle Button
            _buildIconButton(
              icon: audioEngine.isSoundEnabled ? Icons.volume_up_outlined : Icons.volume_off_outlined,
              tooltip: audioEngine.isSoundEnabled ? 'আওয়াজ চালু' : 'শুধু কম্পন',
              iconColor: audioEngine.isSoundEnabled
                  ? (isLightMode ? AppColors.txLight : AppColors.unl)
                  : AppColors.dng,
              onTap: () {
                audioEngine.toggleSound();
                onSoundToggled();
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    backgroundColor: const Color(0xFF262D34),
                    duration: const Duration(milliseconds: 1400),
                    content: Text(
                      audioEngine.isSoundEnabled
                          ? 'আওয়াজ চালু (ইংরেজি ১-১০০০)'
                          : 'শুধু কম্পন চালু (নিঃশব্দ)',
                      style: const TextStyle(color: Colors.white, fontSize: 13),
                    ),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildIconButton({
    required IconData icon,
    required String tooltip,
    required VoidCallback? onTap,
    Color? iconColor,
  }) {
    return Container(
      width: 46,
      height: 46,
      decoration: BoxDecoration(
        color: isLightMode ? AppColors.s1Light : AppColors.s1Dark,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: isLightMode ? AppColors.lineLight : AppColors.lineDark,
          width: 1.5,
        ),
      ),
      child: IconButton(
        padding: EdgeInsets.zero,
        icon: Icon(
          icon,
          size: 20,
          color: iconColor ?? (isLightMode ? AppColors.txLight : AppColors.txDark),
        ),
        tooltip: tooltip,
        onPressed: onTap,
      ),
    );
  }
}
