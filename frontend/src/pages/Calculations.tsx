import React from 'react';
import {
  Calculator,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Cpu,
  ShieldAlert,
  ArrowRight,
  Info,
  Layers,
  Scale,
} from 'lucide-react';
import { useSimulation } from '../SimulationContext';

export const Calculations: React.FC = () => {
  const { activeRun } = useSimulation();

  // Fallback if no active simulation
  const calcData = activeRun?.calculations;
  const quantum = activeRun?.quantum;
  const observables = activeRun?.observables;
  const detection = activeRun?.detection;

  const totalShots = quantum?.total_shots ?? 1000;
  const states = ['00', '01', '10', '11'];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#0E1522] border border-slate-800">
        <div>
          <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">
            Explainable Research Calculation Panel
          </span>
          <h2 className="text-base font-bold text-white font-sans">
            Mathematical Derivations for Run: <span className="text-cyan-400 font-mono">{activeRun ? activeRun.simulation_id : 'BASELINE'}</span>
          </h2>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
            Metric: Total Variation Distance (TVD)
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* STEP 1: MEASUREMENT PROBABILITY */}
      {/* ============================================================ */}
      <section className="p-6 rounded-2xl bg-[#0E1522] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-3">
            <span className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-700/60 text-cyan-400 font-mono font-bold flex items-center justify-center text-xs">
              01
            </span>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wide">
                STEP 1 — Measurement Probability
              </h3>
              <p className="text-xs text-slate-400">
                Frequency normalization of raw measurement counts across all simulated quantum shots.
              </p>
            </div>
          </div>
          <div className="font-mono text-xs px-2.5 py-1 rounded bg-slate-950 text-cyan-300 border border-slate-800">
            P(s) = count(s) / N_shots
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
          {states.map((st) => {
            const count = quantum?.counts[st] ?? (st === '00' ? 492 : st === '11' ? 495 : st === '01' ? 8 : 5);
            const prob = count / totalShots;
            return (
              <div key={st} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 space-y-1.5">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-bold text-cyan-400">State |{st}⟩</span>
                  <span className="text-[11px]">{count} shots</span>
                </div>
                <div className="text-slate-300 text-xs">
                  {count} / {totalShots} = <strong className="text-white">{(prob * 100).toFixed(1)}%</strong>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-cyan-400 h-full rounded-full"
                    style={{ width: `${Math.min(100, prob * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* STEP 2: EXPECTED VS OBSERVED DEVIATION */}
      {/* ============================================================ */}
      <section className="p-6 rounded-2xl bg-[#0E1522] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-3">
            <span className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-700/60 text-cyan-400 font-mono font-bold flex items-center justify-center text-xs">
              02
            </span>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wide">
                STEP 2 — Expected vs Observed Deviation
              </h3>
              <p className="text-xs text-slate-400">
                Absolute elementwise divergence from ideal theoretical Bell state |Φ⁺⟩ projection.
              </p>
            </div>
          </div>
          <div className="font-mono text-xs px-2.5 py-1 rounded bg-slate-950 text-cyan-300 border border-slate-800">
            Deviation(s) = |P_obs(s) - P_exp(s)|
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">State</th>
                <th className="py-2.5 px-3">Expected P(s)</th>
                <th className="py-2.5 px-3">Observed P(s)</th>
                <th className="py-2.5 px-3 text-right">Absolute Deviation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {states.map((st) => {
                const obs = quantum?.observed_probabilities[st] ?? (st === '00' ? 0.492 : st === '11' ? 0.495 : 0.008);
                const exp = quantum?.expected_probabilities[st] ?? (st === '00' || st === '11' ? 0.50 : 0.00);
                const dev = Math.abs(obs - exp);
                return (
                  <tr key={st} className="hover:bg-slate-800/30">
                    <td className="py-3 px-3 font-bold text-cyan-400">|{st}⟩</td>
                    <td className="py-3 px-3 text-slate-400">{(exp * 100).toFixed(1)}% ({exp.toFixed(3)})</td>
                    <td className="py-3 px-3 text-slate-200">{(obs * 100).toFixed(1)}% ({obs.toFixed(3)})</td>
                    <td className="py-3 px-3 text-right text-cyan-300 font-bold">
                      {dev.toFixed(4)} ({(dev * 100).toFixed(2)}%)
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ============================================================ */}
      {/* STEP 3: ANOMALY SCORE (TOTAL VARIATION DISTANCE) */}
      {/* ============================================================ */}
      <section className="p-6 rounded-2xl bg-[#0E1522] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-3">
            <span className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-700/60 text-cyan-400 font-mono font-bold flex items-center justify-center text-xs">
              03
            </span>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wide">
                STEP 3 — Anomaly Score (Total Variation Distance)
              </h3>
              <p className="text-xs text-slate-400">
                Rigorous statistical distance metric bounded in [0, 1] matching backend implementation.
              </p>
            </div>
          </div>
          <div className="font-mono text-xs px-2.5 py-1 rounded bg-slate-950 text-cyan-300 border border-slate-800">
            TV = 1/2 Σ |P_observed(x) - P_expected(x)|
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3 font-mono text-xs">
          <div className="text-slate-300">
            <span className="text-slate-400">Formula Expansion: </span>
            TV = 0.5 × (
            {states.map((st, i) => {
              const obs = quantum?.observed_probabilities[st] ?? 0.0;
              const exp = quantum?.expected_probabilities[st] ?? 0.0;
              return (
                <span key={st}>
                  {i > 0 && ' + '}
                  |{obs.toFixed(3)} - {exp.toFixed(3)}|
                </span>
              );
            })}
            )
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <span className="text-slate-400">Calculated TVD Anomaly Score:</span>
            <span className="text-lg font-bold text-cyan-400">
              {((quantum?.tvd_anomaly_score ?? 0.013) * 100).toFixed(2)}%
              <span className="text-xs text-slate-400 font-normal ml-2">
                ({(quantum?.tvd_anomaly_score ?? 0.013).toFixed(4)})
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* STEP 4: THRESHOLD COMPARISON */}
      {/* ============================================================ */}
      <section className="p-6 rounded-2xl bg-[#0E1522] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-3">
            <span className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-700/60 text-cyan-400 font-mono font-bold flex items-center justify-center text-xs">
              04
            </span>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wide">
                STEP 4 — Threshold Comparison
              </h3>
              <p className="text-xs text-slate-400">
                Evaluating empirical TVD against tolerance threshold tau to detect channel tampering.
              </p>
            </div>
          </div>
        </div>

        {(() => {
          const score = quantum?.tvd_anomaly_score ?? 0.013;
          const thresh = quantum?.threshold ?? 0.05;
          const exceeded = score > thresh;
          return (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
              <div className="space-y-1">
                <div className="text-slate-300">
                  Anomaly Score = <strong className="text-cyan-300">{(score * 100).toFixed(2)}%</strong> | Threshold = <strong className="text-slate-300">{(thresh * 100).toFixed(1)}%</strong>
                </div>
                <div className="text-slate-400">
                  Evaluation: {(score * 100).toFixed(2)}% {exceeded ? '>' : '<='} {(thresh * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold ${
                    exceeded
                      ? 'bg-rose-950 text-rose-400 border border-rose-800'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}
                >
                  {exceeded ? 'Quantum Anomaly Detected' : 'Quantum Channel Within Tolerance'}
                </span>
              </div>
            </div>
          );
        })()}
      </section>

      {/* ============================================================ */}
      {/* STEP 5: CLASSICAL SECURITY EVIDENCE */}
      {/* ============================================================ */}
      <section className="p-6 rounded-2xl bg-[#0E1522] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-3">
            <span className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-700/60 text-cyan-400 font-mono font-bold flex items-center justify-center text-xs">
              05
            </span>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wide">
                STEP 5 — Classical Security Evidence
              </h3>
              <p className="text-xs text-slate-400">
                Evaluation of cryptographic verification, identity bindings, freshness, and access rules.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Verification Property</th>
                <th className="py-2.5 px-3">Evaluated Check</th>
                <th className="py-2.5 px-3">Result</th>
                <th className="py-2.5 px-3">Diagnostic Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {[
                {
                  check: 'Signature Verification',
                  eval: 'ECDSA-P256-SHA256 Math Check',
                  pass: observables?.signature_valid ?? true,
                  code: observables?.signature_valid ? 'PASS' : 'FAIL',
                  detail: observables?.signature_error_detail || 'Signature mathematically valid over message digest',
                },
                {
                  check: 'Identity Binding',
                  eval: 'Public Certificate Registry Match',
                  pass: observables?.identity_matched ?? true,
                  code: observables?.identity_matched ? 'PASS' : 'FAIL',
                  detail: observables?.identity_error_detail || 'Signer matches declared sender identity',
                },
                {
                  check: 'Nonce Freshness',
                  eval: 'Replay Ledger Cache Membership',
                  pass: (observables?.nonce_status ?? 'NEW') === 'NEW',
                  code: observables?.nonce_status ?? 'NEW',
                  detail: (observables?.nonce_status ?? 'NEW') === 'NEW' ? 'Single-use fresh nonce' : 'Reused nonce found in cache',
                },
                {
                  check: 'Session State',
                  eval: 'Session Identifier Tracking',
                  pass: (observables?.session_status ?? 'VALID') === 'VALID',
                  code: observables?.session_status ?? 'VALID',
                  detail: (observables?.session_status ?? 'VALID') === 'VALID' ? 'Valid active session' : 'Duplicate session token detected',
                },
                {
                  check: 'Authorization Policy',
                  eval: 'Access Control Matrix Verification',
                  pass: observables?.authorized ?? true,
                  code: observables?.authorized ? 'PASS' : 'FAIL',
                  detail: observables?.authorization_error_detail || 'Entity has valid transaction verification clearance',
                },
              ].map((row) => (
                <tr key={row.check} className="hover:bg-slate-800/30">
                  <td className="py-3 px-3 font-bold text-slate-200">{row.check}</td>
                  <td className="py-3 px-3 text-slate-400">{row.eval}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.pass
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                          : 'bg-rose-950 text-rose-400 border border-rose-800/60'
                      }`}
                    >
                      {row.code}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-sans">{row.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ============================================================ */}
      {/* STEP 6: FINAL DETECTION LOGIC */}
      {/* ============================================================ */}
      <section className="p-6 rounded-2xl bg-[#0E1522] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-3">
            <span className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-700/60 text-cyan-400 font-mono font-bold flex items-center justify-center text-xs">
              06
            </span>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wide">
                STEP 6 — Final Autonomous Detection Logic
              </h3>
              <p className="text-xs text-slate-400">
                Synthesis of observable indicators into classified threat decision without scenario leakage.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="py-2 px-3">Indicator</th>
                  <th className="py-2 px-3">Observable Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr>
                  <td className="py-2.5 px-3 text-slate-300">Signature Integrity</td>
                  <td className="py-2.5 px-3">
                    <span className={observables?.signature_valid ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                      {observables?.signature_valid ? 'PASS' : 'FAIL (Mismatch)'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-slate-300">Signer Identity</td>
                  <td className="py-2.5 px-3">
                    <span className={observables?.identity_matched ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                      {observables?.identity_matched ? 'PASS' : 'FAIL (Mismatch)'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-slate-300">Nonce Replay Status</td>
                  <td className="py-2.5 px-3">
                    <span className={observables?.nonce_status === 'NEW' ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                      {observables?.nonce_status === 'NEW' ? 'PASS (Fresh)' : 'ALERT (Reused)'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-slate-300">Quantum Anomaly</td>
                  <td className="py-2.5 px-3">
                    <span className={!observables?.quantum_threshold_exceeded ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                      {!observables?.quantum_threshold_exceeded ? 'PASS (Tolerance)' : 'ALERT (Exceeded)'}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs text-slate-400 font-mono">Detection Engine Decision:</div>
              <div className="text-base font-bold text-white font-sans mt-0.5">
                Detected Anomaly Class: <span className="text-cyan-400">{detection?.classification ?? 'Legitimate Transaction'}</span>
              </div>
            </div>
            <div className="text-xs font-mono text-slate-400 text-right">
              Evidence Score: <strong className="text-white font-bold">{detection?.evidence_score ?? 98.5}%</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
