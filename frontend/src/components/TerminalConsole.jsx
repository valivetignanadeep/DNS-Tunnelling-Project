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
        <div className="enterprise-card h-[400px] flex flex-col overflow-hidden bg-white border border-slate-200 shadow-md">
            {/* Console Header */}
            <div className="h-12 bg-slate-50 border-b border-slate-200 px-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Terminal size={14} className="text-indigo-600" />
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-[0.2em]">Detection Trace Logs</span>
                </div>
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
                </div>
            </div>
            {/* Log Stream */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3 font-mono text-[11px] custom-scrollbar bg-white">
                {(!logs || logs.length === 0) && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 opacity-50">
                        <Cpu className="w-8 h-8 animate-pulse" />
                        <span className="uppercase tracking-[0.3em] text-[9px] font-bold">Awaiting Stream Initialization...</span>
                    </div>
                )}
                {displayedLogs.map((log, i) => (
                    <div key={i} className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                        <span className="text-slate-400">[{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}]</span>
                        <ChevronRight size={12} className="text-slate-600 mt-0.5" />
                        <span className={`${log?.includes('Critical') ? 'text-rose-500' :
                            log?.includes('Anomalies') ? 'text-amber-500' :
                                'text-slate-700'
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
