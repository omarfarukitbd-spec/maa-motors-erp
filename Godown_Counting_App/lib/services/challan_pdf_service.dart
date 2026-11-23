import 'dart:typed_data';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import '../models/challan_model.dart';
import '../models/tenant_model.dart';
import 'offline_storage_service.dart';
import 'firebase_sync_service.dart';

class ChallanPdfService {
  /// Generate A4 PDF Document bytes matching Web ERP Mother Print Header & Layout
  static Future<Uint8List> generateA4PdfBytes(
    ChallanDocument challan, {
    Tenant? tenant,
  }) async {
    final pdf = pw.Document();

    // Dual-Font Architecture: Anek Bangla for Headings & Hind Siliguri for Data Tables
    final fontAnekBold = await PdfGoogleFonts.anekBanglaBold();
    final fontAnekRegular = await PdfGoogleFonts.anekBanglaRegular();
    final fontHindRegular = await PdfGoogleFonts.hindSiliguriRegular();
    final fontHindBold = await PdfGoogleFonts.hindSiliguriBold();

    pw.ImageProvider? logoImage;
    try {
      logoImage = await imageFromAssetBundle('assets/images/shop_official_logo.png');
    } catch (_) {
      try {
        logoImage = await imageFromAssetBundle('assets/images/app_logo.png');
      } catch (_) {}
    }

    final isUnloading = challan.sessionType == 'inward';
    final sessionBadgeText = isUnloading
        ? 'গাড়ি থেকে আনলোডিং চালান (খালাস)'
        : 'গাড়িতে ডেলিভারি চালান (গেটপাস)';

    final partyName =
        challan.customerName.isNotEmpty ? challan.customerName : (challan.productOwner.isNotEmpty ? challan.productOwner : 'মেসার্স মা মোটরস শোরুম');
    final partyAddress =
        challan.customerAddress.isNotEmpty ? challan.customerAddress : (challan.destinationFor.isNotEmpty ? challan.destinationFor : 'মুরাদপুর, চট্টগ্রাম');
    final partyPhone =
        challan.customerPhone.isNotEmpty ? challan.customerPhone : '---';
    final sealNo = challan.sealNo.isNotEmpty ? challan.sealNo : 'প্রযোজ্য নয়';

    pdf.addPage(
      pw.MultiPage(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(20),
        build: (pw.Context context) {
          return [
            // 1. Official Web ERP Mother Print Header (Challan Edition)
            _buildMotherPrintHeader(
              challan: challan,
              fontAnekBold: fontAnekBold,
              fontAnekRegular: fontAnekRegular,
              fontHindBold: fontHindBold,
              fontHindRegular: fontHindRegular,
              logoImage: logoImage,
            ),
            pw.SizedBox(height: 5),

            // 2. Status & Sub-Header Strip (Web ERP Style)
            pw.Container(
              padding: const pw.EdgeInsets.symmetric(horizontal: 10, vertical: 3.5),
              decoration: pw.BoxDecoration(
                color: const PdfColor.fromInt(0xFFF8FAFC),
                border: pw.Border.all(color: const PdfColor.fromInt(0xFFCBD5E1), width: 0.8),
                borderRadius: pw.BorderRadius.circular(4),
              ),
              child: pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Text('চালানের ধরন: $sessionBadgeText',
                      style: pw.TextStyle(font: fontHindBold, fontSize: 8.5, color: const PdfColor.fromInt(0xFF0F172A))),
                  pw.Text('তারিখ: ${_formatDate(challan.date)}',
                      style: pw.TextStyle(font: fontHindBold, fontSize: 8.5, color: const PdfColor.fromInt(0xFF0F172A))),
                  pw.Text('ভেরিফিকেশন: ${challan.verificationCode}',
                      style: pw.TextStyle(font: fontHindBold, fontSize: 8.5, color: const PdfColor.fromInt(0xFF0284C7))),
                ],
              ),
            ),
            pw.SizedBox(height: 6),

            // 3. Two-Column Structured Metadata Cards (Web ERP Standard)
            pw.Row(
              crossAxisAlignment: pw.CrossAxisAlignment.start,
              children: [
                // Left Card: Customer & Delivery Details
                pw.Expanded(
                  child: pw.Container(
                    padding: const pw.EdgeInsets.all(8),
                    decoration: pw.BoxDecoration(
                      color: const PdfColor.fromInt(0xFFF8FAFC),
                      borderRadius: pw.BorderRadius.circular(6),
                      border: pw.Border.all(color: const PdfColor.fromInt(0xFFE2E8F0), width: 0.8),
                    ),
                    child: pw.Column(
                      crossAxisAlignment: pw.CrossAxisAlignment.start,
                      children: [
                        pw.Container(
                          padding: const pw.EdgeInsets.only(bottom: 2),
                          margin: const pw.EdgeInsets.only(bottom: 4),
                          decoration: const pw.BoxDecoration(
                            border: pw.Border(bottom: pw.BorderSide(color: PdfColor.fromInt(0xFF0284C7), width: 1.5)),
                          ),
                          child: pw.Text('প্রাপক ও ডেলিভারির তথ্য (PARTY DETAILS)',
                              style: pw.TextStyle(font: fontHindBold, fontSize: 7.8, color: const PdfColor.fromInt(0xFF0284C7))),
                        ),
                        pw.Text(partyName,
                            style: pw.TextStyle(font: fontHindBold, fontSize: 10.5, color: const PdfColor.fromInt(0xFF0F172A))),
                        pw.SizedBox(height: 2),
                        pw.Text('মোবাইল: $partyPhone',
                            style: pw.TextStyle(font: fontHindRegular, fontSize: 8.5, color: const PdfColor.fromInt(0xFF475569))),
                        pw.Text('ঠিকানা: $partyAddress',
                            style: pw.TextStyle(font: fontHindRegular, fontSize: 8, color: const PdfColor.fromInt(0xFF64748B))),
                      ],
                    ),
                  ),
                ),
                pw.SizedBox(width: 8),

                // Right Card: Vehicle & Gatepass Details
                pw.Expanded(
                  child: pw.Container(
                    padding: const pw.EdgeInsets.all(8),
                    decoration: pw.BoxDecoration(
                      color: const PdfColor.fromInt(0xFFF8FAFC),
                      borderRadius: pw.BorderRadius.circular(6),
                      border: pw.Border.all(color: const PdfColor.fromInt(0xFFE2E8F0), width: 0.8),
                    ),
                    child: pw.Column(
                      crossAxisAlignment: pw.CrossAxisAlignment.start,
                      children: [
                        pw.Container(
                          padding: const pw.EdgeInsets.only(bottom: 2),
                          margin: const pw.EdgeInsets.only(bottom: 4),
                          decoration: const pw.BoxDecoration(
                            border: pw.Border(bottom: pw.BorderSide(color: PdfColor.fromInt(0xFF0369A1), width: 1.5)),
                          ),
                          child: pw.Text('পরিবহন ও গেটপাস তথ্য (GATE-PASS DETAILS)',
                              style: pw.TextStyle(font: fontHindBold, fontSize: 7.8, color: const PdfColor.fromInt(0xFF0369A1))),
                        ),
                        pw.Text(challan.vehicleNo.isNotEmpty ? challan.vehicleNo : '---',
                            style: pw.TextStyle(font: fontHindBold, fontSize: 10.5, color: const PdfColor.fromInt(0xFF0F172A))),
                        pw.SizedBox(height: 2),
                        pw.Text('চালক: ${challan.driverName} ${challan.driverMobile}'.trim(),
                            style: pw.TextStyle(font: fontHindRegular, fontSize: 8.5, color: const PdfColor.fromInt(0xFF475569))),
                        pw.Text('সিকিউরিটি সিল: $sealNo • গেটপাস নং: ${challan.gatePassNo}',
                            style: pw.TextStyle(font: fontHindRegular, fontSize: 8, color: const PdfColor.fromInt(0xFF64748B))),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            pw.SizedBox(height: 8),

            // 4. Category Summary Roll-up Box (if present)
            if (challan.categorySummaries.isNotEmpty) ...[
              pw.Container(
                padding: const pw.EdgeInsets.all(6),
                decoration: pw.BoxDecoration(
                  color: const PdfColor.fromInt(0xFFF1F5F9),
                  border: pw.Border.all(color: const PdfColor.fromInt(0xFFCBD5E1), width: 0.6),
                  borderRadius: pw.BorderRadius.circular(4),
                ),
                child: pw.Column(
                  crossAxisAlignment: pw.CrossAxisAlignment.start,
                  children: [
                    pw.Text(
                      'গ্রুপ ভিত্তিক মোট সারসংক্ষেপ (Category Roll-up):',
                      style: pw.TextStyle(font: fontHindBold, fontSize: 9, color: const PdfColor.fromInt(0xFF1E293B)),
                    ),
                    pw.SizedBox(height: 3),
                    pw.Wrap(
                      spacing: 12,
                      runSpacing: 4,
                      children: challan.categorySummaries.map((s) {
                        return pw.Text(
                          '• ${s.rootGroup}: ${s.totalQuantity} ${s.unit}',
                          style: pw.TextStyle(font: fontHindBold, fontSize: 8.5),
                        );
                      }).toList(),
                    ),
                  ],
                ),
              ),
              pw.SizedBox(height: 8),
            ],

            // 5. Items Table (Web ERP Master Style with Navy Header & Zebra Striping)
            pw.Table(
              border: pw.TableBorder.all(color: const PdfColor.fromInt(0xFFCBD5E1), width: 0.6),
              columnWidths: const {
                0: pw.FixedColumnWidth(26),
                1: pw.FlexColumnWidth(3.2),
                2: pw.FlexColumnWidth(1.6),
                3: pw.FixedColumnWidth(52),
                4: pw.FixedColumnWidth(42),
              },
              children: [
                pw.TableRow(
                  decoration: const pw.BoxDecoration(color: PdfColor.fromInt(0xFF0F172A)),
                  children: [
                    _th('নং', fontHindBold, textColor: PdfColors.white),
                    _th('পণ্যের বিবরণ / পার্টসের নাম', fontHindBold, textColor: PdfColors.white, align: pw.TextAlign.left),
                    _th('ক্যাটাগরি গ্রুপ', fontHindBold, textColor: PdfColors.white, align: pw.TextAlign.left),
                    _th('পরিমাণ', fontHindBold, textColor: PdfColors.white),
                    _th('একক', fontHindBold, textColor: PdfColors.white),
                  ],
                ),
                ...challan.items.asMap().entries.map((entry) {
                  final idx = entry.key + 1;
                  final item = entry.value;
                  final isEven = idx % 2 == 0;
                  return pw.TableRow(
                    decoration: pw.BoxDecoration(
                      color: isEven ? const PdfColor.fromInt(0xFFF8FAFC) : PdfColors.white,
                    ),
                    children: [
                      _td('$idx', fontHindRegular, align: pw.TextAlign.center),
                      _td(item.partNameBn, fontHindRegular),
                      _td(item.rootGroup, fontHindRegular),
                      _td('${item.quantity}', fontHindBold, align: pw.TextAlign.center),
                      _td(item.unit, fontHindRegular, align: pw.TextAlign.center),
                    ],
                  );
                }),
                // Total Row
                pw.TableRow(
                  decoration: const pw.BoxDecoration(color: PdfColor.fromInt(0xFFF1F5F9)),
                  children: [
                    _td('', fontHindRegular),
                    _td('সর্বমোট গণনা সম্পন্ন:', fontHindBold),
                    _td('${challan.items.length} টি পদ', fontHindBold),
                    _td('${challan.totalPcs}', fontHindBold, align: pw.TextAlign.center),
                    _td('পিস', fontHindBold, align: pw.TextAlign.center),
                  ],
                ),
              ],
            ),
            pw.SizedBox(height: 24),

            // 6. 3 Institutional Signatures (MAA MOTORS Corporate Verification)
            pw.Row(
              mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
              children: [
                _signatureBox('কাউন্টার কর্মীর স্বাক্ষর', 'মা মোটরস কর্মী', fontHindRegular),
                _signatureBox('মাল প্রাপক / ড্রাইভারের স্বাক্ষর', challan.driverName.isNotEmpty ? '${challan.driverName} (ড্রাইভার)' : 'ড্রাইভারের সই ও তারিখ', fontHindRegular),
                _signatureBox('গোডাউন ইনচার্জের স্বাক্ষর', 'মোঃ এমরান (ইনচার্জ)', fontHindRegular),
              ],
            ),
            pw.SizedBox(height: 16),

            // 7. Institutional Footer
            pw.Row(
              mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
              children: [
                pw.Text('চালান প্রস্তুতের সময়: ${_formatDate(challan.date)}',
                    style: pw.TextStyle(font: fontHindRegular, fontSize: 8, color: PdfColors.grey600)),
                pw.Text('মা মোটরস গোডাউন-১ (মুরাদপুর, চট্টগ্রাম) • ERP Cloud Sync',
                    style: pw.TextStyle(font: fontHindRegular, fontSize: 8, color: PdfColors.grey600)),
              ],
            ),
          ];
        },
      ),
    );

    return pdf.save();
  }

  /// Official Mother Print Header Matching Web ERP Design
  static pw.Widget _buildMotherPrintHeader({
    required ChallanDocument challan,
    required pw.Font fontAnekBold,
    required pw.Font fontAnekRegular,
    required pw.Font fontHindBold,
    required pw.Font fontHindRegular,
    pw.ImageProvider? logoImage,
  }) {
    // Pure SVG vectors for Japanese Car Brands (Mitsubishi & Toyota)
    const mitsubishiSvg =
        '<svg width="24" height="20" viewBox="0 0 30 25"><polygon points="15,0 20,8.66 15,17.32 10,8.66" fill="#e11d48"/><polygon points="10,8.66 15,17.32 10,25.98 5,17.32" fill="#e11d48"/><polygon points="20,8.66 25,17.32 20,25.98 15,17.32" fill="#e11d48"/></svg>';
    const toyotaSvg =
        '<svg width="24" height="18" viewBox="0 0 32 24"><ellipse cx="16" cy="12" rx="15" ry="11" fill="none" stroke="#ffffff" stroke-width="1.8"/><ellipse cx="16" cy="8.5" rx="9" ry="5.5" fill="none" stroke="#ffffff" stroke-width="1.5"/><ellipse cx="16" cy="12" rx="4.5" ry="9" fill="none" stroke="#ffffff" stroke-width="1.5"/></svg>';

    return pw.Container(
      decoration: pw.BoxDecoration(
        gradient: const pw.LinearGradient(
          colors: [
            PdfColor.fromInt(0xFF024EA2),
            PdfColor.fromInt(0xFF0056B8),
            PdfColor.fromInt(0xFF002D72),
          ],
          stops: [0.0, 0.45, 1.0],
        ),
        borderRadius: pw.BorderRadius.circular(10),
      ),
      padding: const pw.EdgeInsets.fromLTRB(10, 8, 10, 6),
      margin: const pw.EdgeInsets.only(bottom: 6),
      child: pw.Column(
        children: [
          // Top Row: Logo, Branding, Japanese Brands, and Challan Badge
          pw.Row(
            crossAxisAlignment: pw.CrossAxisAlignment.center,
            children: [
              // 1. Left: Circular Official Logo
              if (logoImage != null)
                pw.Container(
                  width: 48,
                  height: 48,
                  decoration: pw.BoxDecoration(
                    color: PdfColors.white,
                    shape: pw.BoxShape.circle,
                    border: pw.Border.all(color: PdfColors.white, width: 1.8),
                  ),
                  child: pw.ClipOval(
                    child: pw.Image(logoImage, fit: pw.BoxFit.contain),
                  ),
                ),
              pw.SizedBox(width: 8),
              pw.Container(
                width: 1.2,
                height: 44,
                color: const PdfColor.fromInt(0x73FFFFFF),
              ),
              pw.SizedBox(width: 8),

              // 2. Center: Business Branding
              pw.Expanded(
                child: pw.Column(
                  crossAxisAlignment: pw.CrossAxisAlignment.start,
                  children: [
                    // Shop Name Two-Tone: Bengali in Golden Yellow, English in White
                    pw.RichText(
                      text: pw.TextSpan(
                        children: [
                          pw.TextSpan(
                            text: 'মেসার্স মা মোটরস ',
                            style: pw.TextStyle(
                              font: fontAnekBold,
                              fontSize: 16,
                              color: const PdfColor.fromInt(0xFFFFDF00),
                            ),
                          ),
                          pw.TextSpan(
                            text: "(M/S. MAA-MOTOR'S)",
                            style: pw.TextStyle(
                              font: fontAnekBold,
                              fontSize: 11,
                              color: PdfColors.white,
                            ),
                          ),
                        ],
                      ),
                    ),
                    pw.SizedBox(height: 2),
                    // Subtitle in White Rounded Pill with Navy Text
                    pw.Container(
                      padding: const pw.EdgeInsets.symmetric(horizontal: 6, vertical: 1.5),
                      decoration: pw.BoxDecoration(
                        color: PdfColors.white,
                        borderRadius: pw.BorderRadius.circular(8),
                      ),
                      child: pw.Text(
                        'জাতীয় জাপানি কার ও মাইক্রোবাসের রিকন্ডিশন ইঞ্জিন ও পার্টস বিক্রয় করা হয়।',
                        style: pw.TextStyle(
                          font: fontAnekBold,
                          fontSize: 7.2,
                          color: const PdfColor.fromInt(0xFF001A70),
                        ),
                      ),
                    ),
                    pw.SizedBox(height: 2.5),
                    // Proprietor Badge (Web ERP Standard)
                    pw.Row(
                      children: [
                        pw.Container(
                          padding: const pw.EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                          decoration: pw.BoxDecoration(
                            color: const PdfColor.fromInt(0xFFE11D48),
                            borderRadius: pw.BorderRadius.circular(3),
                          ),
                          child: pw.Text(
                            'প্রোপাইটর:',
                            style: pw.TextStyle(
                              font: fontAnekBold,
                              fontSize: 7.5,
                              color: PdfColors.white,
                            ),
                          ),
                        ),
                        pw.SizedBox(width: 4),
                        pw.Text(
                          'মোহাম্মদ এমরান (Mohammed Amran)',
                          style: pw.TextStyle(
                            font: fontAnekBold,
                            fontSize: 9,
                            color: PdfColors.white,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              // 3. Middle-Right: Japanese Car Brand Vectors (Mitsubishi & Toyota)
              pw.Row(
                children: [
                  pw.Column(
                    mainAxisAlignment: pw.MainAxisAlignment.center,
                    children: [
                      pw.SvgImage(svg: mitsubishiSvg, width: 20, height: 16),
                      pw.SizedBox(height: 1),
                      pw.Text(
                        'MITSUBISHI',
                        style: const pw.TextStyle(
                          fontSize: 5.5,
                          color: PdfColors.white,
                        ),
                      ),
                    ],
                  ),
                  pw.SizedBox(width: 8),
                  pw.Column(
                    mainAxisAlignment: pw.MainAxisAlignment.center,
                    children: [
                      pw.SvgImage(svg: toyotaSvg, width: 20, height: 15),
                      pw.SizedBox(height: 1),
                      pw.Text(
                        'TOYOTA',
                        style: const pw.TextStyle(
                          fontSize: 5.5,
                          color: PdfColors.white,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              pw.SizedBox(width: 8),
              pw.Container(
                width: 1.2,
                height: 44,
                color: const PdfColor.fromInt(0x73FFFFFF),
              ),
              pw.SizedBox(width: 8),

              // 4. Far-Right: Dynamic Category Badge "চালান" with Red Border
              pw.Column(
                crossAxisAlignment: pw.CrossAxisAlignment.end,
                children: [
                  pw.Container(
                    padding: const pw.EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                    decoration: pw.BoxDecoration(
                      color: PdfColors.white,
                      borderRadius: pw.BorderRadius.circular(6),
                      border: pw.Border.all(color: const PdfColor.fromInt(0xFFEF4444), width: 1.8),
                    ),
                    child: pw.Text(
                      'চালান',
                      style: pw.TextStyle(
                        font: fontAnekBold,
                        fontSize: 13,
                        color: const PdfColor.fromInt(0xFF001A70),
                      ),
                    ),
                  ),
                  pw.SizedBox(height: 3),
                  // Register / Sheet Number Indicator
                  pw.Container(
                    padding: const pw.EdgeInsets.symmetric(horizontal: 7, vertical: 1.5),
                    decoration: pw.BoxDecoration(
                      color: const PdfColor.fromInt(0xFFFFDF00),
                      borderRadius: pw.BorderRadius.circular(8),
                    ),
                    child: pw.Text(
                      'চালান নং: ${challan.displayChallanNo}',
                      style: pw.TextStyle(
                        font: fontHindBold,
                        fontSize: 8.5,
                        color: PdfColors.black,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),

          // 5. Bottom Row: Floating Light-Blue Ribbon Contact Strip
          pw.Container(
            margin: const pw.EdgeInsets.only(top: 5),
            padding: const pw.EdgeInsets.symmetric(horizontal: 10, vertical: 2.5),
            decoration: pw.BoxDecoration(
              gradient: const pw.LinearGradient(
                colors: [
                  PdfColors.white,
                  PdfColor.fromInt(0xFFE0F2FE),
                  PdfColors.white,
                ],
              ),
              borderRadius: pw.BorderRadius.circular(20),
              border: pw.Border.all(color: const PdfColor.fromInt(0xFF7DD3FC), width: 0.8),
            ),
            child: pw.Row(
              mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
              children: [
                // Left: Address
                pw.Text(
                  'দোকান নং-২২, রহমান টাওয়ার, ১ নং রেইল গেইট, মুরাদপুর, হাটহাজারী রোড, চট্টগ্রাম।',
                  style: pw.TextStyle(
                    font: fontAnekRegular,
                    fontSize: 7.8,
                    color: const PdfColor.fromInt(0xFF0F172A),
                  ),
                ),
                // Right: Mobile
                pw.Text(
                  'মোবাইল: ০১৮১৯-৩৯৭৬৬৯, ০১৮১৫-৭০৭৯৩৪',
                  style: pw.TextStyle(
                    font: fontAnekBold,
                    fontSize: 8,
                    color: const PdfColor.fromInt(0xFF002D72),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
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
    final fontAnekBold = await PdfGoogleFonts.anekBanglaBold();
    final fontAnekRegular = await PdfGoogleFonts.anekBanglaRegular();
    final fontHind = await PdfGoogleFonts.hindSiliguriRegular();
    final fontHindBold = await PdfGoogleFonts.hindSiliguriBold();

    final isUnloading = challan.sessionType == 'inward';

    pdf.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.roll80,
        margin: const pw.EdgeInsets.symmetric(horizontal: 8, vertical: 10),
        build: (pw.Context context) {
          return pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.center,
            children: [
              // Header matching Web ERP
              pw.Text('মেসার্স মা মোটরস', style: pw.TextStyle(font: fontAnekBold, fontSize: 13.5), textAlign: pw.TextAlign.center),
              pw.Text('প্রোপাইটর: মোহাম্মদ এমরান (Mohammed Amran)', style: pw.TextStyle(font: fontAnekRegular, fontSize: 8), textAlign: pw.TextAlign.center),
              pw.Text('দোকান নং-২২, রহমান টাওয়ার, ১ নং রেইল গেইট, মুরাদপুর, চট্টগ্রাম', style: pw.TextStyle(font: fontHind, fontSize: 7), textAlign: pw.TextAlign.center),
              pw.Text('মোবাইল: ০১৮১৯-৩৯৭৬৬৯, ০১৮১৫-৭০৭৯৩৪', style: pw.TextStyle(font: fontHindBold, fontSize: 7.5), textAlign: pw.TextAlign.center),
              pw.SizedBox(height: 3),
              pw.Container(
                padding: const pw.EdgeInsets.symmetric(horizontal: 10, vertical: 2),
                decoration: pw.BoxDecoration(
                  border: pw.Border.all(color: PdfColors.black, width: 1.2),
                  borderRadius: pw.BorderRadius.circular(4),
                ),
                child: pw.Text('*** চালান ***', style: pw.TextStyle(font: fontAnekBold, fontSize: 9.5)),
              ),
              pw.Container(
                margin: const pw.EdgeInsets.symmetric(vertical: 4),
                padding: const pw.EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: pw.BoxDecoration(
                  color: isUnloading ? const PdfColor.fromInt(0xFF0284C7) : const PdfColor.fromInt(0xFF059669),
                  borderRadius: pw.BorderRadius.circular(3),
                ),
                child: pw.Text(
                  isUnloading ? '[ আনলোডিং চালান / খালাস ]' : '[ ডেলিভারি চালান / গেটপাস ]',
                  style: pw.TextStyle(font: fontHindBold, fontSize: 7.5, color: PdfColors.white),
                ),
              ),
              pw.Text('- - - - - - - - - - - - - - - - - - - - - - - - - - -', style: pw.TextStyle(font: fontHind, fontSize: 7)),
              pw.SizedBox(height: 2),

              // Metadata
              pw.Align(
                alignment: pw.Alignment.centerLeft,
                child: pw.Column(
                  crossAxisAlignment: pw.CrossAxisAlignment.start,
                  children: [
                    _posMetaRow('চালান নং:', challan.displayChallanNo, fontHindBold, fontHind),
                    _posMetaRow('তারিখ:', _formatDate(challan.date), fontHindBold, fontHind),
                    _posMetaRow('প্রাপক/পার্টি:', challan.customerName.isNotEmpty ? challan.customerName : (challan.productOwner.isNotEmpty ? challan.productOwner : 'মেসার্স মা মোটরস শোরুম'), fontHindBold, fontHind),
                    if (challan.customerPhone.isNotEmpty)
                      _posMetaRow('পার্টি ফোন:', challan.customerPhone, fontHindBold, fontHind),
                    if (challan.customerAddress.isNotEmpty)
                      _posMetaRow('ঠিকানা:', challan.customerAddress, fontHindBold, fontHind),
                    _posMetaRow('গাড়ি নং:', challan.vehicleNo, fontHindBold, fontHind),
                    _posMetaRow('ড্রাইভার:', '${challan.driverName} ${challan.driverMobile}'.trim(), fontHindBold, fontHind),
                    if (challan.sealNo.isNotEmpty)
                      _posMetaRow('সিল নং:', challan.sealNo, fontHindBold, fontHind),
                  ],
                ),
              ),
              pw.SizedBox(height: 4),
              pw.Text('- - - - - - - - - - - - - - - - - - - - - - - - - - -', style: pw.TextStyle(font: fontHind, fontSize: 7)),
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
                      _posTh('নং', fontHindBold),
                      _posTh('পণ্যের বিবরণ', fontHindBold, align: pw.TextAlign.left),
                      _posTh('পরিমাণ', fontHindBold),
                      _posTh('একক', fontHindBold),
                    ],
                  ),
                  ...challan.items.asMap().entries.map((entry) {
                    final idx = entry.key + 1;
                    final item = entry.value;
                    return pw.TableRow(
                      children: [
                        _posTd('$idx', fontHind, align: pw.TextAlign.center),
                        _posTd(item.partNameBn, fontHind, align: pw.TextAlign.left),
                        _posTd('${item.quantity}', fontHindBold, align: pw.TextAlign.center),
                        _posTd(item.unit, fontHind, align: pw.TextAlign.center),
                      ],
                    );
                  }),
                  // Total Row
                  pw.TableRow(
                    decoration: const pw.BoxDecoration(color: PdfColors.grey200),
                    children: [
                      _posTd('', fontHind),
                      _posTd('সর্বমোট:', fontHindBold, align: pw.TextAlign.left),
                      _posTd('${challan.totalPcs}', fontHindBold, align: pw.TextAlign.center),
                      _posTd('পিস', fontHindBold, align: pw.TextAlign.center),
                    ],
                  ),
                ],
              ),
              pw.SizedBox(height: 4),
              pw.Text('- - - - - - - - - - - - - - - - - - - - - - - - - - -', style: pw.TextStyle(font: fontHind, fontSize: 7)),
              pw.SizedBox(height: 6),

              // Verification Code & QR
              pw.BarcodeWidget(
                data: 'https://maa-motors-erp.web.app/verify/${challan.verificationCode}',
                barcode: pw.Barcode.qrCode(),
                width: 55,
                height: 55,
              ),
              pw.SizedBox(height: 3),
              pw.Text('যাচাই কোড: ${challan.verificationCode}', style: pw.TextStyle(font: fontHindBold, fontSize: 8)),
              pw.SizedBox(height: 10),

              // Signatures
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Column(
                    children: [
                      pw.Container(width: 55, height: 0.5, color: PdfColors.grey600),
                      pw.SizedBox(height: 2),
                      pw.Text('কাউন্টার কর্মী', style: pw.TextStyle(font: fontHind, fontSize: 7)),
                    ],
                  ),
                  pw.Column(
                    children: [
                      pw.Container(width: 55, height: 0.5, color: PdfColors.grey600),
                      pw.SizedBox(height: 2),
                      pw.Text('ইনচার্জ স্বাক্ষর', style: pw.TextStyle(font: fontHind, fontSize: 7)),
                    ],
                  ),
                ],
              ),
              pw.SizedBox(height: 8),
              pw.Text('মা মোটরস ইআরপি সিস্টেম • গোডাউন-১', style: pw.TextStyle(font: fontHind, fontSize: 6.5, color: PdfColors.grey600)),
            ],
          );
        },
      ),
    );

    return pdf.save();
  }

  /// Print POS Receipt Directly
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
      name: 'POS-Challan-${challan.displayChallanNo}',
    );
  }

  // --- Helper Widgets ---

  static pw.Widget _posMetaRow(String label, String value, pw.Font fontBold, pw.Font fontRegular) {
    return pw.Padding(
      padding: const pw.EdgeInsets.symmetric(vertical: 1),
      child: pw.Row(
        crossAxisAlignment: pw.CrossAxisAlignment.start,
        children: [
          pw.SizedBox(
            width: 52,
            child: pw.Text(label, style: pw.TextStyle(font: fontBold, fontSize: 7.5)),
          ),
          pw.Expanded(
            child: pw.Text(value, style: pw.TextStyle(font: fontRegular, fontSize: 7.5)),
          ),
        ],
      ),
    );
  }

  static pw.Widget _th(String title, pw.Font font, {PdfColor textColor = PdfColors.black, pw.TextAlign align = pw.TextAlign.center}) {
    return pw.Container(
      padding: const pw.EdgeInsets.symmetric(vertical: 4.5, horizontal: 4),
      alignment: align == pw.TextAlign.center ? pw.Alignment.center : pw.Alignment.centerLeft,
      child: pw.Text(title, style: pw.TextStyle(font: font, fontSize: 8.5, color: textColor)),
    );
  }

  static pw.Widget _td(String value, pw.Font font, {pw.TextAlign align = pw.TextAlign.left}) {
    return pw.Container(
      padding: const pw.EdgeInsets.symmetric(vertical: 3.5, horizontal: 4),
      alignment: align == pw.TextAlign.center
          ? pw.Alignment.center
          : (align == pw.TextAlign.right ? pw.Alignment.centerRight : pw.Alignment.centerLeft),
      child: pw.Text(value, style: pw.TextStyle(font: font, fontSize: 8)),
    );
  }

  static pw.Widget _posTh(String title, pw.Font font, {pw.TextAlign align = pw.TextAlign.center}) {
    return pw.Container(
      padding: const pw.EdgeInsets.symmetric(vertical: 2, horizontal: 2),
      alignment: align == pw.TextAlign.center ? pw.Alignment.center : pw.Alignment.centerLeft,
      child: pw.Text(title, style: pw.TextStyle(font: font, fontSize: 7, color: PdfColors.black)),
    );
  }

  static pw.Widget _posTd(String value, pw.Font font, {pw.TextAlign align = pw.TextAlign.left}) {
    return pw.Container(
      padding: const pw.EdgeInsets.symmetric(vertical: 2, horizontal: 2),
      alignment: align == pw.TextAlign.center
          ? pw.Alignment.center
          : (align == pw.TextAlign.right ? pw.Alignment.centerRight : pw.Alignment.centerLeft),
      child: pw.Text(value, style: pw.TextStyle(font: font, fontSize: 7)),
    );
  }

  static pw.Widget _signatureBox(String title, String subtitle, pw.Font font) {
    return pw.Column(
      children: [
        pw.Container(
          width: 140,
          height: 0.5,
          color: PdfColors.grey600,
        ),
        pw.SizedBox(height: 4),
        pw.Text(title, style: pw.TextStyle(font: font, fontSize: 9, color: PdfColors.black)),
        pw.Text(subtitle, style: pw.TextStyle(font: font, fontSize: 8, color: PdfColors.grey700)),
      ],
    );
  }

  static String _formatDate(DateTime dt) {
    return '${dt.day.toString().padLeft(2, '0')}/${dt.month.toString().padLeft(2, '0')}/${dt.year}';
  }
}
