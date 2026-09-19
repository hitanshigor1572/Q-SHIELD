import {
  SimulationRequest,
  SimulationRun,
  SignatureGenerationResponse,
  DashboardStats,
} from './types';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

export async function fetchHealth(): Promise<{ status: string; service: string }> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Failed to reach backend engine');
  return res.json();
}

export async function generateDigitalSignature(
  message: string,
  sender_id: string
): Promise<SignatureGenerationResponse> {
  const res = await fetch(`${API_BASE}/signature/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sender_id }),
  });
  if (!res.ok) throw new Error('Signature generation failed');
  return res.json();
}

export async function executeSimulation(req: SimulationRequest): Promise<SimulationRun> {
  const res = await fetch(`${API_BASE}/simulation/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error('Simulation execution failed');
  return res.json();
}

export async function fetchSimulation(simId: string): Promise<SimulationRun> {
  const res = await fetch(`${API_BASE}/simulation/${simId}`);
  if (!res.ok) throw new Error(`Simulation ${simId} not found`);
  return res.json();
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${API_BASE}/dashboard/stats`);
  if (!res.ok) throw new Error('Failed to fetch dashboard statistics');
  return res.json();
}
