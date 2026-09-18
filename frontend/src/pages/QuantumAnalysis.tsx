import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Table as TableIcon,
  BarChart2,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useSimulation } from '../SimulationContext';

export const QuantumAnalysis: React.FC = () => {
  const { activeRun } = useSimulation();
  const [viewAscii, setViewAscii] = useState(false);

  // Fallback defaults if no active run
  const quantum = activeRun?.quantum ?? {
    circuit_diagram_text:
      'q_0: ──[H]───────────────────────────────\n' +
      '                                         \n' +
      'q_1: ──[H]────●─────────────────[M]──────\n' +
      '              │                  ║  (c0) \n' +
      'q_2: ─────────X──────────────────╫──[M]──\n' +
      '                                 ║   ║   \n' +
      'c_bell: ═════════════════════════╩═══╩═══',
    total_shots: 1000,
    counts: { '00': 492, '01': 8, '10': 5, '11': 495 },
    observed_probabilities: { '00': 0.492, '01': 0.008, '10': 0.005, '11': 0.495 },
    expected_probabilities: { '00': 0.50, '01': 0.00, '10': 0.00, '11': 0.50 },
    pauli_corrections: [
      { measurement: '00', correction: 'I (Identity - No Correction)' },
      { measurement: '01', correction: 'X (Bit Flip)' },
      { measurement: '10', correction: 'Z (Phase Flip)' },
      { measurement: '11', correction: 'XZ (Bit and Phase Flip)' },
    ],
    tvd_anomaly_score: 0.013,
    threshold: 0.05,
    threshold_exceeded: false,
    channel_interference_detected: false,
  };

  const chartData = ['00', '01', '10', '11'].map((state) => ({
    state: `|${state}⟩`,
    count: quantum.counts[state] ?? 0,
    observedPct: Number(((quantum.observed_probabilities[state] ?? 0) * 100).toFixed(1)),
    expectedPct: Number(((quantum.expected_probabilities[state] ?? 0) * 100).toFixed(1)),
  }));

  const stepsProtocol = [
    { num: 'Step 1', title: 'Prepare quantum state', desc: 'Initialize state |ψ⟩ = α|0⟩ + β|1⟩ encoding signature entropy onto qubit q0.' },
    { num: 'Step 2', title: 'Create Bell pair', desc: 'Generate maximally entangled Bell pair |Φ⁺⟩ = (|00⟩ + |11⟩)/√2 across qubits q1 and q2.' },
    { num: 'Step 3', title: 'Perform Bell-state measurement', desc: 'Apply CNOT(q0, q1) and Hadamard H(q0) to project into Bell basis.' },
    { num: 'Step 4', title: 'Obtain classical measurement bits', desc: 'Measure qubits into classical registers (c0, c1) yielding outcomes 00, 01, 10, or 11.' },
    { num: 'Step 5', title: 'Apply Pauli correction', desc: 'Feedforward classical bits to conditionally apply unitary transformation X^(c1) Z^(c0).' },
    { num: 'Step 6', title: 'Measure reconstructed state', desc: 'Measure verifier qubit q2 to evaluate transmission fidelity and channel disturbance.' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* ============================================================ */}
      {/* HEADER WITH SESSION CONTEXT */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#0E1522] border border-slate-800">
        <div>
          <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">
            Teleportation & Entanglement Telemetry
          </span>
          <h2 className="text-base font-bold text-white font-sans">
            Active Circuit Run: <span className="text-cyan-400 font-mono">{activeRun ? activeRun.simulation_id : 'BASELINE-SEEDED'}</span>
          </h2>
        </div>
        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="text-slate-400">Total Shots: <strong className="text-slate-200">{quantum.total_shots}</strong></span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Simulator: <strong className="text-cyan-400">Qiskit Aer</strong></span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION: QUANTUM CIRCUIT */}
      {/* ============================================================ */}
      <section className="p-6 rounded-2xl bg-[#0E1522] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Quantum Circuit Architecture
            </h3>
            <p className="text-xs text-slate-400">
              Complete 3-qubit teleportation and Bell channel verification circuit executed on Qiskit Aer.
            </p>
          </div>
          <button
            onClick={() => setViewAscii(!viewAscii)}
            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white"
          >
            <Code2 className="w-3.5 h-3.5 mr-1" />
            <span>{viewAscii ? 'Visual Circuit' : 'Qiskit ASCII Text'}</span>
          </button>
        </div>

        {viewAscii ? (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 overflow-x-auto">
            <pre className="font-mono text-xs text-cyan-300 leading-relaxed select-all">
              {quantum.circuit_diagram_text}
            </pre>
          </div>
        ) : (
          /* Visual Circuit Diagram Component */
          <div className="p-6 rounded-xl bg-slate-950 border border-slate-800/80 overflow-x-auto">
            <div className="min-w-[580px] space-y-6 font-mono text-xs">
              {/* Qubit 0 Line */}
              <div className="flex items-center space-x-3">
                <span className="w-12 text-slate-400 font-bold">q[0]</span>
                <div className="flex-1 flex items-center relative">
                  <div className="h-0.5 bg-slate-700 w-full absolute top-1/2 -translate-y-1/2" />
                  <div className="relative z-10 flex items-center justify-around w-full px-8">
                    <span className="px-2.5 py-1 rounded bg-blue-950 border border-blue-600 text-blue-300 font-bold">
                      H (Prep)
                    </span>
                    <span className="w-3 h-3 rounded-full bg-cyan-400" title="Control for Bell Measurement" />
                    <span className="px-2.5 py-1 rounded bg-blue-950 border border-blue-600 text-blue-300 font-bold">
                      H
                    </span>
                    <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-600 text-slate-400">
                      ───
                    </span>
                  </div>
                </div>
              </div>

              {/* Qubit 1 Line */}
              <div className="flex items-center space-x-3">
                <span className="w-12 text-slate-400 font-bold">q[1]</span>
                <div className="flex-1 flex items-center relative">
                  <div className="h-0.5 bg-slate-700 w-full absolute top-1/2 -translate-y-1/2" />
                  <div className="relative z-10 flex items-center justify-around w-full px-8">
                    <span className="px-2.5 py-1 rounded bg-blue-950 border border-blue-600 text-blue-300 font-bold">
                      H (Bell)
                    </span>
                    <span className="w-4 h-4 rounded-full bg-cyan-400 flex items-center justify-center text-[10px] text-slate-950 font-bold">
                      +
                    </span>
                    <span className="w-4 h-4 rounded-full bg-cyan-400 flex items-center justify-center text-[10px] text-slate-950 font-bold">
                      +
                    </span>
                    <span className="px-2.5 py-1 rounded bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold">
                      M (c0)
                    </span>
                  </div>
                </div>
              </div>

              {/* Qubit 2 Line */}
              <div className="flex items-center space-x-3">
                <span className="w-12 text-slate-400 font-bold">q[2]</span>
                <div className="flex-1 flex items-center relative">
                  <div className="h-0.5 bg-slate-700 w-full absolute top-1/2 -translate-y-1/2" />
                  <div className="relative z-10 flex items-center justify-around w-full px-8">
                    <span className="w-4 h-4 rounded-full bg-cyan-400 flex items-center justify-center text-[10px] text-slate-950 font-bold">
                      +
                    </span>
                    <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-400">
                      Channel
                    </span>
                    <span className="px-2.5 py-1 rounded bg-indigo-950 border border-indigo-600 text-indigo-300 font-bold">
                      X / Z (Correction)
                    </span>
                    <span className="px-2.5 py-1 rounded bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold">
                      M (c1)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ============================================================ */}
      {/* SECTION: QUANTUM PROTOCOL & PAULI CORRECTIONS */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Protocol Steps */}
        <section className="p-6 rounded-2xl bg-[#0E1522] border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Quantum Teleportation Protocol
          </h3>
          <div className="space-y-2.5">
            {stepsProtocol.map((s) => (
              <div key={s.num} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs">
                <div className="flex items-center space-x-2 font-mono mb-0.5">
                  <span className="text-cyan-400 font-bold">{s.num}:</span>
                  <span className="text-slate-200 font-sans font-semibold">{s.title}</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pauli Correction Table */}
        <section className="p-6 rounded-2xl bg-[#0E1522] border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-cyan-400" />
              Pauli Correction Mapping
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Deterministic unitary operations applied to reconstructed state based on Alice's 2-bit measurement.
            </p>

            <table className="w-full text-xs text-left border-collapse font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Measurement</th>
                  <th className="py-2.5 px-3">Correction Gate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {quantum.pauli_corrections.map((row) => (
                  <tr key={row.measurement} className="hover:bg-slate-800/30">
                    <td className="py-3 px-3 font-bold text-cyan-400">|{row.measurement}⟩</td>
                    <td className="py-3 px-3 text-slate-200">{row.correction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* QUANTUM ANOMALY STATUS CALLOUT */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Quantum Anomaly Metric</span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                  quantum.threshold_exceeded
                    ? 'bg-rose-950 text-rose-400 border border-rose-800'
                    : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}
              >
                {quantum.threshold_exceeded ? 'Threshold Exceeded' : 'Within Tolerance'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">
                Anomaly Score: <strong className={quantum.threshold_exceeded ? 'text-rose-400 text-sm' : 'text-emerald-400 text-sm'}>
                  {(quantum.tvd_anomaly_score * 100).toFixed(1)}%
                </strong>
              </span>
              <span className="text-slate-400">
                Threshold: <strong className="text-slate-300">{(quantum.threshold * 100).toFixed(1)}%</strong>
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* ============================================================ */}
      {/* SECTION: MEASUREMENT RESULTS & EXPECTED VS OBSERVED */}
      {/* ============================================================ */}
      <section className="p-6 rounded-2xl bg-[#0E1522] border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              Measurement Results & Expected vs Observed Comparison
            </h3>
            <p className="text-xs text-slate-400">
              Total Shots: {quantum.total_shots} on AerSimulator | Bell state |Φ⁺⟩ projection.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">State</th>
                  <th className="py-2.5 px-3">Count</th>
                  <th className="py-2.5 px-3">Observed %</th>
                  <th className="py-2.5 px-3">Expected %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {['00', '01', '10', '11'].map((state) => {
                  const cnt = quantum.counts[state] ?? 0;
                  const obs = (quantum.observed_probabilities[state] ?? 0) * 100;
                  const exp = (quantum.expected_probabilities[state] ?? 0) * 100;
                  return (
                    <tr key={state} className="hover:bg-slate-800/30">
                      <td className="py-3 px-3 font-bold text-cyan-400">|{state}⟩</td>
                      <td className="py-3 px-3 text-slate-300">{cnt}</td>
                      <td className="py-3 px-3 text-slate-200">{obs.toFixed(1)}%</td>
                      <td className="py-3 px-3 text-slate-400">{exp.toFixed(1)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Clean Grouped Bar Chart */}
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="state" stroke="#64748B" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis stroke="#64748B" tick={{ fontSize: 11, fill: '#64748B' }} unit="%" domain={[0, 60]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '0.5rem',
                    fontSize: '12px',
                    color: '#F8FAFC',
                  }}
                  formatter={(val: any) => [`${val}%`]}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="observedPct" name="Observed %" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expectedPct" name="Expected %" fill="#475569" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
};
