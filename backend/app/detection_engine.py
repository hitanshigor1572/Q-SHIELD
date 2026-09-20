"""
Qubit Crew Independent Threat Detection Engine
Evaluates ONLY raw observable conditions.
Does NOT receive or depend on attack scenario labels.
"""
from typing import List, Dict, Any, Tuple
from .models import ObservableConditions, DetectionResult


class DetectionEngine:
    """
    Independently classifies cyber threats based strictly on observable evidence.
    """

    def analyze(self, obs: ObservableConditions) -> DetectionResult:
        evidence_checklist: List[Dict[str, Any]] = []
        why_points: List[str] = []
        threats_found: List[str] = []

        # 1. Classical Digital Signature Check
        if obs.signature_valid:
            evidence_checklist.append({
                "name": "Digital Signature Integrity",
                "passed": True,
                "detail": "ECDSA-P256 cryptographic signature verified successfully over message digest",
            })
        else:
            evidence_checklist.append({
                "name": "Digital Signature Integrity",
                "passed": False,
                "detail": obs.signature_error_detail or "Signature verification failed: digest mismatch or corrupted bytes",
            })
            threats_found.append("Signature Forgery")
            why_points.append("Cryptographic signature bytes failed mathematical verification against claimed public key.")
            why_points.append("Message payload integrity check failed (SHA-256 digest discrepancy).")

        # 2. Identity & Certificate Matching
        if obs.identity_matched:
            evidence_checklist.append({
                "name": "Signer Identity & Key Binding",
                "passed": True,
                "detail": "Public key certificate matches registered sender identity in directory",
            })
        else:
            evidence_checklist.append({
                "name": "Signer Identity & Key Binding",
                "passed": False,
                "detail": obs.identity_error_detail or "Identity mismatch: signing key belongs to another entity",
            })
            threats_found.append("Impersonation")
            why_points.append("Signer public key certificate does not match the declared transaction sender ID.")
            why_points.append("Authentication binding failed; potential untrusted party masquerading as legitimate entity.")

        # 3. Freshness & Replay Check
        nonce_reused = obs.nonce_status == "REUSED"
        session_dup = obs.session_status == "DUPLICATE"
        if not nonce_reused and not session_dup:
            evidence_checklist.append({
                "name": "Freshness & Nonce Uniqueness",
                "passed": True,
                "detail": "Cryptographic nonce and session identifier are fresh and unrecorded",
            })
        else:
            detail_msg = []
            if nonce_reused:
                detail_msg.append("Cryptographic nonce previously recorded in ledger cache")
                why_points.append("Transaction nonce was previously committed in an earlier session.")
            if session_dup:
                detail_msg.append("Transaction ID / session token duplicated")
                why_points.append("Duplicate transaction identifier detected in replay cache.")
            evidence_checklist.append({
                "name": "Freshness & Nonce Uniqueness",
                "passed": False,
                "detail": "; ".join(detail_msg),
            })
            threats_found.append("Replay Attack")
            why_points.append("Verification request matches an expired or previously executed transaction.")

        # 4. Access Authorization Policy
        if obs.authorized:
            evidence_checklist.append({
                "name": "Verification Authorization",
                "passed": True,
                "detail": "Entity possesses valid authorization privileges in security access policy",
            })
        else:
            evidence_checklist.append({
                "name": "Verification Authorization",
                "passed": False,
                "detail": obs.authorization_error_detail or "Entity lacks required access control clearance",
            })
            threats_found.append("Unauthorized Verification")
            why_points.append("Requesting identity has not been granted verification rights in the access control matrix.")
            why_points.append("Security policy violation: unauthorized transaction inspection attempt.")

        # 5. Quantum Channel & Teleportation State Anomaly
        if not obs.quantum_threshold_exceeded:
            evidence_checklist.append({
                "name": "Quantum Bell-State Fidelity",
                "passed": True,
                "detail": f"Total Variation Distance ({obs.quantum_tvd_score:.1%}) within statistical threshold ({obs.quantum_threshold:.1%})",
            })
        else:
            evidence_checklist.append({
                "name": "Quantum Bell-State Fidelity",
                "passed": False,
                "detail": f"TVD anomaly score ({obs.quantum_tvd_score:.1%}) exceeded threshold ({obs.quantum_threshold:.1%})",
            })
            threats_found.append("Channel Interference")
            why_points.append(
                f"Quantum teleportation measurement distribution deviated significantly (TVD = {obs.quantum_tvd_score:.1%})."
            )
            why_points.append(
                f"Observed Bell-state correlation violated the tolerance threshold of {obs.quantum_threshold:.1%}."
            )
            why_points.append("Statistical deviation indicates physical noise or active channel eavesdropping.")

        # Determine Final Classification and Evidence Score
        if not threats_found:
            return DetectionResult(
                status="LEGITIMATE",
                classification="Legitimate Transaction",
                evidence_score=98.5,
                evidence_checklist=evidence_checklist,
                why_detected_points=[
                    "Cryptographic signature verified successfully with standard ECDSA-P256.",
                    "Signer identity perfectly matched registered public key credentials.",
                    "Nonce and session identifier are strictly unique and fresh.",
                    "Quantum teleportation measurement distribution matches theoretical expectation within tolerance.",
                ],
            )

        # Priority resolution when multiple threats are present
        primary_classification = threats_found[0]
        if "Replay Attack" in threats_found:
            primary_classification = "Replay Attack"
        elif "Signature Forgery" in threats_found:
            primary_classification = "Signature Forgery"
        elif "Impersonation" in threats_found:
            primary_classification = "Impersonation"
        elif "Unauthorized Verification" in threats_found:
            primary_classification = "Unauthorized Verification"
        elif "Channel Interference" in threats_found:
            primary_classification = "Quantum / Channel Interference"

        # Evidence Score calculation based on observable weight
        base_score = 88.0
        if primary_classification == "Replay Attack":
            base_score = 92.0 if nonce_reused and session_dup else 89.0
        elif primary_classification == "Signature Forgery":
            base_score = 96.0
        elif primary_classification == "Impersonation":
            base_score = 94.0
        elif primary_classification == "Unauthorized Verification":
            base_score = 91.0
        elif primary_classification == "Quantum / Channel Interference":
            # Scale with TVD score
            base_score = min(99.0, 85.0 + (obs.quantum_tvd_score * 70.0))

        return DetectionResult(
            status="THREAT_DETECTED",
            classification=primary_classification,
            evidence_score=round(base_score, 1),
            evidence_checklist=evidence_checklist,
            why_detected_points=why_points[:5],
        )


detection_engine = DetectionEngine()
