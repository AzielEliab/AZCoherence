import 'package:flutter/material.dart';

import 'theme.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const AzCoherenceApp());
}

const String lede =
    'Check a score against a second path you provide. The receipt is advisory. '
    'Confidence is not truth.';

const String about =
    'Receipts are PASS, FLAG, NEUTRALIZE, or REFUSE. Evidence must be provided. '
    'AZ-CLCE and AKM-TRIAD-1.0 stay separate. Author: Aziel Eliab.';

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

String _plainVerdict(String verdict) {
  switch (verdict) {
    case 'PASS':
      return 'Pass';
    case 'FLAG':
      return 'Flag';
    case 'NEUTRALIZE':
      return 'Neutralize';
    case 'REFUSE':
      return 'Refused';
    default:
      return verdict;
  }
}

String _explain(String verdict) {
  switch (verdict) {
    case 'PASS':
      return 'These scores agree. The receipt is advisory. Confidence is not truth.';
    case 'FLAG':
      return 'The scores differ, or the evidence is thin. Confidence is not truth.';
    case 'NEUTRALIZE':
      return 'The scores split widely. Treat the primary score as not authoritative.';
    default:
      return 'Add a claim and both scores. Confidence is not truth.';
  }
}

class AzCoherenceApp extends StatelessWidget {
  const AzCoherenceApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AZCoherence',
      debugShowCheckedModeBanner: false,
      theme: buildLightTheme(),
      darkTheme: buildDarkTheme(),
      themeMode: ThemeMode.system,
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
  final _claim = TextEditingController();
  final _ps = TextEditingController();
  final _as = TextEditingController();
  final _pe = TextEditingController();
  final _ae = TextEditingController();
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
          Text(lede, style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 16),
          TextField(
            controller: _claim,
            maxLines: 3,
            decoration: const InputDecoration(labelText: 'Claim', hintText: 'The claim that was scored'),
          ),
          const SizedBox(height: 12),
          TextField(controller: _ps, decoration: const InputDecoration(labelText: 'Primary score', hintText: '0.91')),
          const SizedBox(height: 12),
          TextField(controller: _as, decoration: const InputDecoration(labelText: 'Alternate score', hintText: '0.88')),
          const SizedBox(height: 12),
          TextField(
            controller: _pe,
            decoration: const InputDecoration(labelText: 'Primary evidence', hintText: 'Citation you already have'),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _ae,
            decoration: const InputDecoration(labelText: 'Alternate evidence', hintText: 'Citation you already have'),
          ),
          const SizedBox(height: 16),
          FilledButton(onPressed: _run, child: const Text('Review')),
          if (_verdict != null) ...[
            const SizedBox(height: 16),
            Text(_plainVerdict(_verdict!), style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 4),
            Text(_explain(_verdict!)),
            if (_delta != null) Text('Difference ${_delta!.toStringAsFixed(4)}'),
          ],
          const SizedBox(height: 16),
          const ExpansionTile(
            title: Text('Notes'),
            children: [
              Padding(
                padding: EdgeInsets.fromLTRB(16, 0, 16, 12),
                child: Text(about),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
