import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../models/challan_model.dart';
import '../utils/app_colors.dart';
import '../utils/bangla_tools.dart';

class WhatsappMemoService {
  /// Generate a clean, structured Bengali WhatsApp text memo
  static String generateTextMemo(ChallanDocument challan, {String? staffName}) {
    final buffer = StringBuffer();
    buffer.writeln('*মেসার্স মা মোটরস*');
    buffer.writeln('গোডাউন-১, রেলগেট সংলগ্ন, মুরাদপুর, চট্টগ্রাম');
    buffer.writeln('মোবাইল: ০১৮১৯-৩৯৭৬৬৯, ০১৮১৫-৭০৭৯৩৪');
    buffer.writeln('--------------------------------');

    final isUnload = challan.sessionType == 'inward';
    final typeName = isUnload
        ? 'গাড়ি থেকে আনলোডিং চালান (খালাস)'
        : 'গাড়িতে ডেলিভারি চালান (গেটপাস)';
    final revText = challan.revisionNumber > 0
        ? ' (সংশোধিত ${BanglaTools.toBanglaDigits(challan.revisionNumber)})'
        : '';

    buffer.writeln('*চালান নং:* ${challan.displayChallanNo}$revText');
    buffer.writeln('*তারিখ:* ${BanglaTools.formatBanglaDate(challan.date)}');
    buffer.writeln('*ধরন:* $typeName');

    final party = challan.customerName.isNotEmpty ? challan.customerName : challan.productOwner;
    if (party.isNotEmpty) {
      buffer.writeln('*প্রাপক / পার্টি:* $party');
    }
    if (challan.customerPhone.isNotEmpty) {
      buffer.writeln('*পার্টির মোবাইল:* ${challan.customerPhone}');
    }
    final address = challan.customerAddress.isNotEmpty ? challan.customerAddress : challan.destinationFor;
    if (address.isNotEmpty) {
      buffer.writeln('*ডেলিভারি ঠিকানা:* $address');
    }
    if (challan.vehicleNo.isNotEmpty) {
      buffer.writeln('*গাড়ি নম্বর:* ${challan.vehicleNo}');
    }
    if (challan.driverName.isNotEmpty) {
      final phone = challan.driverMobile.isNotEmpty ? ' (${challan.driverMobile})' : '';
      buffer.writeln('*চালক:* ${challan.driverName}$phone');
    }
    if (challan.sealNo.isNotEmpty) {
      buffer.writeln('*সিকিউরিটি সিল:* ${challan.sealNo}');
    }

    buffer.writeln('--------------------------------');
    buffer.writeln('*পণ্যের বিবরণ:*');

    int calculatedTotal = 0;
    for (int i = 0; i < challan.items.length; i++) {
      final item = challan.items[i];
      calculatedTotal += item.quantity;
      final numBn = BanglaTools.toBanglaDigits(i + 1);
      final qtyBn = BanglaTools.toBanglaDigits(item.quantity);
      buffer.writeln('$numBn. ${item.partNameBn} — $qtyBn ${item.unit}');
    }

    final totalDisplay = challan.totalPcs > 0 ? challan.totalPcs : calculatedTotal;

    buffer.writeln('--------------------------------');
    buffer.writeln('*সর্বমোট পরিমাণ:* ${BanglaTools.toBanglaDigits(totalDisplay)} পিস/সেট');
    final activeStaff = staffName ?? (challan.countedByUserName.isNotEmpty ? challan.countedByUserName : 'কাউন্টার কর্মী');
    buffer.writeln('*কাউন্টার কর্মী:* $activeStaff');
    buffer.writeln('*গোডাউন ইনচার্জ:* মোঃ এমরান (গোডাউন-১)');
    if (challan.verificationCode.isNotEmpty) {
      buffer.writeln('*যাচাই কোড:* ${challan.verificationCode}');
    }
    buffer.writeln('--------------------------------');
    buffer.writeln('_মা মোটরস ইআরপি সিস্টেম (মুরাদপুর, চট্টগ্রাম) থেকে প্রস্তুত_');

    return buffer.toString();
  }

