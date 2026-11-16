import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/part_item_model.dart';
import '../models/challan_model.dart';
import 'category_classifier.dart';

class OfflineStorageService {
  static const String _kDraftCountsKey = 'godown_draft_counts_v1';
  static const String _kDraftMetaKey = 'godown_draft_meta_v1';
  static const String _kChallanHistoryKey = 'godown_challans_history_v1';

  /// Load 609 embedded parts from local asset JSON
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
    } catch (e) {
      // Fallback empty list on error
      return [];
    }
  }

  /// Save live counts map to offline storage
  static Future<void> saveDraftCounts(Map<String, int> counts) async {
    final prefs = await SharedPreferences.getInstance();
    final jsonStr = json.encode(counts);
    await prefs.setString(_kDraftCountsKey, jsonStr);
  }

  /// Read live counts map from offline storage
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

  /// Clear live counts
  static Future<void> clearDraftCounts() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_kDraftCountsKey);
    await prefs.remove(_kDraftMetaKey);
  }
}
