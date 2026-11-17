class BanglaTools {
  static const List<String> _bnDigits = [
    '০',
    '১',
    '২',
    '৩',
    '৪',
    '৫',
    '৬',
    '৭',
    '৮',
    '৯'
  ];

  /// Convert any English number or string with digits to Bengali numerals
  static String toBanglaDigits(dynamic input) {
    if (input == null) return '';
    final str = input.toString();
    return str.replaceAllMapped(RegExp(r'\d'), (match) {
      final digit = int.parse(match.group(0)!);
      return _bnDigits[digit];
    });
  }

  /// Format DateTime as DD/MM/YYYY in Bengali digits
  static String formatBanglaDate(DateTime dt) {
    final d = dt.day.toString().padLeft(2, '0');
    final m = dt.month.toString().padLeft(2, '0');
    final y = dt.year.toString();
    return toBanglaDigits('$d/$m/$y');
  }

  /// Format DateTime as HH:MM AM/PM in Bengali digits
  static String formatBanglaTime(DateTime dt) {
    final h = dt.hour > 12 ? dt.hour - 12 : (dt.hour == 0 ? 12 : dt.hour);
    final min = dt.minute.toString().padLeft(2, '0');
    final ampm = dt.hour >= 12 ? 'PM' : 'AM';
    return '${toBanglaDigits('$h:$min')} $ampm';
  }

  /// 6-character Verification Code algorithm matching Blueprint & Demo:
  /// Uses djb2 hash over challanNo + rev + items data
  static String generateVerificationCode(
      String challanNo, int rev, List<dynamic> items) {
    int hash = 5381;
    final itemStr = items.map((i) {
      final n = i is Map ? i['n'] : (i.name ?? '');
      final q = i is Map ? i['q'] : (i.quantity ?? 0);
      final u = i is Map ? i['u'] : (i.unit ?? 'পিস');
      return '$n$q$u';
    }).join('|');

    final str = '$challanNo$rev$itemStr';
    for (int i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash + str.codeUnitAt(i)) & 0xFFFFFFFF;
    }

    final code = hash.toRadixString(36).toUpperCase().padLeft(6, '0');
    return code.substring(code.length - 6);
  }
}
