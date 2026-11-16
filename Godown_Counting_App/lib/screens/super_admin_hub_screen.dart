import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';

class SuperAdminHubScreen extends StatefulWidget {
  const SuperAdminHubScreen({super.key});

  @override
  State<SuperAdminHubScreen> createState() => _SuperAdminHubScreenState();
}

class _SuperAdminHubScreenState extends State<SuperAdminHubScreen> {
  final _shopNameController = TextEditingController();
  final _ownerNameController = TextEditingController();
  final _phoneController = TextEditingController();

  @override
  void dispose() {
    _shopNameController.dispose();
    _ownerNameController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final tenants = auth.allTenants;
    final activeCount = tenants.where((t) => t.isActive).length;

    return Scaffold(
      backgroundColor: const Color(0xFF0B132B),
      appBar: AppBar(
        backgroundColor: const Color(0xFF091124),
        elevation: 0,
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(FontAwesomeIcons.crown, color: Color(0xFFFBBF24), size: 16),
                SizedBox(width: 8),
                Text(
                  'সুপার অ্যাডমিন হাব • মাস্টার কন্ট্রোল',
                  style: TextStyle(
                    color: Color(0xFFFDE68A),
                    fontSize: 14,
                    fontWeight: FontWeight.w900,
                  ),
                ),
              ],
            ),
            Text(
              'omarfarukitbd@gmail.com',
              style: TextStyle(color: Color(0xFF94A3B8), fontSize: 10, fontFamily: 'monospace'),
            ),
          ],
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // 1. KPI Stats Ribbon
          Row(
            children: [
              _buildKpiCard('মোট শপ', '${tenants.length}', Colors.white),
              const SizedBox(width: 8),
              _buildKpiCard('সক্রিয় শপ', '$activeCount', const Color(0xFF10B981)),
              const SizedBox(width: 8),
              _buildKpiCard('মোট চালান', '১২৮ টি', const Color(0xFFFBBF24)),
            ],
          ),
          const SizedBox(height: 16),

          // 2. Add New Shop Admin Card
          _buildAddShopCard(context, auth),
          const SizedBox(height: 16),

