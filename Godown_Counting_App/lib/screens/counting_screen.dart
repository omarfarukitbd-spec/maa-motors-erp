import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/counting_provider.dart';
import '../services/audio_engine_service.dart';
import '../widgets/app_drawer.dart';
import '../widgets/part_autocomplete_field.dart';
import 'challan_preview_screen.dart';
import 'super_admin_hub_screen.dart';

class CountingScreen extends StatefulWidget {
  const CountingScreen({super.key});

  @override
  State<CountingScreen> createState() => _CountingScreenState();
}

class _CountingScreenState extends State<CountingScreen> {
  final AudioEngineService _audio = AudioEngineService();

  String activeItemName = 'হাবস';
  String activeItemUnit = 'পিস';

  int currentCount = 0;
  List<int> historyStack = [0];
  int historyIndex = 0;

  final TextEditingController _itemNameController =
      TextEditingController(text: 'হাবস');
  final FocusNode _topFocusNode = FocusNode();

  @override
  void dispose() {
    _itemNameController.dispose();
    _topFocusNode.dispose();
    super.dispose();
  }

  void _handleCircleTap() {
    final nextCount = currentCount + 1;
    _audio.playCountVoice(nextCount);

    setState(() {
      currentCount = nextCount;
      if (historyIndex < historyStack.length - 1) {
        historyStack = historyStack.sublist(0, historyIndex + 1);
      }
      historyStack.add(currentCount);
      historyIndex++;
    });
  }

  void _handleUndo() {
    if (historyIndex > 0) {
      _audio.playUndoSound();
      setState(() {
        historyIndex--;
        currentCount = historyStack[historyIndex];
      });
    }
  }

  void _handleRedo() {
    if (historyIndex < historyStack.length - 1) {
      _audio.triggerHaptic();
      setState(() {
        historyIndex++;
        currentCount = historyStack[historyIndex];
      });
    }
  }

