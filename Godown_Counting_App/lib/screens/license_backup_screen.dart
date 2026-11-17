import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/tenant_model.dart';
import '../providers/auth_provider.dart';
import '../providers/counting_provider.dart';
import '../services/drive_backup_service.dart';
import '../utils/app_colors.dart';
import '../utils/bangla_tools.dart';
import '../widgets/godown_top_bar.dart';
import '../services/audio_engine_service.dart';

class LicenseBackupScreen extends StatefulWidget {
  const LicenseBackupScreen({super.key});

  @override
  State<LicenseBackupScreen> createState() => _LicenseBackupScreenState();
}

class _LicenseBackupScreenState extends State<LicenseBackupScreen> {
  final AudioEngineService _audio = AudioEngineService();
  final DriveBackupService _driveBackup = DriveBackupService();
  final TextEditingController _verifyCtrl = TextEditingController();

  bool _showQrCard = false;
  int _qrCountdown = 60;
  Timer? _qrTimer;
  bool _staffCanPrint = true;

  String? _verificationResult;

  @override
  void dispose() {
    _qrTimer?.cancel();
    _verifyCtrl.dispose();
    super.dispose();
  }

  void _generateStaffQr() {
    setState(() {
      _showQrCard = true;
      _qrCountdown = 60;
    });
    _qrTimer?.cancel();
    _qrTimer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (_qrCountdown > 1) {
        setState(() => _qrCountdown--);
      } else {
        t.cancel();
        setState(() => _qrCountdown = 0);
      }
    });
  }

  void _verifyChallanCode(CountingProvider counting) {
    final code = _verifyCtrl.text.trim().toUpperCase();
    if (code.isEmpty) return;

    final matched = counting.sessionHistory.cast<dynamic>().firstWhere(
          (c) => c.verificationCode == code,
          orElse: () => null,
        );

    setState(() {
      if (matched != null) {
        _verificationResult =
            'আসল চালান: ${matched.displayChallanNo}${matched.revisionNumber > 0 ? " (সংশোধিত ${BanglaTools.toBanglaDigits(matched.revisionNumber)})" : ""}';
      } else {
        _verificationResult = 'মিলছে না। চালানটি সন্দেহজনক বা এই গোডাউনের নয়।';
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final counting = context.watch<CountingProvider>();
    final tenant = auth.currentTenant;

    Color licColor = AppColors.unl;
    String licText = 'সচল';
    if (auth.isSoftLocked) {
      licColor = AppColors.dng;
      licText = 'সফট-লক';
    } else if (auth.isInGracePeriod) {
      licColor = AppColors.load;
      licText = 'গ্রেস';
    }

    return Scaffold(
      backgroundColor: AppColors.bgDark,
      appBar: GodownTopBar(
        title: 'লাইসেন্স ও ব্যাকআপ',
        audioEngine: _audio,
        onSoundToggled: () => setState(() {}),
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          children: [
            // 1. License Card
            const Text(
              'লাইসেন্স',
              style: TextStyle(
                color: AppColors.txDark,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 6),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.s1Dark,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.lineDark),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('অবস্থা', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15)),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 3),
                        decoration: BoxDecoration(
                          color: licColor,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          licText,
                          style: const TextStyle(color: AppColors.textOnAccent, fontWeight: FontWeight.bold, fontSize: 13),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'মেয়াদ: ১২ ডিসেম্বর ২০২৬ · ডিভাইস: ১/${BanglaTools.toBanglaDigits(tenant?.deviceLimit ?? 3)}',
                    style: const TextStyle(color: AppColors.muDark, fontSize: 13),
                  ),
                  const SizedBox(height: 10),
                  // Segmented switch
                  Row(
                    children: [
                      _segBtn('সচল', !auth.isSoftLocked && !auth.isInGracePeriod, () {
                        if (tenant != null) auth.setTenantLicenseState(tenant.id, LicenseState.active);
                      }),
                      const SizedBox(width: 6),
                      _segBtn('গ্রেস', auth.isInGracePeriod, () {
                        if (tenant != null) auth.setTenantLicenseState(tenant.id, LicenseState.grace);
                      }),
                      const SizedBox(width: 6),
                      _segBtn('সফট-লক', auth.isSoftLocked, () {
                        if (tenant != null) auth.setTenantLicenseState(tenant.id, LicenseState.softLock);
                      }),
                    ],
                  ),
                  const SizedBox(height: 6),
                  const Text('ডেমোর জন্য অবস্থা বদলে দেখতে পারেন', style: TextStyle(color: AppColors.muDark, fontSize: 11.5)),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // 2. Devices & Staff
            const Text(
              'ডিভাইস ও স্টাফ',
              style: TextStyle(
                color: AppColors.txDark,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 6),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.s1Dark,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.lineDark),
              ),
              child: Column(
                children: [
                  _deviceRow('এই ফোন (অ্যাডমিন)', 'কোড A1', 'এই ফোন'),
                  const Divider(color: AppColors.lineDark, height: 16),
                  _deviceRow('স্টাফ ফোন ১', 'কোড S1', 'সক্রিয়'),
                ],
              ),
            ),
            const SizedBox(height: 10),

            // Staff QR Button
            SizedBox(
              height: 50,
              child: OutlinedButton.icon(
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: AppColors.lineDark, width: 1.5),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  backgroundColor: AppColors.s2Dark,
                  foregroundColor: AppColors.txDark,
                ),
                icon: const Icon(Icons.qr_code, size: 20, color: AppColors.unl),
                label: const Text('স্টাফ QR তৈরি করুন', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
                onPressed: _generateStaffQr,
              ),
            ),

            // Staff QR Card (if opened)
            if (_showQrCard) ...[
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.s1Dark,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.unl),
                ),
                child: Column(
                  children: [
                    Container(
                      width: 170,
                      height: 170,
                      color: Colors.white,
                      alignment: Alignment.center,
                      child: const Icon(Icons.qr_code_2, size: 150, color: Colors.black),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      _qrCountdown > 0
                          ? 'মেয়াদ ${BanglaTools.toBanglaDigits(_qrCountdown)} সেকেন্ড · একবার ব্যবহারযোগ্য'
                          : 'মেয়াদ শেষ। নতুন QR তৈরি করুন',
                      style: TextStyle(
                        color: _qrCountdown > 0 ? AppColors.unl : AppColors.dng,
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 10),
                    CheckboxListTile(
                      contentPadding: EdgeInsets.zero,
                      title: const Text('চালান প্রিন্টের অনুমতি', style: TextStyle(color: Colors.white, fontSize: 13.5)),
                      value: _staffCanPrint,
                      onChanged: (val) => setState(() => _staffCanPrint = val ?? true),
                    ),
                  ],
                ),
              ),
            ],
            const SizedBox(height: 16),

            // 3. Backup Card
            const Text(
              'গুগল ড্রাইভ ব্যাকআপ',
              style: TextStyle(
                color: AppColors.txDark,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 6),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.s1Dark,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.lineDark),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.cloud_done, color: AppColors.unl, size: 20),
                      SizedBox(width: 8),
                      Text('Google Drive ব্যাকআপ চালু', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                    ],
                  ),
                  const SizedBox(height: 4),
                  const Text('ডেটা আপনার Google Drive-এর লুকানো ফোল্ডারে সুরক্ষিত থাকে।', style: TextStyle(color: AppColors.muDark, fontSize: 12)),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.unl,
                            foregroundColor: AppColors.textOnAccent,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('গুগল ড্রাইভে ব্যাকআপ সম্পন্ন হয়েছে!')),
                            );
                          },
                          child: const Text('এখনই ব্যাকআপ', style: TextStyle(fontWeight: FontWeight.bold)),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: OutlinedButton(
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: AppColors.lineDark),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('ব্যাকআপ থেকে সব চালান রিস্টোর করা হয়েছে!')),
                            );
                          },
                          child: const Text('রিস্টোর করুন', style: TextStyle(color: AppColors.txDark)),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // 4. Challan Verification Card
            const Text(
              'চালান যাচাই',
              style: TextStyle(
                color: AppColors.txDark,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 6),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.s1Dark,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.lineDark),
              ),
              child: Column(
                children: [
                  TextField(
                    controller: _verifyCtrl,
                    style: const TextStyle(color: Colors.white, fontSize: 15),
                    decoration: InputDecoration(
                      hintText: 'যাচাই কোড লিখুন (যেমন: 7K4X92)',
                      hintStyle: const TextStyle(color: AppColors.muDark, fontSize: 13),
                      filled: true,
                      fillColor: AppColors.s2Dark,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                      isDense: true,
                    ),
                  ),
                  const SizedBox(height: 8),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.unl,
                        foregroundColor: AppColors.textOnAccent,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      onPressed: () => _verifyChallanCode(counting),
                      child: const Text('যাচাই করুন', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ),
                  if (_verificationResult != null) ...[
                    const SizedBox(height: 8),
                    Text(
                      _verificationResult!,
                      style: TextStyle(
                        color: _verificationResult!.contains('আসল') ? AppColors.unl : AppColors.dng,
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ],
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _segBtn(String label, bool isSelected, VoidCallback onTap) {
    return Expanded(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(10),
        child: Container(
          height: 42,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: isSelected ? AppColors.unl : AppColors.s2Dark,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: isSelected ? AppColors.unl : AppColors.lineDark),
          ),
          child: Text(
            label,
            style: TextStyle(
              color: isSelected ? AppColors.textOnAccent : AppColors.txDark,
              fontSize: 13.5,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    );
  }

  Widget _deviceRow(String name, String sub, String tag) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(name, style: const TextStyle(color: Colors.white, fontSize: 14.5, fontWeight: FontWeight.w600)),
            Text(sub, style: const TextStyle(color: AppColors.muDark, fontSize: 12)),
          ],
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
          decoration: BoxDecoration(
            color: AppColors.s2Dark,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.lineDark),
          ),
          child: Text(tag, style: const TextStyle(color: AppColors.unl, fontSize: 11.5, fontWeight: FontWeight.bold)),
        ),
      ],
    );
  }
}
