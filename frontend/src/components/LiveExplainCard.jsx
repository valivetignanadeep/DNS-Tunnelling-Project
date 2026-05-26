import React from 'react';
import { X, ShieldAlert, Cpu, Lock, HelpCircle, HardDrive } from 'lucide-react';

const LiveExplainCard = ({ threat, onClose }) => {
    if (!threat) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-white border-l border-slate-200 shadow-[[-10px_0_30px_rgba(0,0,0,0.05)]] z-[100] flex flex-col animate-in slide-in-from-right duration-500">
            {/* Header */}
            <div className="h-20 border-b border-slate-100 flex items-center justify-between px-8 bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-100 shadow-sm animate-pulse">
                        <ShieldAlert className="w-5 h-5 text-rose-600" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em]">Threat Intelligence Decoder</span>
                        <span className="text-sm font-black text-slate-800 tracking-tight font-mono">INCIDENT_SIG_{Math.floor(threat.timestamp % 100000)}</span>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Content Scroll Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                
                {/* Visual Overview */}
                <div className="enterprise-card p-6 rounded-3xl bg-[#020617] text-white border-slate-800 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 opacity-10 text-indigo-500">
                        <Cpu className="w-full h-full" />
                    </div>
                    
                    <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[8px] font-black rounded uppercase tracking-wider mb-3 inline-block">
                        {threat.threat_type || "Behavioral Threat Pattern"}
                    </span>
                    <h3 className="text-xl font-bold text-white tracking-tight mb-2 leading-snug">
                        {threat.domain}
                    </h3>
                    <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                        <div>
                            <span>Client IP: </span>
                            <span className="text-indigo-400 font-bold">{threat.src_ip}</span>
                        </div>
                        <div>
                            <span>Threat Score: </span>
                            <span className="text-rose-400 font-bold">{threat.risk_score}%</span>
                        </div>
                    </div>
                </div>

                {/* Heuristic Matrix */}
                <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Cpu size={12} className="text-indigo-600" />
                        Lexical Profile Baseline
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                            <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Shannon Entropy</span>
                            <span className="text-xl font-mono font-bold text-slate-800">{threat.entropy}</span>
                            <span className="text-[8px] text-slate-500 uppercase block mt-1">Randomness rating</span>
                        </div>
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                            <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Subdomain Depth</span>
                            <span className="text-xl font-mono font-bold text-slate-800">{threat.length} chars</span>
                            <span className="text-[8px] text-slate-500 uppercase block mt-1">Payload size</span>
                        </div>
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                            <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Audit Hits</span>
                            <span className="text-xl font-mono font-bold text-slate-800">{threat.frequency} pps</span>
                            <span className="text-[8px] text-slate-500 uppercase block mt-1">Query density</span>
                        </div>
                    </div>
                </div>

                {/* Threat Explanation Card */}
                <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <HelpCircle size={12} className="text-rose-500" />
                        Attack Description
                    </h4>
                    <div className="p-6 bg-rose-500/5 border border-rose-500/10 rounded-2.5xl space-y-3">
                        <p className="text-slate-700 text-xs font-semibold leading-relaxed">
                            {threat.description || "The hostname is highly randomized and excessively long, matching patterns of automated system scripts."}
                        </p>
                        <div className="bg-rose-500/10 h-px w-full my-2"></div>
                        <h5 className="text-[9px] font-bold text-rose-600 uppercase tracking-wider">How it is harmful to the system:</h5>
                        <p className="text-slate-600 text-xs leading-relaxed">
                            {threat.harm_explanation || "Bypasses firewalls by masquerading as standard DNS updates to transfer malicious payloads or command outputs."}
                        </p>
                    </div>
                </div>

                {/* Incident Mitigation Protocol */}
                <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Lock size={12} className="text-indigo-600" />
                        Remediation Protocols
                    </h4>
                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2.5xl text-slate-300 font-mono text-[10px] space-y-3">
                        <div className="flex items-start gap-2">
                            <span className="text-indigo-400">[ACTION-1]</span>
                            <span>Isolate client IP <span className="text-white font-bold">{threat.src_ip}</span> instantly from active subnets to limit further propagation.</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-indigo-400">[ACTION-2]</span>
                            <span>Deploy automated Sinkholing for parent domain to block DNS exfiltration channels.</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-indigo-400">[ACTION-3]</span>
                            <span>Configure internal gateway rate-limiting on recursive resolvers.</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="h-20 border-t border-slate-100 flex items-center justify-end px-8 bg-slate-50/50 gap-4">
                <button
                    onClick={onClose}
                    className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all"
                >
                    Dismiss Alert
                </button>
                <button
                    onClick={() => {
                        alert(`Mitigation protocol executed successfully. Node ${threat.src_ip} is blacklisted in network logs.`);
                        onClose();
                    }}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_4px_12px_rgba(67,56,202,0.2)]"
                >
                    Mitigate Threat Now
                </button>
            </div>
        </div>
    );
};

export default LiveExplainCard;
