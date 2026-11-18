class ChallanItem {
  final String partId;
  final String partNameBn;
  final String rootGroup;
  int quantity;
  final String unit;
  String remarks;

  String get name => partNameBn;
  String get category => rootGroup;

  ChallanItem({
    this.partId = '',
    required this.partNameBn,
    required this.rootGroup,
    required this.quantity,
    this.unit = 'পিস',
    this.remarks = '',
  });

  Map<String, dynamic> toJson() => {
        'partId': partId,
        'partNameBn': partNameBn,
        'rootGroup': rootGroup,
        'quantity': quantity,
        'unit': unit,
        'remarks': remarks,
      };

  factory ChallanItem.fromJson(Map<String, dynamic> json) => ChallanItem(
        partId: json['partId'] ?? '',
        partNameBn: json['partNameBn'] ?? '',
        rootGroup: json['rootGroup'] ?? 'অন্যান্য',
        quantity: json['quantity'] ?? 0,
        unit: json['unit'] ?? 'পিস',
        remarks: json['remarks'] ?? '',
      );
}

class ChallanCategorySummary {
  final String rootGroup;
  final int totalQuantity;
  final String unit;
  final int distinctModelsCount;
  final String modelsBreakdown;

  const ChallanCategorySummary({
    required this.rootGroup,
    required this.totalQuantity,
    required this.unit,
    required this.distinctModelsCount,
    required this.modelsBreakdown,
  });

  Map<String, dynamic> toJson() => {
        'rootGroup': rootGroup,
        'totalQuantity': totalQuantity,
        'unit': unit,
        'distinctModelsCount': distinctModelsCount,
        'modelsBreakdown': modelsBreakdown,
      };

  factory ChallanCategorySummary.fromJson(Map<String, dynamic> json) =>
      ChallanCategorySummary(
        rootGroup: json['rootGroup'] ?? 'অন্যান্য',
        totalQuantity: json['totalQuantity'] ?? 0,
        unit: json['unit'] ?? 'পিস',
        distinctModelsCount: json['distinctModelsCount'] ?? 1,
        modelsBreakdown: json['modelsBreakdown'] ?? '',
      );
}

class ChallanDocument {
  final String id;
  final String challanNo;
  final String devicePrefix; // e.g. 'A1' (Admin) or 'S1' (Staff 1)
  final int deviceSerialNo;
  final String sessionType; // 'inward' (আনলোডিং), 'outward' (লোডিং)
  final String countedByUserId;
  final String countedByUserName;
  final String productOwner; // পণ্যের মালিক (উদা: মেসার্স মা মোটরস)
  final String destinationFor; // কার জন্য যাচ্ছে / গন্তব্য
  final String customerName; // যার মাল নিয়ে যাচ্ছে (পার্টি/গ্রাহক নাম)
  final String customerAddress; // গ্রাহক/পার্টির ঠিকানা
  final String customerPhone; // গ্রাহক/পার্টির মোবাইল নম্বর
  final String vehicleNo;
  final String driverName;
  final String driverMobile;
  final String sealNo; // কন্টেইনার / গাড়ির সিকিউরিটি সিল নম্বর
  final String gatePassNo;
  final String godownLocation;
  final DateTime date;
  final List<ChallanItem> items;
  final List<ChallanCategorySummary> categorySummaries;
  final int totalPcs;

  // Blueprint v2: Lock & Revision Management
  final bool isLocked;
  final int revisionNumber; // 0 = মূল চালান, 1+ = সংশোধিত চালান
  final String? revisionOfId; // মূল চালানের আইডি
  final String? revisionReason;
  final String verificationCode; // 8-char ইউনিক অ্যান্টি-ট্যাম্পার কোড

  ChallanDocument({
    required this.id,
    required this.challanNo,
    this.devicePrefix = 'D1',
    this.deviceSerialNo = 1,
    required this.sessionType,
    this.countedByUserId = 'USER-STAFF-01',
    this.countedByUserName = 'গোডাউন ইনচার্জ',
    this.productOwner = 'মেসার্স মা মোটরস',
    this.destinationFor = 'মুরাদপুর প্রধান শো-রুম',
    this.customerName = '',
    this.customerAddress = '',
    this.customerPhone = '',
    required this.vehicleNo,
    required this.driverName,
    this.driverMobile = '',
    this.sealNo = '',
    this.gatePassNo = 'GP-001',
    this.godownLocation = 'প্রধান গোডাউন',
    required this.date,
    required this.items,
    this.categorySummaries = const [],
    this.totalPcs = 0,
    this.isLocked = false,
    this.revisionNumber = 0,
    this.revisionOfId,
    this.revisionReason,
    String? verificationCode,
  }) : verificationCode =
            verificationCode ?? _generateVerificationCode(id, challanNo, totalPcs);

