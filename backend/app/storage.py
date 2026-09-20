"""
Qubit Crew Storage & Session Memory
Maintains simulation history, nonce caches, and session records in-memory.
"""
import uuid
import datetime
from typing import Dict, List, Optional, Set
from .models import SimulationRun, RecentSimulationItem, DashboardStats, ThreatDistributionItem


class SimulationStorage:
    def __init__(self):
        # Cache of previously committed nonces and transaction IDs
        self.seen_nonces: Set[str] = {
            "NONCE-A7B8C9D0",
            "NONCE-91F2E3D4",
            "NONCE-55C1B8AA",
        }
        self.seen_txns: Set[str] = {
            "TXN-0988",
            "TXN-1011",
            "TXN-1039",
        }
        self.seen_sessions: Set[str] = {
            "SES-ALPHA-772",
            "SES-BETA-409",
        }

        # Stored simulation runs
        self.runs: Dict[str, SimulationRun] = {}

        # Seed initial realistic history items so Dashboard matches spec immediately
        self._seed_baseline_history()

    def is_nonce_reused(self, nonce: str) -> bool:
        return nonce in self.seen_nonces

    def record_nonce(self, nonce: str):
        self.seen_nonces.add(nonce)

    def is_txn_reused(self, txn_id: str) -> bool:
        return txn_id in self.seen_txns

    def record_txn(self, txn_id: str):
        self.seen_txns.add(txn_id)

    def is_session_reused(self, session_id: str) -> bool:
        return session_id in self.seen_sessions

    def record_session(self, session_id: str):
        self.seen_sessions.add(session_id)

    def save_run(self, run: SimulationRun):
        self.runs[run.simulation_id] = run
        self.record_nonce(run.input_summary.get("nonce", ""))
        self.record_txn(run.input_summary.get("txn_id", ""))
        self.record_session(run.input_summary.get("session_id", ""))

    def get_run(self, simulation_id: str) -> Optional[SimulationRun]:
        return self.runs.get(simulation_id)

    def get_dashboard_stats(self) -> DashboardStats:
        total = len(self._recent_summary)
        legit = sum(1 for s in self._recent_summary if s["status"] == "LEGITIMATE")
        threats = total - legit

        avg_anomaly = (
            sum(s["anomaly_score"] for s in self._recent_summary) / max(1, total)
        )

        recent_items = [
            RecentSimulationItem(
                id=s["id"],
                timestamp=s["timestamp"],
                scenario_result=s["scenario_result"],
                status=s["status"],
                anomaly_score=round(s["anomaly_score"] * 100, 1),
                evidence_score=s["evidence_score"],
            )
            for s in self._recent_summary[:10]
        ]

        # Threat distribution
        threat_counts = {
            "Signature Forgery": 0,
            "Impersonation": 0,
            "Replay Attack": 0,
            "Unauthorized Verification": 0,
            "Channel Interference": 0,
        }
        for s in self._recent_summary:
            cat = s["scenario_result"]
            if cat in threat_counts:
                threat_counts[cat] += 1
            elif "Forger" in cat:
                threat_counts["Signature Forgery"] += 1
            elif "Impersonat" in cat:
                threat_counts["Impersonation"] += 1
            elif "Replay" in cat:
                threat_counts["Replay Attack"] += 1
            elif "Unauthor" in cat:
                threat_counts["Unauthorized Verification"] += 1
            elif "Interference" in cat or "Channel" in cat:
                threat_counts["Channel Interference"] += 1

        dist_items = [
            ThreatDistributionItem(
                category=cat,
                count=cnt,
                percentage=round((cnt / max(1, threats)) * 100, 1) if threats > 0 else 0.0,
            )
            for cat, cnt in threat_counts.items()
        ]

        # Trend over simulations
        trend = [
            {
                "index": i + 1,
                "sim_id": s["id"],
                "anomaly_score": round(s["anomaly_score"] * 100, 2),
                "threshold": 5.0,
                "status": s["status"],
            }
            for i, s in enumerate(reversed(self._recent_summary[-15:]))
        ]

        return DashboardStats(
            total_simulations=total,
            legitimate_count=legit,
            threat_count=threats,
            avg_anomaly_score=round(avg_anomaly * 100, 1),
            recent_simulations=recent_items,
            threat_distribution=dist_items,
            history_trend=trend,
        )

    def _seed_baseline_history(self):
        # 24 total simulations: 15 Legitimate, 9 Threats (as in spec example)
        self._recent_summary = [
            {"id": "SIM-024", "timestamp": "17:42", "scenario_result": "Replay Attack", "status": "THREAT_DETECTED", "anomaly_score": 0.012, "evidence_score": 92.0},
            {"id": "SIM-023", "timestamp": "17:35", "scenario_result": "Legitimate Transaction", "status": "LEGITIMATE", "anomaly_score": 0.009, "evidence_score": 98.0},
            {"id": "SIM-022", "timestamp": "17:28", "scenario_result": "Channel Interference", "status": "THREAT_DETECTED", "anomaly_score": 0.082, "evidence_score": 88.0},
            {"id": "SIM-021", "timestamp": "17:15", "scenario_result": "Signature Forgery", "status": "THREAT_DETECTED", "anomaly_score": 0.011, "evidence_score": 96.0},
            {"id": "SIM-020", "timestamp": "17:02", "scenario_result": "Legitimate Transaction", "status": "LEGITIMATE", "anomaly_score": 0.014, "evidence_score": 99.0},
            {"id": "SIM-019", "timestamp": "16:48", "scenario_result": "Impersonation", "status": "THREAT_DETECTED", "anomaly_score": 0.010, "evidence_score": 94.0},
            {"id": "SIM-018", "timestamp": "16:35", "scenario_result": "Unauthorized Verification", "status": "THREAT_DETECTED", "anomaly_score": 0.013, "evidence_score": 90.0},
            {"id": "SIM-017", "timestamp": "16:20", "scenario_result": "Legitimate Transaction", "status": "LEGITIMATE", "anomaly_score": 0.012, "evidence_score": 97.0},
            {"id": "SIM-016", "timestamp": "16:05", "scenario_result": "Legitimate Transaction", "status": "LEGITIMATE", "anomaly_score": 0.008, "evidence_score": 99.0},
            {"id": "SIM-015", "timestamp": "15:50", "scenario_result": "Replay Attack", "status": "THREAT_DETECTED", "anomaly_score": 0.011, "evidence_score": 91.0},
            {"id": "SIM-014", "timestamp": "15:35", "scenario_result": "Legitimate Transaction", "status": "LEGITIMATE", "anomaly_score": 0.015, "evidence_score": 96.0},
            {"id": "SIM-013", "timestamp": "15:20", "scenario_result": "Channel Interference", "status": "THREAT_DETECTED", "anomaly_score": 0.076, "evidence_score": 87.0},
            {"id": "SIM-012", "timestamp": "15:05", "scenario_result": "Legitimate Transaction", "status": "LEGITIMATE", "anomaly_score": 0.010, "evidence_score": 98.0},
            {"id": "SIM-011", "timestamp": "14:50", "scenario_result": "Legitimate Transaction", "status": "LEGITIMATE", "anomaly_score": 0.009, "evidence_score": 99.0},
            {"id": "SIM-010", "timestamp": "14:35", "scenario_result": "Signature Forgery", "status": "THREAT_DETECTED", "anomaly_score": 0.013, "evidence_score": 95.0},
            {"id": "SIM-009", "timestamp": "14:20", "scenario_result": "Legitimate Transaction", "status": "LEGITIMATE", "anomaly_score": 0.011, "evidence_score": 98.0},
            {"id": "SIM-008", "timestamp": "14:05", "scenario_result": "Legitimate Transaction", "status": "LEGITIMATE", "anomaly_score": 0.007, "evidence_score": 100.0},
            {"id": "SIM-007", "timestamp": "13:50", "scenario_result": "Legitimate Transaction", "status": "LEGITIMATE", "anomaly_score": 0.012, "evidence_score": 97.0},
            {"id": "SIM-006", "timestamp": "13:35", "scenario_result": "Impersonation", "status": "THREAT_DETECTED", "anomaly_score": 0.014, "evidence_score": 93.0},
            {"id": "SIM-005", "timestamp": "13:20", "scenario_result": "Legitimate Transaction", "status": "LEGITIMATE", "anomaly_score": 0.009, "evidence_score": 99.0},
            {"id": "SIM-004", "timestamp": "13:05", "scenario_result": "Legitimate Transaction", "status": "LEGITIMATE", "anomaly_score": 0.010, "evidence_score": 98.0},
            {"id": "SIM-003", "timestamp": "12:50", "scenario_result": "Legitimate Transaction", "status": "LEGITIMATE", "anomaly_score": 0.013, "evidence_score": 97.0},
            {"id": "SIM-002", "timestamp": "12:35", "scenario_result": "Legitimate Transaction", "status": "LEGITIMATE", "anomaly_score": 0.008, "evidence_score": 99.0},
            {"id": "SIM-001", "timestamp": "12:20", "scenario_result": "Legitimate Transaction", "status": "LEGITIMATE", "anomaly_score": 0.011, "evidence_score": 98.0},
        ]

    def add_to_recent_summary(self, item: dict):
        self._recent_summary.insert(0, item)


storage = SimulationStorage()
