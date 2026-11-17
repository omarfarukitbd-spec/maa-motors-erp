import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/challan_model.dart';
import '../providers/auth_provider.dart';
import '../providers/counting_provider.dart';
import '../services/challan_pdf_service.dart';
import '../utils/app_colors.dart';
import '../utils/bangla_tools.dart';
import '../widgets/godown_top_bar.dart';
import '../widgets/session_summary_sheet.dart';
import '../services/audio_engine_service.dart';

class ChallanViewScreen extends StatefulWidget {
  final String mode; // 'unl' or 'load'
  final List<SessionItemData>? sessionItems;
  final ChallanDocument? existingChallan;
  final bool isDemoSample;

  const ChallanViewScreen({
    super.key,
    this.mode = 'load',
    this.sessionItems,
    this.existingChallan,
    this.isDemoSample = false,
  });

  @override
  State<ChallanViewScreen> createState() => _ChallanViewScreenState();
}

class _ChallanViewScreenState extends State<ChallanViewScreen> {
  final AudioEngineService _audio = AudioEngineService();
  late List<SessionItemData> _items;
  late String _challanNo;
  int _revision = 0;
  bool _isLocked = false;
  String _verificationCode = '';

  @override
  void initState() {
    super.initState();
    if (widget.isDemoSample) {
      _items = [
        SessionItemData(name: 'Axio হাবস', category: 'হাবস', unit: 'পিস', quantity: 25),
        SessionItemData(name: 'Fielder হাবস', category: 'হাবস', unit: 'পিস', quantity: 20),
        SessionItemData(name: 'কার্টিজ', category: 'কার্টিজ', unit: 'পিস', quantity: 60),
        SessionItemData(name: 'ইঞ্জিন', category: 'ইঞ্জিন', unit: 'সেট', quantity: 5),
        SessionItemData(name: 'ব্রেক ডিস্ক', category: 'ব্রেক', unit: 'পিস', quantity: 12),
      ];
      _challanNo = 'A1-00123';
      _isLocked = false;
    } else if (widget.existingChallan != null) {
      final ch = widget.existingChallan!;
      _items = ch.items.map((i) {
        return SessionItemData(
          name: i.name,
          category: i.category,
          unit: i.unit,
          quantity: i.quantity,
        );
      }).toList();
      _challanNo = ch.displayChallanNo;
      _revision = ch.revisionNumber;
      _isLocked = ch.isLocked;
      _verificationCode = ch.verificationCode;
    } else {
      _items = widget.sessionItems ?? [];
      _challanNo = 'A1-${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}';
      _isLocked = false;
    }
  }

  void _lockAndSaveChallan() {
    if (_isLocked) return;
    setState(() {
      _isLocked = true;
      _verificationCode = BanglaTools.generateVerificationCode(_challanNo, _revision, _items);
    });

    // Save to Provider
    final itemModels = _items.map((i) {
      return ChallanItem(
        partNameBn: i.name,
        rootGroup: i.category,
        quantity: i.quantity,
        unit: i.unit,
      );
    }).toList();

    context.read<CountingProvider>().addCompletedChallanDirectly(
          challanNo: _challanNo,
          sessionType: widget.mode == 'unl' ? 'inward' : 'outward',
          vehicleNo: 'চট্ট-মেট্রো ড-১১-৪৮২১',
          driverName: 'রহিম উদ্দিন',
          items: itemModels,
          isLocked: true,
          verificationCode: _verificationCode,
          revisionNumber: _revision,
        );
  }

  void _createNewRevision() {
    setState(() {
      _revision++;
      _isLocked = false;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('নতুন সংস্করণ তৈরি। পূর্বেরটি ইতিহাসে সংরক্ষিত রয়েছে।'),
      ),
    );
  }

