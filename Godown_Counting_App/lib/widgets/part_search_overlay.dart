import 'package:flutter/material.dart';
import '../services/category_classifier.dart';
import '../utils/app_colors.dart';

class PartSearchOverlay extends StatefulWidget {
  final Function(String name, String category, String unit) onSelected;

  const PartSearchOverlay({super.key, required this.onSelected});

  @override
  State<PartSearchOverlay> createState() => _PartSearchOverlayState();
}

class _PartSearchOverlayState extends State<PartSearchOverlay> {
  final TextEditingController _searchCtrl = TextEditingController();
  List<ClassifiedPart> _filteredParts = [];

  @override
  void initState() {
    super.initState();
    _filteredParts = CategoryClassifier.defaultParts;
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  void _onSearchChanged(String query) {
    final q = query.trim().toLowerCase();
    setState(() {
      if (q.isEmpty) {
        _filteredParts = CategoryClassifier.defaultParts;
      } else {
        _filteredParts = CategoryClassifier.defaultParts.where((p) {
          return p.name.toLowerCase().contains(q) ||
              p.rootGroup.toLowerCase().contains(q);
        }).toList();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final query = _searchCtrl.text.trim();

    return Scaffold(
      backgroundColor: AppColors.bgDark,
      body: SafeArea(
        child: Column(
          children: [
            // Top Search Input Bar
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
                      child: TextField(
                        controller: _searchCtrl,
                        autofocus: true,
                        style: const TextStyle(
                          color: AppColors.txDark,
                          fontSize: 15,
                          fontFamily: 'Hind Siliguri',
                        ),
                        decoration: const InputDecoration(
                          hintText: 'যেমন: হা, কার্টিজ, Axio...',
                          hintStyle: TextStyle(color: AppColors.muDark, fontSize: 14),
                          contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                          border: InputBorder.none,
                          isDense: true,
                        ),
                        onChanged: _onSearchChanged,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const Divider(color: AppColors.lineDark, height: 1),

            // Filtered Items List
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                children: [
                  ..._filteredParts.map((part) {
                    return InkWell(
                      onTap: () {
                        widget.onSelected(part.name, part.rootGroup, part.defaultUnit);
                        Navigator.pop(context);
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        decoration: const BoxDecoration(
                          border: Border(
                            bottom: BorderSide(color: AppColors.lineDark, width: 0.8),
                          ),
                        ),
                        child: Row(
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    part.name,
                                    style: const TextStyle(
                                      color: AppColors.txDark,
                                      fontSize: 16,
                                      fontWeight: FontWeight.w600,
                                      fontFamily: 'Hind Siliguri',
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    part.rootGroup,
                                    style: const TextStyle(
                                      color: AppColors.muDark,
                                      fontSize: 13,
                                      fontFamily: 'Hind Siliguri',
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                              decoration: BoxDecoration(
                                color: AppColors.s2Dark,
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(color: AppColors.lineDark),
                              ),
                              child: Text(
                                part.defaultUnit,
                                style: const TextStyle(
                                  color: AppColors.txDark,
                                  fontSize: 12.5,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }),

                  // Add Custom Item if user typed something not fully matching
                  if (query.isNotEmpty) ...[
                    InkWell(
                      onTap: () {
                        final auto = CategoryClassifier.classify(query);
                        widget.onSelected(query, auto.rootGroup, auto.defaultUnit);
                        Navigator.pop(context);
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        child: Row(
                          children: [
                            const Icon(Icons.add_circle_outline, color: AppColors.unl, size: 22),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'নতুন পার্টস যোগ করুন: “$query”',
                                    style: const TextStyle(
                                      color: AppColors.unl,
                                      fontSize: 15,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                  const Text(
                                    'স্বয়ংক্রিয় ক্যাটাগরি ও একক সহ যুক্ত হবে',
                                    style: TextStyle(color: AppColors.muDark, fontSize: 12),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
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
