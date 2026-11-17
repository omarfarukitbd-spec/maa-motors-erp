import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/part_item_model.dart';
import 'category_classifier.dart';

class PartsCatalogService {
  static final PartsCatalogService _instance = PartsCatalogService._internal();
  factory PartsCatalogService() => _instance;
  PartsCatalogService._internal();

  static const String _kCustomPartsKey = 'godown_custom_parts_v2';

  List<PartItem> _masterCatalog = [];
  List<PartItem> _customParts = [];
  bool _isLoaded = false;

  bool get isLoaded => _isLoaded;
  List<PartItem> get allParts => [..._customParts, ..._masterCatalog];

  /// Core Filter categories for UI filter chips
  static const List<String> filterCategories = [
    'সব',
    'হাবস',
    'কার্টিজ',
    'ইঞ্জিন',
    'গিয়ার বক্স',
    'ডিস্ক ও ব্রেক',
    'সাসপেনশন',
    'শকএবজর্ভার',
    'অন্যান্য',
  ];

  /// Initialize and load embedded 609 parts and local custom parts
  Future<void> init() async {
    if (_isLoaded) return;

    try {
      // 1. Load embedded 609+ parts JSON from assets
      final jsonString =
          await rootBundle.loadString('assets/data/parts_catalog.json');
      final List<dynamic> rawList = json.decode(jsonString);

      _masterCatalog = rawList.map((item) {
        final map = item as Map<String, dynamic>;
        final nameBn = map['nameBn'] as String? ?? '';
        final detected = CategoryClassifier.detectRootGroup(nameBn);
        return PartItem.fromJson(map, detectedRoot: detected);
      }).toList();

      // 2. Load locally created custom parts
      final prefs = await SharedPreferences.getInstance();
      final customRaw = prefs.getString(_kCustomPartsKey);
      if (customRaw != null && customRaw.isNotEmpty) {
        try {
          final List<dynamic> customDecoded = json.decode(customRaw);
          _customParts = customDecoded.map((item) {
            final map = item as Map<String, dynamic>;
            return PartItem.fromJson(map);
          }).toList();
        } catch (err) {
          debugPrint('Custom parts decode error: $err');
          _customParts = [];
        }
      }

      _isLoaded = true;
    } catch (e) {
      debugPrint('Parts catalog load fallback: $e');
      // If assets fail, fallback to default catalog
      _masterCatalog = CategoryClassifier.defaultParts.map((p) {
        return PartItem(
          id: 'PART-${p.name.hashCode}',
          nameBn: p.name,
          category: p.rootGroup,
          rootGroup: p.rootGroup,
          defaultUnit: p.defaultUnit,
        );
      }).toList();
      _isLoaded = true;
    }
  }

  /// Multi-token instant type-ahead search
  List<PartItem> search(String query, {String? categoryFilter}) {
    final cleanQ = query.trim().toLowerCase();
    final tokens = cleanQ.split(RegExp(r'\s+')).where((t) => t.isNotEmpty).toList();

    final sourceList = allParts;

    return sourceList.where((part) {
      // 1. Apply category filter if selected and not 'সব'
      if (categoryFilter != null &&
          categoryFilter.isNotEmpty &&
          categoryFilter != 'সব') {
        final matchRoot = part.rootGroup.toLowerCase() == categoryFilter.toLowerCase();
        final matchCat = part.category.toLowerCase().contains(categoryFilter.toLowerCase());
        if (!matchRoot && !matchCat) {
          return false;
        }
      }

      // 2. If no search text, match all in category
      if (tokens.isEmpty) return true;

      // 3. Match all tokens across attributes (AND logic)
      final nameBn = part.nameBn.toLowerCase();
      final nameEn = (part.nameEn ?? '').toLowerCase();
      final rootGroup = part.rootGroup.toLowerCase();
      final category = part.category.toLowerCase();
      final aliases = part.aliasesBn.map((a) => a.toLowerCase()).join(' ');
      final models = part.popularModels.map((m) => m.toLowerCase()).join(' ');

      return tokens.every((token) {
        return nameBn.contains(token) ||
            nameEn.contains(token) ||
            aliases.contains(token) ||
            rootGroup.contains(token) ||
            category.contains(token) ||
            models.contains(token);
      });
    }).toList();
  }

  /// Add and persist a custom user-defined part
  Future<PartItem> addCustomPart({
    required String nameBn,
    String? category,
    String? unit,
    List<String>? popularModels,
  }) async {
    final cleanName = nameBn.trim();
    final detectedRoot = category ?? CategoryClassifier.detectRootGroup(cleanName);
    final detectedUnit = unit ?? CategoryClassifier.getUnitForGroup(detectedRoot);

    final newPart = PartItem(
      id: 'CUSTOM-${DateTime.now().millisecondsSinceEpoch}',
      nameBn: cleanName,
      category: detectedRoot,
      rootGroup: detectedRoot,
      defaultUnit: detectedUnit,
      popularModels: popularModels ?? const [],
    );

    _customParts.insert(0, newPart);

    // Persist to SharedPreferences
    final prefs = await SharedPreferences.getInstance();
    final raw = json.encode(_customParts.map((p) => p.toJson()).toList());
    await prefs.setString(_kCustomPartsKey, raw);

    return newPart;
  }
}
