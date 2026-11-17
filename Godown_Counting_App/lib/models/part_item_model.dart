class PartItem {
  final String id;
  final String nameBn;
  final String? nameEn;
  final List<String> aliasesBn;
  final String category;
  final String rootGroup;
  final String defaultUnit;
  final String locationShop;
  final List<String> popularModels;

  const PartItem({
    required this.id,
    required this.nameBn,
    this.nameEn,
    this.aliasesBn = const [],
    required this.category,
    required this.rootGroup,
    this.defaultUnit = 'পিস',
    this.locationShop = 'গোডাউন-১',
    this.popularModels = const [],
  });

  factory PartItem.fromJson(Map<String, dynamic> json, {String? detectedRoot}) {
    return PartItem(
      id: json['id'] as String? ?? 'PART-000',
      nameBn: json['nameBn'] as String? ?? '',
      nameEn: json['nameEn'] as String?,
      aliasesBn: (json['aliasesBn'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          const [],
      category: json['category'] as String? ?? 'জেনারেল পার্টস',
      rootGroup: detectedRoot ?? json['rootGroup'] as String? ?? 'অন্যান্য পার্টস',
      defaultUnit: json['defaultUnit'] as String? ?? 'পিস',
      locationShop: json['locationShop'] as String? ?? 'গোডাউন-১',
      popularModels: (json['popularModels'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          const [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'nameBn': nameBn,
      'nameEn': nameEn,
      'aliasesBn': aliasesBn,
      'category': category,
      'rootGroup': rootGroup,
      'defaultUnit': defaultUnit,
      'locationShop': locationShop,
      'popularModels': popularModels,
    };
  }
}
