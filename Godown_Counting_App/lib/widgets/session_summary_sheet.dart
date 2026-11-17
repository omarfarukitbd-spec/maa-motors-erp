import 'dart:async';
import 'package:flutter/material.dart';
import '../utils/app_colors.dart';
import '../utils/bangla_tools.dart';

class SessionItemData {
  final String name;
  final String category;
  final String unit;
  int quantity;

  SessionItemData({
    required this.name,
    required this.category,
    required this.unit,
    required this.quantity,
  });
}

class SessionSummarySheet extends StatefulWidget {
  final String mode; // 'unl' or 'load'
  final List<SessionItemData> items;
  final VoidCallback onCreateChallan;
  final VoidCallback onCancelSession;

  const SessionSummarySheet({
    super.key,
    required this.mode,
    required this.items,
    required this.onCreateChallan,
    required this.onCancelSession,
  });

  @override
  State<SessionSummarySheet> createState() => _SessionSummarySheetState();
}

class _SessionSummarySheetState extends State<SessionSummarySheet> {
  Timer? _holdTimer;
  bool _isHolding = false;

  void _startHold() {
    setState(() => _isHolding = true);
    _holdTimer = Timer(const Duration(milliseconds: 1200), () {
      widget.onCancelSession();
      Navigator.pop(context);
    });
  }

  void _cancelHold() {
    _holdTimer?.cancel();
    if (_isHolding) {
      setState(() => _isHolding = false);
    }
  }

  @override
  void dispose() {
    _holdTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isUnloading = widget.mode == 'unl';
    final modeColor = isUnloading ? AppColors.unl : AppColors.load;
    final modeText = isUnloading ? 'গাড়ি থেকে নামানো' : 'গাড়িতে মাল তোলা';

    final totalCount = widget.items.fold<int>(0, (sum, i) => sum + i.quantity);

    return Container(
      height: MediaQuery.of(context).size.height * 0.82,
      decoration: const BoxDecoration(
        color: AppColors.s1Dark,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(22),
          topRight: Radius.circular(22),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black45,
            blurRadius: 20,
            offset: Offset(0, -6),
          ),
        ],
      ),
      child: Column(
        children: [
          // Drag Handle
          const SizedBox(height: 10),
          Container(
            width: 44,
            height: 4,
            decoration: BoxDecoration(
              color: AppColors.lineDark,
              borderRadius: BorderRadius.circular(4),
            ),
          ),
          const SizedBox(height: 12),

          // Header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 18),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${BanglaTools.toBanglaDigits(widget.items.length)}টি পণ্য',
                      style: const TextStyle(
                        color: AppColors.txDark,
                        fontSize: 22,
                        fontWeight: FontWeight.w800,
                        fontFamily: 'Hind Siliguri',
                      ),
                    ),
                    Text(
                      'সর্বমোট: ${BanglaTools.toBanglaDigits(totalCount)} পিস',
                      style: const TextStyle(color: AppColors.muDark, fontSize: 13),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                  decoration: BoxDecoration(
                    color: modeColor,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    modeText,
                    style: const TextStyle(
                      color: AppColors.textOnAccent,
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),
          const Divider(color: AppColors.lineDark, height: 1),

          // Items List
          Expanded(
            child: widget.items.isEmpty
                ? const Center(
                    child: Text(
                      'এখনো কোনো পণ্য যোগ হয়নি',
                      style: TextStyle(color: AppColors.muDark, fontSize: 14),
                    ),
                  )
                : ListView.separated(
                    padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                    itemCount: widget.items.length,
                    separatorBuilder: (_, __) =>
                        const Divider(color: AppColors.lineDark, height: 1),
                    itemBuilder: (context, idx) {
                      final item = widget.items[idx];
                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  item.name,
                                  style: const TextStyle(
                                    color: AppColors.txDark,
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                Text(
                                  item.category,
                                  style: const TextStyle(
                                    color: AppColors.muDark,
                                    fontSize: 12.5,
                                  ),
                                ),
                              ],
                            ),
                            Text(
                              '${BanglaTools.toBanglaDigits(item.quantity)} ${item.unit}',
                              style: TextStyle(
                                color: modeColor,
                                fontSize: 16,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
          ),

          // CTA Button: Create Challan
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: SizedBox(
              width: double.infinity,
              height: 64,
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: modeColor,
                  foregroundColor: AppColors.textOnAccent,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  elevation: 0,
                ),
                icon: const Icon(Icons.receipt_long, size: 22),
                label: const Text(
                  'চালান তৈরি করুন',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                onPressed: widget.items.isEmpty ? null : widget.onCreateChallan,
              ),
            ),
          ),
          const SizedBox(height: 10),

          // Hold to cancel
          GestureDetector(
            onLongPressStart: (_) => _startHold(),
            onLongPressEnd: (_) => _cancelHold(),
            onTapDown: (_) => _startHold(),
            onTapUp: (_) => _cancelHold(),
            onTapCancel: () => _cancelHold(),
            child: Container(
              height: 48,
              alignment: Alignment.center,
              child: Text(
                _isHolding ? 'ধরে রাখুন…' : 'গণনা বাতিল (চেপে ধরুন)',
                style: TextStyle(
                  color: _isHolding ? AppColors.dng : AppColors.dng.withOpacity(0.8),
                  fontSize: 14.5,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),
          const SizedBox(height: 12),
        ],
      ),
    );
  }
}
