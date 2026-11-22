import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/challan_model.dart';
import '../providers/counting_provider.dart';
import '../utils/app_colors.dart';
import '../utils/bangla_tools.dart';
import '../widgets/godown_top_bar.dart';
import '../services/audio_engine_service.dart';
import '../services/whatsapp_memo_service.dart';
import 'challan_view_screen.dart';

class ChallanHistoryScreen extends StatefulWidget {
  const ChallanHistoryScreen({super.key});

  @override
  State<ChallanHistoryScreen> createState() => _ChallanHistoryScreenState();
}

class _ChallanHistoryScreenState extends State<ChallanHistoryScreen> {
  final AudioEngineService _audio = AudioEngineService();
  final TextEditingController _searchCtrl = TextEditingController();

  String _activeFilter = 'all'; // 'all' | 'inward' | 'outward' | 'today'
  String _searchQuery = '';

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  bool _isToday(DateTime d) {
    final now = DateTime.now();
    return d.year == now.year && d.month == now.month && d.day == now.day;
  }

  List<ChallanDocument> _filterChallans(List<ChallanDocument> all) {
    List<ChallanDocument> filtered = all;

    if (_activeFilter == 'inward') {
      filtered = filtered.where((c) => c.sessionType == 'inward').toList();
    } else if (_activeFilter == 'outward') {
      filtered = filtered.where((c) => c.sessionType == 'outward').toList();
    } else if (_activeFilter == 'today') {
      filtered = filtered.where((c) => _isToday(c.date)).toList();
    }

    if (_searchQuery.trim().isNotEmpty) {
      final q = _searchQuery.trim().toLowerCase();
      filtered = filtered.where((c) {
        final challanNo = c.displayChallanNo.toLowerCase();
        final party = (c.customerName.isNotEmpty ? c.customerName : c.productOwner).toLowerCase();
        final vehicle = c.vehicleNo.toLowerCase();
        final driver = c.driverName.toLowerCase();
        final staff = c.countedByUserName.toLowerCase();
        final phone = c.customerPhone.toLowerCase();
        return challanNo.contains(q) ||
            party.contains(q) ||
            vehicle.contains(q) ||
            driver.contains(q) ||
            staff.contains(q) ||
            phone.contains(q);
      }).toList();
    }

    return filtered;
  }

  String _formatChallanDate(DateTime d) {
    final months = [
      'জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'
    ];
    final dayStr = BanglaTools.toBanglaDigits(d.day);
    final monthStr = months[d.month - 1];
    final yearStr = BanglaTools.toBanglaDigits(d.year);
    final hour = d.hour > 12 ? d.hour - 12 : (d.hour == 0 ? 12 : d.hour);
    final ampm = d.hour >= 12 ? 'বিকাল' : 'সকাল';
    final minuteStr = BanglaTools.toBanglaDigits(d.minute.toString().padLeft(2, '0'));
    return '$dayStr $monthStr $yearStr · $ampm ${BanglaTools.toBanglaDigits(hour)}:$minuteStr';
  }

