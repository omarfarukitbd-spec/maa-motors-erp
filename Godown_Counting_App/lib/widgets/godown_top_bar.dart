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
  final Widget? actionWidget;

  const GodownTopBar({
    super.key,
    required this.title,
    this.onHomePressed,
    this.isHome = false,
    this.onThemeToggle,
    this.isLightMode = false,
    required this.audioEngine,
    required this.onSoundToggled,
    this.actionWidget,
  });

  @override
  Size get preferredSize => const Size.fromHeight(68);

  @override
  Widget build(BuildContext context) {
    final titleColor = isLightMode ? const Color(0xFF0F172A) : Colors.white;
    final subColor = isLightMode ? const Color(0xFF0284C7) : const Color(0xFF38BDF8);

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
              child: isHome
                  ? Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'মেসার্স মা মোটরস',
                          style: TextStyle(
                            color: titleColor,
                            fontSize: 17,
                            fontWeight: FontWeight.w900,
                            fontFamily: 'Hind Siliguri',
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        Text(
                          'গোডাউন-১ • মুরাদপুর, চট্টগ্রাম',
                          style: TextStyle(
                            color: subColor,
                            fontSize: 11.5,
                            fontWeight: FontWeight.w700,
                            fontFamily: 'Hind Siliguri',
                          ),
                        ),
                      ],
                    )
                  : Text(
                      title,
                      style: TextStyle(
                        color: isLightMode ? AppColors.txLight : AppColors.txDark,
                        fontSize: 17.5,
                        fontWeight: FontWeight.w800,
                        fontFamily: 'Hind Siliguri',
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
            ),

            // Optional Custom Action Widget (e.g. Create Challan Pill Button)
            if (actionWidget != null) ...[
              actionWidget!,
              const SizedBox(width: 8),
            ],

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
                  ? (isLightMode ? const Color(0xFF0F172A) : AppColors.unl)
                  : AppColors.dng,
              onTap: () {
                audioEngine.toggleSound();
                onSoundToggled();
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    backgroundColor: const Color(0xFF1E293B),
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
      width: 44,
      height: 44,
      decoration: BoxDecoration(
        color: isLightMode ? AppColors.s1Light : AppColors.s1Dark,
        borderRadius: BorderRadius.circular(12),
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
