import React from 'react';
import {
  BookOpen,
  Shield,
  Layers,
  Cpu,
  Radio,
  FileCheck,
  AlertTriangle,
  ChevronDown,
  Info,
  Scale,
  GitBranch,
} from 'lucide-react';

export const Methodology: React.FC = () => {
  const sections = [
    {
      id: 'sec-1',
      title: '1. Problem Statement',
      content: (
        <p>
          Classical digital signatures (such as RSA-PSS and ECDSA) mathematically guarantee message integrity and non-repudiation across classical communication channels. However, classical signatures cannot detect physical medium tampering, channel eavesdropping, or quantum-channel state alterations. Furthermore, vulnerabilities such as replay attacks, key theft/impersonation, and unauthorized verification require independent verification layers. This research explores a hybrid, quantum-inspired detection architecture that couples cryptographic digital signature verification with quantum teleportation state analysis.
        </p>
      ),
    },
    {
      id: 'sec-2',
      title: '2. Existing Digital Signature Flow',
      content: (
        <p>
          Standard public-key infrastructure (PKI) relies entirely on classical computational assumptions. A sender computes a cryptographic hash (e.g., SHA-256) of a message \(m\), encrypts the digest with their private key \(d\), and transmits \((m, \sigma)\). The verifier computes \(H(m)\) and validates \(\sigma\) using public key \(Q\). While computationally resilient against passive forgery, this process contains no stateful physics-based feedback to evaluate the physical integrity of the transmission link or detect active adversary interception.
        </p>
      ),
    },
    {
      id: 'sec-3',
      title: '3. Proposed Architecture',
      content: (
        <div>
          <p className="mb-4">
            Our framework introduces an auxiliary quantum-inspired detection layer. The transaction hash is mapped to quantum state amplitudes, while an entangled Einstein-Podolsky-Rosen (EPR) Bell pair is distributed between transmission endpoints. Teleportation protocols execute across this channel, and deviations in the received quantum distribution serve as high-sensitivity anomaly indicators.
          </p>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
            <div>Sender → Message → Hash / Digital Signature → Authentication</div>
            <div className="text-cyan-400">  ↓ Quantum Verification Layer</div>
            <div>Bell Pair (|Φ⁺⟩) → Quantum Teleportation → Pauli Correction → Measurement</div>
            <div className="text-cyan-400">  ↓ Observable Telemetry</div>
            <div>Statistical Analysis (TVD) + Classical Checks → Autonomous Detection Engine → Security Verdict</div>
          </div>
        </div>
      ),
    },
    {
      id: 'sec-4',
      title: '4. Bell-State Entanglement',
      content: (
        <p>
          Entangled Bell states exhibit non-local quantum correlations. We prepare the maximally entangled Bell state:
          <span className="block my-2 text-cyan-300 font-mono text-center">
            |Φ⁺⟩ = (|00⟩ + |11⟩) / √2
          </span>
          This is achieved on classical hardware via Qiskit Aer by applying a Hadamard gate to qubit \(q_1\) followed by a Controlled-NOT (CNOT) gate targeting qubit \(q_2\). In an undisturbed environment, projective measurements on the two qubits in the computational basis yield strictly identical outcomes: 50% for |00⟩ and 50% for |11⟩.
        </p>
      ),
    },
    {
      id: 'sec-5',
      title: '5. Quantum Teleportation',
      content: (
        <p>
          Quantum teleportation transmits an unknown quantum state |ψ⟩ without moving the physical particle itself. The protocol uses the shared Bell pair and 2 classical communication bits. Alice performs a joint Bell-state measurement on |ψ⟩ (qubit \(q_0\)) and her half of the Bell pair (\(q_1\)), projecting them into one of the four Bell states and transferring the quantum state information to Bob's qubit \(q_2\) up to a known unitary Pauli transformation.
        </p>
      ),
    },
    {
      id: 'sec-6',
      title: '6. Pauli Corrections',
      content: (
        <div>
          <p className="mb-3">
            To reconstruct the exact state |ψ⟩, Bob must apply a specific Pauli correction gate based on Alice's classical measurement outcome (c0, c1):
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left font-mono border-collapse border border-slate-800">
              <thead>
                <tr className="bg-slate-900 text-slate-300">
                  <th className="p-2 border border-slate-800">Measurement (c0, c1)</th>
                  <th className="p-2 border border-slate-800">Pauli Operator</th>
                  <th className="p-2 border border-slate-800">Transformation Applied</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr><td className="p-2 text-cyan-300">00</td><td className="p-2 text-white">I</td><td className="p-2 text-slate-400">Identity (No correction required)</td></tr>
                <tr><td className="p-2 text-cyan-300">01</td><td className="p-2 text-white">X</td><td className="p-2 text-slate-400">Bit Flip: |0⟩ ↔ |1⟩</td></tr>
                <tr><td className="p-2 text-cyan-300">10</td><td className="p-2 text-white">Z</td><td className="p-2 text-slate-400">Phase Flip: |1⟩ → -|1⟩</td></tr>
                <tr><td className="p-2 text-cyan-300">11</td><td className="p-2 text-white">XZ</td><td className="p-2 text-slate-400">Combined Bit and Phase Flip</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      id: 'sec-7',
      title: '7. Quantum Measurement',
      content: (
        <p>
          Qiskit Aer simulates repetitive projective measurements across N = 1000 experimental shots. Measurement collapses the wavefunction, yielding empirical count distributions n(s) for basis states s &isin; &#123;00, 01, 10, 11&#125;. Measurement probabilities are calculated as P_obs(s) = n(s) / N.
        </p>
      ),
    },
    {
      id: 'sec-8',
      title: '8. Statistical Analysis (Total Variation Distance)',
      content: (
        <div>
          <p className="mb-2">
            To quantify deviation from the ideal entangled state, we implement the Total Variation Distance (TVD):
          </p>
          <div className="p-3 my-2 rounded-lg bg-slate-950 font-mono text-center text-cyan-300 text-xs">
            TVD(P_obs, P_exp) = 0.5 × Σ |P_obs(x) - P_exp(x)|
          </div>
          <p>
            TVD is bounded strictly between 0 and 1. Under normal channel conditions, finite-sampling shot noise produces TVD values under 1.8%. When noise, depolarizing distortion, or eavesdropping is introduced, TVD spikes above the 5.0% security threshold, raising a quantum anomaly alarm.
          </p>
        </div>
      ),
    },
    {
      id: 'sec-9',
      title: '9. Autonomous Threat Detection',
      content: (
        <p>
          The Detection Engine operates independently as a zero-knowledge inference model. It evaluates an observable tuple:
          <span className="block my-1 font-mono text-slate-300 text-xs">
            O = (signature_valid, identity_matched, nonce_status, session_status, authorized, TVD_score)
          </span>
          By synthesizing classical cryptographic checks with quantum anomaly metrics, the engine classifies threats into Signature Forgery, Impersonation, Replay Attack, Unauthorized Verification, or Quantum Channel Interference without receiving any developer labels.
        </p>
      ),
    },
    {
      id: 'sec-10',
      title: '10. Attack Simulation & Observable Injection Model',
      content: (
        <div>
          <p className="mb-3">
            In our testing methodology, the Attack Simulator selects a test scenario and injects realistic anomalies into the observable data stream:
          </p>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300">
            Attack Simulator (scenario: "Replay")<br />
            &nbsp;&nbsp;↓ (injects reused nonce & duplicate session ID)<br />
            System Observable Stream (contains no attack label)<br />
            &nbsp;&nbsp;↓<br />
            Detection Engine (analyzes nonce_status="REUSED" → infers "Replay Attack")
          </div>
        </div>
      ),
    },
    {
      id: 'sec-11',
      title: '11. Technical Limitations',
      content: (
        <ul className="list-disc list-inside space-y-1.5 text-slate-300">
          <li>
            <strong>Classical Simulation Constraints:</strong> Quantum states are simulated classically on CPU using Qiskit Aer. Real physical quantum computers face decoherence, thermal noise, and optical fiber attenuation not present in numerical simulation.
          </li>
          <li>
            <strong>Scope of Quantum Detection:</strong> Quantum teleportation channel analysis detects physical channel interference and eavesdropping disturbance; it does not directly prevent classical replay attacks or certificate forgery, which remain the domain of classical cryptographic protocol layers.
          </li>
          <li>
            <strong>Prototype Implementation:</strong> Ephemeral keys and in-memory caches are used for demonstration purposes.
          </li>
        </ul>
      ),
    },
    {
      id: 'sec-12',
      title: '12. Future Scope',
      content: (
        <ul className="list-disc list-inside space-y-1.5 text-slate-300">
          <li>
            Integration with physical Quantum Key Distribution (QKD) hardware (e.g. BB84 or E91 protocols).
          </li>
          <li>
            Hybrid Post-Quantum Cryptography (PQC) integration with NIST-standardized algorithms (ML-KEM, ML-DSA, SLH-DSA).
          </li>
          <li>
            Continuous-variable quantum state analysis for real-time high-throughput financial transactions.
          </li>
        </ul>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0E1522] border border-slate-800 space-y-2">
        <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>System Whitepaper</span>
        </div>
        <h2 className="text-xl font-bold text-white font-sans">
          Technical Methodology & Architectural Foundations
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Comprehensive explanation of the quantum teleportation protocol, classical ECDSA integration, observable injection model, and statistical anomaly detection.
        </p>
      </div>

      {/* 12 Sections */}
      <div className="space-y-4">
        {sections.map((sec) => (
          <div
            key={sec.id}
            className="p-6 rounded-2xl bg-[#0E1522] border border-slate-800 space-y-3"
          >
            <h3 className="text-sm font-bold text-white font-sans tracking-wide">
              {sec.title}
            </h3>
            <div className="text-xs text-slate-300 leading-relaxed font-sans">
              {sec.content}
            </div>
          </div>
        ))}
      </div>

      {/* Scientific Accuracy Disclaimer */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start space-x-3 text-xs text-slate-400">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-slate-200">Scientific Integrity Notice: </span>
          <p>
            This system provides a quantum-inspired detection layer and simulation-based prototype. It demonstrates quantum protocols using classical simulation and measurement-based anomaly detection. It does not claim that quantum teleportation single-handedly solves all classical cyber attacks.
          </p>
        </div>
      </div>
    </div>
  );
};
