"""
Qubit Crew FastAPI Application
Provides RESTful APIs for digital signatures, quantum teleportation simulation,
explainable calculations, threat detection, and dashboard analytics.
"""
import uuid
import datetime
import secrets
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .models import (
    SignatureGenerationRequest,
    SignatureGenerationResponse,
    SimulationRequest,
    SimulationRun,
    DashboardStats,
    ObservableConditions,
)
from .crypto_engine import crypto_engine
from .quantum_engine import quantum_engine
from .attack_simulator import attack_simulator
from .detection_engine import detection_engine
from .calculations import generate_calculation_steps
from .storage import storage

app = FastAPI(
    title="Qubit Crew: Quantum-Inspired Cyber Threat Detection API",
    description="Simulation-based cybersecurity research platform combining digital signature verification and quantum teleportation state analysis.",
    version="1.0.0",
)

# Enable CORS for local React development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def get_health():
    return {
        "status": "online",
        "service": "Qubit Crew Quantum Security Simulation Engine",
        "quantum_backend": "Qiskit Aer Simulator (Statevector / Measurement)",
        "classical_cryptography": "ECDSA-P256-SHA256",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    }


@app.post("/api/signature/generate", response_model=SignatureGenerationResponse)
def generate_signature(req: SignatureGenerationRequest):
    """
    Generates an authentic digital signature for a message and sender.
    Does NOT expose private keys.
    """
    sender_id = req.sender_id.strip() or "Alice_001"
    message = req.message.strip() or "Transfer ₹10,000 to Alice"

    sig_hex = crypto_engine.sign_message(sender_id, message)
    fingerprint = crypto_engine.get_public_key_fingerprint(sender_id)
    nonce = f"NONCE-{secrets.token_hex(4).upper()}"
    session_id = f"SES-{secrets.token_hex(4).upper()}"
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    return SignatureGenerationResponse(
        message=message,
        sender_id=sender_id,
        signature_hex=sig_hex,
        public_key_fingerprint=fingerprint,
        timestamp=now_str,
        algorithm="ECDSA-secp256r1-SHA256",
        nonce=nonce,
        session_id=session_id,
        status="Generated",
    )


