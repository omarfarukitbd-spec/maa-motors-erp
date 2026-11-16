enum UserRole {
  freeUser,
  shopAdmin,
  superAdmin,
  staff,
}

class Tenant {
  final String id;
  String shopName;
  String ownerName;
  String phone;
  String accessPassword;
  String licenseKey;
  String licenseStatus; // 'active' | 'suspended' | 'revoked'
  String? headerBannerUrl;
  final String aspectRatio; // '5:1'
  final int bannerWidth; // 1200
  final int bannerHeight; // 240
  bool canStaffPrintChallan;
  int challanCount;
  int staffCount;
  final DateTime createdAt;
  final String createdBy;

  Tenant({
    required this.id,
    required this.shopName,
    required this.ownerName,
    required this.phone,
    required this.accessPassword,
    required this.licenseKey,
    this.licenseStatus = 'active',
    this.headerBannerUrl,
    this.aspectRatio = '5:1',
    this.bannerWidth = 1200,
    this.bannerHeight = 240,
    this.canStaffPrintChallan = true,
    this.challanCount = 0,
    this.staffCount = 1,
    DateTime? createdAt,
    this.createdBy = 'omarfarukitbd@gmail.com',
  }) : createdAt = createdAt ?? DateTime.now();

  bool get isActive => licenseStatus == 'active';

  Map<String, dynamic> toJson() => {
        'id': id,
        'shopName': shopName,
        'ownerName': ownerName,
        'phone': phone,
        'accessPassword': accessPassword,
        'licenseKey': licenseKey,
        'licenseStatus': licenseStatus,
        'headerBannerUrl': headerBannerUrl,
        'aspectRatio': aspectRatio,
        'bannerWidth': bannerWidth,
        'bannerHeight': bannerHeight,
        'canStaffPrintChallan': canStaffPrintChallan,
        'challanCount': challanCount,
        'staffCount': staffCount,
        'createdAt': createdAt.toIso8601String(),
        'createdBy': createdBy,
      };

  factory Tenant.fromJson(Map<String, dynamic> json) => Tenant(
        id: json['id'] ?? '',
        shopName: json['shopName'] ?? '',
        ownerName: json['ownerName'] ?? '',
        phone: json['phone'] ?? '',
        accessPassword: json['accessPassword'] ?? '',
        licenseKey: json['licenseKey'] ?? '',
        licenseStatus: json['licenseStatus'] ?? 'active',
        headerBannerUrl: json['headerBannerUrl'],
        aspectRatio: json['aspectRatio'] ?? '5:1',
        bannerWidth: json['bannerWidth'] ?? 1200,
        bannerHeight: json['bannerHeight'] ?? 240,
        canStaffPrintChallan: json['canStaffPrintChallan'] ?? true,
        challanCount: json['challanCount'] ?? 0,
        staffCount: json['staffCount'] ?? 1,
        createdAt: json['createdAt'] != null
            ? DateTime.tryParse(json['createdAt'])
            : null,
        createdBy: json['createdBy'] ?? 'omarfarukitbd@gmail.com',
      );
}
