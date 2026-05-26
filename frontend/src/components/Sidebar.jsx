import React, { useState } from 'react';
import { LayoutDashboard, FileText, Activity, Settings, Database, ShieldAlert, BookOpen, Info, BrainCircuit, Wifi, Play, Square } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, onReset, detectionMode, setDetectionMode }) => {
    const [liveActive, setLiveActive] = useState(true);

    const toggleLive = async () => {
        const nextState = !liveActive;
        setLiveActive(nextState);
        try {
            await fetch(`http://127.0.0.1:5000/api/live/${nextState ? 'start' : 'stop'}`, { method: 'POST' });
        } catch (err) {
            console.error("Failed to toggle live sniffer:", err);
        }
    };
    const menuItems = [
        { id: 'overview', label: 'Security Overview', icon: LayoutDashboard },
        { id: 'analysis', label: 'Lexical Analysis', icon: Activity },
        { id: 'entropy', label: 'Entropy Matrix', icon: BrainCircuit },
        { id: 'incidents', label: 'Threat Intelligence', icon: ShieldAlert },
        { id: 'traffic', label: 'Network Inspector', icon: Database },
        { id: 'docs', label: 'Engine Documentation', icon: BookOpen },
    ];

    return (
        <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0 z-50 shadow-[4px_0_12px_rgba(0,0,0,0.03)]">
            {/* Enterprise Brand Header */}
            <div className="h-20 flex items-center px-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg transform rotate-3 shadow-[0_4px_8px_rgba(67,56,202,0.2)]"></div>
                        <div className="absolute inset-0 w-8 h-8 border border-white/40 rounded-lg -rotate-3 transition-transform group-hover:rotate-0"></div>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-900 tracking-widest text-[11px] leading-tight">
                            NET-GUARD<span className="text-indigo-600">.OPS</span>
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono tracking-tighter uppercase font-medium">Executive Security Hub</span>
                    </div>
                </div>
            </div>

            {/* Navigation Modules */}
            <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                <div className="px-3 mb-6 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Deployment Tier</span>
                    <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-[8px] border border-indigo-100 rounded uppercase font-bold">Pro</span>
                </div>

                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 group
                            ${activeTab === item.id
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm'
                                : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50/80'
                            }
                        `}
                    >
                        <item.icon size={18} className={`mr-4 transition-all duration-300 ${activeTab === item.id ? 'text-indigo-600' : 'opacity-50 group-hover:opacity-100'}`} />
                        <span className="text-[11px] font-semibold tracking-wide">{item.label}</span>
                        {activeTab === item.id && (
                            <div className="ml-auto w-1 h-1 bg-indigo-600 rounded-full shadow-[0_0_6px_rgba(79,70,229,0.5)]"></div>
                        )}
                    </button>
                ))}
            </nav>

            {/* System Status & Actions */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/30 backdrop-blur-sm space-y-4">
                {detectionMode === 'live' ? (
                    <div className="glass-card rounded-xl p-4 border-slate-200 shadow-sm bg-white">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className={`flex h-2.5 w-2.5 relative`}>
                                    {liveActive ? (
                                        <>
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                        </>
                                    ) : (
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-slate-300"></span>
                                    )}
                                </span>
                                <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                                    {liveActive ? "Live Sniffer: ON" : "Live Sniffer: PAUSED"}
                                </span>
                            </div>
                            <button
                                onClick={toggleLive}
                                className={`p-1.5 rounded-lg border transition-all ${
                                    liveActive 
                                        ? 'bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-100' 
                                        : 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100'
                                }`}
                                title={liveActive ? "Pause Sniffer" : "Resume Sniffer"}
                            >
                                {liveActive ? <Square size={10} fill="currentColor" /> : <Play size={10} fill="currentColor" />}
                            </button>
                        </div>
                        <div className="flex flex-col gap-1 text-[9px] font-mono text-slate-400 border-t border-slate-100 pt-2">
                            <div className="flex justify-between">
                                <span>Engine status:</span>
                                <span className="text-indigo-600 font-bold">MONITORING</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Source:</span>
                                <span className="text-slate-600 uppercase font-bold">Local DNS (Port 53)</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="glass-card rounded-xl p-4 border-slate-200 shadow-sm bg-white">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">STATIC AUDIT MODE</span>
                        </div>
                        <p className="text-[9px] text-slate-400 font-mono leading-relaxed">
                            Analyzing historical PCAP logs. Exit dashboard to initialize live networks.
                        </p>
                    </div>
                )}

                <div className="glass-card rounded-xl p-4 border-slate-200 shadow-sm bg-white">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-1.5 bg-emerald-50 rounded-lg">
                            <Info size={12} className="text-emerald-600" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">System Pulse</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <span className="text-[9px] text-slate-400 font-mono uppercase">Node Primary</span>
                        <span className="text-[9px] text-emerald-600 font-bold font-mono">STABLE | v1.2.0</span>
                    </div>
                    <div className="mt-2 h-1 bg-slate-200 rounded-full overflow-hidden">
                        <div className="w-[85%] h-full bg-emerald-600/80"></div>
                    </div>
                </div>

                <button
                    onClick={onReset}
                    className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-bold uppercase tracking-widest border border-red-100 transition-all rounded-xl shadow-sm"
                >
                    Clear Analytics Session
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
