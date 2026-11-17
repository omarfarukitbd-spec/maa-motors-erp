import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../models/tenant_model.dart';
import '../providers/auth_provider.dart';

class SuperAdminHubScreen extends StatefulWidget {
  const SuperAdminHubScreen({super.key});

  @override
  State<SuperAdminHubScreen> createState() => _SuperAdminHubScreenState();
}

class _SuperAdminHubScreenState extends State<SuperAdminHubScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final _shopNameController = TextEditingController();
  final _ownerNameController = TextEditingController();
  final _phoneController = TextEditingController();
  int _newDeviceLimit = 3;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _shopNameController.dispose();
    _ownerNameController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final tenants = auth.allTenants;
    final activeCount =
        tenants.where((t) => t.licenseState == LicenseState.active).length;
    final softLockCount =
        tenants.where((t) => t.licenseState == LicenseState.softLock).length;
    final suspendedCount =
        tenants.where((t) => t.licenseState == LicenseState.suspended).length;

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
                Icon(Icons.workspace_premium, color: Color(0xFFFBBF24), size: 18),
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
              style: TextStyle(
                color: Color(0xFF94A3B8),
                fontSize: 10,
                fontFamily: 'monospace',
              ),
            ),
          ],
        ),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: const Color(0xFF38BDF8),
          indicatorWeight: 3,
          labelColor: const Color(0xFF38BDF8),
          unselectedLabelColor: const Color(0xFF94A3B8),
          tabs: const [
            Tab(
              icon: Icon(Icons.storefront, size: 18),
              text: 'শপ ও লাইসেন্স',
            ),
            Tab(
              icon: Icon(Icons.security, size: 18),
              text: 'নিরাপত্তা ও অডিট লগ',
            ),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          // Tab 1: Shops & Licenses
          ListView(
            padding: const EdgeInsets.all(16),
            children: [
              // KPI Ribbon
              Row(
                children: [
                  _buildKpiCard('মোট শপ', '${tenants.length}', Colors.white),
                  const SizedBox(width: 6),
                  _buildKpiCard('সক্রিয়', '$activeCount', const Color(0xFF10B981)),
                  const SizedBox(width: 6),
                  _buildKpiCard('সফট-লক', '$softLockCount', const Color(0xFFF59E0B)),
                  const SizedBox(width: 6),
                  _buildKpiCard('স্থগিত', '$suspendedCount', const Color(0xFFEF4444)),
                ],
              ),
              const SizedBox(height: 16),

              // Add New Shop Card
              _buildAddShopCard(context, auth),
              const SizedBox(height: 16),

              // Section Header
              const Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'অনুমোদিত শপ অ্যাডমিন তালিকা',
                    style: TextStyle(
                        color: Colors.white,
                        fontSize: 13,
                        fontWeight: FontWeight.bold),
                  ),
                  Text(
                    '৪-স্তরের অফলাইন লাইসেন্স কন্ট্রোল',
                    style: TextStyle(color: Color(0xFF38BDF8), fontSize: 9.5),
                  ),
                ],
              ),
              const SizedBox(height: 10),

              // Tenant Cards
              ...tenants.map((tenant) => _buildTenantCard(context, auth, tenant)),
            ],
          ),

          // Tab 2: Security & Audit Logs
          _buildAuditLogsView(auth),
        ],
      ),
    );
  }

  Widget _buildKpiCard(String label, String value, Color valueColor) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 6),
        decoration: BoxDecoration(
          color: const Color(0xFF1E293B),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: const Color(0xFF334155)),
        ),
        child: Column(
          children: [
            Text(label,
                style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 9.5)),
            const SizedBox(height: 2),
            Text(
              value,
              style: TextStyle(
                color: valueColor,
                fontSize: 15,
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
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFF0284C7).withOpacity(0.5)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(Icons.add_business, color: Color(0xFF38BDF8), size: 16),
                  SizedBox(width: 6),
                  Text(
                    'নতুন শপ অ্যাডমিন ও অ্যাক্টিভেশন কোড তৈরি',
                    style: TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              Text(
                '৮-অক্ষরের কোড',
                style: TextStyle(color: Color(0xFFFBBF24), fontSize: 9.5),
              ),
            ],
          ),
          const SizedBox(height: 10),
          TextField(
            controller: _shopNameController,
            style: const TextStyle(color: Colors.white, fontSize: 12),
            decoration: InputDecoration(
              hintText: 'গোডাউন / শপের নাম (যেমন: মা মোটরস চট্টগ্রাম)',
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
                    hintStyle:
                        const TextStyle(color: Color(0xFF64748B), fontSize: 11),
                    isDense: true,
                    filled: true,
                    fillColor: const Color(0xFF0F172A),
                    border:
                        OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
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
                    hintStyle:
                        const TextStyle(color: Color(0xFF64748B), fontSize: 11),
                    isDense: true,
                    filled: true,
                    fillColor: const Color(0xFF0F172A),
                    border:
                        OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              const Text('ডিভাইস সীমা:',
                  style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11)),
              const SizedBox(width: 8),
              DropdownButton<int>(
                dropdownColor: const Color(0xFF0F172A),
                value: _newDeviceLimit,
                items: [1, 2, 3, 5, 10].map((num) {
                  return DropdownMenuItem<int>(
                    value: num,
                    child: Text('$num টি ফোন',
                        style: const TextStyle(
                            color: Color(0xFF38BDF8), fontSize: 11)),
                  );
                }).toList(),
                onChanged: (val) {
                  if (val != null) setState(() => _newDeviceLimit = val);
                },
              ),
              const Spacer(),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0284C7),
                  foregroundColor: Colors.white,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8)),
                ),
                icon: const Icon(Icons.key, size: 14),
                label: const Text(
                  'কোড তৈরি করুন',
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                ),
                onPressed: () async {
                  final name = _shopNameController.text.trim();
                  if (name.isEmpty) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                          content: Text('অনুগ্রহ করে শপের নাম লিখুন!')),
                    );
                    return;
                  }
                  final newShop = await auth.createNewShop(
                    shopName: name,
                    ownerName: _ownerNameController.text.trim(),
                    phone: _phoneController.text.trim(),
                    deviceLimit: _newDeviceLimit,
                  );
                  _shopNameController.clear();
                  _ownerNameController.clear();
                  _phoneController.clear();

                  if (mounted) {
                    showDialog(
                      context: context,
                      builder: (ctx) => AlertDialog(
                        backgroundColor: const Color(0xFF0F172A),
                        title: const Text('শপ তৈরি সম্পন্ন!',
                            style: TextStyle(color: Colors.white)),
                        content: Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('শপ নাম: ${newShop.shopName}',
                                style: const TextStyle(color: Colors.white)),
                            const SizedBox(height: 4),
                            Text('শপ আইডি: ${newShop.id}',
                                style: const TextStyle(color: Color(0xFF38BDF8))),
                            const SizedBox(height: 4),
                            Text(
                              'অ্যাক্টিভেশন কোড: ${newShop.activationCode}',
                              style: const TextStyle(
                                  color: Color(0xFF10B981),
                                  fontWeight: FontWeight.bold,
                                  fontSize: 14),
                            ),
                          ],
                        ),
                        actions: [
                          TextButton(
                            onPressed: () {
                              Clipboard.setData(ClipboardData(
                                text:
                                    'গোডাউন অ্যাপ অ্যাক্টিভেশন:\nশপ: ${newShop.shopName}\nশপ আইডি: ${newShop.id}\nকোড: ${newShop.activationCode}',
                              ));
                              Navigator.pop(ctx);
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                    content: Text('তথ্য কপি করা হয়েছে!')),
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
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTenantCard(
      BuildContext context, AuthProvider auth, Tenant tenant) {
    Color badgeColor;
    String badgeText;
    switch (tenant.licenseState) {
      case LicenseState.active:
        badgeColor = const Color(0xFF10B981);
        badgeText = 'সক্রিয় (Active)';
        break;
      case LicenseState.grace:
        badgeColor = const Color(0xFFF59E0B);
        badgeText = 'গ্রেস পিরিয়ড (Grace)';
        break;
      case LicenseState.softLock:
        badgeColor = const Color(0xFFEF4444);
        badgeText = 'সফট-লক (Soft-Lock)';
        break;
      case LicenseState.suspended:
        badgeColor = const Color(0xFF991B1B);
        badgeText = 'স্থগিত (Suspended)';
        break;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: tenant.licenseState == LicenseState.active
              ? const Color(0xFF334155)
              : badgeColor.withOpacity(0.7),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Shop Name & Status Badge
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  tenant.shopName,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: badgeColor.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: badgeColor),
                ),
                child: Text(
                  badgeText,
                  style: TextStyle(
                    color: badgeColor,
                    fontSize: 9.5,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),

          // ID and 8-character activation code
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
            decoration: BoxDecoration(
              color: const Color(0xFF0F172A),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'শপ আইডি: ${tenant.id}',
                        style: const TextStyle(
                            color: Color(0xFF94A3B8), fontSize: 10),
                      ),
                      Text(
                        'কোড: ${tenant.activationCode}',
                        style: const TextStyle(
                          color: Color(0xFF38BDF8),
                          fontSize: 13,
                          fontFamily: 'monospace',
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1.1,
                        ),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.copy, size: 16, color: Color(0xFF38BDF8)),
                  tooltip: 'কোড কপি করুন',
                  onPressed: () {
                    Clipboard.setData(ClipboardData(text: tenant.activationCode));
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                          content:
                              Text('কোড কপি হয়েছে: ${tenant.activationCode}')),
                    );
                  },
                ),
                IconButton(
                  icon: const Icon(Icons.refresh,
                      size: 16, color: Color(0xFFFBBF24)),
                  tooltip: 'নতুন কোড জেনারেট',
                  onPressed: () async {
                    final newCode = await auth.regenerateShopCode(tenant.id);
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                            content:
                                Text('নতুন কোড সক্রিয় হয়েছে: $newCode')),
                      );
                    }
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),

          // Stats and Controls
          Row(
            children: [
              Text(
                'ডিভাইস সীমা: ${tenant.deviceLimit} টি  •  চালান: ${tenant.challanCount} টি',
                style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 10.5),
              ),
              const Spacer(),
              // Device Limit Adjuster
              IconButton(
                icon: const Icon(Icons.remove_circle_outline,
                    size: 16, color: Color(0xFF94A3B8)),
                onPressed: tenant.deviceLimit > 1
                    ? () => auth.updateTenantDeviceLimit(
                        tenant.id, tenant.deviceLimit - 1)
                    : null,
              ),
              Text('${tenant.deviceLimit}',
                  style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 11)),
              IconButton(
                icon: const Icon(Icons.add_circle_outline,
                    size: 16, color: Color(0xFF94A3B8)),
                onPressed: () => auth.updateTenantDeviceLimit(
                    tenant.id, tenant.deviceLimit + 1),
              ),
            ],
          ),
          const SizedBox(height: 6),
          const Divider(color: Color(0xFF334155), height: 1),
          const SizedBox(height: 6),

          // License State Changer Dropdown & Delete
          Row(
            children: [
              const Text('লাইসেন্স স্টেট:',
                  style: TextStyle(color: Color(0xFF94A3B8), fontSize: 10)),
              const SizedBox(width: 8),
              DropdownButton<LicenseState>(
                dropdownColor: const Color(0xFF0F172A),
                value: tenant.licenseState,
                underline: const SizedBox(),
                items: const [
                  DropdownMenuItem(
                    value: LicenseState.active,
                    child: Text('সক্রিয় (Active)',
                        style:
                            TextStyle(color: Color(0xFF10B981), fontSize: 10.5)),
                  ),
                  DropdownMenuItem(
                    value: LicenseState.grace,
                    child: Text('গ্রেস (Grace 7d)',
                        style:
                            TextStyle(color: Color(0xFFF59E0B), fontSize: 10.5)),
                  ),
                  DropdownMenuItem(
                    value: LicenseState.softLock,
                    child: Text('সফট-লক (Soft-Lock)',
                        style:
                            TextStyle(color: Color(0xFFEF4444), fontSize: 10.5)),
                  ),
                  DropdownMenuItem(
                    value: LicenseState.suspended,
                    child: Text('স্থগিত (Suspended)',
                        style:
                            TextStyle(color: Color(0xFF991B1B), fontSize: 10.5)),
                  ),
                ],
                onChanged: (newState) {
                  if (newState != null) {
                    auth.setTenantLicenseState(tenant.id, newState);
                  }
                },
              ),
              const Spacer(),
              IconButton(
                icon: const Icon(Icons.delete_outline,
                    color: Colors.redAccent, size: 16),
                tooltip: 'শপ মুছে ফেলুন',
                onPressed: () async {
                  final confirm = await showDialog<bool>(
                    context: context,
                    builder: (ctx) => AlertDialog(
                      backgroundColor: const Color(0xFF0F172A),
                      title: const Text('শপ মুছে ফেলবেন?',
                          style: TextStyle(color: Colors.white)),
                      content: Text(
                        '${tenant.shopName} শপ অ্যাকাউন্টটি কি স্থায়ীভাবে মুছে ফেলতে চান?',
                        style: const TextStyle(color: Colors.white70),
                      ),
                      actions: [
                        TextButton(
                            onPressed: () => Navigator.pop(ctx, false),
                            child: const Text('না')),
                        TextButton(
                          onPressed: () => Navigator.pop(ctx, true),
                          child: const Text('মুছে ফেলুন',
                              style: TextStyle(color: Colors.redAccent)),
                        ),
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

  Widget _buildAuditLogsView(AuthProvider auth) {
    final logs = auth.auditLogs;
    if (logs.isEmpty) {
      return const Center(
        child: Text(
          'কোনো অডিট লগ রেকর্ড পাওয়া যায়নি',
          style: TextStyle(color: Color(0xFF64748B), fontSize: 12),
        ),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: logs.length,
      separatorBuilder: (_, __) =>
          const Divider(color: Color(0xFF1E293B), height: 1),
      itemBuilder: (context, idx) {
        final item = logs[idx];
        final action = item['action'] ?? 'ACTION';
        final shopId = item['shopId'] ?? '';
        final details = item['details'] ?? '';
        final time = item['timestamp'] ?? '';

        Color actionColor = const Color(0xFF38BDF8);
        if (action.contains('SUSPEND') || action.contains('DELETE')) {
          actionColor = const Color(0xFFEF4444);
        } else if (action.contains('ACTIVATION') || action.contains('CREATE')) {
          actionColor = const Color(0xFF10B981);
        }

        return Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: actionColor.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(4),
                  border: Border.all(color: actionColor.withOpacity(0.5)),
                ),
                child: Text(
                  action,
                  style: TextStyle(
                      color: actionColor,
                      fontSize: 9,
                      fontWeight: FontWeight.bold),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      details,
                      style: const TextStyle(color: Colors.white, fontSize: 11),
                    ),
                    Text(
                      'শপ: $shopId  •  $time',
                      style: const TextStyle(
                          color: Color(0xFF64748B), fontSize: 9.5),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