  /// Create a copy with modified lock or revision fields
  ChallanDocument copyWith({
    bool? isLocked,
    int? revisionNumber,
    String? revisionOfId,
    String? revisionReason,
    List<ChallanItem>? items,
    List<ChallanCategorySummary>? categorySummaries,
    int? totalPcs,
  }) {
    return ChallanDocument(
      id: id,
      challanNo: challanNo,
      devicePrefix: devicePrefix,
      deviceSerialNo: deviceSerialNo,
      sessionType: sessionType,
      countedByUserId: countedByUserId,
      countedByUserName: countedByUserName,
      productOwner: productOwner,
      destinationFor: destinationFor,
      customerName: customerName ?? this.customerName,
      customerAddress: customerAddress ?? this.customerAddress,
      customerPhone: customerPhone ?? this.customerPhone,
      vehicleNo: vehicleNo ?? this.vehicleNo,
      driverName: driverName ?? this.driverName,
      driverMobile: driverMobile ?? this.driverMobile,
      sealNo: sealNo ?? this.sealNo,
      gatePassNo: gatePassNo,
      godownLocation: godownLocation,
      date: date,
      items: items ?? this.items,
      categorySummaries: categorySummaries ?? this.categorySummaries,
      totalPcs: totalPcs ?? this.totalPcs,
      isLocked: isLocked ?? this.isLocked,
      revisionNumber: revisionNumber ?? this.revisionNumber,
      revisionOfId: revisionOfId ?? this.revisionOfId,
      revisionReason: revisionReason ?? this.revisionReason,
      verificationCode: verificationCode,
    );
  }

  /// Unique formatted display number (e.g. S1-00123 or MM-00123)
  String get displayChallanNo {
    if (challanNo.isNotEmpty) return challanNo;
    final paddedSerial = deviceSerialNo.toString().padLeft(5, '0');
    return '$devicePrefix-$paddedSerial';
  }

  /// Whether this challan is a revision of an older one
  bool get isRevision => revisionNumber > 0;

  static String _generateVerificationCode(String id, String no, int pcs) {
    final raw = '$id:$no:$pcs'.hashCode.abs().toRadixString(16).toUpperCase();
    return raw.padLeft(8, '0').substring(0, 8);
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'challanNo': challanNo,
        'devicePrefix': devicePrefix,
        'deviceSerialNo': deviceSerialNo,
        'sessionType': sessionType,
        'countedByUserId': countedByUserId,
        'countedByUserName': countedByUserName,
        'productOwner': productOwner,
        'destinationFor': destinationFor,
        'customerName': customerName,
        'customerAddress': customerAddress,
        'customerPhone': customerPhone,
        'vehicleNo': vehicleNo,
        'driverName': driverName,
        'driverMobile': driverMobile,
        'sealNo': sealNo,
        'gatePassNo': gatePassNo,
        'godownLocation': godownLocation,
        'date': date.toIso8601String(),
        'items': items.map((e) => e.toJson()).toList(),
        'categorySummaries': categorySummaries.map((e) => e.toJson()).toList(),
        'totalPcs': totalPcs,
        'isLocked': isLocked,
        'revisionNumber': revisionNumber,
        'revisionOfId': revisionOfId,
        'revisionReason': revisionReason,
        'verificationCode': verificationCode,
      };

  factory ChallanDocument.fromJson(Map<String, dynamic> json) =>
      ChallanDocument(
        id: json['id'] ?? '',
        challanNo: json['challanNo'] ?? '',
        devicePrefix: json['devicePrefix'] ?? 'D1',
        deviceSerialNo: json['deviceSerialNo'] ?? 1,
        sessionType: json['sessionType'] ?? 'inward',
        countedByUserId: json['countedByUserId'] ?? 'USER-STAFF-01',
        countedByUserName: json['countedByUserName'] ?? 'গোডাউন ইনচার্জ',
        productOwner: json['productOwner'] ?? 'মেসার্স মা মোটরস',
        destinationFor: json['destinationFor'] ?? 'মুরাদপুর প্রধান শো-রুম',
        customerName: json['customerName'] ?? json['productOwner'] ?? '',
        customerAddress: json['customerAddress'] ?? json['destinationFor'] ?? '',
        customerPhone: json['customerPhone'] ?? '',
        vehicleNo: json['vehicleNo'] ?? '',
        driverName: json['driverName'] ?? '',
        driverMobile: json['driverMobile'] ?? '',
        sealNo: json['sealNo'] ?? '',
        gatePassNo: json['gatePassNo'] ?? '',
        godownLocation: json['godownLocation'] ?? '',
        date: json['date'] != null
            ? DateTime.tryParse(json['date']) ?? DateTime.now()
            : DateTime.now(),
        items: (json['items'] as List<dynamic>?)
                ?.map((e) => ChallanItem.fromJson(e as Map<String, dynamic>))
                .toList() ??
            [],
        categorySummaries: (json['categorySummaries'] as List<dynamic>?)
                ?.map((e) => ChallanCategorySummary.fromJson(
                    e as Map<String, dynamic>))
                .toList() ??
            [],
        totalPcs: json['totalPcs'] ?? 0,
        isLocked: json['isLocked'] ?? false,
        revisionNumber: json['revisionNumber'] ?? 0,
        revisionOfId: json['revisionOfId'],
        revisionReason: json['revisionReason'],
        verificationCode: json['verificationCode'],
      );
}
