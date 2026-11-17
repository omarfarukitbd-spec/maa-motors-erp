import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/services.dart';

enum VoiceLanguage {
  english,
  bangla,
}

class AudioEngineService {
  static final AudioEngineService _instance = AudioEngineService._internal();
  factory AudioEngineService() => _instance;
  AudioEngineService._internal();

  AudioPlayer? _player;
  bool _isSoundEnabled = true;
  bool _isInitialized = false;
  VoiceLanguage _currentLanguage = VoiceLanguage.english;

  bool get isSoundEnabled => _isSoundEnabled;
  VoiceLanguage get currentLanguage => _currentLanguage;

  void setSoundEnabled(bool enabled) {
    _isSoundEnabled = enabled;
  }

  void toggleSound() {
    _isSoundEnabled = !_isSoundEnabled;
  }

  void setLanguage(VoiceLanguage lang) {
    _currentLanguage = lang;
  }

  void _ensureInitialized() {
    if (!_isInitialized) {
      _player = AudioPlayer();
      _player?.setPlayerMode(PlayerMode.lowLatency);
      _isInitialized = true;
    }
  }

  /// Triggers haptic tactile vibration on screen tap
  void triggerHaptic() {
    HapticFeedback.lightImpact();
  }

  /// Plays natural studio voice for a given count number (1..1000)
  Future<void> playCountVoice(int number) async {
    triggerHaptic();

    if (!_isSoundEnabled) return;

    try {
      _ensureInitialized();
      // Stop any overlapping sound to ensure snappy 0ms response
      await _player?.stop();

      // Check bundled asset range (1..1000)
      if (number >= 1 && number <= 1000) {
        final langFolder = _currentLanguage == VoiceLanguage.english ? 'audio/en' : 'audio/bn';
        await _player?.play(AssetSource('$langFolder/$number.mp3'));
      } else {
        // Subtle system click sound fallback for counts beyond 1000
        SystemSound.play(SystemSoundType.click);
      }
    } catch (_) {
      // Fallback silently to system sound if asset load fails
      try {
        SystemSound.play(SystemSoundType.click);
      } catch (_) {}
    }
  }

  /// Play undo feedback
  Future<void> playUndoSound() async {
    triggerHaptic();
    if (!_isSoundEnabled) return;
    try {
      _ensureInitialized();
      await _player?.stop();
      await _player?.play(AssetSource('audio/undo.mp3'));
    } catch (_) {
      SystemSound.play(SystemSoundType.click);
    }
  }

  /// Play redo feedback
  Future<void> playRedoSound() async {
    triggerHaptic();
    if (!_isSoundEnabled) return;
    try {
      _ensureInitialized();
      await _player?.stop();
      await _player?.play(AssetSource('audio/redo.mp3'));
    } catch (_) {
      SystemSound.play(SystemSoundType.click);
    }
  }

  /// Play completion chime
  Future<void> playCompleteSound() async {
    HapticFeedback.heavyImpact();
    if (!_isSoundEnabled) return;
    try {
      _ensureInitialized();
      await _player?.stop();
      await _player?.play(AssetSource('audio/complete.wav'));
    } catch (_) {
      try {
        SystemSound.play(SystemSoundType.click);
      } catch (_) {}
    }
  }

  void dispose() {
    _player?.dispose();
    _player = null;
    _isInitialized = false;
  }
}