  @override
  Widget build(BuildContext context) {
    final counting = context.watch<CountingProvider>();
    final allHistory = counting.sessionHistory;
    final filteredHistory = _filterChallans(allHistory);

    final inwardCount = allHistory.where((c) => c.sessionType == 'inward').length;
    final outwardCount = allHistory.where((c) => c.sessionType == 'outward').length;
    final todayCount = allHistory.where((c) => _isToday(c.date)).length;

    final totalPcsFiltered = filteredHistory.fold<int>(0, (sum, c) => sum + c.totalPcs);

    return Scaffold(
      backgroundColor: AppColors.bgDark,
      appBar: GodownTopBar(
        title: 'চালান ইতিহাস ও সার্চ',
        audioEngine: _audio,
        onSoundToggled: () => setState(() {}),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Search Bar
              Container(
                height: 46,
                decoration: BoxDecoration(
                  color: AppColors.s2Dark,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.lineDark),
                ),
                child: TextField(
                  controller: _searchCtrl,
                  style: const TextStyle(color: Colors.white, fontSize: 13.5),
                  decoration: InputDecoration(
                    hintText: 'চালান নং, কাস্টমার, গাড়ির নং বা ড্রাইভার...',
                    hintStyle: const TextStyle(color: AppColors.muDark, fontSize: 12.5),
                    prefixIcon: const Icon(Icons.search, color: AppColors.muDark, size: 18),
                    suffixIcon: _searchCtrl.text.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear, color: AppColors.muDark, size: 16),
                            onPressed: () {
                              _searchCtrl.clear();
                              setState(() => _searchQuery = '');
                            },
                          )
                        : null,
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                  onChanged: (v) => setState(() => _searchQuery = v),
                ),
              ),
              const SizedBox(height: 10),

              // Filter Tabs
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    _buildFilterChip('all', 'সব (${allHistory.length})', AppColors.load),
                    const SizedBox(width: 8),
                    _buildFilterChip('inward', 'খালাস ($inwardCount)', AppColors.unl),
                    const SizedBox(width: 8),
                    _buildFilterChip('outward', 'ডেলিভারি ($outwardCount)', const Color(0xFF10B981)),
                    const SizedBox(width: 8),
                    _buildFilterChip('today', 'আজকের ($todayCount)', const Color(0xFFFBBF24)),
                  ],
                ),
              ),
              const SizedBox(height: 10),

              // Summary bar
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: const Color(0xFF0F172A),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: const Color(0xFF1E293B)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'প্রদর্শিত চালান: ${BanglaTools.toBanglaDigits(filteredHistory.length)} টি',
                      style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11.5, fontWeight: FontWeight.bold),
                    ),
                    Text(
                      'মোট মালামাল: ${BanglaTools.toBanglaDigits(totalPcsFiltered)} পিস',
                      style: const TextStyle(color: AppColors.load, fontSize: 12, fontWeight: FontWeight.w900),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 10),

              // Challans List
              Expanded(
                child: filteredHistory.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.receipt_long_outlined, color: AppColors.muDark, size: 44),
                            const SizedBox(height: 8),
                            Text(
                              _searchQuery.isNotEmpty
                                  ? 'এই সার্চে কোনো চালান মেলেনি'
                                  : 'এখনো কোনো চালান তৈরি হয়নি',
                              style: const TextStyle(color: AppColors.muDark, fontSize: 13.5),
                            ),
                          ],
                        ),
                      )
                    : ListView.separated(
                        itemCount: filteredHistory.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 10),
                        itemBuilder: (context, idx) {
                          final doc = filteredHistory[idx];
                          final isInward = doc.sessionType == 'inward';
                          final badgeColor = isInward ? AppColors.unl : AppColors.load;
                          final badgeText = isInward ? 'আনলোডিং' : 'ডেলিভারি';
                          final party = doc.customerName.isNotEmpty ? doc.customerName : doc.productOwner;

                          return InkWell(
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => ChallanViewScreen(
                                    mode: isInward ? 'unl' : 'load',
                                    existingChallan: doc,
                                  ),
                                ),
                              );
                            },
                            borderRadius: BorderRadius.circular(14),
                            child: Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: AppColors.s1Dark,
                                borderRadius: BorderRadius.circular(14),
                                border: Border.all(color: AppColors.lineDark),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  // Top Row: Challan No & Badge
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Row(
                                        children: [
                                          Text(
                                            BanglaTools.toBanglaDigits(doc.displayChallanNo),
                                            style: const TextStyle(
                                              color: Colors.white,
                                              fontSize: 16,
                                              fontWeight: FontWeight.w900,
                                              fontFamily: 'Hind Siliguri',
                                            ),
                                          ),
                                          if (doc.revisionNumber > 0) ...[
                                            const SizedBox(width: 6),
                                            Container(
                                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1.5),
                                              decoration: BoxDecoration(
                                                color: const Color(0xFFFBBF24).withOpacity(0.2),
                                                borderRadius: BorderRadius.circular(4),
                                              ),
                                              child: Text(
                                                'সংশোধিত ${BanglaTools.toBanglaDigits(doc.revisionNumber)}',
                                                style: const TextStyle(color: Color(0xFFFBBF24), fontSize: 9.5, fontWeight: FontWeight.bold),
                                              ),
                                            ),
                                          ],
                                        ],
                                      ),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                        decoration: BoxDecoration(
                                          color: badgeColor.withOpacity(0.18),
                                          borderRadius: BorderRadius.circular(6),
                                          border: Border.all(color: badgeColor.withOpacity(0.3)),
                                        ),
                                        child: Text(
                                          badgeText,
                                          style: TextStyle(
                                            color: badgeColor,
                                            fontSize: 11,
                                            fontWeight: FontWeight.w800,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 6),

                                  // Date & Party
                                  Row(
                                    children: [
                                      const Icon(Icons.storefront, color: AppColors.muDark, size: 14),
                                      const SizedBox(width: 4),
                                      Expanded(
                                        child: Text(
                                          party,
                                          style: const TextStyle(color: Color(0xFFE2E8F0), fontSize: 13, fontWeight: FontWeight.bold),
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 4),

                                  // Vehicle & Driver
                                  Row(
                                    children: [
                                      const Icon(Icons.local_shipping_outlined, color: AppColors.muDark, size: 14),
                                      const SizedBox(width: 4),
                                      Text(
                                        doc.vehicleNo.isNotEmpty ? doc.vehicleNo : 'গাড়ির নং অনির্ধারিত',
                                        style: const TextStyle(color: Color(0xFF38BDF8), fontSize: 12, fontWeight: FontWeight.w600),
                                      ),
                                      if (doc.driverName.isNotEmpty) ...[
                                        const SizedBox(width: 6),
                                        Text('(${doc.driverName})', style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11)),
                                      ],
                                      const Spacer(),
                                      Text(
                                        '${BanglaTools.toBanglaDigits(doc.totalPcs)} পিস',
                                        style: const TextStyle(
                                          color: Colors.white,
                                          fontSize: 15,
                                          fontWeight: FontWeight.w900,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const Divider(color: Color(0xFF1E293B), height: 16),

                                  // Bottom Row: Date & Staff & WhatsApp Quick Copy
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        _formatChallanDate(doc.date),
                                        style: const TextStyle(color: AppColors.muDark, fontSize: 11),
                                      ),
                                      Row(
                                        children: [
                                          InkWell(
                                            onTap: () {
                                              _audio.triggerHaptic();
                                              final memo = WhatsappMemoService.generateTextMemo(doc);
                                              WhatsappMemoService.copyToClipboard(context, memo);
                                            },
                                            child: Container(
                                              padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                                              decoration: BoxDecoration(
                                                color: const Color(0xFF16A34A).withOpacity(0.18),
                                                borderRadius: BorderRadius.circular(4),
                                                border: Border.all(color: const Color(0xFF16A34A).withOpacity(0.4)),
                                              ),
                                              child: const Row(
                                                mainAxisSize: MainAxisSize.min,
                                                children: [
                                                  Icon(Icons.copy, color: Color(0xFF22C55E), size: 11),
                                                  SizedBox(width: 4),
                                                  Text(
                                                    'স্লিপ কপি',
                                                    style: TextStyle(color: Color(0xFF22C55E), fontSize: 10, fontWeight: FontWeight.bold),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ),
                                          const SizedBox(width: 8),
                                          const Icon(Icons.person_pin, color: AppColors.load, size: 13),
                                          const SizedBox(width: 4),
                                          Text(
                                            doc.countedByUserName.isNotEmpty ? doc.countedByUserName : 'মোঃ এমরান',
                                            style: const TextStyle(color: Color(0xFFCBD5E1), fontSize: 11, fontWeight: FontWeight.bold),
                                          ),
                                          const SizedBox(width: 4),
                                          const Icon(Icons.chevron_right, color: Colors.white38, size: 15),
                                        ],
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFilterChip(String key, String label, Color accentColor) {
    final isSelected = _activeFilter == key;
    return InkWell(
      onTap: () => setState(() => _activeFilter = key),
      borderRadius: BorderRadius.circular(10),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? accentColor : AppColors.s1Dark,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: isSelected ? accentColor : AppColors.lineDark,
            width: 1,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? Colors.black : Colors.white70,
            fontSize: 12,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }
}
