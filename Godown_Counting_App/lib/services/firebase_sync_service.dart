import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/tenant_model.dart';
import '../models/challan_model.dart';
import '../firebase_options.dart';

/// Direct Firebase Cloud Sync Service for MAA MOTORS ERP.
/// Pushes godown challans and warehouse movement records directly into
/// Firestore collection: `godown_challans` in project `maa-motors-erp`.
class FirebaseSyncService {
  static final FirebaseSyncService _instance = FirebaseSyncService._internal();
  factory FirebaseSyncService() => _instance;
  FirebaseSyncService._internal();

  static const String _kCloudProjectName = DefaultFirebaseOptions.projectId;
  static const String _kApiKey = DefaultFirebaseOptions.apiKey;
  static const String _kLastSyncTimestampKey = 'godown_cloud_last_sync_timestamp';
  static const String _kPendingSyncQueueKey = 'godown_cloud_pending_sync_queue';

  bool _isOnline = false;
  DateTime? _lastSyncTime;
  int _pendingCount = 0;

  bool get isOnline => _isOnline;
  DateTime? get lastSyncTime => _lastSyncTime;
  int get pendingCount => _pendingCount;
  String get cloudProjectName => _kCloudProjectName;

  /// Initialize cloud service and check pending sync queue
  Future<void> init() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final lastSyncStr = prefs.getString(_kLastSyncTimestampKey);
      if (lastSyncStr != null) {
        _lastSyncTime = DateTime.tryParse(lastSyncStr);
      }
      final queue = prefs.getStringList(_kPendingSyncQueueKey) ?? [];
      _pendingCount = queue.length;

      // Attempt background flush
      if (queue.isNotEmpty) {
        syncPendingQueue();
      }
      _isOnline = true;
    } catch (_) {
      _isOnline = false;
    }
  }

  /// Compatibility method for tenant sync
  Future<bool> syncTenantToCloud(Tenant tenant) async {
    return true;
  }

  /// Convert standard Dart map to Firestore REST API fields format
  static Map<String, dynamic> _toFirestoreFields(Map<String, dynamic> data) {
    final Map<String, dynamic> fields = {};
    data.forEach((key, value) {
      final converted = _toFirestoreValue(value);
      if (converted != null) {
        fields[key] = converted;
      }
    });
    return {'fields': fields};
  }

  static dynamic _toFirestoreValue(dynamic value) {
    if (value == null) return {'nullValue': null};
    if (value is String) return {'stringValue': value};
    if (value is int) return {'integerValue': value.toString()};
    if (value is double) return {'doubleValue': value};
    if (value is bool) return {'booleanValue': value};
    if (value is DateTime) return {'timestampValue': value.toUtc().toIso8601String()};
    if (value is List) {
      final List<dynamic> listValues = [];
      for (var item in value) {
        final conv = _toFirestoreValue(item);
        if (conv != null) listValues.add(conv);
      }
      return {'arrayValue': {'values': listValues}};
    }
    if (value is Map<String, dynamic>) {
      final Map<String, dynamic> mapFields = {};
      value.forEach((k, v) {
        final conv = _toFirestoreValue(v);
        if (conv != null) mapFields[k] = conv;
      });
      return {'mapValue': {'fields': mapFields}};
    }
    return {'stringValue': value.toString()};
  }

  /// Sync Completed Challan to Maa Motors ERP Firestore
  Future<bool> backupChallanToCloud(ChallanDocument challan, {Tenant? tenant}) async {
    final rawJson = challan.toJson();
    rawJson['tenant_id'] = tenant?.id ?? 'MM-2026-01';
    rawJson['synced_at'] = DateTime.now().toIso8601String();
    rawJson['erp_project'] = _kCloudProjectName;

    final documentId = challan.id.replaceAll(RegExp(r'[^a-zA-Z0-9_-]'), '_');
    final url =
        'https://firestore.googleapis.com/v1/projects/$_kCloudProjectName/databases/(default)/documents/godown_challans/$documentId?key=$_kApiKey';

    try {
      final payload = jsonEncode(_toFirestoreFields(rawJson));
      final client = HttpClient()..connectionTimeout = const Duration(seconds: 8);
      final request = await client.patchUrl(Uri.parse(url));
      request.headers.contentType = ContentType.json;
      request.write(payload);

      final response = await request.close();
      final responseBody = await response.transform(utf8.decoder).join();
      client.close();

      if (response.statusCode >= 200 && response.statusCode < 300) {
        final prefs = await SharedPreferences.getInstance();
        _lastSyncTime = DateTime.now();
        await prefs.setString(_kLastSyncTimestampKey, _lastSyncTime!.toIso8601String());
        _isOnline = true;
        debugPrint('Maa Motors ERP Cloud Sync Success: $documentId');
        return true;
      } else {
        debugPrint('Firestore sync non-200 (${response.statusCode}): $responseBody');
        _queueForOfflineSync(documentId, payload);
        return false;
      }
    } catch (e) {
      debugPrint('Firestore sync offline fallback: $e');
      _queueForOfflineSync(documentId, jsonEncode(_toFirestoreFields(rawJson)));
      _isOnline = false;
      return false;
    }
  }

  Future<void> _queueForOfflineSync(String id, String payload) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final queue = prefs.getStringList(_kPendingSyncQueueKey) ?? [];
      final item = jsonEncode({'id': id, 'payload': payload});
      if (!queue.contains(item)) {
        queue.add(item);
        await prefs.setStringList(_kPendingSyncQueueKey, queue);
        _pendingCount = queue.length;
      }
    } catch (_) {}
  }

  /// Sync pending offline queue
  Future<int> syncPendingQueue() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final queue = prefs.getStringList(_kPendingSyncQueueKey) ?? [];
      if (queue.isEmpty) return 0;

      int successCount = 0;
      final remaining = <String>[];

      for (var entry in queue) {
        try {
          final decoded = jsonDecode(entry);
          final id = decoded['id'];
          final payload = decoded['payload'];

          final url =
              'https://firestore.googleapis.com/v1/projects/$_kCloudProjectName/databases/(default)/documents/godown_challans/$id?key=$_kApiKey';
          final client = HttpClient()..connectionTimeout = const Duration(seconds: 6);
          final request = await client.patchUrl(Uri.parse(url));
          request.headers.contentType = ContentType.json;
          request.write(payload);
          final response = await request.close();
          client.close();

          if (response.statusCode >= 200 && response.statusCode < 300) {
            successCount++;
          } else {
            remaining.add(entry);
          }
        } catch (_) {
          remaining.add(entry);
        }
      }

      await prefs.setStringList(_kPendingSyncQueueKey, remaining);
      _pendingCount = remaining.length;
      if (successCount > 0) {
        _lastSyncTime = DateTime.now();
        await prefs.setString(_kLastSyncTimestampKey, _lastSyncTime!.toIso8601String());
      }
      return successCount;
    } catch (_) {
      return 0;
    }
  }
}
