import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/challan_model.dart';
import '../providers/auth_provider.dart';
import '../services/challan_pdf_service.dart';

class ChallanPreviewScreen extends StatelessWidget {
  final ChallanDocument challan;

  const ChallanPreviewScreen({super.key, required this.challan});

  void _handlePrint(BuildContext context, AuthProvider auth) {
    if (auth.isSoftLocked) {
      _showSoftLockWarning(context);
      return;
    }
    ChallanPdfService.printChallanA4(challan, tenant: auth.currentTenant);
  }

  void _handleShare(BuildContext context, AuthProvider auth) {
    if (auth.isSoftLocked) {
      _showSoftLockWarning(context);
      return;
    }
    ChallanPdfService.shareChallanPdf(challan, tenant: auth.currentTenant);
  }

  void _showSoftLockWarning(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF0F172A),
        title: const Row(
          children: [
            Icon(Icons.lock_clock, color: Colors.amber, size: 20),
            SizedBox(width: 8),
            Text('সফট-লক নিরাপত্তা সতর্কতা',
                style: TextStyle(color: Colors.white, fontSize: 14)),
          ],
        ),
        content: const Text(
          'আপনার লাইসেন্সের মেয়াদ শেষ হয়েছে। সফট-লক অবস্থায় চালান তৈরি ও হিসেব দেখা সচল থাকলেও প্রিন্ট এবং WhatsApp এ শেয়ার করা স্থগিত রাখা হয়েছে। লাইসেন্স নবায়নের জন্য অ্যাডমিনের সাথে যোগাযোগ করুন।',
          style: TextStyle(color: Color(0xFFCBD5E1), fontSize: 12),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('ঠিক আছে', style: TextStyle(color: Color(0xFF38BDF8))),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    return Scaffold(
      backgroundColor: const Color(0xFF0B132B),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F172A),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'চালানপত্র প্রিভিউ ও অফিসিয়াল রিপোর্ট',
              style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold),
            ),
            Text(
              'ভেরিফিকেশন কোড: ${challan.verificationCode}',
              style: const TextStyle(color: Color(0xFF38BDF8), fontSize: 10, fontFamily: 'monospace'),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.share, color: Color(0xFF34D399), size: 20),
            tooltip: 'WhatsApp / PDF শেয়ার',
            onPressed: () => _handleShare(context, auth),
          ),
          IconButton(
            icon: const Icon(Icons.print, color: Color(0xFF38BDF8), size: 20),
            tooltip: 'A4 প্রিন্ট',
            onPressed: () => _handlePrint(context, auth),
          ),
        ],
      ),
      body: Column(
        children: [
          // Soft-Lock Notice Banner if locked
          if (auth.isSoftLocked)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              color: const Color(0xFF7F1D1D),
              child: const Row(
                children: [
                  Icon(Icons.lock_clock, color: Colors.amber, size: 16),
                  SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'সফট-লক মোড: চালান দেখা ও প্রিভিউ চালু আছে। নতুন প্রিন্ট ও শেয়ার স্থগিত।',
                      style: TextStyle(color: Colors.white, fontSize: 11),
                    ),
                  ),
                ],
              ),
            ),

          // Main Scrollable Challan Preview Sheet
          Expanded(
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.all(12),
              child: Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(10),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.2),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Header Banner
                    Center(
                      child: Column(
                        children: [
                          Text(
                            auth.currentTenant?.shopName ?? 'মেসার্স মা মোটরস',
                            style: const TextStyle(
                              color: Color(0xFF002D72),
                              fontSize: 18,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                          const SizedBox(height: 2),
                          const Text(
                            'জাপানি রিকন্ডিশন্ড অটো পার্টস পাইকারি ও খুচরা বিক্রেতা',
                            style: TextStyle(color: Color(0xFF64748B), fontSize: 10),
                          ),
                          const SizedBox(height: 6),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 3),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF0F172A),
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: Text(
                                  challan.sessionType == 'inward'
                                      ? 'মাল আনলোডিং / ইনওয়ার্ড চালান'
                                      : 'মাল লোডিং / ডেলিভারি চালান',
                                  style: const TextStyle(
                                    color: Color(0xFFFFD700),
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: challan.isLocked
                                      ? const Color(0xFF065F46)
                                      : const Color(0xFF1E293B),
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: Text(
                                  challan.isLocked ? 'লকড (চূড়ান্ত)' : 'ড্রাফট',
                                  style: TextStyle(
                                    color: challan.isLocked ? Colors.white : Colors.amberAccent,
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                              if (challan.isRevision) ...[
                                const SizedBox(width: 6),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF991B1B),
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: Text(
                                    'REV-${challan.revisionNumber}',
                                    style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold),
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                    const Divider(color: Color(0xFFCBD5E1), thickness: 1),

                    // Metadata Grid
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF8FAFC),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                      ),
                      child: Column(
                        children: [
                          _buildMetaRow(
                            'চালান নং:',
                            challan.displayChallanNo,
                            'তারিখ ও সময়:',
                            '${challan.date.day}/${challan.date.month}/${challan.date.year}',
                          ),
                          const SizedBox(height: 5),
                          _buildMetaRow(
                            'গাড়ির নম্বর:',
                            challan.vehicleNo,
                            'ড্রাইভার ও মোবাইল:',
                            '${challan.driverName} ${challan.driverMobile}',
                          ),
                          const SizedBox(height: 5),
                          _buildMetaRow(
                            'গোডাউন স্থান:',
                            challan.godownLocation,
                            'গেটপাস নং:',
                            challan.gatePassNo,
                          ),
                          const SizedBox(height: 5),
                          _buildMetaRow(
                            'ভেরিফিকেশন কোড:',
                            challan.verificationCode,
                            'ডিভাইস ট্র্যাকিং:',
                            challan.devicePrefix != null
                                ? '${challan.devicePrefix}-${challan.deviceSerialNo}'
                                : 'ডিভাইস-১',
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 14),

                    // Table 1: Category Roll-Up Summary
                    const Text(
                      '১. চালানি পণ্যের মূল সামারি (CATEGORY SUMMARY):',
                      style: TextStyle(
                        color: Color(0xFF0369A1),
                        fontSize: 11.5,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Container(
                      decoration: BoxDecoration(
                        border: Border.all(color: const Color(0xFFCBD5E1)),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Table(
                        border: TableBorder.all(color: const Color(0xFFE2E8F0)),
                        columnWidths: const {
                          0: FlexColumnWidth(1.0),
                          1: FlexColumnWidth(2.6),
                          2: FlexColumnWidth(1.2),
                        },
                        children: [
                          const TableRow(
                            decoration: BoxDecoration(color: Color(0xFF0F172A)),
                            children: [
                              Padding(
                                padding: EdgeInsets.all(6),
                                child: Text('ক্রম',
                                    style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold)),
                              ),
                              Padding(
                                padding: EdgeInsets.all(6),
                                child: Text('পণ্যের বিবরণ (গ্রুপ)',
                                    style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold)),
                              ),
                              Padding(
                                padding: EdgeInsets.all(6),
                                child: Text('মোট পরিমাণ',
                                    textAlign: TextAlign.right,
                                    style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold)),
                              ),
                            ],
                          ),
                          ...challan.categorySummaries.asMap().entries.map((entry) {
                            final idx = entry.key + 1;
                            final s = entry.value;
                            return TableRow(
                              decoration: BoxDecoration(
                                color: entry.key % 2 == 0
                                    ? Colors.white
                                    : const Color(0xFFF8FAFC),
                              ),
                              children: [
                                Padding(
                                  padding: const EdgeInsets.all(6),
                                  child: Text('$idx',
                                      style: const TextStyle(
                                          fontSize: 11, color: Color(0xFF0F172A))),
                                ),
                                Padding(
                                  padding: const EdgeInsets.all(6),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        s.rootGroup,
                                        style: const TextStyle(
                                            fontSize: 11.5,
                                            fontWeight: FontWeight.bold,
                                            color: Color(0xFF0284C7)),
                                      ),
                                      if (s.modelsBreakdown.isNotEmpty)
                                        Text(
                                          s.modelsBreakdown,
                                          style: const TextStyle(
                                              fontSize: 9, color: Color(0xFF64748B)),
                                        ),
                                    ],
                                  ),
                                ),
                                Padding(
                                  padding: const EdgeInsets.all(6),
                                  child: Text(
                                    '${s.totalQuantity} ${s.unit}',
                                    textAlign: TextAlign.right,
                                    style: const TextStyle(
                                        fontSize: 11.5,
                                        fontWeight: FontWeight.w900,
                                        color: Color(0xFF0F172A)),
                                  ),
                                ),
                              ],
                            );
                          }),
                          TableRow(
                            decoration: const BoxDecoration(color: Color(0xFFEFF6FF)),
                            children: [
                              const Padding(padding: EdgeInsets.all(6), child: SizedBox()),
                              const Padding(
                                padding: EdgeInsets.all(6),
                                child: Text('সর্বমোট চালানি পণ্য:',
                                    style: TextStyle(
                                        fontSize: 11,
                                        fontWeight: FontWeight.w900,
                                        color: Color(0xFF002D72))),
                              ),
                              Padding(
                                padding: const EdgeInsets.all(6),
                                child: Text(
                                  '${challan.totalPcs} পিস',
                                  textAlign: TextAlign.right,
                                  style: const TextStyle(
                                      fontSize: 12.5,
                                      fontWeight: FontWeight.w900,
                                      color: Color(0xFF059669)),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Institutional Signatures (3 parties)
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _buildSignBox('খালাসী / ড্রাইভার স্বাক্ষর'),
                        _buildSignBox('গোডাউন ইনচার্জ / গ্রহীতা'),
                        _buildSignBox('কর্তৃপক্ষ অনুমোদন'),
                      ],
                    ),
                    const SizedBox(height: 10),
                  ],
                ),
              ),
            ),
          ),

          // Bottom Fixed Action Bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            color: const Color(0xFF0F172A),
            child: Row(
              children: [
                Expanded(
                  flex: 2,
                  child: OutlinedButton(
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      side: const BorderSide(color: Color(0xFF38BDF8)),
                    ),
                    onPressed: () => Navigator.pop(context),
                    child: const Text('গণনায় ফিরে যান',
                        style: TextStyle(color: Color(0xFF38BDF8), fontSize: 12)),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  flex: 3,
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF059669),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                    icon: const Icon(Icons.share, color: Colors.white, size: 16),
                    label: const Text('WhatsApp শেয়ার',
                        style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 11.5)),
                    onPressed: () => _handleShare(context, auth),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  flex: 3,
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0284C7),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                    icon: const Icon(Icons.print, color: Colors.white, size: 16),
                    label: const Text('A4 প্রিন্ট',
                        style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 12)),
                    onPressed: () => _handlePrint(context, auth),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMetaRow(String label1, String val1, String label2, String val2) {
    return Row(
      children: [
        Expanded(
          child: RichText(
            text: TextSpan(
              style: const TextStyle(fontSize: 10, color: Color(0xFF64748B)),
              children: [
                TextSpan(text: '$label1 '),
                TextSpan(
                    text: val1,
                    style: const TextStyle(
                        fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
              ],
            ),
          ),
        ),
        Expanded(
          child: RichText(
            text: TextSpan(
              style: const TextStyle(fontSize: 10, color: Color(0xFF64748B)),
              children: [
                TextSpan(text: '$label2 '),
                TextSpan(
                    text: val2,
                    style: const TextStyle(
                        fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
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
        Container(
          width: 95,
          height: 1,
          color: const Color(0xFF64748B),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(
              fontSize: 8, color: Color(0xFF475569), fontWeight: FontWeight.bold),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }
}
