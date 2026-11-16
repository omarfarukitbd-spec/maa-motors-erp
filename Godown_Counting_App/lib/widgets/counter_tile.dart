import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/part_item_model.dart';
import '../providers/counting_provider.dart';

class CounterTile extends StatelessWidget {
  final PartItem part;

  const CounterTile({super.key, required this.part});

  void _showDirectInputDialog(BuildContext context, int currentCount) {
    final controller = TextEditingController(
      text: currentCount > 0 ? currentCount.toString() : '',
    );

    showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          backgroundColor: const Color(0xFF0F172A),
          title: Text(
            part.nameBn,
            style: const TextStyle(color: Colors.white, fontSize: 15),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'সরাসরি সংখ্যা লিখুন (${part.rootGroup})',
                style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: controller,
                autofocus: true,
                keyboardType: TextInputType.number,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
                decoration: InputDecoration(
                  filled: true,
                  fillColor: const Color(0xFF1E293B),
                  hintText: '0',
                  hintStyle: const TextStyle(color: Color(0xFF64748B)),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: const BorderSide(color: Color(0xFF0284C7)),
                  ),
                ),
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
                final val = int.tryParse(controller.text.trim()) ?? 0;
                context.read<CountingProvider>().setCount(part.id, val);
                Navigator.pop(ctx);
              },
              child: const Text('সংরক্ষণ করুন', style: TextStyle(color: Colors.white)),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<CountingProvider>();
    final count = provider.getCount(part.id);
    final isSelected = count > 0;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: isSelected ? const Color(0xFF132337) : const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(
          color: isSelected ? const Color(0xFF0284C7) : const Color(0xFF334155),
          width: isSelected ? 1.5 : 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      part.nameBn,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Wrap(
                      spacing: 6,
                      runSpacing: 4,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: const Color(0xFF0369A1).withOpacity(0.3),
                            borderRadius: BorderRadius.circular(4),
                            border: Border.all(color: const Color(0xFF0284C7)),
                          ),
                          child: Text(
                            part.rootGroup,
                            style: const TextStyle(
                              color: Color(0xFF38BDF8),
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        if (part.locationShop.isNotEmpty)
                          Text(
                            part.locationShop,
                            style: const TextStyle(
                              color: Color(0xFF64748B),
                              fontSize: 10,
                            ),
                          ),
                      ],
                    ),
                  ],
                ),
              ),
              InkWell(
                onTap: () => _showDirectInputDialog(context, count),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                  decoration: BoxDecoration(
                    color: isSelected ? const Color(0xFF0284C7) : const Color(0xFF0F172A),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: const Color(0xFF38BDF8)),
                  ),
                  child: Column(
                    children: [
                      Text(
                        '$count',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      Text(
                        part.defaultUnit,
                        style: const TextStyle(
                          color: Color(0xFFE2E8F0),
                          fontSize: 9,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          // Fast Increment / Decrement Row
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              _buildButton(
                label: '-৫',
                color: const Color(0xFFDC2626).withOpacity(0.2),
                textColor: const Color(0xFFF87171),
                onTap: () => provider.increment(part.id, -5),
              ),
              const SizedBox(width: 6),
              _buildButton(
                label: '-১',
                color: const Color(0xFFDC2626).withOpacity(0.2),
                textColor: const Color(0xFFF87171),
                onTap: () => provider.increment(part.id, -1),
              ),
              const SizedBox(width: 12),
              _buildButton(
                label: '+১',
                color: const Color(0xFF059669).withOpacity(0.2),
                textColor: const Color(0xFF34D399),
                onTap: () => provider.increment(part.id, 1),
              ),
              const SizedBox(width: 6),
              _buildButton(
                label: '+৫',
                color: const Color(0xFF059669).withOpacity(0.3),
                textColor: const Color(0xFF34D399),
                onTap: () => provider.increment(part.id, 5),
              ),
              const SizedBox(width: 6),
              _buildButton(
                label: '+১০',
                color: const Color(0xFF059669).withOpacity(0.4),
                textColor: const Color(0xFF34D399),
                onTap: () => provider.increment(part.id, 10),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildButton({
    required String label,
    required Color color,
    required Color textColor,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(6),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(6),
          border: Border.all(color: textColor.withOpacity(0.4)),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: textColor,
            fontSize: 11,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }
}
