class CategoryClassifier {
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
    if (lower.contains('শক') || lower.contains('শকএব') || lower.contains('shock')) {
      return 'শকএবজর্ভার';
    }
    if (lower.contains('স্টিয়ারিং') || lower.contains('র‍্যাক') || lower.contains('steering')) {
      return 'স্টিয়ারিং বক্স';
    }
    if (lower.contains('নজেল') || lower.contains('পাম্প') || lower.contains('pump')) {
      return 'ফুয়েল পাম্প ও নজেল';
    }
    if (lower.contains('কম্প্রেসার') || lower.contains('কুলিং') || lower.contains('এসি')) {
      return 'এসি কম্প্রেসার';
    }

    return 'অন্যান্য স্পেয়ার পার্টস';
  }

  /// Get standard unit for root group
  static String getUnitForGroup(String rootGroup) {
    if (rootGroup == 'হাবস' || rootGroup == 'শকএবজর্ভার') {
      return 'পিস / সেট';
    }
    return 'পিস';
  }
}
