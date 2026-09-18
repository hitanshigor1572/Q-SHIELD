import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Overview } from './pages/Overview';
import { Dashboard } from './pages/Dashboard';
import { SimulationLab } from './pages/SimulationLab';
import { QuantumAnalysis } from './pages/QuantumAnalysis';
import { Calculations } from './pages/Calculations';
import { Results } from './pages/Results';
import { Methodology } from './pages/Methodology';
import { SimulationProvider } from './SimulationContext';

export const App: React.FC = () => {
  return (
    <SimulationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Overview />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="simulation" element={<SimulationLab />} />
            <Route path="quantum-analysis" element={<QuantumAnalysis />} />
            <Route path="calculations" element={<Calculations />} />
            <Route path="results" element={<Results />} />
            <Route path="methodology" element={<Methodology />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SimulationProvider>
  );
};

export default App;
