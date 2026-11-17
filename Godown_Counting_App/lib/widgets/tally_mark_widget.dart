import 'package:flutter/material.dart';

class TallyMarkWidget extends StatelessWidget {
  final int count;
  final Color color;

  const TallyMarkWidget({
    super.key,
    required this.count,
    this.color = const Color(0xFFA6B0B8),
  });

  @override
  Widget build(BuildContext context) {
    if (count <= 0) {
      return const SizedBox(height: 28);
    }

    final groupsOfFive = count ~/ 5;
    final remainder = count % 5;

    // Show at most 4 clusters to fit screen gracefully
    final startIndex = groupsOfFive > 3 ? groupsOfFive - 3 : 0;
    final visibleFullClusters = groupsOfFive - startIndex;

    return SizedBox(
      height: 28,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          for (int i = 0; i < visibleFullClusters; i++) ...[
            CustomPaint(
              size: const Size(38, 28),
              painter: _TallyClusterPainter(strokeCount: 5, color: color),
            ),
            const SizedBox(width: 8),
          ],
          if (remainder > 0)
            CustomPaint(
              size: const Size(38, 28),
              painter: _TallyClusterPainter(strokeCount: remainder, color: color),
            ),
        ],
      ),
    );
  }
}

class _TallyClusterPainter extends CustomPainter {
  final int strokeCount;
  final Color color;

  _TallyClusterPainter({required this.strokeCount, required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 2.8
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    final verticalCount = strokeCount > 4 ? 4 : strokeCount;
    for (int i = 0; i < verticalCount; i++) {
      final x = 6.0 + i * 8.0;
      canvas.drawLine(Offset(x, 3), Offset(x, 25), paint);
    }

    if (strokeCount >= 5) {
      // Diagonal slash across
      canvas.drawLine(const Offset(1, 22), const Offset(35, 6), paint);
    }
  }

  @override
  bool shouldRepaint(covariant _TallyClusterPainter oldDelegate) {
    return oldDelegate.strokeCount != strokeCount || oldDelegate.color != color;
  }
}
