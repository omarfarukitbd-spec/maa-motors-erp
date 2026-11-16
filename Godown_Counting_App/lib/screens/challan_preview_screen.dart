import 'package:flutter/material.dart';
import '../models/challan_model.dart';
import '../services/challan_pdf_service.dart';

class ChallanPreviewScreen extends StatelessWidget {
  final ChallanDocument challan;

  const ChallanPreviewScreen({super.key, required this.challan});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0B132B),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F172A),
        title: const Text(
          'চালানপত্র প্রিভিউ ও রিপোর্ট',
          style: TextStyle(color: Colors.white, fontSize: 16),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.print, color: Color(0xFF38BDF8)),
            onPressed: () {
              ChallanPdfService.printChallanA4(challan);
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
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
              // Header
              Center(
                child: Column(
                  children: [
                    const Text(
                      'মেসার্স মা মোটরস',
                      style: TextStyle(
                        color: Color(0xFF002D72),
                        fontSize: 20,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    const SizedBox(height: 2),
                    const Text(
                      'জাপানি রিকন্ডিশন্ড অটো পার্টস পাইকারি ও খুচরা বিক্রেতা',
                      style: TextStyle(color: Color(0xFF64748B), fontSize: 10),
                    ),
                    const SizedBox(height: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
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
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 14),
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
                    _buildMetaRow('চালান নং:', challan.challanNo, 'তারিখ:', '${challan.date.day}/${challan.date.month}/${challan.date.year}'),
                    const SizedBox(height: 4),
                    _buildMetaRow('গাড়ির নম্বর:', challan.vehicleNo, 'ড্রাইভার/খালাসী:', challan.driverName),
                    const SizedBox(height: 4),
                    _buildMetaRow('গোডাউন স্থান:', challan.godownLocation, 'গেটপাস নং:', challan.gatePassNo),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Table 1: Category Roll-Up Summary (User's primary requirement!)
              const Text(
                '১. চালানি পণ্যের মূল সামারি (CATEGORY SUMMARY):',
                style: TextStyle(
                  color: Color(0xFF0369A1),
                  fontSize: 12,
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
                    0: FlexColumnWidth(1.2),
                    1: FlexColumnWidth(2.5),
                    2: FlexColumnWidth(1.2),
                  },
                  children: [
                    const TableRow(
                      decoration: BoxDecoration(color: Color(0xFF0F172A)),
                      children: [
                        Padding(
                          padding: EdgeInsets.all(6),
                          child: Text('ক্রম', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                        ),
                        Padding(
                          padding: EdgeInsets.all(6),
                          child: Text('পণ্যের বিবরণ (গ্রুপ)', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                        ),
                        Padding(
                          padding: EdgeInsets.all(6),
                          child: Text('মোট পরিমাণ', textAlign: TextAlign.right, style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                        ),
                      ],
                    ),
                    ...challan.categorySummaries.asMap().entries.map((entry) {
                      final idx = entry.key + 1;
                      final s = entry.value;
                      return TableRow(
                        decoration: BoxDecoration(
                          color: entry.key % 2 == 0 ? Colors.white : const Color(0xFFF8FAFC),
                        ),
                        children: [
                          Padding(
                            padding: const EdgeInsets.all(6),
                            child: Text('$idx', style: const TextStyle(fontSize: 11, color: Color(0xFF0F172A))),
                          ),
                          Padding(
                            padding: const EdgeInsets.all(6),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  s.rootGroup,
                                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF0284C7)),
                                ),
                                Text(
                                  s.modelsBreakdown,
                                  style: const TextStyle(fontSize: 9, color: Color(0xFF64748B)),
                                ),
                              ],
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.all(6),
                            child: Text(
                              '${s.totalQuantity} ${s.unit}',
                              textAlign: TextAlign.right,
                              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: Color(0xFF0F172A)),
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
                          child: Text('সর্বমোট চালানি পণ্য:', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF002D72))),
                        ),
                        Padding(
                          padding: const EdgeInsets.all(6),
                          child: Text(
                            '${challan.totalPcs} পিস',
                            textAlign: TextAlign.right,
                            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: Color(0xFF059669)),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // Signatures
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  _buildSignBox('খালাসী / প্রদানকারীর স্বাক্ষর'),
                  _buildSignBox('গোডাউন ইনচার্জ / গ্রহীতা'),
                  _buildSignBox('কর্তৃপক্ষ অনুমোদন'),
                ],
              ),
              const SizedBox(height: 20),

              // Action Buttons
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        side: const BorderSide(color: Color(0xFF0284C7)),
                      ),
                      onPressed: () => Navigator.pop(context),
                      child: const Text('গণনায় ফিরে যান', style: TextStyle(color: Color(0xFF0284C7))),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF0284C7),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                      ),
                      icon: const Icon(Icons.print, color: Colors.white),
                      label: const Text('প্রিন্ট A4 চালান', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                      onPressed: () {
                        ChallanPdfService.printChallanA4(challan);
                      },
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
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
                TextSpan(text: val1, style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
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
                TextSpan(text: val2, style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
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
          style: const TextStyle(fontSize: 8, color: Color(0xFF475569), fontWeight: FontWeight.bold),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }
}
