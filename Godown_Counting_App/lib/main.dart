import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'providers/auth_provider.dart';
import 'providers/counting_provider.dart';
import 'providers/theme_provider.dart';
import 'screens/home_dashboard_screen.dart';
import 'services/parts_catalog_service.dart';
import 'utils/app_colors.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  PartsCatalogService().init();
  runApp(const GodownCountingApp());
}

class GodownCountingApp extends StatelessWidget {
  const GodownCountingApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) => ThemeProvider(),
        ),
        ChangeNotifierProvider(
          create: (_) => AuthProvider()..init(),
        ),
        ChangeNotifierProvider(
          create: (_) => CountingProvider()..initialize(),
        ),
      ],
      child: Consumer<ThemeProvider>(
        builder: (context, themeProvider, _) {
          return MaterialApp(
            title: 'মেসার্স মা মোটরস • গোডাউন চালান',
            debugShowCheckedModeBanner: false,
            themeMode: themeProvider.themeMode,
            theme: ThemeData(
              useMaterial3: true,
              brightness: Brightness.light,
              fontFamily: 'Hind Siliguri',
              textTheme: GoogleFonts.hindSiliguriTextTheme(ThemeData.light().textTheme),
              colorScheme: const ColorScheme.light(
                primary: AppColors.load,
                secondary: AppColors.unl,
                surface: AppColors.s1Light,
              ),
              scaffoldBackgroundColor: AppColors.bgLight,
            ),
            darkTheme: ThemeData(
              useMaterial3: true,
              brightness: Brightness.dark,
              fontFamily: 'Hind Siliguri',
              textTheme: GoogleFonts.hindSiliguriTextTheme(ThemeData.dark().textTheme),
              colorScheme: const ColorScheme.dark(
                primary: AppColors.load,
                secondary: AppColors.unl,
                surface: AppColors.s1Dark,
              ),
              scaffoldBackgroundColor: AppColors.bgDark,
            ),
            home: const HomeDashboardScreen(),
          );
        },
      ),
    );
  }
}
