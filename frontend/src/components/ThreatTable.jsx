import React from "react";
import { ShieldCheck } from 'lucide-react';

const ThreatTable = ({ data }) => {
    return (
        <div className="glass-card p-6 rounded-2xl border border-slate-800/50 overflow-hidden shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center justify-between">
                <div className="flex items-center">
                    <span className="w-1.5 h-6 bg-rose-500 rounded-full mr-4 shadow-[0_0_10px_rgba(244,63,94,0.5)]"></span>
                    Security Incident Log
                </div>
                <span className="text-[10px] font-mono text-slate-500 tracking-wider bg-slate-900 px-3 py-1 rounded-full border border-white/5">
                    {data?.length || 0} DETECTIONS
                </span>
            </h3>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-800/50">
                            <th className="pb-4 pt-2 text-slate-500 font-mono text-[10px] uppercase tracking-widest pl-2">SRC_IP</th>
                            <th className="pb-4 pt-2 text-slate-500 font-mono text-[10px] uppercase tracking-widest">DOMAIN_PATTERN</th>
                            <th className="pb-4 pt-2 text-slate-500 font-mono text-[10px] uppercase tracking-widest text-center">ENTROPY</th>
                            <th className="pb-4 pt-2 text-slate-500 font-mono text-[10px] uppercase tracking-widest text-center">LEN</th>
                            <th className="pb-4 pt-2 text-slate-500 font-mono text-[10px] uppercase tracking-widest text-center">FREQ</th>
                            <th className="pb-4 pt-2 text-slate-500 font-mono text-[10px] uppercase tracking-widest text-center">RISK</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/20">
                        {data && data.length > 0 ? (
                            data.map((row, index) => (
                                <tr key={index} className="hover:bg-blue-500/[0.02] transition-colors group">
                                    <td className="py-4 font-mono text-sm text-blue-400 pl-2">{row.src_ip}</td>
                                    <td className="py-4">
                                        <div className="flex flex-col">
                                            <span className="text-slate-200 font-medium text-sm mb-1">{row.domain}</span>
                                            <span className="text-[10px] text-slate-500 italic uppercase tracking-tight">{row.reasons}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-center font-mono text-xs text-slate-400">{row.entropy}</td>
                                    <td className="py-4 text-center font-mono text-xs text-slate-400">{row.length}</td>
                                    <td className="py-4 text-center font-mono text-xs text-slate-400">{row.frequency}</td>
                                    <td className="py-4 text-center">
                                        <div className="flex justify-center">
                                            <span className={`min-w-[45px] px-2 py-1 rounded text-[10px] font-bold border ${row.risk_score >= 80 ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                                    row.risk_score >= 40 ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                        'bg-sky-500/10 text-sky-500 border-sky-500/20'
                                                }`}>
                                                {row.risk_score}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="py-12 text-center">
                                    <div className="flex flex-col items-center opacity-30">
                                        <ShieldCheck className="w-12 h-12 mb-3 text-emerald-500" />
                                        <span className="text-slate-400 text-xs font-mono uppercase tracking-widest">No active threats detected in cluster</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ThreatTable;
