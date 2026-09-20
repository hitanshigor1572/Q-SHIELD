# Qubit Crew: Quantum-Inspired Cyber Threat Detection for Digital Signature Security

A research-grade, explainable cybersecurity prototype combining classical digital signature verification (ECDSA over secp256r1 with SHA-256) with quantum Bell-state entanglement, quantum teleportation protocol simulation, and statistical anomaly detection (Total Variation Distance).

> **Important Prototype Disclaimer:**  
> This platform uses quantum simulation executed on classical computing hardware via **Qiskit Aer**. It is a proof-of-concept research simulation platform; a physical quantum computer is not required.

---

## 1. Architectural Overview & Separation of Concerns

```
                          ┌────────────────────────┐
                          │   React + TS Frontend  │
                          │   (7 Research Pages)   │
                          └───────────┬────────────┘
                                      │ HTTP REST API
                          ┌───────────▼────────────┐
                          │    FastAPI Backend     │
                          └───────────┬────────────┘
                                      │
               ┌──────────────────────┴──────────────────────┐
               ▼                                             ▼
    ┌──────────────────────┐                     ┌──────────────────────┐
    │ Classical Crypto     │                     │ Quantum Simulator    │
    │ (ECDSA, SHA-256)     │                     │ (Qiskit Aer, 3-Qubit)│
    └──────────┬───────────┘                     └──────────┬───────────┘
               │                                            │
               └──────────────────────┬─────────────────────┘
                                      │
                       ┌──────────────▼──────────────┐
                       │  Observable Conditions       │
                       │  (NO attack labels leaked!) │
                       └──────────────┬──────────────┘
                                      │
                       ┌──────────────▼──────────────┐
                       │  Autonomous Detection Engine │
                       │  (Infers pattern & evidence) │
                       └──────────────┬──────────────┘
                                      │
                       ┌──────────────▼──────────────┐
                       │  Security Analysis Verdict  │
                       └─────────────────────────────┘
```

### Critical Security Design Principle
The **Attack Simulator** injects observable conditions (e.g., duplicate transaction IDs, reused nonces, mutated signature bytes, mismatched sender public keys, or quantum channel noise). The **Detection Engine NEVER receives the attack scenario label**. It independently inspects the observable evidence tuple and derives the classification and calibrated evidence score.

---

## 2. Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, React Router v7, Lucide React, Recharts
- **Backend**: Python 3.13, FastAPI, Uvicorn, Pydantic v2
- **Quantum Simulation**: Qiskit 2.5, Qiskit Aer 0.17 (`AerSimulator`)
- **Classical Cryptography**: Python `cryptography` library (ECDSA secp256r1, SHA-256)
- **Data & Statistical Processing**: NumPy, SciPy, Pandas

---

## 3. Dedicated Pages

| Page | Path | Focus |
|---|---|---|
| **Overview** | `/` | Project introduction, 5-step horizontal pipeline, threat vector explanations, technology tags, prototype disclaimers. |
| **Dashboard** | `/dashboard` | High-level operations monitoring: Total simulations, Legitimate vs Threats, Average anomaly score, Chronological TVD trend with 5% threshold line, Threat distribution chart, Recent simulation history. |
| **Simulation Lab** | `/simulation` | Interactive testbed: Section A (Message, Sender, Recipient, Txn ID, Generate Signature); Section B (Normal Test vs Attack Simulator with hidden scenario injection); Section C (Shots, Threshold, Nonce, Session ID, and animated 7-step execution progress). |
| **Quantum Analysis** | `/quantum-analysis` | Strictly quantum evidence: Interactive teleportation circuit diagram, Qiskit ASCII view, 6-step protocol, Pauli correction table (`00→I`, `01→X`, `10→Z`, `11→XZ`), Shot distribution table, Expected vs Observed visual bar chart, Quantum TVD anomaly metric. |
| **Calculations** | `/calculations` | Step-by-step mathematical derivations: Step 1 (Measurement probabilities \(P(s) = n/N\)), Step 2 (Elementwise deviation), Step 3 (Total Variation Distance formula expansion), Step 4 (Threshold comparison), Step 5 (Classical checks matrix), Step 6 (Final autonomous inference logic). |
| **Results** | `/results` | High-impact security verdict: `LEGITIMATE` (Green) or `THREAT DETECTED` (Red), Classified threat title, Evidence score %, concise evidence checklist, Quantum anomaly callout, and "Why was this detected?" bullet points. |
| **Methodology** | `/methodology` | 12 technical whitepaper sections designed for hackathon judges detailing mathematical and architectural foundations. |

