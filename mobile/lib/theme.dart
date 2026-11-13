import 'package:flutter/material.dart';

/// System light/dark. Gold focus. No analytics.
const Color kGold = Color(0xFFC9A227);
const Color kGoldInk = Color(0xFF1C1608);
const Color kIvory = Color(0xFFE8E0D0);
const Color kMatteBlack = Color(0xFF100F0C);
const Color kSurface = Color(0xFF1B1A16);
const Color kPaper = Color(0xFFF7F4EC);
const Color kPaperCard = Color(0xFFFFFDF8);
const Color kInk = Color(0xFF1C1915);

ThemeData buildLightTheme() {
  const scheme = ColorScheme.light(
    primary: Color(0xFF8A6A12),
    onPrimary: kGoldInk,
    secondary: kGold,
    onSecondary: kGoldInk,
    surface: kPaperCard,
    onSurface: kInk,
    error: Color(0xFF8D2A24),
    onError: Colors.white,
  );
  return _base(scheme, kPaper);
}

ThemeData buildDarkTheme() {
  const scheme = ColorScheme.dark(
    primary: kGold,
    onPrimary: kGoldInk,
    secondary: Color(0xFFE6C65A),
    onSecondary: kGoldInk,
    surface: kSurface,
    onSurface: kIvory,
    error: Color(0xFFFFB4AB),
    onError: kMatteBlack,
  );
  return _base(scheme, kMatteBlack);
}

ThemeData buildAppTheme() => buildDarkTheme();

ThemeData _base(ColorScheme scheme, Color canvas) {
  return ThemeData(
    useMaterial3: true,
    colorScheme: scheme,
    scaffoldBackgroundColor: canvas,
    focusColor: kGold,
    hoverColor: const Color(0x14C9A227),
    appBarTheme: AppBarTheme(
      backgroundColor: canvas,
      foregroundColor: scheme.onSurface,
      elevation: 0,
      centerTitle: false,
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        backgroundColor: kGold,
        foregroundColor: kGoldInk,
        minimumSize: const Size.fromHeight(48),
        textStyle: const TextStyle(fontWeight: FontWeight.w700),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: scheme.surface,
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: kGold, width: 2),
      ),
    ),
  );
}
