"""
Q-SHIELD Calculation Engine
Generates explicit, explainable mathematical steps matching backend computations.
"""
from typing import List, Dict, Any
from .models import (
    CalculationStepDetail,
    QuantumStateTelemetry,
    ObservableConditions,
    DetectionResult,
)


def generate_calculation_steps(
    quantum: QuantumStateTelemetry,
    observables: ObservableConditions,
    detection: DetectionResult,
) -> List[CalculationStepDetail]:
    steps: List[CalculationStepDetail] = []

    # ----------------------------------------------------
    # STEP 1: Measurement Probability
    # ----------------------------------------------------
    shots = quantum.total_shots
    step1_rows = []
    for state in ["00", "01", "10", "11"]:
        cnt = quantum.counts.get(state, 0)
        prob = quantum.observed_probabilities.get(state, 0.0)
        step1_rows.append({
            "state": state,
            "count": cnt,
            "total_shots": shots,
            "fraction": f"{cnt}/{shots}",
            "probability": prob,
            "percentage": f"{prob * 100:.1f}%",
        })

    steps.append(
        CalculationStepDetail(
            step_number=1,
            step_name="Quantum State Measurement Probabilities",
            formula="P(s) = \\frac{\\text{count}(s)}{N_{\\text{shots}}}",
            description="Normalized relative frequency distribution of the two-qubit Bell correlation register across all simulation shots.",
            data={"rows": step1_rows, "total_shots": shots},
        )
    )

    # ----------------------------------------------------
    # STEP 2: Expected vs Observed Deviation
    # ----------------------------------------------------
    step2_rows = []
    for state in ["00", "01", "10", "11"]:
        obs = quantum.observed_probabilities.get(state, 0.0)
        exp = quantum.expected_probabilities.get(state, 0.0)
        dev = abs(obs - exp)
        step2_rows.append({
            "state": state,
            "expected_prob": exp,
            "expected_pct": f"{exp * 100:.1f}%",
            "observed_prob": obs,
            "observed_pct": f"{obs * 100:.1f}%",
            "absolute_deviation": round(dev, 4),
            "deviation_pct": f"{dev * 100:.2f}%",
        })

    steps.append(
        CalculationStepDetail(
            step_number=2,
            step_name="Statewise Empirical Deviation",
            formula="\\Delta(s) = |P_{\\text{observed}}(s) - P_{\\text{expected}}(s)|",
            description="Elementwise absolute difference between observed quantum teleportation counts and ideal theoretical Bell projection.",
            data={"rows": step2_rows},
        )
    )

    # ----------------------------------------------------
    # STEP 3: Anomaly Score (Total Variation Distance)
    # ----------------------------------------------------
    tvd_terms = []
    total_abs_diff = 0.0
    for state in ["00", "01", "10", "11"]:
        dev = abs(
            quantum.observed_probabilities.get(state, 0.0)
            - quantum.expected_probabilities.get(state, 0.0)
        )
        total_abs_diff += dev
        tvd_terms.append(f"|{quantum.observed_probabilities.get(state, 0.0):.3f} - {quantum.expected_probabilities.get(state, 0.0):.3f}|")

    steps.append(
        CalculationStepDetail(
            step_number=3,
            step_name="Total Variation Distance (TVD) Anomaly Metric",
            formula="\\delta_{\\text{TV}}(P, Q) = \\frac{1}{2} \\sum_{s \\in \\{00, 01, 10, 11\\}} |P_{\\text{observed}}(s) - P_{\\text{expected}}(s)|",
            description="The Total Variation Distance quantifies the maximal statistical distance between probability distributions, bounded within [0, 1].",
            data={
                "tvd_score": quantum.tvd_anomaly_score,
                "tvd_pct": f"{quantum.tvd_anomaly_score * 100:.2f}%",
                "sum_absolute_diff": round(total_abs_diff, 4),
                "calculation_expansion": f"0.5 * ({' + '.join(tvd_terms)}) = {quantum.tvd_anomaly_score:.4f}",
            },
        )
    )

    # ----------------------------------------------------
    # STEP 4: Threshold Comparison
    # ----------------------------------------------------
    exceeded = quantum.tvd_anomaly_score > quantum.threshold
    comparison_str = (
        f"{quantum.tvd_anomaly_score * 100:.2f}% > {quantum.threshold * 100:.1f}%"
        if exceeded
        else f"{quantum.tvd_anomaly_score * 100:.2f}% <= {quantum.threshold * 100:.1f}%"
    )
    decision_text = (
        "Quantum channel anomaly detected: TVD exceeds security threshold."
        if exceeded
        else "Quantum channel integrity verified: TVD within acceptable noise floor."
    )

    steps.append(
        CalculationStepDetail(
            step_number=4,
            step_name="Quantum Security Threshold Evaluation",
            formula="\\text{Anomaly Flag} = \\begin{cases} 1 & \\text{if } \\delta_{\\text{TV}} > \\tau \\\\ 0 & \\text{otherwise} \\end{cases}",
            description="Comparison of the empirical TVD anomaly score against the pre-configured tolerance threshold tau.",
            data={
                "anomaly_score": quantum.tvd_anomaly_score,
                "threshold": quantum.threshold,
                "comparison": comparison_str,
                "exceeded": exceeded,
                "status_label": "THRESHOLD_EXCEEDED" if exceeded else "WITHIN_TOLERANCE",
                "conclusion": decision_text,
            },
        )
    )

    # ----------------------------------------------------
    # STEP 5: Classical Security Verification Evidence
    # ----------------------------------------------------
    classical_rows = [
        {
            "check": "ECDSA Digital Signature Verification",
            "evaluated_property": "Cryptographic authenticity & message integrity",
            "result": "PASS" if observables.signature_valid else "FAIL",
            "status_code": "VALID" if observables.signature_valid else "CORRUPTED",
            "detail": observables.signature_error_detail or "Signature mathematically valid",
        },
        {
            "check": "Signer Identity & Certificate Match",
            "evaluated_property": "Public key certificate bindings",
            "result": "PASS" if observables.identity_matched else "FAIL",
            "status_code": "MATCHED" if observables.identity_matched else "MISMATCH",
            "detail": observables.identity_error_detail or "Sender identity matches key registry",
        },
        {
            "check": "Cryptographic Nonce Freshness",
            "evaluated_property": "Replay cache membership",
            "result": "PASS" if observables.nonce_status == "NEW" else "ALERT",
            "status_code": observables.nonce_status,
            "detail": "Fresh single-use nonce" if observables.nonce_status == "NEW" else "Reused nonce found in cache",
        },
        {
            "check": "Session State Validation",
            "evaluated_property": "Active transaction session tracking",
            "result": "PASS" if observables.session_status == "VALID" else "ALERT",
            "status_code": observables.session_status,
            "detail": "Unique session token" if observables.session_status == "VALID" else "Duplicate session token detected",
        },
        {
            "check": "Authorization Policy Clearance",
            "evaluated_property": "Access control matrix privileges",
            "result": "PASS" if observables.authorized else "FAIL",
            "status_code": "AUTHORIZED" if observables.authorized else "UNAUTHORIZED",
            "detail": observables.authorization_error_detail or "Requester has operational privileges",
        },
    ]

    steps.append(
        CalculationStepDetail(
            step_number=5,
            step_name="Classical Security Layer Assessment",
            formula="C_{\\text{classical}} = \\bigwedge_{i=1}^5 (V_i == \\text{True})",
            description="Evaluation of classical digital signature, identity binding, replay freshness, and authorization boundaries.",
            data={"rows": classical_rows},
        )
    )

    # ----------------------------------------------------
    # STEP 6: Final Detection Engine Inference
    # ----------------------------------------------------
    inference_matrix = [
        {"indicator": "Signature Verification", "state": "PASS" if observables.signature_valid else "FAIL", "severity": "NORMAL" if observables.signature_valid else "CRITICAL"},
        {"indicator": "Identity Certificate", "state": "PASS" if observables.identity_matched else "FAIL", "severity": "NORMAL" if observables.identity_matched else "CRITICAL"},
        {"indicator": "Nonce Replay Status", "state": observables.nonce_status, "severity": "NORMAL" if observables.nonce_status == "NEW" else "CRITICAL"},
        {"indicator": "Session Duplication", "state": observables.session_status, "severity": "NORMAL" if observables.session_status == "VALID" else "CRITICAL"},
        {"indicator": "Authorization Matrix", "state": "PASS" if observables.authorized else "FAIL", "severity": "NORMAL" if observables.authorized else "HIGH"},
        {"indicator": "Quantum Channel Anomaly", "state": "ALERT" if observables.quantum_threshold_exceeded else "PASS", "severity": "HIGH" if observables.quantum_threshold_exceeded else "NORMAL"},
    ]

    steps.append(
        CalculationStepDetail(
            step_number=6,
            step_name="Autonomous Detection Engine Inference",
            formula="\\mathcal{D}(\\mathbf{O}) \\to (\\text{Classification}, \\text{EvidenceScore})",
            description="Independent inference engine evaluates observable vector O without access to developer test labels.",
            data={
                "matrix": inference_matrix,
                "decision": detection.classification,
                "verdict": detection.status,
                "evidence_score": f"{detection.evidence_score}%",
                "notes": "Detection engine classified this strictly based on observable indicators.",
            },
        )
    )

    return steps
