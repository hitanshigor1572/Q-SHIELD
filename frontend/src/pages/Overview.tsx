import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Shield,
  Key,
  Cpu,
  Radio,
  FileCheck,
  AlertTriangle,
  Lock,
  Sparkles,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';

export const Overview: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Digital Signature',
      desc: 'ECDSA-P256 with SHA-256 digest authenticates message payload.',
      icon: Key,
    },
    {
      num: '02',
      title: 'State Preparation',
      desc: 'Digest entropy mapped to single-qubit quantum state |ψ⟩.',
      icon: Cpu,
    },
    {
      num: '03',
      title: 'Bell Entanglement',
      desc: 'Maximally entangled Bell pair |Φ⁺⟩ generated between sender and verifier.',
      icon: Layers,
    },
    {
      num: '04',
      title: 'Quantum Teleportation',
      desc: 'Joint Bell measurement with feedforward Pauli correction gates.',
      icon: Radio,
    },
    {
      num: '05',
      title: 'Threat Detection',
      desc: 'Statistical TVD analysis detects noise & channel interference.',
      icon: FileCheck,
    },
  ];

  const threatVectors = [
    {
      name: 'Signature Forgery',
      desc: 'Tampered transaction content or fabricated signatures failing mathematical elliptic-curve verification.',
      icon: Lock,
    },
    {
      name: 'Impersonation Attack',
      desc: 'Unauthorized actors signing messages while masquerading as legitimate registered participants.',
      icon: AlertTriangle,
    },
    {
      name: 'Replay Attack',
      desc: 'Eavesdroppers intercepting valid past transactions and rebroadcasting expired nonces and session tokens.',
      icon: ArrowRight,
    },
    {
      name: 'Unauthorized Verification',
      desc: 'Entities attempting cryptographic audit operations without sufficient role clearance in the access policy.',
      icon: Shield,
    },
    {
      name: 'Channel Interference',
      desc: 'Man-in-the-middle eavesdropping or physical channel noise disrupting quantum Bell-state correlation.',
      icon: Radio,
    },
  ];

  const technologies = [
    { name: 'Python 3.13', desc: 'Core Backend Engine' },
    { name: 'Qiskit 2.5', desc: 'Quantum Circuit SDK' },
    { name: 'Qiskit Aer', desc: 'High-Performance Simulator' },
    { name: 'FastAPI', desc: 'High-Throughput REST API' },
    { name: 'React + TypeScript', desc: 'Modern Research Console' },
    { name: 'NumPy & SciPy', desc: 'Statistical Vector Analysis' },
    { name: 'Pandas', desc: 'Structured Data Processing' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-12">
      {/* ============================================================ */}
      {/* HERO SECTION */}
      {/* ============================================================ */}
      <section className="relative rounded-2xl bg-gradient-to-b from-[#0F172A] to-[#0B0F17] border border-slate-800 p-8 md:p-12 overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Simulated Cybersecurity Research Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight font-sans">
            Quantum-Inspired Cyber Threat Detection
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            "An explainable simulation framework combining digital-signature verification with quantum-state analysis."
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/simulation"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.98]"
            >
              Launch Simulation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link
              to="/methodology"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-medium text-sm transition-all active:scale-[0.98]"
            >
              View Methodology
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5-STEP HORIZONTAL ARCHITECTURE */}
      {/* ============================================================ */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white tracking-wide">
            5-Step Quantum-Inspired Verification Pipeline
          </h2>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            Deterministic Pipeline Architecture
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="group relative p-4 rounded-xl bg-[#0E1522] border border-slate-800 hover:border-cyan-800/60 transition-all duration-150 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-cyan-400/90 bg-cyan-950/40 border border-cyan-900/50 px-2 py-0.5 rounded">
                      {step.num}
                    </span>
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-100 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* WHAT PROBLEM ARE WE SOLVING? */}
      {/* ============================================================ */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white tracking-wide">
            What problem are we solving?
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Classical digital signatures protect message authenticity, but cannot physically confirm transmission medium state or prevent sophisticated physical and replay tampering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {threatVectors.map((threat) => {
            const Icon = threat.icon;
            return (
              <div
                key={threat.name}
                className="p-5 rounded-xl bg-[#0E1522] border border-slate-800/90 space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-md bg-slate-800/80 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-cyan-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-200">
                    {threat.name}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {threat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* HOW OUR SYSTEM WORKS */}
      {/* ============================================================ */}
      <section className="p-6 rounded-2xl bg-[#0E1522] border border-slate-800 space-y-4">
        <h2 className="text-lg font-semibold text-white tracking-wide">
          How our system works
        </h2>
        <p className="text-xs text-slate-400">
          A layered defense separating observable telemetry collection from autonomous detection inference.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 p-4 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs font-mono">
          <span className="px-3 py-1.5 rounded bg-slate-800 text-slate-200">Sender</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="px-3 py-1.5 rounded bg-blue-950 text-blue-300 border border-blue-800/50">Digital Signature</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="px-3 py-1.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/50">Security Verification</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="px-3 py-1.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50">Quantum Layer</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="px-3 py-1.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50">Measurement</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="px-3 py-1.5 rounded bg-violet-950 text-violet-300 border border-violet-800/50">Statistical Analysis</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="px-3 py-1.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50">Threat Detection</span>
        </div>
      </section>

      {/* ============================================================ */}
      {/* KEY TECHNOLOGIES */}
      {/* ============================================================ */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white tracking-wide">
          Key technologies
        </h2>
        <div className="flex flex-wrap gap-2.5">
          {technologies.map((t) => (
            <div
              key={t.name}
              className="px-3.5 py-2 rounded-lg bg-[#0E1522] border border-slate-800 text-xs font-mono flex items-center space-x-2"
            >
              <span className="font-semibold text-cyan-300">{t.name}</span>
              <span className="text-slate-400 text-[10px]">({t.desc})</span>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* PROTOTYPE DISCLAIMER */}
      {/* ============================================================ */}
      <section className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start space-x-3 text-xs text-slate-400">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-300">Prototype Disclaimer: </span>
          This project uses quantum simulation on classical computing hardware. A physical quantum computer is not required for this demonstration.
        </div>
      </section>
    </div>
  );
};
