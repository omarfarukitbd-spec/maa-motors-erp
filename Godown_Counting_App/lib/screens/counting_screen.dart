import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../providers/counting_provider.dart';
import 'challan_preview_screen.dart';

class CountingScreen extends StatefulWidget {
  const CountingScreen({super.key});

  @override
  State<CountingScreen> createState() => _CountingScreenState();
}

class _CountingScreenState extends State<CountingScreen> {
  bool soundEnabled = true;
  String activeItemName = 'হাবস';
  String activeItemUnit = 'পিস';

  int currentCount = 0;
  List<int> historyStack = [0];
  int historyIndex = 0;

  final TextEditingController _itemNameController = TextEditingController(text: 'হাবস');

  @override
  void dispose() {
    _itemNameController.dispose();
    super.dispose();
  }

  void _triggerHaptics() {
    HapticFeedback.lightImpact();
  }

  void _handleCircleTap() {
    _triggerHaptics();
    setState(() {
      currentCount++;
      if (historyIndex < historyStack.length - 1) {
        historyStack = historyStack.sublist(0, historyIndex + 1);
      }
      historyStack.add(currentCount);
      historyIndex++;
    });
  }

  void _handleUndo() {
    if (historyIndex > 0) {
      _triggerHaptics();
      setState(() {
        historyIndex--;
        currentCount = historyStack[historyIndex];
      });
    }
  }

  void _handleRedo() {
    if (historyIndex < historyStack.length - 1) {
      _triggerHaptics();
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

    _triggerHaptics();
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
              title: const Text('নতুন আইটেম সেটআপ', style: TextStyle(color: Colors.white, fontSize: 16)),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextField(
                    controller: nameCtrl,
                    style: const TextStyle(color: Colors.white),
                    decoration: const InputDecoration(
                      labelText: 'পণ্যের নাম লিখুন',
                      labelStyle: TextStyle(color: Color(0xFF94A3B8)),
                      hintText: 'যেমন: Axio ২০১৪ হাবস, কার্টিজ',
                      hintStyle: TextStyle(color: Color(0xFF64748B)),
                      enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFF0284C7))),
                    ),
                  ),
                  const SizedBox(height: 12),
                  DropdownButton<String>(
                    dropdownColor: const Color(0xFF1E293B),
                    value: unitVal,
                    isExpanded: true,
                    items: const [
                      DropdownMenuItem(value: 'পিস', child: Text('পিস (Pieces)', style: TextStyle(color: Colors.white))),
                      DropdownMenuItem(value: 'সেট', child: Text('সেট (Set)', style: TextStyle(color: Colors.white))),
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0B132B),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F172A),
        title: const Text('মা মোটরস • গোডাউন কাউন্টার', style: TextStyle(color: Colors.white, fontSize: 15)),
        actions: [
          IconButton(
            icon: Icon(
              soundEnabled ? Icons.volume_up : Icons.volume_off,
              color: soundEnabled ? const Color(0xFF38BDF8) : const Color(0xFFF87171),
            ),
            tooltip: soundEnabled ? 'সাউন্ড চালু' : 'শুধু ভাইব্রেশন',
            onPressed: () {
              setState(() => soundEnabled = !soundEnabled);
              _triggerHaptics();
            },
          ),
          IconButton(
            icon: const Icon(Icons.receipt_long, color: Color(0xFFFFD700)),
            tooltip: 'চালানপত্র দেখুন',
            onPressed: () {
              final challan = context.read<CountingProvider>().generateChallan();
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
            // Active Item Selection Bar
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              color: const Color(0xFF091124),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _itemNameController,
                      style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
                      decoration: const InputDecoration(
                        border: InputBorder.none,
                        hintText: 'পণ্যের নাম লিখুন...',
                        hintStyle: TextStyle(color: Color(0xFF64748B)),
                      ),
                      onChanged: (val) => setState(() => activeItemName = val),
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

            // Big Round Circle Area
            Expanded(
              child: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text('মাঝের বড় বৃত্তে ট্যাপ করে গুনুন', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12)),
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
                            const Text('কাউন্ট', style: TextStyle(color: Color(0xFFBAE6FD), fontSize: 12, fontWeight: FontWeight.bold)),
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
                    const SizedBox(height: 20),
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
                        label: const Text('এই পণ্য গণনা শেষ (OK)', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
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
