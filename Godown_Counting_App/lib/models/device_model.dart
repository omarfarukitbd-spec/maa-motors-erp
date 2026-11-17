import 'tenant_model.dart';

class DeviceModel {
  final String deviceId;
  final String deviceName;
  final String devicePrefix; // e.g. 'A1' (Admin) or 'S1', 'S2' (Staff)
  final UserRole role;
  final String shopId;
  final DateTime pairedAt;
  bool isRevoked;
  bool canCount;
  bool canPrint;
  bool canViewHistory;

  DeviceModel({
    required this.deviceId,
    required this.deviceName,
    required this.devicePrefix,
    required this.role,
    required this.shopId,
    DateTime? pairedAt,
    this.isRevoked = false,
    this.canCount = true,
    this.canPrint = true,
    this.canViewHistory = true,
  }) : pairedAt = pairedAt ?? DateTime.now();

  Map<String, dynamic> toJson() => {
        'deviceId': deviceId,
        'deviceName': deviceName,
        'devicePrefix': devicePrefix,
        'role': role.name,
        'shopId': shopId,
        'pairedAt': pairedAt.toIso8601String(),
        'isRevoked': isRevoked,
        'canCount': canCount,
        'canPrint': canPrint,
        'canViewHistory': canViewHistory,
      };

  factory DeviceModel.fromJson(Map<String, dynamic> json) => DeviceModel(
        deviceId: json['deviceId'] ?? '',
        deviceName: json['deviceName'] ?? 'Unknown Device',
        devicePrefix: json['devicePrefix'] ?? 'D1',
        role: _parseRole(json['role']),
        shopId: json['shopId'] ?? '',
        pairedAt: json['pairedAt'] != null
            ? DateTime.tryParse(json['pairedAt'])
            : null,
        isRevoked: json['isRevoked'] ?? false,
        canCount: json['canCount'] ?? true,
        canPrint: json['canPrint'] ?? true,
        canViewHistory: json['canViewHistory'] ?? true,
      );

  static UserRole _parseRole(dynamic val) {
    if (val == null) return UserRole.staff;
    final str = val.toString().toLowerCase();
    if (str == 'shopadmin' || str == 'admin') return UserRole.shopAdmin;
    if (str == 'superadmin') return UserRole.superAdmin;
    if (str == 'freeuser') return UserRole.freeUser;
    return UserRole.staff;
  }
}

/// One-time 60-second QR pairing token generated on Admin's screen
class StaffPairingPayload {
  final String shopId;
  final String shopName;
  final String adminDeviceId;
  final String oneTimeToken;
  final DateTime expiresAt;
  final String signature;

  StaffPairingPayload({
    required this.shopId,
    required this.shopName,
    required this.adminDeviceId,
    required this.oneTimeToken,
    required this.expiresAt,
    required this.signature,
  });

  bool get isExpired => DateTime.now().isAfter(expiresAt);

  Map<String, dynamic> toJson() => {
        'shopId': shopId,
        'shopName': shopName,
        'adminDeviceId': adminDeviceId,
        'oneTimeToken': oneTimeToken,
        'expiresAt': expiresAt.toIso8601String(),
        'signature': signature,
      };

  factory StaffPairingPayload.fromJson(Map<String, dynamic> json) =>
      StaffPairingPayload(
        shopId: json['shopId'] ?? '',
        shopName: json['shopName'] ?? '',
        adminDeviceId: json['adminDeviceId'] ?? '',
        oneTimeToken: json['oneTimeToken'] ?? '',
        expiresAt: json['expiresAt'] != null
            ? DateTime.tryParse(json['expiresAt']) ?? DateTime.now()
            : DateTime.now(),
        signature: json['signature'] ?? '',
      );
}