          // 3. Shop Registry Header
          const Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              Text(
                'অনুমোদিত শপ অ্যাডমিন তালিকা',
                style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
              ),
              Text(
                'অনলাইন রিমোট কন্ট্রোল',
                style: TextStyle(color: Color(0xFF38BDF8), fontSize: 10),
              ),
            ],
          ),
          const SizedBox(height: 10),

          // 4. Shop Admin Cards List
          ...tenants.map((tenant) => _buildTenantTile(context, auth, tenant)),
        ],
      ),
    );
  }

  Widget _buildKpiCard(String label, String value, Color valueColor) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
        decoration: BoxDecoration(
          color: const Color(0xFF1E293B),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFF334155)),
        ),
        child: Column(
          children: [
            Text(label, style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 9.5)),
            const SizedBox(height: 2),
            Text(
              value,
              style: TextStyle(
                color: valueColor,
                fontSize: 16,
                fontWeight: FontWeight.w900,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAddShopCard(BuildContext context, AuthProvider auth) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFF152238),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFF0284C7).withOpacity(0.6)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              Row(
                children: [
                  Icon(Icons.add_business, color: Color(0xFF38BDF8), size: 16),
                  SizedBox(width: 6),
                  Text(
                    'নতুন শপ অ্যাডমিন তৈরি করুন',
                    style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              Text(
                '১-ক্লিক পাসওয়ার্ড',
                style: TextStyle(color: Color(0xFFFBBF24), fontSize: 9.5),
              ),
            ],
          ),
          const SizedBox(height: 10),
          TextField(
            controller: _shopNameController,
            style: const TextStyle(color: Colors.white, fontSize: 12),
            decoration: InputDecoration(
              hintText: 'গোডাউন / শপের নাম (যেমন: করিম মোটরস)',
              hintStyle: const TextStyle(color: Color(0xFF64748B), fontSize: 11),
              isDense: true,
              filled: true,
              fillColor: const Color(0xFF0F172A),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
            ),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _ownerNameController,
                  style: const TextStyle(color: Colors.white, fontSize: 12),
                  decoration: InputDecoration(
                    hintText: 'মালিকের নাম',
                    hintStyle: const TextStyle(color: Color(0xFF64748B), fontSize: 11),
                    isDense: true,
                    filled: true,
                    fillColor: const Color(0xFF0F172A),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: TextField(
                  controller: _phoneController,
                  style: const TextStyle(color: Colors.white, fontSize: 12),
                  decoration: InputDecoration(
                    hintText: 'মোবাইল নম্বর',
                    hintStyle: const TextStyle(color: Color(0xFF64748B), fontSize: 11),
                    isDense: true,
                    filled: true,
                    fillColor: const Color(0xFF0F172A),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                ),
              ),
            ],
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
              icon: const Icon(Icons.security, size: 14),
              label: const Text(
                'শপ অ্যাডমিন তৈরি ও পাসওয়ার্ড একটিভ করুন',
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
              ),
              onPressed: () async {
                final name = _shopNameController.text.trim();
                if (name.isEmpty) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('অনুগ্রহ করে শপের নাম লিখুন!')),
                  );
                  return;
                }
                final newShop = await auth.createNewShop(
                  shopName: name,
                  ownerName: _ownerNameController.text.trim(),
                  phone: _phoneController.text.trim(),
                );
                _shopNameController.clear();
                _ownerNameController.clear();
                _phoneController.clear();

                if (mounted) {
                  showDialog(
                    context: context,
                    builder: (ctx) => AlertDialog(
                      backgroundColor: const Color(0xFF0F172A),
                      title: const Text('শপ তৈরি সম্পন্ন!', style: TextStyle(color: Colors.white)),
                      content: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('শপ নাম: ${newShop.shopName}', style: const TextStyle(color: Colors.white)),
                          Text('শপ আইডি: ${newShop.id}', style: const TextStyle(color: Color(0xFF38BDF8))),
                          Text('গোপন পাসওয়ার্ড: ${newShop.accessPassword}', style: const TextStyle(color: Color(0xFF10B981))),
                        ],
                      ),
                      actions: [
                        TextButton(
                          onPressed: () {
                            Clipboard.setData(ClipboardData(
                              text: 'গোডাউন অ্যাপ লগইন:\nশপ আইডি: ${newShop.id}\nপাসওয়ার্ড: ${newShop.accessPassword}',
                            ));
                            Navigator.pop(ctx);
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('তথ্য কপি করা হয়েছে!')),
                            );
                          },
                          child: const Text('কপি করুন'),
                        ),
                        TextButton(
                          onPressed: () => Navigator.pop(ctx),
                          child: const Text('ঠিক আছে'),
                        ),
                      ],
                    ),
                  );
                }
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTenantTile(BuildContext context, AuthProvider auth, dynamic tenant) {
    final isActive = tenant.isActive;

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isActive ? const Color(0xFF334155) : Colors.redAccent.withOpacity(0.6),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              Expanded(
                child: Text(
                  tenant.shopName,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: isActive ? const Color(0xFF064E3B) : const Color(0xFF4C0519),
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(
                    color: isActive ? const Color(0xFF10B981) : Colors.redAccent,
                  ),
                ),
                child: Text(
                  isActive ? 'সক্রিয় (Active)' : 'স্থগিত (Suspended)',
                  style: TextStyle(
                    color: isActive ? const Color(0xFF34D399) : Colors.redAccent,
                    fontSize: 9,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            'আইডি: ${tenant.id}  •  পাসওয়ার্ড: ${tenant.accessPassword}',
            style: const TextStyle(
              color: Color(0xFF38BDF8),
              fontSize: 10.5,
              fontFamily: 'monospace',
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          const Divider(color: Color(0xFF334155), height: 1),
          const SizedBox(height: 6),
          Row(
            children: [
              Text(
                'চালান: ${tenant.challanCount} টি  •  স্টাফ: ${tenant.staffCount} জন',
                style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 10),
              ),
              const Spacer(),
              TextButton(
                style: TextButton.styleFrom(
                  foregroundColor: isActive ? const Color(0xFFFBBF24) : const Color(0xFF10B981),
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                ),
                onPressed: () => auth.toggleSuspendShop(tenant.id),
                child: Text(isActive ? 'স্থগিত' : 'সক্রিয় করুন', style: const TextStyle(fontSize: 10)),
              ),
              IconButton(
                icon: const Icon(Icons.delete_outline, color: Colors.redAccent, size: 16),
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(),
                onPressed: () async {
                  final confirm = await showDialog<bool>(
                    context: context,
                    builder: (ctx) => AlertDialog(
                      backgroundColor: const Color(0xFF0F172A),
                      title: const Text('শপ মুছে ফেলবেন?', style: TextStyle(color: Colors.white)),
                      content: Text('${tenant.shopName} শপ অ্যাকাউন্টটি কি স্থায়ীভাবে মুছে ফেলতে চান?', style: const TextStyle(color: Colors.white70)),
                      actions: [
                        TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('না')),
                        TextButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('মুছে ফেলুন', style: TextStyle(color: Colors.redAccent))),
                      ],
                    ),
                  );
                  if (confirm == true) {
                    auth.deleteShop(tenant.id);
                  }
                },
              ),
            ],
          ),
        ],
      ),
    );
  }
}
