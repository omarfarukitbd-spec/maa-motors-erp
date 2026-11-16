import 'dart:convert';
import 'dart:math';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/tenant_model.dart';

class AuthLicensingService {
  static const String superAdminEmail = 'omarfarukitbd@gmail.com';
  static const String _prefKeyOfflineTenant = 'offline_cached_tenant_v1';
  static const String _prefKeyAllTenants = 'all_registered_tenants_v1';
  static const String _prefKeyCurrentRole = 'app_current_user_role_v1';

  // In-memory / persistent seed list of shops
  static final List<Tenant> _defaultTenants = [
    Tenant(
      id: 'MM-2026-01',
      shopName: 'মেসার্স মা মোটরস • গোডাউন',
      ownerName: 'ওমর ফারুক',
      phone: '01819-397669',
      accessPassword: 'maa@2026',
      licenseKey: 'MM-PREM-9842-8819',
      licenseStatus: 'active',
      aspectRatio: '5:1',
      bannerWidth: 1200,
      bannerHeight: 240,
      canStaffPrintChallan: true,
      challanCount: 92,
      staffCount: 4,
    ),
    Tenant(
      id: 'SHP-2026-02',
      shopName: 'রহিম ব্রাদার্স পার্টস গোডাউন',
      ownerName: 'রহিম উল্লাহ',
      phone: '01711-223344',
      accessPassword: 'rahim@782',
      licenseKey: 'RB-PREM-4412-1092',
      licenseStatus: 'active',
      aspectRatio: '5:1',
      bannerWidth: 1200,
      bannerHeight: 240,
      canStaffPrintChallan: true,
      challanCount: 36,
      staffCount: 2,
    ),
  ];

  static bool isSuperAdmin(String? email) {
    if (email == null) return false;
    return email.trim().toLowerCase() == superAdminEmail.toLowerCase();
  }

  // Load all registered shops from SharedPreferences (or fallback to defaults)
  Future<List<Tenant>> getAllTenants() async {
    final prefs = await SharedPreferences.getInstance();
    final rawJson = prefs.getString(_prefKeyAllTenants);
    if (rawJson == null || rawJson.isEmpty) {
      await saveAllTenants(_defaultTenants);
      return List.from(_defaultTenants);
    }
    try {
      final List decoded = jsonDecode(rawJson);
      return decoded.map((e) => Tenant.fromJson(e)).toList();
    } catch (_) {
      return List.from(_defaultTenants);
    }
  }

  Future<void> saveAllTenants(List<Tenant> tenants) async {
    final prefs = await SharedPreferences.getInstance();
    final rawJson = jsonEncode(tenants.map((t) => t.toJson()).toList());
    await prefs.setString(_prefKeyAllTenants, rawJson);
  }

  // Verify shop login with shopId and dedicated secret password
  Future<Tenant?> verifyShopLogin(String shopId, String password) async {
    final tenants = await getAllTenants();
    final cleanId = shopId.trim();
    final cleanPass = password.trim();

    try {
      final matched = tenants.firstWhere(
        (t) =>
            t.id.toLowerCase() == cleanId.toLowerCase() &&
            t.accessPassword == cleanPass,
      );

      if (!matched.isActive) {
        throw Exception('এই শপ অ্যাকাউন্টটি স্থগিত (Suspended) রয়েছে। ওনারের সাথে যোগাযোগ করুন।');
      }

      // Save offline cached license on successful login
      await saveOfflineLicense(matched);
      return matched;
    } catch (e) {
      if (e.toString().contains('স্থগিত')) rethrow;
      return null;
    }
  }

  // Save offline license token to local device storage
  Future<void> saveOfflineLicense(Tenant tenant) async {
    final prefs = await SharedPreferences.getInstance();
    final jsonStr = jsonEncode(tenant.toJson());
    await prefs.setString(_prefKeyOfflineTenant, jsonStr);
    await prefs.setString(_prefKeyCurrentRole, UserRole.shopAdmin.name);
  }

  // Load cached offline license
  Future<Tenant?> loadCachedOfflineLicense() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_prefKeyOfflineTenant);
    if (raw == null || raw.isEmpty) return null;
    try {
      return Tenant.fromJson(jsonDecode(raw));
    } catch (_) {
      return null;
    }
  }

  // Create new shop tenant by Super Admin
  Future<Tenant> createTenant({
    required String shopName,
    required String ownerName,
    required String phone,
  }) async {
    final tenants = await getAllTenants();
    final nextNum = tenants.length + 1;
    final id = 'SHP-2026-0$nextNum';
    final randomPass = 'PASS-${1000 + Random().nextInt(9000)}';
    final licenseKey = 'LIC-${Random().nextInt(9999)}-${Random().nextInt(9999)}';

    final newTenant = Tenant(
      id: id,
      shopName: shopName,
      ownerName: ownerName,
      phone: phone,
      accessPassword: randomPass,
      licenseKey: licenseKey,
      licenseStatus: 'active',
      aspectRatio: '5:1',
      bannerWidth: 1200,
      bannerHeight: 240,
      canStaffPrintChallan: true,
      challanCount: 0,
      staffCount: 1,
    );

    tenants.add(newTenant);
    await saveAllTenants(tenants);
    return newTenant;
  }

  // Toggle Suspend / Active for a shop
  Future<bool> toggleTenantSuspend(String shopId) async {
    final tenants = await getAllTenants();
    final index = tenants.indexWhere((t) => t.id == shopId);
    if (index == -1) return false;

    tenants[index].licenseStatus =
        tenants[index].licenseStatus == 'active' ? 'suspended' : 'active';

    await saveAllTenants(tenants);

    // If current offline tenant is this one, update local cache
    final cached = await loadCachedOfflineLicense();
    if (cached != null && cached.id == shopId) {
      await saveOfflineLicense(tenants[index]);
    }
    return true;
  }

  // Delete tenant permanently
  Future<bool> deleteTenant(String shopId) async {
    final tenants = await getAllTenants();
    tenants.removeWhere((t) => t.id == shopId);
    await saveAllTenants(tenants);

    final cached = await loadCachedOfflineLicense();
    if (cached != null && cached.id == shopId) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_prefKeyOfflineTenant);
    }
    return true;
  }

  // Clear offline license / logout
  Future<void> clearOfflineLicense() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_prefKeyOfflineTenant);
    await prefs.setString(_prefKeyCurrentRole, UserRole.freeUser.name);
  }
}
