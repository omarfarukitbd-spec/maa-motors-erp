enum UserRole {
  freeUser,
  shopAdmin,
  superAdmin,
  staff,
}

enum LicenseState {
  active, // সচল (সব ফিচার চালু)
  grace, // গ্রেস পিরিয়ড (মেয়াদের পর ৭ দিন, সতর্কবার্তা সহ সব ফিচার চালু)
  softLock, // সফট-লক (গণনা ও এক্সপোর্ট চলবে, প্রিন্ট ও শেয়ার বন্ধ)
  suspended, // স্থগিত (সার্ভার থেকে স্থগিত)
}

class Tenant {
  final String id;
  String shopName;
  String ownerName;
  String phone;
  String address;
  String tagline;
  int themeColorIndex;
  String activationCode; // 8-char code (e.g. MM-7K4X-92QD)
  String licenseKey;
  LicenseState licenseState;
  int deviceLimit;
  DateTime activatedAt;
  DateTime expiresAt;
  int graceDays;
  int statusVersion;
  String? signedToken;
  String? headerBannerUrl;
  final String aspectRatio; // '5:1'
  final int bannerWidth; // 1200
  final int bannerHeight; // 240
  bool canStaffPrintChallan;
  int challanCount;
  int staffCount;
  DateTime? lastOnlineSyncAt;
  bool isClockTampered;
  final DateTime createdAt;
  final String createdBy;

  Tenant({
    required this.id,
    required this.shopName,
    required this.ownerName,
    required this.phone,
    this.address = 'ধোলাইখাল, ঢাকা',
    this.tagline = 'জাপানি গাড়ি ও ট্রাকের জেনুইন পার্টস আমদানিকারক ও পাইকারি বিক্রেতা',
    this.themeColorIndex = 0,
    required this.activationCode,
    required this.licenseKey,
    this.licenseState = LicenseState.active,
    this.deviceLimit = 3,
    DateTime? activatedAt,
    DateTime? expiresAt,
    this.graceDays = 7,
    this.statusVersion = 1,
    this.signedToken,
    this.headerBannerUrl,
    this.aspectRatio = '5:1',
    this.bannerWidth = 1200,
    this.bannerHeight = 240,
    this.canStaffPrintChallan = true,
    this.challanCount = 0,
    this.staffCount = 1,
    this.lastOnlineSyncAt,
    this.isClockTampered = false,
    DateTime? createdAt,
    this.createdBy = 'office.maamotors@gmail.com',
  })  : activatedAt = activatedAt ?? DateTime.now(),
        expiresAt = expiresAt ?? DateTime.now().add(const Duration(days: 30)),
        createdAt = createdAt ?? DateTime.now();

  /// Check if the license is currently in soft-lock mode
  bool get isSoftLocked {
    if (isClockTampered) return true;
    if (licenseState == LicenseState.softLock ||
        licenseState == LicenseState.suspended) {
      return true;
    }
    final now = DateTime.now();
    final graceDeadline = expiresAt.add(Duration(days: graceDays));
    return now.isAfter(graceDeadline);
  }

  /// Check if full printing and sharing features are permitted
  bool get canPrintAndShare {
    if (isSoftLocked) return false;
    return licenseState == LicenseState.active ||
        licenseState == LicenseState.grace;
  }

  /// Check if license is currently inside the grace window
  bool get isInGracePeriod {
    if (isSoftLocked) return false;
    final now = DateTime.now();
    return now.isAfter(expiresAt) &&
        now.isBefore(expiresAt.add(Duration(days: graceDays)));
  }

  /// Days remaining until standard expiration (positive) or days in grace (negative)
  int get remainingDays {
    final now = DateTime.now();
    return expiresAt.difference(now).inDays;
  }

