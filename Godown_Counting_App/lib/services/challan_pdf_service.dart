import 'dart:typed_data';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import '../models/challan_model.dart';
import '../models/tenant_model.dart';
import 'offline_storage_service.dart';
import 'firebase_sync_service.dart';

class ChallanPdfService {
  /// Generate A4 PDF Document bytes
  static Future<Uint8List> generateA4PdfBytes(
    ChallanDocument challan, {
    Tenant? tenant,
  }) async {
    final pdf = pw.Document();
    final font = await PdfGoogleFonts.hindSiliguriRegular();
    final fontBold = await PdfGoogleFonts.hindSiliguriBold();

    const shopTitle = 'মেসার্স মা মোটরস';
    final isUnloading = challan.sessionType == 'inward';
    final sessionBadgeText = isUnloading ? 'গাড়ি থেকে আনলোডিং (Unloading Gate-Pass)' : 'গাড়িতে ডেলিভারি (Delivery Gate-Pass)';
    final badgeColor = isUnloading ? const PdfColor.fromInt(0xFF0284C7) : const PdfColor.fromInt(0xFF059669);
    const headerColor = PdfColor.fromInt(0xFF0F172A); // Maa Motors Corporate Slate

    final partyName = challan.customerName.isNotEmpty ? challan.customerName : challan.productOwner;
    final partyAddress = challan.customerAddress.isNotEmpty ? challan.customerAddress : challan.destinationFor;
    final partyPhone = challan.customerPhone.isNotEmpty ? challan.customerPhone : '---';
    final sealNo = challan.sealNo.isNotEmpty ? challan.sealNo : 'প্রযোজ্য নয়';

    pdf.addPage(
      pw.MultiPage(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(24),
        build: (pw.Context context) {
          return [
            // Header Banner / Shop Title
            pw.Container(
              padding: const pw.EdgeInsets.symmetric(vertical: 10, horizontal: 14),
              decoration: pw.BoxDecoration(
                color: headerColor,
                borderRadius: pw.BorderRadius.circular(6),
              ),
              child: pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.start,
                    children: [
                      pw.Text(
                        shopTitle,
                        style: pw.TextStyle(
                          font: fontBold,
                          fontSize: 18,
                          color: PdfColors.white,
                        ),
                      ),
                      pw.SizedBox(height: 2),
                      pw.Text(
                        'প্রোপ্রাইটর: মোঃ ওমর ফারুক • মোবাইল: ০১৮১৯-৩৯৭৬৬৯, ০১৮১৫-৭০৭৯৩৪',
                        style: pw.TextStyle(font: font, fontSize: 9, color: PdfColors.grey200),
                      ),
                      pw.Text(
                        'গোডাউন-১, রেলগেট সংলগ্ন, মুরাদপুর, চট্টগ্রাম',
                        style: pw.TextStyle(font: font, fontSize: 8.5, color: PdfColors.grey300),
                      ),
                    ],
                  ),
                  pw.Container(
                    padding: const pw.EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: pw.BoxDecoration(
                      color: badgeColor,
                      borderRadius: pw.BorderRadius.circular(4),
                    ),
                    child: pw.Text(
                      sessionBadgeText,
                      style: pw.TextStyle(font: fontBold, fontSize: 9.5, color: PdfColors.white),
                    ),
                  ),
                ],
              ),
            ),
            pw.SizedBox(height: 10),

            // Metadata Grid
            pw.Container(
              padding: const pw.EdgeInsets.all(8),
              decoration: pw.BoxDecoration(
                border: pw.Border.all(color: PdfColors.grey400, width: 0.5),
                borderRadius: pw.BorderRadius.circular(4),
              ),
              child: pw.Column(
                children: [
                  pw.Row(
                    mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                    children: [
                      _metaItem('চালান নং:', challan.displayChallanNo, fontBold, font),
                      _metaItem('তারিখ ও সময়:', _formatDate(challan.date), fontBold, font),
                      _metaItem('ভেরিফিকেশন কোড:', challan.verificationCode, fontBold, font),
                    ],
                  ),
                  pw.SizedBox(height: 6),
                  pw.Row(
                    mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                    children: [
                      _metaItem('প্রাপক / পার্টি:', partyName, fontBold, font),
                      _metaItem('ডেলিভারি ঠিকানা:', partyAddress, fontBold, font),
                      _metaItem('পার্টি মোবাইল:', partyPhone, fontBold, font),
                    ],
                  ),
                  pw.SizedBox(height: 6),
                  pw.Row(
                    mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                    children: [
                      _metaItem('গাড়ি নম্বর:', challan.vehicleNo, fontBold, font),
                      _metaItem('চালকের নাম ও ফোন:', '${challan.driverName} ${challan.driverMobile}'.trim(), fontBold, font),
                      _metaItem('সিকিউরিটি সিল নং:', sealNo, fontBold, font),
                    ],
                  ),
                  pw.SizedBox(height: 6),
                  pw.Row(
                    mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                    children: [
                      _metaItem('চালানের ধরন:', sessionBadgeText, fontBold, font),
                      _metaItem('গেট পাস নং:', challan.gatePassNo, fontBold, font),
                      _metaItem('গণনাকারী স্টাফ:', challan.countedByUserName, fontBold, font),
                    ],
                  ),
                ],
              ),
            ),
            pw.SizedBox(height: 10),

            // Category Summary Roll-up Box
            if (challan.categorySummaries.isNotEmpty) ...[
              pw.Container(
                padding: const pw.EdgeInsets.all(6),
                decoration: pw.BoxDecoration(
                  color: PdfColors.grey100,
                  border: pw.Border.all(color: PdfColors.grey300, width: 0.5),
                  borderRadius: pw.BorderRadius.circular(4),
                ),
                child: pw.Column(
                  crossAxisAlignment: pw.CrossAxisAlignment.start,
                  children: [
                    pw.Text('গ্রুপ ভিত্তিক মোট সারসংক্ষেপ (Category Roll-up):',
                        style: pw.TextStyle(font: fontBold, fontSize: 10, color: PdfColors.blueGrey800)),
                    pw.SizedBox(height: 4),
                    pw.Wrap(
                      spacing: 12,
                      runSpacing: 4,
                      children: challan.categorySummaries.map((s) {
                        return pw.Text(
                          '• ${s.rootGroup}: ${s.totalQuantity} ${s.unit}',
                          style: pw.TextStyle(font: fontBold, fontSize: 9),
                        );
                      }).toList(),
                    ),
                  ],
                ),
              ),
              pw.SizedBox(height: 10),
            ],

            // Items Table
            pw.Table(
              border: pw.TableBorder.all(color: PdfColors.grey400, width: 0.5),
              columnWidths: const {
                0: pw.FixedColumnWidth(28),
                1: pw.FlexColumnWidth(3),
                2: pw.FlexColumnWidth(1.5),
                3: pw.FixedColumnWidth(48),
                4: pw.FixedColumnWidth(40),
              },
              children: [
                pw.TableRow(
                  decoration: const pw.BoxDecoration(color: PdfColors.blueGrey100),
                  children: [
                    _th('নং', fontBold),
                    _th('পণ্যের বিবরণ / পার্টসের নাম', fontBold),
                    _th('ক্যাটাগরি গ্রুপ', fontBold),
                    _th('পরিমাণ', fontBold),
                    _th('একক', fontBold),
                  ],
                ),
                ...challan.items.asMap().entries.map((entry) {
                  final idx = entry.key + 1;
                  final item = entry.value;
                  return pw.TableRow(
                    children: [
                      _td('$idx', font, align: pw.TextAlign.center),
                      _td(item.partNameBn, font),
                      _td(item.rootGroup, font),
                      _td('${item.quantity}', fontBold, align: pw.TextAlign.center),
                      _td(item.unit, font, align: pw.TextAlign.center),
                    ],
                  );
                }),
                // Total Row
                pw.TableRow(
                  decoration: const pw.BoxDecoration(color: PdfColors.grey200),
                  children: [
                    _td('', font),
                    _td('সর্বমোট গণনা করা হয়েছে:', fontBold),
                    _td('${challan.items.length} টি পদ', fontBold),
                    _td('${challan.totalPcs}', fontBold, align: pw.TextAlign.center),
                    _td('পিস/সেট', fontBold, align: pw.TextAlign.center),
                  ],
                ),
              ],
            ),
            pw.SizedBox(height: 30),

            // 3 Institutional Signatures
            pw.Row(
              mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
              children: [
                _signatureBox('কাউন্টার কর্মীর স্বাক্ষর', challan.countedByUserName.isNotEmpty ? challan.countedByUserName : 'মা মোটরস কর্মী', font),
                _signatureBox('মাল প্রাপক / ড্রাইভারের স্বাক্ষর', challan.driverName.isNotEmpty ? '${challan.driverName} (ড্রাইভার)' : 'ড্রাইভারের সই ও তারিখ', font),
                _signatureBox('গোডাউন ইনচার্জের স্বাক্ষর', 'মোঃ এমরান (ইনচার্জ)', font),
              ],
            ),
            pw.SizedBox(height: 20),

            // Footer
            pw.Row(
              mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
              children: [
                pw.Text('চালান প্রস্তুতের সময়: ${_formatDate(challan.date)}',
                    style: pw.TextStyle(font: font, fontSize: 8, color: PdfColors.grey600)),
                pw.Text('মা মোটরস গোডাউন-১ (মুরাদপুর, চট্টগ্রাম) • ERP Sync',
                    style: pw.TextStyle(font: font, fontSize: 8, color: PdfColors.grey600)),
              ],
            ),
          ];
        },
      ),
    );

    return pdf.save();
  }

  /// Print or show system print preview
  static Future<void> printChallanA4(
    ChallanDocument challan, {
    Tenant? tenant,
  }) async {
    final pdfBytes = await generateA4PdfBytes(challan, tenant: tenant);

    // Auto-lock challan in storage upon print execution
    await OfflineStorageService.lockChallan(challan.id);
    // Background cloud sync to Maa Motors ERP Firestore
    FirebaseSyncService().backupChallanToCloud(challan, tenant: tenant);

    await Printing.layoutPdf(
      onLayout: (PdfPageFormat format) async => pdfBytes,
      name: 'Challan-${challan.displayChallanNo}',
    );
  }

  /// Share PDF via WhatsApp or system intent
  static Future<void> shareChallanPdf(
    ChallanDocument challan, {
    Tenant? tenant,
  }) async {
    final pdfBytes = await generateA4PdfBytes(challan, tenant: tenant);

    // Auto-lock challan in storage upon share
    await OfflineStorageService.lockChallan(challan.id);
    // Background cloud sync to Maa Motors ERP Firestore
    FirebaseSyncService().backupChallanToCloud(challan, tenant: tenant);

    await Printing.sharePdf(
      bytes: pdfBytes,
      filename: 'Challan-${challan.displayChallanNo}.pdf',
    );
  }

  /// Generate 80mm Thermal POS Receipt PDF Document bytes
  static Future<Uint8List> generatePosPdfBytes(
    ChallanDocument challan, {
    Tenant? tenant,
  }) async {
    final pdf = pw.Document();
    final font = await PdfGoogleFonts.hindSiliguriRegular();
    final fontBold = await PdfGoogleFonts.hindSiliguriBold();

    final isUnloading = challan.sessionType == 'inward';

    pdf.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.roll80,
        margin: const pw.EdgeInsets.symmetric(horizontal: 8, vertical: 12),
        build: (pw.Context context) {
          return pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.center,
            children: [
              // Header
              pw.Text('মেসার্স মা মোটরস', style: pw.TextStyle(font: fontBold, fontSize: 13), textAlign: pw.TextAlign.center),
              pw.Text('প্রো: মোঃ ওমর ফারুক • ০১8১৯-৩৯৭৬৬৯', style: pw.TextStyle(font: font, fontSize: 7.5), textAlign: pw.TextAlign.center),
              pw.Text('গোডাউন-১, রেলগেট সংলগ্ন, মুরাদপুর, চট্টগ্রাম', style: pw.TextStyle(font: font, fontSize: 7), textAlign: pw.TextAlign.center),
              pw.Container(
                margin: const pw.EdgeInsets.symmetric(vertical: 4),
                padding: const pw.EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: pw.BoxDecoration(
                  color: isUnloading ? const PdfColor.fromInt(0xFF0284C7) : const PdfColor.fromInt(0xFF059669),
                  borderRadius: pw.BorderRadius.circular(3),
                ),
                child: pw.Text(
                  isUnloading ? '[ আনলোডিং চালান / খালাস ]' : '[ ডেলিভারি চালান / গেটপাস ]',
                  style: pw.TextStyle(font: fontBold, fontSize: 7.5, color: PdfColors.white),
                ),
              ),
              pw.Text('- - - - - - - - - - - - - - - - - - - - - - - - - - -', style: pw.TextStyle(font: font, fontSize: 7)),
              pw.SizedBox(height: 2),

              // Metadata
              pw.Align(
                alignment: pw.Alignment.centerLeft,
                child: pw.Column(
                  crossAxisAlignment: pw.CrossAxisAlignment.start,
                  children: [
                    _posMetaRow('চালান নং:', challan.displayChallanNo, fontBold, font),
                    _posMetaRow('তারিখ:', _formatDate(challan.date), fontBold, font),
                    _posMetaRow('প্রাপক/পার্টি:', challan.customerName.isNotEmpty ? challan.customerName : challan.productOwner, fontBold, font),
                    if (challan.customerPhone.isNotEmpty)
                      _posMetaRow('পার্টি ফোন:', challan.customerPhone, fontBold, font),
                    if (challan.customerAddress.isNotEmpty)
                      _posMetaRow('ঠিকানা:', challan.customerAddress, fontBold, font),
                    _posMetaRow('গাড়ি নং:', challan.vehicleNo, fontBold, font),
                    _posMetaRow('ড্রাইভার:', '${challan.driverName} ${challan.driverMobile}'.trim(), fontBold, font),
                    if (challan.sealNo.isNotEmpty)
                      _posMetaRow('সিল নং:', challan.sealNo, fontBold, font),
                  ],
                ),
              ),
              pw.SizedBox(height: 4),
              pw.Text('- - - - - - - - - - - - - - - - - - - - - - - - - - -', style: pw.TextStyle(font: font, fontSize: 7)),
              pw.SizedBox(height: 4),

              // Item Table
              pw.Table(
                columnWidths: {
                  0: const pw.FlexColumnWidth(1),
                  1: const pw.FlexColumnWidth(4),
                  2: const pw.FlexColumnWidth(1.8),
                  3: const pw.FlexColumnWidth(1.2),
                },
                children: [
                  pw.TableRow(
                    decoration: const pw.BoxDecoration(color: PdfColors.grey200),
                    children: [
                      _posTh('নং', fontBold),
                      _posTh('পণ্যের বিবরণ', fontBold, align: pw.TextAlign.left),
                      _posTh('পরিমাণ', fontBold),
                      _posTh('একক', fontBold),
                    ],
                  ),
                  ...challan.items.asMap().entries.map((entry) {
                    final idx = entry.key + 1;
                    final item = entry.value;
                    return pw.TableRow(
                      children: [
                        _posTd('$idx', font),
                        _posTd(item.partNameBn, font, align: pw.TextAlign.left),
                        _posTd('${item.quantity}', fontBold),
                        _posTd(item.unit, font),
                      ],
                    );
                  }),
                ],
              ),
              pw.SizedBox(height: 4),
              pw.Text('- - - - - - - - - - - - - - - - - - - - - - - - - - -', style: pw.TextStyle(font: font, fontSize: 7)),
              pw.SizedBox(height: 2),

              // Total
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Text('সর্বমোট পরিমাণ:', style: pw.TextStyle(font: fontBold, fontSize: 9)),
                  pw.Text('${challan.totalPcs} পিস', style: pw.TextStyle(font: fontBold, fontSize: 10)),
                ],
              ),
              pw.SizedBox(height: 6),

              // Verification Code & QR
              pw.BarcodeWidget(
                barcode: pw.Barcode.qrCode(),
                data: 'CHALLAN:${challan.displayChallanNo}|CODE:${challan.verificationCode}|PCS:${challan.totalPcs}',
                width: 44,
                height: 44,
              ),
              pw.SizedBox(height: 2),
              pw.Text('যাচাই কোড: ${challan.verificationCode}', style: pw.TextStyle(font: fontBold, fontSize: 7)),
              pw.SizedBox(height: 12),

              // Signatures
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  _posSignBox('কাউন্টার কর্মী', font),
                  _posSignBox('ড্রাইভার', font),
                  _posSignBox('মোঃ এমরান (ইনচার্জ)', font),
                ],
              ),
              pw.SizedBox(height: 6),
              pw.Text('মেসার্স মা মোটরস • গোডাউন-১, মুরাদপুর, চট্টগ্রাম', style: pw.TextStyle(font: font, fontSize: 6.5, color: PdfColors.grey600)),
            ],
          );
        },
      ),
    );

    return pdf.save();
  }

  /// Print Thermal POS Receipt
  static Future<void> printChallanPos(
    ChallanDocument challan, {
    Tenant? tenant,
  }) async {
    final pdfBytes = await generatePosPdfBytes(challan, tenant: tenant);

    // Auto-lock challan in storage upon print execution
    await OfflineStorageService.lockChallan(challan.id);
    // Background cloud sync to Maa Motors ERP Firestore
    FirebaseSyncService().backupChallanToCloud(challan, tenant: tenant);

    await Printing.layoutPdf(
      onLayout: (PdfPageFormat format) async => pdfBytes,
      name: 'POS-${challan.displayChallanNo}',
    );
  }

  static pw.Widget _posMetaRow(String label, String value, pw.Font bold, pw.Font regular) {
    return pw.Padding(
      padding: const pw.EdgeInsets.symmetric(vertical: 0.8),
      child: pw.Row(
        children: [
          pw.Text(label, style: pw.TextStyle(font: bold, fontSize: 7.5)),
          pw.SizedBox(width: 4),
          pw.Expanded(
            child: pw.Text(value, style: pw.TextStyle(font: regular, fontSize: 7.5), maxLines: 1),
          ),
        ],
      ),
    );
  }

  static pw.Widget _posTh(String text, pw.Font font, {pw.TextAlign align = pw.TextAlign.center}) {
    return pw.Padding(
      padding: const pw.EdgeInsets.symmetric(vertical: 2, horizontal: 1),
      child: pw.Text(text, style: pw.TextStyle(font: font, fontSize: 7), textAlign: align),
    );
  }

  static pw.Widget _posTd(String text, pw.Font font, {pw.TextAlign align = pw.TextAlign.center}) {
    return pw.Padding(
      padding: const pw.EdgeInsets.symmetric(vertical: 1.5, horizontal: 1),
      child: pw.Text(text, style: pw.TextStyle(font: font, fontSize: 7), textAlign: align),
    );
  }

  static pw.Widget _posSignBox(String title, pw.Font font) {
    return pw.Column(
      children: [
        pw.Container(width: 48, height: 0.6, color: PdfColors.black),
        pw.SizedBox(height: 1),
        pw.Text(title, style: pw.TextStyle(font: font, fontSize: 6.5)),
      ],
    );
  }

  static pw.Widget _metaItem(String label, String value, pw.Font bold, pw.Font regular) {
    return pw.RichText(
      text: pw.TextSpan(
        children: [
          pw.TextSpan(text: '$label ', style: pw.TextStyle(font: bold, fontSize: 8)),
          pw.TextSpan(text: value, style: pw.TextStyle(font: regular, fontSize: 8)),
        ],
      ),
    );
  }

  static pw.Widget _th(String text, pw.Font font) {
    return pw.Padding(
      padding: const pw.EdgeInsets.symmetric(horizontal: 4, vertical: 4),
      child: pw.Text(text, style: pw.TextStyle(font: font, fontSize: 8), textAlign: pw.TextAlign.center),
    );
  }

  static pw.Widget _td(String text, pw.Font font, {pw.TextAlign align = pw.TextAlign.left}) {
    return pw.Padding(
      padding: const pw.EdgeInsets.symmetric(horizontal: 4, vertical: 3),
      child: pw.Text(text, style: pw.TextStyle(font: font, fontSize: 8), textAlign: align),
    );
  }

  static pw.Widget _signatureBox(String title, String name, pw.Font font) {
    return pw.Column(
      children: [
        pw.Container(
          width: 130,
          decoration: const pw.BoxDecoration(
            border: pw.Border(top: pw.BorderSide(color: PdfColors.black, width: 0.8)),
          ),
          padding: const pw.EdgeInsets.only(top: 4),
          child: pw.Column(
            children: [
              pw.Text(title, style: pw.TextStyle(font: font, fontSize: 8), textAlign: pw.TextAlign.center),
              if (name.isNotEmpty)
                pw.Text('($name)',
                    style: pw.TextStyle(font: font, fontSize: 7, color: PdfColors.grey700),
                    textAlign: pw.TextAlign.center),
            ],
          ),
        ),
      ],
    );
  }

  static String _formatDate(DateTime dt) {
    final d = dt.day.toString().padLeft(2, '0');
    final m = dt.month.toString().padLeft(2, '0');
    final y = dt.year;
    final h = dt.hour > 12 ? dt.hour - 12 : (dt.hour == 0 ? 12 : dt.hour);
    final min = dt.minute.toString().padLeft(2, '0');
    final ampm = dt.hour >= 12 ? 'PM' : 'AM';
    return '$d/$m/$y $h:$min $ampm';
  }
}
