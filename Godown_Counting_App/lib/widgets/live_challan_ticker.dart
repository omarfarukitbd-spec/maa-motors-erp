import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/counting_provider.dart';

class LiveChallanTicker extends StatelessWidget {
  const LiveChallanTicker({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<CountingProvider>();
    final summaries = provider.categorySummaries;
    final total = provider.totalPiecesCounted;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        border: const Border(
          bottom: BorderSide(color: Color(0xFF0284C7), width: 2),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.18),
            blurRadius: 6,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    width: 10,
                    height: 10,
                    decoration: const BoxDecoration(
                      color: Color(0xFF10B981),
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 8),
                  const Text(
                    'লাইভ চালানি সামারি',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 0.3,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                decoration: BoxDecoration(
                  color: const Color(0xFF0369A1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  'মোট: $total পিস',
                  style: const TextStyle(
                    color: Color(0xFFFFD700),
                    fontSize: 12,
                    fontWeight: FontWeight.w900,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          if (summaries.isEmpty)
            const Text(
              'কোনো আইটেম এখনও গণনা করা হয়নি। নিচের তালিকা থেকে সংখ্যা যোগ করুন।',
              style: TextStyle(
                color: Color(0xFF94A3B8),
                fontSize: 11,
                fontStyle: FontStyle.italic,
              ),
            )
          else
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              physics: const BouncingScrollPhysics(),
              child: Row(
                children: summaries.map((s) {
                  return Container(
                    margin: const EdgeInsets.only(right: 8),
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E293B),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: const Color(0xFF334155)),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          '${s.rootGroup}: ',
                          style: const TextStyle(
                            color: Color(0xFF38BDF8),
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        Text(
                          '${s.totalQuantity} ${s.unit}',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                      ],
                    ),
                  );
                }).toList(),
              ),
            ),
        ],
      ),
    );
  }
}
