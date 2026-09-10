import 'package:flutter/material.dart';

import 'theme.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const AzCoherenceApp());
}

const String limitation =
    'AZCoherence reviews a primary triad/claim+score against an alternate '
    'independent path. Receipts are PASS / FLAG / NEUTRALIZE / REFUSE. '
    'Never invent evidence. Confidence is not truth. Not AZ-CLCE. '
    'Not AKM-TRIAD-1.0. Advisory only. Author: Aziel Eliab.';

const double kPassDelta = 0.08;
const double kNeutralizeDelta = 0.25;
const double kHighConf = 0.80;

double? norm(String raw) {
  final n = double.tryParse(raw.trim());
  if (n == null) return null;
  var out = n;
  if (out > 1 && out <= 100) out = out / 100;
  if (out < 0) return 0;
  if (out > 1) return 1;
  return out;
}

String decide(double? primary, double? alternate, bool pe, bool ae, String claim) {
  if (claim.trim().isEmpty || primary == null || alternate == null) return 'REFUSE';
  final delta = (primary - alternate).abs();
  final high = (primary >= kHighConf && !pe) || (alternate >= kHighConf && !ae);
  if (high && delta > 0.15) return 'NEUTRALIZE';
  if (high) return 'FLAG';
  if (delta > kNeutralizeDelta) return 'NEUTRALIZE';
  if (delta > kPassDelta || !pe || !ae) return 'FLAG';
  return 'PASS';
}

class AzCoherenceApp extends StatelessWidget {
  const AzCoherenceApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AZCoherence',
      debugShowCheckedModeBanner: false,
      theme: buildAppTheme(),
      home: const FormPage(),
    );
  }
}

class FormPage extends StatefulWidget {
  const FormPage({super.key});

  @override
  State<FormPage> createState() => _FormPageState();
}

class _FormPageState extends State<FormPage> {
  final _claim = TextEditingController(text: 'login succeeds');
  final _ps = TextEditingController(text: '0.91');
  final _as = TextEditingController(text: '0.88');
  final _pe = TextEditingController(text: 'operator-provided cite A');
  final _ae = TextEditingController(text: 'operator-provided cite B');
  String? _verdict;
  double? _delta;

  @override
  void dispose() {
    _claim.dispose();
    _ps.dispose();
    _as.dispose();
    _pe.dispose();
    _ae.dispose();
    super.dispose();
  }

  void _run() {
    final p = norm(_ps.text);
    final a = norm(_as.text);
    setState(() {
      _verdict = decide(p, a, _pe.text.trim().isNotEmpty, _ae.text.trim().isNotEmpty, _claim.text);
      _delta = (p != null && a != null) ? (p - a).abs() : null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('AZCoherence')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            'Coherence reviewer. Confidence is not truth.',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  color: kGold,
                  fontStyle: FontStyle.italic,
                ),
          ),
          const SizedBox(height: 8),
          const Text(limitation),
          const SizedBox(height: 16),
          TextField(controller: _claim, maxLines: 3, decoration: const InputDecoration(labelText: 'Claim')),
          const SizedBox(height: 12),
          TextField(controller: _ps, decoration: const InputDecoration(labelText: 'Primary score')),
          const SizedBox(height: 12),
          TextField(controller: _as, decoration: const InputDecoration(labelText: 'Alternate score')),
          const SizedBox(height: 12),
          TextField(controller: _pe, decoration: const InputDecoration(labelText: 'Primary evidence (never invented)')),
          const SizedBox(height: 12),
          TextField(controller: _ae, decoration: const InputDecoration(labelText: 'Alternate evidence')),
          const SizedBox(height: 16),
          FilledButton(onPressed: _run, child: const Text('Review triad')),
          if (_verdict != null) ...[
            const SizedBox(height: 16),
            Text(
              _verdict!,
              style: const TextStyle(fontSize: 42, fontWeight: FontWeight.w700, color: kGold, height: 1),
            ),
            if (_delta != null) Text('delta ${_delta!.toStringAsFixed(4)}'),
            const SizedBox(height: 8),
            const Text(limitation, style: TextStyle(fontSize: 12)),
          ],
        ],
      ),
    );
  }
}