---

## 4. Running the Application

### Option A: Unified Full-Stack Server (Recommended)
Runs both the FastAPI backend and serves the compiled React production application on port 8000:

```bash
# In the project root directory:
python run_server.py
```
Open **http://127.0.0.1:8000** in your browser.

### Option B: Development Mode (Hot Reload)
Terminal 1 (Backend):
```bash
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```
Open **http://localhost:3000** in your browser.

---

## 5. Judge Demonstration Flow

Follow this step-by-step walkthrough to present the project to hackathon judges:

1. **Open Home (`/`)**:
   - Introduce the project title: *"Quantum-Inspired Cyber Threat Detection for Digital Signature Security"*.
   - Point out the 5-step horizontal architecture and the prototype disclaimer.
2. **Click "Launch Simulation" (`/simulation`)**:
   - Review Section A: Keep default transaction or enter custom message (e.g., `Transfer ₹10,000 to Alice`).
   - Click **Generate Digital Signature**; note the generated ECDSA-P256 signature and public key fingerprint (private keys remain secure).
3. **Execute Normal Simulation**:
   - Keep "Normal Test" selected in Section B.
   - Click **RUN SIMULATION**; observe the 7-step progressive execution pipeline.
   - Click **View Result** (`/results`); demonstrate the large **LEGITIMATE** green verdict with 98.5% Evidence Score.
4. **Inspect Quantum Analysis (`/quantum-analysis`)**:
   - Explain the 3-qubit circuit: state preparation on \(q_0\), Bell pair on \(q_1, q_2\), Bell measurement, and Pauli corrections.
   - Show the Pauli table: `00→I`, `01→X`, `10→Z`, `11→XZ`.
   - Point out that observed Bell states (|00⟩ and |11⟩ at ~50% each) yield a TVD score of ~1.2%, well below the 5.0% threshold.
5. **Inspect Calculations (`/calculations`)**:
   - Walk through Steps 1 to 4: Demonstrate how \(P(s)\), elementwise deviations, and Total Variation Distance are computed with exact math matching the backend code.
   - Walk through Step 5 (Classical checks) and Step 6 (Final detection logic).
6. **Execute Hidden Attack Simulation (`/simulation`)**:
   - Return to Simulation Lab.
   - Switch to **Attack Simulation** tab.
   - Notice the prominent badge: *"Attack scenario is hidden from the Detection Engine."*
   - Select **Replay Attack** (or **Channel Interference**, **Signature Forgery**, etc.).
   - Click **RUN SIMULATION**.
7. **Demonstrate Threat Detection (`/results`)**:
   - Show the **THREAT DETECTED** red verdict with classified pattern: `Replay Attack` and ~92% Evidence Score.
   - Review the concise evidence checklist (e.g., Nonce reused = FLAGGED, Duplicate transaction detected).
   - Review the "Why was this detected?" bullet points.
8. **Demonstrate Channel Interference Test**:
   - Run an attack simulation with **Channel Interference**.
   - Show how the quantum TVD score spikes to ~8.2%–15.0%, exceeding the 5.0% threshold, and raising a `Quantum / Channel Interference` alert.
9. **Review Dashboard (`/dashboard`)**:
   - Show the aggregated metrics (Total simulations, Legitimate vs Threats, Avg anomaly score).
   - Point out the Anomaly Score trend line with the 5.0% threshold reference line and threat distribution breakdown.
10. **Review Methodology (`/methodology`)**:
    - Direct judges to the 12 technical whitepaper sections detailing problem statement, Bell entanglement, teleportation mathematics, Pauli gates, and real-world limitations.
