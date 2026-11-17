import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/tenant_model.dart';
import '../providers/auth_provider.dart';
import '../utils/app_colors.dart';
import 'super_admin_hub_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _shopIdCtrl = TextEditingController();
  final TextEditingController _codeCtrl = TextEditingController();
  bool _isLoading = false;
  String? _errorMessage;

  @override
  void dispose() {
    _shopIdCtrl.dispose();
    _codeCtrl.dispose();
    super.dispose();
  }

  Future<void> _handleActivation() async {
    final shopId = _shopIdCtrl.text.trim().toUpperCase();
    final code = _codeCtrl.text.trim().toUpperCase();

    if (shopId.isEmpty || code.isEmpty) {
      setState(() {
        _errorMessage = 'দয়া করে শপ আইডি এবং অ্যাক্টিভেশন কোড উভয়ই লিখুন।';
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final auth = context.read<AuthProvider>();
    try {
      final success = await auth.activateShop(shopId, code);
      if (success && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            backgroundColor: AppColors.load,
            content: Text('দোকান সফলভাবে অ্যাক্টিভেট হয়েছে! স্বাগতম।'),
          ),
        );
        Navigator.pop(context);
      } else if (mounted) {
        setState(() {
          _errorMessage = 'আইডি বা অ্যাক্টিভেশন কোড মেলেনি। সঠিক কোড দিন।';
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = 'ত্রুটি: $e';
        });
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  void _handleGoogleSignIn() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.s1Dark,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Row(
          children: [
            Icon(Icons.g_mobiledata, color: Color(0xFF4285F4), size: 28),
            SizedBox(width: 8),
            Text('Google Sign-In', style: TextStyle(color: Colors.white, fontSize: 16)),
          ],
        ),
        content: const Text(
          'Google অ্যাকাউন্ট দিয়ে অফলাইন ড্রাইভ ব্যাকআপ ও ক্লাউড সিঙ্ক ফিচার সক্রিয় করা হবে। আপনার ডিভাইসে জিমেইল অ্যাকাউন্ট কানেক্ট হচ্ছে...',
          style: TextStyle(color: AppColors.muDark, fontSize: 13.5),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('ঠিক আছে', style: TextStyle(color: AppColors.unl)),
          ),
        ],
      ),
    );
  }

  void _handleAppleSignIn() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.s1Dark,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Row(
          children: [
            Icon(Icons.apple, color: Colors.white, size: 24),
            SizedBox(width: 8),
            Text('Apple Sign-In', style: TextStyle(color: Colors.white, fontSize: 16)),
          ],
        ),
        content: const Text(
          'Apple ID ভেরিফিকেশন মোড সক্রিয়। অফলাইন ডিভাইস লাইসেন্স সুরক্ষা বজায় থাকবে।',
          style: TextStyle(color: AppColors.muDark, fontSize: 13.5),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('ঠিক আছে', style: TextStyle(color: AppColors.unl)),
          ),
        ],
      ),
    );
  }

  void _openSuperAdminPinDialog() {
    final pinCtrl = TextEditingController();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.s1Dark,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Row(
          children: [
            Icon(Icons.shield, color: AppColors.load, size: 20),
            SizedBox(width: 8),
            Text('মাস্টার সুপার অ্যাডমিন পিন', style: TextStyle(color: Colors.white, fontSize: 16)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'সিস্টেম মালিক ওনার পিন (Master Security PIN) প্রবেশ করান:',
              style: TextStyle(color: AppColors.muDark, fontSize: 13),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: pinCtrl,
              keyboardType: TextInputType.number,
              obscureText: true,
              style: const TextStyle(color: Colors.white, fontSize: 18, letterSpacing: 4),
              decoration: InputDecoration(
                filled: true,
                fillColor: AppColors.s2Dark,
                hintText: '••••',
                hintStyle: const TextStyle(color: AppColors.muDark),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('বাতিল', style: TextStyle(color: AppColors.muDark)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.load,
              foregroundColor: AppColors.textOnAccent,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            onPressed: () {
              if (pinCtrl.text.trim() == '7860') {
                Navigator.pop(ctx);
                final auth = context.read<AuthProvider>();
                auth.switchRole(UserRole.superAdmin);
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (_) => const SuperAdminHubScreen()),
                );
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    backgroundColor: AppColors.dng,
                    content: Text('ভুল সিকিউরিটি পিন! প্রবেশাধিকার নেই।'),
                  ),
                );
              }
            },
            child: const Text('লগইন'),
          ),
        ],
      ),
    );
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
          'লগইন ও শপ লাইসেন্স পোর্টাল',
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
                  'Parts Challan',
                  style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.w900),
                ),
              ),
              const Center(
                child: Text(
                  'পার্টস চালান • অটো পার্টস গোডাউন কাউন্টার ও ডিজিটাল চালান',
                  style: TextStyle(color: AppColors.muDark, fontSize: 12),
                  textAlign: TextAlign.center,
                ),
              ),
              const SizedBox(height: 24),

              // 1. Social Login Buttons Row
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      style: OutlinedButton.styleFrom(
                        backgroundColor: AppColors.s1Dark,
                        foregroundColor: Colors.white,
                        side: const BorderSide(color: AppColors.lineDark),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      onPressed: _handleGoogleSignIn,
                      icon: const Icon(Icons.g_mobiledata, color: Color(0xFF4285F4), size: 24),
                      label: const Text('Google Sign-In', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: OutlinedButton.icon(
                      style: OutlinedButton.styleFrom(
                        backgroundColor: AppColors.s1Dark,
                        foregroundColor: Colors.white,
                        side: const BorderSide(color: AppColors.lineDark),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      onPressed: _handleAppleSignIn,
                      icon: const Icon(Icons.apple, color: Colors.white, size: 20),
                      label: const Text('Apple Sign-In', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Divider
              const Row(
                children: [
                  Expanded(child: Divider(color: AppColors.lineDark)),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 10),
                    child: Text('অথবা শপ লাইসেন্স কোড', style: TextStyle(color: AppColors.muDark, fontSize: 11)),
                  ),
                  Expanded(child: Divider(color: AppColors.lineDark)),
                ],
              ),
              const SizedBox(height: 20),

              // 2. License Activation Card
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: AppColors.s1Dark,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.lineDark),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.key, color: AppColors.unl, size: 18),
                        SizedBox(width: 8),
                        Text(
                          'দোকান লাইসেন্স অ্যাক্টিভেশন',
                          style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'সুপার অ্যাডমিন ওমরের দেওয়া শপ আইডি এবং ৮-অক্ষরের কোড লিখুন:',
                      style: TextStyle(color: AppColors.muDark, fontSize: 12),
                    ),
                    const SizedBox(height: 14),

                    // Shop ID
                    TextField(
                      controller: _shopIdCtrl,
                      style: const TextStyle(color: Colors.white, fontSize: 14),
                      decoration: InputDecoration(
                        filled: true,
                        fillColor: AppColors.s2Dark,
                        labelText: 'শপ আইডি (যেমন: MM-2026-01)',
                        labelStyle: const TextStyle(color: AppColors.muDark, fontSize: 12.5),
                        prefixIcon: const Icon(Icons.storefront, color: AppColors.muDark, size: 18),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Activation Code
                    TextField(
                      controller: _codeCtrl,
                      style: const TextStyle(color: Colors.white, fontSize: 14, letterSpacing: 2),
                      decoration: InputDecoration(
                        filled: true,
                        fillColor: AppColors.s2Dark,
                        labelText: 'অ্যাক্টিভেশন কোড (যেমন: MM-7K4X-92QD)',
                        labelStyle: const TextStyle(color: AppColors.muDark, fontSize: 12.5),
                        prefixIcon: const Icon(Icons.vpn_key, color: AppColors.muDark, size: 18),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
                      ),
                    ),

                    if (_errorMessage != null) ...[
                      const SizedBox(height: 10),
                      Text(
                        _errorMessage!,
                        style: const TextStyle(color: AppColors.dng, fontSize: 12),
                      ),
                    ],

                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.unl,
                          foregroundColor: AppColors.textOnAccent,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        onPressed: _isLoading ? null : _handleActivation,
                        icon: _isLoading
                            ? const SizedBox(
                                width: 18,
                                height: 18,
                                child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                              )
                            : const Icon(Icons.check_circle_outline, size: 18),
                        label: Text(
                          _isLoading ? 'যাচাই করা হচ্ছে...' : 'লাইসেন্স সক্রিয় করুন',
                          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // 3. Super Admin Direct Portal
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.s2Dark,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFF334155)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.shield_outlined, color: Color(0xFFFBBF24), size: 24),
                    const SizedBox(width: 12),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('সুপার অ্যাডমিন পোর্টাল', style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold)),
                          Text('ওমর ফারুক (মাস্টার কন্ট্রোল পিন)', style: TextStyle(color: AppColors.muDark, fontSize: 11)),
                        ],
                      ),
                    ),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFFBBF24),
                        foregroundColor: Colors.black,
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      onPressed: _openSuperAdminPinDialog,
                      child: const Text('প্রবেশ', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900)),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // 4. Contact Super Admin CTA Card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF0F2537),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppColors.unl.withOpacity(0.4)),
                ),
                child: Column(
                  children: [
                    const Text(
                      'লাইসেন্স বা প্রিমিয়াম চালান সুবিধা নিতে চান?',
                      style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'সরাসরি সিস্টেম ওনার ওমর ফারুকের সাথে যোগাযোগ করে ১ মিনিটে আপনার দোকানের জন্য লাইসেন্স তৈরি করে নিন।',
                      style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11.5),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.load,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('কল করুন: 01819-397669 (ওমর ফারুক)')),
                            );
                          },
                          icon: const Icon(Icons.call, size: 16),
                          label: const Text('01819-397669', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}
