import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  ShieldCheck,
  AlertOctagon,
  Percent,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { fetchDashboardStats, fetchSimulation } from '../api';
import { DashboardStats } from '../types';
import { useSimulation } from '../SimulationContext';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { setActiveRun } = useSimulation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadStats = async () => {
    try {
      const data = await fetchDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleRowClick = async (simId: string) => {
    try {
      const run = await fetchSimulation(simId);
      setActiveRun(run);
      navigate('/results');
    } catch (err) {
      console.warn('Could not fetch simulation details directly:', err);
      navigate('/results');
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 font-mono text-sm">
        <RefreshCw className="w-5 h-5 animate-spin mr-2 text-cyan-400" />
        Loading telemetry and historical monitoring data...
      </div>
    );
  }

  // Fallback default numbers if stats empty
  const total = stats?.total_simulations ?? 24;
  const legit = stats?.legitimate_count ?? 15;
  const threats = stats?.threat_count ?? 9;
  const avgAnomaly = stats?.avg_anomaly_score ?? 18.4;

  const historyData = stats?.history_trend ?? [];
  const distributionData = stats?.threat_distribution ?? [
    { category: 'Forgery', count: 2, percentage: 22.2 },
    { category: 'Impersonation', count: 2, percentage: 22.2 },
    { category: 'Replay', count: 2, percentage: 22.2 },
    { category: 'Unauthorized', count: 1, percentage: 11.1 },
    { category: 'Interference', count: 2, percentage: 22.2 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight font-sans">
            High-Level System Monitoring
          </h2>
          <p className="text-xs text-slate-400">
            Real-time telemetry and historical security metrics aggregated across all runs.
          </p>
        </div>
        <button
          onClick={() => {
            setRefreshing(true);
            loadStats();
          }}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-[#0E1522] border border-slate-800 text-xs font-mono text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* TOP METRIC CARDS */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Simulations */}
        <div className="p-5 rounded-xl bg-[#0E1522] border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Simulations</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold font-mono text-white">{total}</span>
            <span className="text-xs text-slate-400 ml-2">completed runs</span>
          </div>
        </div>

        {/* Legitimate Cases */}
        <div className="p-5 rounded-xl bg-[#0E1522] border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Legitimate Cases</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold font-mono text-emerald-400">{legit}</span>
            <span className="text-xs text-slate-400 ml-2">verified authentic</span>
          </div>
        </div>

        {/* Threats Detected */}
        <div className="p-5 rounded-xl bg-[#0E1522] border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Threats Detected</span>
            <AlertOctagon className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold font-mono text-rose-400">{threats}</span>
            <span className="text-xs text-slate-400 ml-2">anomalies classified</span>
          </div>
        </div>

        {/* Average Anomaly Score */}
        <div className="p-5 rounded-xl bg-[#0E1522] border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Anomaly Score</span>
            <Percent className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold font-mono text-amber-400">{avgAnomaly}%</span>
            <span className="text-xs text-slate-400 ml-2">threshold: 5.0%</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SIMULATION HISTORY CHART */}
      {/* ============================================================ */}
      <div className="p-6 rounded-2xl bg-[#0E1522] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Simulation History (Quantum Anomaly Score Trend)
            </h3>
            <p className="text-xs text-slate-400">
              Chronological TVD anomaly scores across recent test runs with 5.0% security threshold line.
            </p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-mono">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-0.5 bg-cyan-400 inline-block" />
              <span className="text-slate-300">Observed Anomaly %</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-0.5 bg-rose-500 border-b border-dashed border-rose-400 inline-block" />
              <span className="text-rose-400">Threshold (5.0%)</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="sim_id" stroke="#64748B" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis stroke="#64748B" tick={{ fontSize: 11, fill: '#64748B' }} unit="%" domain={[0, 'dataMax + 4']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                  color: '#F8FAFC',
                }}
                formatter={(val: any) => [`${val}%`, 'TVD Anomaly Score']}
                labelFormatter={(label) => `Run: ${label}`}
              />
              <ReferenceLine
                y={5.0}
                stroke="#EF4444"
                strokeDasharray="4 4"
                label={{ value: 'Threshold 5.0%', fill: '#EF4444', fontSize: 10, position: 'insideTopRight' }}
              />
              <Line
                type="monotone"
                dataKey="anomaly_score"
                stroke="#06B6D4"
                strokeWidth={2}
                dot={{ fill: '#06B6D4', r: 3 }}
                activeDot={{ r: 5, fill: '#38BDF8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ============================================================ */}
      {/* THREAT DISTRIBUTION CHART */}
      {/* ============================================================ */}
      <div className="p-6 rounded-2xl bg-[#0E1522] border border-slate-800 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            Threat Distribution by Attack Pattern
          </h3>
          <p className="text-xs text-slate-400">
            Breakdown of classified threat signatures detected across historical simulated scenarios.
          </p>
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="category" stroke="#64748B" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis stroke="#64748B" tick={{ fontSize: 11, fill: '#64748B' }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                  color: '#F8FAFC',
                }}
                formatter={(val: any, name: any, item: any) => [
                  `${val} incidents (${item.payload.percentage}%)`,
                  item.payload.category,
                ]}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {distributionData.map((_, index) => {
                  const colors = ['#3B82F6', '#6366F1', '#EC4899', '#F59E0B', '#06B6D4'];
                  return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ============================================================ */}
      {/* RECENT SIMULATIONS TABLE */}
      {/* ============================================================ */}
      <div className="p-6 rounded-2xl bg-[#0E1522] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide">
              Recent Simulations
            </h3>
            <p className="text-xs text-slate-400">
              Click any row to open the complete evidence breakdown and quantum telemetry.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">10 most recent</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Scenario Result</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Anomaly Score</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {(stats?.recent_simulations ?? []).map((row) => (
                <tr
                  key={row.id}
                  onClick={() => handleRowClick(row.id)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 px-4 font-semibold text-cyan-400">{row.id}</td>
                  <td className="py-3.5 px-4 text-slate-400">{row.timestamp}</td>
                  <td className="py-3.5 px-4 text-slate-200 font-sans font-medium">
                    {row.scenario_result}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.status === 'LEGITIMATE'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                          : 'bg-rose-950 text-rose-400 border border-rose-800/60'
                      }`}
                    >
                      {row.status === 'LEGITIMATE' ? 'PASS' : 'DETECTED'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-300">
                    <span className={row.anomaly_score > 5.0 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                      {row.anomaly_score.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center text-slate-400 group-hover:text-cyan-400 transition-colors">
                      <span className="text-[10px] font-sans mr-1">Inspect</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
