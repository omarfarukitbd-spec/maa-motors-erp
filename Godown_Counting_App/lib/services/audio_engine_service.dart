import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/services.dart';

class AudioEngineService {
  static final AudioEngineService _instance = AudioEngineService._internal();
  factory AudioEngineService() => _instance;
  AudioEngineService._internal();

  AudioPlayer? _player;
  bool _isSoundEnabled = true;
  bool _isInitialized = false;

  bool get isSoundEnabled => _isSoundEnabled;

  void setSoundEnabled(bool enabled) {
    _isSoundEnabled = enabled;
  }

  void toggleSound() {
    _isSoundEnabled = !_isSoundEnabled;
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

  /// Plays natural human voice for a given count number (1..100)
  Future<void> playCountVoice(int number) async {
    triggerHaptic();

    if (!_isSoundEnabled) return;

    try {
      _ensureInitialized();
      // Stop any overlapping sound to ensure snappy response
      await _player?.stop();

      // Check bundled asset range
      if (number >= 1 && number <= 100) {
        await _player?.play(AssetSource('audio/$number.mp3'));
      } else {
        // Subtle system click sound fallback for counts beyond 100
        SystemSound.play(SystemSoundType.click);
      }
    } catch (_) {
      // Fallback silently without blocking counting
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

  /// Play completion chime
  Future<void> playCompleteSound() async {
    HapticFeedback.heavyImpact();
    if (!_isSoundEnabled) return;
    try {
      _ensureInitialized();
      await _player?.stop();
      await _player?.play(AssetSource('audio/5.mp3'));
    } catch (_) {}
  }

  void dispose() {
    _player?.dispose();
    _player = null;
    _isInitialized = false;
  }
}
