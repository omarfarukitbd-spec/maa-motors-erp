import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../utils/app_colors.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _staffPinCtrl = TextEditingController();
  String? _errorMessage;

  @override
  void dispose() {
    _staffPinCtrl.dispose();
    super.dispose();
  }

  void _handleStaffPinLogin(String pin) {
    final cleanPin = pin.trim();
    if (cleanPin.isEmpty) {
      setState(() => _errorMessage = 'দয়া করে ৪-ডিজিটের স্টাফ পিন লিখুন।');
      return;
    }

    final auth = context.read<AuthProvider>();
    final success = auth.loginWithStaffPin(cleanPin);
    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: AppColors.load,
          content: Text('${auth.currentStaffName} (${auth.currentStaffRole}) হিসেবে লগইন সফল!'),
        ),
      );
      Navigator.pop(context);
    } else {
      setState(() => _errorMessage = 'ভুল স্টাফ পিন! সঠিক পিন দিন (যেমন: মোঃ এমরান - ১৯২৫)।');
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    return Scaffold(
      backgroundColor: AppColors.bgDark,
      appBar: AppBar(
        backgroundColor: AppColors.s1Dark,
        elevation: 0,
        title: const Text(
          'গোডাউন কর্মী নির্বাচন ও লগইন',
          style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 18),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Logo Hero
              Center(
                child: Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: AppColors.load, width: 1.5),
                    boxShadow: [
                      BoxShadow(color: Colors.black.withOpacity(0.4), blurRadius: 10, offset: const Offset(0, 4)),
                    ],
                  ),
                  clipBehavior: Clip.antiAlias,
                  child: Image.asset(
                    'assets/images/app_logo.png',
                    fit: BoxFit.cover,
                  ),
                ),
              ),
              const SizedBox(height: 14),
              const Center(
                child: Text(
                  'মেসার্স মা মোটরস',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 22,
                    fontWeight: FontWeight.w900,
                    fontFamily: 'Hind Siliguri',
                  ),
                ),
              ),
              const Center(
                child: Text(
                  'গোডাউন-১ (মুরাদপুর, চট্টগ্রাম) • কাউন্টার ও চালান পোর্টাল',
                  style: TextStyle(color: AppColors.muDark, fontSize: 12),
                  textAlign: TextAlign.center,
                ),
              ),
              const SizedBox(height: 24),

              // Staff Quick PIN Login Card
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: AppColors.s1Dark,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.load.withOpacity(0.3)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.badge_outlined, color: AppColors.load, size: 20),
                        SizedBox(width: 8),
                        Text(
                          'গোডাউন কর্মী সিলেক্ট করুন',
                          style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'নিচের তালিকা থেকে ১-ট্যাপে আপনার প্রোফাইল সিলেক্ট করুন অথবা পিন লিখুন:',
                      style: TextStyle(color: AppColors.muDark, fontSize: 12),
                    ),
                    const SizedBox(height: 14),

                    // Quick Staff Selection Chips
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        ActionChip(
                          backgroundColor: const Color(0xFF1E293B),
                          side: const BorderSide(color: AppColors.load, width: 1.5),
                          avatar: const Icon(Icons.person, color: AppColors.load, size: 16),
                          label: const Text(
                            'মোঃ এমরান (ইনচার্জ - ১৯২৫)',
                            style: TextStyle(color: AppColors.load, fontSize: 12, fontWeight: FontWeight.bold),
                          ),
                          onPressed: () {
                            _staffPinCtrl.text = '1925';
                            _handleStaffPinLogin('1925');
                          },
                        ),
                        ActionChip(
                          backgroundColor: const Color(0xFF1E293B),
                          side: const BorderSide(color: Color(0xFF38BDF8), width: 1.5),
                          avatar: const Icon(Icons.person, color: Color(0xFF38BDF8), size: 16),
                          label: const Text(
                            'আলতাফ (সহকারী - ১২৩৪)',
                            style: TextStyle(color: Color(0xFF38BDF8), fontSize: 12, fontWeight: FontWeight.bold),
                          ),
                          onPressed: () {
                            _staffPinCtrl.text = '1234';
                            _handleStaffPinLogin('1234');
                          },
                        ),
                        ActionChip(
                          backgroundColor: const Color(0xFF1E293B),
                          side: const BorderSide(color: Color(0xFFFBBF24), width: 1.5),
                          avatar: const Icon(Icons.shield, color: Color(0xFFFBBF24), size: 16),
                          label: const Text(
                            'ওমর ফারুক (মালিক - ৭৮৬০)',
                            style: TextStyle(color: Color(0xFFFBBF24), fontSize: 12, fontWeight: FontWeight.bold),
                          ),
                          onPressed: () {
                            _staffPinCtrl.text = '7860';
                            _handleStaffPinLogin('7860');
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // PIN Input
                    TextField(
                      controller: _staffPinCtrl,
                      keyboardType: TextInputType.number,
                      obscureText: true,
                      style: const TextStyle(color: Colors.white, fontSize: 18, letterSpacing: 4),
                      decoration: InputDecoration(
                        filled: true,
                        fillColor: AppColors.s2Dark,
                        hintText: '•••• (৪-ডিজিট পিন)',
                        hintStyle: const TextStyle(color: AppColors.muDark, letterSpacing: 0, fontSize: 13),
                        prefixIcon: const Icon(Icons.pin, color: AppColors.load, size: 20),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
                      ),
                      onSubmitted: (v) => _handleStaffPinLogin(v),
                    ),

                    if (_errorMessage != null) ...[
                      const SizedBox(height: 10),
                      Text(
                        _errorMessage!,
                        style: const TextStyle(color: AppColors.dng, fontSize: 12),
                      ),
                    ],

                    const SizedBox(height: 14),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.load,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 13),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        onPressed: () => _handleStaffPinLogin(_staffPinCtrl.text),
                        icon: const Icon(Icons.login, size: 18),
                        label: const Text('লগইন নিশ্চিত করুন', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Currently Active Profile Card
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFF0B192C),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFF1E293B)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.check_circle_outline, color: AppColors.load, size: 22),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'বর্তমানে সক্রিয় কর্মী:',
                            style: TextStyle(color: AppColors.muDark, fontSize: 11),
                          ),
                          Text(
                            '${auth.currentStaffName} (${auth.currentStaffRole})',
                            style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Contact & Support
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFF0F172A),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: const Color(0xFF1E293B)),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.headset_mic_outlined, color: Color(0xFF94A3B8), size: 16),
                    SizedBox(width: 6),
                    Text(
                      'জরুরি যোগাযোগ: ওমর ফারুক • ০১৮১৯-৩৯৭৬৬৯',
                      style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11.5, fontWeight: FontWeight.w600),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
