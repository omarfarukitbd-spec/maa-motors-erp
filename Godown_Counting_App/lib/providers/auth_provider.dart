import 'package:flutter/foundation.dart';
import '../models/tenant_model.dart';
import '../services/auth_licensing_service.dart';

class AuthProvider with ChangeNotifier {
  final AuthLicensingService _service = AuthLicensingService();

  UserRole _role = UserRole.shopAdmin;
  Tenant? _currentTenant;
  String? _userEmail;
  List<Tenant> _allTenants = [];
  List<Map<String, dynamic>> _auditLogs = [];
  bool _isLoading = false;

  UserRole get role => _role;
  Tenant? get currentTenant => _currentTenant;
  String? get userEmail => _userEmail;
  List<Tenant> get allTenants => _allTenants;
  List<Map<String, dynamic>> get auditLogs => _auditLogs;
  bool get isLoading => _isLoading;

  bool get isSuperAdmin =>
      _role == UserRole.superAdmin ||
      AuthLicensingService.isSuperAdmin(_userEmail);

  /// Check if the user is currently soft-locked
  bool get isSoftLocked => _currentTenant?.isSoftLocked ?? false;

  /// Check if printing or sharing challans is permitted
  bool get canPrintAndShareChallan {
    if (_role == UserRole.superAdmin) return true;
    if (_currentTenant == null) return false;
    return _currentTenant!.canPrintAndShare;
  }

  /// Check if inside grace period
  bool get isInGracePeriod => _currentTenant?.isInGracePeriod ?? false;

  String get shopDisplayName =>
      _currentTenant?.shopName ?? 'সহজ গোডাউন কাউন্টার';

  String get currentShopId => _currentTenant?.id ?? 'GUEST-001';

  Future<void> init() async {
    _isLoading = true;
    notifyListeners();

    try {
      _allTenants = await _service.getAllTenants();
      final cachedTenant = await _service.loadCachedOfflineLicense();

      if (cachedTenant != null) {
        _currentTenant = cachedTenant;
        _role = UserRole.shopAdmin;
      } else {
        if (_allTenants.isNotEmpty) {
          _currentTenant = _allTenants.first;
          _role = UserRole.shopAdmin;
        } else {
          _role = UserRole.freeUser;
        }
      }
      _auditLogs = await _service.getAuditLogs();
    } catch (_) {
      _role = UserRole.freeUser;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Switch Role (for simulation and testing)
  void switchRole(UserRole newRole) {
    _role = newRole;
    if (newRole == UserRole.superAdmin) {
      _userEmail = AuthLicensingService.superAdminEmail;
    } else if (newRole == UserRole.freeUser) {
      _userEmail = null;
    }
    notifyListeners();
  }

  // Shop Admin Login with 8-char Activation Code
  Future<bool> activateShop(String shopId, String activationCode) async {
    _isLoading = true;
    notifyListeners();

    try {
      final tenant = await _service.activateWithCode(shopId, activationCode);
      if (tenant != null) {
        _currentTenant = tenant;
        _role = UserRole.shopAdmin;
        _isLoading = false;
        notifyListeners();
        return true;
      }
      _isLoading = false;
      notifyListeners();
      return false;
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      rethrow;
    }
  }

  // Super Admin Login with Gmail
  void loginAsSuperAdmin(String email) {
    if (AuthLicensingService.isSuperAdmin(email)) {
      _role = UserRole.superAdmin;
      _userEmail = email.trim();
      notifyListeners();
    }
  }

  // Super Admin Action: Create New Shop
  Future<Tenant> createNewShop({
    required String shopName,
    required String ownerName,
    required String phone,
    int deviceLimit = 3,
  }) async {
    final newShop = await _service.createTenant(
      shopName: shopName,
      ownerName: ownerName,
      phone: phone,
      deviceLimit: deviceLimit,
    );
    _allTenants = await _service.getAllTenants();
    _auditLogs = await _service.getAuditLogs();
    notifyListeners();
    return newShop;
  }

  // Super Admin Action: Regenerate Activation Code
  Future<String> regenerateShopCode(String shopId) async {
    final code = await _service.regenerateActivationCode(shopId);
    _allTenants = await _service.getAllTenants();
    _auditLogs = await _service.getAuditLogs();
    notifyListeners();
    return code;
  }

  // Super Admin Action: Update Device Limit
  Future<void> updateTenantDeviceLimit(String shopId, int limit) async {
    await _service.updateDeviceLimit(shopId, limit);
    _allTenants = await _service.getAllTenants();
    if (_currentTenant?.id == shopId) {
      _currentTenant = _allTenants.firstWhere((t) => t.id == shopId);
    }
    _auditLogs = await _service.getAuditLogs();
    notifyListeners();
  }

  // Super Admin Action: Set License State (Active, Grace, Soft-Lock, Suspended)
  Future<void> setTenantLicenseState(String shopId, LicenseState state) async {
    await _service.setTenantLicenseState(shopId, state);
    _allTenants = await _service.getAllTenants();
    if (_currentTenant?.id == shopId) {
      _currentTenant = _allTenants.firstWhere((t) => t.id == shopId);
    }
    _auditLogs = await _service.getAuditLogs();
    notifyListeners();
  }

  // Super Admin Action: Toggle Suspend
  Future<void> toggleSuspendShop(String shopId) async {
    await _service.toggleTenantSuspend(shopId);
    _allTenants = await _service.getAllTenants();

    if (_currentTenant?.id == shopId) {
      final updated = _allTenants.firstWhere((t) => t.id == shopId);
      _currentTenant = updated;
    }
    _auditLogs = await _service.getAuditLogs();
    notifyListeners();
  }

  // Super Admin Action: Delete Shop
  Future<void> deleteShop(String shopId) async {
    await _service.deleteTenant(shopId);
    _allTenants = await _service.getAllTenants();

    if (_currentTenant?.id == shopId) {
      _currentTenant = null;
      _role = UserRole.freeUser;
    }
    _auditLogs = await _service.getAuditLogs();
    notifyListeners();
  }

  // Shop Admin: Update Shop Name
  void updateShopName(String newName) {
    if (_currentTenant != null && newName.trim().isNotEmpty) {
      _currentTenant!.shopName = newName.trim();
      _service.saveOfflineLicense(_currentTenant!);
      notifyListeners();
    }
  }

  // Shop Admin: Toggle Staff Challan Access
  void toggleStaffChallanPermission(bool allow) {
    if (_currentTenant != null) {
      _currentTenant!.canStaffPrintChallan = allow;
      _service.saveOfflineLicense(_currentTenant!);
      notifyListeners();
    }
  }

  // Logout / Reset to Free User
  Future<void> logout() async {
    await _service.clearOfflineLicense();
    _currentTenant = null;
    _role = UserRole.freeUser;
    _userEmail = null;
    notifyListeners();
  }
}
