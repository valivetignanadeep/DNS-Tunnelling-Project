import React, { useState } from "react";
import Charts from "./Charts";
import ThreatTable from "./ThreatTable";
import AnomalyCharts from "./AnomalyCharts";
import TrafficChart from "./WaveChart";
import TerminalConsole from "./TerminalConsole";
import PacketLogTable from "./PacketLogTable";
import { ShieldCheck, Activity, ShieldAlert, Skull, BrainCircuit, Database } from "lucide-react";

const Dashboard = ({ results, activeTab }) => {
    if (!results) {
        return (
            <div className="ml-64 p-8 bg-[#020617] min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Awaiting Analysis Payload...</p>
                </div>
            </div>
        );
    }

    // results is now guaranteed to be an object
    const data = results;
    const anomalies = results ? results.results : [];
    const logs = results ? results.logs : [];
    const allQueries = results ? results.allQueries : [];

    return (
        <div className="dashboard-container ml-64 p-8 bg-[#020617] min-h-screen text-slate-200">
            <header className="mb-10 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <span className="p-2 bg-blue-600/20 rounded-lg border border-blue-500/30">
                            <ShieldCheck className="w-6 h-6 text-blue-500" />
                        </span>
                        Security Intelligence <span className="text-blue-500 font-mono text-sm opacity-50">/ {activeTab.toUpperCase()}</span>
                    </h1>
                </div>
                {data && (
                    <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-xl border border-slate-800/50 backdrop-blur-sm">
                        <div className="flex items-center gap-2 px-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                            <span className="text-xs font-mono font-bold text-slate-400">CORE STATUS: STABLE</span>
                        </div>
                    </div>
                )}
            </header>

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group border border-slate-800/50">
                            <div className="relative z-10">
                                <h3 className="text-slate-500 text-[10px] font-mono font-bold mb-2 tracking-[0.2em]">NETWORK.TOTAL_QUERIES</h3>
                                <p className="text-4xl font-bold text-white font-mono group-hover:text-blue-500 transition-colors">
                                    {data?.totalQueries?.toLocaleString() || 0}
                                </p>
                            </div>
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Activity className="w-16 h-16" />
                            </div>
                        </div>

                        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group border border-slate-800/50">
                            <div className="relative z-10">
                                <h3 className="text-slate-500 text-[10px] font-mono font-bold mb-2 tracking-[0.2em]">SECURITY.POTENTIAL_ANOMALIES</h3>
                                <p className="text-4xl font-bold text-white font-mono group-hover:text-amber-500 transition-colors">
                                    {data?.suspicious?.toLocaleString() || 0}
                                </p>
                            </div>
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <ShieldAlert className="w-16 h-16" />
                            </div>
                        </div>

                        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group border border-slate-800/50">
                            <div className="relative z-10">
                                <h3 className="text-slate-500 text-[10px] font-mono font-bold mb-2 tracking-[0.2em]">SECURITY.CONFIRMED_THREATS</h3>
                                <p className="text-4xl font-bold text-white font-mono group-hover:text-rose-500 transition-colors">
                                    {data?.threats?.toLocaleString() || 0}
                                </p>
                            </div>
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Skull className="w-16 h-16" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        <div className="lg:col-span-2 space-y-8">
                            <TrafficChart data={data?.volumeTrend} />
                            <TerminalConsole logs={logs} />
                        </div>
                        <div className="glass-card p-6 rounded-2xl border border-slate-800/50">
                            <h3 className="text-white text-sm font-bold mb-6 flex items-center">
                                <span className="w-1.5 h-4 bg-blue-500 rounded-full mr-3"></span>
                                Distribution Logic
                            </h3>
                            <Charts data={data} />
                        </div>
                    </div>
                </div>
            )}

            {/* ANALYSIS TAB */}
            {activeTab === 'analysis' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-8">
                        <div className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-2xl mb-8 flex items-start gap-6">
                            <div className="p-3 bg-blue-500/10 rounded-xl">
                                <BrainCircuit className="w-8 h-8 text-blue-500" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white mb-2 tracking-tight">Lexical Analysis Engine</h2>
                                <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                                    Detailed Breakdown of DNS query patterns. Our engine analyzes entropy (randomness), character frequency distribution, and structural anomalies to detect hidden tunneling channels.
                                </p>
                            </div>
                        </div>
                        <AnomalyCharts results={anomalies} />
                    </div>
                </div>
            )}

            {/* INCIDENTS TAB */}
            {activeTab === 'incidents' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <ThreatTable data={anomalies} />
                </div>
            )}

            {/* TRAFFIC TAB */}
            {activeTab === 'traffic' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-8">
                        <div className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-2xl mb-8 flex items-start gap-6">
                            <div className="p-3 bg-blue-500/10 rounded-xl">
                                <Database className="w-8 h-8 text-blue-500" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white mb-2 tracking-tight">Full Traffic Inspector</h2>
                                <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                                    Comprehensive log of every parsed DNS packet. Use this to audit legitimate traffic patterns and verify the context of detected anomalies.
                                </p>
                            </div>
                        </div>
                        <PacketLogTable data={allQueries} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
