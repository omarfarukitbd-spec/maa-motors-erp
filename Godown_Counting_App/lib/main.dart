import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/auth_provider.dart';
import 'providers/counting_provider.dart';
import 'screens/counting_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const GodownCountingApp());
}

class GodownCountingApp extends StatelessWidget {
  const GodownCountingApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) => AuthProvider()..init(),
        ),
        ChangeNotifierProvider(
          create: (_) => CountingProvider()..initialize(),
        ),
      ],
      child: MaterialApp(
        title: 'মা মোটরস গোডাউন কাউন্টার ও চালান',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color(0xFF0284C7),
            brightness: Brightness.dark,
          ),
          scaffoldBackgroundColor: const Color(0xFF0B132B),
          fontFamily: 'Hind Siliguri',
        ),
        home: const CountingScreen(),
      ),
    );
  }
}
