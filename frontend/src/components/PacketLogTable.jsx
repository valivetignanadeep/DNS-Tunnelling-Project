import React from 'react';
import { Database, ShieldCheck, AlertCircle, Info, ShieldAlert, Cpu } from 'lucide-react';

const getClassificationDetails = (classification, entropy, qtype, size) => {
    // If classification is already provided in the packet object, use it. Otherwise, compute it.
    const cls = classification || (
        entropy >= 4.8 || (entropy >= 4.2 && qtype === '16' && size > 110) ? "CRITICAL" :
        entropy >= 4.2 ? "HIGH RISK" :
        entropy >= 3.5 || qtype === '16' ? "SUSPICIOUS" :
        entropy >= 2.8 ? "LOW RISK" : "CLEAN"
    );

    switch (cls) {
        case "CRITICAL":
            return {
                label: "CRITICAL THREAT",
                color: "bg-rose-500/10 text-rose-600 border-rose-500/25",
                icon: ShieldAlert
            };
        case "HIGH RISK":
            return {
                label: "HIGH RISK",
                color: "bg-orange-500/10 text-orange-600 border-orange-500/25",
                icon: AlertCircle
            };
        case "SUSPICIOUS":
            return {
                label: "SUSPICIOUS",
                color: "bg-amber-500/10 text-amber-600 border-amber-500/25",
                icon: AlertCircle
            };
        case "LOW RISK":
            return {
                label: "LOW RISK",
                color: "bg-sky-500/10 text-sky-600 border-sky-500/25",
                icon: Info
            };
        default:
            return {
                label: "CLEAN",
                color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/25",
                icon: ShieldCheck
            };
    }
};

const PacketLogTable = ({ data }) => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 overflow-hidden shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center justify-between">
                <div className="flex items-center">
                    <span className="w-1.5 h-6 bg-teal-600 rounded-full mr-4 shadow-sm"></span>
                    Raw Packet Transmission Console Log
                </div>
                <span className="text-[10px] font-mono text-slate-500 tracking-wider bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                    {data?.length || 0} TOTAL PACKETS IN BUFFER
                </span>
            </h3>

            <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-white border-b border-slate-200 z-10">
                        <tr>
                            <th className="pb-4 pt-2 text-slate-400 font-mono text-[10px] uppercase tracking-widest pl-2">TIMESTAMP</th>
                            <th className="pb-4 pt-2 text-slate-400 font-mono text-[10px] uppercase tracking-widest">SRC_IP</th>
                            <th className="pb-4 pt-2 text-slate-400 font-mono text-[10px] uppercase tracking-widest">DOMAIN_QUERY</th>
                            <th className="pb-4 pt-2 text-slate-400 font-mono text-[10px] uppercase tracking-widest text-center">CLASSIFICATION</th>
                            <th className="pb-4 pt-2 text-slate-400 font-mono text-[10px] uppercase tracking-widest text-center">TYPE</th>
                            <th className="pb-4 pt-2 text-slate-400 font-mono text-[10px] uppercase tracking-widest text-center">SIZE</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data && data.length > 0 ? (
                            data.map((row, index) => {
                                const cls = getClassificationDetails(row.classification, row.entropy, row.qtype, row.size);
                                const Icon = cls.icon;
                                return (
                                    <tr key={index} className="hover:bg-slate-50 transition-colors group">
                                        <td className="py-3 font-mono text-[11px] text-slate-600 pl-2">
                                            {row?.timestamp ? new Date(row.timestamp * 1000).toLocaleTimeString([], { hour12: false, fractionalSecondDigits: 3 }) : '00:00:00.000'}
                                        </td>
                                        <td className="py-3 font-mono text-xs text-teal-700 font-bold">{row.src_ip}</td>
                                        <td className="py-3">
                                            <span className="text-slate-900 font-mono text-xs font-semibold select-all break-all">{row.query || row.domain}</span>
                                        </td>
                                        <td className="py-3 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${cls.color}`}>
                                                <Icon size={10} className="shrink-0" />
                                                {cls.label}
                                            </span>
                                        </td>
                                        <td className="py-3 text-center">
                                            <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] text-stone-600 border border-stone-200 font-black">
                                                {row.qtype === '1' ? 'A' : row.qtype === '28' ? 'AAAA' : row.qtype === '16' ? 'TXT' : row.qtype === '5' ? 'CNAME' : row.qtype}
                                            </span>
                                        </td>
                                        <td className="py-3 text-center font-mono text-xs text-slate-500">{row.size}B</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" className="py-12 text-center">
                                    <div className="flex flex-col items-center opacity-30">
                                        <Database className="w-12 h-12 mb-3 text-slate-400" />
                                        <span className="text-slate-500 text-xs font-mono uppercase tracking-widest">Database records empty</span>
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

export default PacketLogTable;
