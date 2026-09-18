"""
Q-SHIELD: Quantum-Inspired Cyber Threat Detection for Digital Signature Security
Data models and schemas
"""
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field


class SignatureGenerationRequest(BaseModel):
    message: str = Field(default="Transfer ₹10,000 to Alice")
    sender_id: str = Field(default="Alice_001")


class SignatureGenerationResponse(BaseModel):
    message: str
    sender_id: str
    signature_hex: str
    public_key_fingerprint: str
    timestamp: str
    algorithm: str = "ECDSA-secp256r1-SHA256"
    nonce: str
    session_id: str
    status: str = "Generated"


class SimulationRequest(BaseModel):
    message: str = Field(default="Transfer ₹10,000 to Alice")
    sender_id: str = Field(default="Alice_001")
    recipient_id: str = Field(default="Bob_001")
    txn_id: str = Field(default="TXN-1042")
    signature_hex: Optional[str] = None
    nonce: Optional[str] = None
    session_id: Optional[str] = None
    mode: str = Field(default="normal")  # "normal" | "attack"
    # IMPORTANT: attack_scenario is ONLY used by the Attack Simulator
    # to inject observable anomalies. The Detection Engine NEVER sees this.
    attack_scenario: Optional[str] = None  # "forgery" | "impersonation" | "replay" | "unauthorized" | "channel_interference"
    shots: int = Field(default=1000, ge=100, le=10000)
    anomaly_threshold: float = Field(default=0.05, ge=0.001, le=0.5)


class ObservableConditions(BaseModel):
    """
    Observable features provided to the Detection Engine.
    Notice this schema does NOT contain any attack label or scenario name.
    """
    signature_valid: bool
    signature_error_detail: Optional[str] = None
    identity_matched: bool
    identity_error_detail: Optional[str] = None
    nonce_status: str  # "NEW" | "REUSED"
    session_status: str  # "VALID" | "DUPLICATE"
    authorized: bool
    authorization_error_detail: Optional[str] = None
    quantum_tvd_score: float
    quantum_threshold: float
    quantum_threshold_exceeded: bool
    observed_probabilities: Dict[str, float]
    expected_probabilities: Dict[str, float]


class PauliCorrectionEntry(BaseModel):
    measurement: str
    correction: str


class QuantumStateTelemetry(BaseModel):
    circuit_diagram_text: str
    total_shots: int
    counts: Dict[str, int]
    observed_probabilities: Dict[str, float]
    expected_probabilities: Dict[str, float]
    pauli_corrections: List[PauliCorrectionEntry]
    tvd_anomaly_score: float
    threshold: float
    threshold_exceeded: bool
    channel_interference_detected: bool


class CalculationStepDetail(BaseModel):
    step_number: int
    step_name: str
    formula: str
    description: str
    data: Any


class DetectionResult(BaseModel):
    status: str  # "LEGITIMATE" | "THREAT_DETECTED"
    classification: str  # e.g., "Replay Attack", "Signature Forgery", "Legitimate Transaction"
    evidence_score: float  # e.g., 92.0 (percentage, 0-100)
    evidence_checklist: List[Dict[str, Any]]
    why_detected_points: List[str]


class SimulationRun(BaseModel):
    simulation_id: str
    timestamp: str
    input_summary: Dict[str, Any]
    observables: ObservableConditions
    quantum: QuantumStateTelemetry
    calculations: List[CalculationStepDetail]
    detection: DetectionResult
    # Stored strictly for system audit/test comparison; never passed to detection engine
    hidden_attack_scenario: Optional[str] = None


class RecentSimulationItem(BaseModel):
    id: str
    timestamp: str
    scenario_result: str
    status: str
    anomaly_score: float
    evidence_score: float


class ThreatDistributionItem(BaseModel):
    category: str
    count: int
    percentage: float


class DashboardStats(BaseModel):
    total_simulations: int
    legitimate_count: int
    threat_count: int
    avg_anomaly_score: float
    recent_simulations: List[RecentSimulationItem]
    threat_distribution: List[ThreatDistributionItem]
    history_trend: List[Dict[str, Any]]
