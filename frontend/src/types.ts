export interface SignatureGenerationResponse {
  message: string;
  sender_id: string;
  signature_hex: string;
  public_key_fingerprint: string;
  timestamp: string;
  algorithm: string;
  nonce: string;
  session_id: string;
  status: string;
}

export interface SimulationRequest {
  message: string;
  sender_id: string;
  recipient_id: string;
  txn_id: string;
  signature_hex?: string;
  nonce?: string;
  session_id?: string;
  mode: 'normal' | 'attack';
  attack_scenario?: 'forgery' | 'impersonation' | 'replay' | 'unauthorized' | 'channel_interference';
  shots: number;
  anomaly_threshold: number;
}

export interface ObservableConditions {
  signature_valid: boolean;
  signature_error_detail?: string | null;
  identity_matched: boolean;
  identity_error_detail?: string | null;
  nonce_status: 'NEW' | 'REUSED';
  session_status: 'VALID' | 'DUPLICATE';
  authorized: boolean;
  authorization_error_detail?: string | null;
  quantum_tvd_score: number;
  quantum_threshold: number;
  quantum_threshold_exceeded: boolean;
  observed_probabilities: Record<string, number>;
  expected_probabilities: Record<string, number>;
}

export interface PauliCorrectionEntry {
  measurement: string;
  correction: string;
}

export interface QuantumStateTelemetry {
  circuit_diagram_text: string;
  total_shots: number;
  counts: Record<string, number>;
  observed_probabilities: Record<string, number>;
  expected_probabilities: Record<string, number>;
  pauli_corrections: PauliCorrectionEntry[];
  tvd_anomaly_score: number;
  threshold: number;
  threshold_exceeded: boolean;
  channel_interference_detected: boolean;
}

export interface CalculationStepDetail {
  step_number: number;
  step_name: string;
  formula: string;
  description: string;
  data: any;
}

export interface EvidenceChecklistItem {
  name: string;
  passed: boolean;
  detail: string;
}

export interface DetectionResult {
  status: 'LEGITIMATE' | 'THREAT_DETECTED';
  classification: string;
  evidence_score: number;
  evidence_checklist: EvidenceChecklistItem[];
  why_detected_points: string[];
}

export interface SimulationRun {
  simulation_id: string;
  timestamp: string;
  input_summary: {
    message: string;
    sender_id: string;
    recipient_id: string;
    txn_id: string;
    nonce: string;
    session_id: string;
    signature_hex: string;
    mode: string;
    shots: number;
    threshold: number;
  };
  observables: ObservableConditions;
  quantum: QuantumStateTelemetry;
  calculations: CalculationStepDetail[];
  detection: DetectionResult;
  hidden_attack_scenario?: string | null;
}

export interface RecentSimulationItem {
  id: string;
  timestamp: string;
  scenario_result: string;
  status: string;
  anomaly_score: number;
  evidence_score: number;
}

export interface ThreatDistributionItem {
  category: string;
  count: number;
  percentage: number;
}

export interface DashboardStats {
  total_simulations: number;
  legitimate_count: number;
  threat_count: number;
  avg_anomaly_score: number;
  recent_simulations: RecentSimulationItem[];
  threat_distribution: ThreatDistributionItem[];
  history_trend: Array<{
    index: number;
    sim_id: string;
    anomaly_score: number;
    threshold: number;
    status: string;
  }>;
}
