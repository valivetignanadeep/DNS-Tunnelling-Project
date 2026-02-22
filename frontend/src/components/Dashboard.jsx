import React, { useState } from "react";
import Charts from "./Charts";
import ThreatTable from "./ThreatTable";
import AnomalyCharts from "./AnomalyCharts";
import TrafficChart from "./WaveChart";
import TerminalConsole from "./TerminalConsole";
import PacketLogTable from "./PacketLogTable";
import EngineDocs from "./EngineDocs";
import EntropyTable from "./EntropyTable";
import { ShieldCheck, Activity, ShieldAlert, Skull, BrainCircuit, Database, Download, HelpCircle, ArrowUpRight } from "lucide-react";

const Dashboard = ({ results, activeTab }) => {
    const downloadCSV = () => {
        if (!results || !results.allQueries) return;

        const data = results.allQueries;
        const headers = ["Timestamp", "Source IP", "Domain", "Status", "Risk Score"];

        const csvRows = data.map(q => [
            new Date(q.timestamp * 1000).toLocaleString(),
            q.src_ip,
            q.domain,
            q.is_anomaly ? "HIGH RISK" : "NORMAL",
            q.risk_score?.toFixed(2) || "0.00"
        ]);

        const csvContent = [
            headers.join(","),
            ...csvRows.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `DNS_SECURITY_REPORT_${new Date().getTime()}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!results) {
        return (
            <div className="ml-72 p-8 bg-[#fdfbf7] min-h-screen flex items-center justify-center">
                <div className="bg-mesh"></div>
                <div className="flex flex-col items-center gap-4 relative z-10">
                    <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-2xl animate-spin shadow-[0_4px_12px_rgba(67,56,202,0.1)]"></div>
                    <p className="text-slate-400 font-mono text-xs uppercase tracking-widest animate-pulse">Synchronizing Intelligence Payload...</p>
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
        <div className="dashboard-container ml-72 p-6 md:p-10 bg-[#fdfbf7] min-h-screen text-slate-800 relative overflow-x-hidden">
            <div className="bg-mesh"></div>

            <header className="mb-12 flex items-center justify-between relative z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-3 mb-1">
                        <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-200 rounded text-[9px] font-bold text-indigo-700 uppercase tracking-widest">Live Node</span>
                        <span className="text-slate-400 text-[10px] font-mono">ID: OPS-THREAT-2940</span>
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tighter flex items-center gap-4">
                        <span className="p-2.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                            <ShieldCheck className="w-7 h-7 text-indigo-600" />
                        </span>
                        Intelligence Dashboard
                        <span className="text-slate-300 mx-2 font-light">/</span>
                        <span className="text-indigo-600 font-mono text-sm opacity-70 tracking-widest">{activeTab.toUpperCase()}</span>
                    </h1>
                </div>

                {data && (
                    <div className="flex items-center gap-6">
                        <div className="hidden lg:flex flex-col text-right">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Engine Latency</span>
                            <span className="text-emerald-700 font-mono font-bold text-xs underline decoration-emerald-200 underline-offset-4">12ms Response</span>
                        </div>
                        <div className="h-10 w-px bg-slate-800/50"></div>
                        <button
                            onClick={downloadCSV}
                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-[11px] tracking-widest transition-all shadow-[0_4px_12px_rgba(67,56,202,0.3)] active:scale-95"
                        >
                            <Download className="w-4 h-4" />
                            EXFILTRATE LOGS [CSV]
                        </button>
                    </div>
                )}
            </header>

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Total Queries Card */}
                        <div className="enterprise-card p-8 rounded-[2rem] relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-100 shadow-sm">
                                        <Activity className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                                </div>
                                <h3 className="text-slate-500 text-[10px] font-bold mb-1 tracking-[0.25em] uppercase">Network Traffic Volume</h3>
                                <p className="text-5xl font-bold text-slate-900 tracking-tighter group-hover:text-indigo-600 transition-all">
                                    {data?.totalQueries?.toLocaleString() || 0}
                                </p>
                                <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <HelpCircle size={10} className="text-indigo-600" />
                                    <span className="text-[9px] text-slate-400 italic">Total DNS packets parsed in the current session.</span>
                                </div>
                            </div>
                        </div>

                        {/* Anomalies Card */}
                        <div className="enterprise-card p-8 rounded-[2rem] relative overflow-hidden group border-amber-500/20">
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20">
                                        <ShieldAlert className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <div className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[8px] font-bold rounded border border-amber-500/20">WARNING</div>
                                </div>
                                <h3 className="text-slate-500 text-[10px] font-bold mb-1 tracking-[0.25em] uppercase">Detected Anomalies</h3>
                                <p className="text-5xl font-bold text-white tracking-tighter group-hover:text-amber-400 transition-all">
                                    {data?.suspicious?.toLocaleString() || 0}
                                </p>
                                <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <HelpCircle size={10} className="text-amber-500" />
                                    <span className="text-[9px] text-slate-500 italic">Deviations from normal entropy/structure baseline.</span>
                                </div>
                            </div>
                        </div>

                        {/* Threats Card */}
                        <div className="enterprise-card p-8 rounded-[2rem] relative overflow-hidden group border-rose-500/20">
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-100 shadow-sm">
                                        <Skull className="w-5 h-5 text-rose-600" />
                                    </div>
                                    <div className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[8px] font-bold rounded border border-rose-100 animate-pulse uppercase tracking-widest">Critical</div>
                                </div>
                                <h3 className="text-slate-500 text-[10px] font-bold mb-1 tracking-[0.25em] uppercase">Confirmed Threats</h3>
                                <p className="text-5xl font-bold text-slate-900 tracking-tighter group-hover:text-rose-600 transition-all">
                                    {data?.threats?.toLocaleString() || 0}
                                </p>
                                <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <HelpCircle size={10} className="text-rose-600" />
                                    <span className="text-[9px] text-slate-400 italic">Confirmed malicious tunneling fingerprints.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-10">
                            <div className="enterprise-card p-8 rounded-[2.5rem]">
                                <div className="flex items-center gap-3 mb-8">
                                    <span className="w-1.5 h-6 bg-indigo-600 rounded-full shadow-sm"></span>
                                    <h3 className="text-xl font-bold tracking-tight text-slate-900">Temporal Flow Data</h3>
                                </div>
                                <TrafficChart data={data?.volumeTrend} />
                            </div>
                            <TerminalConsole logs={logs} />
                        </div>
                        <div className="space-y-10">
                            <div className="enterprise-card p-8 rounded-[2.5rem]">
                                <h3 className="text-slate-900 text-lg font-bold mb-6 flex items-center justify-between">
                                    <span className="flex items-center font-bold tracking-tight">
                                        <span className="w-1.5 h-4 bg-emerald-500 rounded-full mr-3 shadow-[0_0_10px_rgba(16,185,129,0.3)]"></span>
                                        Distribution Logic
                                    </span>
                                </h3>
                                <Charts data={data} />
                                <div className="mt-8 p-4 bg-slate-100/50 rounded-2xl border border-slate-200/50">
                                    <p className="text-[10px] text-slate-600 leading-relaxed font-medium italic">
                                        "Visualizing query categorization across the analyzed dataset. This highlights the ratio of legitimate traffic to detected lexical anomalies."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* DOCUMENTATION TAB */}
            {activeTab === 'docs' && (
                <EngineDocs />
            )}

            {/* ANALYSIS TAB */}
            {activeTab === 'analysis' && (
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div className="mb-10">
                        <div className="enterprise-card p-10 rounded-[2.5rem] mb-12 flex items-center gap-10 bg-white border border-slate-200 shadow-lg relative">
                            <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100 shadow-sm relative z-10">
                                <BrainCircuit className="w-10 h-10 text-indigo-600" />
                            </div>
                            <div className="relative z-10 max-w-3xl">
                                <h2 className="text-3xl font-bold tracking-tighter mb-4 text-slate-900">Advanced Lexical Modeling</h2>
                                <p className="text-slate-600 leading-relaxed font-medium">
                                    Our engine dynamically maps Shanon Entropy scores against character frequency maps. This allows the system to differentiate between human-generated randomized subdomains and machine-automated data exfiltration payloads.
                                </p>
                            </div>
                        </div>
                        <AnomalyCharts results={anomalies} />
                    </div>
                </div>
            )}

            {/* INCIDENTS TAB */}
            {activeTab === 'incidents' && (
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <header className="mb-10 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Threat Intelligence Feeds</h2>
                            <p className="text-slate-500 text-sm">Real-time identification of cryptographic and structural breaches.</p>
                        </div>
                        <div className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                            <span className="text-rose-500 text-xs font-bold tracking-widest uppercase animate-pulse">Live Detection Active</span>
                        </div>
                    </header>
                    <div className="enterprise-card rounded-3xl p-2 bg-[#020617] border-slate-800/60 overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]">
                        <ThreatTable data={anomalies} />
                    </div>
                </div>
            )}

            {/* TRAFFIC TAB */}
            {activeTab === 'traffic' && (
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div className="mb-12">
                        <div className="enterprise-card p-10 rounded-[2.5rem] mb-12 flex items-center gap-10 border-slate-800/40">
                            <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100 shadow-sm">
                                <Database className="w-10 h-10 text-indigo-600" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold tracking-tighter mb-3">Enterprise Traffic Inspector</h2>
                                <p className="text-slate-400 text-base leading-relaxed font-medium max-w-4xl">
                                    Auditing full packet telemetry across the DNS protocol layer. This view provides the raw foundational data for our behavioral scoring engine, allowing for manual verification of automated alerts.
                                </p>
                            </div>
                        </div>
                        <div className="enterprise-card rounded-3xl p-2 bg-[#020617] border-slate-800/60 overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
                            <PacketLogTable data={allQueries} />
                        </div>
                    </div>
                </div>
            )}

            {/* ENTROPY TAB */}
            {activeTab === 'entropy' && (
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div className="mb-12">
                        <div className="enterprise-card p-10 rounded-[2.5rem] mb-12 flex items-center gap-10 bg-white border border-slate-200">
                            <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100 shadow-sm cursor-help transition-all hover:scale-105">
                                <BrainCircuit className="w-10 h-10 text-indigo-600" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold tracking-tighter mb-3 text-slate-900">Entropy Payload Intelligence</h2>
                                <p className="text-slate-500 text-base leading-relaxed font-medium max-w-4xl">
                                    Deep packet inspection module focused on the Shannon Entropy of subdomains. High entropy scores (randomness) are directly correlated with encrypted C2 channels and data exfiltration payloads.
                                </p>
                            </div>
                        </div>
                        <div className="enterprise-card rounded-3xl p-4 bg-white border border-slate-200 overflow-hidden shadow-lg">
                            <EntropyTable data={allQueries} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
