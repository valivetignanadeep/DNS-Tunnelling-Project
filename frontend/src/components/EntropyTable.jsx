import React from "react";
import { BrainCircuit, Info, ShieldCheck, AlertCircle, ShieldAlert, Heart } from 'lucide-react';

const getClassificationDetails = (entropy, qtype, size) => {
    if (entropy >= 4.8 || (entropy >= 4.2 && qtype === '16' && size > 110)) {
        return { 
            label: "CRITICAL THREAT", 
            color: "bg-rose-50 text-rose-700 border-rose-100", 
            desc: "Encrypted Data Exfiltration (Iodine/C2)" 
        };
    }
    if (entropy >= 4.2) {
        return { 
            label: "HIGH RISK", 
            color: "bg-orange-50 text-orange-700 border-orange-100", 
            desc: "Command & Control (C2) Heartbeat Beacon" 
        };
    }
    if (entropy >= 3.5 || qtype === '16') {
        return { 
            label: "SUSPICIOUS", 
            color: "bg-amber-50 text-amber-700 border-amber-100", 
            desc: "Subdomain Discovery Recon / Telemetry Probe" 
        };
    }
    if (entropy >= 2.8) {
        return { 
            label: "LOW RISK", 
            color: "bg-sky-50 text-sky-700 border-sky-100", 
            desc: "Typical Dynamic Content CDN DNS resolution" 
        };
    }
    return { 
        label: "CLEAN", 
        color: "bg-emerald-50 text-emerald-700 border-emerald-100", 
        desc: "Natural English / Legitimate structural domain" 
    };
};

const EntropyTable = ({ data }) => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 overflow-hidden shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <BrainCircuit className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Entropy Intelligence Matrix</h3>
                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-0.5">Shannon Randomness Analysis</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full">
                    <Info size={12} className="text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Threshold: H(x) &gt; 4.2</span>
                </div>
            </header>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="border-b border-slate-100">
                        <tr>
                            <th className="pb-4 pt-2 text-slate-400 font-mono text-[10px] uppercase tracking-widest pl-2">Source Node</th>
                            <th className="pb-4 pt-2 text-slate-400 font-mono text-[10px] uppercase tracking-widest">Target Payload (Subdomain)</th>
                            <th className="pb-4 pt-2 text-slate-400 font-mono text-[10px] uppercase tracking-widest text-center">Score (H)</th>
                            <th className="pb-4 pt-2 text-slate-400 font-mono text-[10px] uppercase tracking-widest text-center">Classification</th>
                            <th className="pb-4 pt-2 text-slate-400 font-mono text-[10px] uppercase tracking-widest text-right pr-2">Behavioral Insight</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {data && data.length > 0 ? (
                            data.map((row, index) => {
                                const classification = getClassificationDetails(row.entropy, row.qtype, row.size);
                                return (
                                    <tr key={index} className="hover:bg-slate-50 transition-colors group">
                                        <td className="py-4 font-mono text-[11px] text-slate-600 pl-2">{row.src_ip}</td>
                                        <td className="py-4">
                                            <span className="text-slate-900 font-bold text-xs font-mono break-all">{row.query || row.domain}</span>
                                        </td>
                                        <td className="py-4 text-center">
                                            <span className="font-mono text-xs font-bold text-indigo-600">{row.entropy}</span>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex justify-center">
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-black border tracking-widest ${classification.color}`}>
                                                    {classification.label}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-right pr-2">
                                            <span className="text-[10px] text-slate-400 font-medium italic">
                                                {classification.desc}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-12 text-center text-slate-400 text-xs font-mono italic">
                                    Awaiting telemetry stream ingest...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EntropyTable;
