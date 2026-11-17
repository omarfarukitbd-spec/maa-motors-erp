import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/tenant_model.dart';
import '../providers/auth_provider.dart';
import '../services/auth_licensing_service.dart';
import '../services/firebase_sync_service.dart';
import '../utils/app_colors.dart';

class ShopBannerStudioScreen extends StatefulWidget {
  const ShopBannerStudioScreen({super.key});

  @override
  State<ShopBannerStudioScreen> createState() => _ShopBannerStudioScreenState();
}

class _ShopBannerStudioScreenState extends State<ShopBannerStudioScreen> {
  late TextEditingController _shopNameCtrl;
  late TextEditingController _ownerNameCtrl;
  late TextEditingController _phoneCtrl;
  late TextEditingController _addressCtrl;
  late TextEditingController _taglineCtrl;
  late TextEditingController _bannerUrlCtrl;

  int _selectedColorIndex = 0;
  static const List<Color> _themeColors = [
    Color(0xFF0284C7), // Ocean Blue
    Color(0xFF059669), // Emerald Green
    Color(0xFF1E293B), // Slate Black
    Color(0xFF4F46E5), // Royal Indigo
    Color(0xFFD97706), // Amber Gold
  ];

  static const List<String> _colorNames = [
    'ওশান ব্লু',
    'এমারেল্ড গ্রিন',
    'ডার্ক স্লেট',
    'রয়্যাল ইন্ডিগো',
    'অ্যাম্বার গোল্ড',
  ];

  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    final auth = context.read<AuthProvider>();
    final t = auth.currentTenant;

