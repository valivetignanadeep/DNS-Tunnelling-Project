import React from 'react';
import { Database } from 'lucide-react';

const PacketLogTable = ({ data }) => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 overflow-hidden shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center justify-between">
                <div className="flex items-center">
                    <span className="w-1.5 h-6 bg-indigo-600 rounded-full mr-4 shadow-sm"></span>
                    Raw Transmission Logs
                </div>
                <span className="text-[10px] font-mono text-slate-500 tracking-wider bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                    {data?.length || 0} TOTAL PACKETS
                </span>
            </h3>

            <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-white border-b border-slate-200 z-10">
                        <tr>
                            <th className="pb-4 pt-2 text-slate-400 font-mono text-[10px] uppercase tracking-widest pl-2">TIMESTAMP</th>
                            <th className="pb-4 pt-2 text-slate-400 font-mono text-[10px] uppercase tracking-widest">SRC_IP</th>
                            <th className="pb-4 pt-2 text-slate-400 font-mono text-[10px] uppercase tracking-widest">DOMAIN_QUERY</th>
                            <th className="pb-4 pt-2 text-slate-400 font-mono text-[10px] uppercase tracking-widest text-center">TYPE</th>
                            <th className="pb-4 pt-2 text-slate-400 font-mono text-[10px] uppercase tracking-widest text-center">SIZE</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data && data.length > 0 ? (
                            data.map((row, index) => (
                                <tr key={index} className="hover:bg-slate-50 transition-colors group">
                                    <td className="py-3 font-mono text-[11px] text-slate-600 pl-2">
                                        {row?.timestamp ? new Date(row.timestamp * 1000).toLocaleTimeString([], { hour12: false, fractionalSecondDigits: 3 }) : '00:00:00.000'}
                                    </td>
                                    <td className="py-3 font-mono text-xs text-indigo-700 font-bold">{row.src_ip}</td>
                                    <td className="py-3">
                                        <span className="text-slate-900 text-xs font-medium">{row.query}</span>
                                    </td>
                                    <td className="py-3 text-center">
                                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] text-slate-600 border border-slate-200 font-bold">
                                            {row.qtype === '1' ? 'A' : row.qtype === '28' ? 'AAAA' : row.qtype === '16' ? 'TXT' : row.qtype}
                                        </span>
                                    </td>
                                    <td className="py-3 text-center font-mono text-xs text-slate-500">{row.size}B</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-12 text-center">
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
