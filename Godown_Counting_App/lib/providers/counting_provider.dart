import 'package:flutter/foundation.dart';
import '../models/part_item_model.dart';
import '../models/challan_model.dart';
import '../services/offline_storage_service.dart';
import '../services/category_classifier.dart';

class CountingProvider with ChangeNotifier {
  List<PartItem> _catalog = [];
  String _searchQuery = '';
  String _selectedCategoryFilter = 'সব';
  Map<String, int> _counts = {};
  bool _isLoading = true;

  // Metadata
  String vehicleNo = '';
  String driverName = '';
  String sessionType = 'inward'; // 'inward' = আনলোডিং, 'outward' = লোডিং

  List<PartItem> get catalog => _catalog;
  String get searchQuery => _searchQuery;
  String get selectedCategoryFilter => _selectedCategoryFilter;
  Map<String, int> get counts => _counts;
  bool get isLoading => _isLoading;

  List<String> get allPartNames => _catalog.map((p) => p.nameBn).toList();

  List<String> getSuggestions(String query) {
    if (query.trim().isEmpty) return const [];
    final q = query.trim().toLowerCase();
    return _catalog
        .where((p) => p.nameBn.toLowerCase().contains(q))
        .map((p) => p.nameBn)
        .take(15)
        .toList();
  }

  String detectUnit(String itemName) {
    final lower = itemName.toLowerCase();
    if (lower.contains('ইঞ্জিন') || lower.contains('সেট')) {
      return 'সেট';
    }
    return 'পিস';
  }

  /// Initialize and load catalog + offline draft
  Future<void> initialize() async {
    _isLoading = true;
    notifyListeners();

    _catalog = await OfflineStorageService.loadEmbeddedCatalog();
    _counts = await OfflineStorageService.getDraftCounts();

    _isLoading = false;
    notifyListeners();
  }

  /// Filtered list of parts
  List<PartItem> get filteredParts {
    return _catalog.where((p) {
      final matchesSearch = _searchQuery.isEmpty ||
          p.nameBn.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          p.id.toLowerCase().contains(_searchQuery.toLowerCase());

      final matchesCat = _selectedCategoryFilter == 'সব' ||
          p.rootGroup == _selectedCategoryFilter;

      return matchesSearch && matchesCat;
    }).toList();
  }

  void setSearchQuery(String query) {
    _searchQuery = query.trim();
    notifyListeners();
  }

  void setCategoryFilter(String category) {
    _selectedCategoryFilter = category;
    notifyListeners();
  }

  int getCount(String partId) => _counts[partId] ?? 0;

  void increment(String partId, int delta) {
    final current = _counts[partId] ?? 0;
    final next = current + delta;
    if (next <= 0) {
      _counts.remove(partId);
    } else {
      _counts[partId] = next;
    }
    notifyListeners();
    OfflineStorageService.saveDraftCounts(_counts);
  }

  void setCount(String partId, int value) {
    if (value <= 0) {
      _counts.remove(partId);
    } else {
      _counts[partId] = value;
    }
    notifyListeners();
    OfflineStorageService.saveDraftCounts(_counts);
  }

  /// Total pieces counted across all models
  int get totalPiecesCounted {
    return _counts.values.fold(0, (sum, val) => sum + val);
  }

  /// Live Challan Category Summaries (Roll-Up by Root Group)
  List<ChallanCategorySummary> get categorySummaries {
    final Map<String, List<ChallanItem>> grouped = {};

    for (final entry in _counts.entries) {
      if (entry.value <= 0) continue;
      final part = _catalog.firstWhere(
        (p) => p.id == entry.key,
        orElse: () => PartItem(
          id: entry.key,
          nameBn: entry.key,
          category: 'অন্যান্য',
          rootGroup: CategoryClassifier.detectRootGroup(entry.key),
        ),
      );

      final item = ChallanItem(
        partId: part.id,
        partNameBn: part.nameBn,
        rootGroup: part.rootGroup,
        quantity: entry.value,
        unit: part.defaultUnit,
      );

      grouped.putIfAbsent(part.rootGroup, () => []).add(item);
    }

    final List<ChallanCategorySummary> summaries = [];
    grouped.forEach((rootGroup, items) {
      final totalQty = items.fold(0, (sum, i) => sum + i.quantity);
      final breakdownStr = items
          .map((i) => '${i.partNameBn} (${i.quantity})')
          .join(', ');

      summaries.add(ChallanCategorySummary(
        rootGroup: rootGroup,
        totalQuantity: totalQty,
        unit: CategoryClassifier.getUnitForGroup(rootGroup),
        distinctModelsCount: items.length,
        modelsBreakdown: breakdownStr,
      ));
    });

    // Sort by largest quantity first
    summaries.sort((a, b) => b.totalQuantity.compareTo(a.totalQuantity));
    return summaries;
  }

  /// Reset all counts and clear draft
  Future<void> resetAll() async {
    _counts.clear();
    notifyListeners();
    await OfflineStorageService.clearDraftCounts();
  }

  /// Generate finalized Challan Document
  ChallanDocument generateChallan() {
    final now = DateTime.now();
    final itemsList = <ChallanItem>[];

    for (final entry in _counts.entries) {
      if (entry.value <= 0) continue;
      final part = _catalog.firstWhere((p) => p.id == entry.key);
      itemsList.add(ChallanItem(
        partId: part.id,
        partNameBn: part.nameBn,
        rootGroup: part.rootGroup,
        quantity: entry.value,
        unit: part.defaultUnit,
      ));
    }

    return ChallanDocument(
      id: 'CHLN-${now.millisecondsSinceEpoch}',
      challanNo: 'CHLN-${now.year}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}-${(now.minute * 60 + now.second)}',
      sessionType: sessionType,
      countedByUserId: 'USER-STAFF-01',
      countedByUserName: 'গোডাউন ইনচার্জ',
      productOwner: 'মেসার্স মা মোটরস',
      destinationFor: 'মুরাদপুর প্রধান শো-রুম',
      vehicleNo: vehicleNo.isNotEmpty ? vehicleNo : 'অনির্ধারিত গাড়ি',
      driverName: driverName.isNotEmpty ? driverName : 'অনির্ধারিত চালক',
      gatePassNo: 'GP-${now.millisecondsSinceEpoch.toString().substring(7)}',
      godownLocation: 'গোডাউন-১, মুরাদপুর',
      date: now,
      items: itemsList,
      categorySummaries: categorySummaries,
      totalPcs: totalPiecesCounted,
    );
  }
}
