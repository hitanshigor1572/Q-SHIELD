"""
Q-SHIELD: Quantum-Inspired Cyber Threat Detection
Unified Server Launcher
Runs FastAPI backend + built React frontend on http://127.0.0.1:8000
"""
import uvicorn
import os
import sys

# Ensure backend directory is in python path
backend_path = os.path.join(os.path.dirname(__file__), "backend")
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

if __name__ == "__main__":
    print("=" * 70)
    print("  Q-SHIELD: Quantum-Inspired Cyber Threat Detection Platform")
    print("  Quantum Simulator: Qiskit Aer | Classical Crypto: ECDSA-P256")
    print("  Console URL: http://127.0.0.1:8000")
    print("=" * 70)
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=False)
