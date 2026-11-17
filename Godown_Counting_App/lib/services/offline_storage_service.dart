import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/part_item_model.dart';
import '../models/challan_model.dart';
import 'category_classifier.dart';

class OfflineStorageService {
  static const String _kDraftCountsKey = 'godown_draft_counts_v2';
  static const String _kDraftMetaKey = 'godown_draft_meta_v2';
  static const String _kChallanHistoryKey = 'godown_challans_history_v2';
  static const String _kLastKnownTimestampKey = 'godown_last_known_clock_v2';
  static const String _kDeviceSerialCounterKey = 'godown_device_serial_counter_v2';

  // ==========================================
  // 1. EMBEDDED CATALOG LOADER
  // ==========================================
  static Future<List<PartItem>> loadEmbeddedCatalog() async {
    try {
      final jsonString =
          await rootBundle.loadString('assets/data/parts_catalog.json');
      final List<dynamic> rawList = json.decode(jsonString);

      return rawList.map((item) {
        final map = item as Map<String, dynamic>;
        final nameBn = map['nameBn'] as String? ?? '';
        final detected = CategoryClassifier.detectRootGroup(nameBn);
        return PartItem.fromJson(map, detectedRoot: detected);
      }).toList();
    } catch (_) {
      return [];
    }
  }

  // ==========================================
  // 2. LIVE COUNTING DRAFT PERSISTENCE
  // ==========================================
  static Future<void> saveDraftCounts(Map<String, int> counts) async {
    final prefs = await SharedPreferences.getInstance();
    final jsonStr = json.encode(counts);
    await prefs.setString(_kDraftCountsKey, jsonStr);
    await recordClockTimestamp();
  }

  static Future<Map<String, int>> getDraftCounts() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonStr = prefs.getString(_kDraftCountsKey);
    if (jsonStr == null || jsonStr.isEmpty) return {};
    try {
      final Map<String, dynamic> decoded = json.decode(jsonStr);
      return decoded.map((k, v) => MapEntry(k, v as int));
    } catch (_) {
      return {};
    }
  }

  static Future<void> clearDraftCounts() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_kDraftCountsKey);
    await prefs.remove(_kDraftMetaKey);
  }

  // ==========================================
  // 3. ANTI-TAMPER CLOCK INTEGRITY GUARD
  // ==========================================
  /// Records current timestamp as highest known time
  static Future<void> recordClockTimestamp() async {
    final prefs = await SharedPreferences.getInstance();
    final nowMs = DateTime.now().millisecondsSinceEpoch;
    final lastKnown = prefs.getInt(_kLastKnownTimestampKey) ?? 0;
    if (nowMs > lastKnown) {
      await prefs.setInt(_kLastKnownTimestampKey, nowMs);
    }
  }

  /// Verifies phone clock has not been wound backwards suspiciously
  static Future<bool> checkClockIntegrity() async {
    final prefs = await SharedPreferences.getInstance();
    final lastKnown = prefs.getInt(_kLastKnownTimestampKey);
    if (lastKnown == null) {
      await recordClockTimestamp();
      return true;
    }

    final nowMs = DateTime.now().millisecondsSinceEpoch;
    // Allow small 5-minute clock drift margin
    final driftMarginMs = const Duration(minutes: 5).inMilliseconds;

    if (nowMs < (lastKnown - driftMarginMs)) {
      // Clock was deliberately wound back!
      return false;
    }

    if (nowMs > lastKnown) {
      await prefs.setInt(_kLastKnownTimestampKey, nowMs);
    }
    return true;
  }

  // ==========================================
  // 4. CHALLAN REPOSITORY & REVISION ENGINE
  // ==========================================
  static Future<List<ChallanDocument>> getChallanHistory() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_kChallanHistoryKey);
    if (raw == null || raw.isEmpty) return [];
    try {
      final List decoded = json.decode(raw);
      final list = decoded.map((e) => ChallanDocument.fromJson(e)).toList();
      // Sort newest date first
      list.sort((a, b) => b.date.compareTo(a.date));
      return list;
    } catch (_) {
      return [];
    }
  }

  /// Alias for getChallanHistory
  static Future<List<ChallanDocument>> getAllChallans() => getChallanHistory();

  static Future<void> saveChallan(ChallanDocument doc) async {
    final history = await getChallanHistory();
    final idx = history.indexWhere((c) => c.id == doc.id);
    if (idx != -1) {
      history[idx] = doc;
    } else {
      history.insert(0, doc);
    }

    final prefs = await SharedPreferences.getInstance();
    final raw = json.encode(history.map((e) => e.toJson()).toList());
    await prefs.setString(_kChallanHistoryKey, raw);
    await recordClockTimestamp();
  }

  static Future<ChallanDocument?> getChallanById(String id) async {
    final history = await getChallanHistory();
    try {
      return history.firstWhere((c) => c.id == id);
    } catch (_) {
      return null;
    }
  }

  /// Locks an existing challan against further direct in-place edits
  static Future<bool> lockChallan(String id) async {
    final doc = await getChallanById(id);
    if (doc == null) return false;
    if (doc.isLocked) return true;

    final lockedDoc = doc.copyWith(isLocked: true);
    await saveChallan(lockedDoc);
    return true;
  }

  /// Creates a revised edition of an existing challan without destroying original
  static Future<ChallanDocument?> createChallanRevision({
    required String originalId,
    required ChallanDocument updatedDraft,
    required String reason,
  }) async {
    final original = await getChallanById(originalId);
    if (original == null) return null;

    // Ensure original is permanently locked
    await lockChallan(originalId);

    // Create child revision
    final revisionDoc = updatedDraft.copyWith(
      isLocked: false,
      revisionNumber: original.revisionNumber + 1,
      revisionOfId: original.id,
      revisionReason: reason,
    );

    await saveChallan(revisionDoc);
    return revisionDoc;
  }

  // ==========================================
  // 5. LOCAL DEVICE SERIAL COUNTER
  // ==========================================
  static Future<int> getNextDeviceSerial() async {
    final prefs = await SharedPreferences.getInstance();
    final current = prefs.getInt(_kDeviceSerialCounterKey) ?? 0;
    final next = current + 1;
    await prefs.setInt(_kDeviceSerialCounterKey, next);
    return next;
  }
}
