import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/counting_provider.dart';
import '../services/audio_engine_service.dart';
import '../services/category_classifier.dart';
import '../utils/app_colors.dart';
import '../utils/bangla_tools.dart';
import '../widgets/godown_top_bar.dart';
import '../widgets/tally_mark_widget.dart';
import '../widgets/part_search_overlay.dart';
import '../widgets/session_summary_sheet.dart';
import 'challan_view_screen.dart';

class MainCounterScreen extends StatefulWidget {
  final String initialMode; // 'unl' or 'load'

  const MainCounterScreen({super.key, this.initialMode = 'unl'});

  @override
  State<MainCounterScreen> createState() => _MainCounterScreenState();
}

class _MainCounterScreenState extends State<MainCounterScreen>
    with SingleTickerProviderStateMixin {
  final AudioEngineService _audio = AudioEngineService();
  late String _mode; // 'unl' or 'load'

  String? _activePartName;
  String? _activeCategory;
  String _activeUnit = 'পিস';

  int _count = 0;
  List<int> _history = [];
  List<int> _redoStack = [];

  final List<SessionItemData> _sessionItems = [];

  static const List<String> _quickChips = [
    'হাবস',
    'কার্টিজ',
    'ইঞ্জিন',
    'গিয়ারবক্স',
    'ব্রেক ডিস্ক',
  ];

  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;

  @override
  void initState() {
    super.initState();
    _mode = widget.initialMode;
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 350),
    );
    _pulseAnimation = Tween<double>(begin: 1.0, end: 1.15).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeOut),
    );
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  Color get _modeColor => _mode == 'unl' ? AppColors.unl : AppColors.load;

  void _showToast(String msg) {
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: AppColors.s2Dark,
        duration: const Duration(milliseconds: 1600),
        content: Text(
          msg,
          textAlign: TextAlign.center,
          style: const TextStyle(color: Colors.white, fontSize: 13.5),
        ),
      ),
    );
  }

  void _selectPart(String name, String cat, String unit) {
    if (_activePartName != null && _count > 0 && _activePartName != name) {
      _showToast('আগের পণ্যের OK চাপুন, তারপর নতুন বাছুন');
      return;
    }
    setState(() {
      _activePartName = name;
      _activeCategory = cat;
      _activeUnit = unit;
      _count = 0;
      _history.clear();
      _redoStack.clear();
    });
  }

  void _handleTap() {
    if (_activePartName == null) {
      _openSearch();
      return;
    }

    _history.add(_count);
    _redoStack.clear();

    setState(() {
      _count++;
    });

    _pulseController.forward(from: 0.0);
    _audio.triggerHaptic();
    _audio.playCountVoice(_count);
  }

  void _handleUndo() {
    if (_history.isEmpty) return;
    _audio.playUndoSound();
    setState(() {
      _redoStack.add(_count);
      _count = _history.removeLast();
    });
  }

  void _handleRedo() {
    if (_redoStack.isEmpty) return;
    _audio.triggerHaptic();
    setState(() {
      _history.add(_count);
      _count = _redoStack.removeLast();
    });
  }

  void _handleCompleteItem() {
    if (_activePartName == null || _count <= 0) return;

    _audio.playCompleteSound();
    final name = _activePartName!;
    final cat = _activeCategory ?? 'সাধারণ পার্টস';
    final unit = _activeUnit;
    final qty = _count;

    final existingIndex =
        _sessionItems.indexWhere((i) => i.name == name && i.unit == unit);
    setState(() {
      if (existingIndex >= 0) {
        _sessionItems[existingIndex].quantity += qty;
      } else {
        _sessionItems.add(SessionItemData(
          name: name,
          category: cat,
          unit: unit,
          quantity: qty,
        ));
      }
      _showToast('$name — ${BanglaTools.toBanglaDigits(qty)} $unit যোগ হয়েছে');
      _activePartName = null;
      _count = 0;
      _history.clear();
      _redoStack.clear();
    });
  }

  void _openSearch() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => PartSearchOverlay(
          onSelected: (name, cat, unit) => _selectPart(name, cat, unit),
        ),
      ),
    );
  }

  void _openSessionSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => SessionSummarySheet(
        mode: _mode,
        items: _sessionItems,
        onCreateChallan: () {
          Navigator.pop(ctx);
          _navigateToChallan();
        },
        onCancelSession: () {
          setState(() {
            _sessionItems.clear();
            _activePartName = null;
            _count = 0;
            _history.clear();
            _redoStack.clear();
          });
          _showToast('গণনা বাতিল হয়েছে');
          Navigator.pop(context); // Return to S1 Home
        },
      ),
    );
  }

  void _navigateToChallan() {
    if (_sessionItems.isEmpty) return;
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => ChallanViewScreen(
          mode: _mode,
          sessionItems: _sessionItems,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final totalPcs = _sessionItems.fold<int>(0, (sum, i) => sum + i.quantity);

    return Scaffold(
      backgroundColor: AppColors.bgDark,
      appBar: GodownTopBar(
        title: auth.shopDisplayName,
        audioEngine: _audio,
        onSoundToggled: () => setState(() {}),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Soft-Lock / Grace Banner if applicable
            if (auth.isSoftLocked)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                color: const Color(0xFF7F1D1D),
                child: const Text(
                  'প্রিন্ট ও শেয়ার বন্ধ আছে। গণনা, ইতিহাস ও এক্সপোর্ট চলবে।',
                  style: TextStyle(color: Colors.white, fontSize: 11.5),
                  textAlign: TextAlign.center,
                ),
              )
            else if (auth.isInGracePeriod)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                color: const Color(0xFFB45309),
                child: const Text(
                  'লাইসেন্সের মেয়াদ শেষ। গ্রেসের আরও ৭ দিন বাকি, সব চলছে।',
                  style: TextStyle(color: Colors.white, fontSize: 11.5),
                  textAlign: TextAlign.center,
                ),
              ),

            // 1. Search Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              child: InkWell(
                onTap: _openSearch,
                borderRadius: BorderRadius.circular(14),
                child: Container(
                  height: 48,
                  padding: const EdgeInsets.symmetric(horizontal: 14),
                  decoration: BoxDecoration(
                    color: AppColors.s2Dark,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.search, color: AppColors.muDark, size: 20),
                      SizedBox(width: 10),
                      Text(
                        'পার্টস খুঁজুন…',
                        style: TextStyle(color: AppColors.muDark, fontSize: 15),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            // 2. Horizontal Quick Chips
            SizedBox(
              height: 44,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: _quickChips.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (context, idx) {
                  final name = _quickChips[idx];
                  final isSelected = _activePartName == name;
                  return ActionChip(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    backgroundColor: isSelected ? _modeColor : AppColors.s2Dark,
                    side: BorderSide(
                      color: isSelected ? _modeColor : AppColors.lineDark,
                      width: 1.5,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                    label: Text(
                      name,
                      style: TextStyle(
                        color: isSelected ? AppColors.textOnAccent : AppColors.txDark,
                        fontSize: 13.5,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    onPressed: () {
                      final auto = CategoryClassifier.classify(name);
                      _selectPart(name, auto.rootGroup, auto.defaultUnit);
                    },
                  );
                },
              ),
            ),

            // 3. Part Name Display & Unit Toggle Pill
            Padding(
              padding: const EdgeInsets.only(top: 8, left: 16, right: 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    _activePartName ?? 'পণ্য বেছে নিন',
                    style: TextStyle(
                      color: _activePartName != null ? AppColors.txDark : AppColors.muDark,
                      fontSize: 19,
                      fontWeight: FontWeight.w700,
                      fontFamily: 'Hind Siliguri',
                    ),
                  ),
                  if (_activePartName != null) ...[
                    const SizedBox(width: 10),
                    InkWell(
                      onTap: () {
                        setState(() {
                          _activeUnit = _activeUnit == 'পিস' ? 'সেট' : 'পিস';
                        });
                      },
                      borderRadius: BorderRadius.circular(20),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: _modeColor, width: 1.5),
                        ),
                        child: Text(
                          _activeUnit,
                          style: TextStyle(
                            color: _modeColor,
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            ),

            // 4. Giant Bengali Digit
            Text(
              BanglaTools.toBanglaDigits(_count),
              style: TextStyle(
                color: _modeColor,
                fontSize: 88,
                fontWeight: FontWeight.w900,
                fontFamily: 'Hind Siliguri',
                height: 1.1,
              ),
            ),

            // 5. Visual Tally Marks Graphic Bar
            TallyMarkWidget(count: _count, color: AppColors.muDark),
            const Spacer(),

            // 6. Giant Circular Touch Counter (Center-Pulsing)
            Center(
              child: GestureDetector(
                onTap: _handleTap,
                child: AnimatedBuilder(
                  animation: _pulseAnimation,
                  builder: (context, child) {
                    return Container(
                      width: 220,
                      height: 220,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: AppColors.s1Dark,
                        border: Border.all(
                          color: _activePartName != null
                              ? _modeColor
                              : AppColors.lineDark,
                          width: 10,
                        ),
                        boxShadow: _activePartName != null
                            ? [
                                BoxShadow(
                                  color: _modeColor.withOpacity(0.2),
                                  blurRadius: 20 * _pulseAnimation.value,
                                  spreadRadius: 2 * _pulseAnimation.value,
                                ),
                              ]
                            : null,
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        _activePartName != null ? '+১' : 'আগে পণ্য\nবেছে নিন',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: _activePartName != null
                              ? _modeColor
                              : AppColors.muDark,
                          fontSize: _activePartName != null ? 52 : 18,
                          fontWeight: FontWeight.w800,
                          fontFamily: 'Hind Siliguri',
                          height: 1.2,
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),
            const SizedBox(height: 14),

            // 7. Undo & Redo Row
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 28),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  TextButton.icon(
                    style: TextButton.styleFrom(
                      foregroundColor: AppColors.txDark,
                      disabledForegroundColor: AppColors.lineDark,
                    ),
                    icon: const Icon(Icons.undo, size: 20),
                    label: const Text('পিছনে', style: TextStyle(fontSize: 15)),
                    onPressed: _history.isNotEmpty ? _handleUndo : null,
                  ),
                  TextButton.icon(
                    style: TextButton.styleFrom(
                      foregroundColor: AppColors.txDark,
                      disabledForegroundColor: AppColors.lineDark,
                    ),
                    icon: const Icon(Icons.redo, size: 20),
                    label: const Text('সামনে', style: TextStyle(fontSize: 15)),
                    onPressed: _redoStack.isNotEmpty ? _handleRedo : null,
                  ),
                ],
              ),
            ),
            const Spacer(),

            // 8. Session Summary Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: InkWell(
                onTap: _openSessionSheet,
                borderRadius: BorderRadius.circular(14),
                child: Container(
                  height: 48,
                  padding: const EdgeInsets.symmetric(horizontal: 14),
                  decoration: BoxDecoration(
                    color: AppColors.s1Dark,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: AppColors.lineDark, width: 1.5),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.list_alt, color: AppColors.muDark, size: 20),
                      const SizedBox(width: 10),
                      Text(
                        '${BanglaTools.toBanglaDigits(_sessionItems.length)}টি পণ্য · মোট ${BanglaTools.toBanglaDigits(totalPcs)}',
                        style: const TextStyle(
                          color: AppColors.txDark,
                          fontSize: 14.5,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const Spacer(),
                      const Icon(Icons.keyboard_arrow_up, color: AppColors.muDark, size: 20),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 10),

            // 9. Giant OK Button
            Padding(
              padding: const EdgeInsets.only(left: 16, right: 16, bottom: 16),
              child: SizedBox(
                width: double.infinity,
                height: 64,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _modeColor,
                    foregroundColor: AppColors.textOnAccent,
                    disabledBackgroundColor: AppColors.s2Dark,
                    disabledForegroundColor: AppColors.muDark,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    elevation: 0,
                  ),
                  icon: const Icon(Icons.check, size: 24),
                  label: const Text(
                    'এই পণ্য গণনা সম্পন্ন (OK)',
                    style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800),
                  ),
                  onPressed: (_activePartName != null && _count > 0)
                      ? _handleCompleteItem
                      : null,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
