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
import '../services/customer_directory_service.dart';
import '../services/firebase_sync_service.dart';

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

  String _customerName = '';
  String _customerAddress = '';
  String _customerPhone = '';
  String _vehicleNo = '';
  String _driverName = '';
  String _driverMobile = '';
  String _sealNo = '';

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
      _customerName = 'আলম ব্রাদার্স অটো পার্টস';
      _customerAddress = 'ধোলাইখাল, ঢাকা';
      _customerPhone = '01711-223344';
      _vehicleNo = 'ঢাকা মেট্রো-ট-১২-৩৪৫৬';
      _driverName = 'মো: কালাম';
      _driverMobile = '01819-112233';
      _sealNo = 'SEAL-78901';
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
      _customerName = ch.customerName.isNotEmpty ? ch.customerName : ch.productOwner;
      _customerAddress = ch.customerAddress.isNotEmpty ? ch.customerAddress : ch.destinationFor;
      _customerPhone = ch.customerPhone;
      _vehicleNo = ch.vehicleNo;
      _driverName = ch.driverName;
      _driverMobile = ch.driverMobile;
      _sealNo = ch.sealNo;
    } else {
      _items = widget.sessionItems ?? [];
      _challanNo = 'A1-${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}';
      _isLocked = false;
      _customerName = '';
      _customerAddress = '';
      _customerPhone = '';
      _vehicleNo = '';
      _driverName = '';
      _driverMobile = '';
      _sealNo = '';
    }
  }

  void _openEditMetadataDialog({VoidCallback? onSaved}) {
    final customerNameCtrl = TextEditingController(text: _customerName);
    final customerAddressCtrl = TextEditingController(text: _customerAddress);
    final customerPhoneCtrl = TextEditingController(text: _customerPhone);
    final vehicleCtrl = TextEditingController(text: _vehicleNo);
    final driverNameCtrl = TextEditingController(text: _driverName);
    final driverMobileCtrl = TextEditingController(text: _driverMobile);
    final sealNoCtrl = TextEditingController(text: _sealNo);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF0F172A),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(
          left: 18,
          right: 18,
          top: 18,
          bottom: MediaQuery.of(ctx).viewInsets.bottom + 18,
        ),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.edit_note, color: AppColors.load, size: 24),
                      SizedBox(width: 8),
                      Text(
                        'চালানের বিবরণ ও লজিস্টিকস',
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

              // Section 1: Customer / Consignee
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    '১. যার মাল নিয়ে যাচ্ছে (গ্রাহক / পার্টি)',
                    style: TextStyle(color: Color(0xFF38BDF8), fontSize: 13, fontWeight: FontWeight.bold),
                  ),
                  Text(
                    'মা মোটরস ডিরেক্টরি',
                    style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 10),
                  ),
                ],
              ),
              const SizedBox(height: 6),

              // Quick Suggestions for Maa Motors Customers
              Wrap(
                spacing: 6,
                runSpacing: 4,
                children: CustomerDirectoryService.defaultMaaCustomers.take(4).map((c) {
                  return ActionChip(
                    padding: const EdgeInsets.symmetric(horizontal: 4),
                    backgroundColor: const Color(0xFF1E293B),
                    side: const BorderSide(color: Color(0xFF38BDF8), width: 0.8),
                    label: Text(
                      c.name,
                      style: const TextStyle(color: Color(0xFF38BDF8), fontSize: 10.5, fontWeight: FontWeight.bold),
                    ),
                    onPressed: () {
                      customerNameCtrl.text = c.name;
                      customerPhoneCtrl.text = c.phone;
                      customerAddressCtrl.text = c.address;
                      if (c.vehicleNo.isNotEmpty) vehicleCtrl.text = c.vehicleNo;
                      if (c.driverName.isNotEmpty) driverNameCtrl.text = c.driverName;
                      if (c.driverMobile.isNotEmpty) driverMobileCtrl.text = c.driverMobile;
                    },
                  );
                }).toList(),
              ),
              const SizedBox(height: 8),
              _buildInputTile(controller: customerNameCtrl, label: 'পার্টি / গ্রাহকের নাম', hint: 'যেমন: মেসার্স আলম ব্রাদার্স', icon: Icons.person_outline),
              const SizedBox(height: 8),
              _buildInputTile(controller: customerAddressCtrl, label: 'ঠিকানা / ডেলিভারি পয়েন্ট', hint: 'যেমন: কদমতলী, ঢাকা', icon: Icons.location_on_outlined),
              const SizedBox(height: 8),
              _buildInputTile(controller: customerPhoneCtrl, label: 'গ্রাহকের মোবাইল নম্বর', hint: 'যেমন: 01711-XXXXXX', icon: Icons.phone_outlined, keyboardType: TextInputType.phone),
              const SizedBox(height: 14),

              // Section 2: Transport & Logistics
              const Text(
                '২. পরিবহন ও সিল নম্বর',
                style: TextStyle(color: Color(0xFFFBBF24), fontSize: 13, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              _buildInputTile(controller: vehicleCtrl, label: 'গাড়ি নম্বর', hint: 'যেমন: চট্ট-মেট্রো ড-১১-৪৮২১', icon: Icons.local_shipping_outlined),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(child: _buildInputTile(controller: driverNameCtrl, label: 'চালকের নাম', hint: 'যেমন: রহিম উদ্দিন', icon: Icons.badge_outlined)),
                  const SizedBox(width: 8),
                  Expanded(child: _buildInputTile(controller: driverMobileCtrl, label: 'চালকের ফোন', hint: '01819-XXXXXX', icon: Icons.phone_android_outlined, keyboardType: TextInputType.phone)),
                ],
              ),
              const SizedBox(height: 8),
              _buildInputTile(controller: sealNoCtrl, label: 'সিকিউরিটি সিল নম্বর (Seal No)', hint: 'যেমন: SL-98421 (ঐচ্ছিক)', icon: Icons.lock_outline),
              const SizedBox(height: 18),

              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.unl,
                    foregroundColor: AppColors.textOnAccent,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                  icon: const Icon(Icons.check_circle_outline),
                  label: const Text('তথ্য সংরক্ষণ করুন', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                  onPressed: () {
                    setState(() {
                      _customerName = customerNameCtrl.text.trim();
                      _customerAddress = customerAddressCtrl.text.trim();
                      _customerPhone = customerPhoneCtrl.text.trim();
                      _vehicleNo = vehicleCtrl.text.trim();
                      _driverName = driverNameCtrl.text.trim();
                      _driverMobile = driverMobileCtrl.text.trim();
                      _sealNo = sealNoCtrl.text.trim();
                    });
                    Navigator.pop(ctx);
                    if (onSaved != null) onSaved();
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInputTile({
    required TextEditingController controller,
    required String label,
    required String hint,
    required IconData icon,
    TextInputType keyboardType = TextInputType.text,
  }) {
    return TextField(
      controller: controller,
      keyboardType: keyboardType,
      style: const TextStyle(color: Colors.white, fontSize: 13),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
        hintText: hint,
        hintStyle: const TextStyle(color: Color(0xFF475569), fontSize: 11),
        prefixIcon: Icon(icon, color: AppColors.muDark, size: 18),
        isDense: true,
        filled: true,
        fillColor: const Color(0xFF1E293B),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: Color(0xFF334155))),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: Color(0xFF334155))),
        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.unl)),
      ),
    );
  }

  void _lockAndSaveChallan() {
    if (_isLocked) return;

    if (_customerName.isEmpty && _vehicleNo.isEmpty) {
      _openEditMetadataDialog(onSaved: () => _executeLockAndSave());
      return;
    }
    _executeLockAndSave();
  }

  void _executeLockAndSave() {
    setState(() {
      _isLocked = true;
      _verificationCode = BanglaTools.generateVerificationCode(_challanNo, _revision, _items);
    });

    final itemModels = _items.map((i) {
      return ChallanItem(
        partNameBn: i.name,
        rootGroup: i.category,
        quantity: i.quantity,
        unit: i.unit,
      );
    }).toList();

    final completedDoc = ChallanDocument(
      id: _challanNo,
      challanNo: _challanNo,
      sessionType: widget.mode == 'unl' ? 'inward' : 'outward',
      vehicleNo: _vehicleNo.isNotEmpty ? _vehicleNo : 'অনির্ধারিত গাড়ি',
      driverName: _driverName.isNotEmpty ? _driverName : 'অনির্ধারিত চালক',
      driverMobile: _driverMobile,
      customerName: _customerName,
      customerAddress: _customerAddress,
      customerPhone: _customerPhone,
      productOwner: _customerName.isNotEmpty ? _customerName : 'মেসার্স মা মোটরস',
      destinationFor: _customerAddress.isNotEmpty ? _customerAddress : 'মুরাদপুর প্রধান শো-রুম',
      sealNo: _sealNo,
      date: DateTime.now(),
      items: itemModels,
      totalPcs: _items.fold<int>(0, (sum, i) => sum + i.quantity),
      isLocked: true,
      verificationCode: _verificationCode,
      revisionNumber: _revision,
    );

    context.read<CountingProvider>().addCompletedChallanDirectly(
          challanNo: _challanNo,
          sessionType: widget.mode == 'unl' ? 'inward' : 'outward',
          vehicleNo: _vehicleNo.isNotEmpty ? _vehicleNo : 'অনির্ধারিত গাড়ি',
          driverName: _driverName.isNotEmpty ? _driverName : 'অনির্ধারিত চালক',
          driverMobile: _driverMobile,
          customerName: _customerName,
          customerAddress: _customerAddress,
          customerPhone: _customerPhone,
          sealNo: _sealNo,
          items: itemModels,
          isLocked: true,
          verificationCode: _verificationCode,
          revisionNumber: _revision,
        );

    // Sync to Maa Motors ERP Firestore Cloud
    FirebaseSyncService().backupChallanToCloud(completedDoc);

    // Save customer to local directory cache if entered
    if (_customerName.isNotEmpty) {
      CustomerDirectoryService().addCustomer(CustomerEntry(
        name: _customerName,
        phone: _customerPhone,
        address: _customerAddress,
        vehicleNo: _vehicleNo,
        driverName: _driverName,
        driverMobile: _driverMobile,
      ));
    }
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
      vehicleNo: _vehicleNo.isNotEmpty ? _vehicleNo : 'অনির্ধারিত গাড়ি',
      driverName: _driverName.isNotEmpty ? _driverName : 'অনির্ধারিত চালক',
      driverMobile: _driverMobile,
      customerName: _customerName,
      customerAddress: _customerAddress,
      customerPhone: _customerPhone,
      productOwner: _customerName.isNotEmpty ? _customerName : (auth.currentTenant?.shopName ?? 'মেসার্স মা মোটরস'),
      destinationFor: _customerAddress.isNotEmpty ? _customerAddress : 'মুরাদপুর প্রধান শো-রুম',
      sealNo: _sealNo,
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
                      // Shop Branded Banner Header (M/S MAA MOTORS)
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
                        decoration: BoxDecoration(
                          color: const Color(0xFF0F172A),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: AppColors.load, width: 1.5),
                        ),
                        child: Column(
                          children: [
                            const Text(
                              'মেসার্স মা মোটরস',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 20,
                                fontWeight: FontWeight.w900,
                                fontFamily: 'Hind Siliguri',
                              ),
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 2),
                            const Text(
                              'প্রোপ্রাইটর: মোঃ ওমর ফারুক • মোবাইল: ০১৮১৯-৩৯৭৬৬৯, ০১৮১৫-৭০৭৯৩৪',
                              style: TextStyle(color: Color(0xFF94A3B8), fontSize: 10.5, fontWeight: FontWeight.bold),
                              textAlign: TextAlign.center,
                            ),
                            const Text(
                              'গোডাউন-১, রেলগেট সংলগ্ন, মুরাদপুর, চট্টগ্রাম',
                              style: TextStyle(color: Color(0xFF64748B), fontSize: 10),
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 6),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                              decoration: BoxDecoration(
                                color: (isUnloading ? AppColors.unl : AppColors.load).withOpacity(0.2),
                                borderRadius: BorderRadius.circular(4),
                                border: Border.all(color: (isUnloading ? AppColors.unl : AppColors.load).withOpacity(0.4)),
                              ),
                              child: Text(
                                isUnloading ? 'গাড়ি থেকে আনলোডিং চালান (খালাস)' : 'গাড়িতে ডেলিভারি চালান (গেটপাস)',
                                style: TextStyle(
                                  color: isUnloading ? AppColors.unl : AppColors.load,
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 10),

                      // Metadata Grid Header with Edit Action
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'চালানের বিবরণ ও পরিবহন:',
                            style: TextStyle(
                              color: AppColors.paperText,
                              fontSize: 13,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                          if (!_isLocked)
                            InkWell(
                              onTap: () => _openEditMetadataDialog(),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: AppColors.load.withOpacity(0.15),
                                  borderRadius: BorderRadius.circular(4),
                                  border: Border.all(color: AppColors.load, width: 0.8),
                                ),
                                child: const Row(
                                  children: [
                                    Icon(Icons.edit, color: AppColors.load, size: 12),
                                    SizedBox(width: 4),
                                    Text('তথ্য এডিট', style: TextStyle(color: AppColors.load, fontSize: 11, fontWeight: FontWeight.bold)),
                                  ],
                                ),
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 4),
                        child: Column(
                          children: [
                            _metaRow('চালান নং:', '$_challanNo${_revision > 0 ? " (সংশোধিত ${BanglaTools.toBanglaDigits(_revision)})" : ""}', 'তারিখ:', BanglaTools.formatBanglaDate(DateTime.now())),
                            const SizedBox(height: 4),
                            _metaRow('প্রাপক / পার্টি:', _customerName.isNotEmpty ? _customerName : '(ট্যাপ করে লিখুন)', 'গ্রাহক মোবাইল:', _customerPhone.isNotEmpty ? _customerPhone : '---'),
                            const SizedBox(height: 4),
                            _metaRow('ডেলিভারি ঠিকানা:', _customerAddress.isNotEmpty ? _customerAddress : '(ট্যাপ করে লিখুন)', 'ধরন:', modeText),
                            const SizedBox(height: 4),
                            _metaRow('গাড়ি নম্বর:', _vehicleNo.isNotEmpty ? _vehicleNo : '(ট্যাপ করে লিখুন)', 'চালকের নাম:', _driverName.isNotEmpty ? '$_driverName ${_driverMobile.isNotEmpty ? "($_driverMobile)" : ""}' : '(লিখুন)'),
                            if (_sealNo.isNotEmpty) ...[
                              const SizedBox(height: 4),
                              _metaRow('সিকিউরিটি সিল:', _sealNo, 'ভেরিফিকেশন:', _verificationCode.isNotEmpty ? _verificationCode : 'লক হলে তৈরি হবে'),
                            ],
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

                      // 3 Institutional Signatures (MAA MOTORS)
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          _buildSignBox('কাউন্টার কর্মী\n(${auth.currentStaffName})'),
                          _buildSignBox('মাল প্রাপক / ড্রাইভার\n(স্বাক্ষর ও তারিখ)'),
                          _buildSignBox('মোঃ এমরান (ইনচার্জ)\nগোডাউন-১, মা মোটরস'),
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