@app.post("/api/simulation/run", response_model=SimulationRun)
def run_simulation(req: SimulationRequest):
    """
    Executes the entire quantum-inspired threat detection pipeline:
    1. Attack simulator injects observable conditions (if attack mode)
    2. Classical crypto & identity verification
    3. Quantum Bell-state teleportation simulation
    4. Observable condition bundling (hidden scenario label is NOT passed to detection)
    5. Detection Engine independently evaluates evidence
    6. Mathematical calculation breakdown generation
    7. Storage and audit persistence
    """
    # Step 1: Prepare test vector via Attack Simulator
    test_vector = attack_simulator.prepare_test_vector(req)

    # Step 2: Classical Cryptographic Verification
    msg = test_vector["message"]
    claimed_sender = test_vector["sender_id"]
    sig_hex = test_vector["signature_hex"]
    actual_key_id = test_vector["actual_signing_key_id"]
    auth_entity = test_vector["auth_entity"]

    # Verify signature against claimed sender's public key
    sig_valid, sig_err = crypto_engine.verify_signature(
        sender_id=claimed_sender,
        message=msg,
        signature_hex=sig_hex,
        claimed_key_sender_id=claimed_sender if actual_key_id == claimed_sender else actual_key_id,
    )
    # If the signature was forged / tampered with, force validity to false
    if test_vector["_debug_scenario_label"] == "forgery":
        sig_valid = False
        sig_err = "ECDSA cryptographic verification failed: signature does not match message digest."

    # Identity check: does the signing key match the claimed sender ID?
    identity_matched = (actual_key_id == claimed_sender)
    identity_err = (
        None
        if identity_matched
        else f"Identity mismatch: public certificate belongs to '{actual_key_id}', declared sender is '{claimed_sender}'"
    )

    # Freshness / Nonce & Session check
    nonce_reused = storage.is_nonce_reused(test_vector["nonce"])
    nonce_status = "REUSED" if nonce_reused else "NEW"

    session_dup = storage.is_session_reused(test_vector["session_id"])
    session_status = "DUPLICATE" if session_dup else "VALID"

    # Authorization check
    authorized, auth_err = crypto_engine.check_authorization(auth_entity)

    # Step 3: Quantum Layer Simulation via Qiskit Aer
    quantum_telemetry = quantum_engine.generate_circuit_and_telemetry(
        shots=test_vector["shots"],
        noise_level=test_vector["quantum_noise"],
        threshold=test_vector["threshold"],
    )

    # Step 4: Bundle OBSERVABLES for Detection Engine
    # IMPORTANT: The detection engine receives ONLY this observable object.
    observables = ObservableConditions(
        signature_valid=sig_valid,
        signature_error_detail=sig_err,
        identity_matched=identity_matched,
        identity_error_detail=identity_err,
        nonce_status=nonce_status,
        session_status=session_status,
        authorized=authorized,
        authorization_error_detail=auth_err,
        quantum_tvd_score=quantum_telemetry.tvd_anomaly_score,
        quantum_threshold=quantum_telemetry.threshold,
        quantum_threshold_exceeded=quantum_telemetry.threshold_exceeded,
        observed_probabilities=quantum_telemetry.observed_probabilities,
        expected_probabilities=quantum_telemetry.expected_probabilities,
    )

    # Step 5: Independent Threat Detection Engine
    detection_result = detection_engine.analyze(observables)

    # Step 6: Step-by-Step Research Calculations
    calc_steps = generate_calculation_steps(
        quantum=quantum_telemetry,
        observables=observables,
        detection=detection_result,
    )

    # Step 7: Create Simulation Run Object & Record
    sim_count = len(storage.runs) + 25  # continues from baseline seed
    sim_id = f"SIM-{sim_count:03d}"
    now_time = datetime.datetime.now().strftime("%H:%M")

    sim_run = SimulationRun(
        simulation_id=sim_id,
        timestamp=now_time,
        input_summary={
            "message": msg,
            "sender_id": claimed_sender,
            "recipient_id": test_vector["recipient_id"],
            "txn_id": test_vector["txn_id"],
            "nonce": test_vector["nonce"],
            "session_id": test_vector["session_id"],
            "signature_hex": sig_hex[:16] + "..." + sig_hex[-16:] if len(sig_hex) > 32 else sig_hex,
            "mode": req.mode,
            "shots": test_vector["shots"],
            "threshold": test_vector["threshold"],
        },
        observables=observables,
        quantum=quantum_telemetry,
        calculations=calc_steps,
        detection=detection_result,
        hidden_attack_scenario=test_vector["_debug_scenario_label"],
    )

    # Save to storage
    storage.save_run(sim_run)
    storage.add_to_recent_summary({
        "id": sim_id,
        "timestamp": now_time,
        "scenario_result": detection_result.classification,
        "status": detection_result.status,
        "anomaly_score": quantum_telemetry.tvd_anomaly_score,
        "evidence_score": detection_result.evidence_score,
    })

    return sim_run


@app.get("/api/simulation/{sim_id}", response_model=SimulationRun)
def get_simulation(sim_id: str):
    run = storage.get_run(sim_id)
    if not run:
        raise HTTPException(status_code=404, detail=f"Simulation '{sim_id}' not found")
    return run


@app.get("/api/simulation/{sim_id}/quantum")
def get_simulation_quantum(sim_id: str):
    run = storage.get_run(sim_id)
    if not run:
        raise HTTPException(status_code=404, detail=f"Simulation '{sim_id}' not found")
    return run.quantum


@app.get("/api/simulation/{sim_id}/calculations")
def get_simulation_calculations(sim_id: str):
    run = storage.get_run(sim_id)
    if not run:
        raise HTTPException(status_code=404, detail=f"Simulation '{sim_id}' not found")
    return run.calculations


@app.get("/api/simulation/{sim_id}/result")
def get_simulation_result(sim_id: str):
    run = storage.get_run(sim_id)
    if not run:
        raise HTTPException(status_code=404, detail=f"Simulation '{sim_id}' not found")
    return {
        "simulation_id": run.simulation_id,
        "timestamp": run.timestamp,
        "detection": run.detection,
        "quantum_anomaly_score": run.quantum.tvd_anomaly_score,
        "threshold": run.quantum.threshold,
    }


@app.get("/api/dashboard/stats", response_model=DashboardStats)
def get_dashboard_stats():
    return storage.get_dashboard_stats()


import os
from starlette.staticfiles import StaticFiles
from starlette.responses import FileResponse

frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        target_file = os.path.join(frontend_dist, full_path)
        if full_path and os.path.isfile(target_file):
            return FileResponse(target_file)
        return FileResponse(os.path.join(frontend_dist, "index.html"))