  void _handleItemComplete() {
    if (currentCount <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('অনুগ্রহ করে অন্তত ১টি সংখ্যা গণনা করুন!')),
      );
      return;
    }

    _audio.playCompleteSound();
    final name = activeItemName.trim();
    final qty = currentCount;
    final unit = activeItemUnit;

    // Log to Provider
    context.read<CountingProvider>().setCount(name, qty);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: const Color(0xFF059669),
        content: Text(
          '$name $qty $unit গণনা সম্পন্ন হয়েছে!',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
      ),
    );

    // Reset current counter
    setState(() {
      currentCount = 0;
      historyStack = [0];
      historyIndex = 0;
    });
  }

  void _openAddItemDialog() {
    final nameCtrl = TextEditingController();
    String unitVal = 'পিস';

    showDialog(
      context: context,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx, setDlgState) {
            return AlertDialog(
              backgroundColor: const Color(0xFF0F172A),
              title: const Text('নতুন আইটেম সেটআপ',
                  style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold)),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('ক্যাটালগ থেকে দ্রুত বেছে নিন:',
                      style: TextStyle(color: Color(0xFF94A3B8), fontSize: 10)),
                  const SizedBox(height: 6),
                  Wrap(
                    spacing: 6,
                    runSpacing: 6,
                    children: [
                      _quickChip('হাবস', 'পিস', nameCtrl, setDlgState, (u) => unitVal = u),
                      _quickChip('Axio ২০১৪ হাবস', 'পিস', nameCtrl, setDlgState, (u) => unitVal = u),
                      _quickChip('কার্টিজ', 'পিস', nameCtrl, setDlgState, (u) => unitVal = u),
                      _quickChip('Axio কার্টিজ', 'পিস', nameCtrl, setDlgState, (u) => unitVal = u),
                      _quickChip('৯ পিন CVT ইঞ্জিন', 'সেট', nameCtrl, setDlgState, (u) => unitVal = u),
                    ],
                  ),
                  const SizedBox(height: 12),
                  PartAutocompleteField(
                    controller: nameCtrl,
                    hintText: 'যেমন: Axio রিয়ার হাবস, কার্টিজ...',
                    labelText: 'অথবা পণ্যের নাম লিখুন (অটো-সাজেশন সহ)',
                    border: const UnderlineInputBorder(
                      borderSide: BorderSide(color: Color(0xFF0284C7)),
                    ),
                    onSelected: (selectedItem, detectedUnit) {
                      setDlgState(() {
                        nameCtrl.text = selectedItem;
                        unitVal = detectedUnit;
                      });
                    },
                  ),
                  const SizedBox(height: 10),
                  DropdownButton<String>(
                    dropdownColor: const Color(0xFF1E293B),
                    value: unitVal,
                    isExpanded: true,
                    items: const [
                      DropdownMenuItem(value: 'পিস', child: Text('পিস (Pieces)', style: TextStyle(color: Colors.white, fontSize: 12))),
                      DropdownMenuItem(value: 'সেট', child: Text('সেট (Set)', style: TextStyle(color: Colors.white, fontSize: 12))),
                    ],
                    onChanged: (val) {
                      if (val != null) setDlgState(() => unitVal = val);
                    },
                  ),
                ],
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(ctx),
                  child: const Text('বাতিল', style: TextStyle(color: Color(0xFF94A3B8))),
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0284C7)),
                  onPressed: () {
                    final n = nameCtrl.text.trim();
                    if (n.isNotEmpty) {
                      setState(() {
                        activeItemName = n;
                        activeItemUnit = unitVal;
                        _itemNameController.text = n;
                        currentCount = 0;
                        historyStack = [0];
                        historyIndex = 0;
                      });
                      Navigator.pop(ctx);
                    }
                  },
                  child: const Text('কাউন্ট শুরু করুন', style: TextStyle(color: Colors.white)),
                ),
              ],
            );
          },
        );
      },
    );
  }

  Widget _quickChip(String name, String unit, TextEditingController ctrl,
      StateSetter setDlgState, Function(String) onUnitChange) {
    return ActionChip(
      backgroundColor: const Color(0xFF1E293B),
      label: Text(name, style: const TextStyle(color: Color(0xFF38BDF8), fontSize: 10)),
      onPressed: () {
        setDlgState(() {
          ctrl.text = name;
          onUnitChange(unit);
        });
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    return Scaffold(
      backgroundColor: const Color(0xFF0B132B),
      drawer: const AppDrawer(),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F172A),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              auth.shopDisplayName,
              style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w900),
            ),
            Text(
              auth.currentTenant?.statusBadgeTextBn ?? 'ফ্রি কাউন্টার মোড',
              style: TextStyle(
                color: auth.isSoftLocked ? const Color(0xFFF87171) : const Color(0xFF34D399),
                fontSize: 9.5,
              ),
            ),
          ],
        ),
        actions: [
          // Super Admin Quick Hub Button
          if (auth.isSuperAdmin)
            IconButton(
              icon: const Icon(Icons.workspace_premium, color: Color(0xFFFBBF24), size: 18),
              tooltip: 'সুপার অ্যাডমিন হাব',
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const SuperAdminHubScreen()),
                );
              },
            ),
          IconButton(
            icon: Icon(
              _audio.isSoundEnabled ? Icons.volume_up : Icons.volume_off,
              color: _audio.isSoundEnabled ? const Color(0xFF38BDF8) : const Color(0xFFF87171),
            ),
            tooltip: _audio.isSoundEnabled ? 'সাউন্ড চালু' : 'শুধু ভাইব্রেশন',
            onPressed: () {
              setState(() {
                _audio.toggleSound();
              });
              _audio.triggerHaptic();
            },
          ),
          IconButton(
            icon: const Icon(Icons.receipt_long, color: Color(0xFFFFD700)),
            tooltip: 'চালানপত্র দেখুন',
            onPressed: () async {
              final countingProv = context.read<CountingProvider>();
              final challan = await countingProv.generateChallan();
              if (!mounted) return;
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => ChallanPreviewScreen(challan: challan)),
              );
            },
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Soft-Lock or Grace Warning Banner
            if (auth.isSoftLocked)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                color: const Color(0xFF7F1D1D),
                child: const Row(
                  children: [
                    Icon(Icons.lock_clock, color: Colors.amber, size: 14),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'সফট-লক মোড: গণনা ও এক্সপোর্ট চালু আছে। নতুন চালান প্রিন্ট বা শেয়ার বন্ধ।',
                        style: TextStyle(color: Colors.white, fontSize: 10),
                      ),
                    ),
                  ],
                ),
              )
            else if (auth.isInGracePeriod)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                color: const Color(0xFF065F46),
                child: Row(
                  children: [
                    const Icon(Icons.info_outline, color: Colors.cyanAccent, size: 14),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'গ্রেস পিরিয়ড সচল: মেয়াদ শেষ হলেও গণনা ও চালান প্রিন্ট চলছে।',
                        style: const TextStyle(color: Colors.white, fontSize: 10),
                      ),
                    ),
                  ],
                ),
              ),

            // Active Item Selection Bar with Autocomplete
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              color: const Color(0xFF091124),
              child: Row(
                children: [
                  Expanded(
                    child: PartAutocompleteField(
                      controller: _itemNameController,
                      focusNode: _topFocusNode,
                      hintText: 'পণ্যের নাম লিখুন (যেমন: Axio হাবস)...',
                      onSelected: (selectedItem, detectedUnit) {
                        setState(() {
                          activeItemName = selectedItem;
                          activeItemUnit = detectedUnit;
                          currentCount = 0;
                          historyStack = [0];
                          historyIndex = 0;
                        });
                      },
                      onChanged: (val) {
                        setState(() {
                          activeItemName = val;
                        });
                      },
                    ),
                  ),
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0284C7),
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    ),
                    icon: const Icon(Icons.add, size: 14, color: Colors.white),
                    label: const Text('আইটেম যোগ', style: TextStyle(fontSize: 11, color: Colors.white)),
                    onPressed: _openAddItemDialog,
                  ),
                ],
              ),
            ),

            // Big Round Circle Area (Bottom-Weighted)
            Expanded(
              child: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text('মাঝের বড় বৃত্তে ট্যাপ করে গুনুন • ভুল হলে আনডু করুন',
                        style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11)),
                    const SizedBox(height: 16),
                    GestureDetector(
                      onTap: _handleCircleTap,
                      child: Container(
                        width: 200,
                        height: 200,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: const LinearGradient(
                            colors: [Color(0xFF0284C7), Color(0xFF034078)],
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                          ),
                          border: Border.all(color: const Color(0xFF38BDF8), width: 4),
                          boxShadow: const [
                            BoxShadow(
                              color: Color(0x660284C7),
                              blurRadius: 25,
                              spreadRadius: 2,
                            ),
                          ],
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Text('কাউন্ট',
                                style: TextStyle(color: Color(0xFFBAE6FD), fontSize: 12, fontWeight: FontWeight.bold)),
                            Text(
                              '$currentCount',
                              style: const TextStyle(color: Colors.white, fontSize: 58, fontWeight: FontWeight.w900),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
                              decoration: BoxDecoration(
                                color: const Color(0xFF0F172A).withOpacity(0.8),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                '$activeItemName ($activeItemUnit)',
                                style: const TextStyle(color: Color(0xFFFFD700), fontSize: 11, fontWeight: FontWeight.bold),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 18),
                    // Undo & Redo
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        OutlinedButton.icon(
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: Color(0xFFDC2626)),
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                          ),
                          icon: const Icon(Icons.undo, color: Color(0xFFF87171), size: 16),
                          label: const Text('আনডু', style: TextStyle(color: Color(0xFFF87171))),
                          onPressed: historyIndex > 0 ? _handleUndo : null,
                        ),
                        const SizedBox(width: 16),
                        OutlinedButton.icon(
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: Color(0xFF059669)),
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                          ),
                          icon: const Icon(Icons.redo, color: Color(0xFF34D399), size: 16),
                          label: const Text('রিডু', style: TextStyle(color: Color(0xFF34D399))),
                          onPressed: historyIndex < historyStack.length - 1 ? _handleRedo : null,
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    // OK Button
                    SizedBox(
                      width: 240,
                      child: ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF059669),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                        ),
                        icon: const Icon(Icons.check_circle, color: Colors.white),
                        label: const Text('এই পণ্য গণনা শেষ (OK)',
                            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                        onPressed: _handleItemComplete,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
