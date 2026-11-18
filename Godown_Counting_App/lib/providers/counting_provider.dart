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

  // Challan Metadata
  String vehicleNo = '';
  String driverName = '';
  String driverMobile = '';
  String productOwner = 'মেসার্স মা মোটরস';
  String destinationFor = 'মুরাদপুর প্রধান শো-রুম';
  String sessionType = 'inward'; // 'inward' = আনলোডিং, 'outward' = লোডিং

  List<ChallanDocument> _sessionHistory = [];

  List<PartItem> get catalog => _catalog;
  String get searchQuery => _searchQuery;
  String get selectedCategoryFilter => _selectedCategoryFilter;
  Map<String, int> get counts => _counts;
  bool get isLoading => _isLoading;
  List<ChallanDocument> get sessionHistory => _sessionHistory;

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
    _sessionHistory = await OfflineStorageService.getAllChallans();

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
    vehicleNo = '';
    driverName = '';
    driverMobile = '';
    notifyListeners();
    await OfflineStorageService.clearDraftCounts();
  }

  /// Generate and store finalized Challan Document
  Future<ChallanDocument> generateChallan({
    String devicePrefix = 'A1',
    String countedByUserName = 'গোডাউন ইনচার্জ',
  }) async {
    final now = DateTime.now();
    final itemsList = <ChallanItem>[];

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
      itemsList.add(ChallanItem(
        partId: part.id,
        partNameBn: part.nameBn,
        rootGroup: part.rootGroup,
        quantity: entry.value,
        unit: part.defaultUnit,
      ));
    }

    final serialNo = await OfflineStorageService.getNextDeviceSerial();
    final paddedSerial = serialNo.toString().padLeft(5, '0');
    final formattedNo = '$devicePrefix-$paddedSerial';

    final challan = ChallanDocument(
      id: 'CHLN-${now.millisecondsSinceEpoch}',
      challanNo: formattedNo,
      devicePrefix: devicePrefix,
      deviceSerialNo: serialNo,
      sessionType: sessionType,
      countedByUserId: 'USER-STAFF-01',
      countedByUserName: countedByUserName,
      productOwner: productOwner,
      destinationFor: destinationFor,
      vehicleNo: vehicleNo.isNotEmpty ? vehicleNo : 'অনির্ধারিত গাড়ি',
      driverName: driverName.isNotEmpty ? driverName : 'অনির্ধারিত চালক',
      driverMobile: driverMobile,
      gatePassNo: 'GP-${now.millisecondsSinceEpoch.toString().substring(7)}',
      godownLocation: 'গোডাউন-১, মুরাদপুর',
      date: now,
      items: itemsList,
      categorySummaries: categorySummaries,
      totalPcs: totalPiecesCounted,
    );

    // Save to local offline history
    await OfflineStorageService.saveChallan(challan);
    _sessionHistory.insert(0, challan);
    notifyListeners();
    return challan;
  }

  /// Add completed challan directly from new UI flow
  Future<void> addCompletedChallanDirectly({
    required String challanNo,
    required String sessionType,
    required String vehicleNo,
    required String driverName,
    String driverMobile = '',
    String customerName = '',
    String customerAddress = '',
    String customerPhone = '',
    String sealNo = '',
    required List<ChallanItem> items,
    required bool isLocked,
    required String verificationCode,
    required int revisionNumber,
  }) async {
    final now = DateTime.now();
    final totalPcs = items.fold<int>(0, (sum, i) => sum + i.quantity);

    final doc = ChallanDocument(
      id: challanNo,
      challanNo: challanNo,
      sessionType: sessionType,
      vehicleNo: vehicleNo,
      driverName: driverName,
      driverMobile: driverMobile,
      customerName: customerName,
      customerAddress: customerAddress,
      customerPhone: customerPhone,
      productOwner: customerName.isNotEmpty ? customerName : 'মেসার্স মা মোটরস',
      destinationFor: customerAddress.isNotEmpty ? customerAddress : 'মুরাদপুর প্রধান শো-রুম',
      sealNo: sealNo,
      date: now,
      items: items,
      totalPcs: totalPcs,
      isLocked: isLocked,
      verificationCode: verificationCode,
      revisionNumber: revisionNumber,
      categorySummaries: [],
    );

    _sessionHistory.insert(0, doc);
    notifyListeners();
    await OfflineStorageService.saveChallan(doc);
  }
}
