"""
Q-SHIELD Attack Simulator
Simulates threat scenarios by modifying observable parameters.
CRITICAL: This module NEVER sends the attack label or scenario string
to the Detection Engine. It only produces modified observable conditions.
"""
import uuid
import secrets
from typing import Dict, Any
from .crypto_engine import crypto_engine
from .storage import storage


class AttackSimulator:
    """
    Constructs the operational parameters for a simulation run.
    In attack mode, it injects realistic anomalies into the observable data stream.
    """

    def prepare_test_vector(self, req) -> Dict[str, Any]:
        mode = req.mode
        scenario = req.attack_scenario if mode == "attack" else "normal"

        # Defaults for legitimate transactions
        message = req.message
        sender_id = req.sender_id or "Alice_001"
        recipient_id = req.recipient_id or "Bob_001"
        txn_id = req.txn_id or f"TXN-{secrets.randbelow(9000) + 1000}"
        nonce = req.nonce or f"NONCE-{secrets.token_hex(4).upper()}"
        session_id = req.session_id or f"SES-{secrets.token_hex(4).upper()}"
        auth_entity = sender_id
        quantum_noise = 0.0

        # Legitimate signature by the sender
        signature_hex = req.signature_hex or crypto_engine.sign_message(sender_id, message)
        actual_signing_key_id = sender_id

        if mode == "attack":
            if scenario == "forgery":
                # Attacker injects a corrupted / modified signature
                # Invert or corrupt trailing bytes of the hex string
                corrupted = list(signature_hex)
                corrupted[-4:] = ["F", "F", "0", "0"]
                signature_hex = "".join(corrupted)

            elif scenario == "impersonation":
                # Attacker signs the message with Mallory's key but claims it's Alice
                actual_signing_key_id = "Mallory_Attacker"
                signature_hex = crypto_engine.sign_message("Mallory_Attacker", message)

            elif scenario == "replay":
                # Attacker intercepts and replays a previously committed transaction
                nonce = "NONCE-A7B8C9D0"  # Known already-seen nonce
                session_id = "SES-ALPHA-772"  # Known already-seen session
                txn_id = "TXN-0988"  # Known already-seen transaction ID

            elif scenario == "unauthorized":
                # Requester attempts verification with an unauthorized entity ID
                auth_entity = "Mallory_Attacker"

            elif scenario == "channel_interference":
                # Environmental quantum channel noise or intercept-resend eavesdropping
                # Injects quantum phase & bit-flip perturbation
                quantum_noise = 0.24

        return {
            "message": message,
            "sender_id": sender_id,
            "recipient_id": recipient_id,
            "txn_id": txn_id,
            "nonce": nonce,
            "session_id": session_id,
            "signature_hex": signature_hex,
            "actual_signing_key_id": actual_signing_key_id,
            "auth_entity": auth_entity,
            "quantum_noise": quantum_noise,
            "shots": req.shots,
            "threshold": req.anomaly_threshold,
            # Hidden scenario label preserved ONLY for unit tests / logging;
            # Never delivered to the Detection Engine.
            "_debug_scenario_label": scenario,
        }


attack_simulator = AttackSimulator()
