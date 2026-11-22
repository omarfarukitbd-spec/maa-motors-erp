import 'dart:convert';
import 'dart:math';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/tenant_model.dart';
import 'offline_storage_service.dart';

class AuthLicensingService {
  static const String superAdminEmail = 'omarfarukitbd@gmail.com';
  static const String _prefKeyOfflineTenant = 'offline_cached_tenant_v2';
  static const String _prefKeyAllTenants = 'all_registered_tenants_v2';
  static const String _prefKeyCurrentRole = 'app_current_user_role_v2';
  static const String _prefKeyAuditLogs = 'godown_audit_logs_v2';

  // Seed default Maa Motors ERP Godown Company
  static final List<Tenant> _defaultTenants = [
    Tenant(
      id: 'MM-2026-01',
      shopName: 'মেসার্স মা মোটরস • গোডাউন',
      ownerName: 'ওমর ফারুক',
      phone: '01819-397669',
      address: 'গোডাউন-১, রেলগেট সংলগ্ন, মুরাদপুর, চট্টগ্রাম',
      tagline: 'জাপানি গাড়ি ও ট্রাকের জেনুইন পার্টস আমদানিকারক ও পাইকারি বিক্রেতা',
      activationCode: 'MM-MAA-2026',
      licenseKey: 'LIC-MAA-MOTORS-ERP',
      licenseState: LicenseState.active,
      deviceLimit: 10,
      graceDays: 30,
      aspectRatio: '5:1',
      bannerWidth: 1200,
      bannerHeight: 240,
      canStaffPrintChallan: true,
      challanCount: 100,
      staffCount: 5,
    ),
  ];

  /// Verify Staff PIN for Maa Motors Godown
  static Map<String, String>? verifyStaffPin(String pin) {
    final cleanPin = pin.trim();
    if (cleanPin == '1925') {
      return {'id': '1925', 'name': 'মোঃ এমরান', 'role': 'গোডাউন ইনচার্জ'};
    } else if (cleanPin == '1234') {
      return {'id': '1234', 'name': 'আলতাফ', 'role': 'সহকারী ইনচার্জ'};
    } else if (cleanPin == '7860') {
      return {'id': '7860', 'name': 'ওমর ফারুক', 'role': 'ওনার / সুপার অ্যাডমিন'};
    }
    return null;
  }

  static bool isSuperAdmin(String? email) {
    if (email == null) return false;
    return email.trim().toLowerCase() == superAdminEmail.toLowerCase();
  }

  // Load all registered shops
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

  // Verify Activation Code (8-character code, e.g. MM-7K4X-92QD)
  Future<Tenant?> activateWithCode(String shopId, String activationCode) async {
    final tenants = await getAllTenants();
    final cleanId = shopId.trim().toUpperCase();
    final cleanCode = activationCode.trim().toUpperCase().replaceAll(' ', '');

    try {
      final matched = tenants.firstWhere(
        (t) =>
            t.id.toUpperCase() == cleanId &&
            t.activationCode.toUpperCase().replaceAll(' ', '') == cleanCode,
      );

      // Check clock integrity on device
      final clockOk = await OfflineStorageService.checkClockIntegrity();
      if (!clockOk) {
        matched.isClockTampered = true;
      }

      // Check suspended state
      if (matched.licenseState == LicenseState.suspended) {
        throw Exception(
            'এই শপ অ্যাকাউন্টটি সার্ভার থেকে স্থগিত (Suspended) রয়েছে। ওনারের সাথে যোগাযোগ করুন।');
      }

      // Generate signed token simulation
      matched.signedToken = 'SIG-${matched.id}-${DateTime.now().millisecondsSinceEpoch}';
      matched.lastOnlineSyncAt = DateTime.now();

      await saveOfflineLicense(matched);
      await logAudit('SHOP_ACTIVATION', matched.id, 'ফোন সফলভাবে অ্যাক্টিভেট হয়েছে');
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

  // Load cached offline license & evaluate live state
  Future<Tenant?> loadCachedOfflineLicense() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_prefKeyOfflineTenant);
    if (raw == null || raw.isEmpty) return null;
    try {
      final tenant = Tenant.fromJson(jsonDecode(raw));

      // Re-check anti-tamper clock
      final clockOk = await OfflineStorageService.checkClockIntegrity();
      if (!clockOk) {
        tenant.isClockTampered = true;
      }

      return tenant;
    } catch (_) {
      return null;
    }
  }

