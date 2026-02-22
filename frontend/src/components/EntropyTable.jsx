import React from "react";
import { BrainCircuit, Info } from 'lucide-react';

const EntropyTable = ({ data }) => {
    // Classification Logic
    const getClassification = (entropy) => {
        if (entropy >= 4.5) return { label: "HIGH", color: "bg-rose-50 text-rose-700 border-rose-100", desc: "Likely Encrypted/Tunneling" };
        if (entropy >= 3.0) return { label: "AVG", color: "bg-amber-50 text-amber-700 border-amber-100", desc: "Structural Density" };
        return { label: "LOW", color: "bg-indigo-50 text-indigo-700 border-indigo-100", desc: "Natural Language Pattern" };
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 overflow-hidden shadow-md">
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
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Threshold: H(x) &gt; 4.5</span>
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
                                const classification = getClassification(row.entropy);
                                return (
                                    <tr key={index} className="hover:bg-slate-50 transition-colors group">
                                        <td className="py-4 font-mono text-[11px] text-slate-600 pl-2">{row.src_ip}</td>
                                        <td className="py-4">
                                            <span className="text-slate-900 font-bold text-xs font-mono break-all">{row.domain}</span>
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
