class ChallanItem {
  final String partId;
  final String partNameBn;
  final String rootGroup;
  int quantity;
  final String unit;
  String remarks;

  ChallanItem({
    required this.partId,
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
}

class ChallanDocument {
  final String id;
  final String challanNo;
  final String sessionType; // 'inward' (আনলোডিং), 'outward' (লোডিং)
  final String countedByUserId;
  final String countedByUserName;
  final String productOwner; // পণ্যের মালিক কে (যেমন: মা মোটরস / দুবাই কনসোলমেন্ট)
  final String destinationFor; // কার জন্য যাচ্ছে / গন্তব্য (যেমন: দোকান শোরুম / কাস্টমার নাম)
  final String vehicleNo;
  final String driverName;
  final String gatePassNo;
  final String godownLocation;
  final DateTime date;
  final List<ChallanItem> items;
  final List<ChallanCategorySummary> categorySummaries;
  final int totalPcs;

  ChallanDocument({
    required this.id,
    required this.challanNo,
    required this.sessionType,
    required this.countedByUserId,
    required this.countedByUserName,
    required this.productOwner,
    required this.destinationFor,
    required this.vehicleNo,
    required this.driverName,
    required this.gatePassNo,
    required this.godownLocation,
    required this.date,
    required this.items,
    required this.categorySummaries,
    required this.totalPcs,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'challanNo': challanNo,
        'sessionType': sessionType,
        'countedByUserId': countedByUserId,
        'countedByUserName': countedByUserName,
        'productOwner': productOwner,
        'destinationFor': destinationFor,
        'vehicleNo': vehicleNo,
        'driverName': driverName,
        'gatePassNo': gatePassNo,
        'godownLocation': godownLocation,
        'date': date.toIso8601String(),
        'items': items.map((e) => e.toJson()).toList(),
        'categorySummaries': categorySummaries.map((e) => e.toJson()).toList(),
        'totalPcs': totalPcs,
      };
}
