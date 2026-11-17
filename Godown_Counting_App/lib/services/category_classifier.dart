class ClassifiedPart {
  final String name;
  final String rootGroup;
  final String defaultUnit;

  const ClassifiedPart({
    required this.name,
    required this.rootGroup,
    required this.defaultUnit,
  });
}

class CategoryClassifier {
  static const List<ClassifiedPart> defaultParts = [
    ClassifiedPart(name: 'হাবস', rootGroup: 'হাবস', defaultUnit: 'পিস'),
    ClassifiedPart(name: 'Axio হাবস', rootGroup: 'হাবস', defaultUnit: 'পিস'),
    ClassifiedPart(name: 'Fielder হাবস', rootGroup: 'হাবস', defaultUnit: 'পিস'),
    ClassifiedPart(name: 'কার্টিজ', rootGroup: 'কার্টিজ', defaultUnit: 'পিস'),
    ClassifiedPart(name: 'Premio কার্টিজ', rootGroup: 'কার্টিজ', defaultUnit: 'পিস'),
    ClassifiedPart(name: 'ইঞ্জিন', rootGroup: 'ইঞ্জিন', defaultUnit: 'সেট'),
    ClassifiedPart(name: 'গিয়ারবক্স', rootGroup: 'গিয়ার বক্স', defaultUnit: 'সেট'),
    ClassifiedPart(name: 'সাসপেনশন আর্ম', rootGroup: 'সাসপেনশন', defaultUnit: 'পিস'),
    ClassifiedPart(name: 'শক অ্যাবজর্বার', rootGroup: 'শকএবজর্ভার', defaultUnit: 'পিস'),
    ClassifiedPart(name: 'ব্রেক ডিস্ক', rootGroup: 'ডিস্ক ও ব্রেক', defaultUnit: 'পিস'),
    ClassifiedPart(name: 'ব্রেক প্যাড', rootGroup: 'ডিস্ক ও ব্রেক', defaultUnit: 'সেট'),
    ClassifiedPart(name: 'বল জয়েন্ট', rootGroup: 'সাসপেনশন', defaultUnit: 'পিস'),
  ];

  /// Classify any item into rootGroup and unit
  static ClassifiedPart classify(String nameBn) {
    final root = detectRootGroup(nameBn);
    final unit = getUnitForGroup(root);
    return ClassifiedPart(name: nameBn, rootGroup: root, defaultUnit: unit);
  }

  /// Detect root product group from Bengali trade name
  static String detectRootGroup(String nameBn) {
    final lower = nameBn.toLowerCase().trim();

    if (lower.contains('হাব') || lower.contains('হাবস') || lower.contains('hub')) {
      return 'হাবস';
    }
    if (lower.contains('কার্টিজ') || lower.contains('কার্টিস') || lower.contains('cartridge')) {
      return 'কার্টিজ';
    }
    if (lower.contains('ইঞ্জিন') || lower.contains('engine') || lower.contains('cvt')) {
      return 'ইঞ্জিন';
    }
    if (lower.contains('গিয়ার') || lower.contains('গিয়ার') || lower.contains('gear')) {
      return 'গিয়ার বক্স';
    }
    if (lower.contains('ডিস্ক') || lower.contains('ব্রেক') || lower.contains('ক্যালিবার')) {
      return 'ডিস্ক ও ব্রেক';
    }
    if (lower.contains('শক') || lower.contains('শকএব') || lower.contains('shock') || lower.contains('স্প্রিং')) {
      return 'শকএবজর্ভার';
    }
    if (lower.contains('সাসপেনশন') || lower.contains('আর্ম') || lower.contains('বল জয়েন্ট') || lower.contains('লিংক')) {
      return 'সাসপেনশন';
    }
    if (lower.contains('স্টিয়ারিং') || lower.contains('র‍্যাক') || lower.contains('steering')) {
      return 'স্টিয়ারিং বক্স';
    }
    if (lower.contains('নজেল') || lower.contains('পাম্প') || lower.contains('pump') || lower.contains('ফিল্টার')) {
      return 'ফুয়েল পাম্প ও নজেল';
    }
    if (lower.contains('কম্প্রেসার') || lower.contains('কুলিং') || lower.contains('এসি') || lower.contains('কনডেন্সার')) {
      return 'এসি কম্প্রেসার';
    }
    if (lower.contains('রেডিয়েটর') || lower.contains('ফ্যান') || lower.contains('হোসপিপ')) {
      return 'কুলিং ও রেডিয়েটর';
    }

    return 'অন্যান্য স্পেয়ার পার্টস';
  }

  /// Get standard unit for root group
  static String getUnitForGroup(String rootGroup) {
    if (rootGroup == 'ইঞ্জিন' || rootGroup == 'গিয়ার বক্স' || rootGroup == 'ব্রেক প্যাড') {
      return 'সেট';
    }
    if (rootGroup == 'হাবস' || rootGroup == 'শকএবজর্ভার') {
      return 'পিস';
    }
    return 'পিস';
  }
}