  /// Copy text to clipboard and show feedback snackbar
  static void copyToClipboard(BuildContext context, String text) {
    Clipboard.setData(ClipboardData(text: text));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        backgroundColor: AppColors.load,
        content: Row(
          children: [
            Icon(Icons.copy, color: AppColors.textOnAccent, size: 18),
            SizedBox(width: 8),
            Text(
              'হোয়াটসঅ্যাপ স্লিপ টেক্সট কপি হয়েছে!',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ],
        ),
        duration: Duration(seconds: 2),
      ),
    );
  }

  /// Show professional Modal Bottom Sheet with WhatsApp Text & PDF options
  static void showShareOptionsSheet(
    BuildContext context, {
    required ChallanDocument challan,
    required String staffName,
    required VoidCallback onSharePdf,
    required VoidCallback onPrintA4,
    required VoidCallback onPrintPos,
  }) {
    final textMemo = generateTextMemo(challan, staffName: staffName);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF0F172A),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        return Padding(
          padding: EdgeInsets.only(
            left: 16,
            right: 16,
            top: 16,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 16,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.share, color: Color(0xFF22C55E), size: 22),
                      SizedBox(width: 8),
                      Text(
                        'চালান শেয়ার ও স্লিপ প্রেরণ',
                        style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: AppColors.muDark),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              const Divider(color: AppColors.lineDark),
              const SizedBox(height: 6),

              // WhatsApp Text Slip Section
              const Text(
                '১. হোয়াটসঅ্যাপ টেক্সট স্লিপ (কপি / মেসেজ)',
                style: TextStyle(color: Color(0xFF22C55E), fontSize: 13, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 4),
              const Text(
                'ড্রাইভার বা পার্টিকে সংক্ষেপে দ্রুত পাঠাতে নিচের টেক্সট কপি করে হোয়াটসঅ্যাপে পেস্ট করুন:',
                style: TextStyle(color: AppColors.muDark, fontSize: 11),
              ),
              const SizedBox(height: 8),

              // Text preview container
              Container(
                width: double.infinity,
                constraints: const BoxConstraints(maxHeight: 180),
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color(0xFF1E293B),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: const Color(0xFF334155)),
                ),
                child: SingleChildScrollView(
                  child: SelectableText(
                    textMemo,
                    style: const TextStyle(
                      color: Color(0xFFE2E8F0),
                      fontSize: 11.5,
                      fontFamily: 'monospace',
                      height: 1.4,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 10),

              // Action button to Copy Text
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF16A34A),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                  icon: const Icon(Icons.copy, size: 18),
                  label: const Text(
                    'হোয়াটসঅ্যাপ স্লিপ কপি করুন',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                  ),
                  onPressed: () {
                    copyToClipboard(ctx, textMemo);
                  },
                ),
              ),
              const SizedBox(height: 16),

              // PDF Gate-pass Section
              const Text(
                '২. অফিসিয়াল PDF চালান ও প্রিন্ট',
                style: TextStyle(color: Color(0xFF38BDF8), fontSize: 13, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: Color(0xFF38BDF8)),
                        foregroundColor: const Color(0xFF38BDF8),
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      icon: const Icon(Icons.picture_as_pdf, size: 16),
                      label: const Text('PDF শেয়ার', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                      onPressed: () {
                        Navigator.pop(ctx);
                        onSharePdf();
                      },
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: OutlinedButton.icon(
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: AppColors.lineDark),
                        foregroundColor: AppColors.txDark,
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      icon: const Icon(Icons.print, size: 16),
                      label: const Text('A4 প্রিন্ট', style: TextStyle(fontSize: 12)),
                      onPressed: () {
                        Navigator.pop(ctx);
                        onPrintA4();
                      },
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: OutlinedButton.icon(
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: AppColors.lineDark),
                        foregroundColor: AppColors.txDark,
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      icon: const Icon(Icons.receipt, size: 16),
                      label: const Text('POS প্রিন্ট', style: TextStyle(fontSize: 12)),
                      onPressed: () {
                        Navigator.pop(ctx);
                        onPrintPos();
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
            ],
          ),
        );
      },
    );
  }
}
