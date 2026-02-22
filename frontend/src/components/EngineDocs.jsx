import React from 'react';
import { BrainCircuit, Activity, Hash, Layers, ShieldCheck, Zap } from 'lucide-react';

const EngineDocs = () => {
    const sections = [
        {
            title: "Shannon Entropy Model",
            icon: BrainCircuit,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            description: "Measures the mathematical randomness and information density within a domain string. Legitimate domains follow natural language patterns, while data-tunneling subdomains exhibit high entropy due to encrypted or encoded payloads.",
            math: "H(X) = -Σ p(x) log₂ p(x)",
            logic: "High score (>4.5) indicates non-human character distribution, highly correlated with C2 (Command & Control) traffic."
        },
        {
            title: "Lexical Structural Analysis",
            icon: Hash,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            description: "Analyses the structural attributes of DNS queries, including subdomain depth, character diversity, and total string length. This identifies patterns that deviate from standard RFC-compliant DNS behavior.",
            math: "f(x) = { length(x) > 50 ∪ depth(x) > 3 }",
            logic: "Flags queries that attempt to maximize data throughput by bypass standard query limits."
        },
        {
            title: "Frequency Burst Detection",
            icon: Activity,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            description: "Monitors the temporal density of queries from unique source IPs. It detects 'heartbeat' patterns or high-volume data exfiltration bursts that are characteristic of automated tunneling software.",
            math: "Rate = Σ queries / Δt",
            logic: "Identifies automated scanners and persistent exfiltration channels that bypass traditional firewall rules."
        }
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-blue-600/10 rounded-2xl border border-blue-500/20">
                        <Layers className="w-8 h-8 text-blue-500" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Detection Methodology</h2>
                        <p className="text-slate-400 text-sm font-medium">Technical documentation for the NET-GUARD Intelligence Engine</p>
                    </div>
                </div>
                <p className="text-slate-600 leading-relaxed max-w-4xl text-base">
                    The NET-GUARD engine utilizes a multi-layered behavioral analysis model to identify hidden DNS tunnels. Unlike traditional signature-based systems, our engine analyzes the underlying mathematical properties of network traffic to detect threats in real-time.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {sections.map((section, idx) => (
                    <div key={idx} className="enterprise-card p-8 rounded-3xl relative group overflow-hidden">
                        <div className={`w-14 h-14 ${section.bg} rounded-2xl flex items-center justify-center mb-8 border border-white/5`}>
                            <section.icon className={`w-7 h-7 ${section.color}`} />
                        </div>
                        <h3 className="text-xl font-bold mb-4 group-hover:text-blue-400 transition-colors">{section.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6 h-24">
                            {section.description}
                        </p>

                        <div className="space-y-4 pt-6 border-t border-slate-800/50">
                            <div>
                                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-2">Mathematical Basis</span>
                                <code className="text-xs text-blue-400 font-mono bg-blue-500/5 px-2 py-1 rounded">{section.math}</code>
                            </div>
                            <div>
                                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-2">Inference Logic</span>
                                <p className="text-[11px] text-slate-500 italic leading-relaxed">{section.logic}</p>
                            </div>
                        </div>

                        {/* Aesthetic background element */}
                        <div className={`absolute -bottom-10 -right-10 w-32 h-32 ${section.bg} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
                    </div>
                ))}
            </div>

            <div className="enterprise-card p-8 rounded-3xl bg-mesh border-slate-800/40 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <ShieldCheck className="text-emerald-500 w-5 h-5" />
                            <span className="text-emerald-500 text-xs font-bold uppercase tracking-[0.2em]">Deployment Readiness</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-4 tracking-tight text-white">Advanced Scoring Heuristics</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            The resulting Risk Score is a composite weight of all active models. A score above 75% indicates a confirmed threat, triggering immediate detection isolation protocols within the dashboard.
                        </p>
                        <div className="flex gap-4">
                            <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 flex flex-col">
                                <span className="text-lg font-bold text-white">75%</span>
                                <span className="text-[9px] text-slate-500 uppercase font-bold">Threat Threshold</span>
                            </div>
                            <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 flex flex-col">
                                <span className="text-lg font-bold text-white">100ms</span>
                                <span className="text-[9px] text-slate-500 uppercase font-bold">Inference Speed</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-64 animate-float">
                        <div className="relative w-48 h-48 mx-auto">
                            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full animate-spin [animation-duration:8s]"></div>
                            <div className="absolute inset-4 border-4 border-emerald-500/20 rounded-full animate-spin-reverse [animation-duration:6s]"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Zap className="w-12 h-12 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EngineDocs;