    _shopNameCtrl = TextEditingController(text: t?.shopName ?? 'মেসার্স মা মোটরস • গোডাউন');
    _ownerNameCtrl = TextEditingController(text: t?.ownerName ?? 'ওমর ফারুক');
    _phoneCtrl = TextEditingController(text: t?.phone ?? '01819-397669');
    _addressCtrl = TextEditingController(text: 'ধোলাইখাল, ঢাকা');
    _taglineCtrl = TextEditingController(text: 'জাপানি গাড়ি ও ট্রাকের জেনুইন পার্টস আমদানিকারক ও পাইকারি বিক্রেতা');
    _bannerUrlCtrl = TextEditingController(text: t?.headerBannerUrl ?? '');
  }

  @override
  void dispose() {
    _shopNameCtrl.dispose();
    _ownerNameCtrl.dispose();
    _phoneCtrl.dispose();
    _addressCtrl.dispose();
    _taglineCtrl.dispose();
    _bannerUrlCtrl.dispose();
    super.dispose();
  }

  Future<void> _saveBannerConfig() async {
    final shopName = _shopNameCtrl.text.trim();
    if (shopName.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          backgroundColor: AppColors.dng,
          content: Text('দোকানের নাম খালি রাখা যাবে না।'),
        ),
      );
      return;
    }

    setState(() => _isSaving = true);
    final auth = context.read<AuthProvider>();

    try {
      if (auth.currentTenant != null) {
        final t = auth.currentTenant!;
        t.shopName = shopName;
        t.ownerName = _ownerNameCtrl.text.trim();
        t.phone = _phoneCtrl.text.trim();
        t.headerBannerUrl = _bannerUrlCtrl.text.trim().isNotEmpty ? _bannerUrlCtrl.text.trim() : null;

        final licensing = AuthLicensingService();
        await licensing.saveOfflineLicense(t);

        // Sync with independent Firebase Cloud
        final cloudSync = FirebaseSyncService();
        await cloudSync.syncTenantToCloud(t);
      } else {
        auth.updateShopName(shopName);
      }

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            backgroundColor: AppColors.load,
            content: Text('দোকান হেডিং ও ব্যানার সফলভাবে সংরক্ষিত হয়েছে!'),
          ),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: AppColors.dng,
            content: Text('সংরক্ষণে সমস্যা: $e'),
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isSaving = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final activeColor = _themeColors[_selectedColorIndex];

    return Scaffold(
      backgroundColor: AppColors.bgDark,
      appBar: AppBar(
        backgroundColor: AppColors.s1Dark,
        elevation: 0,
        title: const Text(
          'দোকান হেডিং ও ব্যানার স্টুডিও',
          style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 18),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: TextButton.icon(
              onPressed: _isSaving ? null : _saveBannerConfig,
              icon: _isSaving
                  ? const SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                    )
                  : const Icon(Icons.save, color: AppColors.load, size: 18),
              label: const Text('সেভ করুন', style: TextStyle(color: AppColors.load, fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Live WYSIWYG Header Preview Card
              const Text(
                'চালান হেডার লাইভ প্রিভিউ (WYSIWYG Preview)',
                style: TextStyle(color: AppColors.unl, fontSize: 13, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 6),
              const Text(
                'চালানের শীর্ষে আপনার ব্যানারটি ঠিক এমন দেখাবে:',
                style: TextStyle(color: AppColors.muDark, fontSize: 11.5),
              ),
              const SizedBox(height: 10),

              // Interactive Paper Header Preview Box
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.paperBg,
                  borderRadius: BorderRadius.circular(8),
                  boxShadow: [
                    BoxShadow(color: Colors.black.withOpacity(0.4), blurRadius: 8, offset: const Offset(0, 4)),
                  ],
                ),
                child: Column(
                  children: [
                    // Dynamic Banner Container
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                      decoration: BoxDecoration(
                        color: activeColor,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Column(
                        children: [
                          Text(
                            _shopNameCtrl.text.isNotEmpty ? _shopNameCtrl.text : 'দোকানের নাম',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.w900,
                              fontFamily: 'Hind Siliguri',
                            ),
                            textAlign: TextAlign.center,
                          ),
                          if (_taglineCtrl.text.isNotEmpty) ...[
                            const SizedBox(height: 2),
                            Text(
                              _taglineCtrl.text,
                              style: const TextStyle(color: Colors.white70, fontSize: 10.5),
                              textAlign: TextAlign.center,
                            ),
                          ],
                          const SizedBox(height: 4),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              if (_ownerNameCtrl.text.isNotEmpty) ...[
                                Text(
                                  'প্রো: ${_ownerNameCtrl.text}',
                                  style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                                ),
                                const SizedBox(width: 8),
                                const Text('•', style: TextStyle(color: Colors.white54, fontSize: 10)),
                                const SizedBox(width: 8),
                              ],
                              Text(
                                'মোবাইল: ${_phoneCtrl.text}',
                                style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 8),
                    // Simulated Challan Metadata Strip
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('চালান নং: A1-00123', style: TextStyle(color: AppColors.paperText, fontSize: 10, fontWeight: FontWeight.bold)),
                        Text('ঠিকানা: ${_addressCtrl.text}', style: const TextStyle(color: AppColors.paperText, fontSize: 10)),
                        const Text('তারিখ: ১৭/১১/২০২৬', style: TextStyle(color: AppColors.paperText, fontSize: 10, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Theme Color Selector
              const Text(
                'ব্যানার থিম কালার প্যালেট',
                style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 10),
              SizedBox(
                height: 42,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: _themeColors.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 10),
                  itemBuilder: (ctx, idx) {
                    final isSelected = _selectedColorIndex == idx;
                    return GestureDetector(
                      onTap: () => setState(() => _selectedColorIndex = idx),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(
                          color: _themeColors[idx],
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: isSelected ? Colors.white : Colors.transparent,
                            width: 2,
                          ),
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          _colorNames[idx],
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 11.5,
                            fontWeight: isSelected ? FontWeight.w900 : FontWeight.normal,
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 24),

              // Form Inputs
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.s1Dark,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppColors.lineDark),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.edit_note, color: AppColors.unl, size: 20),
                        SizedBox(width: 8),
                        Text('দোকানের তথ্য ও হেডিং এডিটর', style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
                      ],
                    ),
                    const SizedBox(height: 14),

                    // Shop Name
                    _buildInputField('দোকানের পুরো নাম *', _shopNameCtrl, Icons.storefront, 'যেমন: মেসার্স মা মোটরস'),
                    const SizedBox(height: 12),

                    // Tagline
                    _buildInputField('স্লোগান বা পার্টসের বিবরণ', _taglineCtrl, Icons.description_outlined, 'যেমন: জাপান ও থাইল্যান্ডের ইঞ্জিন ও পার্টস'),
                    const SizedBox(height: 12),

                    // Owner Name
                    _buildInputField('মালিক বা প্রোপাইটর নাম', _ownerNameCtrl, Icons.person_outline, 'যেমন: ওমর ফারুক'),
                    const SizedBox(height: 12),

                    // Mobile
                    _buildInputField('যোগাযোগের মোবাইল নম্বর *', _phoneCtrl, Icons.phone_android, 'যেমন: 01819-397669'),
                    const SizedBox(height: 12),

                    // Address
                    _buildInputField('দোকান বা গোডাউনের ঠিকানা', _addressCtrl, Icons.location_on_outlined, 'যেমন: ধোলাইখাল, ঢাকা'),
                    const SizedBox(height: 12),

                    // Banner Image URL / Path (Optional)
                    _buildInputField('কাস্টম ব্যানার ছবির লিংক (ঐচ্ছিক)', _bannerUrlCtrl, Icons.image_outlined, 'https://... বা লোকাল ব্যানার'),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Save Button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.unl,
                    foregroundColor: AppColors.textOnAccent,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: _isSaving ? null : _saveBannerConfig,
                  icon: const Icon(Icons.check, size: 20),
                  label: const Text(
                    'হেডিং ও ব্যানার সংরক্ষণ করুন',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInputField(String label, TextEditingController controller, IconData icon, String hint) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: AppColors.muDark, fontSize: 12)),
        const SizedBox(height: 4),
        TextField(
          controller: controller,
          onChanged: (_) => setState(() {}),
          style: const TextStyle(color: Colors.white, fontSize: 13.5),
          decoration: InputDecoration(
            filled: true,
            fillColor: AppColors.s2Dark,
            hintText: hint,
            hintStyle: const TextStyle(color: Color(0xFF64748B), fontSize: 12),
            prefixIcon: Icon(icon, color: AppColors.unl, size: 18),
            contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
          ),
        ),
      ],
    );
  }
}
