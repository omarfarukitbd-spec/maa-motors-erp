import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/challan_model.dart';
import '../providers/auth_provider.dart';
import '../providers/counting_provider.dart';
import '../services/audio_engine_service.dart';
import '../services/drive_backup_service.dart';
import '../services/firebase_sync_service.dart';
import '../utils/app_colors.dart';
import '../utils/bangla_tools.dart';
import '../widgets/godown_top_bar.dart';

class LicenseBackupScreen extends StatefulWidget {
  const LicenseBackupScreen({super.key});

  @override
  State<LicenseBackupScreen> createState() => _LicenseBackupScreenState();
}

class _LicenseBackupScreenState extends State<LicenseBackupScreen> {
  final AudioEngineService _audio = AudioEngineService();
  final TextEditingController _verifyCtrl = TextEditingController();
  final FirebaseSyncService _syncService = FirebaseSyncService();

  bool _isSyncing = false;
  bool _isBackingUp = false;
  String? _verificationResult;
  bool _verificationSuccess = false;

  @override
  void dispose() {
    _verifyCtrl.dispose();
    super.dispose();
  }

  Future<void> _handleErpSync() async {
    setState(() => _isSyncing = true);
    _audio.triggerHaptic();

    try {
      final pushedCount = await _syncService.syncPendingQueue();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: AppColors.load,
            content: Row(
              children: [
                const Icon(Icons.cloud_done, color: AppColors.textOnAccent, size: 18),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    pushedCount > 0
                        ? '$pushedCount টি অপেক্ষমাণ চালান সফলভাবে ইআরপিতে সিঙ্ক হয়েছে!'
                        : 'সকল চালান ক্লাউড ইআরপিতে সম্পূর্ণ আপডেট রয়েছে।',
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: AppColors.dng,
            content: Text('সিঙ্ক ব্যর্থ হয়েছে: $e'),
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isSyncing = false);
    }
  }

  Future<void> _handleDriveBackup(AuthProvider auth) async {
    setState(() => _isBackingUp = true);
    _audio.triggerHaptic();

    try {
      final targetEmail = auth.userEmail ?? 'office.maamotors@gmail.com';
      final ok = await DriveBackupService.performBackup(targetEmail);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: ok ? AppColors.load : AppColors.dng,
            content: Row(
              children: [
                Icon(ok ? Icons.check_circle : Icons.error, color: Colors.white, size: 18),
                const SizedBox(width: 8),
                Text(
                  ok
                      ? 'গুগল ড্রাইভ ক্লাউড ব্যাকআপ সফলভাবে সম্পন্ন!'
                      : 'ব্যাকআপ তৈরিতে সমস্যা হয়েছে। সংযোগ পরীক্ষা করুন।',
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(backgroundColor: AppColors.dng, content: Text('ব্যাকআপ ত্রুটি: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isBackingUp = false);
    }
  }

  void _verifyChallanCode(CountingProvider counting) {
    final code = _verifyCtrl.text.trim().toUpperCase();
    if (code.isEmpty) return;

    _audio.triggerHaptic();
    final matched = counting.sessionHistory.cast<ChallanDocument?>().firstWhere(
          (c) => c != null && c.verificationCode.toUpperCase() == code,
          orElse: () => null,
        );

    setState(() {
      if (matched != null) {
        _verificationSuccess = true;
        final revText = matched.revisionNumber > 0
            ? ' (সংশোধিত ${BanglaTools.toBanglaDigits(matched.revisionNumber)})'
            : '';
        final party = matched.customerName.isNotEmpty ? matched.customerName : matched.productOwner;
        _verificationResult =
            'আসল চালান প্রমাণিত: নং ${matched.displayChallanNo}$revText\nপার্টি: $party • গাড়ি: ${matched.vehicleNo}\nতারিখ: ${BanglaTools.formatBanglaDate(matched.date)} • মোট: ${BanglaTools.toBanglaDigits(matched.totalPcs)} পিস';
      } else {
        _verificationSuccess = false;
        _verificationResult = 'যাচাই কোড মিলেনি। চালানটি সন্দেহজনক বা গোডাউন-১ থেকে ইস্যু করা নয়।';
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final counting = context.watch<CountingProvider>();

    return Scaffold(
      backgroundColor: AppColors.bgDark,
      appBar: GodownTopBar(
        title: 'ক্লাউড ও ব্যাকআপ হাব',
        audioEngine: _audio,
        onSoundToggled: () => setState(() {}),
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          children: [
            // 1. ERP Cloud Sync Card
            _buildSectionHeader('মা মোটরস মূল ইআরপি ক্লাউড সিঙ্ক', Icons.cloud_sync, const Color(0xFF38BDF8)),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.s1Dark,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.lineDark),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Icon(
                            _syncService.isOnline ? Icons.wifi : Icons.wifi_off,
                            color: _syncService.isOnline ? AppColors.load : AppColors.dng,
                            size: 18,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            _syncService.isOnline ? 'ইআরপি ক্লাউড কানেক্টেড' : 'অফলাইন মোড',
                            style: TextStyle(
                              color: _syncService.isOnline ? AppColors.load : AppColors.dng,
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: const Color(0xFF0F172A),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: const Color(0xFF334155)),
                        ),
                        child: const Text('maa-motors-erp', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 10, fontFamily: 'monospace')),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'গোডাউনের সকল খালাস ও ডেলিভারি চালান সরাসরি মা মোটরস মূল ডাটাবেজের `godown_challans` টেবিলে সংরক্ষিত হয়।',
                    style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 12),
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          'অপেক্ষমাণ কিউ: ${BanglaTools.toBanglaDigits(_syncService.pendingCount)} টি চালান',
                          style: const TextStyle(color: Color(0xFFFBBF24), fontSize: 12.5, fontWeight: FontWeight.bold),
                        ),
                      ),
                      if (_syncService.lastSyncTime != null)
                        Text(
                          'সর্বশেষ সিঙ্ক: ${_syncService.lastSyncTime!.hour}:${_syncService.lastSyncTime!.minute.toString().padLeft(2, '0')}',
                          style: const TextStyle(color: AppColors.muDark, fontSize: 11),
                        ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.unl,
                        foregroundColor: AppColors.textOnAccent,
                        padding: const EdgeInsets.symmetric(vertical: 11),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      icon: _isSyncing
                          ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                          : const Icon(Icons.sync, size: 18),
                      label: Text(
                        _isSyncing ? 'সিঙ্ক হচ্ছে...' : 'এখনই ইআরপিতে সিঙ্ক করুন',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5),
                      ),
                      onPressed: _isSyncing ? null : _handleErpSync,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // 2. Google Drive Backup Card
            _buildSectionHeader('গুগল ড্রাইভ ব্যাকআপ পার্টিশন', Icons.cloud_upload_outlined, const Color(0xFF22C55E)),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.s1Dark,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.lineDark),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.shield_outlined, color: Color(0xFF22C55E), size: 18),
                      SizedBox(width: 8),
                      Text('অফলাইন এনক্রিপ্টেড ব্যাকআপ', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                    ],
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'ড্রাইভ ব্যাকআপ অ্যাকাউন্ট: office.maamotors@gmail.com\nফোন নষ্ট বা হারিয়ে গেলেও সমস্ত চালান অক্ষত পুনরুদ্ধার করা যাবে।',
                    style: TextStyle(color: AppColors.muDark, fontSize: 11.5),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF16A34A),
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                          icon: _isBackingUp
                              ? const SizedBox(width: 14, height: 14, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                              : const Icon(Icons.cloud_upload, size: 16),
                          label: const Text('ড্রাইভ ব্যাকআপ নিন', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                          onPressed: _isBackingUp ? null : () => _handleDriveBackup(auth),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: OutlinedButton.icon(
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: AppColors.lineDark),
                            foregroundColor: AppColors.txDark,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                          icon: const Icon(Icons.restore, size: 16),
                          label: const Text('যাচাই / রিস্টোর', style: TextStyle(fontSize: 12)),
                          onPressed: () async {
                            final meta = await DriveBackupService.getBackupMetadata();
                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  backgroundColor: AppColors.load,
                                  content: Text(
                                    meta.totalChallansBackedUp > 0
                                        ? 'ড্রাইভ ব্যাকআপে ${BanglaTools.toBanglaDigits(meta.totalChallansBackedUp)}টি চালান যাচাইকৃত!'
                                        : 'নতুন কোনো ক্লাউড ব্যাকআপ পাওয়া যায়নি।',
                                  ),
                                ),
                              );
                            }
                          },
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // 3. Challan Verification Card
            _buildSectionHeader('আসল চালান সত্যতা যাচাই', Icons.verified_user_outlined, const Color(0xFFA855F7)),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.s1Dark,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.lineDark),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'প্রিন্ট করা রসিদ বা স্লিপের সিকিউরিটি ভেরিফিকেশন কোড লিখুন:',
                    style: TextStyle(color: AppColors.muDark, fontSize: 12),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _verifyCtrl,
                          textCapitalization: TextCapitalization.characters,
                          style: const TextStyle(color: Colors.white, fontSize: 14, fontFamily: 'monospace'),
                          decoration: InputDecoration(
                            hintText: 'যেমন: 7K4X92',
                            hintStyle: const TextStyle(color: AppColors.muDark, fontSize: 12),
                            filled: true,
                            fillColor: AppColors.s2Dark,
                            isDense: true,
                            contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: BorderSide.none),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFA855F7),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 11),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        onPressed: () => _verifyChallanCode(counting),
                        child: const Text('যাচাই', style: TextStyle(fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                  if (_verificationResult != null) ...[
                    const SizedBox(height: 10),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: _verificationSuccess ? const Color(0xFF064E3B) : const Color(0xFF7F1D1D),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: _verificationSuccess ? AppColors.load : AppColors.dng),
                      ),
                      child: Text(
                        _verificationResult!,
                        style: const TextStyle(color: Colors.white, fontSize: 12, height: 1.4, fontWeight: FontWeight.w600),
                      ),
                    ),
                  ],
                ],
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title, IconData icon, Color color) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6, left: 2),
      child: Row(
        children: [
          Icon(icon, color: color, size: 16),
          const SizedBox(width: 6),
          Text(
            title,
            style: TextStyle(color: color, fontSize: 13, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }
}
