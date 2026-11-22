import 'package:flutter/material.dart';
import '../models/part_item_model.dart';
import '../services/parts_catalog_service.dart';
import '../services/category_classifier.dart';
import '../utils/app_colors.dart';
import '../utils/bangla_tools.dart';

class PartSearchOverlay extends StatefulWidget {
  final Function(String name, String category, String unit) onSelected;

  const PartSearchOverlay({super.key, required this.onSelected});

  @override
  State<PartSearchOverlay> createState() => _PartSearchOverlayState();
}

class _PartSearchOverlayState extends State<PartSearchOverlay> {
  final TextEditingController _searchCtrl = TextEditingController();
  final PartsCatalogService _catalogService = PartsCatalogService();

  List<PartItem> _filteredParts = [];
  String _selectedCategory = 'সব';
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _initCatalog();
  }

  Future<void> _initCatalog() async {
    if (!_catalogService.isLoaded) {
      await _catalogService.init();
    }
    if (mounted) {
      setState(() {
        _isLoading = false;
        _applyFilter();
      });
    }
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  void _applyFilter() {
    final query = _searchCtrl.text.trim();
    setState(() {
      _filteredParts = _catalogService.search(
        query,
        categoryFilter: _selectedCategory,
      );
    });
  }

  void _onCategorySelected(String category) {
    setState(() {
      _selectedCategory = category;
      _applyFilter();
    });
  }

  Future<void> _handleCustomAdd(String query) async {
    final cleanQuery = query.trim();
    if (cleanQuery.isEmpty) return;

    final detected = CategoryClassifier.classify(cleanQuery);
    final newPart = await _catalogService.addCustomPart(
      nameBn: cleanQuery,
      category: detected.rootGroup,
      unit: detected.defaultUnit,
    );

    if (mounted) {
      widget.onSelected(newPart.nameBn, newPart.rootGroup, newPart.defaultUnit);
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    final query = _searchCtrl.text.trim();

    return Scaffold(
      backgroundColor: AppColors.bgDark,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Search Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              child: Row(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: AppColors.s1Dark,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: AppColors.lineDark, width: 1.5),
                    ),
                    child: IconButton(
                      icon: const Icon(Icons.arrow_back, color: AppColors.txDark, size: 20),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Container(
                      height: 48,
                      decoration: BoxDecoration(
                        color: AppColors.s2Dark,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: AppColors.lineDark, width: 1.5),
                      ),
                      child: Row(
                        children: [
                          const Padding(
                            padding: EdgeInsets.only(left: 12, right: 6),
                            child: Icon(Icons.search, color: AppColors.muDark, size: 20),
                          ),
                          Expanded(
                            child: TextField(
                              controller: _searchCtrl,
                              autofocus: true,
                              style: const TextStyle(
                                color: AppColors.txDark,
                                fontSize: 15,
                                fontFamily: 'Hind Siliguri',
                              ),
                              decoration: const InputDecoration(
                                hintText: 'পার্টস বা মডেল খুঁজুন (যেমন: Axio, হাবস, CVT)...',
                                hintStyle: TextStyle(color: AppColors.muDark, fontSize: 13.5),
                                border: InputBorder.none,
                                isDense: true,
                              ),
                              onChanged: (_) => _applyFilter(),
                            ),
                          ),
                          if (_searchCtrl.text.isNotEmpty)
                            IconButton(
                              icon: const Icon(Icons.clear, color: AppColors.muDark, size: 18),
                              onPressed: () {
                                _searchCtrl.clear();
                                _applyFilter();
                              },
                            ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Horizontal Category Filter Pills
            SizedBox(
              height: 38,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 14),
                itemCount: PartsCatalogService.filterCategories.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (context, index) {
                  final cat = PartsCatalogService.filterCategories[index];
                  final isSelected = _selectedCategory == cat;

                  return ChoiceChip(
                    label: Text(
                      cat,
                      style: TextStyle(
                        color: isSelected ? AppColors.textOnAccent : AppColors.txDark,
                        fontSize: 12.5,
                        fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                        fontFamily: 'Hind Siliguri',
                      ),
                    ),
                    selected: isSelected,
                    selectedColor: AppColors.unl,
                    backgroundColor: AppColors.s2Dark,
                    side: BorderSide(
                      color: isSelected ? AppColors.unl : AppColors.lineDark,
                      width: 1,
                    ),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                    showCheckmark: false,
                    onSelected: (_) => _onCategorySelected(cat),
                  );
                },
              ),
            ),
            const SizedBox(height: 8),

            // Search Count & Stats Subtitle
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    _isLoading
                        ? 'ক্যাটালগ লোড হচ্ছে...'
                        : '${BanglaTools.toBanglaDigits(_filteredParts.length)}টি পার্টস পাওয়া গেছে',
                    style: const TextStyle(
                      color: AppColors.muDark,
                      fontSize: 12.5,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  if (_catalogService.allParts.isNotEmpty)
                    Text(
                      'মোট ডেটাবেস: ${BanglaTools.toBanglaDigits(_catalogService.allParts.length)}টি',
                      style: const TextStyle(
                        color: AppColors.muDark,
                        fontSize: 11.5,
                      ),
                    ),
                ],
              ),
            ),
            const Divider(color: AppColors.lineDark, height: 1),

            // Result List
            Expanded(
              child: _isLoading
                  ? const Center(
                      child: CircularProgressIndicator(color: AppColors.unl),
                    )
                  : ListView(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                      children: [
                        // Custom Part Creation Tile (if user typed something)
                        if (query.isNotEmpty) ...[
                          InkWell(
                            onTap: () => _handleCustomAdd(query),
                            borderRadius: BorderRadius.circular(12),
                            child: Container(
                              margin: const EdgeInsets.only(bottom: 8),
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: AppColors.load.withValues(alpha: 0.12),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: AppColors.load, width: 1.5),
                              ),
                              child: Row(
                                children: [
                                  const Icon(Icons.add_circle, color: AppColors.load, size: 24),
                                  const SizedBox(width: 10),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          'নতুন পার্টস হিসেবে যোগ করুন: “$query”',
                                          style: const TextStyle(
                                            color: Colors.white,
                                            fontSize: 14.5,
                                            fontWeight: FontWeight.w700,
                                            fontFamily: 'Hind Siliguri',
                                          ),
                                        ),
                                        Text(
                                          'ক্যাটাগরি: ${CategoryClassifier.classify(query).rootGroup} • একক: ${CategoryClassifier.classify(query).defaultUnit} (অফলাইনে সংরক্ষিত হবে)',
                                          style: const TextStyle(color: Color(0xFF34D399), fontSize: 11.5),
                                        ),
                                      ],
                                    ),
                                  ),
                                  const Icon(Icons.arrow_forward_ios, color: AppColors.load, size: 14),
                                ],
                              ),
                            ),
                          ),
                        ],

                        // Catalog Results
                        if (_filteredParts.isEmpty && query.isEmpty) ...[
                          const Center(
                            child: Padding(
                              padding: EdgeInsets.all(32),
                              child: Text(
                                'এই ক্যাটাগরিতে কোনো পার্টস নেই',
                                style: TextStyle(color: AppColors.muDark, fontSize: 14),
                              ),
                            ),
                          ),
                        ] else ...[
                          ..._filteredParts.map((part) {
                            return InkWell(
                              onTap: () {
                                widget.onSelected(
                                  part.nameBn,
                                  part.rootGroup,
                                  part.defaultUnit,
                                );
                                Navigator.pop(context);
                              },
                              borderRadius: BorderRadius.circular(10),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 12),
                                decoration: const BoxDecoration(
                                  border: Border(
                                    bottom: BorderSide(color: AppColors.lineDark, width: 0.8),
                                  ),
                                ),
                                child: Row(
                                  crossAxisAlignment: CrossAxisAlignment.center,
                                  children: [
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            part.nameBn,
                                            style: const TextStyle(
                                              color: AppColors.txDark,
                                              fontSize: 15.5,
                                              fontWeight: FontWeight.w600,
                                              fontFamily: 'Hind Siliguri',
                                            ),
                                          ),
                                          const SizedBox(height: 3),
                                          Row(
                                            children: [
                                              Container(
                                                padding: const EdgeInsets.symmetric(
                                                  horizontal: 6,
                                                  vertical: 1.5,
                                                ),
                                                decoration: BoxDecoration(
                                                  color: AppColors.s2Dark,
                                                  borderRadius: BorderRadius.circular(6),
                                                  border: Border.all(
                                                    color: AppColors.lineDark,
                                                    width: 0.8,
                                                  ),
                                                ),
                                                child: Text(
                                                  part.rootGroup,
                                                  style: const TextStyle(
                                                    color: AppColors.muDark,
                                                    fontSize: 11,
                                                    fontWeight: FontWeight.w500,
                                                  ),
                                                ),
                                              ),
                                              if (part.popularModels.isNotEmpty) ...[
                                                const SizedBox(width: 6),
                                                Expanded(
                                                  child: Text(
                                                    part.popularModels.take(2).join(', '),
                                                    maxLines: 1,
                                                    overflow: TextOverflow.ellipsis,
                                                    style: TextStyle(
                                                      color: AppColors.load.withOpacity(0.85),
                                                      fontSize: 11,
                                                      fontWeight: FontWeight.w500,
                                                    ),
                                                  ),
                                                ),
                                              ],
                                            ],
                                          ),
                                        ],
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 10,
                                        vertical: 3.5,
                                      ),
                                      decoration: BoxDecoration(
                                        color: AppColors.s2Dark,
                                        borderRadius: BorderRadius.circular(16),
                                        border: Border.all(color: AppColors.lineDark),
                                      ),
                                      child: Text(
                                        part.defaultUnit,
                                        style: const TextStyle(
                                          color: AppColors.txDark,
                                          fontSize: 12,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            );
                          }),
                        ],
                      ],
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
