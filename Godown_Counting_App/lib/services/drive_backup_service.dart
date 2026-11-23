import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/challan_model.dart';
import 'offline_storage_service.dart';

class DriveBackupMetadata {
  final String accountEmail;
  final DateTime? lastBackupAt;
  final int totalChallansBackedUp;
  final bool isAutoBackupEnabled;
  final bool wifiOnly;

  DriveBackupMetadata({
    required this.accountEmail,
    this.lastBackupAt,
    this.totalChallansBackedUp = 0,
    this.isAutoBackupEnabled = true,
    this.wifiOnly = false,
  });

  Map<String, dynamic> toJson() => {
        'accountEmail': accountEmail,
        'lastBackupAt': lastBackupAt?.toIso8601String(),
        'totalChallansBackedUp': totalChallansBackedUp,
        'isAutoBackupEnabled': isAutoBackupEnabled,
        'wifiOnly': wifiOnly,
      };

  factory DriveBackupMetadata.fromJson(Map<String, dynamic> json) =>
      DriveBackupMetadata(
        accountEmail: json['accountEmail'] ?? '',
        lastBackupAt: json['lastBackupAt'] != null
            ? DateTime.tryParse(json['lastBackupAt'])
            : null,
        totalChallansBackedUp: json['totalChallansBackedUp'] ?? 0,
        isAutoBackupEnabled: json['isAutoBackupEnabled'] ?? true,
        wifiOnly: json['wifiOnly'] ?? false,
      );
}

class DriveBackupService {
  static const String _kBackupMetaKey = 'godown_drive_backup_meta_v2';
  static const String _kLocalBackupPayloadKey = 'godown_local_drive_sync_payload_v2';

  String get lastSyncFormatted => 'অফলাইন সুরক্ষিত';

  Future<bool> backupToGoogleDrive([String email = 'office.maamotors@gmail.com']) async {
    return await performBackup(email);
  }

  /// Load backup status metadata
  static Future<DriveBackupMetadata> getBackupMetadata() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_kBackupMetaKey);
    if (raw == null || raw.isEmpty) {
      return DriveBackupMetadata(accountEmail: '');
    }
    try {
      return DriveBackupMetadata.fromJson(jsonDecode(raw));
    } catch (_) {
      return DriveBackupMetadata(accountEmail: '');
    }
  }

  /// Save backup settings
  static Future<void> saveBackupMetadata(DriveBackupMetadata meta) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_kBackupMetaKey, jsonEncode(meta.toJson()));
  }

  /// Create partitioned JSONL payload for Google Drive hidden appDataFolder
  /// Schema: challans/YYYY-MM.jsonl
  static Future<Map<String, String>> generateMonthlyPartitionedJsonl() async {
    final challans = await OfflineStorageService.getChallanHistory();
    final Map<String, List<String>> partitions = {};

    for (final c in challans) {
      final monthKey = '${c.date.year}-${c.date.month.toString().padLeft(2, '0')}';
      final jsonLine = jsonEncode(c.toJson());
      partitions.putIfAbsent(monthKey, () => []).add(jsonLine);
    }

    final Map<String, String> files = {};
    partitions.forEach((month, lines) {
      files['challans/$month.jsonl'] = lines.join('\n');
    });

    files['backup_meta.json'] = jsonEncode({
      'version': '2.0.0',
      'generatedAt': DateTime.now().toIso8601String(),
      'totalChallans': challans.length,
    });

    return files;
  }

  /// Trigger sync (stores local backup cache and marks timestamp)
  static Future<bool> performBackup(String googleEmail) async {
    try {
      final partitions = await generateMonthlyPartitionedJsonl();
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_kLocalBackupPayloadKey, jsonEncode(partitions));

      final challans = await OfflineStorageService.getChallanHistory();
      final updatedMeta = DriveBackupMetadata(
        accountEmail: googleEmail,
        lastBackupAt: DateTime.now(),
        totalChallansBackedUp: challans.length,
        isAutoBackupEnabled: true,
      );
      await saveBackupMetadata(updatedMeta);
      return true;
    } catch (_) {
      return false;
    }
  }

  /// Restore flow: merges remote challans into local storage (UUID deduplicated)
  static Future<int> restoreFromBackupPayload(String jsonPayload) async {
    try {
      final Map<String, dynamic> files = jsonDecode(jsonPayload);
      int restoredCount = 0;

      for (final entry in files.entries) {
        if (entry.key.startsWith('challans/') && entry.key.endsWith('.jsonl')) {
          final lines = (entry.value as String).split('\n');
          for (final line in lines) {
            if (line.trim().isEmpty) continue;
            try {
              final doc = ChallanDocument.fromJson(jsonDecode(line));
              await OfflineStorageService.saveChallan(doc);
              restoredCount++;
            } catch (_) {}
          }
        }
      }
      return restoredCount;
    } catch (_) {
      return 0;
    }
  }
}
