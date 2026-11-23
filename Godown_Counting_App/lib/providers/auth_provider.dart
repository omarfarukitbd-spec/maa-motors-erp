import 'package:flutter/foundation.dart';
import '../models/tenant_model.dart';

class AuthStaffMember {
  final String name;
  final String id;
  final String role;
  final String pin;

  const AuthStaffMember({
    required this.name,
    required this.id,
    required this.role,
    required this.pin,
  });
}

class AuthProvider with ChangeNotifier {
  static const List<AuthStaffMember> godownStaffList = [
    AuthStaffMember(
      name: 'মোঃ এমরান',
      id: '১৯২৫',
      role: 'গোডাউন ইনচার্জ',
      pin: '1925',
    ),
    AuthStaffMember(
      name: 'আলতাফ হোসেন',
      id: '১২৩৪',
      role: 'কাউন্টার কর্মী',
      pin: '1234',
    ),
    AuthStaffMember(
      name: 'মোঃ ওমর ফারুক',
      id: '৭৮৬০',
      role: 'প্রোপ্রাইটর ও অ্যাডমিন',
      pin: '7860',
    ),
  ];

  static const String superAdminEmail = 'omarfarukitbd@gmail.com';

  UserRole _role = UserRole.shopAdmin;
  Tenant? _currentTenant;
  String? _userEmail;
  final bool _isLoading = false;

  UserRole get role => _role;
  Tenant? get currentTenant => _currentTenant;
  String? get userEmail => _userEmail;
  bool get isLoading => _isLoading;

  bool get isSuperAdmin =>
      _role == UserRole.superAdmin ||
      _userEmail == superAdminEmail ||
      _currentStaffId == '৭৮৬০';

  /// Permanent active access for Maa Motors Godown
  bool get isSoftLocked => false;
  bool get canPrintAndShareChallan => true;
  bool get hasChallanAccess => true;
  bool get isInGracePeriod => false;

  String _currentStaffName = 'মোঃ এমরান';
  String _currentStaffId = '১৯২৫';
  String _currentStaffRole = 'গোডাউন ইনচার্জ';

  String get currentStaffName => _currentStaffName;
  String get currentStaffId => _currentStaffId;
  String get currentStaffRole => _currentStaffRole;

  String get shopDisplayName => 'মেসার্স মা মোটরস • গোডাউন-১';
  String get currentShopId => 'MM-2026-01';

  bool loginWithStaffPin(String pin) {
    final cleanPin = pin.trim();
    for (var staff in godownStaffList) {
      if (staff.pin == cleanPin) {
        _currentStaffName = staff.name;
        _currentStaffId = staff.id;
        _currentStaffRole = staff.role;
        if (cleanPin == '7860') {
          _role = UserRole.superAdmin;
          _userEmail = superAdminEmail;
        } else {
          _role = UserRole.shopAdmin;
        }
        notifyListeners();
        return true;
      }
    }
    return false;
  }

  void switchStaff(AuthStaffMember staff) {
    _currentStaffName = staff.name;
    _currentStaffId = staff.id;
    _currentStaffRole = staff.role;
    if (staff.pin == '7860') {
      _role = UserRole.superAdmin;
      _userEmail = superAdminEmail;
    } else {
      _role = UserRole.shopAdmin;
    }
    notifyListeners();
  }

  void switchRole(UserRole newRole) {
    _role = newRole;
    if (newRole == UserRole.superAdmin) {
      _userEmail = superAdminEmail;
    }
    notifyListeners();
  }

  Future<void> init() async {
    _currentTenant = Tenant(
      id: 'MM-2026-01',
      shopName: 'মেসার্স মা মোটরস',
      ownerName: 'মোঃ ওমর ফারুক',
      phone: '01819-397669',
      address: 'গোডাউন-১, রেলগেট সংলগ্ন, মুরাদপুর, চট্টগ্রাম',
      tagline: 'জাপানি রিকন্ডিশন্ড অটো পার্টস আমদানিকারক ও পাইকারি বিক্রেতা',
      activationCode: 'MAA-2026-GODOWN',
      licenseKey: 'PERMANENT-LICENSE-KEY',
      licenseState: LicenseState.active,
      deviceLimit: 10,
    );
    notifyListeners();
  }
}
