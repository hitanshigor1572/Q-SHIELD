import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Shield,
  Activity,
  Cpu,
  Calculator,
  FileCheck2,
  BookOpen,
  Menu,
  X,
  Radio,
  Terminal,
  Layers,
} from 'lucide-react';
import { useSimulation } from '../SimulationContext';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Overview', path: '/', icon: Shield },
  { name: 'Dashboard', path: '/dashboard', icon: Activity },
  { name: 'Simulation', path: '/simulation', icon: Terminal },
  { name: 'Quantum Analysis', path: '/quantum-analysis', icon: Cpu },
  { name: 'Calculations', path: '/calculations', icon: Calculator },
  { name: 'Results', path: '/results', icon: FileCheck2 },
  { name: 'Methodology', path: '/methodology', icon: BookOpen },
];

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  '/': {
    title: 'Quantum-Inspired Cyber Threat Detection',
    subtitle: 'An explainable simulation framework combining digital-signature verification with quantum-state analysis.',
  },
  '/dashboard': {
    title: 'Security Operations & Telemetry Dashboard',
    subtitle: 'High-level real-time monitoring and historical anomaly distribution across simulation runs.',
  },
  '/simulation': {
    title: 'Simulation Lab',
    subtitle: 'Interactive test bench to generate digital signatures and execute observable attack scenarios.',
  },
  '/quantum-analysis': {
    title: 'Quantum State & Protocol Analysis',
    subtitle: 'Detailed inspection of Bell-state entanglement, teleportation protocol, and measurement telemetry.',
  },
  '/calculations': {
    title: 'Mathematical Calculations & Evidence Matrix',
    subtitle: 'Transparent step-by-step probability distributions, TVD anomaly metric, and inference logic.',
  },
  '/results': {
    title: 'Security Analysis & Threat Verdict',
    subtitle: 'Final classification verdict, calibrated evidence score, and audit-ready security conclusions.',
  },
  '/methodology': {
    title: 'Technical Whitepaper & System Methodology',
    subtitle: 'Comprehensive architectural breakdown and theoretical foundations for cybersecurity evaluation.',
  },
};

export const Layout: React.FC = () => {
  const location = useLocation();
  const { isBackendOnline, activeRun } = useSimulation();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const currentMeta = PAGE_META[location.pathname] || {
    title: 'Qubit Crew Security Console',
    subtitle: 'Quantum-inspired cyber threat detection system',
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#070A0F] text-slate-100 font-sans">
      {/* ============================================================ */}
      {/* DESKTOP PERSISTENT LEFT SIDEBAR */}
      {/* ============================================================ */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0B0F17] border-r border-slate-800/80 select-none z-30">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-white shadow-sm shadow-cyan-900/30">
              <Shield className="w-5 h-5 text-cyan-200" />
            </div>
            <div>
              <div className="text-lg font-bold tracking-wider text-white flex items-center gap-1.5 font-mono">
                Qubit Crew
              </div>
              <div className="text-xs text-cyan-400/80 font-medium tracking-wide">
                Quantum Security Lab
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
            Main Navigation
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-md text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-cyan-950/50 text-cyan-400 border border-cyan-800/60 font-semibold shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Active Simulation Quick Indicator */}
        {activeRun && (
          <div className="px-4 py-3 mx-3 mb-3 rounded-md bg-slate-900/90 border border-slate-800 text-xs">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center justify-between">
              <span>Active Session</span>
              <span className="font-mono text-cyan-400">{activeRun.simulation_id}</span>
            </div>
            <div className="mt-1 flex items-center justify-between font-mono">
              <span className="text-slate-300 truncate max-w-[100px]">{activeRun.input_summary.txn_id}</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  activeRun.detection.status === 'LEGITIMATE'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                    : 'bg-rose-950 text-rose-400 border border-rose-800/60'
                }`}
              >
                {activeRun.detection.status === 'LEGITIMATE' ? 'PASS' : 'ALERT'}
              </span>
            </div>
          </div>
        )}

        {/* Bottom Sidebar Status */}
        <div className="p-4 border-t border-slate-800/80 bg-[#090D14] text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">System Status</span>
            <span
              className={`inline-flex items-center text-[11px] font-medium ${
                isBackendOnline ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full mr-1.5 ${
                  isBackendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              {isBackendOnline ? 'Online' : 'Reconnecting'}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400 truncate">
            ● Simulation Engine Online
          </div>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* MOBILE DRAWER */}
      {/* ============================================================ */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative flex flex-col w-72 bg-[#0B0F17] border-r border-slate-800 p-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Shield className="w-6 h-6 text-cyan-400" />
                <span className="font-bold font-mono tracking-wider">Qubit Crew</span>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 py-4 space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-3 py-2.5 rounded text-sm ${
                        isActive
                          ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-800/80 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800/60'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
            <div className="pt-4 border-t border-slate-800 text-xs text-slate-400">
              ● Simulation Engine Online
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MAIN CONTENT AREA */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP BAR */}
        <header className="h-16 px-6 bg-[#0B0F17] border-b border-slate-800/80 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center space-x-4 min-w-0">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden p-1.5 text-slate-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-base font-semibold text-white truncate tracking-tight">
                {currentMeta.title}
              </h1>
              <p className="text-xs text-slate-400 truncate hidden sm:block">
                {currentMeta.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            {activeRun && (
              <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-xs font-mono">
                <span className="text-slate-400">Active:</span>
                <span className="text-cyan-400 font-medium">{activeRun.simulation_id}</span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-300">{activeRun.input_summary.txn_id}</span>
              </div>
            )}
            <div className="flex items-center space-x-2 px-2.5 py-1 rounded bg-slate-900/90 border border-slate-800 text-xs">
              <Radio className={`w-3 h-3 ${isBackendOnline ? 'text-emerald-400' : 'text-amber-400 animate-pulse'}`} />
              <span className="text-slate-300 font-mono text-[11px] hidden sm:inline">
                {isBackendOnline ? 'AER SIMULATOR ACTIVE' : 'CONNECTING...'}
              </span>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT ROUTER OUTLET */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#070A0F]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
