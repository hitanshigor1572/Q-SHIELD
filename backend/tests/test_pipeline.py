"""
Unit tests for Qubit Crew Backend
Validates crypto, quantum engine, attack simulator, and detection engine.
"""
from app.models import SimulationRequest
from app.main import run_simulation, generate_signature, SignatureGenerationRequest
from app.storage import storage


def test_signature_generation():
    req = SignatureGenerationRequest(message="Transfer ₹10,000 to Alice", sender_id="Alice_001")
    res = generate_signature(req)
    assert res.signature_hex is not None
    assert len(res.signature_hex) > 20
    assert res.public_key_fingerprint.startswith("FP-") or len(res.public_key_fingerprint) > 5
    assert res.status == "Generated"


def test_normal_legitimate_simulation():
    req = SimulationRequest(
        message="Transfer ₹10,000 to Alice",
        sender_id="Alice_001",
        recipient_id="Bob_001",
        txn_id="TXN-TEST-01",
        mode="normal",
        shots=1000,
        anomaly_threshold=0.05,
    )
    sim = run_simulation(req)
    assert sim.detection.status == "LEGITIMATE"
    assert sim.detection.classification == "Legitimate Transaction"
    assert sim.observables.signature_valid is True
    assert sim.observables.identity_matched is True
    assert sim.observables.nonce_status == "NEW"
    assert sim.quantum.tvd_anomaly_score < 0.05
    assert sim.detection.evidence_score >= 90.0


def test_forgery_attack_simulation():
    req = SimulationRequest(
        message="Transfer ₹10,000 to Alice",
        sender_id="Alice_001",
        mode="attack",
        attack_scenario="forgery",
        shots=1000,
    )
    sim = run_simulation(req)
    assert sim.detection.status == "THREAT_DETECTED"
    assert "Forgery" in sim.detection.classification
    assert sim.observables.signature_valid is False


def test_impersonation_attack_simulation():
    req = SimulationRequest(
        message="Transfer ₹10,000 to Alice",
        sender_id="Alice_001",
        mode="attack",
        attack_scenario="impersonation",
        shots=1000,
    )
    sim = run_simulation(req)
    assert sim.detection.status == "THREAT_DETECTED"
    assert "Impersonation" in sim.detection.classification
    assert sim.observables.identity_matched is False


def test_replay_attack_simulation():
    req = SimulationRequest(
        message="Transfer ₹10,000 to Alice",
        sender_id="Alice_001",
        mode="attack",
        attack_scenario="replay",
        shots=1000,
    )
    sim = run_simulation(req)
    assert sim.detection.status == "THREAT_DETECTED"
    assert "Replay" in sim.detection.classification
    assert sim.observables.nonce_status == "REUSED" or sim.observables.session_status == "DUPLICATE"


def test_unauthorized_verification_simulation():
    req = SimulationRequest(
        message="Transfer ₹10,000 to Alice",
        sender_id="Alice_001",
        mode="attack",
        attack_scenario="unauthorized",
        shots=1000,
    )
    sim = run_simulation(req)
    assert sim.detection.status == "THREAT_DETECTED"
    assert "Unauthorized" in sim.detection.classification
    assert sim.observables.authorized is False


def test_channel_interference_simulation():
    req = SimulationRequest(
        message="Transfer ₹10,000 to Alice",
        sender_id="Alice_001",
        mode="attack",
        attack_scenario="channel_interference",
        shots=1000,
        anomaly_threshold=0.05,
    )
    sim = run_simulation(req)
    assert sim.detection.status == "THREAT_DETECTED"
    assert "Interference" in sim.detection.classification or "Channel" in sim.detection.classification
    assert sim.quantum.tvd_anomaly_score > 0.05
    assert sim.quantum.threshold_exceeded is True


if __name__ == "__main__":
    test_signature_generation()
    test_normal_legitimate_simulation()
    test_forgery_attack_simulation()
    test_impersonation_attack_simulation()
    test_replay_attack_simulation()
    test_unauthorized_verification_simulation()
    test_channel_interference_simulation()
    print("All backend tests passed successfully!")
