import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/tenant_model.dart';
import '../providers/auth_provider.dart';
import '../screens/super_admin_hub_screen.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Drawer(
      backgroundColor: const Color(0xFF0F172A),
      child: SafeArea(
        child: Column(
          children: [
            // Drawer Top Bar
            _buildDrawerHeader(context, auth),

            // Drawer Content (Scrollable)
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                children: [
                  // 1. Role Switcher Ribbon (Simulation & Testing)
                  _buildRoleSwitcherRibbon(context, auth),
                  const SizedBox(height: 12),

                  // 2. Super Admin Hub Card (Visible only if Super Admin)
                  if (auth.isSuperAdmin) ...[
                    _buildSuperAdminCard(context, auth),
                    const SizedBox(height: 12),
                  ],

                  // 3. Free User Promo Card (Visible only in Free Mode)
                  if (auth.role == UserRole.freeUser) ...[
                    _buildFreeUserPromoCard(context),
                    const SizedBox(height: 12),
                  ],

                  // 4. Shop Admin Features Group (Hidden in Free Mode)
                  if (auth.hasChallanAccess) ...[
                    _buildLicenseStatusCard(context, auth),
                    const SizedBox(height: 12),
                    _buildShopNameCard(context, auth),
                    const SizedBox(height: 12),
                    _buildHeaderBannerCustomizer(context, auth),
                    const SizedBox(height: 12),
                    _buildStaffQrConnectCard(context, auth),
                    const SizedBox(height: 12),
                  ],
                ],
              ),
            ),

            // Drawer Footer
            Container(
              padding: const EdgeInsets.all(12),
              decoration: const BoxDecoration(
                color: Color(0xFF091124),
                border: Border(top: BorderSide(color: Color(0xFF1E293B))),
              ),
              child: const Center(
                child: Text(
                  'গোডাউন কাউন্টিং অ্যাপ • ভার্সন ১.০ (মাল্টি-টেন্যান্ট)',
                  style: TextStyle(color: Color(0xFF64748B), fontSize: 10),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDrawerHeader(BuildContext context, AuthProvider auth) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: const BoxDecoration(
        color: Color(0xFF091124),
        border: Border(bottom: BorderSide(color: Color(0xFF1E293B))),
      ),
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: const Color(0xFF0284C7),
              borderRadius: BorderRadius.circular(10),
            ),
            alignment: Alignment.center,
            child: const Text(
              'মা',
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w900,
                fontSize: 15,
              ),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'গোডাউন কন্ট্রোল সেন্টার',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w900,
                    fontSize: 13,
                  ),
                ),
                Text(
                  auth.shopDisplayName,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: Color(0xFF38BDF8),
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.close, color: Colors.white70, size: 20),
            onPressed: () => Navigator.pop(context),
          ),
        ],
      ),
    );
  }

  Widget _buildRoleSwitcherRibbon(BuildContext context, AuthProvider auth) {
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: const Color(0xFF050C1A),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: const Color(0xFF1E293B)),
      ),
      child: Row(
        children: [
          const Text(
            'সিমুলেশন মোড: ',
            style: TextStyle(color: Color(0xFF94A3B8), fontSize: 10),
          ),
          const Spacer(),
          DropdownButton<UserRole>(
            value: auth.role,
            dropdownColor: const Color(0xFF1E293B),
            isDense: true,
            underline: const SizedBox(),
            items: const [
              DropdownMenuItem(
                value: UserRole.freeUser,
                child: Text('ফ্রি কাউন্টার', style: TextStyle(color: Colors.white, fontSize: 11)),
              ),
              DropdownMenuItem(
                value: UserRole.shopAdmin,
                child: Text('শপ অ্যাডমিন', style: TextStyle(color: Color(0xFF38BDF8), fontSize: 11)),
              ),
              DropdownMenuItem(
                value: UserRole.superAdmin,
                child: Text('👑 সুপার অ্যাডমিন', style: TextStyle(color: Color(0xFFFBBF24), fontSize: 11)),
              ),
            ],
            onChanged: (newRole) {
              if (newRole != null) auth.switchRole(newRole);
            },
          ),
        ],
      ),
    );
  }

  Widget _buildSuperAdminCard(BuildContext context, AuthProvider auth) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF3D2605), Color(0xFF0F172A)],
        ),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFF59E0B)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                children: [
                  Icon(Icons.workspace_premium, color: Color(0xFFFBBF24), size: 16),
                  SizedBox(width: 6),
                  Text(
                    'সুপার অ্যাডমিন হাব',
                    style: TextStyle(
                      color: Color(0xFFFBBF24),
                      fontWeight: FontWeight.w900,
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: const Color(0xFFF59E0B),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: const Text(
                  'MASTER',
                  style: TextStyle(color: Colors.black, fontSize: 9, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          const Text(
            'অ্যাকাউন্ট: omarfarukitbd@gmail.com',
            style: TextStyle(color: Colors.white70, fontSize: 10),
          ),
          const SizedBox(height: 10),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFF59E0B),
                foregroundColor: Colors.black,
                padding: const EdgeInsets.symmetric(vertical: 8),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              icon: const Icon(Icons.settings, size: 14),
              label: const Text(
                'অ্যাডমিন ম্যানেজমেন্ট প্যানেল',
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900),
              ),
              onPressed: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const SuperAdminHubScreen()),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFreeUserPromoCard(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFF334155)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'চালান ও নিজস্ব শপ ব্যানার সুবিধা',
                style: TextStyle(color: Color(0xFF38BDF8), fontWeight: FontWeight.bold, fontSize: 12),
              ),
              Text(
                'লকড',
                style: TextStyle(color: Colors.redAccent, fontSize: 10, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          const SizedBox(height: 6),
          const Text(
            'আপনি বর্তমানে ফ্রি কাউন্টার মোডে আছেন। নিজস্ব শপ নাম, ১২০০x২৪০ ব্যানার ও স্বয়ংক্রিয় চালান প্রিন্ট করতে শপ অ্যাডমিন পাসওয়ার্ড দিয়ে লগইন করুন।',
            style: TextStyle(color: Color(0xFF94A3B8), fontSize: 10),
          ),
          const SizedBox(height: 10),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0284C7),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 8),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              icon: const Icon(Icons.key, size: 14),
              label: const Text(
                'ডেডিকেটেড পাসওয়ার্ড দিয়ে লগইন',
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
              ),
              onPressed: () => _showShopLoginDialog(context),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLicenseStatusCard(BuildContext context, AuthProvider auth) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFF0284C7).withOpacity(0.5)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'লাইসেন্স স্ট্যাটাস',
                style: TextStyle(color: Color(0xFF94A3B8), fontSize: 10, fontWeight: FontWeight.bold),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: const Color(0xFF064E3B),
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: const Color(0xFF10B981)),
                ),
                child: const Text(
                  'অফলাইন লাইসেন্স সক্রিয়',
                  style: TextStyle(color: Color(0xFF34D399), fontSize: 9, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            'শপ আইডি: ${auth.currentShopId}',
            style: const TextStyle(color: Color(0xFF38BDF8), fontSize: 11, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 4),
          const Text(
            '✓ ১ বার অনলাইন ভেরিফিকেশন সম্পন্ন। ইন্টারনেট ছাড়াও অফলাইনে সমস্ত চালান ফিচার আজীবন কাজ করবে।',
            style: TextStyle(color: Color(0xFF10B981), fontSize: 9.5),
          ),
        ],
      ),
    );
  }

  Widget _buildShopNameCard(BuildContext context, AuthProvider auth) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFF334155)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'দোকান / গোডাউনের নাম:',
            style: TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 6),
          TextFormField(
            initialValue: auth.shopDisplayName,
            style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
            decoration: InputDecoration(
              isDense: true,
              filled: true,
              fillColor: const Color(0xFF0F172A),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: const BorderSide(color: Color(0xFF334155)),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: const BorderSide(color: Color(0xFF334155)),
              ),
            ),
            onChanged: (val) => auth.updateShopName(val),
          ),
        ],
      ),
    );
  }

  Widget _buildHeaderBannerCustomizer(BuildContext context, AuthProvider auth) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFF334155)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'চালান হেডিং ব্যানার ডিজাইন',
                style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
              ),
              Text(
                '1200 x 240 px (৫:১)',
                style: TextStyle(color: Color(0xFFFBBF24), fontSize: 9, fontFamily: 'monospace'),
              ),
            ],
          ),
          const SizedBox(height: 4),
          const Text(
            'নির্ধারিত সাইজের ব্যানার আপলোড করলে চালানের শীর্ষে স্বয়ংক্রিয়ভাবে বসে যাবে।',
            style: TextStyle(color: Color(0xFF94A3B8), fontSize: 10),
          ),
          const SizedBox(height: 8),

          // 1200 x 240 (5:1) Aspect Ratio Live Preview Box
          AspectRatio(
            aspectRatio: 5 / 1,
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(8),
                gradient: const LinearGradient(
                  colors: [Color(0xFF082F49), Color(0xFF0F172A), Color(0xFF082F49)],
                ),
                border: Border.all(color: const Color(0xFF0284C7).withOpacity(0.6)),
              ),
              alignment: Alignment.center,
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    auth.shopDisplayName.toUpperCase(),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: Color(0xFF38BDF8),
                      fontWeight: FontWeight.w900,
                      fontSize: 11,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const Text(
                    'আমদানি ও পাইকারি যন্ত্রাংশ সরবরাহ • চট্টগ্রাম',
                    style: TextStyle(color: Colors.white70, fontSize: 8),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.white70,
                    side: const BorderSide(color: Color(0xFF475569)),
                    padding: const EdgeInsets.symmetric(vertical: 6),
                  ),
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('সিমুলেশন: ছবি ১২০০ x ২৪০ পিক্সেল (৫:১) প্রিভিউতে প্রদর্শিত হচ্ছে')),
                    );
                  },
                  child: const Text('নতুন ছবি নির্বাচন', style: TextStyle(fontSize: 10)),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF059669),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 6),
                  ),
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('চালান হেডিং ব্যানার সংরক্ষিত হয়েছে!')),
                    );
                  },
                  child: const Text('সংরক্ষণ (Save)', style: TextStyle(fontSize: 10)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStaffQrConnectCard(BuildContext context, AuthProvider auth) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFF334155)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'স্টাফ কানেক্ট কিউআর কোড',
                style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
              ),
              Text(
                'পাসওয়ার্ডহীন পেয়ারিং',
                style: TextStyle(color: Color(0xFF38BDF8), fontSize: 9, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          const SizedBox(height: 4),
          const Text(
            'গোডাউনের কর্মচারীরা তাদের ফোন দিয়ে এই কিউআর স্ক্যান করলেই সরাসরি সিস্টেমে যুক্ত হবে।',
            style: TextStyle(color: Color(0xFF94A3B8), fontSize: 10),
          ),
          const SizedBox(height: 8),

          // Simulated QR Card
          Center(
            child: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(
                Icons.qr_code_2,
                size: 72,
                color: Colors.black,
              ),
            ),
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'স্টাফদের চালান প্রিন্ট সুবিধা:',
                style: TextStyle(color: Colors.white70, fontSize: 10, fontWeight: FontWeight.bold),
              ),
              Switch(
                value: auth.currentTenant?.canStaffPrintChallan ?? true,
                activeColor: const Color(0xFF0284C7),
                onChanged: (val) => auth.toggleStaffChallanPermission(val),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _showShopLoginDialog(BuildContext context) {
    final idController = TextEditingController(text: 'MM-2026-01');
    final passController = TextEditingController(text: 'maa@2026');

    showDialog(
      context: context,
      builder: (dialogCtx) => AlertDialog(
        backgroundColor: const Color(0xFF0F172A),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Row(
          children: [
            Icon(Icons.key, color: Color(0xFF38BDF8), size: 18),
            SizedBox(width: 8),
            Text(
              'শপ অ্যাডমিন লগইন',
              style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'সুপার অ্যাডমিন থেকে প্রাপ্ত শপ আইডি ও ডেডিকেটেড পাসওয়ার্ড দিন:',
              style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: idController,
              style: const TextStyle(color: Colors.white, fontSize: 12),
              decoration: InputDecoration(
                labelText: 'শপ আইডি (Shop ID)',
                labelStyle: const TextStyle(color: Colors.white70, fontSize: 11),
                filled: true,
                fillColor: const Color(0xFF1E293B),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
              ),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: passController,
              obscureText: true,
              style: const TextStyle(color: Colors.white, fontSize: 12),
              decoration: InputDecoration(
                labelText: 'ডেডিকেটেড পাসওয়ার্ড',
                labelStyle: const TextStyle(color: Colors.white70, fontSize: 11),
                filled: true,
                fillColor: const Color(0xFF1E293B),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogCtx),
            child: const Text('বাতিল', style: TextStyle(color: Colors.white54)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0284C7)),
            onPressed: () async {
              final auth = context.read<AuthProvider>();
              try {
                final success = await auth.loginShop(
                  idController.text.trim(),
                  passController.text.trim(),
                );
                if (success) {
                  Navigator.pop(dialogCtx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('লগইন সফল! অফলাইন লাইসেন্স সক্রিয় হয়েছে।')),
                  );
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('ভুল শপ আইডি বা পাসওয়ার্ড!')),
                  );
                }
              } catch (e) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text(e.toString())),
                );
              }
            },
            child: const Text('লগইন ও আনলক'),
          ),
        ],
      ),
    );
  }
}
