import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Terminal,
  Key,
  Play,
  Shield,
  AlertTriangle,
  Radio,
  Clock,
  CheckCircle2,
  ArrowRight,
  EyeOff,
  Cpu,
  RefreshCw,
  Hash,
} from 'lucide-react';
import { generateDigitalSignature, executeSimulation } from '../api';
import { useSimulation } from '../SimulationContext';
import { SignatureGenerationResponse } from '../types';

export const SimulationLab: React.FC = () => {
  const navigate = useNavigate();
  const { setActiveRun } = useSimulation();

  // Section A State
  const [message, setMessage] = useState('Transfer ₹10,000 to Alice');
  const [senderId, setSenderId] = useState('Alice_001');
  const [recipientId, setRecipientId] = useState('Bob_001');
  const [txnId, setTxnId] = useState('TXN-1042');
  const [sigData, setSigData] = useState<SignatureGenerationResponse | null>(null);
  const [isGeneratingSig, setIsGeneratingSig] = useState(false);

  // Section B State
  const [mode, setMode] = useState<'normal' | 'attack'>('normal');
  const [attackScenario, setAttackScenario] = useState<
    'forgery' | 'impersonation' | 'replay' | 'unauthorized' | 'channel_interference'
  >('replay');

  // Section C State
  const [shots, setShots] = useState(1000);
  const [threshold, setThreshold] = useState(0.05);
  const [nonce, setNonce] = useState('NONCE-' + Math.random().toString(16).substring(2, 10).toUpperCase());
  const [sessionId, setSessionId] = useState('SES-' + Math.random().toString(16).substring(2, 10).toUpperCase());

  // Execution Progress State
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionStep, setExecutionStep] = useState<number>(0);
  const [executionComplete, setExecutionComplete] = useState<boolean>(false);

  const stepsList = [
    'Preparing signature',
    'Creating Bell pair',
    'Running teleportation',
    'Applying correction',
    'Collecting measurements',
    'Analyzing statistics',
    'Running threat detection',
  ];

  const handleGenerateSignature = async () => {
    setIsGeneratingSig(true);
    try {
      const res = await generateDigitalSignature(message, senderId);
      setSigData(res);
      setNonce(res.nonce);
      setSessionId(res.session_id);
    } catch (err) {
      console.error('Signature generation error:', err);
    } finally {
      setIsGeneratingSig(false);
    }
  };

  const handleRunSimulation = async () => {
    setIsExecuting(true);
    setExecutionStep(0);
    setExecutionComplete(false);

    // Progressive step animation for realistic demonstration
    for (let i = 0; i < stepsList.length; i++) {
      setExecutionStep(i);
      await new Promise((r) => setTimeout(r, 280));
    }

    try {
      const run = await executeSimulation({
        message,
        sender_id: senderId,
        recipient_id: recipientId,
        txn_id: txnId,
        signature_hex: sigData?.signature_hex,
        nonce,
        session_id: sessionId,
        mode,
        attack_scenario: mode === 'attack' ? attackScenario : undefined,
        shots,
        anomaly_threshold: threshold,
      });

      setActiveRun(run);
      setExecutionComplete(true);
    } catch (err) {
      console.error('Simulation execution failed:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* ============================================================ */}
      {/* SECTION A: SIMULATION INPUT */}
      {/* ============================================================ */}
      <section className="p-6 rounded-2xl bg-[#0E1522] border border-slate-800 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
              SECTION A
            </span>
            <h2 className="text-base font-semibold text-white tracking-wide">
              Simulation Input & Cryptographic Signature
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">ECDSA-P256</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Transaction Message
            </label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-hidden focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Transaction ID
            </label>
            <input
              type="text"
              value={txnId}
              onChange={(e) => setTxnId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-hidden focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Sender ID
            </label>
            <input
              type="text"
              value={senderId}
              onChange={(e) => setSenderId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-hidden focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Recipient ID
            </label>
            <input
              type="text"
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-hidden focus:border-cyan-500 font-mono"
            />
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={handleGenerateSignature}
            disabled={isGeneratingSig}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-800/60 text-xs font-mono font-semibold transition-all active:scale-[0.98]"
          >
            <Key className="w-4 h-4 text-cyan-400" />
            <span>{isGeneratingSig ? 'Signing Payload...' : 'Generate Digital Signature'}</span>
          </button>

          {sigData && (
            <div className="flex-1 min-w-[280px] p-3 rounded-lg bg-slate-950 border border-slate-800/90 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                <span>Signature Status: <strong className="text-emerald-400">{sigData.status}</strong></span>
                <span className="text-slate-400">FP: {sigData.public_key_fingerprint}</span>
              </div>
              <div className="text-slate-300 truncate">
                Signature: <span className="text-cyan-300">{sigData.signature_hex.substring(0, 16)}...{sigData.signature_hex.substring(sigData.signature_hex.length - 16)}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION B: SIMULATION MODE */}
      {/* ============================================================ */}
      <section className="p-6 rounded-2xl bg-[#0E1522] border border-slate-800 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
              SECTION B
            </span>
            <h2 className="text-base font-semibold text-white tracking-wide">
              Simulation Mode & Attack Injection
            </h2>
          </div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-amber-950/40 border border-amber-800/50 text-[11px] text-amber-300 font-mono">
            <EyeOff className="w-3.5 h-3.5" />
            <span>Attack scenario is hidden from the Detection Engine.</span>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 max-w-xs">
          <button
            onClick={() => setMode('normal')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              mode === 'normal'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Normal Test
          </button>
          <button
            onClick={() => setMode('attack')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              mode === 'attack'
                ? 'bg-rose-950 text-rose-300 border border-rose-800 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Attack Simulation
          </button>
        </div>

        {mode === 'normal' ? (
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs text-slate-300">
            <span className="font-semibold text-emerald-400">Normal Test Mode: </span>
            A legitimate transaction with authentic digital signature, fresh nonce, and pristine quantum Bell-state transmission.
          </div>
        ) : (
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-300">
              Select Attack Vector to Inject into Observables:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { id: 'forgery', label: 'Signature Forgery', desc: 'Corrupts signature bytes to test elliptic-curve verification check.' },
                { id: 'impersonation', label: 'Impersonation', desc: 'Signs with unauthorized key while claiming legitimate identity.' },
                { id: 'replay', label: 'Replay Attack', desc: 'Reuses previous nonce and transaction ID from history cache.' },
                { id: 'unauthorized', label: 'Unauthorized Verification', desc: 'Attempts verification with an entity lacking access privileges.' },
                { id: 'channel_interference', label: 'Channel Interference', desc: 'Injects quantum channel phase noise to exceed TVD threshold.' },
              ].map((sc) => (
                <div
                  key={sc.id}
                  onClick={() => setAttackScenario(sc.id as any)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    attackScenario === sc.id
                      ? 'bg-rose-950/30 border-rose-500/80 text-white shadow-xs'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-200">{sc.label}</span>
                    <input
                      type="radio"
                      checked={attackScenario === sc.id}
                      onChange={() => setAttackScenario(sc.id as any)}
                      className="accent-rose-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{sc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ============================================================ */}
      {/* SECTION C: SIMULATION CONFIGURATION */}
      {/* ============================================================ */}
      <section className="p-6 rounded-2xl bg-[#0E1522] border border-slate-800 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
              SECTION C
            </span>
            <h2 className="text-base font-semibold text-white tracking-wide">
              Quantum Simulator & Session Configuration
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Qiskit Aer</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Quantum Shots
            </label>
            <input
              type="number"
              value={shots}
              onChange={(e) => setShots(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-hidden focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Anomaly Threshold
            </label>
            <input
              type="number"
              step="0.01"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-hidden focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Generated Nonce
            </label>
            <input
              type="text"
              readOnly
              value={nonce}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 cursor-not-allowed text-[11px]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Session ID
            </label>
            <input
              type="text"
              readOnly
              value={sessionId}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 cursor-not-allowed text-[11px]"
            />
          </div>
        </div>

        {/* EXECUTION TRIGGER & PROGRESS */}
        <div className="pt-3 space-y-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRunSimulation}
              disabled={isExecuting}
              className={`inline-flex items-center space-x-2.5 px-6 py-3 rounded-lg font-bold text-sm transition-all shadow-lg active:scale-[0.98] ${
                isExecuting
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isExecuting ? 'SIMULATION IN PROGRESS...' : 'RUN SIMULATION'}</span>
            </button>

            {executionComplete && (
              <button
                onClick={() => navigate('/results')}
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
              >
                <span>View Result</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* PROGRESS STEP INDICATOR */}
          {(isExecuting || executionComplete) && (
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">Execution Status:</span>
                <span className="text-cyan-400 font-mono font-bold">
                  {executionComplete ? 'Completed Successfully' : `Step ${executionStep + 1} of ${stepsList.length}`}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                {stepsList.map((step, idx) => {
                  const isCurrent = isExecuting && executionStep === idx;
                  const isDone = executionComplete || executionStep > idx;
                  return (
                    <div
                      key={step}
                      className={`p-2.5 rounded-lg border text-center transition-all ${
                        isCurrent
                          ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 font-bold scale-[1.02]'
                          : isDone
                          ? 'bg-slate-900 border-slate-800 text-slate-300'
                          : 'bg-slate-950/40 border-slate-900 text-slate-600'
                      }`}
                    >
                      <div className="text-[10px] font-mono text-slate-400 mb-1">
                        0{idx + 1}
                      </div>
                      <div className="text-[11px] font-medium truncate">{step}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
