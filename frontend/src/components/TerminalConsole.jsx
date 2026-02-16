import React, { useEffect, useState } from 'react';
import { Terminal, ChevronRight } from 'lucide-react';

const TerminalConsole = ({ logs }) => {
    const [displayedLogs, setDisplayedLogs] = useState([]);

    useEffect(() => {
        if (!logs) return;

        let index = 0;
        setDisplayedLogs([]);

        const interval = setInterval(() => {
            if (index < logs.length) {
                setDisplayedLogs((prev) => [...prev, logs[index]]);
                index++;
            } else {
                clearInterval(interval);
            }
        }, 400);

        return () => clearInterval(interval);
    }, [logs]);

    return (
        <div className="bg-[#050b14] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden font-mono text-[11px]">
            <div className="bg-[#0f172a] px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-blue-500" />
                    <span className="text-slate-400 font-bold tracking-widest uppercase">Engine.Console</span>
                </div>
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
                </div>
            </div>
            <div className="p-4 h-[200px] overflow-y-auto space-y-1.5 custom-scrollbar">
                {displayedLogs.map((log, i) => (
                    <div key={i} className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                        <span className="text-blue-500/50">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                        <ChevronRight size={12} className="text-slate-600 mt-0.5" />
                        <span className={`${log?.includes('Critical') ? 'text-rose-400' :
                            log?.includes('Anomalies') ? 'text-amber-400' :
                                'text-slate-300'
                            }`}>
                            {log || ''}
                        </span>
                    </div>
                ))}
                {displayedLogs.length > 0 && logs && displayedLogs.length === logs.length && (
                    <div className="flex gap-2 text-emerald-500 font-bold mt-2 animate-pulse">
                        <span>{'>'}</span>
                        <span>PROCESS_COMPLETE: READY FOR NEXT SEQUENCE</span>
                    </div>
                )}
                {(!logs || logs.length === 0) && (
                    <div className="text-slate-600 italic">
                        Waiting for data upload...
                    </div>
                )}
            </div>
        </div>
    );
};

export default TerminalConsole;
