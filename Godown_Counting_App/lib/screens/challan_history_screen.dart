import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/counting_provider.dart';
import '../utils/app_colors.dart';
import '../utils/bangla_tools.dart';
import '../widgets/godown_top_bar.dart';
import '../services/audio_engine_service.dart';
import 'challan_view_screen.dart';

class ChallanHistoryScreen extends StatefulWidget {
  const ChallanHistoryScreen({super.key});

  @override
  State<ChallanHistoryScreen> createState() => _ChallanHistoryScreenState();
}

class _ChallanHistoryScreenState extends State<ChallanHistoryScreen> {
  final AudioEngineService _audio = AudioEngineService();

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final counting = context.watch<CountingProvider>();
    final history = counting.sessionHistory;

    return Scaffold(
      backgroundColor: AppColors.bgDark,
      appBar: GodownTopBar(
        title: 'চালান ইতিহাস',
        audioEngine: _audio,
        onSoundToggled: () => setState(() {}),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'সব চালান',
                style: TextStyle(
                  color: AppColors.txDark,
                  fontSize: 22,
                  fontWeight: FontWeight.w800,
                  fontFamily: 'Hind Siliguri',
                ),
              ),
              const SizedBox(height: 10),
              Expanded(
                child: history.isEmpty
                    ? const Center(
                        child: Text(
                          'এখনো কোনো চালান তৈরি হয়নি',
                          style: TextStyle(color: AppColors.muDark, fontSize: 14),
                        ),
                      )
                    : ListView.separated(
                        itemCount: history.length,
                        separatorBuilder: (_, __) =>
                            const Divider(color: AppColors.lineDark, height: 1),
                        itemBuilder: (context, idx) {
                          final doc = history[idx];
                          final isUnloading = doc.sessionType == 'inward';
                          final modeText =
                              isUnloading ? 'গাড়ি থেকে নামানো' : 'গাড়িতে মাল তোলা';

                          return InkWell(
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => ChallanViewScreen(
                                    mode: isUnloading ? 'unl' : 'load',
                                    existingChallan: doc,
                                  ),
                                ),
                              );
                            },
                            child: Padding(
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              child: Row(
                                children: [
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          children: [
                                            Text(
                                              BanglaTools.toBanglaDigits(doc.displayChallanNo),
                                              style: const TextStyle(
                                                color: AppColors.txDark,
                                                fontSize: 16,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                            if (doc.revisionNumber > 0) ...[
                                              const SizedBox(width: 6),
                                              Container(
                                                padding: const EdgeInsets.symmetric(
                                                    horizontal: 8, vertical: 2),
                                                decoration: BoxDecoration(
                                                  color: AppColors.s2Dark,
                                                  borderRadius: BorderRadius.circular(10),
                                                  border: Border.all(color: AppColors.lineDark),
                                                ),
                                                child: Text(
                                                  'সংশোধিত ${BanglaTools.toBanglaDigits(doc.revisionNumber)}',
                                                  style: const TextStyle(
                                                    color: AppColors.unl,
                                                    fontSize: 10.5,
                                                    fontWeight: FontWeight.bold,
                                                  ),
                                                ),
                                              ),
                                            ],
                                          ],
                                        ),
                                        const SizedBox(height: 3),
                                        Text(
                                          '$modeText · ${BanglaTools.toBanglaDigits(doc.items.length)}টি পণ্য · মোট ${BanglaTools.toBanglaDigits(doc.totalPcs)} পিস',
                                          style: const TextStyle(
                                            color: AppColors.muDark,
                                            fontSize: 12.5,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  const Icon(
                                    Icons.lock,
                                    size: 18,
                                    color: AppColors.muDark,
                                  ),
                                  const SizedBox(width: 4),
                                  const Icon(
                                    Icons.arrow_forward_ios,
                                    size: 14,
                                    color: AppColors.muDark,
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
