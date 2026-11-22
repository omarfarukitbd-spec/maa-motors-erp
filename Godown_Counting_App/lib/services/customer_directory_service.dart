import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class CustomerEntry {
  final String name;
  final String phone;
  final String address;
  final String vehicleNo;
  final String driverName;
  final String driverMobile;

  const CustomerEntry({
    required this.name,
    this.phone = '',
    this.address = '',
    this.vehicleNo = '',
    this.driverName = '',
    this.driverMobile = '',
  });

  Map<String, dynamic> toJson() => {
        'name': name,
        'phone': phone,
        'address': address,
        'vehicleNo': vehicleNo,
        'driverName': driverName,
        'driverMobile': driverMobile,
      };

  factory CustomerEntry.fromJson(Map<String, dynamic> json) => CustomerEntry(
        name: json['name'] ?? '',
        phone: json['phone'] ?? '',
        address: json['address'] ?? '',
        vehicleNo: json['vehicleNo'] ?? '',
        driverName: json['driverName'] ?? '',
        driverMobile: json['driverMobile'] ?? '',
      );
}

class CustomerDirectoryService {
  static final CustomerDirectoryService _instance =
      CustomerDirectoryService._internal();
  factory CustomerDirectoryService() => _instance;
  CustomerDirectoryService._internal();

  static const String _kCachedCustomersKey = 'maa_motors_cached_customers_v1';

  // Master verified customer directory for Maa Motors ERP
  static const List<CustomerEntry> defaultMaaCustomers = [
    CustomerEntry(
      name: 'মা মোটরস প্রধান শো-রুম',
      phone: '01819-397669',
      address: 'মুরাদপুর, চট্টগ্রাম',
      vehicleNo: 'চট্ট-মেট্রো ড-১১-৪৮২১',
      driverName: 'মোঃ বিজয়',
      driverMobile: '01602-830489',
    ),
    CustomerEntry(
      name: 'আলম ব্রাদার্স অটো পার্টস',
      phone: '01711-223344',
      address: 'ধোলাইখাল, ঢাকা',
      vehicleNo: 'ঢাকা মেট্রো-ট-১২-৩৪৫৬',
      driverName: 'কালাম ড্রাইভার',
      driverMobile: '01818-132576',
    ),
    CustomerEntry(
      name: 'রহিম মোটরস ও ওয়ার্কশপ',
      phone: '01819-554433',
      address: 'কদমতলী, চট্টগ্রাম',
      vehicleNo: 'চট্ট-মেট্রো ন-১৪-৯৮৭২',
      driverName: 'নুরু ড্রাইভার',
      driverMobile: '01812-508139',
    ),
    CustomerEntry(
      name: 'জননী এন্টারপ্রাইজ',
      phone: '01712-998877',
      address: 'বগুড়া চারমাথা',
      vehicleNo: 'ঢাকা মেট্রো-উ-১১-০৯৮৪',
      driverName: 'সঞ্জীব (ন্যাশনাল ট্রাক)',
      driverMobile: '01711-722726',
    ),
    CustomerEntry(
      name: 'বিসমিল্লাহ মোটরস',
      phone: '01911-332211',
      address: 'হাটহাজারী রোড, চট্টগ্রাম',
      vehicleNo: 'চট্ট-মেট্রো ড-১২-৫৬৭৮',
      driverName: 'সাদ্দাম',
      driverMobile: '01647-117566',
    ),
    CustomerEntry(
      name: 'নাজিরহাট ট্রেডার্স',
      phone: '01815-776655',
      address: 'নাজিরহাট বাজার',
      vehicleNo: 'চট্ট-মেট্রো ছ-১১-২৩৪৫',
      driverName: 'শহিদ ট্রান্সপোর্ট',
      driverMobile: '01830-106329',
    ),
  ];

  List<CustomerEntry> _customers = [];
  bool _isLoaded = false;

  Future<void> init() async {
    if (_isLoaded) return;
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString(_kCachedCustomersKey);
      if (raw != null && raw.isNotEmpty) {
        final List decoded = jsonDecode(raw);
        _customers = decoded.map((e) => CustomerEntry.fromJson(e)).toList();
      } else {
        _customers = List.from(defaultMaaCustomers);
        await saveCustomers();
      }
    } catch (_) {
      _customers = List.from(defaultMaaCustomers);
    }
    _isLoaded = true;
  }

  Future<void> saveCustomers() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = jsonEncode(_customers.map((c) => c.toJson()).toList());
      await prefs.setString(_kCachedCustomersKey, raw);
    } catch (e) {
      debugPrint('CustomerDirectoryService save error: $e');
    }
  }

  Future<List<CustomerEntry>> getAllCustomers() async {
    await init();
    return List.unmodifiable(_customers);
  }

  List<CustomerEntry> search(String query) {
    if (query.trim().isEmpty) return _customers;
    final q = query.trim().toLowerCase();
    return _customers.where((c) {
      return c.name.toLowerCase().contains(q) ||
          c.phone.contains(q) ||
          c.address.toLowerCase().contains(q) ||
          c.vehicleNo.toLowerCase().contains(q);
    }).toList();
  }

  Future<void> addCustomer(CustomerEntry customer) async {
    final idx = _customers.indexWhere((c) => c.name.trim().toLowerCase() == customer.name.trim().toLowerCase());
    if (idx != -1) {
      _customers[idx] = customer;
    } else {
      _customers.insert(0, customer);
    }
    await saveCustomers();
  }
}