  void _handlePrintOrShare(String actionName, AuthProvider auth) {
    if (auth.isSoftLocked) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          backgroundColor: AppColors.dng,
          content: Text('সফট-লক মোডে প্রিন্ট ও শেয়ার স্থগিত আছে। লাইসেন্স নবায়ন করুন।'),
        ),
      );
      return;
    }

    _lockAndSaveChallan();
    _audio.triggerHaptic();

    // Call PDF generation
    final challanDoc = ChallanDocument(
      id: _challanNo,
      challanNo: _challanNo,
      date: DateTime.now(),
      vehicleNo: 'চট্ট-মেট্রো ড-১১-৪৮২১',
      driverName: 'রহিম উদ্দিন',
      driverMobile: '০১৮১৯-XXXXXX',
      sessionType: widget.mode == 'unl' ? 'inward' : 'outward',
      isLocked: true,
      verificationCode: _verificationCode,
      revisionNumber: _revision,
      items: _items.map((i) => ChallanItem(
            partNameBn: i.name,
            rootGroup: i.category,
            quantity: i.quantity,
            unit: i.unit,
          )).toList(),
      categorySummaries: [],
    );

    if (actionName == 'print_a4') {
      ChallanPdfService.printChallanA4(challanDoc, tenant: auth.currentTenant);
    } else if (actionName == 'print_pos') {
      ChallanPdfService.printChallanPos(challanDoc, tenant: auth.currentTenant);
    } else {
      ChallanPdfService.shareChallanPdf(challanDoc, tenant: auth.currentTenant);
    }

    final actionLabel = actionName == 'print_a4'
        ? 'A4 প্রিন্ট'
        : actionName == 'print_pos'
            ? 'POS প্রিন্ট'
            : 'শেয়ার';
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('$actionLabel সম্পন্ন · চালান লক হয়েছে')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final isUnloading = widget.mode == 'unl';
    final modeText = isUnloading ? 'গাড়ি থেকে নামানো' : 'গাড়িতে মাল তোলা';

    // Calculate Category Rollups
    final Map<String, int> catRollups = {};
    for (var i in _items) {
      final key = '${i.category}|${i.unit}';
      catRollups[key] = (catRollups[key] ?? 0) + i.quantity;
    }

    // Calculate Unit Totals
    final Map<String, int> unitTotals = {};
    for (var i in _items) {
      unitTotals[i.unit] = (unitTotals[i.unit] ?? 0) + i.quantity;
    }
    final totalSummaryStr = unitTotals.entries
        .map((e) => '${BanglaTools.toBanglaDigits(e.value)} ${e.key}')
        .join(' + ');

    return Scaffold(
      backgroundColor: AppColors.bgDark,
      appBar: GodownTopBar(
        title: auth.shopDisplayName,
        audioEngine: _audio,
        onSoundToggled: () => setState(() {}),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Top Lock Status Bar
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              color: AppColors.s2Dark,
              child: Row(
                children: [
                  Icon(
                    _isLocked ? Icons.lock : Icons.lock_open,
                    size: 16,
                    color: _isLocked ? AppColors.unl : AppColors.load,
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      auth.isSoftLocked
                          ? 'প্রিন্ট ও শেয়ার বন্ধ আছে। চালান দেখা চলবে'
                          : _isLocked
                              ? 'চালান লক আছে। ভুল থাকলে নতুন সংস্করণ বানান'
                              : 'প্রিন্ট বা শেয়ার করলে চালান লক হবে',
                      style: const TextStyle(color: AppColors.txDark, fontSize: 12.5),
                    ),
                  ),
                  if (_isLocked && !auth.isSoftLocked) ...[
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.unl,
                        foregroundColor: AppColors.textOnAccent,
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        minimumSize: const Size(0, 32),
                      ),
                      onPressed: _createNewRevision,
                      child: const Text('সংশোধিত চালান', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ],
              ),
            ),

            // Scrollable Printable Paper Sheet
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(12),
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: AppColors.paperBg,
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Shop Branded Banner Header
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
                        decoration: BoxDecoration(
                          color: const Color(0xFF0F172A),
                          borderRadius: BorderRadius.circular(4),
                          border: Border.all(color: AppColors.load, width: 1.5),
                        ),
                        child: Column(
                          children: [
                            Text(
                              auth.shopDisplayName,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 18,
                                fontWeight: FontWeight.w900,
                                fontFamily: 'Hind Siliguri',
                              ),
                              textAlign: TextAlign.center,
                            ),
                            if (auth.currentTenant != null) ...[
                              const SizedBox(height: 2),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  if (auth.currentTenant!.ownerName.isNotEmpty) ...[
                                    Text(
                                      'প্রো: ${auth.currentTenant!.ownerName}',
                                      style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 10, fontWeight: FontWeight.bold),
                                    ),
                                    const SizedBox(width: 8),
                                    const Text('•', style: TextStyle(color: Color(0xFF64748B), fontSize: 10)),
                                    const SizedBox(width: 8),
                                  ],
                                  Text(
                                    'মোবাইল: ${auth.currentTenant!.phone}',
                                    style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 10, fontWeight: FontWeight.bold),
                                  ),
                                ],
                              ),
                            ],
                          ],
                        ),
                      ),
                      const SizedBox(height: 10),

                      // Metadata Grid
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 4),
                        child: Column(
                          children: [
                            _metaRow('চালান নং:', '$_challanNo${_revision > 0 ? " (সংশোধিত ${BanglaTools.toBanglaDigits(_revision)})" : ""}', 'তারিখ:', BanglaTools.formatBanglaDate(DateTime.now())),
                            const SizedBox(height: 4),
                            _metaRow('ধরন:', modeText, 'গাড়ি নং:', 'চট্ট-মেট্রো ড-১১-৪৮২১'),
                            const SizedBox(height: 4),
                            _metaRow('ড্রাইভার:', 'রহিম উদ্দিন', 'পার্টি:', 'আলম অটো পার্টস'),
                            const SizedBox(height: 4),
                            _metaRow('গোডাউন:', 'মা মোটরস প্রধান গোডাউন', 'গন্তব্য:', 'ঢাকা'),
                          ],
                        ),
                      ),
                      const SizedBox(height: 12),

                      // Category Summary Rollup Box
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          border: Border.all(color: AppColors.paperText, width: 1.5),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'সারসংক্ষেপ (ক্যাটাগরি অনুযায়ী):',
                              style: TextStyle(
                                color: AppColors.paperText,
                                fontSize: 13,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Wrap(
                              spacing: 12,
                              runSpacing: 4,
                              children: catRollups.entries.map((entry) {
                                final parts = entry.key.split('|');
                                final cat = parts[0];
                                final u = parts[1];
                                return Text(
                                  '$cat: ${BanglaTools.toBanglaDigits(entry.value)} $u',
                                  style: const TextStyle(
                                    color: AppColors.paperText,
                                    fontSize: 12.5,
                                    fontWeight: FontWeight.bold,
                                  ),
                                );
                              }).toList(),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 12),

                      // Detailed Table
                      Table(
                        border: TableBorder.all(color: AppColors.paperBorder),
                        columnWidths: const {
                          0: FlexColumnWidth(0.8),
                          1: FlexColumnWidth(2.6),
                          2: FlexColumnWidth(1.6),
                          3: FlexColumnWidth(1.0),
                        },
                        children: [
                          const TableRow(
                            decoration: BoxDecoration(color: AppColors.paperBanner),
                            children: [
                              Padding(
                                padding: EdgeInsets.all(5),
                                child: Text('ক্রম', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
                              ),
                              Padding(
                                padding: EdgeInsets.all(5),
                                child: Text('পণ্যের নাম', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                              ),
                              Padding(
                                padding: EdgeInsets.all(5),
                                child: Text('পরিমাণ', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
                              ),
                              Padding(
                                padding: EdgeInsets.all(5),
                                child: Text('একক', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
                              ),
                            ],
                          ),
                          ..._items.asMap().entries.map((entry) {
                            final idx = entry.key;
                            final item = entry.value;
                            return TableRow(
                              decoration: BoxDecoration(
                                color: idx % 2 == 1 ? const Color(0xFFF0F3F5) : Colors.white,
                              ),
                              children: [
                                Padding(
                                  padding: const EdgeInsets.all(5),
                                  child: Text(BanglaTools.toBanglaDigits(idx + 1), textAlign: TextAlign.center, style: const TextStyle(fontSize: 11, color: AppColors.paperText)),
                                ),
                                Padding(
                                  padding: const EdgeInsets.all(5),
                                  child: Text(item.name, style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w600, color: AppColors.paperText)),
                                ),
                                Padding(
                                  padding: const EdgeInsets.all(2),
                                  child: _isLocked
                                      ? Text(
                                          BanglaTools.toBanglaDigits(item.quantity),
                                          textAlign: TextAlign.center,
                                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.paperText),
                                        )
                                      : Row(
                                          mainAxisAlignment: MainAxisAlignment.center,
                                          children: [
                                            InkWell(
                                              onTap: () {
                                                if (item.quantity > 1) {
                                                  setState(() => item.quantity--);
                                                }
                                              },
                                              child: Container(
                                                width: 22,
                                                height: 22,
                                                alignment: Alignment.center,
                                                decoration: BoxDecoration(color: const Color(0xFFE6EBEF), borderRadius: BorderRadius.circular(4), border: Border.all(color: const Color(0xFFB9C3CB))),
                                                child: const Text('−', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppColors.paperText)),
                                              ),
                                            ),
                                            Padding(
                                              padding: const EdgeInsets.symmetric(horizontal: 4),
                                              child: Text(BanglaTools.toBanglaDigits(item.quantity), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppColors.paperText)),
                                            ),
                                            InkWell(
                                              onTap: () => setState(() => item.quantity++),
                                              child: Container(
                                                width: 22,
                                                height: 22,
                                                alignment: Alignment.center,
                                                decoration: BoxDecoration(color: const Color(0xFFE6EBEF), borderRadius: BorderRadius.circular(4), border: Border.all(color: const Color(0xFFB9C3CB))),
                                                child: const Text('+', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppColors.paperText)),
                                              ),
                                            ),
                                          ],
                                        ),
                                ),
                                Padding(
                                  padding: const EdgeInsets.all(5),
                                  child: Text(item.unit, textAlign: TextAlign.center, style: const TextStyle(fontSize: 11, color: AppColors.paperText)),
                                ),
                              ],
                            );
                          }),
                        ],
                      ),
                      const SizedBox(height: 6),

                      // Grand Total
                      Align(
                        alignment: Alignment.centerRight,
                        child: Text(
                          'সর্বমোট: $totalSummaryStr',
                          style: const TextStyle(
                            color: AppColors.paperText,
                            fontSize: 13.5,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                      ),
                      const SizedBox(height: 32),

                      // 3 Institutional Signatures
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          _buildSignBox('মাল গণনাকারী'),
                          _buildSignBox('ড্রাইভার (টিপসই)'),
                          _buildSignBox('রিসিভার / ইনচার্জ'),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Verification Block
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF8FAFC),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: AppColors.paperBorder),
                        ),
                        child: Row(
                          children: [
                            Icon(
                              _isLocked ? Icons.qr_code_2 : Icons.lock_clock,
                              size: 40,
                              color: AppColors.paperText,
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    _isLocked
                                        ? 'যাচাই কোড: $_verificationCode'
                                        : 'যাচাই কোড চালান লক করার পর তৈরি হবে',
                                    style: const TextStyle(
                                      color: AppColors.paperText,
                                      fontSize: 12,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                  const Text(
                                    'মাস্টার অ্যাপ থেকে কোড স্ক্যান করে আসল চালান যাচাই করা যাবে',
                                    style: TextStyle(color: Color(0xFF64748B), fontSize: 10),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            // Bottom Action Bar: A4, POS, WhatsApp
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: const BoxDecoration(
                color: AppColors.bgDark,
                border: Border(top: BorderSide(color: AppColors.lineDark)),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: _buildActBtn(
                      label: 'A4 প্রিন্ট',
                      icon: Icons.print,
                      isPrimary: false,
                      onTap: () => _handlePrintOrShare('print_a4', auth),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: _buildActBtn(
                      label: 'POS প্রিন্ট',
                      icon: Icons.receipt,
                      isPrimary: false,
                      onTap: () => _handlePrintOrShare('print_pos', auth),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: _buildActBtn(
                      label: 'হোয়াটসঅ্যাপ',
                      icon: Icons.share,
                      isPrimary: true,
                      onTap: () => _handlePrintOrShare('share', auth),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _metaRow(String l1, String v1, String l2, String v2) {
    return Row(
      children: [
        Expanded(
          child: RichText(
            text: TextSpan(
              style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
              children: [
                TextSpan(text: '$l1 ', style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.paperText)),
                TextSpan(text: v1, style: const TextStyle(color: AppColors.paperText)),
              ],
            ),
          ),
        ),
        Expanded(
          child: RichText(
            text: TextSpan(
              style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
              children: [
                TextSpan(text: '$l2 ', style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.paperText)),
                TextSpan(text: v2, style: const TextStyle(color: AppColors.paperText)),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSignBox(String label) {
    return Column(
      children: [
        Container(width: 85, height: 1.5, color: AppColors.paperText),
        const SizedBox(height: 3),
        Text(
          label,
          style: const TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold, color: AppColors.paperText),
        ),
      ],
    );
  }

  Widget _buildActBtn({
    required String label,
    required IconData icon,
    required bool isPrimary,
    required VoidCallback onTap,
  }) {
    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        backgroundColor: isPrimary ? AppColors.unl : AppColors.s2Dark,
        foregroundColor: isPrimary ? AppColors.textOnAccent : AppColors.txDark,
        padding: const EdgeInsets.symmetric(vertical: 10),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(14),
          side: BorderSide(
            color: isPrimary ? AppColors.unl : AppColors.lineDark,
            width: 1.5,
          ),
        ),
        elevation: 0,
      ),
      onPressed: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 18),
          const SizedBox(height: 2),
          Text(label, style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
