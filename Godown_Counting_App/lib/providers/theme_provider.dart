import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ThemeProvider with ChangeNotifier {
  static const String _kThemePrefKey = 'godown_theme_mode_v2';
  bool _isLightMode = false;

  bool get isLightMode => _isLightMode;
  ThemeMode get themeMode => _isLightMode ? ThemeMode.light : ThemeMode.dark;

  ThemeProvider() {
    _loadThemeFromPrefs();
  }

  Future<void> _loadThemeFromPrefs() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      _isLightMode = prefs.getBool(_kThemePrefKey) ?? false;
      notifyListeners();
    } catch (_) {}
  }

  Future<void> toggleTheme() async {
    _isLightMode = !_isLightMode;
    notifyListeners();
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool(_kThemePrefKey, _isLightMode);
    } catch (_) {}
  }

  Future<void> setLightMode(bool light) async {
    if (_isLightMode == light) return;
    _isLightMode = light;
    notifyListeners();
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool(_kThemePrefKey, _isLightMode);
    } catch (_) {}
  }
}
