import React, { createContext, useContext, useState, useEffect } from 'react';
import { SimulationRun } from './types';
import { executeSimulation, fetchHealth } from './api';

interface SimulationContextType {
  activeRun: SimulationRun | null;
  setActiveRun: (run: SimulationRun) => void;
  isBackendOnline: boolean;
  checkBackendHealth: () => Promise<void>;
  isLoading: boolean;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRun, setActiveRun] = useState<SimulationRun | null>(null);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const checkBackendHealth = async () => {
    try {
      await fetchHealth();
      setIsBackendOnline(true);
    } catch {
      setIsBackendOnline(false);
    }
  };

  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 12000);
    return () => clearInterval(interval);
  }, []);

  // Initialize with a default baseline simulation if none exists
  useEffect(() => {
    if (!activeRun) {
      setIsLoading(true);
      executeSimulation({
        message: 'Transfer ₹10,000 to Alice',
        sender_id: 'Alice_001',
        recipient_id: 'Bob_001',
        txn_id: 'TXN-1042',
        mode: 'normal',
        shots: 1000,
        anomaly_threshold: 0.05,
      })
        .then((run) => {
          setActiveRun(run);
          setIsBackendOnline(true);
        })
        .catch((err) => {
          console.warn('Initial seed run failed, backend might be starting up:', err);
          setIsBackendOnline(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  return (
    <SimulationContext.Provider
      value={{
        activeRun,
        setActiveRun,
        isBackendOnline,
        checkBackendHealth,
        isLoading,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const ctx = useContext(SimulationContext);
  if (!ctx) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return ctx;
};
