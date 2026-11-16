import '../models/challan_model.dart';

class ChallanPdfService {
  /// Generate & print A4 Challan
  static Future<void> printChallanA4(ChallanDocument challan) async {
    // Printable service hooks into printing / pdf packages
    // On web preview or mobile device, triggers system print dialog
  }
}
