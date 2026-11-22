import 'package:flutter_test/flutter_test.dart';
import 'package:godown_counting_app/main.dart';

void main() {
  testWidgets('Maa Motors Godown Counting App smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const GodownCountingApp());
    expect(find.byType(GodownCountingApp), findsOneWidget);
  });
}