  // Create new shop tenant by Super Admin (Generates 8-char activation code)
  Future<Tenant> createTenant({
    required String shopName,
    required String ownerName,
    required String phone,
    int deviceLimit = 3,
  }) async {
    final tenants = await getAllTenants();
    final nextNum = tenants.length + 1;
    final id = 'SHP-2026-0$nextNum';
    
    // Generate 8-char formatted activation code: MM-XXXX-XXXX
    final chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    final rand = Random();
    String rPart1 = List.generate(4, (_) => chars[rand.nextInt(chars.length)]).join();
    String rPart2 = List.generate(4, (_) => chars[rand.nextInt(chars.length)]).join();
    final activationCode = 'MM-$rPart1-$rPart2';
    final licenseKey = 'LIC-MM-${rand.nextInt(8999) + 1000}-${rand.nextInt(8999) + 1000}';

    final newTenant = Tenant(
      id: id,
      shopName: shopName,
      ownerName: ownerName,
      phone: phone,
      activationCode: activationCode,
      licenseKey: licenseKey,
      licenseState: LicenseState.active,
      deviceLimit: deviceLimit,
      graceDays: 7,
      aspectRatio: '5:1',
      bannerWidth: 1200,
      bannerHeight: 240,
      canStaffPrintChallan: true,
      challanCount: 0,
      staffCount: 1,
    );

    tenants.add(newTenant);
    await saveAllTenants(tenants);
    await logAudit('CREATE_SHOP', id, 'নতুন শপ ও অ্যাক্টিভেশন কোড তৈরি করা হয়েছে');
    return newTenant;
  }

  // Regenerate activation code for an existing shop
  Future<String> regenerateActivationCode(String shopId) async {
    final tenants = await getAllTenants();
    final index = tenants.indexWhere((t) => t.id == shopId);
    if (index == -1) throw Exception('দোকান পাওয়া যায়নি');

    final chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    final rand = Random();
    String rPart1 = List.generate(4, (_) => chars[rand.nextInt(chars.length)]).join();
    String rPart2 = List.generate(4, (_) => chars[rand.nextInt(chars.length)]).join();
    final newCode = 'MM-$rPart1-$rPart2';

    tenants[index].activationCode = newCode;
    await saveAllTenants(tenants);
    await logAudit('REGEN_CODE', shopId, 'নতুন অ্যাক্টিভেশন কোড জেনারেট: $newCode');
    return newCode;
  }

  // Update Device Limit
  Future<void> updateDeviceLimit(String shopId, int limit) async {
    final tenants = await getAllTenants();
    final index = tenants.indexWhere((t) => t.id == shopId);
    if (index == -1) return;

    tenants[index].deviceLimit = limit;
    await saveAllTenants(tenants);

    final cached = await loadCachedOfflineLicense();
    if (cached != null && cached.id == shopId) {
      cached.deviceLimit = limit;
      await saveOfflineLicense(cached);
    }

    await logAudit('UPDATE_DEVICE_LIMIT', shopId, 'ডিভাইস লিমিট আপডেট: $limit টি');
  }

  // Set explicit license state (active, grace, softLock, suspended)
  Future<void> setTenantLicenseState(String shopId, LicenseState state) async {
    final tenants = await getAllTenants();
    final index = tenants.indexWhere((t) => t.id == shopId);
    if (index == -1) return;

    tenants[index].licenseState = state;
    await saveAllTenants(tenants);

    final cached = await loadCachedOfflineLicense();
    if (cached != null && cached.id == shopId) {
      cached.licenseState = state;
      await saveOfflineLicense(cached);
    }

    await logAudit('SET_LICENSE_STATE', shopId, 'লাইসেন্স স্টেট পরিবর্তন: ${state.name}');
  }

  // Toggle Suspend / Active for a shop
  Future<bool> toggleTenantSuspend(String shopId) async {
    final tenants = await getAllTenants();
    final index = tenants.indexWhere((t) => t.id == shopId);
    if (index == -1) return false;

    final current = tenants[index].licenseState;
    final next = current == LicenseState.suspended
        ? LicenseState.active
        : LicenseState.suspended;
    tenants[index].licenseState = next;

    await saveAllTenants(tenants);

    final cached = await loadCachedOfflineLicense();
    if (cached != null && cached.id == shopId) {
      cached.licenseState = next;
      await saveOfflineLicense(cached);
    }

    await logAudit('TOGGLE_SUSPEND', shopId, 'লাইসেন্স অবস্থা পরিবর্তন: ${next.name}');
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
    await logAudit('DELETE_SHOP', shopId, 'শপ ডিলিট করা হয়েছে');
    return true;
  }

  // Audit Log Recorder
  Future<void> logAudit(String action, String shopId, String details) async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_prefKeyAuditLogs);
    List logs = raw != null && raw.isNotEmpty ? jsonDecode(raw) : [];
    logs.insert(0, {
      'action': action,
      'shopId': shopId,
      'details': details,
      'timestamp': DateTime.now().toIso8601String(),
    });
    // Keep last 100 logs
    if (logs.length > 100) logs = logs.sublist(0, 100);
    await prefs.setString(_prefKeyAuditLogs, jsonEncode(logs));
  }

  Future<List<Map<String, dynamic>>> getAuditLogs() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_prefKeyAuditLogs);
    if (raw == null || raw.isEmpty) return [];
    try {
      final List decoded = jsonDecode(raw);
      return decoded.map((e) => Map<String, dynamic>.from(e)).toList();
    } catch (_) {
      return [];
    }
  }

  // Clear offline license / logout
  Future<void> clearOfflineLicense() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_prefKeyOfflineTenant);
    await prefs.setString(_prefKeyCurrentRole, UserRole.freeUser.name);
  }
}
