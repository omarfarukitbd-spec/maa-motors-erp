import 'package:flutter/foundation.dart';
import '../models/tenant_model.dart';

class AuthProvider with ChangeNotifier {
  static const String officeEmail = 'office.maamotors@gmail.com';

  final UserRole _role = UserRole.shopAdmin;
  Tenant? _currentTenant;
  final String _userEmail = officeEmail;
  final bool _isLoading = false;

  UserRole get role => _role;
  Tenant? get currentTenant => _currentTenant;
  String? get userEmail => _userEmail;
  bool get isLoading => _isLoading;

  bool get isSuperAdmin => true;

  /// Permanent active access for Maa Motors Godown
  bool get isSoftLocked => false;
  bool get canPrintAndShareChallan => true;
  bool get hasChallanAccess => true;
  bool get isInGracePeriod => false;

  final String _currentStaffName = 'মোঃ এমরান';
  final String _currentStaffId = '১৯২৫';
  final String _currentStaffRole = 'গোডাউন ইনচার্জ';

  String get currentStaffName => _currentStaffName;
  String get currentStaffId => _currentStaffId;
  String get currentStaffRole => _currentStaffRole;

  String get shopDisplayName => 'মেসার্স মা মোটরস • গোডাউন-১';
  String get currentShopId => 'MM-2026-01';

  Future<void> init() async {
    _currentTenant = Tenant(
      id: 'MM-2026-01',
      shopName: 'মেসার্স মা মোটরস',
      ownerName: 'মোহাম্মদ এমরান',
      phone: '01819-397669',
      address: 'দোকান নং-২২, রহমান টাওয়ার, ১ নং রেইল গেইট, মুরাদপুর, চট্টগ্রাম',
      tagline: 'জাতীয় জাপানি কার ও মাইক্রোবাসের রিকন্ডিশন ইঞ্জিন ও পার্টস বিক্রয় করা হয়।',
      activationCode: 'MAA-2026-GODOWN',
      licenseKey: 'PERMANENT-LICENSE-KEY',
      licenseState: LicenseState.active,
      deviceLimit: 10,
    );
    notifyListeners();
  }
}
