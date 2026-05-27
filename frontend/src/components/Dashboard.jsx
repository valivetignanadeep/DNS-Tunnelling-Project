import React, { useState, useEffect } from "react";
import Charts from "./Charts";
import ThreatTable from "./ThreatTable";
import AnomalyCharts from "./AnomalyCharts";
import TrafficChart from "./WaveChart";
import TerminalConsole from "./TerminalConsole";
import PacketLogTable from "./PacketLogTable";
import EngineDocs from "./EngineDocs";
import EntropyTable from "./EntropyTable";
import LiveExplainCard from "./LiveExplainCard";
import { ShieldCheck, Activity, ShieldAlert, Skull, BrainCircuit, Database, Download, HelpCircle, ArrowUpRight, Cpu } from "lucide-react";

// Dynamic API Base URL resolver for Vercel/Local dual-routing
const getApiUrl = (endpoint) => {
  const base = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:5000'
    : '';
  return `${base}${endpoint}`;
};

const Dashboard = ({ results, setResults, activeTab, detectionMode, isMonitorOpen, setIsMonitorOpen }) => {
    const [selectedThreat, setSelectedThreat] = useState(null);
    const [isDemoSimActive, setIsDemoSimActive] = useState(false);

    useEffect(() => {
        if (detectionMode !== 'live' || !setResults) return;

        let isMounted = true;
        let simInterval = null;

        // Realistic client IPs
        const clientIPs = ["192.168.1.42", "192.168.1.105", "192.168.1.112", "192.168.1.101"];
        
        // Common safe domains
        const safeDomains = [
            "google.com", "github.com", "vercel.app", "reddit.com", "aws.amazon.com",
            "fonts.googleapis.com", "api.github.com", "stackoverflow.com",
            "slack.com", "medium.com", "microsoft.com", "wikipedia.org"
        ];

        // Threat signatures
        const threatDomains = [
            "v1.exfil.data.081bc7e4f8a.tunnel.net",
            "a3f9e8b2c1d9.c2server.attacker.com",
            "dns-auth.99283f982bc71.hack-tunnel.xyz",
            "w9a8s7d6f5g4.command.cnc-hub.biz"
        ];

        const startFrontendSimulation = () => {
            if (!isMounted) return;
            setIsDemoSimActive(true);

            // Initialize base data if empty
            setResults(prev => {
                if (prev && prev.totalQueries > 0) return prev;
                return {
                    totalQueries: 48,
                    suspicious: 1,
                    threats: 0,
                    pps: 6.2,
                    totalBytes: 4240,
                    activeClientIPs: 3,
                    adapterName: "Vercel-Serverless-SimNode",
                    volumeTrend: [{ time: "00:00:00", traffic: 48 }],
                    results: [],
                    allQueries: [],
                    logs: ["[✓] Initialized serverless live simulation runtime"],
                    distribution: { critical: 0, high: 1, medium: 0 }
                };
            });

            // Start simulation loop
            simInterval = setInterval(() => {
                if (!isMounted) return;

                setResults(prev => {
                    const newQueriesCount = Math.floor(Math.random() * 4) + 2; // 2 to 5 queries
                    const newTotalQueries = prev.totalQueries + newQueriesCount;
                    const newPPS = parseFloat((3.5 + Math.random() * 8.5).toFixed(1));
                    const newBytes = prev.totalBytes + (newQueriesCount * (Math.floor(Math.random() * 80) + 40));
                    
                    let newSuspicious = prev.suspicious;
                    let newThreats = prev.threats;
                    const currentResults = [...prev.results];
                    const currentAllQueries = [...prev.allQueries];
                    const currentLogs = [...prev.logs];
                    const currentDistribution = { ...prev.distribution };

                    // 15% chance to generate a suspicious packet
                    const isSuspiciousTick = Math.random() < 0.15;
                    
                    for (let i = 0; i < newQueriesCount; i++) {
                        const timestamp = Math.floor(Date.now() / 1000);
                        const srcIp = clientIPs[Math.floor(Math.random() * clientIPs.length)];
                        
                        if (isSuspiciousTick && i === 0) {
                            // Malicious DNS Tunneling Packet
                            const domain = threatDomains[Math.floor(Math.random() * threatDomains.length)];
                            const entropy = parseFloat((4.5 + Math.random() * 1.5).toFixed(2));
                            const size = Math.floor(Math.random() * 60) + 90; // 90 to 150 bytes
                            const risk = Math.floor(Math.random() * 20) + 75; // 75% to 95%
                            
                            newSuspicious += 1;
                            const isCritical = risk >= 85;
                            if (isCritical) {
                                newThreats += 1;
                                currentDistribution.critical += 1;
                            } else {
                                currentDistribution.high += 1;
                            }

                            const anomalyObj = {
                                timestamp,
                                src_ip: srcIp,
                                domain,
                                risk_score: risk,
                                reasons: entropy > 5.2 ? "High Entropy, Unusual Length" : "High Entropy",
                                entropy,
                                length: domain.length,
                                frequency: prev.suspicious * 4 + 1,
                                threat_type: isCritical ? "DNS Tunneling (Exfiltration)" : "C2 Tunneling Beacon"
                            };

                            // Add to anomalies list if unique
                            if (!currentResults.some(r => r.domain === domain)) {
                                currentResults.unshift(anomalyObj);
                            }

                            // Add to parsed queries
                            currentAllQueries.unshift({
                                timestamp,
                                src_ip: srcIp,
                                query: domain,
                                qtype: Math.random() > 0.5 ? "16" : "1", // TXT or A
                                size,
                                entropy
                            });

                            // Add log line
                            currentLogs.unshift(`[ALERT] ⚠ Tunneling signature flagged from ${srcIp} -> ${domain} (Entropy: ${entropy}, Risk: ${risk}%)`);

                        } else {
                            // Normal Packet
                            const domain = safeDomains[Math.floor(Math.random() * safeDomains.length)];
                            const entropy = parseFloat((2.0 + Math.random() * 1.3).toFixed(2));
                            const size = Math.floor(Math.random() * 40) + 40; // 40 to 80 bytes
                            
                            currentAllQueries.unshift({
                                timestamp,
                                src_ip: srcIp,
                                query: domain,
                                qtype: Math.random() > 0.8 ? "28" : "1", // AAAA or A
                                size,
                                entropy
                            });

                            if (Math.random() > 0.85) {
                                currentLogs.unshift(`[✓] Packet parsed: ${srcIp} -> ${domain} (Entropy: ${entropy}, Normal)`);
                            }
                        }
                    }

                    // Keep lists under control (limit to 40)
                    if (currentAllQueries.length > 40) currentAllQueries.length = 40;
                    if (currentResults.length > 20) currentResults.length = 20;
                    if (currentLogs.length > 30) currentLogs.length = 30;

                    // Update temporal trend chart (append or maintain rolling window of latest 10 items)
                    const currentTimeString = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
                    const newTrend = [...prev.volumeTrend, { time: currentTimeString, traffic: newQueriesCount * 3 }];
                    if (newTrend.length > 10) newTrend.shift();

                    return {
                        totalQueries: newTotalQueries,
                        suspicious: newSuspicious,
                        threats: newThreats,
                        pps: newPPS,
                        totalBytes: newBytes,
                        activeClientIPs: clientIPs.length,
                        adapterName: "Vercel-Serverless-SimNode",
                        volumeTrend: newTrend,
                        results: currentResults,
                        allQueries: currentAllQueries,
                        logs: currentLogs,
                        distribution: currentDistribution
                    };
                });
            }, 1500);
        };

        const fetchLiveStatus = async () => {
            try {
                const response = await fetch(getApiUrl('/api/live/status'));
                const data = await response.json();
                
                if (isMounted) {
                    if (data && data.environment === 'serverless') {
                        // Vercel serverless environment: run client simulation fallback
                        startFrontendSimulation();
                    } else {
                        // Real persistent python backend is running
                        setResults(data);
                        setIsDemoSimActive(false);
                    }
                }
            } catch (err) {
                console.warn("Backend server offline. Initiating live demo simulation in client...", err);
                startFrontendSimulation();
            }
        };

        fetchLiveStatus();
        const pollInterval = setInterval(() => {
            if (!isDemoSimActive) {
                fetchLiveStatus();
            }
        }, 1500);

        return () => {
            isMounted = false;
            clearInterval(pollInterval);
            if (simInterval) clearInterval(simInterval);
        };
    }, [detectionMode, setResults, isDemoSimActive]);

    const downloadCSV = () => {
        if (!results || !results.allQueries) return;

        const data = results.allQueries;
        const headers = ["Timestamp", "Source IP", "Domain", "Status", "Risk Score"];

        const csvRows = data.map(q => [
            new Date(q.timestamp * 1000).toLocaleString(),
            q.src_ip,
            q.domain || q.query,
            q.is_anomaly || q.entropy >= 4.5 ? "HIGH RISK" : "NORMAL",
            q.risk_score?.toFixed(2) || (q.entropy >= 4.5 ? "85.00" : "0.00")
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
                    <div className="w-16 h-16 border-4 border-teal-100 border-t-teal-600 rounded-2xl animate-spin shadow-[0_4px_12px_rgba(13,148,136,0.1)]"></div>
                    <p className="text-stone-400 font-mono text-xs uppercase tracking-widest animate-pulse">Synchronizing Intelligence Payload...</p>
                </div>
            </div>
        );
    }

    const data = results;
    const anomalies = results ? results.results : [];
    const logs = results ? results.logs : [];
    const allQueries = results ? results.allQueries : [];

    return (
        <div className="dashboard-container ml-72 p-6 md:p-10 bg-[#fdfbf7] min-h-screen text-stone-800 relative overflow-x-hidden">
            <div className="bg-mesh"></div>

            {isDemoSimActive && (
                <div className="mb-4 flex items-center gap-2.5 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl animate-bounce">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                    <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider font-mono">
                        Vercel Serverless Demo Mode Active: High-Fidelity Client Sniffer Streaming
                    </span>
                </div>
            )}

            <header className="mb-12 flex items-center justify-between relative z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-3 mb-1">
                        <span className="px-2 py-0.5 bg-teal-50 border border-teal-200 rounded text-[9px] font-bold text-teal-700 uppercase tracking-widest">Live Node</span>
                        <span className="text-stone-400 text-[10px] font-mono">ID: OPS-THREAT-2940</span>
                    </div>
                    <h1 className="text-4xl font-bold text-stone-900 tracking-tighter flex items-center gap-4">
                        <span className="p-2.5 bg-white rounded-2xl border border-stone-200 shadow-sm">
                            <ShieldCheck className="w-7 h-7 text-teal-600" />
                        </span>
                        Intelligence Dashboard
                        <span className="text-stone-300 mx-2 font-light">/</span>
                        <span className="text-teal-600 font-mono text-sm opacity-70 tracking-widest">{activeTab.toUpperCase()}</span>
                    </h1>
                </div>

                {data && (
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMonitorOpen(true)}
                            className="flex items-center gap-2 px-5 py-3 bg-teal-50 hover:bg-teal-100/80 border border-teal-200 text-teal-700 rounded-xl font-bold text-[11px] tracking-widest transition-all active:scale-95 shadow-sm"
                        >
                            <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                            LIVE PACKET SIDEBAR
                        </button>
                        <div className="h-10 w-px bg-stone-300"></div>
                        <button
                            onClick={downloadCSV}
                            className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-[11px] tracking-widest transition-all shadow-[0_4px_12px_rgba(13,148,136,0.25)] active:scale-95"
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
                                    <div className="p-2.5 bg-teal-50 rounded-xl border border-teal-100 shadow-sm">
                                        <Activity className="w-5 h-5 text-teal-600" />
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-stone-300 group-hover:text-teal-600 transition-colors" />
                                </div>
                                <h3 className="text-stone-500 text-[10px] font-bold mb-1 tracking-[0.25em] uppercase">Network Traffic Volume</h3>
                                <p className="text-5xl font-bold text-stone-900 tracking-tighter group-hover:text-teal-600 transition-all">
                                    {data?.totalQueries?.toLocaleString() || 0}
                                </p>
                                <div className="mt-4 flex items-center gap-2 opacity-100 transition-opacity duration-500">
                                    <HelpCircle size={10} className="text-teal-600 animate-pulse" />
                                    <span className="text-[9px] text-teal-600 font-mono font-bold">
                                        {detectionMode === 'live' ? `[THROUGHPUT: ${data?.pps || 0.0} PPS]` : "Total DNS packets parsed in the current session."}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Anomalies Card - White-on-white text fixed */}
                        <div className="enterprise-card p-8 rounded-[2rem] relative overflow-hidden group border-amber-500/20">
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20">
                                        <ShieldAlert className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div className="px-2 py-0.5 bg-amber-500/10 text-amber-600 text-[8px] font-bold rounded border border-amber-500/20">WARNING</div>
                                </div>
                                <h3 className="text-stone-500 text-[10px] font-bold mb-1 tracking-[0.25em] uppercase">Detected Anomalies</h3>
                                <p className="text-5xl font-bold text-amber-700 tracking-tighter group-hover:text-amber-500 transition-all">
                                    {data?.suspicious?.toLocaleString() || 0}
                                </p>
                                <div className="mt-4 flex items-center gap-2 opacity-100 transition-opacity duration-500">
                                    <HelpCircle size={10} className="text-amber-600 animate-pulse" />
                                    <span className="text-[9px] text-amber-600 font-mono font-bold">
                                        {detectionMode === 'live' ? `[ACTIVE SOURCE IPS: ${data?.activeClientIPs || 0}]` : "Deviations from normal entropy/structure baseline."}
                                    </span>
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
                                <h3 className="text-stone-500 text-[10px] font-bold mb-1 tracking-[0.25em] uppercase">Confirmed Threats</h3>
                                <p className="text-5xl font-bold text-stone-900 tracking-tighter group-hover:text-rose-600 transition-all">
                                    {data?.threats?.toLocaleString() || 0}
                                </p>
                                <div className="mt-4 flex items-center gap-2 opacity-100 transition-opacity duration-500">
                                    <HelpCircle size={10} className="text-rose-600 animate-pulse" />
                                    <span className="text-[9px] text-rose-600 font-mono font-bold">
                                        {detectionMode === 'live' ? `[ADAPTER: ${data?.adapterName || 'Simulation'}]` : "Confirmed malicious tunneling fingerprints."}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-10">
                            <div className="enterprise-card p-8 rounded-[2.5rem]">
                                <div className="flex items-center gap-3 mb-8">
                                    <span className="w-1.5 h-6 bg-teal-600 rounded-full shadow-sm"></span>
                                    <h3 className="text-xl font-bold tracking-tight text-stone-900">Temporal Flow Data</h3>
                                </div>
                                <TrafficChart data={data?.volumeTrend} />
                            </div>
                            <TerminalConsole logs={logs} />
                        </div>
                        <div className="space-y-10">
                            <div className="enterprise-card p-8 rounded-[2.5rem]">
                                <h3 className="text-stone-900 text-lg font-bold mb-6 flex items-center justify-between">
                                    <span className="flex items-center font-bold tracking-tight">
                                        <span className="w-1.5 h-4 bg-emerald-500 rounded-full mr-3 shadow-[0_0_10px_rgba(16,185,129,0.3)]"></span>
                                        Distribution Logic
                                    </span>
                                </h3>
                                <Charts data={data} />
                                <div className="mt-8 p-4 bg-stone-100 rounded-2xl border border-stone-200/50">
                                    <p className="text-[10px] text-stone-600 leading-relaxed font-medium italic">
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
                        <div className="enterprise-card p-10 rounded-[2.5rem] mb-12 flex items-center gap-10 bg-white border border-stone-200 shadow-sm relative">
                            <div className="p-5 bg-teal-50 rounded-2xl border border-teal-100 shadow-sm relative z-10">
                                <BrainCircuit className="w-10 h-10 text-teal-600" />
                            </div>
                            <div className="relative z-10 max-w-3xl">
                                <h2 className="text-3xl font-bold tracking-tighter mb-4 text-stone-900">Advanced Lexical Modeling</h2>
                                <p className="text-stone-600 leading-relaxed font-medium">
                                    Our engine dynamically maps Shannon Entropy scores against character frequency maps. This allows the system to differentiate between human-generated randomized subdomains and machine-automated data exfiltration payloads.
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
                            <p className="text-stone-500 text-sm">Real-time identification of cryptographic and structural breaches.</p>
                        </div>
                        <div className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                            <span className="text-rose-500 text-xs font-bold tracking-widest uppercase animate-pulse">Detection Active</span>
                        </div>
                    </header>
                    <div className="human-card rounded-3xl p-4 bg-white border-stone-200 overflow-hidden shadow-lg">
                        <ThreatTable data={anomalies} onRowClick={(threat) => setSelectedThreat(threat)} />
                    </div>
                </div>
            )}

            {/* TRAFFIC TAB */}
            {activeTab === 'traffic' && (
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div className="mb-12">
                        <div className="enterprise-card p-10 rounded-[2.5rem] mb-12 flex items-center gap-10 border-stone-200">
                            <div className="p-5 bg-teal-50 rounded-2xl border border-teal-100 shadow-sm">
                                <Database className="w-10 h-10 text-teal-600" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold tracking-tighter mb-3">Enterprise Traffic Inspector</h2>
                                <p className="text-stone-500 text-base leading-relaxed font-medium max-w-4xl">
                                    Auditing full packet telemetry across the DNS protocol layer. This view provides the raw foundational data for our behavioral scoring engine, allowing for manual verification of automated alerts.
                                </p>
                            </div>
                        </div>
                        <div className="human-card rounded-3xl p-4 bg-white border border-stone-200 overflow-hidden shadow-lg">
                            <PacketLogTable data={allQueries} />
                        </div>
                    </div>
                </div>
            )}

            {/* ENTROPY TAB */}
            {activeTab === 'entropy' && (
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div className="mb-12">
                        <div className="enterprise-card p-10 rounded-[2.5rem] mb-12 flex items-center gap-10 bg-white border border-stone-200">
                            <div className="p-5 bg-teal-50 rounded-2xl border border-teal-100 shadow-sm cursor-help transition-all hover:scale-105">
                                <BrainCircuit className="w-10 h-10 text-teal-600" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold tracking-tighter mb-3 text-stone-900">Entropy Payload Intelligence</h2>
                                <p className="text-stone-500 text-base leading-relaxed font-medium max-w-4xl">
                                    Deep packet inspection module focused on the Shannon Entropy of subdomains. High entropy scores (randomness) are directly correlated with encrypted C2 channels and data exfiltration payloads.
                                </p>
                            </div>
                        </div>
                        <div className="enterprise-card rounded-3xl p-4 bg-white border border-stone-200 overflow-hidden shadow-lg">
                            <EntropyTable data={allQueries} />
                        </div>
                    </div>
                </div>
            )}
            {selectedThreat && (
                <LiveExplainCard threat={selectedThreat} onClose={() => setSelectedThreat(null)} />
            )}
        </div>
    );
};

export default Dashboard;
