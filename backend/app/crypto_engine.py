"""
Qubit Crew Classical Cryptography Engine
Simulates digital signatures using standard ECDSA over secp256r1 with SHA-256.
DO NOT use real private keys or sensitive credentials; keys here are ephemeral prototypes.
"""
import hashlib
import binascii
from typing import Tuple, Optional, Dict
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.exceptions import InvalidSignature


class CryptoEngine:
    def __init__(self):
        # Generate simulated prototype keys for entities
        self._keys: Dict[str, ec.EllipticCurvePrivateKey] = {
            "Alice_001": ec.generate_private_key(ec.SECP256R1()),
            "Bob_001": ec.generate_private_key(ec.SECP256R1()),
            "Mallory_Attacker": ec.generate_private_key(ec.SECP256R1()),
        }
        self._authorized_entities = {"Alice_001", "Bob_001"}

    def get_public_key_fingerprint(self, sender_id: str) -> str:
        if sender_id not in self._keys:
            # Generate deterministic fallback for unknown sender
            digest = hashlib.sha256(sender_id.encode()).hexdigest()
            return f"FP-{digest[:12].upper()}"
        pub = self._keys[sender_id].public_key()
        pub_bytes = pub.public_bytes(
            encoding=serialization.Encoding.DER,
            format=serialization.PublicFormat.SubjectPublicKeyInfo,
        )
        return hashlib.sha256(pub_bytes).hexdigest()[:16].upper()

    def sha256_digest(self, message: str) -> str:
        return hashlib.sha256(message.encode("utf-8")).hexdigest()

    def sign_message(self, sender_id: str, message: str) -> str:
        """Sign a message using the sender's private key with ECDSA SHA-256."""
        if sender_id not in self._keys:
            # Dynamically register new simulated user if needed
            self._keys[sender_id] = ec.generate_private_key(ec.SECP256R1())
            self._authorized_entities.add(sender_id)

        private_key = self._keys[sender_id]
        signature = private_key.sign(
            message.encode("utf-8"),
            ec.ECDSA(hashes.SHA256()),
        )
        return binascii.hexlify(signature).decode("ascii")

    def verify_signature(
        self,
        sender_id: str,
        message: str,
        signature_hex: str,
        claimed_key_sender_id: Optional[str] = None,
    ) -> Tuple[bool, Optional[str]]:
        """
        Verify a digital signature.
        claimed_key_sender_id: Key used to attempt verification (defaults to sender_id).
        Returns (is_valid, error_reason).
        """
        lookup_id = claimed_key_sender_id or sender_id
        if lookup_id not in self._keys:
            return False, f"Sender public key for '{lookup_id}' not found in registry"

        public_key = self._keys[lookup_id].public_key()
        try:
            sig_bytes = binascii.unhexlify(signature_hex)
        except Exception:
            return False, "Malformed signature encoding (invalid hex)"

        try:
            public_key.verify(
                sig_bytes,
                message.encode("utf-8"),
                ec.ECDSA(hashes.SHA256()),
            )
            return True, None
        except InvalidSignature:
            return False, "ECDSA cryptographic verification failed: signature does not match message/public key"
        except Exception as e:
            return False, f"Verification error: {str(e)}"

    def check_authorization(self, entity_id: str) -> Tuple[bool, Optional[str]]:
        """Verify access control permissions."""
        if entity_id in self._authorized_entities:
            return True, None
        return False, f"Entity '{entity_id}' lacks authorization privileges in access policy"


crypto_engine = CryptoEngine()