  /// Bengali status label for UI badges
  String get statusBadgeTextBn {
    if (isClockTampered) return 'সফট-লক (ঘড়ি অসঙ্গতি)';
    if (licenseState == LicenseState.suspended) return 'স্থগিত (Suspended)';
    if (isSoftLocked) return 'সফট-লক (মেয়াদ শেষ)';
    if (isInGracePeriod) {
      final daysLeft = expiresAt.add(Duration(days: graceDays)).difference(DateTime.now()).inDays;
      return 'গ্রেস পিরিয়ড ($daysLeft দিন বাকি)';
    }
    return 'সচল (Active)';
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'shopName': shopName,
        'ownerName': ownerName,
        'phone': phone,
        'address': address,
        'tagline': tagline,
        'themeColorIndex': themeColorIndex,
        'activationCode': activationCode,
        'licenseKey': licenseKey,
        'licenseState': licenseState.name,
        'deviceLimit': deviceLimit,
        'activatedAt': activatedAt.toIso8601String(),
        'expiresAt': expiresAt.toIso8601String(),
        'graceDays': graceDays,
        'statusVersion': statusVersion,
        'signedToken': signedToken,
        'headerBannerUrl': headerBannerUrl,
        'aspectRatio': aspectRatio,
        'bannerWidth': bannerWidth,
        'bannerHeight': bannerHeight,
        'canStaffPrintChallan': canStaffPrintChallan,
        'challanCount': challanCount,
        'staffCount': staffCount,
        'lastOnlineSyncAt': lastOnlineSyncAt?.toIso8601String(),
        'isClockTampered': isClockTampered,
        'createdAt': createdAt.toIso8601String(),
        'createdBy': createdBy,
      };

  factory Tenant.fromJson(Map<String, dynamic> json) => Tenant(
        id: json['id'] ?? '',
        shopName: json['shopName'] ?? '',
        ownerName: json['ownerName'] ?? '',
        phone: json['phone'] ?? '',
        address: json['address'] ?? 'ধোলাইখাল, ঢাকা',
        tagline: json['tagline'] ?? 'জাপানি গাড়ি ও ট্রাকের জেনুইন পার্টস আমদানিকারক ও পাইকারি বিক্রেতা',
        themeColorIndex: json['themeColorIndex'] ?? 0,
        activationCode: json['activationCode'] ?? '',
        licenseKey: json['licenseKey'] ?? '',
        licenseState: _parseLicenseState(json['licenseState']),
        deviceLimit: json['deviceLimit'] ?? 3,
        activatedAt: json['activatedAt'] != null
            ? DateTime.tryParse(json['activatedAt'])
            : null,
        expiresAt: json['expiresAt'] != null
            ? DateTime.tryParse(json['expiresAt'])
            : null,
        graceDays: json['graceDays'] ?? 7,
        statusVersion: json['statusVersion'] ?? 1,
        signedToken: json['signedToken'],
        headerBannerUrl: json['headerBannerUrl'],
        aspectRatio: json['aspectRatio'] ?? '5:1',
        bannerWidth: json['bannerWidth'] ?? 1200,
        bannerHeight: json['bannerHeight'] ?? 240,
        canStaffPrintChallan: json['canStaffPrintChallan'] ?? true,
        challanCount: json['challanCount'] ?? 0,
        staffCount: json['staffCount'] ?? 1,
        lastOnlineSyncAt: json['lastOnlineSyncAt'] != null
            ? DateTime.tryParse(json['lastOnlineSyncAt'])
            : null,
        isClockTampered: json['isClockTampered'] ?? false,
        createdAt: json['createdAt'] != null
            ? DateTime.tryParse(json['createdAt'])
            : null,
        createdBy: json['createdBy'] ?? 'office.maamotors@gmail.com',
      );

  static LicenseState _parseLicenseState(dynamic val) {
    if (val == null) return LicenseState.active;
    final str = val.toString().toLowerCase();
    if (str == 'grace') return LicenseState.grace;
    if (str == 'softlock' || str == 'soft_lock') return LicenseState.softLock;
    if (str == 'suspended') return LicenseState.suspended;
    return LicenseState.active;
  }
}
