import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Cpu,
  Calculator,
  Percent,
} from 'lucide-react';
import { useSimulation } from '../SimulationContext';

export const Results: React.FC = () => {
  const navigate = useNavigate();
  const { activeRun } = useSimulation();

  const isLegit = activeRun?.detection.status === 'LEGITIMATE';
  const detection = activeRun?.detection;
  const quantum = activeRun?.quantum;

  // Fallback defaults if no active run yet
  const status = detection?.status ?? 'LEGITIMATE';
  const classification = detection?.classification ?? 'Legitimate Transaction';
  const evidenceScore = detection?.evidence_score ?? 98.5;
  const anomalyScore = quantum ? (quantum.tvd_anomaly_score * 100).toFixed(1) : '1.2';
  const threshold = quantum ? (quantum.threshold * 100).toFixed(1) : '5.0';

  const checklist = detection?.evidence_checklist ?? [
    { name: 'Digital Signature Integrity', passed: true, detail: 'ECDSA-P256 cryptographic signature verified successfully' },
    { name: 'Signer Identity & Key Binding', passed: true, detail: 'Public key certificate matches registered sender identity' },
    { name: 'Freshness & Nonce Uniqueness', passed: true, detail: 'Cryptographic nonce and session identifier are fresh and unrecorded' },
    { name: 'Verification Authorization', passed: true, detail: 'Entity possesses valid authorization privileges' },
    { name: 'Quantum Bell-State Fidelity', passed: true, detail: 'Total Variation Distance within statistical threshold' },
  ];

  const whyPoints = detection?.why_detected_points ?? [
    'Cryptographic signature verified successfully with standard ECDSA-P256.',
    'Signer identity perfectly matched registered public key credentials.',
    'Nonce and session identifier are strictly unique and fresh.',
    'Quantum teleportation measurement distribution matches theoretical expectation within tolerance.',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Top Banner / Security Verdict */}
      <section
        className={`p-8 rounded-2xl border transition-all shadow-xl ${
          isLegit
            ? 'bg-gradient-to-b from-[#0B1E1A] to-[#0E1522] border-emerald-800/80 shadow-emerald-950/20'
            : 'bg-gradient-to-b from-[#240D14] to-[#0E1522] border-rose-800/80 shadow-rose-950/20'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">
              SECURITY ANALYSIS VERDICT
            </span>
            <div className="flex items-center space-x-3">
              {isLegit ? (
                <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
              ) : (
                <AlertOctagon className="w-8 h-8 text-rose-400 shrink-0" />
              )}
              <h2
                className={`text-3xl sm:text-4xl font-black tracking-tight font-sans ${
                  isLegit ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {status === 'LEGITIMATE' ? 'LEGITIMATE' : 'THREAT DETECTED'}
              </h2>
            </div>
            <p className="text-sm text-slate-300 font-medium">
              Classified Threat Pattern:{' '}
              <span className="font-bold text-white font-mono text-base ml-1">
                {classification}
              </span>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-right min-w-[170px] shrink-0">
            <div className="text-xs text-slate-400 font-mono">Evidence Score</div>
            <div
              className={`text-3xl font-black font-mono mt-0.5 ${
                isLegit ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {evidenceScore}%
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Calibrated Confidence</div>
          </div>
        </div>
      </section>

      {/* Concise Evidence Checklist */}
      <section className="p-6 rounded-2xl bg-[#0E1522] border border-slate-800 space-y-4">
        <h3 className="text-sm font-semibold text-white tracking-wide">
          Evaluated Observable Evidence
        </h3>

        <div className="space-y-2.5">
          {checklist.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start space-x-3 text-xs"
            >
              {item.passed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">{item.name}</span>
                  <span
                    className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      item.passed
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/60'
                        : 'bg-rose-950 text-rose-400 border border-rose-900/60'
                    }`}
                  >
                    {item.passed ? 'PASSED' : 'FLAGGED'}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed font-mono">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quantum Anomaly Callout */}
      <section className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
        <div>
          <span className="text-slate-400">Quantum TVD Anomaly Score: </span>
          <strong className={Number(anomalyScore) > Number(threshold) ? 'text-rose-400 text-sm' : 'text-emerald-400 text-sm'}>
            {anomalyScore}%
          </strong>
          <span className="text-slate-400 ml-4">Threshold: </span>
          <strong className="text-slate-300">{threshold}%</strong>
        </div>
        <div className="text-slate-400 text-[11px]">
          {Number(anomalyScore) > Number(threshold)
            ? 'Channel disturbance exceeds security tolerance'
            : 'Physical teleportation fidelity within baseline'}
        </div>
      </section>

      {/* Why was this detected? */}
      <section className="p-6 rounded-2xl bg-[#0E1522] border border-slate-800 space-y-3">
        <h3 className="text-sm font-semibold text-white tracking-wide">
          Why was this detected?
        </h3>
        <p className="text-xs text-slate-400">
          Autonomous inference rationale derived strictly from observable indicators:
        </p>

        <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 font-sans leading-relaxed">
          {whyPoints.map((pt, i) => (
            <li key={i} className="pl-1">
              {pt}
            </li>
          ))}
        </ol>
      </section>

      {/* Action Navigation Buttons */}
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button
          onClick={() => navigate('/quantum-analysis')}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-800/60 text-xs font-semibold font-mono transition-all active:scale-[0.98]"
        >
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>View Quantum Analysis</span>
        </button>

        <button
          onClick={() => navigate('/calculations')}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold font-mono transition-all active:scale-[0.98]"
        >
          <Calculator className="w-4 h-4 text-slate-300" />
          <span>View Calculations</span>
        </button>

        <button
          onClick={() => navigate('/simulation')}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-mono transition-all active:scale-[0.98]"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Run New Simulation</span>
        </button>
      </div>
    </div>
  );
};
