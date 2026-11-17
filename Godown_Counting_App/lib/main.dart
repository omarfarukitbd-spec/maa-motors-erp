import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/auth_provider.dart';
import 'providers/counting_provider.dart';
import 'screens/home_dashboard_screen.dart';
import 'utils/app_colors.dart';

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
          colorScheme: const ColorScheme.dark(
            primary: AppColors.unl,
            secondary: AppColors.load,
            surface: AppColors.s1Dark,
          ),
          scaffoldBackgroundColor: AppColors.bgDark,
          fontFamily: 'Hind Siliguri',
        ),
        home: const HomeDashboardScreen(),
      ),
    );
  }
}
